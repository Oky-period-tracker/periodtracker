# Prediction engine

The app predicts a user's cycle and period lengths by calling an external
prediction service. Because this repository is open source, self-hosters may be
running **either** of two incompatible versions of that service. A single
environment variable selects which one the app talks to.

## Selecting a version

Set `EXPO_PUBLIC_PREDICTION_ENGINE_VERSION` in your `app/.env`:

| Value | Engine | Notes |
| --- | --- | --- |
| `v1` (default) | Legacy engine | Used when the variable is unset or set to anything other than `v2`. |
| `v2` | New Bayesian engine | The engine introduced in [PR #254](https://github.com/Oky-period-tracker/periodtracker/pull/254). Its source lives in a **private repository** and is not publicly available. |

> **Note:** the v2 (Bayesian) engine is currently hosted in a **private
> repository**, so it is not available to self-hosters. If you are running this
> app from the open-source code, keep `EXPO_PUBLIC_PREDICTION_ENGINE_VERSION` on
> the default `v1` and point `EXPO_PUBLIC_PREDICTION_ENDPOINT` at your own
> v1-compatible engine.

```bash
# app/.env
EXPO_PUBLIC_PREDICTION_ENDPOINT=https://your-engine-host/prediction
EXPO_PUBLIC_PREDICTION_ENGINE_VERSION=v2
```

The two engines have different architectures and endpoints, so point
`EXPO_PUBLIC_PREDICTION_ENDPOINT` at the URL that matches the version you
selected. The default is `v1` to keep backwards compatibility for anyone still
running the legacy engine.

The value is read in [env.ts](../../app/src/config/env.ts); anything other than
the literal `v2` falls back to `v1`, so a typo can never accidentally send
v2-shaped traffic to a v1 engine.

## How the versions differ

All version-specific logic lives in `getPeriodCycles` inside
[HttpClient.ts](../../app/src/services/HttpClient.ts). It builds the correct
request for the selected version and **normalises** both responses into one
shape (`PredictionResult`), so the rest of the app never has to know which
engine answered.

### v1 (legacy)

- **Request body:** `{ cycle_lengths, period_lengths, age }`
- **Header:** `content-type: application/json`
- **Response:** `{ predicted_cycles: number[], predicted_periods: number[] }`
- Returns both a predicted cycle length (`predicted_cycles[0]`) and a predicted
  period length (`predicted_periods[0]`).

### v2 (Bayesian)

- **Request body:** `{ user_id, cycle_history, period_history, age, new_observation }`
  - `new_observation` carries the most recently completed cycle so the model can
    learn from it.
- **Header:** `Content-Type: application/json`
- **Response:** `{ prediction: { predicted_cycle_length: number } }`
- Returns **only** a predicted cycle length (a posterior mean that is rarely an
  integer, so callers round it). It does **not** return a period length.

### Normalised result

`getPeriodCycles` always resolves to:

```ts
type PredictionResult = {
  predictedCycleLength: number | undefined
  predictedPeriodLength: number | undefined // undefined for v2
}
```

Consumers ([authSaga.ts](../../app/src/redux/sagas/authSaga.ts) and
[smartPredictionSaga.ts](../../app/src/redux/sagas/smartPredictionSaga.ts)) use
`predictedPeriodLength` when the engine provides it (v1) and otherwise fall back
to deriving a period length locally — from the user's input on sign-up, or from
the average of recorded cycle history for ongoing predictions.

## Adding a new version

1. Add the value to the check in [env.ts](../../app/src/config/env.ts).
2. Add a branch in `getPeriodCycles`
   ([HttpClient.ts](../../app/src/services/HttpClient.ts)) that builds the new
   request and maps the response back into `PredictionResult`.

Because the sagas only depend on `PredictionResult`, they should not need to
change.
