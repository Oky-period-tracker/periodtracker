# CMS Feature Flags

## Overview

Some CMS features are built but not live yet. Each one sits behind a feature flag: an environment variable read by the CMS when it starts. A feature is **disabled unless its flag is set to `true`**.

| Variable                 | Default | Feature                                                              |
| ------------------------ | ------- | -------------------------------------------------------------------- |
| `FEATURE_VOICE_OVER`     | `false` | Audio recordings attached to encyclopedia articles                   |
| `FEATURE_CONTENT_FILTER` | `false` | Content filter level on articles, quizzes, surveys and did you knows |

The two flags are independent. Age restriction is a separate feature and is not affected by either of them.

---

## Enabling or disabling a feature

1. Set the variable in the CMS environment.

   Local / docker-compose, in `packages/cms/.env`:

   ```env
   FEATURE_VOICE_OVER=true
   FEATURE_CONTENT_FILTER=true
   ```

   Kubernetes, in your `cms.yaml`:

   ```yaml
   - name: FEATURE_VOICE_OVER
     value: 'true'
   - name: FEATURE_CONTENT_FILTER
     value: 'true'
   ```

2. Restart the CMS. The flags are read once at startup, so a change only applies after a restart.

To disable a feature again, set the variable to `false` (or remove it) and restart.

Only the exact value `true` enables a feature. Anything else (`1`, `yes`, `TRUE`, an empty value) leaves it disabled.

---

## What a disabled feature does

No data is deleted when a feature is disabled. Voice over files stay in storage and content filter levels stay in the database; they are hidden and ignored until the flag is turned back on.

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

### Mobile app

The app has no flag of its own. It only shows the audio player for an article that has a `voiceOverKey`, and the CMS does not send one while the feature is disabled. Turning a flag on or off therefore needs no new app build; the app picks up the change the next time it refreshes its content from the CMS.

---

## How it works

| File                            | Role                                                                                |
| ------------------------------- | ----------------------------------------------------------------------------------- |
| `src/env.ts`                    | Reads the variables into `env.features`                                             |
| `src/middleware/featureFlag.ts` | `requireFeature(name)`: answers `404` on the routes of a disabled feature           |
| `src/helpers/features.ts`       | `withoutDisabledFeatures(items)`: removes disabled feature data from mobile content |
| `src/index.ts`                  | Guards the endpoints and exposes `features` to every view (`app.locals`)            |
| `src/views/*.ejs`               | Check `features.voiceOver` / `features.contentFilter` before rendering              |

On the Quiz, Survey and Did you know pages the "Filter" cells stay in the page, empty and hidden, because the page scripts address table columns by position.

Tests: `__tests__/features/featureFlags.test.ts`.

### Adding a flag

1. Add the variable to `features` in `src/env.ts` and to `.env.dist`.
2. Guard the feature's endpoints with `requireFeature('<name>')` in `src/index.ts`.
3. Wrap its markup and scripts in `<% if (features.<name>) { %> ... <% } %>`.
4. If the feature adds fields to the content sent to the app, clear them in `withoutDisabledFeatures`.
5. Document it in this file.
