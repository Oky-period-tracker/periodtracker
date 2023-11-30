### Build the docker images for development

In order to test the app -api-cms interaction you will have to build the docker images for development by simply running the command in the root:

```bash
docker-compose build
```

## Start the backend/website/cms/api

To run the backend/cms and api simply run the command (ensure the images are built):

```bash
yarn dev
```

If the database was not created successfully the cms container will exit but the api/database should still be running.
Running services include

- Adminer - Database (DB): [http://localhost:8080/](http://localhost:8080)
- API: [http://localhost:3000](http://localhost:3000)
- CMS: [http://localhost:5000](http://localhost:5000)

- Development Adminer DB credentials:

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

## Start react native

### Run react native for Android

Start the simulator, then run react-native for android:

```bash
cd packages/mobile
npx react-native run-android
cd ../../
```

Reverse the ports to have access to the functionality of the api/cms.

```bash
yarn reverse:all-ports
```

Or for just a single service (in this case API) run:

```bash
adb reverse tcp:3000 tcp:3000
```

If you have multiple devices connected, you need to specify the device to reverse the ports on

List your devices

```bash
adb devices
```

Reverse the ports

```bash
adb -s <device name> reverse tcp:3000 tcp:3000
adb -s <device name> reverse tcp:5000 tcp:5000
```

If there are android build errors. Try open the project in Android Studio, clean build and re-sync the gradle files.

### Run react native for iOS

Open the project in Xcode
Select periodtracker.xcworkspace located in the packages/mobiles/ios, and press the play button to create a build.

Alternatively, via the command line:

Run react-native for iOS (you can choose relevant simulator/emulator):

```bash
cd packages/mobile
npx react-native run-ios --simulator="iPhone 12 Pro"
```

<strong>Note:</strong> you will need access to Unicef Apple developer account so you can create your developemnt certificate and profile before running the ios app using xcode. Please contact your product manager to gain access.

---

### Tips

To speed up the sign up process in the app, search the code for `FAST_SIGN_UP` and change it to `true`, this simply adds in some default values into the form fields, including a random 4 char username and password `aaa`. Do not commit this change.

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
