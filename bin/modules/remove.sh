#!/bin/bash

source ./bin/modules/paths.sh

# Declare an array with the paths
declare -a paths=($k8s_path $resources_path $common_path $delete_account_path $flower_path)

# Clear submodule entries from the git index so pull.sh can re-add them.
# Without this, git submodule add fails with "already exists in the index".
for path in "${paths[@]}"; do
    if git ls-files --error-unmatch "$path" > /dev/null 2>&1; then
        git rm -rf --cached "$path" > /dev/null 2>&1
    fi
done

# Remove the modules from the git history
rm -rf ./.git/modules/
rm -rf .gitmodules

# Loop over the paths, and remove all the files on disk
for path in "${paths[@]}"; do
    rm -rf $path
done




