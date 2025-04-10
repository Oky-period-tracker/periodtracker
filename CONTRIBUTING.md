# Contributing

👍🥳 First off, thank you for considering contributing to this project! Your efforts make a significant difference in the quality and success of this project.🥳👍

The guide assumes that you have read and understood the readme file, able to [Setup](./docs/setup.md) the project on your local machine and familiar with JavaScript, React and Typescript.

## How to Contribute

## 1. Join the slack channel

In the channel, send an introductory message with your GitHub handle/username asking to be added to the GitHub repository (this repository).

## 2. Installing Git

Before cloning your forked repository to your local machine, you must have Git installed. You can find instructions for installing Git for your operating system [here](https://git-scm.com/downloads). Please note that if you have a Mac the page offers several options.

## 3. Fork the repository

You can fork the PeriodTracker repository by clicking 🍴 [Fork](https://github.com/Oky-period-tracker/periodtracker/fork) . A fork is a copy of the repository that will be placed on your GitHub account.

Note: It should create a URL that looks like the following -> https://github.com/<your_GitHub_user_name>/periodtracker

For example -> https://github.com/octocat/periodtracker.

## 4. Create a new branch

Create a branch for your changes to keep your work organized and separate from the main codebase:

```
git checkout -b feature/your-feature-name
```

After forking the repo, you can proceed with the guide on [contributing.md](./CONTRIBUTING.md) on how to setup the project in your local machine.

### 5. Install local codebase spell checker

You must use VS Code as your local text editor to install the VS Code extension for spell checking your codebase, Code Spell Checker.

The recommended installation method is to install Code Spell Checker directly from the VS Code text editor, and those instructions can be found [here.](https://code.visualstudio.com/docs/editor/extension-marketplace) The extension can also be installed via the VS Code Marketplace website [here.](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker)

For developers who do not use VS Code, use the corresponding npm package, cspell, and those instructions can be found [here.](https://www.npmjs.com/package/cspell)

### 6. How the team works with GitHub Issues

We follow the Gitflow workflow to ensure our project's development process is organized and efficient. Here’s how you can contribute:

Switch to the `master` branch and get the latest changes

```bash
git checkout master
git pull origin master # Ensure you're up to date
```

1. Create a New Branch.
   Choose a descriptive name related to the issue or feature you're working on.

```bash
git checkout -b feature_name
```

2. Make your changes to the codebase.

   Please aim for clean and readable code. If you want guidance, check out the [recommended reading](./docs/code/recommended_reading.md)

   If you are adding a significant new feature, which other deployment teams may not want to use, please implement it as an optional submodule. See here for guidance on importing files from [optional submodules](./docs/code/optional_submodules.md)

3. Commit Changes
   Commit your changes with a clear and descriptive commit message.

```bash
git commit -m "Brief description of your changes"
```

4. Pull Latest Changes
   Before submitting your pull request, ensure your branch is up-to-date with the latest changes. Use `--rebase` to keep a linear git history.

```bash
git pull origin develop --rebase
```

5. Submit a Pull Request
   Push your branch and then create a pull request on github, from your branch into the develop branch. Provide a clear title and description for your pull request.

6. Review and Merge
   Once your PR is approved, a project maintainer will merge it into develop, and it will eventually be included in the master branch in a future release.

### Additional Guidelines

Testing: Please write tests for your changes and ensure all existing tests pass to help maintain the project's stability and quality.

Documentation: Update relevant documentation to reflect your changes or additions, ensuring all users and contributors can understand and use your contributions effectively.

Thank you for your contribution! Your time and effort are greatly appreciated.
