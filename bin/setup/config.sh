#!/bin/bash

# Submodule URLs
cp bin/modules/urls.sh.dist bin/modules/urls.sh

# env
cp packages/api/.env.dist packages/api/.env
cp packages/cms/.env.dist packages/cms/.env
cp app/.env.dist app/.env

# iOS
# cp app/ios/xcconfig.dist app/ios/release.xcconfig
# cp app/ios/xcconfig.dist app/ios/debug.xcconfig

# Android
cp app/android/gradle.properties.dist app/android/gradle.properties
cp app/android/local.properties.dist app/android/local.properties

# Redux encryption
cp app/src/redux/config.ts.dist app/src/redux/config.ts
