# Kubernetes cluster

Go to Digital Ocean and create a Kubernetes cluster.

As with the droplet, when selecting the region bear in mind that there may be legal implications. For example, if you are in the EU, you may want to select a region in the EU. Also the closer the region the better the performance.

Considering selecting autoscaling to allow the cluster to automatically add / remove nodes based on the demand. If you choose fixed, you will likely need at least 2-3 nodes. If you are creating the cluster for development purposes only then 1 node may be sufficient.

If you have not already, install doctl

```bash
brew install doctl
```

Follow the steps on the digital ocean website to create an API token, and use that token to grant account access to doctl.

Validate that doctl is working by running

```bash
doctl account get
```

Connect to kubernetes,
Copy paste the command provided via digital ocean, it will look like this

```bash
doctl kubernetes cluster kubeconfig save <id>
```

Verify that you are connected to the cluster by running

```bash
kubectl get nodes
```

---

## Install nginx ingress controller

First you need to install helm if you have no already done so

```bash
brew install helm
```

Add the ingress-nginx Helm chart repository:

```bash
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
```

Ensure you have the latest versions

```bash
helm repo update
```

Install the Nginx Ingress Controller:

This command installs the Nginx Ingress Controller in the Kubernetes cluster. We're using the ingress-nginx chart from the ingress-nginx repository, and we're naming our Helm release nginx-ingress. The --create-namespace flag creates the specified namespace if it doesn't exist:

```bash
helm install nginx-ingress ingress-nginx/ingress-nginx --namespace ingress-nginx --create-namespace
```

Please note that it might take a few minutes for the Nginx pods and related resources to be fully up and running.

You can check the status of the Nginx Ingress Controller with this command:

```bash
kubectl get pods --namespace=ingress-nginx
```

You should see the Nginx Ingress Controller pod(s) listed, and their status should be "Running"

---

## Install cert manager

Add the Jetstack Helm repository

```bash
helm repo add jetstack https://charts.jetstack.io
```

Ensure you have the latest versions

```bash
helm repo update
```

Install cert-manager

This command installs cert-manager in the cert-manager namespace:

```bash
kubectl create namespace cert-manager
helm install cert-manager jetstack/cert-manager --namespace cert-manager --version v1.6.1 --set installCRDs=true
```

Create a Let's Encrypt Issuer

In your .k8s submodule, you should have a letsencrypt.yml file. This file contains the configuration for the Let's Encrypt Issuer. If you are unsure about submodules, please see the [submodule documentation](../modules.md).

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

## Install adminer

Clone the helm-adminer repository, outside of this repository

Change directory out of this repository

```bash
cd ..
```

Clone the repository

```bash
git clone https://github.com/cetic/helm-adminer.git
```

Change directory into the repository

```bash
cd helm-adminer
```

Install adminer

```bash
helm install adminer .

```

## DNS Records

Run this command to get the IP address of the load balancer

```bash
kubectl get svc -n ingress-nginx
```

Copy paste the external IP address, and go to your domain name provider. Create A records for the API and CMS, both of which point to this same IP address. For example `api.example.com` & `cms.example.com`. Bear in mind that DNS propagation can take up to 48 hours.

## Container registry

In Digital Ocean, on the left side panel, click on "Container Registry", and create a new registry. The free tier will not be enough as this only allows for 1 repo, but we have 3.

Follow the steps provided by Digital Ocean.

```bash
doctl registry login
```

Tick the checkbox to integrate the registry with your cluster

## Secrets

---

## Update yaml files

---

## Build, tag, push & apply

Build the docker containers

```bash
docker-compose build
```

Tag each container:
(you need to do this for all three containers: base, api and cms)

```bash
docker tag <NAME_OF_IMAGE>:latest <REGISTRY_URL>/<NAME_OF_IMAGE>:v<VERSION_NUMBER>
```

Example

```bash
docker tag oky/base:latest registry.digitalocean.com/periodtracker/base:v1
docker tag periodtracker-cms:latest registry.digitalocean.com/periodtracker/cms:v1
docker tag periodtracker-api:latest registry.digitalocean.com/periodtracker/api:v1
```

Next, push the containers to the registry

```bash
docker push <DOCKER_HUB_ACCOUNT_NAME>/<RELEVANT_CONTAINER>:v<VERSION_NUMBER>
```

Example

```bash
docker push registry.digitalocean.com/periodtracker/base:v1
docker push registry.digitalocean.com/periodtracker/cms:v1
docker push registry.digitalocean.com/periodtracker/api:v1
```

If you go to Digital Ocean, you should see the images in the registry.

---

Next you need to make sure that your yaml files in the .k8s folder are correct.

Go [here](../setup.md#firebase) to see how to set up the firebase yaml file if you have not already done so.

Edit your `api-ingress.yaml` and `cms-ingress.yaml` files so that the host is correct. Simply replace the `example.com` with your domain name.

Edit your cms.yaml file

DATABASE_HOST should be the IP address of the database droplet you created earlier. You can find this IP address in the Digital Ocean dashboard. Make sre that DATABASE_NAME & DATABASE_SCHEMA are the same as what you created in the database droplet.

Next add the postgres-credentials using this command, again make sure that these match the credentials you used earlier when creating the droplet.

```bash
kubectl create secret generic postgres-credentials --from-literal=user=<YOUR_DATABASE_USERNAME> --from-literal=password=<YOUR_DATABASE_PASSWORD>
```

Do the same for the passport secret

```bash
kubectl create secret generic passport --from-literal=secret=<YOUR_PASSPORT_SECRET>
```

Make sure that the container image URL is correct, this should be the same as the one you pushed earlier. eg registry.digitalocean.com/periodtracker/api:v1

Add your registry credentials

```bash
kubectl create secret docker-registry periodtracker-registry \
  --docker-server=registry.digitalocean.com \
  --docker-username=<YOUR_USERNAME> \
  --docker-password=<YOUR_PASSWORD> \
  --docker-email=<YOUR_EMAIL>
```

Next edit the `api.yaml` file, the changes here will be similar to the `cms.yaml` file. This file also requires a value for `DELETE_ACCOUNT_URL`, if you have not set up the `delete-account` website yet don't worry, you can do this later, but I recommend putting in a value for this URL anyway, so that you don't need to come back and edit this again after setting that up. eg `delete-account.yourdomain.com`

When the yaml files are correct, you can apply them to the cluster

```bash
kubectl apply -f .k8s/api-ingress.yaml
kubectl apply -f .k8s/cms-ingress.yaml

kubectl apply -f .k8s/api.yaml
kubectl apply -f .k8s/cms.yaml
```

---

## Fixing issues

If your API and CMS are not up and running like you would expect, here are some suggestions to find and solve the problem.

First check that the pods are running

```bash
kubectl get pods -A
```

This will list all of your pods, and their status. If you see any pods that are not running, you can get more information about them with this command

```bash
kubectl describe pod <POD_NAME>
```

This will give you more information about the pod, and hopefully give you some clues as to why it is not running.

Check the logs of a container:

```bash
kubectl logs <pod_name> -c <container_name> --previous
```

Sometimes you may need to delete a pod, and let it restart. You can do this with the following command

```bash
kubectl delete pod <pod_name>
```
