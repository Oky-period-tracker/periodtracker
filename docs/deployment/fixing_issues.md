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
kubectl logs <POD_NAME>
```

If you include the `-f` flag you can follow the logs in real time

```bash
kubectl logs -f <POD_NAME>
```

Sometimes you may need to delete a pod, and let it restart. You can do this with the following command

```bash
kubectl delete pod <POD_NAME>
```

If you want to actually delete the pods, and you do NOT want them to restart, you can do so like this. You can restart them by using the `kubectl apply` commands from earlier.

```bash
kubectl delete deployment api --namespace=default
kubectl delete deployment cms --namespace=default
```
