# PR #266: fixes from review

The review of the CMS overhaul found security, reliability and data-integrity issues. These follow-up changes protect operational endpoints, bound diagnostic state, reduce accidental duplicate delivery, and preserve existing data when writes fail.

Reviewed starting revision: `5d5503c8ad5b321f8627d1f7b90c8374bc369f69` (PR base: `fd60e428dad8428f93ea6d605875641adcf93c4d`). Verification recorded on 17 September 2026.

## Issues addressed

| Issue and impact | Change | Verification |
|---|---|---|
| Public monitoring/diagnostics exposed internal operational information. | Require authenticated `superAdmin` access and send `Cache-Control: no-store`; public health probes remain available. | Production route/role matrix; real signed sessions against the container. |
| Arbitrary URLs and error strings could grow retained diagnostic state. | Aggregate registered route patterns and unmatched paths; cap retained routes/errors/string lengths and expire idle routes. | Bound/expiry unit tests; 100 distinct unknown URLs aggregate into one runtime entry. |
| Retrying an ambiguous Firebase timeout could deliver a notification twice. | Remove automatic resend after timeout or rejection; persist sent status only after confirmed delivery. | Delayed, rejected and successful mocked delivery tests. This does not guarantee exactly-once delivery. |
| Voice-over replacement could lose existing audio or leave late uploads behind. | Keep old audio until upload and database save succeed; use unique object names and clean up failed/late replacements; avoid a second HTTP response. | Upload timeout, late completion, successful replacement and database-failure tests with mocked storage. |
| Optional file logging could crash the process or accumulate buffered writes. | Handle directory/stream failures and stop enqueueing file writes during backpressure while keeping console logging available. | Filesystem failure, asynchronous stream error and stalled-write tests. |
| SQL logging could expose bind values and ignore disabled logging. | Honor the database logging flag; retain query timing/count/error-code metadata without SQL, bind values or raw driver error messages. | Privacy and logging-configuration tests. |
| A stalled monitoring database check could leave an HTTP request open. | Apply a five-second deadline and avoid writing after client disconnect. | Successful, rejected, disconnected and stalled database checks. |
| Index creation depended on the connection search path. | Qualify migration tables with `periodtracker`; document adjustment for custom schemas. | Isolated PostgreSQL migration creates 42 valid indexes and can be reapplied. |
| Reordering completed without returning a result to the route wrapper. | Await all updates and return their results so the wrapper sends a response. | Helper/route tests and persisted HTTP reordering against PostgreSQL. |
| Public health responses included raw database errors. | Return public status/timestamps without internal error details. | Health endpoint tests and real database-outage checks. |
| Container health probes assumed port 5000. | Read `CMS_PORT` consistently in both image stages and Compose. | Probe tests and actual image healthcheck on a custom port. |
| Protecting diagnostics required authentication support in the CLI. | Prompt interactively when no session cookie is supplied; hide the password, retain signed cookies in memory, support `CMS_SESSION_COOKIE`, require HTTPS except localhost and precheck diagnostic authorization. | CLI HTTP tests plus real terminal login, rejection, cancellation and password-hiding checks. No standalone persistent `login` command is added. |
| The PR's permissive script policy enabled an existing unsafe banner template. | Replace script `unsafe-inline` with per-response nonces, escape the banner attribute, validate new image URLs and bind the login password-toggle listener from trusted script. | Full-policy Chromium checks, template/input tests and real CMS page interactions. |
| New request logging retained query-string values. | Strip queries/fragments and bound URL fields across request, timeout, error, authentication and diagnostic capture. | Middleware tests and synthetic-secret checks in runtime logs. This is not global redaction of every log field. |
| The existing Yarn container command did not deliver signals to the PR's new shutdown handler. | Start Node directly in production; allow 35 seconds in Compose for the application's 30-second shutdown fallback. | Docker SIGTERM during a database-blocked HTTP write: request completes, update persists and process exits 0. |
| Survey parent/child writes could partially persist. | Use transactions for create/update/delete, lock existing parents and check question ownership before mutation. | Six real PostgreSQL tests covering commits, rollback and cross-survey question rejection, plus HTTP CRUD. |

The banner HTML sink and survey atomicity problem predate this PR. The PR's CSP relaxation made the banner script injection executable. The shutdown issue combines the PR's new handler with an existing container command. Other rows describe fixes in reviewed paths without claiming every underlying behavior originated in this PR.

## Verification

- **26 suites / 199 tests passed**, with all six PostgreSQL transaction tests enabled. Default runs without database configuration skip those six tests.
- CMS TypeScript 4.7.4 compilation, static asset copying, and production Docker build passed. The final build reused the previously verified dependency/core/API base.
- All 12 browser JavaScript files changed by the original PR passed syntax checking.
- Seventeen authenticated CMS management pages returned HTTP 200. Chromium checks covered login/password visibility, About editing, Encyclopedia configuration, Survey, Notifications and Suggestions; no page errors or CSP violations were observed in those journeys.
- Real survey HTTP create/read/update/delete, role-based operational access, authenticated CLI, query privacy, custom-port health checks, database outage and graceful shutdown checks passed.
- The production image handled 300 mixed requests at concurrency four with expected statuses. This is a functional smoke test, not production capacity evidence.
- Isolated PostgreSQL 16 was used. No real notification was sent and no live bucket was modified.
- Instrumented CMS unit-test coverage was 29.16% of statements and 20.49% of branches, excluding entities, migrations and type declarations. Browser/container/subprocess checks are additional and are not included in those percentages.

See [TESTING.md](TESTING.md) for commands and the PostgreSQL integration-test prerequisites. See [HEALTH_CHECKS.md](HEALTH_CHECKS.md), [MONITORING.md](MONITORING.md), [CRASH_ANALYSIS.md](CRASH_ANALYSIS.md) and [LOGGING_AND_ERROR_HANDLING.md](LOGGING_AND_ERROR_HANDLING.md) for operational behavior.

## Remaining issues and verification gaps

- **Pre-existing empty notification response:** `GET /mobile/notification/:lang` has no immediate response when no sent notification exists. `findOne` returns `undefined`, and the response wrapper skips it. The local client timed out after eight seconds. This was not fixed by the review changes.
- Live Firebase delivery, storage failure/cleanup and production data/environment parity still need staging verification. Unit tests mock cloud services.
- Compose specifies PostgreSQL 10; the isolated verification used PostgreSQL 16. Production-version compatibility and index-build locking remain unverified.
- Every browser editing journey, production-scale load, pool exhaustion and load-balancer/orchestrator draining are not covered by these checks.
- Timeouts do not cancel underlying operations. Durable notification reconciliation/idempotency, durable orphan cleanup and log rotation are separate work.
- Before release, configure deployment logging variables, apply the SQL indexes through the normal database change process, and verify the deployment's readiness/health paths. No staging/production deployment was performed during this review.
