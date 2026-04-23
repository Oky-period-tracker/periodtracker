# CMS Logging, Monitoring & Error Handling

## Overview

Structured logging, request monitoring, slow query detection, and defensive error handling have been added across the entire CMS backend.

---

## Logging Infrastructure

### Centralized Logger (`src/logger.ts`)

A JSON-structured logger with support for multiple output targets:

- **Console output** — always enabled
- **File output** — optional, configured via `LOG_FILE_PATH`
- **Log levels** — `debug`, `info`, `warn`, `error` (controlled via `LOG_LEVEL`)
- **Format** — JSON with ISO timestamps, level, message, and metadata

```ts
import { logger } from './logger'

logger.info('User created', { userId: '123', lang: 'en' })
logger.error('Operation failed', { message: err.message, stack: err.stack })
```

### Environment Configuration

Added to `.env.dist` and `src/env.ts`:

| Variable | Default | Description |
|---|---|---|
| `LOG_LEVEL` | `info` | Minimum log level (`debug`, `info`, `warn`, `error`) |
| `LOG_FILE_PATH` | _(none)_ | Optional file path for log output |
| `SLOW_QUERY_THRESHOLD` | `1000` | DB query duration (ms) to trigger a warning |
| `SLOW_REQUEST_THRESHOLD` | `3000` | HTTP request duration (ms) to trigger a warning |

---

## Middleware

### Request Logger (`src/middleware/requestLogger.ts`)

Logs every incoming HTTP request and its response:

- **Incoming** — method, URL, IP address
- **Completed** — status code, duration in ms
- **Slow requests** — warns when duration exceeds `SLOW_REQUEST_THRESHOLD`

```
→ POST /api/article 192.168.1.1
← POST /api/article 200 45ms
```

### Error Logger (`src/middleware/errorLogger.ts`)

Catches unhandled errors in the Express pipeline:

- Logs full error message and stack trace
- Passes error to the next handler (does not swallow it)

### Slow Query Logger (`src/middleware/slowQueryLogger.ts`)

Custom TypeORM logger implementation:

- Logs all query errors with the failing SQL
- Warns on queries exceeding `SLOW_QUERY_THRESHOLD`
- Logs schema builds and migrations at debug level

Configured in `ormconfig.ts`:

```ts
maxQueryExecutionTime: env.logging.slowQueryThreshold,
logger: new SlowQueryLogger(),
```

---

## Error Handling Patterns

### Null Check on `findOne` Results

Every controller method that calls `repository.findOne()` and then accesses properties on the result now checks for null first. This prevents `TypeError: Cannot read property 'x' of undefined` crashes.

**Before:**
```ts
const item = await this.repository.findOne(id)
item.title = request.body.title  // crashes if item is null
```

**After:**
```ts
const item = await this.repository.findOne(id)
if (!item) {
  logger.warn('Item not found for update', { id })
  response.status(404).send({ error: 'Item not found' })
  return
}
item.title = request.body.title
```

### Try/Catch on All Mutating Operations

All `save`, `update`, `remove`, and other write operations are wrapped in try/catch:

```ts
async save(request, response, next) {
  try {
    // ... operation
    logger.info('Item created', { id })
    return item
  } catch (error) {
    logger.error('Controller.save failed', {
      message: error?.message,
      stack: error?.stack
    })
    throw error
  }
}
```

### Firebase Notification Error Handling

`NotificationController.firebaseSend()` was changed from fire-and-forget `.then()/.catch()` to proper `async/await` with error propagation:

**Before:**
```ts
admin.messaging().send(message)
  .then((response) => console.log('Successfully sent message:', response))
  .catch((error) => console.log('Error sending message:', error))
```

**After:**
```ts
try {
  const response = await admin.messaging().send(message)
  logger.info('Firebase notification sent', { messageId: response, topic })
} catch (error) {
  logger.error('Firebase notification failed', { topic, message: error?.message })
  throw error
}
```

---

## Controllers Updated

All 20 CMS controllers received logging and error handling:

| Controller | Logging | Null Checks | Try/Catch | Notes |
|---|---|---|---|---|
| `AccessController` | ✅ | — | ✅ | Login/logout events |
| `ArticleController` | ✅ | ✅ | ✅ | CRUD operations |
| `ArticleVoiceOverController` | ✅ | ✅ | ✅ | Firebase storage upload/delete |
| `UserController` | ✅ | ✅ | ✅ | Permission checks logged |
| `NotificationController` | ✅ | ✅ | ✅ | Firebase push notifications |
| `CategoryController` | ✅ | ✅ | ✅ | Cascade delete counts logged |
| `SubcategoryController` | ✅ | ✅ | ✅ | Cascade delete counts logged |
| `QuizController` | ✅ | ✅ | ✅ | |
| `DidYouKnowController` | ✅ | ✅ | ✅ | |
| `VideoController` | ✅ | ✅ | ✅ | |
| `SurveyController` | ✅ | ✅ | ✅ | Question management guarded |
| `SuggestionController` | ✅ | ✅ | ✅ | |
| `AboutController` | ✅ | ✅ | ✅ | |
| `AboutBannerController` | ✅ | ✅ | ✅ | |
| `TermsAndConditionsController` | ✅ | ✅ | ✅ | |
| `PrivacyPolicyController` | ✅ | ✅ | ✅ | |
| `AnalyticsController` | ✅ | — | ✅ | |
| `AvatarMessageController` | ✅ | ✅ | ✅ | |
| `HelpCenterController` | ✅ | ✅ | ✅ | |
| `HelpCenterAttributeController` | ✅ | ✅ | ✅ | |
| `AgeRestrictionController` | ✅ | ✅ | ✅ | |
| `ContentFilterController` | ✅ | ✅ | ✅ | |
| `DataController` | ✅ | — | ✅ | Content generation/upload |
| `RenderController` | ✅ | — | ✅ | Analytics rendering |

### Authentication (`src/access/authentication.ts`)

- Login success/failure logging with username
- `deserializeUser` wrapped in try/catch
- Access attempt logging in `isLoggedIn` middleware

---

## What Gets Logged

### Info Level
- Successful create / update / delete operations
- Firebase notification sends
- Server startup with port number
- Content file generation and uploads
- Login / logout events

### Warn Level
- Entity not found (404 scenarios)
- Slow HTTP requests (> threshold)
- Slow DB queries (> threshold)
- Failed login attempts

### Error Level
- All caught exceptions with stack traces
- Firebase notification failures
- Database query errors
- Server startup failures

---

## Additional Fixes

- **Hardcoded port**: `app.listen(5000)` changed to `app.listen(env.api.port || 5000)`
- **Console.log removal**: All `console.log` / `console.error` replaced with structured `logger` calls

---

## Files Created

| File | Purpose |
|---|---|
| `src/logger.ts` | Centralized structured logger |
| `src/middleware/requestLogger.ts` | HTTP request/response logging |
| `src/middleware/errorLogger.ts` | Unhandled error logging |
| `src/middleware/slowQueryLogger.ts` | TypeORM slow query detection |

## Files Modified

| File | Change |
|---|---|
| `src/env.ts` | Added `logging` config block |
| `src/index.ts` | Integrated middleware, dynamic port |
| `ormconfig.ts` | Added SlowQueryLogger, maxQueryExecutionTime |
| `.env.dist` | Added logging environment variables |
| `src/access/authentication.ts` | Login/auth logging |
| All 20 controllers | Logger import, try/catch, null checks |
