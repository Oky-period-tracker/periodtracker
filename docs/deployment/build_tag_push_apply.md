## Build, tag, push & apply

You can build, tag push & apply with one command.

This command runs the tests first, so you can be sure that the code is working before deploying. You may first need to clean and compile the code in order for the tests to pass. Read more about tests [here](../tests.md).

First make sure that the contents of the `/.k8s/deploy-k8s.sh` file are correct, you may need to correct the registry URL. You may also want to change the tags from `latest` to actual version numbers `v1`.

> If you are using an M1 Mac, before building you need to use the `--platform linux/amd64` flag. Edit all 3 of the `Dockerfile`s, comment out the `FROM` line(s) and uncomment the `FROM --platform linux/amd64` line(s), above it.

Then run this command to deploy:

```bash
yarn deploy:k8s
```

If you have a permission issue running that command, you can allow permission for all .sh files in this project:

```bash
find ./ -type f -iname "*.sh" -exec chmod +x {} \;
```

If you encounter issues you may want to deploy the project step by step instead, in that case keep reading. There are tips for debugging at the bottom.

---

### Build

Build the docker containers

> If you are using an M1 Mac, before building you need to use the `--platform linux/amd64` flag. Edit all 3 of the `Dockerfile`s, comment out the `FROM` line(s) and uncomment the `FROM --platform linux/amd64` line(s), above it.

```bash
docker-compose build --no-cache
```

---

### Tag

Tag each container:
(you need to do this for all three containers: base, api and cms)

```bash
docker tag <NAME_OF_IMAGE>:latest <REGISTRY_URL>/<NAME_OF_IMAGE>:v<VERSION_NUMBER>
```

Example:

```bash
docker tag oky/base:latest registry.digitalocean.com/periodtracker/base:v1
docker tag periodtracker-cms:latest registry.digitalocean.com/periodtracker/cms:v1
docker tag periodtracker-api:latest registry.digitalocean.com/periodtracker/api:v1
```

Next, push the containers to the registry

```bash
docker push <DOCKER_HUB_ACCOUNT_NAME>/<RELEVANT_CONTAINER>:v<VERSION_NUMBER>
```

Example:

```bash
docker push registry.digitalocean.com/periodtracker/base:v1
docker push registry.digitalocean.com/periodtracker/cms:v1
docker push registry.digitalocean.com/periodtracker/api:v1
```

If you go to Digital Ocean, you should see the images in the registry.

---

## Apply

Apply the ingress files:

```bash
kubectl apply -f .k8s/api-ingress.yaml
kubectl apply -f .k8s/cms-ingress.yaml
```

Apply the API and CMS files:

```bash
kubectl apply -f .k8s/api.yaml
kubectl apply -f .k8s/cms.yaml
```

You can check the status of the pods with this command,

```bash
kubectl get pods -A
```

If everything worked then they should soon be running. Try going to the API and CMS in your browser. If they are working then you are done. If something has gone wrong, see tips on [fixing issues](./fixing_issues.md)
