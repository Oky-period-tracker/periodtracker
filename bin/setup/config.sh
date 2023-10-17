#!/bin/bash

# Submodule URLs
cp bin/modules/urls.sh.dist bin/modules/urls.sh

# env
cp packages/api/.env.dist packages/api/.env
cp packages/cms/.env.dist packages/cms/.env
cp packages/mobile/.env.dist packages/mobile/.env
cp packages/mobile/.env.dist packages/mobile/.env.production

# iOS
cp packages/mobile/ios/xcconfig.dist packages/mobile/ios/release.xcconfig
cp packages/mobile/ios/xcconfig.dist packages/mobile/ios/debug.xcconfig

# Android
cp packages/mobile/android/gradle.properties.dist packages/mobile/android/gradle.properties
cp packages/mobile/android/local.properties.dist packages/mobile/android/local.properties

# Redux encryption
cp packages/components/src/redux/config.ts.dist packages/components/src/redux/config.ts
