# Security Audit Workflow

This document explains the [Security Audit](../.github/workflows/security-audit.yml)
GitHub Actions workflow: what it scans for, when it runs, and how to read the
reports it produces.

## What it is

A single CI job (`setup-check`) that runs a battery of free, open-source
security scanners against the codebase. Results show up in two places: the
**Security → Code scanning** tab (for Semgrep and Gitleaks, via SARIF) and as
**downloadable artifacts** (JSON/CSV for every tool). It covers four classes of
problem:

| Tool | Type of check | What it finds |
| --- | --- | --- |
| **Semgrep** | SAST (static analysis) | Insecure code patterns — XSS, prototype pollution, Dockerfile issues, etc. |
| **npm audit** | Dependency / SCA | Known CVEs in `packages/api` and `packages/cms` npm dependencies |
| **Gitleaks** | Secret scanning | Hard-coded secrets, API keys, tokens in the working tree |
| **TruffleHog** | Secret scanning | Secrets / high-entropy strings (second opinion alongside Gitleaks) |

It also runs **ESLint** on `packages/api` for good measure (informational only —
failures don't break the build).

## When it runs

The workflow triggers on:

- **`workflow_dispatch`** — manual run from the Actions tab.
- **`pull_request`** — every PR.
- **`push` to `master`** — every merge/commit to the main branch.

## Important: it never fails the build (yet)

Every scanner step ends with `|| true`, so a finding will **not** turn the check
red. The workflow's job today is to *produce reports*, not to gate merges. You
must open the artifacts to see what was found. (To make it enforcing later,
remove the `|| true` from the relevant steps and/or add a threshold gate.)

## What scopes are scanned

- Semgrep: `packages/api`, `packages/cms`, `app/src`
- npm audit: `packages/api` and `packages/cms` dependencies
- Gitleaks & TruffleHog: the entire repository working tree (`.`)

## How to view the results

### Option A (recommended): the Security tab

Semgrep and Gitleaks upload their findings as **SARIF** to GitHub Code Scanning,
so you don't need to download anything:

1. Go to the repo's **Security** tab → **Code scanning**.
2. Each finding is an **alert** with severity, rule, file, and line. Filter by
   `Tool` (`semgrep` / `gitleaks`) or by branch/PR.
3. On a **pull request**, the same findings appear **inline on the diff** as
   annotations, and the PR gets a "Code scanning results" check.
4. False positive? Open the alert → **Dismiss** with a reason. It stays dismissed
   and won't re-appear on future runs.

This is the best way to triage day-to-day: alerts are deduplicated, tracked as
open/fixed over time, and shown on the exact line of code.

> Each tool uploads under its own `category` (`semgrep`, `gitleaks`) so they
> don't overwrite each other. This works because the repo is **public** (Code
> scanning is free for public repos; private repos need GitHub Advanced Security).
> See [GitHub's roadmap](#whats-not-in-the-security-tab-yet) below for npm audit
> and TruffleHog.

### Option B: downloadable artifacts

Every tool also writes raw JSON (and Semgrep/npm audit a friendly CSV), uploaded
as run artifacts — useful for offline review, spreadsheets, or the tools not yet
wired into the Security tab.

1. Go to the **Actions** tab → open the **Security Audit** run you care about.
2. Scroll to the **Artifacts** section at the bottom of the run summary.
3. Download the artifact(s) you need and unzip.

| Artifact | Files | Use it for |
| --- | --- | --- |
| `semgrep-reports` | `semgrep-report.json`, `semgrep-findings.csv`, `semgrep-summary.csv` | Code-level security findings |
| `npm-audit-reports` | `api-npm-audit.json`, `cms-npm-audit.json`, `npm-audit.csv` | Vulnerable dependencies |
| `gitleaks-report` | `gitleaks.sarif`, `gitleaks-report.json` | Leaked secrets |
| `trufflehog-report` | `trufflehog-report.json` | Leaked secrets (second scanner) |

## Reading each report

### Semgrep — start with the CSVs

The workflow post-processes the raw Semgrep JSON into two human-friendly CSVs.

**`semgrep-summary.csv`** — the at-a-glance triage view. One row per severity:

```
Severity,Count,Status
High,2,Under Review
Medium,5,Planned
Low,40,Accepted
```

Severity and `Status` are assigned by the workflow's own rules, not by Semgrep:

- **High** — findings whose rule ID matches `xss` or `prototype-pollution` → `Under Review`
- **Medium** — `dockerfile` rules → `Planned`
- **Low** — everything else → `Accepted`

> These mappings live in the *"Convert Semgrep report to CSV"* step. They are a
> convenience heuristic, not a true CVSS score — treat them as a starting point
> for triage, then judge each finding on its merits.

**`semgrep-findings.csv`** — one row per finding, for detailed review:

```
Severity, Category, Issue Title, File, Line, Description, Impact, Fix Complexity
```

Open it in a spreadsheet, sort by `Severity`, and jump to `File`/`Line` to
investigate. `semgrep-report.json` has the full untruncated detail if you need it.

### npm audit — `npm-audit.csv`

One row per vulnerable package:

```
Package, Severity, Vulnerability, DependencyType, FixAvailable
```

- **DependencyType** — `Direct` (declared in our `package.json`) vs `Transitive`
  (pulled in by a dependency). Direct ones are usually easier to fix.
- **FixAvailable** — `Yes` means an upgrade resolves it; try `npm audit fix` in
  the relevant package, or bump the dependency.

> The CSV is generated from **`api-npm-audit.json` only**. For the CMS package,
> open `cms-npm-audit.json` directly (it is included in the same artifact but
> not folded into the CSV).

Note: only `--audit-level=high` and above is recorded.

### Gitleaks & TruffleHog — secret scanning

**Gitleaks** findings show up directly in the **Code scanning** tab (it uploads
SARIF). To inspect the raw data, the `gitleaks-report` artifact holds both
`gitleaks.sarif` and `gitleaks-report.json` — an empty `[]` (JSON) or a `runs`
array with zero results (SARIF) means clean. (If Gitleaks produces no file at
all, the workflow substitutes empty-but-valid placeholders so the upload still
succeeds.)

**TruffleHog** still produces JSON only (`trufflehog-report.json` in its
artifact). **An empty result / `{}` is good news** — no secrets found.

If either reports a hit, **treat it as urgent**: a real secret in the repo should
be rotated/revoked immediately (not just deleted from the code, since git history
retains it). Run both because they catch different things — cross-check any hit.

## Typical workflow for a reviewer

1. On the PR, check the **Code scanning results** check / the **Security** tab.
   Review any new Semgrep or Gitleaks alerts inline on the diff; dismiss false
   positives with a reason.
2. For dependency issues, open the `npm-audit-reports` artifact → `npm-audit.csv`.
   Address high/critical deps with `FixAvailable = Yes` first.
3. Open the `trufflehog-report` artifact and confirm it's empty. If not, rotate
   the exposed secret and scrub it.

## What's not in the Security tab yet

Two tools still only produce artifacts. The cleaner long-term move is to replace
them with GitHub's native, free-for-public-repos features:

- **npm audit → Dependabot.** Enable **Dependabot alerts** (Settings → Code
  security) to get the same dependency CVEs in the Security tab, plus automatic
  fix PRs. The `npm audit` steps can then be removed.
- **TruffleHog → GitHub secret scanning.** Public repos get **secret scanning**
  and **push protection** automatically (Settings → Code security) — it blocks
  known secret formats before they're even committed. Keep TruffleHog only if you
  want a second detector, or convert its output to SARIF and upload it too.

## FAQ

**The check is green but there are findings — is that a bug?**
No. By design every scanner uses `|| true`, so the workflow check passes
regardless. Green means "the scan ran", not "nothing was found". Always look at
the **Code scanning** alerts (Semgrep/Gitleaks) and the artifacts (npm/TruffleHog).
Note the Code scanning *check* on a PR can still flag new alerts even when the
workflow job is green.

**Why two secret scanners?**
Gitleaks (regex/rule-based) and TruffleHog (entropy + verified detectors) have
different strengths; running both reduces false negatives.

**How do I run it on demand?**
Actions tab → *Security Audit* → **Run workflow** (`workflow_dispatch`).

**Where do the High/Medium/Low labels come from?**
From the jq mapping in the *Convert Semgrep report to CSV* step — based on the
rule ID, not a formal severity score. Adjust that step if the buckets don't fit.
