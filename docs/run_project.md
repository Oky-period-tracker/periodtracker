# Run the project locally

How to get the project running locally once everything has been set up.

For a new machine, follow the numbered Quick start in the [README](../README.md) first. The steps below are the day-to-day commands once the initial setup is done.

Start the backend (api, cms, postgres, adminer):

```bash
yarn dev
```

Seed the database on a fresh DB (destructive, drops the `periodtracker` schema):

```bash
yarn db:init
```

Start the Expo dev server:

```bash
yarn dev:app
```

For an Android emulator, forward API ports into the emulator:

```bash
yarn reverse:all-ports
```
