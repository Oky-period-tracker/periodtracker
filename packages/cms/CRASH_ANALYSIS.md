# Crash Root Cause Analysis (R&D + Debugging)

## Overview

A crash analysis and diagnostics system for the CMS that continuously tracks exceptions, memory usage, timeout failures, and endpoint health. It provides real-time diagnostics endpoints and a CLI reproduction tool for consistent crash scenario testing.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Express App                              │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  crashDetector middleware (before routes)                  │  │
│  │  • Records request duration + status per endpoint         │  │
│  │  • Detects timeout failures (>10s by default)             │  │
│  └───────────────────────┬───────────────────────────────────┘  │
│                          │                                      │
│                          ▼                                      │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  CrashAnalysisService (singleton)                         │  │
│  │  • Exception log (last 500)                               │  │
│  │  • Memory snapshots every 30s (last 200)                  │  │
│  │  • Timeout log (last 500)                                 │  │
│  │  • Per-route failure stats (lifetime)                     │  │
│  │  • Full crash report generation                           │  │
│  └───────────────────────┬───────────────────────────────────┘  │
│                          │                                      │
│  ┌───────────────────────┴───────────────────────────────────┐  │
│  │  crashExceptionCapture (error middleware, after routes)    │  │
│  │  • Captures unhandled errors from route handlers          │  │
│  │  • Feeds into CrashAnalysisService before error logger    │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│  Process-level handlers:                                        │
│  • uncaughtException → logged + graceful shutdown               │
│  • unhandledRejection → logged (no shutdown)                    │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  DiagnosticsController                                    │  │
│  │  GET /diagnostics/report                                  │  │
│  │  GET /diagnostics/exceptions                              │  │
│  │  GET /diagnostics/memory                                  │  │
│  │  GET /diagnostics/timeouts                                │  │
│  │  GET /diagnostics/endpoints                               │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Diagnostics Endpoints

All diagnostics endpoints are **public** (no authentication) for operational access.

### `GET /diagnostics/report` — Full Crash Report

Comprehensive analysis combining all tracked data.

```json
{
  "generatedAt": "2026-03-25T10:00:00.000Z",
  "uptime": 86400,
  "summary": {
    "totalExceptions": 15,
    "totalTimeouts": 3,
    "memorySpikesDetected": 1,
    "unhealthyEndpoints": 2
  },
  "exceptions": {
    "recent": [ /* last 20 exceptions */ ],
    "topErrors": [
      { "message": "Cannot read property 'id' of undefined", "count": 8, "lastSeen": "..." }
    ]
  },
  "memory": {
    "current": { "heapUsedPercent": 62, "rssFormatted": "85.3 MB", "heapUsedFormatted": "42.1 MB" },
    "spikes": [ /* snapshots where heap > 85% */ ],
    "trend": "stable"
  },
  "timeouts": {
    "recent": [ /* last 20 timeouts */ ],
    "topRoutes": [
      { "route": "GET /data/generate-content-sheet", "count": 3, "avgDuration": 12500 }
    ]
  },
  "failingEndpoints": [
    {
      "route": "POST /articles",
      "totalRequests": 50,
      "failedRequests": 5,
      "failureRate": 10,
      "avgDuration": 230,
      "maxDuration": 1500,
      "errors": [{ "message": "Validation failed", "count": 5 }]
    }
  ],
  "system": {
    "loadAvg": [1.5, 1.2, 0.9],
    "cpuCount": 4,
    "freeMemory": 2147483648,
    "totalMemory": 8589934592,
    "platform": "linux",
    "nodeVersion": "v16.13.1"
  }
}
```

---

### `GET /diagnostics/exceptions`

Recent exceptions and top errors grouped by message.

```json
{
  "recent": [
    {
      "timestamp": "2026-03-25T10:00:00.000Z",
      "method": "POST",
      "url": "/articles",
      "controller": "ArticleController",
      "action": "save",
      "message": "Cannot read property 'id' of undefined",
      "stack": "...",
      "statusCode": 500,
      "userId": "admin-123"
    }
  ],
  "topErrors": [
    { "message": "Cannot read property 'id' of undefined", "count": 8, "lastSeen": "..." }
  ]
}
```

