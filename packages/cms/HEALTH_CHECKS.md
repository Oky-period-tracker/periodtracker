# CMS Health Checks & Auto-Restart

## Overview

Health check endpoints and Docker auto-restart have been implemented for the CMS service. This enables:
- **Automated health monitoring** via Docker and orchestrators (Kubernetes)
- **Automatic container restart** when the CMS becomes unhealthy
- **Graceful shutdown** to drain connections before stopping

---

## Health Check Endpoints

All health endpoints are **public** (no authentication required) for use by Docker, load balancers, and orchestrators.

### `GET /health` — Full Health Check

Returns comprehensive health status including database connectivity and service availability.

**Response codes:** `200` (healthy/degraded) | `503` (unhealthy)

```json
{
  "status": "healthy",
  "uptime": 3600,
  "timestamp": "2026-03-25T10:00:00.000Z",
  "checks": {
    "database": {
      "status": "up",
      "latency": 3,
      "lastChecked": "2026-03-25T10:00:00.000Z"
    },
    "service": {
      "status": "up",
      "lastChecked": "2026-03-25T10:00:00.000Z"
    }
  }
}
```

**Status logic:**

| Condition | Status | HTTP Code |
|---|---|---|
| Database connected, latency < 1s, service ready | `healthy` | 200 |
| Database connected but latency > 1s | `degraded` | 200 |
| Database down OR service not ready | `unhealthy` | 503 |

---

### `GET /health/live` — Liveness Probe

Lightweight check — returns 200 if the CMS process is alive. Used by orchestrators to decide whether to restart the container.

```json
{ "status": "alive" }
```

---

### `GET /health/ready` — Readiness Probe

Returns 200 only when the service is fully ready to accept traffic (Express listening + database connected). Used by load balancers to route traffic.

```json
{ "status": "ready" }
```

Returns `503` with `{ "status": "not_ready" }` if the service is starting up or the database is unreachable.

---

## Health Checks

### Database Connectivity

- Verifies `connection.isConnected` via TypeORM
- Executes `SELECT 1` to measure actual round-trip latency, wrapped in `withTimeout(5000)` to prevent hanging queries
- Reports `up` / `down` status with latency and error details
- Triggers `unhealthy` status if database is unreachable

### Database Connection Resilience

- The initial `createConnection()` is wrapped with `withRetry()` (5 retries, 2s base delay, 30s max delay, exponential backoff with jitter)
- Prevents server startup failure from transient database unavailability

### Service Availability

- Tracks whether Express has started listening via `markServiceReady()`
- Automatically sets `not ready` during graceful shutdown via `markServiceNotReady()`
- Prevents traffic routing before server is fully initialized

---

## Docker Configuration

### Healthcheck (docker-compose.yml)

```yaml
cms:
  healthcheck:
    test: ["CMD", "node", "-e", "const http = require('http'); const req = http.get('http://localhost:5000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1); }); req.on('error', () => process.exit(1)); req.setTimeout(5000, () => { req.destroy(); process.exit(1); });"]
    interval: 30s      # Check every 30 seconds
    timeout: 10s       # Fail if no response within 10 seconds
    retries: 3         # Mark unhealthy after 3 consecutive failures
    start_period: 30s  # Grace period for container startup
```

The healthcheck uses Node.js (already available in the container) to make an HTTP request to `/health`. No additional dependencies like `curl` or `wget` are needed.

### Restart Policy (docker-compose.yml)

```yaml
cms:
  restart: on-failure:5
```

- **`on-failure:5`** — Docker restarts the CMS container up to 5 times if it exits with a non-zero exit code
- Prevents infinite restart loops while still recovering from transient failures
- Container will not restart if stopped manually (`docker stop`)

### Dockerfile HEALTHCHECK

Both development and production stages include the same `HEALTHCHECK` instruction as a fallback when running without docker-compose:

```dockerfile
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD node -e "const http = require('http'); const req = http.get('http://localhost:5000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1); }); req.on('error', () => process.exit(1)); req.setTimeout(5000, () => { req.destroy(); process.exit(1); });"
```

