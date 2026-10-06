# CMS Feature Flags

## Overview

Some CMS features are built but not live yet. Each one sits behind a feature flag: an environment variable read by the CMS when it starts. A feature is **disabled unless its flag is set to `true`**.

| Variable                         | Default | Feature                                                                          |
| -------------------------------- | ------- | -------------------------------------------------------------------------------- |
| `FEATURE_VOICE_OVER`             | `false` | Audio recordings attached to encyclopedia articles                               |
| `FEATURE_CONTENT_FILTER`         | `false` | Content filter level on articles, quizzes, surveys and did you knows             |
| `FEATURE_AGE_RESTRICTION_LEVELS` | `false` | Age restriction as a minimum age per item, on encyclopedia articles among others |

The flags are independent of each other.

---

## Enabling or disabling a feature

1. Set the variable in the CMS environment.

   Local / docker-compose, in `packages/cms/.env`:

   ```env
   FEATURE_VOICE_OVER=true
   FEATURE_CONTENT_FILTER=true
   FEATURE_AGE_RESTRICTION_LEVELS=true
   ```

   Kubernetes, in your `cms.yaml`:

   ```yaml
   - name: FEATURE_VOICE_OVER
     value: 'true'
   - name: FEATURE_CONTENT_FILTER
     value: 'true'
   - name: FEATURE_AGE_RESTRICTION_LEVELS
     value: 'true'
   ```

2. Restart the CMS. The flags are read once at startup, so a change only applies after a restart.

To disable a feature again, set the variable to `false` (or remove it) and restart.

Only the exact value `true` enables a feature. Anything else (`1`, `yes`, `TRUE`, an empty value) leaves it disabled.

---

## What a disabled feature does

No data is deleted when a feature is disabled. Voice over files stay in storage, content filter and age restriction levels stay in the database; they are hidden and ignored until the flag is turned back on.

### Voice over (`FEATURE_VOICE_OVER`)

| Area          | While disabled                                                                                     |
| ------------- | -------------------------------------------------------------------------------------------------- |
| CMS pages     | The "Voice Over" column is removed from the Encyclopedia and Subcategory pages                     |
| CMS endpoints | `/api/voice-over/*` (get, upload, remove) answer `404`                                             |
| Mobile app    | `/mobile/articles/:lang` sends `voiceOverKey: null` for every article, so no audio player is shown |

Enabling voice over also needs Firebase storage to be configured (`STORAGE_BUCKET`, `STORAGE_BASE_URL`), see [Voice Over](../../docs/setup.md#voice-over-optional) in the setup guide.

### Content filter (`FEATURE_CONTENT_FILTER`)

| Area          | While disabled                                                                                                          |
| ------------- | ----------------------------------------------------------------------------------------------------------------------- |
| CMS pages     | The "Filter" column is hidden on the Encyclopedia, Quiz, Survey and Did you know pages, and in the article modal        |
| CMS endpoints | `/api/content-filter` answers `404`. Creating or editing an article ignores any `contentFilter` value sent with it      |
| Mobile app    | The `/mobile` articles, quizzes, did you knows and surveys endpoints send `contentFilter: 0` (no filter) for every item |

The filter levels offered in the CMS come from `contentFilterOptions` in `@oky/core`. Without them, the only level is "All".

### Age restriction levels (`FEATURE_AGE_RESTRICTION_LEVELS`)

Age restriction exists in two forms. The original one is a single "Age Restricted" toggle on quizzes, surveys and did you knows: a restricted item is hidden from users younger than 15. The newer one replaces the toggle with one level per item (a minimum age, 0 meaning no restriction), and adds it to encyclopedia articles. This flag switches between the two. The toggle itself is always available and is not affected by the flag.

| Area          | While disabled                                                                                                                                                                                                             |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CMS pages     | The Quiz, Survey and Did you know pages show the single "Age Restricted" toggle instead of one column per level. The Encyclopedia page and the article modal show no age restriction at all                                |
| CMS endpoints | `/api/age-restriction` (the level radios) answers `404`. Creating or editing an article ignores any `ageRestrictionLevel` sent with it; the quiz, survey and did you know endpoints keep accepting `isAgeRestricted`       |
| Mobile app    | The `/mobile` articles, quizzes, did you knows and surveys endpoints send `ageRestrictionLevel: 0` for every item, and articles are sent with `isAgeRestricted: false`. Quizzes, surveys and did you knows keep their flag |

The levels offered in the CMS come from `ageRestrictionOptions` in `@oky/core` (the `packages/core/src/common` submodule). Without them, the only level is "All", which is the same as no restriction: define the options before enabling the flag.

The toggle and the level share the same database columns: setting a level other than "All" turns the toggle on, and "All" turns it off. Turning the flag off after levels were set therefore keeps the matching toggles on.

### Mobile app

The app has no flag of its own. It only shows the audio player for an article that has a `voiceOverKey`, and the CMS does not send one while the feature is disabled. Turning a flag on or off therefore needs no new app build; the app picks up the change the next time it refreshes its content from the CMS.

---

## How it works

| File                            | Role                                                                                    |
| ------------------------------- | --------------------------------------------------------------------------------------- |
| `src/env.ts`                    | Reads the variables into `env.features`                                                 |
| `src/middleware/featureFlag.ts` | `requireFeature(name)`: answers `404` on the routes of a disabled feature               |
| `src/helpers/features.ts`       | `withoutDisabledFeatures(items)`: removes disabled feature data from mobile content     |
| `src/index.ts`                  | Guards the endpoints and exposes `features` to every view (`app.locals`)                |
| `src/views/*.ejs`               | Check `features.voiceOver` / `features.contentFilter` / `features.ageRestrictionLevels` |

On the Quiz, Survey and Did you know pages the "Filter" cells stay in the page, empty and hidden, because the page scripts address table columns by position.

Tests: `__tests__/features/featureFlags.test.ts`.

### Adding a flag

1. Add the variable to `features` in `src/env.ts` and to `.env.dist`.
2. Guard the feature's endpoints with `requireFeature('<name>')` in `src/index.ts`.
3. Wrap its markup and scripts in `<% if (features.<name>) { %> ... <% } %>`.
4. If the feature adds fields to the content sent to the app, clear them in `withoutDisabledFeatures`.
5. Document it in this file.
