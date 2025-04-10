## Setting up the project

In setting up this project you are required to follow this steps and implement them one after the other in the following sequence regardless of your local machine.

### Generate and add ssh key to your GitHub Account

To effectively run the "Oky Period Tracker" project, setting up and adding an SSH key to your GitHub account is essential for secure and seamless communication between your local machine and GitHub. SSH keys allow you to clone the repository, push code changes, and pull updates without repeatedly entering your GitHub credentials, ensuring a smoother development workflow and enhanced security for your project interactions.

- Use the [Guide to generate an ssh key](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)

- Follow the steps to [Add the ssh key to your GitHub account](https://docs.github.com/en/enterprise-cloud@latest/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account)

### Clone the repository:

Open your terminal and run the following command to clone the project:

```bash
git clone https://github.com/Oky-period-tracker/periodtracker.git
```

After cloning the project to your local machine, navigate to the root directory of the project:

```bash
cd periodtracker
```

### Install the dependencies:

- Install the required dependencies:

  - Ensure that Node.js is installed on your local machine.[Download Node.js here](https://nodejs.org/en)

- Install Yarn globally:

```
npm install -g yarn
```

At the root directory of the project (e.g., `C:\Users\lucky\periodtracker`)

Run this

```bash
yarn
```

Navigate to the `/app` directory and install the node_modules:

```bash
cd app
```

```bash
yarn
```

## Environment configuration

There are several untracked files which need to be created for the project to run, such as .env files. These can all be created from their templates with this one command

- Ensure you are at the root directory before running these commands

```bash
yarn copy-config
```

## Modules

Parts of the project, such as assets and translation files, are stored in Git submodules. These submodules allow for easy swapping and sharing without affecting the core repository.

- To reset and download the submodules listed in your urls.sh file, run this command

```bash
yarn modules
```

- This command removes any existing submodules and downloads new ones based on the URLs specified in urls.sh.
  This one command will remove any submodules you currently have in your project, and download the submodules via the github URLs you have listed in your `urls.sh`

- To switch submodules, update the URLs in your urls.sh file and re-run the command

  - Note: Local changes or commits not pushed to GitHub will be lost after running this command.

Refer to [Modules.md](./modules.md) The documentation has been updated to include a detailed and organized explanation of the project setup steps. Let us know if further adjustments are needed!

## Firebase

Firebase Setup Documentation

Required Files

To set up Firebase for this project, you will need the following files:

- `/app/src/resources/google-services.json` (Android)

- `/app/src/resources/GoogleService-Info.plist` (iOS)

- /`packages/cms/firebase-config.json` (CMS)

### Initial Setup

If you are setting up this project for the first time, follow these steps:

- Create a Firebase Project:

Using this [guide](https://learn.buildfire.com/en/articles/2060582-how-to-set-up-your-firebase-certificates-for-ios-and-android) to learn how to create Android and iOS project on Firebase. After learning about the steps, you can proceed to the
[Firebase console](https://console.firebase.google.com/u/0/) and create a new project for Android and iOS.

- Set Application ID / Bundle ID:

  - In your project, locate your application id or bundle id in the `app.json` file.

  - This file should be located in the `/app/src/resources`submodule.

- Create Firebase Apps:

Create two apps within your Firebase project:

- One for Android.

- One for iOS.

- Download the respective configuration files:

  - For Android: `google-services.json.`

  - For iOS: `GoogleService-Info.plist.`

- Place these files in the appropriate locations as listed above. which is the `app/src/resources folder.`

### CMS Setup

For the CMS, follow these steps:

- Navigate to the Firebase Console:

- Go to Project `settings > Service accounts > Firebase Admin SDK.`

- Generate a Private Key:

  - Click on Generate new private key.

  - A JSON file will be downloaded automatically.

- Save and Rename:

  - Rename the downloaded file to firebase-config.json.

  - Place it in the /cms folder which is located at /packages/cms in the project.

### Push Notifications

The app uses Firebase Messaging to handle push notifications sent from the CMS.

Ensure that your `app.json` file includes this:

```json
{
  "expo": {
    "ios": {
      "entitlements": {
        "aps-environment": “production”
      }
    }
  }
}
```

For Apple you will need to make sure you have added the [Apple Push Notifications](https://learn.buildfire.com/en/articles/5760994-how-to-set-up-your-apple-push-notification-key-for-your-ios-firebase-certificate).

Read more [here](https://rnfirebase.io/messaging/usage), bear in mind that this is an expo managed project, so changes within the native `/android` and `/ios` folders are not required

Notifications can also be customised eg the colour, via the `app.json`

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