---

## Graceful Shutdown

When the CMS receives `SIGTERM` or `SIGINT`:

1. Marks the service as **not ready** (readiness probe returns 503 immediately)
2. Stops memory sampling (`crashAnalysisService.stopMemorySampling()`)
3. Stops accepting new connections
4. Waits for in-flight requests to complete
5. Closes the database connection
6. Exits cleanly with code 0
7. Forces exit after 30 seconds if graceful shutdown stalls

This ensures:
- Load balancers stop sending traffic before the container dies
- Active requests finish before the server shuts down
- Database connections are properly released

---

## Automatic Recovery Flow

```
Container starts
      │
      ▼
Express binds to port 5000
      │
      ▼
healthCheckService.markServiceReady()
      │
      ▼
Docker HEALTHCHECK runs every 30s ──────────────────┐
      │                                              │
      ▼                                              │
GET /health returns 200 ◄───── healthy ─────────┐    │
      │                                         │    │
      ▼ (if DB goes down or service fails)      │    │
GET /health returns 503                         │    │
      │                                         │    │
      ▼ (3 consecutive 503s)                    │    │
Docker marks container "unhealthy"              │    │
      │                                         │    │
      ▼                                         │    │
Docker restarts container (on-failure policy)   │    │
      │                                         │    │
      ▼                                         │    │
New container starts ───────────────────────────┘    │
      │                                              │
      ▼                                              │
Healthy again ◄──────────────────────────────────────┘
```

**Recovery timeline (worst case):**
- Health check interval: 30s
- Retries before unhealthy: 3
- Time to detect: ~90s (3 × 30s intervals)
- Start period for new container: 30s
- Total recovery time: ~120s

---

## Kubernetes Integration

```yaml
livenessProbe:
  httpGet:
    path: /health/live
    port: 5000
  initialDelaySeconds: 15
  periodSeconds: 10
  failureThreshold: 3

readinessProbe:
  httpGet:
    path: /health/ready
    port: 5000
  initialDelaySeconds: 5
  periodSeconds: 10
  failureThreshold: 3

startupProbe:
  httpGet:
    path: /health/live
    port: 5000
  initialDelaySeconds: 5
  periodSeconds: 5
  failureThreshold: 30
```

---

## Files

### Created

| File | Purpose |
|---|---|
| `src/services/healthCheckService.ts` | Health check logic — DB connectivity, service availability, state management |
| `src/controller/HealthController.ts` | HTTP endpoints — `/health`, `/health/live`, `/health/ready` |

### Modified

| File | Change |
|---|---|
| `src/index.ts` | Registered health routes, added graceful shutdown (SIGTERM/SIGINT), `markServiceReady()` on listen, wrapped DB connection with `withRetry()`, added `requestTimeout()` middleware |
| `packages/cms/Dockerfile` | Added `HEALTHCHECK` to both dev and prod stages |
| `docker-compose.yml` | Added `healthcheck` config and `restart: on-failure:5` to CMS service |

### Related Utilities (added for stability)

| File | Purpose |
|---|---|
| `src/helpers/timeout.ts` | `withTimeout()` wrapper — used by health check DB query (5s timeout) |
| `src/helpers/retry.ts` | `withRetry()` — exponential backoff with jitter, used for DB connection startup |
| `src/middleware/requestTimeout.ts` | Express middleware — sends 503 if request exceeds timeout (default: 60s) |

---

## Validation

### Check container health status

```bash
docker inspect --format='{{json .State.Health}}' <cms-container-id> | jq
```

### Test health endpoints

```bash
# Full health check
curl http://localhost:5000/health

# Liveness
curl http://localhost:5000/health/live

# Readiness
curl http://localhost:5000/health/ready
```

### Simulate failure and verify restart

```bash
# Watch container status
docker ps --format "table {{.Names}}\t{{.Status}}"

# Kill the CMS process inside the container
docker exec <cms-container-id> kill 1

# Docker should restart the container automatically (check Status column)
docker ps --format "table {{.Names}}\t{{.Status}}"
```
