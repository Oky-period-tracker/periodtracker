# Period tracker

This is a period tracker application monorepo, consisting of a React Native app, a CMS and an API.

## Quick start (Expo Go)

The fastest way to see the app running. Assumes Node 20, Yarn, and Docker are already installed. See [dependencies](./docs/dependencies/index.md) if not.

### 1. Install Expo Go on your device or emulator

Before running any terminal command, install the Expo Go app on the device you want to test on. This is what loads the JavaScript bundle once `yarn dev:app` is running.

* Android phone or Android emulator: [Play Store listing](https://play.google.com/store/apps/details?id=host.exp.exponent)
* iPhone or iOS simulator: [App Store listing](https://apps.apple.com/app/expo-go/id982107779)

If you use an Android emulator without Google Play Services, download the APK from the [Expo Go releases page](https://expo.dev/go) and drag it onto the emulator window.

### 2. Add a Firebase service account for the CMS

The CMS calls `firebase-admin` on startup (for push notifications and Firebase Storage voice-over files). Without a service account key it refuses to boot and the `cms` container exits with `Could not load the default credentials`.

1. Go to the [Firebase console](https://console.firebase.google.com/) and open the project you want to use for local dev. Create one if you do not have it yet.
2. Open **Project settings > Service accounts**, click **Generate new private key**, and save the JSON that downloads.
3. Rename the file to `firebase-config.json` and place it at `packages/cms/firebase-config.json` in this repo.

The file is in `.gitignore`, so it will not be committed. For more detail (including `STORAGE_BUCKET` / `STORAGE_BASE_URL` wiring for voice-over files and push notifications) see [docs/setup.md](./docs/setup.md#firebase).

### 3. Bring up the backend

Copy-paste from the repository root, in one terminal:

```bash
# 3.1 Install dependencies
yarn

# 3.2 Copy env templates and submodule URL config
yarn copy-config

# 3.3 Fetch the whitelabel submodules (assets, translations, k8s, delete-account)
yarn modules

# 3.4 Start the backend (api + cms + postgres + adminer). Leave this running.
yarn dev
```

### 4. Seed the database and start the app

Open a second terminal:

```bash
# 4.1 Seed the database (schema, tables, admin user, content).
#     Destructive, it drops the periodtracker schema. --force skips the prompt
#     so the quick start can be re-run end to end without interaction.
yarn db:init --force

# 4.2 Start the Expo dev server
yarn dev:app

# 4.3 For an Android emulator, forward the API ports into the emulator
yarn reverse:all-ports
```

### 5. Open the app in Expo Go

Scan the QR code that `yarn dev:app` prints with the Expo Go app on your device, or press `a` / `i` in the Expo terminal to open an Android / iOS simulator. Expo Go gives you the app without the native dev build step and does not need `google-services.json`.

If you need a native dev build (for example to test push notifications or Firebase features that Expo Go skips), see [start_project.md](./docs/start_project.md#expo).

**Oky internal developers** working with the branded avatars, real Firebase config and the Oky EAS project: see [docs/private_resources.md](./docs/private_resources.md) for the `OKY_PRIVATE_RESOURCES` flag and the `periodtracker_resources-global` overlay.

---

## Detailed guides

[Install Software Dependencies](./docs/dependencies/index.md)

[Set Up the Project](./docs/setup.md)

[Start the Project](./docs/start_project.md)

[Run the project locally](./docs/run_project.md)

[Test the Project](./docs/tests.md)

[Overview of deployment and architecture](./docs/deployment/deployment_overview.md)

[Deploy the Project](./docs/deployment/deployment.md)

[Common Commands, Testing, Tips, and Tools](./docs/misc.md)

---

### Localisation

[Translations](./docs/localisation/translations.md)

[Updating content](./docs/localisation/updating_content.md)

[Lottie & image validation](./docs/localisation/asset_validation.md)

---

### Code

[Contributing](./CONTRIBUTING.md)

[Learn about Oky](./AboutOky.md)

[Submodules](./docs/modules.md)

[Importing optional submodules](./docs/code/optional_submodules.md)

[Understanding the CMS & API routes](./docs/code/routes.md)

[Recommended reading for developers](./docs/code/recommended_reading.md)
