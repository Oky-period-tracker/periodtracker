# CMS Testing & Validation

## Overview

Comprehensive test suite validating all CMS improvements: functional API endpoints, crash resolution, stability improvements, and basic load testing. Tests use **Jest 29.7.0** with **supertest** for HTTP endpoint testing, running in a Node.js environment with `ts-jest` for TypeScript support.

---

## Test Structure

```
packages/cms/__tests__/
├── access/
│   └── authentication.test.ts         # Pre-existing — Passport auth logic
├── helmet.test.ts                     # Pre-existing — Security headers
├── health/
│   └── healthEndpoints.test.ts        # Health check API endpoints
├── monitoring/
│   ├── monitoringEndpoints.test.ts    # Monitoring API endpoints
│   └── monitoringService.test.ts      # MonitoringService unit tests
├── diagnostics/
│   └── diagnosticsEndpoints.test.ts   # Diagnostics API endpoints
├── crash/
│   ├── crashAnalysisService.test.ts   # CrashAnalysisService unit tests
│   ├── crashDetector.test.ts          # Crash detector middleware
│   └── errorLogger.test.ts            # Error logger middleware
├── stability/
│   ├── timeout.test.ts                # withTimeout() utility
│   ├── retry.test.ts                  # withRetry() utility
│   ├── safeUtils.test.ts              # safeJsonParse() and toError()
│   └── requestTimeout.test.ts         # Request timeout middleware
└── load/
    └── loadTest.test.ts               # Concurrent request load testing
```

---

## How to Run Tests

### Run All Tests

```bash
cd packages/cms
yarn test
```

This executes: `NODE_PATH=./src jest --forceExit --coverage --verbose --detectOpenHandles`

### Run Specific Test Suites

```bash
# Health check tests only
npx jest __tests__/health --verbose

# Monitoring tests only
npx jest __tests__/monitoring --verbose

# Diagnostics tests only
npx jest __tests__/diagnostics --verbose

# Crash resolution tests only
npx jest __tests__/crash --verbose

# Stability improvement tests only
npx jest __tests__/stability --verbose

# Load tests only
npx jest __tests__/load --verbose
```

### Run a Single Test File

```bash
npx jest __tests__/health/healthEndpoints.test.ts --verbose
```

### Run with Coverage

```bash
NODE_PATH=./src npx jest --forceExit --coverage --detectOpenHandles
```

### Run Tests Matching a Pattern

```bash
# All tests with "timeout" in the name
npx jest --testNamePattern="timeout" --verbose

# All tests related to crash
npx jest --testPathPattern="crash" --verbose
```

---

## Test Suites Explained

### 1. Health Check Endpoints (`__tests__/health/healthEndpoints.test.ts`)

**Purpose:** Validates the health check API that Docker, Kubernetes, and load balancers use to determine CMS availability.

**What it tests:**

| Test | Endpoint | Validates |
|------|----------|-----------|
| Returns 200 when healthy | `GET /health` | Full health check returns 200 with `status: "healthy"` when DB is up and latency is normal |
| Returns 200 when degraded | `GET /health` | Returns 200 with `status: "degraded"` when DB latency exceeds 1 second |
| Returns 503 when unhealthy | `GET /health` | Returns 503 with `status: "unhealthy"` when DB is down |
| Returns 503 when health check throws | `GET /health` | Graceful error handling — returns 503 instead of crashing |
| Always returns 200 with alive status | `GET /health/live` | Liveness probe always succeeds if process is running |
| Returns 200 when ready | `GET /health/ready` | Readiness probe succeeds when DB is connected and service is initialized |
| Returns 503 when not ready | `GET /health/ready` | Readiness probe fails when service not yet initialized or DB unreachable |

**Approach:** Creates a minimal Express app with `HealthController`, mocks `healthCheckService` to simulate different scenarios.

---

### 2. Monitoring Endpoints (`__tests__/monitoring/monitoringEndpoints.test.ts`)

**Purpose:** Validates the monitoring API used for service metrics, response time tracking, and slow route detection.

**What it tests:**

