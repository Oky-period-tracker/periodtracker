# Database Query Optimization

## Overview

This document describes the database query optimizations applied to the CMS backend to improve performance, fix correctness issues, and reduce query execution time.

---

## 1. Database Indexes

### SQL Migration File

**File:** `sql/1742860800000-add-indexes.sql`

~40 indexes added across all tables. Key indexes:

| Table | Index | Columns | Purpose |
|-------|-------|---------|---------|
| article | `idx_article_lang_live` | (lang, live) | Filter by language + live status |
| article | `idx_article_sorting` | (lang, sortingKey) | Ordered listings |
| article | `idx_article_category` | (category) | JOIN with category table |
| article | `idx_article_subcategory` | (subcategory) | JOIN with subcategory table |
| category | `idx_category_sorting` | (lang, sortingKey) | Ordered listings |
| subcategory | `idx_subcategory_parent` | (parent_category) | Filter by parent |
| question | `idx_question_survey_id` | (surveyId) | FK JOIN with survey |
| survey | `idx_survey_lang_live_date` | (lang, live, date_created) | Mobile survey queries |
| oky_user | `idx_oky_user_country` | (country) | Analytics grouping |
| answered_surveys | `idx_answered_surveys_user_id` | (user_id) | User survey lookups |
| analytics | `idx_analytics_type_date` | (type, date_created) | Analytics filtering |

### Entity-Level Index Decorators

TypeORM `@Index()` decorators added to all 14 entities so indexes are created automatically via `synchronize: true`:

- **Article** — `(lang)`, `(lang, live)`, `(category)`, `(subcategory)`, `(lang, sortingKey)`
- **Category** — `(lang)`, `(lang, sortingKey)`
- **Subcategory** — `(lang)`, `(parent_category)`, `(lang, sortingKey)`
- **Quiz** — `(lang)`, `(lang, live)`
- **DidYouKnow** — `(lang)`, `(lang, live)`
- **Survey** — `(lang)`, `(lang, live)`, `(lang, live, date_created)`
- **Question** — `(surveyId)`
- **HelpCenter** — `(region)`
- **HelpCenterAttribute** — `(lang)`
- **Video** — `(lang)`, `(lang, live)`, `(lang, sortingKey)`
- **Notification** — `(lang)`
- **About** — `(lang)`
- **TermsAndConditions** — `(lang)`
- **PrivacyPolicy** — `(lang)`

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
| `renderNotification()` | notifications + users |

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

## 7. Applying the Index Migration

Run the SQL migration manually or via the database migration script:

```bash
psql -U <user> -d <database> -f sql/1742860800000-add-indexes.sql
```

Or, since `synchronize: true` is enabled, the entity-level `@Index()` decorators will auto-create indexes on next server startup.
