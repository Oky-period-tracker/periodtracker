#!/bin/bash

source ./bin/modules/urls.sh
source ./bin/modules/paths.sh

# Create the .gitmodules file if it doesn't exist
if [ ! -f .gitmodules ]; then
    touch .gitmodules
fi

# Add the submodules
git submodule add $k8s_url $k8s_path
git submodule add $resources_url $resources_path
git submodule add $common_url $common_path
git submodule add $delete_account_url $delete_account_path

# Optional modules
[ -n "$flower_url" ] && git submodule add $flower_url $flower_path


# Use the latest commits
git submodule update --remote

# Git adds .diff files to the core repo, this removes them so we dont have to commit these files
# Adding *.diff to gitignore didn't work
git restore --staged .