| Test | Endpoint | Validates |
|------|----------|-----------|
| Returns 200 when healthy | `GET /monitoring/health` | Health status with DB connectivity, memory, and CPU info |
| Returns 503 when unhealthy | `GET /monitoring/health` | Correct HTTP status for DB failures |
| Returns 503 when health check throws | `GET /monitoring/health` | Error handling for internal failures |
| Returns metrics overview | `GET /monitoring/metrics` | Request count, error rate, p50/p95/p99 response times |
| Returns 500 when metrics fail | `GET /monitoring/metrics` | Error handling for metrics calculation failures |
| Returns per-route metrics | `GET /monitoring/routes` | Per-route count, duration stats, status code breakdown |
| Returns slowest routes array | `GET /monitoring/slow-routes` | Top N routes sorted by average response time |

---

### 3. Monitoring Service (`__tests__/monitoring/monitoringService.test.ts`)

**Purpose:** Unit tests for the `MonitoringService` class — the core in-memory metrics engine.

**What it tests:**

| Test | Validates |
|------|-----------|
| Records and counts requests | `recordResponseTime()` correctly increments counters |
| Tracks error count for 5xx responses | Only 5xx responses counted as errors |
| Tracks status code distribution | Correct bucketing by HTTP status code |
| Calculates per-route metrics | Avg/min/max duration, count, status codes per route |
| Aggregates status codes per route | Status code counts tracked per individual route |
| Returns routes sorted by average duration | Slowest routes appear first |
| Respects the limit parameter | `getSlowestRoutes(N)` returns at most N results |
| Calculates p50, p95, p99 correctly | Percentile computation with 100-entry dataset |
| Returns correct uptime | Uptime calculated from service start time |
| Returns zero error rate when no requests | Edge case for empty metrics |
| Returns correct sample count | Sample count matches number of recorded entries |

---

### 4. Diagnostics Endpoints (`__tests__/diagnostics/diagnosticsEndpoints.test.ts`)

**Purpose:** Validates the crash diagnostics API used for exception analysis, memory monitoring, and timeout detection.

**What it tests:**

| Test | Endpoint | Validates |
|------|----------|-----------|
| Returns full crash report | `GET /diagnostics/report` | Summary, exceptions, memory, timeouts, system info |
| Returns 500 when report generation fails | `GET /diagnostics/report` | Error handling for report generation failures |
| Returns recent exceptions and top errors | `GET /diagnostics/exceptions` | Exception list with error grouping |
| Returns memory data with trend | `GET /diagnostics/memory` | Current memory, spikes, and trend (stable/growing/declining) |
| Returns timeout data with hotspots | `GET /diagnostics/timeouts` | Recent timeouts and route hotspot ranking |
| Returns failing and high-load endpoints | `GET /diagnostics/endpoints` | Failure rate analysis and load ranking |

---

### 5. Crash Analysis Service (`__tests__/crash/crashAnalysisService.test.ts`)

**Purpose:** Unit tests for the `CrashAnalysisService` — the core crash tracking engine that records exceptions, memory snapshots, timeouts, and endpoint health.

**What it tests:**

| Test | Category | Validates |
|------|----------|-----------|
| Records and retrieves exceptions | Exception Tracking | Exceptions stored with method, URL, message, status code, controller info |
| Groups exceptions by message in topErrors | Exception Tracking | Recurring errors counted and ranked by frequency |
| Returns exceptions in reverse chronological order | Exception Tracking | Most recent exceptions appear first |
| Respects the limit parameter | Exception Tracking | `getRecentExceptions(N)` caps output |
| Tracks request stats per route | Request Tracking | Per-route total request count and duration tracking |
| Tracks failing endpoints | Request Tracking | Routes with 5xx responses tracked with failure rate |
| Normalises UUIDs in route paths | Request Tracking | `/articles/550e8400-...` grouped as `/articles/:id` |
| Records timeouts | Timeout Tracking | Slow requests (>10s default) recorded with duration |
| Identifies timeout hotspots | Timeout Tracking | Routes ranked by timeout frequency |
| Returns timeout threshold | Timeout Tracking | Default 10-second threshold exposed |
| Returns current memory snapshot | Memory Tracking | RSS, heap usage, formatted values |
| Detects stable memory trend with insufficient data | Memory Tracking | Returns "stable" when not enough samples |
| Generates comprehensive crash report | Full Report | All sections populated in single report |

