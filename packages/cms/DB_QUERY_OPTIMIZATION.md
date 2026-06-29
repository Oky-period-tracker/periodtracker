# Database Query Optimization

## Overview

This document describes the database query optimizations applied to the CMS backend to improve performance, fix correctness issues, and reduce query execution time.

---

## 1. Database Indexes

Indexes are defined directly on the TypeORM entities using `@Index()` decorators
(see `src/entity/`). There is no standalone SQL migration file — the index
definitions live with the entity classes and are the single source of truth.

### Entity-Level Index Decorators

The following `@Index()` decorators exist in the entity classes:

| Entity (file) | Index name | Columns | Purpose |
|---------------|-----------|---------|---------|
| Article (`Article.ts`) | `idx_article_lang` | (lang) | Filter by language |
| Article | `idx_article_lang_live` | (lang, live) | Filter by language + live status |
| Article | `idx_article_category` | (category) | JOIN with category table |
| Article | `idx_article_subcategory` | (subcategory) | JOIN with subcategory table |
| Article | `idx_article_sorting` | (lang, sortingKey) | Ordered listings |
| Category (`Category.ts`) | `idx_category_lang` | (lang) | Filter by language |
| Category | `idx_category_sorting` | (lang, sortingKey) | Ordered listings |
| Subcategory (`Subcategory.ts`) | `idx_subcategory_lang` | (lang) | Filter by language |
| Subcategory | `idx_subcategory_parent` | (parent_category) | Filter by parent |
| Subcategory | `idx_subcategory_sorting` | (lang, sortingKey) | Ordered listings |
| Quiz (`Quiz.ts`) | `idx_quiz_lang` | (lang) | Filter by language |
| Quiz | `idx_quiz_lang_live` | (lang, live) | Filter by language + live status |
| DidYouKnow (`DidYouKnow.ts`) | `idx_did_you_know_lang` | (lang) | Filter by language |
| DidYouKnow | `idx_did_you_know_lang_live` | (lang, live) | Filter by language + live status |
| Survey (`Survey.ts`) | `idx_survey_lang` | (lang) | Filter by language |
| Survey | `idx_survey_lang_live` | (lang, live) | Filter by language + live status |
| Survey | `idx_survey_lang_live_date` | (lang, live, date_created) | Mobile survey queries |
| Question (`Question.ts`) | `idx_question_survey_id` | (surveyId) | FK JOIN with survey |
| HelpCenter (`HelpCenter.ts`) | `idx_help_center_region` | (region) | Filter by region |
| HelpCenterAttribute (`HelpCenterAttribute.ts`) | `idx_help_center_attribute_lang` | (lang) | Filter by language |
| Video (`Video.ts`) | `idx_video_lang` | (lang) | Filter by language |
| Video | `idx_video_lang_live` | (lang, live) | Filter by language + live status |
| Video | `idx_video_sorting` | (lang, sortingKey) | Ordered listings |
| Notification (`Notification.ts`) | `idx_notification_lang` | (lang) | Filter by language |
| About (`About.ts`) | `idx_about_lang` | (lang) | Filter by language |
| TermsAndConditions (`TermsAndConditions.ts`) | `idx_terms_and_conditions_lang` | (lang) | Filter by language |
| PrivacyPolicy (`PrivacyPolicy.ts`) | `idx_privacy_policy_lang` | (lang) | Filter by language |

> Note: Some entities (e.g. `User`, `Analytics`, `AvatarMessages`) currently
> carry no `@Index()` decorators.

### How indexes are created

These indexes are created by TypeORM only when schema synchronization is
enabled. Synchronization is controlled by the `DATABASE_SYNCHRONIZE` environment
variable (read in `src/env.ts` and passed to `ormconfig.ts` as
`env.db.synchronize`). The default in `.env.dist` is
`DATABASE_SYNCHRONIZE=false`, so indexes are **not** auto-created by default.
To have TypeORM apply the entity indexes against the database, set
`DATABASE_SYNCHRONIZE=true` (typically only in a controlled environment), or
create the indexes manually to match the decorators above.

---

## 2. N+1 Query Fixes

### Problem

Three controllers loaded **all** rows matching a language, then picked the last element in JavaScript:

```typescript
// BEFORE: Fetches ALL rows, picks last in-memory
const allVersions = await repository.find({ where: { lang } })
const latest = allVersions[allVersions.length - 1]
```

### Fix

Changed to `findOne()` with `ORDER BY id DESC` — the database returns exactly 1 row:

```typescript
// AFTER: Single row from DB
const latest = await repository.findOne({
  where: { lang },
  order: { id: 'DESC' },
})
```

