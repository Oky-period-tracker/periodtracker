# Database set up

You should now have a database droplet, and a cluster with an adminer pod. Check what pods are running with this command

```bash
kubectl get pods -A
```

## Access adminer

Access the adminer via port forwarding, copy paste the pod name from the list of pods you got from the previous command

```bash
kubectl port-forward pods/<POD_NAME> 9090:8080 -n default
```

> Be careful never to get confused between dev adminer running on your machine, and a production adminer that you are accessing via port forwarding. This is the reason why I changed the port from 8080 to 9090.

You can now access adminer via http://localhost:9090

To log in, use the credentials for the database that you used when setting up the droplet. The `Server` field is the IP address of the database droplet, which can be found in the DigitalOcean dashboard.

Once logged in, you will need to create a schema and the tables & views, similar to what you likely already have done for the dev database. [Go here](../start_project.md) for instructions on how to do that, under 'manual migration'.
