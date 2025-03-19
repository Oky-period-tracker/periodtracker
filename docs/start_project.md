### Build the docker images for development

### Prerequisites

Before proceeding, ensure the following:

- Docker is installed on your machine. Download and install Docker from the [official website.](https://docs.docker.com/compose/install/)

- You are signed in to Docker. Use the `docker login` command in your terminal or sign in through the Docker Desktop application.

### Steps to Build the Docker Images

To test the app's API-CMS interaction, you will need to build the Docker images for development. Follow these steps:

- Navigate to the Root Directory:
  Open a terminal and navigate to the root directory of the project where the docker-compose.yml file is located.

- Build the Docker Images by running the following command:

```bash
docker-compose build
```

This command will build the required images for development.

## Start the backend/website/cms/api

Once the images are built, you can start the backend, CMS, and API using the following steps:

- Run the Development Environment by executing the command below to start the backend, CMS, and API:

```bash
yarn dev
```

**Notes**

- Ensure that the images are successfully built before running the development command.

- If you encounter any issues, verify that Docker is installed, you are logged in, and the `docker-compose.yml` file is correctly configured.

If the database was not created successfully the cms container will exit but the api/database should still be running.
Running services include

- Adminer - Database (DB): [http://localhost:8080/](http://localhost:8080)
- API: [http://localhost:3000](http://localhost:3000)
- CMS: [http://localhost:5000](http://localhost:5000)

### Development Adminer DB credentials:

- System: PostgresSQL
- Server: postgres
- DB Name: periodtracker
- User Name: periodtracker
- password: periodtracker

### Run a manual migration

Currently the migration is not automatic and should be run manually.
Log into adminer using the details above, and go to `SQL command`. Here you will execute some SQL code to create the schema, tables, and a CMS user

Create schema:

```sql
CREATE SCHEMA periodtracker;
```

Next, create the tables by copy pasting the SQL from the file `/sql/create-tables.sql`.

Check for other SQL files in the same directory and execute them as well.

If something goes wrong you can drop the schema and start again by executing this sql. Beware that this will delete all data and tables etc that you have in your DB.

```sql
--- !!! WARNING - THIS WILL DELETE ALL DATA !!!
DROP SCHEMA periodtracker CASCADE;
```

To log into the CMS you need to first insert a TEMPORARY CMS user via adminer
Execute the following SQL to create a CMS user with the following credentials:

- Username: admin
- Password: admin

```sql
INSERT INTO "periodtracker"."user" ("id", "username", "password", "lang", "date_created", "type")
VALUES (-1, 'admin', '$2b$10$cslKchhKRBsWG.dCsspbb.mkY9.opLl1t1Oxs3j2E01/Zm3llW/Rm', 'en', NOW(), 'superAdmin');
```

> IMPORTANT: Once you have created this user, log into the CMS, use the `/user-management` page to create a new user with a strong password, log out, log in as your new user, and delete this non-secure `Admin` user

Your `/translations` submodule should contain SQL files eg `insert-content-en.sql`, execute this as well to insert content into the DB. [See here](./localisation/translations.md) for how to generate these SQL files when setting up your own repo / adding a new language.

## Expo

Inside the `/app` folder

```bash
cd app
```

ExpoGo is a fast and simple way to run the app for development without native code. Once started you will see options in your terminal

```bash
npx expo start
```

Prebuild your `/android` and `/ios` folders.
These folders are generated based on the `app.json` in your resources submodule. The `--clean` flag will delete these folders before re creating them, I recommend using this flag so that you don't rely on changes made directly in these untracked folders

```bash
npx expo prebuild --clean
```

Create a development build,
Unlike ExpoGo, these builds make use of the native code in the `/android` and `/ios` folders

```bash
npx expo run:android
```

From the root of this project, you can start expo with this command

```bash
yarn dev:app
```

On android emulator, you may need to reverse ports for http requests to work

```bash
yarn reverse:all-ports
```

---

### Tips

To speed up the sign up process in the app, set `EXPO_PUBLIC_FAST_SIGN_UP` to `true` in your `.env`, this adds in some default values into the form fields, including a random 4 char username and password `aaa`.

If you want to install a npm module, without re-building the docker images, just run:

```bash
docker-compose exec server yarn add moment
```

If you want sync the public folder to dist directory, run:

```bash
docker-compose exec server yarn copy-static-assets
```

but, if you pull dependencies changes from other people, remember to:

```bash
docker-compose down && docker-compose build
```

and restart it again.
