# Cluster config

## YAML files

First, create your own .k8s module, [go here](../modules.md) for an explanation of git submodules. Use the [whitelabelled](https://github.com/Oky-period-tracker/periodtracker_k8s-whitelabelled) k8s repo as a template for your own.

Edit your `api-ingress.yaml` and `cms-ingress.yaml` files so that the host is correct. Simply replace the `example.com` with your domain name.

Next edit your `cms.yaml` file

`DATABASE_HOST` should be the IP address of the database droplet you created earlier. You can find this IP address in the Digital Ocean dashboard.

Make sure that `DATABASE_NAME` is the same as what you created in the database droplet.

You have not yet created a schema, I recommend calling it `periodtracker`, if you give this a different name you will need to make sure to change the schema name in other places too, eg the create-tables SQL.

Next edit the `api.yaml` file, the changes here will be similar to the `cms.yaml` file except this file also requires a value for `DELETE_ACCOUNT_URL`, if you have not set up the `delete-account` website yet don't worry, you can do this later, but I recommend putting in a value for this URL anyway, so that you don't need to come back and edit this again after setting that up. eg `delete-account.yourdomain.com`

To create a random string for the `APPLICATION_SECRET`, use this command:

```bash
openssl rand -base64 32
```

Check all the other values in these yaml files, eg the docker registry URL will also need to be updated

## Let's Encrypt

In your .k8s submodule, you should have a `letsencrypt.yml` file. This file contains the configuration for the Let's Encrypt Issuer.

Edit this yaml file so that it has a valid email address. This is where Let's Encrypt will send expiry notifications.

You can apply this configuration to your cluster with the following command:

```bash
kubectl apply -f .k8s/letsencrypt.yml
```

If you run this command, you should see some cert-manager pods running

```bash
kubectl get pods --namespace=cert-manager
```

---

## Secrets

Next add the `postgres-credentials` using this command, again make sure that these match the credentials you used earlier when creating the droplet.

```bash
kubectl create secret generic postgres-credentials --from-literal=user=<YOUR_DATABASE_USERNAME> --from-literal=password=<YOUR_DATABASE_PASSWORD>
```

Do the same for the passport secret

```bash
kubectl create secret generic passport --from-literal=secret=<YOUR_PASSPORT_SECRET>
```

Create a secret for `imagePullSecrets`. Use this command and replacing the placeholders with your real values. Make sure that the name of the secret eg `periodtracker-core-registry` matches the name in your `api.yaml` file.

```bash
kubectl create secret periodtracker-core-registry  \
  --docker-server=registry.digitalocean.com/EXAMPLE_REGISTRY \
  --docker-username=EXAMPLE_EMAIL_OR_USERNAME \
  --docker-password=EXAMPLE_PASSWORD_OR_TOKEN \
  --docker-email=EXAMPLE_EMAIL
```

You can check what secrets you have by running this command

```bash
kubectl get secrets
```

Make sure that the container image URL is correct, this should be the same as the one you pushed earlier. eg `registry.digitalocean.com/periodtracker/api:v1`

---

Create config map for CMS firebase

```bash
kubectl create configmap firebase-config --from-file=firebase.conf=./packages/cms/firebase-config.json --namespace=default
```
