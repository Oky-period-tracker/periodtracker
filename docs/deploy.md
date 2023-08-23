## Deploy the backend (CMS / API)

- Build the docker containers for production:

```bash
docker-compose -f docker-compose.yml build --no-cache
```

- Tag each container:

```
docker tag periodtracker-cms_<RELEVANT_CONTAINER>:latest <DOCKER_HUB_ACCOUNT_NAME>/<RELEVANT_CONTAINER>:v<VERSION_NUMBER>
```

eg:

```
docker tag periodtracker-cms:latest mydockeraccount/cms:v9
```

- Push each container:

```
docker push <DOCKER_HUB_ACCOUNT_NAME>/<RELEVANT_CONTAINER>:v<VERSION_NUMBER>
```

eg:

```
docker push mydockeraccount/cms:v9
```

- Now your container has been pushed to your account. Its time to apply that to the kubernetes cluster:
  (Note: You should make sure your kubernetes cluster is connected to the appropriate Docker Hub account)

-Checkout the k8s branch `git checkout k8s`

-Navigate to the relevant .yaml file in the k8s directory in the root of the project (ie for cms it will be `k8s/cms.yaml`)

-Bump the version number to the version of the container that was just pushed (ie v9 in the example)

-Run the following command (substitute cms for whatever container) from the root:

```
kubectl apply -f .k8s/cms.yaml
```

You are done. If you navigate to the cluster you should see updated versions on the containers.

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

Check the values in `/packages/mobile/.env` file are correct.

Add to `packages/mobile/android/local.properties`:

```
STORE_FILE=periodtracker.keystore
STORE_PASSWORD=**(NotPublic)**
KEY_ALIAS=periodtracker
KEY_PASSWORD=**(NotPublic)**
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
./gradlew clean
```

```bash
cd packages/mobile/android
./gradlew assembleRelease
```
