# How to switch between K8s projects

If you are working on the K8s deployments for multiple teams, you will need to switch between digital ocean accounts and k8s contexts.

### Saving multiple DO and K8s contexts

You can give custom names to your digital ocean context, to more easily recognize which context is for which project

```bash
doctl auth init --context <custom-name>
```

You can see which clusters this context has access to

```bash
doctl kubernetes cluster list
```

Then you can save the context of this cluster, using the id displayed after running the command above

```bash
doctl kubernetes cluster kubeconfig save <id>
```

### Switching between contexts

```bash
doctl auth list
```

```bash
doctl auth switch --context <name>
```

Switch Kubernetes contexts

```bash
kubectl config get-contexts
```

```bash
kubectl config use-context <name>
```
