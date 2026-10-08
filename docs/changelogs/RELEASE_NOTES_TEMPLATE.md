# Release notes template

Copy this file to `docs/changelogs/vX.Y.Z.md`, fill it in, and paste the result as the body of the GitHub release (`https://github.com/Oky-period-tracker/periodtracker/releases`). The headings follow the v8.5.0 release. Delete any section that has nothing in it; keep the order.

How to write an entry:

- One bullet per change, starting with a bold lead of two to five words, then one or two sentences that say what changed and what the reader will notice. Reference the pull request in parentheses after the lead: `**Multiple users per device** (#250).`
- Name the thing the way users or operators see it (screen, column, endpoint, variable), not the file that implements it.
- Say what happens when the change is off, defaulted or absent, if that matters.
- Numbers belong in the sentence (`5 attempts`, `42 indexes`), not adjectives (`faster`, `more robust`).
- Upgrade notes are for the person deploying. Give them the exact variable, file, command and the order to do things in; say what is optional and what is required; say how to verify and how to roll back.

Sources to walk before writing: `git log vPREVIOUS..HEAD`, the diff of `.env.dist` files, `sql/` for new migration files, `docs/` and `packages/cms/*.md` for documentation added with the change, the submodules (`app/src/resources`, `packages/core/src/common`, `.k8s`) for content or manifest changes that ship with the release.

---

# vX.Y.Z

## Highlights

One paragraph. What this release is for, who notices it (app users, CMS admins, operators), and whether an app store release is required.

## New

- **Feature name** (#PR). What it does and where it appears. Default state if it is behind a flag.

## Improvements

- **Area.** What changed in behaviour that already existed, and why it is better.

## Fixes

- **What was broken** (#PR). What the user saw before, what happens now.

## Backend and API

- **Endpoint or payload change.** Method and path, the field added or changed, the response code when it applies.
- **Migration** `TIMESTAMP-name.sql` adds or changes what. Say whether it is required for the release to run.
- New environment variables:

| Variable | Default | Required | Purpose |
| --- | --- | --- | --- |
| `NEW_VARIABLE` | `value` | Yes / No / Only on X | One line |

## Platform

- **Android / iOS / Expo change.** SDK versions, minimum OS, native dependencies, EAS profiles.

## Build and tooling

- **Dockerfile, Compose, Kubernetes manifest, scripts, CI, documentation added.**

## Upgrade notes

Only when something must be done by hand. Keep the subsections that apply, in this order.

### Feature flags

Which flags ship in this release, their default, what each one hides while off, and what must exist (content options, storage, credentials) before turning one on. How to set them on each platform (`packages/cms/.env`, `cms.yaml`, the ECS env file) and that a restart is needed.

### Database migration

The file to run, how to run it (`psql`), the schema caveat, whether it locks, whether it is re-runnable, whether `initial-setup.sql` was updated, and how to roll back.

### Configuration

New files or secrets to provision (Firebase keys, buckets, certificates), per environment.

### Deployment

Platform-specific steps: network or IAM changes, task definition or manifest changes, health check paths, the deploy command, and how to verify the deployment worked.

### Upgrade checklist

- [ ] Ordered steps, one line each, in the order to run them.
