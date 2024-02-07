# Kubernetes cluster

Go to Digital Ocean and create a Kubernetes cluster.

When selecting the region bear in mind that there may be legal implications. For example, if you are in the EU, you may want to select a region in the EU. Also the closer the region the better the performance.

Considering selecting autoscaling to allow the cluster to automatically add / remove nodes based on the demand. If you choose fixed, you will likely need at least 2-3 nodes. If you are creating the cluster for development purposes only then 1 node may be sufficient.

Install doctl

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

First you need to install helm

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

```bash
helm install nginx-ingress ingress-nginx/ingress-nginx --namespace ingress-nginx --create-namespace
```

> Please note that it might take a few minutes for the Nginx pods and related resources to be fully up and running.

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

```bash
kubectl create namespace cert-manager
helm install cert-manager jetstack/cert-manager --namespace cert-manager --version v1.6.1 --set installCRDs=true
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

Copy paste the external IP address, and go to your domain name provider. Create 2 `A` records for the API and CMS, both of which point to this same IP address. For example `api.example.com` & `cms.example.com`. Bear in mind that DNS propagation can take up to 48 hours.

Example:

```
cms.example.com.  A  123.45.67.89
api.example.com.  A  123.45.67.89
```

You can use this command to verify that your DNS is set up correctly

```bash
nslookup cms.example.com
```

## Container registry

In Digital Ocean, on the left side panel, click on "Container Registry", and create a new registry. The free tier will not be enough as this only allows for 1 repo, but we have 3.

Follow the steps provided by Digital Ocean.

```bash
doctl registry login
```

Tick the checkbox to integrate the registry with your cluster

Next you need to add secrets and edit the yaml files.
