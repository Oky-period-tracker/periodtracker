# Deploy

Before deploying, make sure to run the tests and fix any issues. Read more about tests [here](../tests.md).

## Mobile

There are several ways to create release builds, the recommended way is with eas, these builds can be created locally or via eas servers, building online is free within certain usage limits, however building locally is always free

This command has the `--local` tag meaning that the build is created locally on your machine, not on eas servers.

```bash
npx eas build --platform android --profile production --local
```

You can configure these builds in the /app/eas.json file, for example you can change the buildType to `apk` or `aab`

```
"android": {
    "buildType": "apk"
}
```

It is recommended to submit an .aab file to the Play Store rather than an .apk, however apk will also be needed for download via our website

[Read more here](https://docs.expo.dev/build/introduction/) about eas builds

Alternatively you can still create builds locally via Xcode, Android Studio, or gradle commands same as a bare react native app, this circumvents the need for an expo account

```bash
cd app/android
./gradlew assembleRelease
```

---

## Deploy the CMS and API

Go [here](./deployment_overview.md) for a visual overview of the deployment and architecture.

1. Create a DigitalOcean account & Project

In order to create an account you will need to provide a payment method. You can use a credit card or Paypal. You will not be charged until you create a droplet/cluster.

2. [Create a cluster](./cluster.md)
3. [Create a droplet](./database_droplet.md)
4. [Configuration](./cluster_config.md)
5. [Build, tag, push & apply](./build_tag_push_apply.md)
6. [Fixing issues](./fixing_issues.md)
7. [Set up DB via adminer](./adminer.md)

When everything is set up correctly you can quickly redeploy with this command, find more information about this [here](./build_tag_push_apply.md)

```bash
yarn deploy:k8s
```

If you are working on multiple projects with multiple teams, you will need to switch between digital ocean and k8s contexts, the commands to do this are outlined [here](./switch_context.md)

---

## Website

[Deploy the delete-account website](./delete_account.md)
