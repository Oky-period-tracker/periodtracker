#!/bin/bash

source ./bin/modules/paths.sh

# Remove the modules from the git history
rm -rf ./.git/modules/
rm -rf .gitmodules

# Declare an array with the paths
declare -a paths=($k8s_path $resources_path $common_path $delete_account_path $flower_path)

# Loop over the paths, and remove all the files
for path in "${paths[@]}"; do
    rm -rf $path
done




