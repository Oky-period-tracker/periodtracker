## Copy-env

To run the project you need .env files in /cms, /api and /mobile

This command creates all three .env files for from their respective templates

> Please note that if you already have .env files, running this command will undo any manual changes you have made to them

```bash
yarn copy-env:all
```

Thats all you need to do to get the project running, but if you want to know more about the .env files, read on

The .env files are untracked, but there are tracked .env.dist files, commands like this copy those files and create the untracked .env files. The `copy-env:all` essentially runs the following command, for each of the env files

```bash
cp packages/api/.env.dist packages/api/.env
```

---

The `copy-env:all` command also creates files in the /packages/mobile /ios & /android folders, this is where the bundle ID / application ID for the app is defined

To change the bundle ID (iOS) of your app, please change it directly in the untracked `release.xcconfig` file.

Do not change the bundle ID in Xcode because that will affect the `project.pbxproj` file. This way everyone can be using different bundle IDs without needing to commit changes to `project.pbxproj` on separate branches.

To change the android application ID, please the APPLICATION_ID variable directly in the untracked `gradle.properties` file

> Please note that running the `copy-env:all` commands will also overwrite changes you made to these untracked files, `gradle.properties` and `.xcconfig`
