## copy-config

This command creates several files from their respective `.dist` files. For example it creates `.env` files by copying `.env.dist` files, which contain default values for running in development environment, but they need to be updated before deploying to production.

> Please note that if you already have created the .env etc files, running this command will undo any manual changes you have made to them

```bash
yarn copy-config
```

You can see exactly which files are copied where by looking into the `/bin/setup/config.sh` file.

The following files are for development, when deploying to production the values defined in these files are instead defined in the /.k8s yaml files, and `.env.production` for mobile.

- /packages/api/.env
- /packages/cms/.env
- /packages/mobile/.env

The files below need to contain the correct values before deploying to production

- /packages/mobile/.env.production
- /packages/mobile/android/gradle.properties
- /packages/mobile/android/local.properties
- /packages/mobile/ios/release.xcconfig
- /packages/components/src/redux/config.ts

One of the files created is `packages/components/src/redux/config.ts`. Replace 'Example_Encryption_Key' in this file with the appropriate key. It is for redux persist encryption on the local device. If you are taking over the project from another team, REDUX_ENCRYPT_KEY should be requested from the relevant body/person.

The `.env.production` file is automatically used when you build the app for release.

This command also creates files in the /packages/mobile /ios & /android folders, this is where the bundle ID / application ID for the app is defined

To change the bundle ID (iOS) of your app, please change it directly in the untracked `release.xcconfig` file.

Do not change the bundle ID in Xcode because that will affect the `project.pbxproj` file. This way everyone can be using different bundle IDs without needing to commit changes to `project.pbxproj` on separate branches.

To change the android application ID, please the APPLICATION_ID variable directly in the untracked `gradle.properties` file

When you have changed the APPLICATION_ID, run this command to update other android configuration files with this id

```bash
yarn update-android-app-id
```
