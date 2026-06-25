# Security Audit Workflow

This document explains the [Security Audit](../.github/workflows/security-audit.yml)
GitHub Actions workflow: what it scans for, when it runs, and how to read the
reports it produces.

## What it is

A single CI job (`setup-check`) that runs a battery of free, open-source
security scanners against the codebase and uploads the results as downloadable
artifacts. It covers four classes of problem:

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

## How to get the results

1. Go to the **Actions** tab on GitHub.
2. Open the **Security Audit** run you care about (e.g. the one for your PR).
3. Scroll to the **Artifacts** section at the bottom of the run summary.
4. Download the artifact(s) you need (see below) and unzip.

### The four artifacts

| Artifact | Files | Use it for |
| --- | --- | --- |
| `semgrep-reports` | `semgrep-report.json`, `semgrep-findings.csv`, `semgrep-summary.csv` | Code-level security findings |
| `npm-audit-reports` | `api-npm-audit.json`, `cms-npm-audit.json`, `npm-audit.csv` | Vulnerable dependencies |
| `gitleaks-report` | `gitleaks-report.json` | Leaked secrets |
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

Both produce JSON. **An empty result is good news.**

- `gitleaks-report.json` containing `{}` (or an empty array) = no secrets found.
  The workflow writes `{}` as a fallback if Gitleaks produces no file, so an
  empty object means "clean / nothing to report".
- `trufflehog-report.json` works the same way — empty/`{}` means clean.

If either contains entries, **treat it as urgent**: a real secret in the repo
should be rotated/revoked immediately (not just deleted from the code, since git
history retains it). Run both because they catch different things — cross-check
any hit.

## Typical workflow for a reviewer

1. Open the run for the PR in the **Actions** tab.
2. Download `semgrep-reports` → open `semgrep-summary.csv`. Any **High**? Open
   `semgrep-findings.csv`, filter to High, review each at `File:Line`.
3. Download `npm-audit-reports` → open `npm-audit.csv`. Address high/critical
   deps with `FixAvailable = Yes` first.
4. Download `gitleaks-report` and `trufflehog-report`. Confirm both are empty.
   If not, rotate the exposed secret and scrub it.

## FAQ

**The check is green but there are findings — is that a bug?**
No. By design every scanner uses `|| true`, so the check passes regardless. Green
means "the scan ran", not "nothing was found". Always open the artifacts.

**Why two secret scanners?**
Gitleaks (regex/rule-based) and TruffleHog (entropy + verified detectors) have
different strengths; running both reduces false negatives.

**How do I run it on demand?**
Actions tab → *Security Audit* → **Run workflow** (`workflow_dispatch`).

**Where do the High/Medium/Low labels come from?**
From the jq mapping in the *Convert Semgrep report to CSV* step — based on the
rule ID, not a formal severity score. Adjust that step if the buckets don't fit.
