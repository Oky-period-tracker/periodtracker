# Private resources (Oky internal only)

`app/src/resources/` ships a generic whitelabel baseline. To get the branded avatars, real Firebase config, and the Oky EAS project, follow the steps below.

Prerequisites: you have run the public Quick start from [README.md](../README.md) at least once, and you have SSH read access to `periodtracker_resources-global`.

## 1. Enable the flag

Open `app/.env` and change the last line:

```
OKY_PRIVATE_RESOURCES=0
```

to:

```
OKY_PRIVATE_RESOURCES=1
```

## 2. Log in to EAS, once per machine

```bash
npx expo login
```

Use an Expo account that is a member of the Oky EAS organisation.

Or use a personal access token from https://expo.dev/settings/access-tokens:

```bash
export EXPO_TOKEN=exp_...
```

Add `export EXPO_TOKEN=...` to your shell profile to make it permanent.

## 3. Start the backend

```bash
# Terminal 1, from the repository root
yarn dev
```

The first invocation clones `periodtracker_resources-global` into `app/src/resources-global/` (gitignored), then brings up postgres / adminer / api / cms.

## 4. Seed the database and start the app

```bash
# Terminal 2, from the repository root
yarn db:init --force
yarn dev:app
yarn reverse:all-ports   # Android emulator only
```

Metro routes imports from `app/src/resources` to `app/src/resources-global`, `app.config.js` loads the private `app.json` with the Oky bundle id and real EAS `projectId`. Scan the QR with Expo Go.

## 5. Edit private resources

`app/src/resources-global/` is a real git checkout of `periodtracker_resources-global`. Treat it like a submodule:

```bash
cd app/src/resources-global
git checkout -b feat/your-branch
# edit files
git commit -am "..."
git push
```

## 6. Switch back to public

Open `app/.env` and change:

```
OKY_PRIVATE_RESOURCES=1
```

back to:

```
OKY_PRIVATE_RESOURCES=0
```

Re-run `yarn dev:app`. `app/src/resources-global/` stays on disk, Metro ignores it, no EAS prompt. Nothing to clean.

## 7. EAS Build

For EAS Build pipelines, set `OKY_PRIVATE_RESOURCES=1` as a profile env var in `eas.json` and add an `eas-build-pre-install` hook that runs `./bin/resources-switch.sh` so the build machine clones the private repo before `expo prebuild`.
