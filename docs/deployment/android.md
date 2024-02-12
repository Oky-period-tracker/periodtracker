## Deploy the APK

If you have not already you need to generate a keystore file for the application. This is used to sign the application for release.

You may want to create a /keys folder on your machine to store the keystore file.

```bash
mkdir ~/keys
cd ~/keys
```

Generate a keystore file:

```bash
keytool -genkey -v -keystore periodtracker.keystore -alias periodtracker -keyalg RSA -keysize 2048 -validity 10000
```

Increase the `VERSION` number in `gradle.properties`

Check that the APPLICATION_ID in `app/build.gradle` is correct.

Ensure that your google-services.json file in /packages/mobile/android/app/ is correct and is registered with the correct APPLICATION_ID

When you have changed the APPLICATION_ID, run this command to update other android configuration files with this id

```bash
yarn update-android-app-id
```

Check the values in `/packages/mobile/.env.production` file are correct.

Add to `packages/mobile/android/local.properties`:

```
sdk.dir=/Users/dev/Library/Android/sdk
STORE_FILE=periodtracker.keystore
STORE_PASSWORD=**(NotPublic)**
KEY_ALIAS=periodtracker
KEY_PASSWORD=**(NotPublic)**
```

User this command to find your sdk.dir path:

```bash
echo $ANDROID_HOME
```

<strong>Note:</strong> Add your own key alias and key passwords with your own key store to release your own variant. `**(NotPublic)**` should be replaced. For releases to the main application request the appropriate information/ keystore files.

<strong>Note:</strong> Do not forget to add you sdk and ndk file directories specific to your development environment:

```
// example depends on OS and specific environment set up
ndk.dir=/Users/**My_USER_NAME**/Library/Android/sdk/ndk-bundle
sdk.dir=/Users/**My_USER_NAME**/Library/Android/sdk
//... remainder of the local.properties
```

You will also need to ensure a few things:

- The build version has been bumped in `app/build.gradle`
- The firebase config .json has been included and is configured (the name matches) as mentioned above.
- You have cleaned and synced gradle files. Do it twice just to be sure ;)

Build the apk for release with (remember to sync your gradle files!):

Clean the project:

```bash
yarn clean
```

Compile

```bash
yarn compile
```

```bash
cd packages/mobile/android
./gradlew assembleRelease
```

You can find the newly created APK file at `packages/mobile/android/app/build/outputs/apk/release/app-release.apk`
