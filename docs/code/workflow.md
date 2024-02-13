# Workflow

### Gitflow

For contributing to this project, we recommend using the Gitflow workflow. This method helps organize and manage changes effectively, ensuring a clean and linear history.

Switch to the `develop` branch and get the latest changes

```bash
git checkout develop
git pull origin develop # Ensure you're up to date
```

Then from here, create branches for individual features, such as `feature_chatbot`.

```bash
git checkout -b feature_chatbot
```

When it is time to merge this feature branch, other commits may have been added to the develop branch after you created this feature branch, use rebase to add your commits on top of those and maintain a linear git history

```bash
git pull origin develop --rebase
```

You may encounter merge conflicts, make the appropriate changes to the files and add them to staging, then continue the rebase

```bash
git rebase --continue
```

If prompted by Git to enter a message or command, you might need to use the `:wq` command to save and exit in Vim (the default editor for many Git installations). This command means "write and quit," effectively saving your changes and closing the editor.

Push your changes, force is required if you rebased, but `with-lease` will ensure you don't overwrite any unseen changes

```bash
git push origin feature_chatbot --force-with-lease
```

Now you can create a pull request, and your feature will be merged into develop after being reviewed, and eventually merged into master.

Finally, create a pull request from your feature branch to develop. After review and approval, your feature will be merged into develop, contributing to the next release. Eventually, develop will be merged into master (or main), finalizing the feature's integration into the production code.
