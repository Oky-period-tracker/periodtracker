# CMS Monitoring Implementation

## Overview

Basic monitoring has been added to the CMS backend to provide service health metrics and response time tracking. All monitoring endpoints are accessible without authentication so they can be used by load balancers, orchestration tools (Kubernetes), and external monitoring systems.

---

## Architecture

```
┌──────────────────────────────────────────────────┐
│                  Express App                     │
│                                                  │
│  ┌──────────────────────────────────────────┐    │
│  │  responseTimeTracker middleware           │    │
│  │  (records every request's duration)       │    │
│  └──────────────┬───────────────────────────┘    │
│                 │                                 │
│                 ▼                                 │
│  ┌──────────────────────────────────────────┐    │
│  │  MonitoringService (singleton)            │    │
│  │  - In-memory metrics store                │    │
│  │  - Response time percentiles (p50/p95/p99)│    │
│  │  - Per-route aggregation                  │    │
│  │  - Error rate tracking                    │    │
│  │  - Database health checks                 │    │
│  │  - System resource monitoring             │    │
│  └──────────────┬───────────────────────────┘    │
│                 │                                 │
│                 ▼                                 │
│  ┌──────────────────────────────────────────┐    │
│  │  MonitoringController                     │    │
│  │  GET /monitoring/health                   │    │
│  │  GET /monitoring/metrics                  │    │
│  │  GET /monitoring/routes                   │    │
│  │  GET /monitoring/slow-routes              │    │
│  └──────────────────────────────────────────┘    │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

## Endpoints

### `GET /monitoring/health`

Lightweight liveness/readiness probe for load balancers and Kubernetes.

**Response codes:**
- `200` — healthy or degraded
- `503` — unhealthy (database down)

**Response body:**
```json
{
  "status": "healthy",
  "uptime": 3600,
  "timestamp": "2026-03-25T10:00:00.000Z",
  "version": "1.0.0",
  "checks": {
    "database": {
      "status": "connected",
      "latency": 3
    },
    "memory": {
      "status": "ok",
      "usage": {
        "rss": 52428800,
        "heapTotal": 20971520,
        "heapUsed": 15728640,
        "external": 1048576,
        "arrayBuffers": 524288
      },
      "heapUsedPercent": 75
    },
    "cpu": {
      "loadAvg": [1.5, 1.2, 0.9],
      "cpuCount": 4
    }
  }
}
```

**Health status logic:**
| Condition | Status |
|---|---|
| Database connected, heap < 90% | `healthy` |
| Database connected, heap > 90% OR db latency > 1000ms | `degraded` |
| Database disconnected or errored | `unhealthy` |

---

### `GET /monitoring/metrics`

Overall service metrics summary with response time percentiles.

**Response body:**
```json
{
  "uptime": 3600,
  "totalRequests": 15420,
  "totalErrors": 12,
  "errorRate": 0.08,
  "statusCodeCounts": {
    "200": 14800,
    "201": 500,
    "404": 100,
    "500": 12,
    "302": 8
  },
  "responseTime": {
    "window": "1h",
    "sampleCount": 2340,
    "avg": 45,
    "p50": 32,
    "p95": 120,
    "p99": 450,
    "min": 1,
    "max": 3200
  }
}
```

**Fields:**
| Field | Description |
|---|---|
| `uptime` | Server uptime in seconds |
| `totalRequests` | Total requests since server start |
| `totalErrors` | Count of 5xx responses since server start |
| `errorRate` | Error percentage (0-100) |
| `statusCodeCounts` | Breakdown by HTTP status code |
| `responseTime.window` | Time window for percentile calculations |
| `responseTime.avg` | Average response time (ms) |
| `responseTime.p50` | Median response time (ms) |
| `responseTime.p95` | 95th percentile response time (ms) |
| `responseTime.p99` | 99th percentile response time (ms) |

---

### `GET /monitoring/routes`

Per-route response time breakdown (last 1 hour).

**Response body:**
```json
{
  "GET /encyclopedia": {
    "count": 150,
    "totalDuration": 6750,
    "avgDuration": 45,
    "minDuration": 12,
    "maxDuration": 320,
    "statusCodes": { "200": 148, "500": 2 }
  },
  "POST /articles": {
    "count": 25,
    "totalDuration": 2500,
    "avgDuration": 100,
    "minDuration": 50,
    "maxDuration": 450,
    "statusCodes": { "200": 25 }
  }
}
```

**Route normalisation:** UUIDs and numeric IDs in URLs are replaced with `:id` so that `/articles/550e8400...` and `/articles/a1b2c3d4...` are grouped as `GET /articles/:id`.

---

### `GET /monitoring/slow-routes`

Top 10 slowest routes by average response time (last 1 hour).

**Response body:**
```json
[
  {
    "route": "GET /data/generate-content-sheet",
    "avgDuration": 2500,
    "maxDuration": 8200,
    "count": 5
  },
  {
    "route": "POST /data/upload-content-sheet",
    "avgDuration": 1800,
    "maxDuration": 4500,
    "count": 3
  }
]
```

---

## Files Created

| File | Purpose |
|---|---|
| `src/services/monitoringService.ts` | Core monitoring service — metrics collection, health checks, aggregation |
| `src/middleware/responseTimeTracker.ts` | Express middleware — records response time per request |
| `src/controller/MonitoringController.ts` | HTTP controller — exposes monitoring endpoints |

## Files Modified

| File | Change |
|---|---|
| `src/index.ts` | Added `responseTimeTracker` middleware (after `crashDetector` and `requestTimeout`), registered `/monitoring/*` endpoints (before error logger) |

## Related Files

| File | Purpose |
|---|---|
| `src/middleware/crashDetector.ts` | Crash analysis middleware — placed before `responseTimeTracker` in the pipeline |
| `src/middleware/requestTimeout.ts` | Request-level timeout middleware (60s default) — placed between `crashDetector` and `responseTimeTracker` |
| `src/middleware/errorLogger.ts` | Error handling middleware — now sends error response directly (JSON for API, text for web) instead of passing to Express default handler |

---

## Implementation Details

### Response Time Tracking

The `responseTimeTracker` middleware is registered after `crashDetector` and `requestTimeout` in the stack (before `requestLogger`), so it captures the full request lifecycle:

```
crashDetector  →  requestTimeout  →  responseTimeTracker  →  requestLogger  →  bodyParser  →  auth  →  routes  →  crashExceptionCapture  →  errorLogger
                                           ↑                                                                                                     │
                                           └─────────────── res.on('finish') records duration ────────────────────────────────────────────────────┘
```

**How it works:**
1. Records `process.hrtime.bigint()` at request start
2. Listens to the `finish` event on the response object
3. Calculates duration in milliseconds
4. Normalises the route path (collapses UUIDs/numbers to `:id`)
5. Calls `monitoringService.recordResponseTime()` with method, route, status code, and duration

### Memory Management

- Response time entries are stored in-memory with a cap of **10,000 entries** (oldest evicted via slice)
- Route metrics are calculated from entries within the **last 1 hour** only
- Global counters (`totalRequests`, `totalErrors`, `statusCodeCounts`) persist for the full server lifetime

### Database Health Check

The `/monitoring/health` endpoint actively checks database connectivity by:
1. Verifying `connection.isConnected` via TypeORM
2. Running a `SELECT 1` query to measure actual round-trip latency
3. Returning latency in milliseconds

### Authentication

All `/monitoring/*` endpoints are **public** (no authentication required). This is intentional:
- `/monitoring/health` must be accessible to Kubernetes probes and load balancers
- No sensitive data is exposed through metrics endpoints
- The Routes array in `routes.ts` does not include `/monitoring`, so the `isLoggedIn` middleware is not applied

---

## Usage Examples

### Kubernetes Liveness/Readiness Probe

```yaml
livenessProbe:
  httpGet:
    path: /monitoring/health
    port: 5000
  initialDelaySeconds: 15
  periodSeconds: 30

readinessProbe:
  httpGet:
    path: /monitoring/health
    port: 5000
  initialDelaySeconds: 5
  periodSeconds: 10
```

### Monitoring with curl

```bash
# Quick health check
curl http://localhost:5000/monitoring/health

# Full metrics
curl http://localhost:5000/monitoring/metrics

# Per-route breakdown
curl http://localhost:5000/monitoring/routes

# Slowest routes
curl http://localhost:5000/monitoring/slow-routes
```

### Alerting on Error Rate

Poll `/monitoring/metrics` and alert when `errorRate` exceeds threshold:

```bash
ERROR_RATE=$(curl -s http://localhost:5000/monitoring/metrics | jq '.errorRate')
if (( $(echo "$ERROR_RATE > 5" | bc -l) )); then
  echo "ALERT: Error rate is ${ERROR_RATE}%"
fi
```

### Tracking p95 Response Time

```bash
P95=$(curl -s http://localhost:5000/monitoring/metrics | jq '.responseTime.p95')
echo "p95 response time: ${P95}ms"
```