### Files Changed

| File | Method |
|------|--------|
| `AboutController.ts` | `mobileAboutByLanguage()` |
| `PrivacyPolicyController.ts` | `mobilePrivacyPolicyByLanguage()` |
| `TermsAndConditionsController.ts` | `mobileTermsAndConditionsByLanguage()` |
| `DataController.ts` | `generateContentTs()` — 3 instances (About, Privacy, Terms) |
| `DataController.ts` | `generateContentSheet()` — 3 instances (About, Privacy, Terms) |

---

## 3. Async/Await Correctness Fixes

### SurveyController — Fire-and-Forget Bug

`forEach(async ...)` does not await the promises, causing race conditions and silent failures.

```typescript
// BEFORE: Fire-and-forget — questions may not be saved before response
request.body.questions.forEach(async (question) => {
  await questionRepository.save(question)
})

// AFTER: All questions saved before proceeding
await Promise.all(request.body.questions.map(async (question) => {
  await questionRepository.save(question)
}))
```

**Methods fixed:** `save()`, `update()` (questions + deletedQuestion)

### bulkUpdateRowReorder — Unresolved Promises

```typescript
// BEFORE: Returns array of unresolved promises
export const bulkUpdateRowReorder = (repository, data) => {
  return data.map(async (order) => {
    return await repository.update(...)
  })
}

// AFTER: Properly awaits all updates
export const bulkUpdateRowReorder = async (repository, data) => {
  await Promise.all(
    data.map((order) => repository.update(...))
  )
}
```

**Callers** (all already use `await`): ArticleController, CategoryController, SubcategoryController, VideoController, HelpCenterController

---

## 4. Query Parallelization

### DataController.generateContentTs()

8 sequential queries → 1 raw SQL + 7 parallel queries via `Promise.all()`.

### DataController.generateContentSheet()

Same optimization — 7 independent queries run in parallel.

### RenderController.renderAnalytics()

7 sequential `entityManager.query()` calls → single `Promise.all()`:
- `usersGender`, `usersLocations`, `usersAgeGroups`, `usersProvince`, `usersCountries`, `usersShares`, `directDownloads`

### RenderController — Other Methods

| Method | Queries Parallelized |
|--------|---------------------|
| `renderQuiz()` | quizzes + answeredQuizzes |
| `renderHelpCenter()` | helpCenters + helpCenterAttributes |
| `renderAbout()` | aboutVersions + aboutBannerItem |
| `renderSurvey()` | answeredSurveys + surveys |
| `renderEncyclopedia()` | articles + categories + subcategories |
| `renderCategoryManagement()` | categories + subcategories |
| `renderNotification()` | notifications + permanentNotifications |

---

## 5. Safe Data Parsing

### DataController.generateContentSheet()

`JSON.parse()` calls for About, PrivacyPolicy, and TermsAndConditions content were replaced with `safeJsonParse()` from `helpers/safeUtils.ts`. This prevents unhandled exceptions from malformed JSON and returns a fallback value instead.

```typescript
// BEFORE: Throws on invalid JSON
const parsed = JSON.parse(aboutContent)

// AFTER: Returns fallback on invalid JSON
const parsed = safeJsonParse(aboutContent, {}, 'About content')
```

---

## 6. Performance Impact Summary

| Optimization | Before | After | Impact |
|-------------|--------|-------|--------|
| N+1 latest version | Fetches N rows | Fetches 1 row | ~Nx reduction in data transfer |
| Missing indexes | Full table scans | Index seeks | Orders of magnitude faster on large tables |
| Sequential queries | Sum of all query times | Max of query times | ~2-7x faster for pages with multiple queries |
| Async/await fixes | Race conditions | Correct ordering | Data integrity + error propagation |

---

## 7. Applying the Indexes

There is no SQL migration file for these indexes. They are declared via
`@Index()` decorators on the entity classes (see Section 1).

Because the default configuration is `DATABASE_SYNCHRONIZE=false` (see
`.env.dist` and `src/env.ts`), TypeORM does **not** create these indexes
automatically on startup. To apply them you can either:

- Set `DATABASE_SYNCHRONIZE=true` in a controlled (non-production) environment
  so TypeORM synchronizes the schema and creates the indexes from the
  decorators, or
- Create the indexes manually in the database so they match the names and
  columns listed in Section 1.

## 8. Slow Query Logging

Queries that exceed the `SLOW_QUERY_THRESHOLD` environment variable (in
milliseconds, default `1000` per `.env.dist`) are logged so slow queries can be
identified and investigated.