---

### `GET /diagnostics/memory`

Memory usage analysis with spike detection and trend.

```json
{
  "current": {
    "timestamp": "2026-03-25T10:00:00.000Z",
    "rss": 89456640,
    "heapTotal": 67108864,
    "heapUsed": 44040192,
    "external": 1048576,
    "heapUsedPercent": 66,
    "rssFormatted": "85.3 MB",
    "heapUsedFormatted": "42.0 MB"
  },
  "spikes": [],
  "trend": "stable"
}
```

**Trend detection:**
| Trend | Meaning |
|---|---|
| `stable` | Heap usage within ±10% over recent samples |
| `growing` | Heap usage increasing >10% — possible memory leak |
| `declining` | Heap usage decreasing >10% — GC recovery |

**Spike threshold:** Heap usage ≥ 85% is flagged as a spike.

---

### `GET /diagnostics/timeouts`

Requests that exceeded the timeout threshold (default: 10s).

```json
{
  "recent": [
    {
      "timestamp": "2026-03-25T10:00:00.000Z",
      "method": "GET",
      "url": "/data/generate-content-sheet",
      "duration": 15230,
      "threshold": 10000
    }
  ],
  "hotspots": [
    { "route": "GET /data/generate-content-sheet", "count": 3, "avgDuration": 12500 }
  ]
}
```

---

### `GET /diagnostics/endpoints`

Failing and high-load endpoint analysis.

```json
{
  "failing": [
    {
      "route": "POST /articles",
      "totalRequests": 50,
      "failedRequests": 5,
      "failureRate": 10,
      "avgDuration": 230,
      "maxDuration": 1500,
      "lastFailure": "2026-03-25T10:00:00.000Z",
      "errors": [{ "message": "Validation failed", "count": 5 }]
    }
  ],
  "highLoad": [
    {
      "route": "GET /encyclopedia",
      "totalRequests": 5000,
      "avgDuration": 45,
      "failureRate": 0.02
    }
  ]
}
```

---

## What Gets Tracked

### Exceptions
- Every route handler error caught by the Express error chain
- `uncaughtException` events at the process level
- `unhandledRejection` events at the process level
- Includes: method, URL, controller, action, error message, stack trace, user ID
- Grouped by error message to identify recurring patterns
- Retention: last 500 exceptions

### Memory Spikes
- Automatic memory sampling every 30 seconds via `process.memoryUsage()`
- Spikes flagged when heap usage ≥ 85%
- Trend analysis compares first half vs second half of recent samples
- Growing trend (>10% increase) indicates potential memory leak
- Retention: last 200 snapshots (~100 minutes of data)

### Timeout Failures
- Requests that complete but exceed the timeout threshold (default: 10s)
- Tracked per route with timeout count ranking
- Route normalization groups UUID/numeric IDs (e.g. `/articles/:id`)
- Retention: last 500 timeouts

### Endpoint Health
- Per-route request count, failure count, failure rate
- Average and maximum response times per endpoint
- Error messages grouped by count for root cause identification
- Endpoints sorted by failure rate to surface the most problematic routes

---

## Process-Level Crash Capture

```
┌─────────────────────────────────────────┐
│ uncaughtException                       │
│ → Log error                             │
│ → Record in crashAnalysisService        │
│ → Trigger graceful shutdown             │
│ → Docker restarts via on-failure policy │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ unhandledRejection                      │
│ → Log error                             │
│ → Record in crashAnalysisService        │
│ → Service continues running             │
└─────────────────────────────────────────┘
```

---

## Crash Reproduction Tool

A CLI utility for reproducing crash scenarios consistently.

### Usage

```bash
cd packages/cms
npx ts-node src/utils/crashReproduction.ts <scenario> [--base-url=http://localhost:5000]
```

### Available Scenarios