---

### 6. Crash Detector Middleware (`__tests__/crash/crashDetector.test.ts`)

**Purpose:** Tests the `crashDetector` and `crashExceptionCapture` middleware that feed data into the crash analysis system.

**What it tests:**

| Test | Validates |
|------|-----------|
| Records request on response finish | Every completed request triggers `recordRequest()` with method, URL, status, duration |
| Records request with correct status code on error | 5xx responses properly recorded |
| Detects timeout when duration exceeds threshold | Slow requests trigger `recordTimeout()` |
| Does not record timeout for fast requests | Normal requests don't trigger timeout tracking |
| Records exception and passes to next error handler | Thrown errors captured by `crashExceptionCapture` and forwarded |

---

### 7. Error Logger Middleware (`__tests__/crash/errorLogger.test.ts`)

**Purpose:** Tests the `errorLogger` middleware which is the last error handler in the middleware chain.

**What it tests:**

| Test | Validates |
|------|-----------|
| Returns JSON for API requests (Accept: application/json) | API clients get `{ error: "Internal server error" }` |
| Returns JSON for mobile API requests | Requests to `/mobile/*` get JSON responses |
| Returns text for web requests | Browser requests get plain text error page |
| Does not crash when headers already sent | `res.headersSent` guard prevents double-send |
| Logs error details | Error message, method, URL, IP, userId logged |
| Handles async route errors | Promise rejections properly handled |

---

### 8. Timeout Utility (`__tests__/stability/timeout.test.ts`)

**Purpose:** Tests the `withTimeout()` promise wrapper used to prevent hanging database queries and external service calls.

**What it tests:**

| Test | Validates |
|------|-----------|
| Resolves when promise completes before timeout | Normal operation passes through |
| Rejects when promise exceeds timeout | Slow operations rejected with timeout error message |
| Propagates original error when promise rejects before timeout | Original error preserved, not masked by timeout |
| Uses default label in timeout message | Default "Operation" label in error message |
| Clears timer on success so it does not leak | `clearTimeout()` called after resolution |
| Exports correct default values | `DEFAULT_QUERY_TIMEOUT=30000`, `DEFAULT_REQUEST_TIMEOUT=60000`, `DEFAULT_EXTERNAL_TIMEOUT=15000` |

---

### 9. Retry Utility (`__tests__/stability/retry.test.ts`)

**Purpose:** Tests the `withRetry()` utility used for database connection startup and external service calls (e.g., Firebase).

**What it tests:**

| Test | Validates |
|------|-----------|
| Returns result on first success | No retries when operation succeeds immediately |
| Retries on failure and succeeds eventually | Exponential backoff until success |
| Throws after exhausting all retries | Final error thrown after all attempts (initial + retries) |
| Uses exponential backoff | Second delay longer than first delay |
| Converts non-Error rejections to Error objects | String errors wrapped in `Error` |
| Uses default options when none provided | Works with zero configuration |
| Respects maxDelay cap | Backoff never exceeds specified maximum |

---

### 10. Safe Utilities (`__tests__/stability/safeUtils.test.ts`)

**Purpose:** Tests `safeJsonParse()` and `toError()` used to prevent JSON parsing crashes and normalize error types.

**What it tests — safeJsonParse:**

| Test | Validates |
|------|-----------|
| Parses valid JSON correctly | Standard JSON parsing works |
| Returns fallback for invalid JSON | Malformed JSON returns default value instead of throwing |
| Returns fallback for empty string | Empty input handled gracefully |
| Parses arrays correctly | Array JSON parsing works |
| Returns fallback for null input | Null input handled without crash |
| Logs warning on parse failure | Failed parses logged with custom label |
| Preserves type parameter | TypeScript generic type preserved |

**What it tests — toError:**

| Test | Validates |
|------|-----------|
| Returns the same Error if input is an Error | Pass-through for Error objects |
| Wraps a string into an Error | `"message"` → `new Error("message")` |
| Wraps a number into an Error | `42` → `new Error("42")` |
| Wraps null into an Error | `null` → `new Error("null")` |
| Wraps undefined into an Error | `undefined` → `new Error("undefined")` |
| Wraps an object into an Error | `{ code: "ERR" }` → `new Error(...)` |

