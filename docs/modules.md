# Git submodules

The main command you will need to use is this

```bash
yarn modules
```

This one command runs the following scripts (you do not need to run these individually unless for some specific purpose)

First it removes any modules you currently have with this script

> If you have local changes / commits that have not been pushed, they will be lost after running this command

```bash
./bin/modules/remove.sh
```

Next it clones / updates the git submodules:

```bash
./bin/modules/pull.sh
```

## Create your own

By default `urls.sh` file contains the public whitelabelled modules. Changing the urls in this file and re-running the `yarn modules` command will replace those modules with the new urls.

Follow these steps to create your own git repo to use as a sub module.

As an example, this is how you can make your own `resources` module

Follow the steps outlined in the [setup](./setup.md#modules) to pull the current modules.

Create a new repository on the [github website](https://github.com/new)

In the terminal, go to the folder of the module that you want to replace. You can find the paths for all the git submodules [here](../bin//modules/paths.sh)

```bash
cd app/src/resources
```

Delete the .git directory to disassociate this directory from the original repository

```bash
rm -rf .git
```

Initialize a New Git Repository

```bash
git init
```

You can now add or modify files in this directory, maintaining the structure and naming of the original repository.

Commit Your Changes

```bash
git add .
git commit -m "Initial commit"
```

Link your local repository to the new GitHub repository you created earlier, replacing the url below with your own

```bash
git remote add origin https://github.com/[your-username]/[your-repository].git
```

Push your changes
(You may need to replace 'master' with 'main')

```bash
git push -u origin master
```

For convenience, here is the above commands in one block, but of course replace the url with your own

```bash
rm -rf .git
git init
git add .
git commit -m "Initial commit"
git remote add origin ORIGIN_URL
git push -u origin master
```

> You can also use the above commands to wipe the history of an existing repository and start fresh, for example you may want to do this if you want to remove sensitive information from the history, before making the repo public. The only difference is that you will need to include `-f` in the `git push` command.

Update your [urls.sh](../bin//modules/urls.sh) file, so that `resources_url` is now the url for your new repository

Return to the root directory

```bash
cd ../../../../
```

Next we will run the command to replace the modules.

> Make sure you have committed all your changes to your new repository before running this command otherwise your changes will be lost

```bash
yarn modules
```

Anytime you make changes to your repository in future, you can simply commit and push your changes normally.

To pull changes to your submodules, rerun the pull command

## Recommended naming

For clarity I recommend naming your submodules using the following pattern
`periodtracker_purpose-label`

For example:
`periodtracker_resources-fr`

Label may not always be required:
`periodtracker_flower`

## Git Branches

To change branches across all submodules at once use this command

```bash
yarn modules:checkout branch-name
```

## Optional submodules

Not all submodules are required to run the project. Optional features can be included or excluded by changing the urls in the [urls.sh](../bin//modules/urls.sh) file.

Read more about optional submodules [here](./code/optional_submodules.md)
