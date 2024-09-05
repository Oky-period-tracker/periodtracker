## Common commands

Install packages:

```bash
npx expo install
```

Check the expo project

```bash
npx expo-doctor
```

How run the backend in production mode:

```bash
docker-compose -f docker-compose.yml build --no-cache
docker-compose -f docker-compose.yml up
```

Remove all node_modules and Pods

```bash
yarn rm
```

Remove all node_modules, Pods and then reinstall them:

```bash
yarn reinstall
```

Clear docker
Useful for freeing up disk space and occasionally fixing strange bugs, but will make your next build take a lot longer

```bash
yarn rm:docker
```

Delete all docker volumes
(This will delete all the data in your databases, use with caution)

```bash
docker volume rm $(docker volume ls -q)
```

## Tips

### Running Tests

- There are a few unit tests added and can be expanded upon as needed.

- Two test suites can be run from the root:

1. `yarn run test:prediction-engine` runs the prediction engine test suite
2. `yarn run test:saga` runs the redux and sagas test suite
3. `yarn run test:all` will run both consecutively

Use this command to allow the emulator to access the internet:

```bash
emulator -avd <EMULATOR_NAME> -dns-server 8.8.8.8
```
