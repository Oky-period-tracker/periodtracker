# Run the project locally

How to get the project running locally once everything has been set up

This command starts the CMS and API

```bash
yarn dev
```

Start expo for mobile development

```bash
yarn dev:app
```

----

If you want to run the application on your own device through Expo, make sure to update the `.env` file of the application in order to replace `http://localhost:3000` with your IP address.

Example on Mac, run command to get your local IP:

```
ipconfig getifaddr en0
# e.g. 192.168.1.42
```

Update your `.env` file:

```
EXPO_PUBLIC_API_BASE_URL=http://192.168.1.42:3000
EXPO_PUBLIC_API_BASE_CMS_URL=http://192.168.1.42:5000
```

And restart Expo.
