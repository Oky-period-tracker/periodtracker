#!/bin/bash

# Function to check if .env exists, and if not, copy from .env.dist
copy_if_not_exists() {
  if [ ! -f "$2" ]; then
    cp "$1" "$2"
    echo "Copied $2"
  else
    echo "Skipped $2"
  fi
}


# Submodule URLs
copy_if_not_exists bin/modules/urls.sh.dist bin/modules/urls.sh

# env
copy_if_not_exists packages/api/.env.dist packages/api/.env
copy_if_not_exists packages/cms/.env.dist packages/cms/.env
copy_if_not_exists app/.env.dist app/.env
