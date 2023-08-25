## Setup

Clone the repository:

```bash
git clone REPO_SSH_URL
```

<strong>Note:</strong> Replace `REPO_SSH_URL` with the url for this repository. On github, click on the green _Code_ button, select SSH and copy paste the url

Go to the root directory of the project:

```bash
cd periodtracker
```

Install the dependencies:

```bash
yarn
```

## Modules

Parts of the project are kept in git submodules, such as assets and translations files, so that they can easily be switched out while still allowing everyone to share this core repo. The `.gitmodules` file is untracked so that you don't need to commit changes to the core repo in order to change which modules you are using.

Use this command to create the `/bin/modules/urls.sh` file.

> If you already have created the `urls.sh`, running this command will overwrite any changes you may have made

```bash
yarn copy-modules-urls
```

Use this command to clone / update the git submodules:

```bash
./bin/modules/pull.sh
```

By default `urls.sh` file contains the public whitelabelled modules,
To use different modules, remove any modules you currently have using the command below, change the urls in your `urls.sh` file, then run the above pull command again

```bash
./bin/modules/remove.sh
```

> [Here](./modules.md) you will find instructions on setting up your own module repositories

## Environment configuration

Create .env, .properties and .xcconfig files for cms, api and mobile with one command

> Please note that if you already have already created and edited these files, running this command overwrite those changes

```bash
yarn copy-env:all
```

> For an explanation of this command, go [here](./setup_details.md#copy-env)

## Redux config

Create the redux config file by running this command:

```bash
yarn copy-redux-config
```

This file is untraced. It is for redux persist encryption on the local device

If you are taking over the project from another team, REDUX_ENCRYPT_KEY should be requested from the relevant body/person.

Replace 'Example_Encryption_Key' in `packages/components/src/redux/config.ts` with the appropriate key.

## Firebase

For firebase to run, you need 3 files

- /packages/cms/firebase-config.json
- /packages/mobile/android/app/google-services.json
- /packages/mobile/ios/GoogleService-Info.plist
- /.k8s/firebase-config.yaml

These files are untracked so each country change these without needing to make changes to this core repo, and to keep the firebase details private.

If you are setting up this project for the first time, you will need to set up firebase you will need to create your own [Firebase](https://console.firebase.google.com/) Project. Alternatively, request these files from whoever has access to your firebase project.

You will need to have 2 apps via the [firebase console](https://console.firebase.google.com/), within your new project. An iOS app and Android app, for the react native app. Download the config files for each app and place them in the correct location, as listed above.

For the CMS, go to:
`Project settings > Service accounts > Firebase Admin SDK > Generate new private key`

This will automatically download a json file, rename this as `firebase-config.json` and save it in the /cms folder as listed above. Use this same json file to fill in the `.k8s/firebase-config.yaml` file.
