# Deploy

Before deploying, make sure to run the tests and fix any issues. Read more about tests [here](../tests.md).

## Mobile

Before deploying, check:

- APPLICATION_ID for android: `/packages/mobile/android/gradle.properties`
- PRODUCT_BUNDLE_IDENTIFIER for iOS: `/packages/mobile/ios/release.xcconfig`
- Other values in the above files are correct, such as APP_DISPLAY_NAME, VERSION_CODE
- The values in `/packages/mobile/.env.production` file

[Deploy android](./android.md)

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
