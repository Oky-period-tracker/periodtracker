Setting up the project

In setting up this project you are required to follow this steps and implement them one after the other in the following sequence regardless of your local machine.

- Generate and add ssh key to your GitHub Account

> To effectively run the "Oky Period Tracker" project, setting up and adding an SSH key to your GitHub account is essential for secure and seamless communication between your local machine and GitHub. SSH keys allow you to clone the repository, push code changes, and pull updates without repeatedly entering your GitHub credentials, ensuring a smoother development workflow and enhanced security for your project interactions.
> Use this to [Generate an ssh key](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent) and [Add the ssh key to your GitHub account](https://docs.github.com/en/enterprise-cloud@latest/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account)

- Clone the repository:

> Navigate to your terminal and run the code below to clone the project to your local machine.

```bash
git clone https://github.com/Oky-period-tracker/periodtracker.git
```

> In your terminal, after successfully cloning the project to your local machine, go to the root directory of the project by running the code below:

```bash
cd periodtracker
```

- Install the dependencies:

> These dependencies are must-have to run the project efficiently, but if you do not have node.Js installed on your local machine, you can get it here. [Node.js](https://nodejs.org/en) afterwards, install yarn globally on your local machine. And proceed with the next step.

on the root directory
example:

> _C:\Users\lucky\periodtracker_

Run this

```bash
yarn
```

Navigate to the /app directory and install the node_modules using yarn

> _cd app_

```bash
yarn
```

## Environment configuration

There are several untracked files which need to be created for the project to run, such as .env files. These can all be created from their templates with this one command

> Make sure you are at the root directory before running these commands

```bash
yarn copy-config
```

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
- /app/src/resources/google-services.json
- /app/src/resources/GoogleService-Info.plist

If you are setting up this project for the first time, you will need to set up firebase you will need to create your own [Firebase](https://learn.buildfire.com/en/articles/2060582-how-to-set-up-your-firebase-certificates-for-ios-and-android) Project. Alternatively, if you are taking over a project, request these files from whoever has access to your firebase project.

You will need to enter your application id / bundle id. The values of these ids can be edited in your`app.json`, which should be kept in your `/app/src/resources` submodule

You will need to have 2 apps via the [firebase console](https://console.firebase.google.com/), within your new project. An iOS app and Android app, for the react native app. Download the config files for each app and place them in the correct location, the steps can be found [here](https://learn.buildfire.com/en/articles/2060582-how-to-set-up-your-firebase-certificates-for-ios-and-android).

For the CMS, go to:
`Project settings > Service accounts > Firebase Admin SDK > Generate new private key`

This will automatically download a json file, rename this as `firebase-config.json` and save it in the /cms folder as listed above.

### Push notifications

The app makes use of firebase messaging to receive push notifications from the CMS.

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
