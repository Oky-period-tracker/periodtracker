#!/bin/bash
source ./bin/modules/paths.sh

# The branch name you want to checkout
BRANCH_NAME="$1"

# Check if the branch name was provided
if [ -z "$BRANCH_NAME" ]; then
  echo "Usage: $0 <branch-name>"
  exit 1
fi

# List of submodule paths; ensure these are relative to the root of your superproject
SUBMODULE_PATHS=(
    $resources_path
    $common_path
    $k8s_path
    $delete_account_path
    $flower_path
)

# Loop over the list of submodule paths
for SUBMODULE_PATH in "${SUBMODULE_PATHS[@]}"; do
    echo "Checking out $BRANCH_NAME in $SUBMODULE_PATH"
    
    # Change into the submodule directory
    cd "$SUBMODULE_PATH"
    
    # Attempt to checkout the branch
    # Attempt to checkout the branch. If it fails, try to create it.
    if git checkout "$BRANCH_NAME"; then
        echo "Checked out $BRANCH_NAME in $submodule_path"
    else
        echo "$BRANCH_NAME does not exist in $submodule_path, creating it..."
        git checkout -b "$BRANCH_NAME" || { echo "Failed to create branch $BRANCH_NAME in $submodule_path"; exit 1; }
    fi
        
    # Change back to the root directory of your superproject
    # This assumes the script is run from the root of your superproject
    cd - > /dev/null
    
done

echo "Checkout complete."
