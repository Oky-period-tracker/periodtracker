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

## Environment configuration

There are several untracked files which need to be created for the project to run, these include .env, .properties and .xcconfig files. These can all be created from their templates with this one command

> Please note that if you already have already created and edited these files, running this command overwrite those changes

```bash
yarn copy-config
```

> For an explanation of this command, go [here](./setup_details.md#copy-config)

## Modules

Parts of the project are kept in git submodules, such as assets and translations files, so that they can easily be switched out while still allowing everyone to share this core repo. The `.gitmodules` file is untracked so that you don't need to commit changes to the core repo in order to change which modules you are using.

This one command will remove any submodules you currently have in your project, and download the submodules via the github URLs you have listed in your `urls.sh`

To switch between different submodules, simply change the URLs in your `urls.sh` file, and re-run the command below

> If you have local changes / commits that have not been pushed to github, they will be lost after running this command

```bash
yarn modules
```

> [Here](./modules.md) you will find an explanation of this command, and instructions on setting up your own module repositories

## Firebase

For firebase to run, you need 3 files

- /packages/cms/firebase-config.json
- /packages/mobile/android/app/google-services.json
- /packages/mobile/ios/GoogleService-Info.plist

These files are untracked so each country change these without needing to make changes to this core repo, and to keep the firebase details private.

If you are setting up this project for the first time, you will need to set up firebase you will need to create your own [Firebase](https://learn.buildfire.com/en/articles/2060582-how-to-set-up-your-firebase-certificates-for-ios-and-android) Project. Alternatively, if you are taking over a project, request these files from whoever has access to your firebase project.

You will need to enter your application id / bundle id. The values of these ids can be edited in these files:

- APPLICATION_ID for android: `/packages/mobile/android/gradle.properties`
- PRODUCT_BUNDLE_IDENTIFIER for iOS: `/packages/mobile/ios/release.xcconfig`

You will need to have 2 apps via the [firebase console](https://console.firebase.google.com/), within your new project. An iOS app and Android app, for the react native app. Download the config files for each app and place them in the correct location, the steps can be found [here](https://learn.buildfire.com/en/articles/2060582-how-to-set-up-your-firebase-certificates-for-ios-and-android).

For the CMS, go to:
`Project settings > Service accounts > Firebase Admin SDK > Generate new private key`

This will automatically download a json file, rename this as `firebase-config.json` and save it in the /cms folder as listed above.

### Push notifications
You will need to enable push notifications so that users can send and receive notifications from the CMS. Follow the steps above to make sure everything is correctly configured. For Apple you will need to make sure you have added the [Apple Push Notificatios](https://learn.buildfire.com/en/articles/5760994-how-to-set-up-your-apple-push-notification-key-for-your-ios-firebase-certificate). 

Crashalytics
In order to be able to diagnose any issue and receive reports regarding instabilities or crashes, it is important to setup Firebase crashalytics. You can find instructions [here](https://medium.com/@Bigscal-Technologies/crashlytics-in-react-native-763b53dd5e97).
