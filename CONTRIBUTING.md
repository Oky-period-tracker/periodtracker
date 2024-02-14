# Contributing

Thank you for considering contributing to this project! Your efforts make a significant difference in the quality and success of this project.

Before contributing, please familiarize yourself with the README and documentation to get setup.

## How to Contribute

We follow the Gitflow workflow to ensure our project's development process is organized and efficient. Here’s how you can contribute:

Switch to the `develop` branch and get the latest changes

```bash
git checkout develop
git pull origin develop # Ensure you're up to date
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
