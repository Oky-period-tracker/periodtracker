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

If you are setting up this project for the first time, you will need to set up firebase you will need to create your own [Firebase](https://console.firebase.google.com/) Project. Alternatively, request these files from whoever has access to your firebase project.

You will need to have 2 apps via the [firebase console](https://console.firebase.google.com/), within your new project. An iOS app and Android app, for the react native app. Download the config files for each app and place them in the correct location, as listed above.

For the CMS, go to:
`Project settings > Service accounts > Firebase Admin SDK > Generate new private key`

This will automatically download a json file, rename this as `firebase-config.json` and save it in the /cms folder as listed above.
