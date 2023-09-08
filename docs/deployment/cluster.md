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
