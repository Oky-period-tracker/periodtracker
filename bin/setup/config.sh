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

# iOS
# cp app/ios/xcconfig.dist app/ios/release.xcconfig
# cp app/ios/xcconfig.dist app/ios/debug.xcconfig

# Android
copy_if_not_exists app/android/gradle.properties.dist app/android/gradle.properties
copy_if_not_exists app/android/local.properties.dist app/android/local.properties

# Redux encryption
copy_if_not_exists app/src/redux/config.ts.dist app/src/redux/config.ts
