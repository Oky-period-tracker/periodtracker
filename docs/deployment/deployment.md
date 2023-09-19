# Deploy

## Mobile

[Deploy android](./android.md)

---

## Deploy the CMS and API

1. Create a DigitalOcean account & Project

In order to create an account you will need to provide a payment method. You can use a credit card or Paypal. You will not be charged until you create a droplet/cluster.

2. [Create a cluster](./cluster.md)
3. [Create a droplet](./database_droplet.md)
4. [Configuration](./cluster_config.md)
5. [Build, tag, push & apply](./build_tag_push_apply.md)
6. [Fixing issues](./fixing_issues.md)
7. [Set up DB via adminer](./adminer.md)

When everything is set up correctly you can quickly redeploy with this command, find more information about this  [here](./build_tag_push_apply.md)

```bash
yarn deploy:k8s
```

---

## Website

[Deploy the delete-account website](./delete_account.md)
