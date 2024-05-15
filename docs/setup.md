## Setup

[Generate an ssh key](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)

[Add the ssh key to your GitHub account](https://docs.github.com/en/enterprise-cloud@latest/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account)

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

When you have changed the APPLICATION_ID, run this command to update other android configuration files with this id

```bash
yarn update-android-app-id
```

You will need to have 2 apps via the [firebase console](https://console.firebase.google.com/), within your new project. An iOS app and Android app, for the react native app. Download the config files for each app and place them in the correct location, the steps can be found [here](https://learn.buildfire.com/en/articles/2060582-how-to-set-up-your-firebase-certificates-for-ios-and-android).

For the CMS, go to:
`Project settings > Service accounts > Firebase Admin SDK > Generate new private key`

This will automatically download a json file, rename this as `firebase-config.json` and save it in the /cms folder as listed above.

### Push notifications

You will need to enable push notifications so that users can send and receive notifications from the CMS. Follow the steps [above](https://learn.buildfire.com/en/articles/2060582-how-to-set-up-your-firebase-certificates-for-ios-and-android) to make sure everything is correctly configured. For Apple you will need to make sure you have added the [Apple Push Notifications](https://learn.buildfire.com/en/articles/5760994-how-to-set-up-your-apple-push-notification-key-for-your-ios-firebase-certificate).

### Crashalytics

In order to be able to diagnose any issue and receive reports regarding instabilities or crashes, setup Firebase crashalytics. You can find instructions [here](https://medium.com/@Bigscal-Technologies/crashlytics-in-react-native-763b53dd5e97).

### Voice Over (optional)

Add audio recordings for encyclopedia articles

In the firebase console, set up cloud storage

Update your cms .env file with the following

Copy paste your bucket name, eg `gs://periodtracker-example.appspot.com` from the firebase console and use that as your STORAGE_BUCKET

The STORAGE_BASE_URL is used to fetch your files from storage, this url includes your bucket name but without the `gs://` prefix, for example

```
https://firebasestorage.googleapis.com/v0/b/YOUR_BUCKET_NAME

https://firebasestorage.googleapis.com/v0/b/periodtracker-example.appspot.com
```

```env
STORAGE_BUCKET=gs://periodtracker-example.appspot.com
STORAGE_BASE_URL=https://firebasestorage.googleapis.com/v0/b/periodtracker-example.appspot.com
```

Similarly in the /mobile .env file, you need to add the STORAGE_BASE_URL, with the same value

```env
STORAGE_BASE_URL=https://firebasestorage.googleapis.com/v0/b/periodtracker-example.appspot.com
```

Set your firebase rules in the firebase console

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true; // Anyone can read the files
      allow write: if false; // Only the CMS can write files via firebase-admin which uses the keys in the json config to bypass this rule
    }
  }
}
```

To deploy this, you need to update your cms.yaml file

For example:

```yaml
- name: STORAGE_BUCKET
    value: 'gs://periodtracker-example.appspot.com'
- name: STORAGE_BASE_URL
    value: 'https://firebasestorage.googleapis.com/v0/b/periodtracker-example.appspot.com'
```