---

### 11. Request Timeout Middleware (`__tests__/stability/requestTimeout.test.ts`)

**Purpose:** Tests the Express middleware that prevents hanging HTTP connections by sending 503 after a configurable timeout.

**What it tests:**

| Test | Validates |
|------|-----------|
| Allows fast requests through without timeout | Normal requests unaffected |
| Returns 503 when request exceeds timeout | Slow endpoints get `{ error: "Request timed out" }` |
| Clears timer when response finishes normally | No timer leaks on successful requests |
| Uses default timeout when no parameter given | Default 60-second timeout applied |
| Logs timeout event | Method, URL, and timeout duration logged |

---

### 12. Load Tests (`__tests__/load/loadTest.test.ts`)

**Purpose:** Validates that the CMS middleware stack handles concurrent requests without crashes, race conditions, or degradation.

**What it tests:**

| Test | Validates |
|------|-----------|
| Handles 50 concurrent health check requests | All 50 return 200 with `{ status: "alive" }` |
| Handles 50 concurrent API data requests | All 50 return 200 with correct data |
| Handles 100 concurrent mixed requests | 40 GET + 40 GET + 20 POST all complete correctly |
| Handles 30 concurrent write requests | All POST requests return 201 |
| Returns 400 for invalid POST requests under load | Validation works under concurrency |
| Handles 20 concurrent error-generating requests gracefully | All return 500 without server crash; server still responsive after |
| Mixes successful and failing requests without affecting each other | 30 successes + 10 errors complete independently |
| Maintains consistent response times under moderate load | 30 concurrent in-memory responses complete within 5 seconds |

**Approach:** Creates a minimal Express app with the full CMS middleware stack (`crashDetector` → `requestTimeout` → `responseTimeTracker` → routes → `errorLogger`) and uses `Promise.all()` to fire concurrent supertest requests.

---

## Coverage Summary

| Module | Stmts | Branch | Funcs | Lines |
|--------|-------|--------|-------|-------|
| **src/middleware/** | **100%** | 85.7% | **100%** | **100%** |
| **src/helpers/** | 97.6% | 90% | **100%** | 97.3% |
| **HealthController** | **100%** | 83.3% | **100%** | **100%** |
| **src/controller/** | 81.8% | 41.2% | **100%** | 81.8% |
| **src/services/** | 71.3% | 57.5% | 77.6% | 74.2% |
| **Overall** | 77.7% | 56.2% | 81.9% | 78.8% |

---

## Test Results

```
Test Suites: 14 passed, 14 total
Tests:       111 passed, 111 total
Snapshots:   0 total
```

**Breakdown:**

| Suite | Tests |
|-------|-------|
| Health endpoints | 7 |
| Monitoring endpoints | 7 |
| Monitoring service | 11 |
| Diagnostics endpoints | 7 |
| Crash analysis service | 13 |
| Crash detector middleware | 5 |
| Error logger middleware | 5 |
| Timeout utility | 6 |
| Retry utility | 7 |
| Safe utilities | 12 |
| Request timeout middleware | 5 |
| Load tests | 8 |
| Helmet security headers (pre-existing) | 14 |
| Authentication (pre-existing) | 3 |
| **Total** | **111** |

---

## Troubleshooting

### Tests hang or don't exit

The test command includes `--forceExit` and `--detectOpenHandles`. If tests hang:

```bash
# See which handles are open
NODE_PATH=./src npx jest --forceExit --detectOpenHandles 2>&1 | tail -20
```

### TypeORM "No connection" errors

Tests mock TypeORM with `jest.mock('typeorm')`. If you see connection errors, ensure the mock is declared **before** importing the module under test.

### Module resolution errors

Tests rely on `NODE_PATH=./src` for module resolution. Make sure it's set:

```bash
NODE_PATH=./src npx jest --verbose
```

### Running tests in CI

```bash
cd packages/cms
NODE_PATH=./src npx jest --forceExit --coverage --ci --verbose
```