| Scenario | Description |
|---|---|
| `health-check` | Poll `/health` 10 times at 2s intervals — report status changes |
| `rapid-errors` | Send 20 requests to invalid/non-existent endpoints — generate 4xx/5xx responses |
| `timeout-simulation` | Hit known slow endpoints — trigger timeout detection |
| `memory-check` | Fetch `/diagnostics/memory` — display current state and trend |
| `full-diagnostic` | Run all scenarios, then fetch and display the full crash report |

### Examples

```bash
# Quick health check
npx ts-node src/utils/crashReproduction.ts health-check

# Generate errors and check exception tracking
npx ts-node src/utils/crashReproduction.ts rapid-errors

# Full analysis suite
npx ts-node src/utils/crashReproduction.ts full-diagnostic

# Against a remote server
npx ts-node src/utils/crashReproduction.ts full-diagnostic --base-url=https://cms.example.com
```

---

## Middleware Pipeline Order

```
Request → crashDetector → requestTimeout → responseTimeTracker → requestLogger → bodyParser → auth → routes
                                                                                                      │
      ┌───────────────────────────────────────────────────────────────────────────────────────────────┘
      │
      ▼
(route handler try/catch captures sync errors + promise .catch() captures async errors)
      │
      ▼
crashExceptionCapture → errorLogger → Response
```

The `crashDetector` is placed first to capture the full request lifecycle. The `requestTimeout` middleware (60s default) sits next to prevent hanging connections. The `crashExceptionCapture` sits between routes and the `errorLogger` to record exceptions before they're handled.

**Error response flow:** The `errorLogger` now **sends the response directly** (JSON for API/mobile requests, text for web requests) with a `res.headersSent` guard, instead of passing to the Express default error handler.

**Route handler safety:** The route handler wraps controller invocations in a try/catch block to capture synchronous errors. All response sends are guarded with `!res.headersSent` to prevent double-send crashes.

---

## Files

### Created

| File | Purpose |
|---|---|
| `src/services/crashAnalysisService.ts` | Core analysis engine — exception, memory, timeout, and endpoint tracking |
| `src/middleware/crashDetector.ts` | Request-level middleware (timing, status, timeout detection) + error middleware (exception capture) |
| `src/controller/DiagnosticsController.ts` | HTTP endpoints for diagnostics data |
| `src/utils/crashReproduction.ts` | CLI tool for crash scenario reproduction |

### Modified

| File | Change |
|---|---|
| `src/index.ts` | Added `crashDetector` middleware, `crashExceptionCapture` error handler, diagnostics routes, memory sampling lifecycle, `uncaughtException`/`unhandledRejection` handlers, route handler try/catch with `!res.headersSent` guards |
| `src/middleware/errorLogger.ts` | Now sends error response directly (JSON for API, text for web) with `res.headersSent` guard instead of passing to Express default handler |

### Related Utilities

| File | Purpose |
|---|---|
| `src/middleware/requestTimeout.ts` | Request-level timeout middleware (60s default) — sends 503 on timeout |
| `src/helpers/timeout.ts` | `withTimeout()` promise wrapper — used in health checks and external service calls |
| `src/helpers/retry.ts` | `withRetry()` with exponential backoff — used for DB connection and external calls |

---

## Validation

### Check diagnostics after running the server

```bash
# Full crash report
curl http://localhost:5000/diagnostics/report | jq

# Just exceptions
curl http://localhost:5000/diagnostics/exceptions | jq

# Memory analysis
curl http://localhost:5000/diagnostics/memory | jq

# Timeout analysis
curl http://localhost:5000/diagnostics/timeouts | jq

# Endpoint health
curl http://localhost:5000/diagnostics/endpoints | jq
```

### Run full crash reproduction

```bash
cd packages/cms
npx ts-node src/utils/crashReproduction.ts full-diagnostic
```

### Trigger a crash and check recovery

```bash
# In terminal 1: watch health
watch -n 2 'curl -s http://localhost:5000/health | jq .status'

# In terminal 2: kill the process inside Docker
docker exec <cms-container> kill 1

# Docker auto-restarts → health returns "healthy" after ~30s
# Check /diagnostics/exceptions for the uncaughtException record
```
