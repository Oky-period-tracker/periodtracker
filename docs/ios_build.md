# Building the iOS app locally

From `app/`:

```bash
LANG=en_US.UTF-8 LC_ALL=en_US.UTF-8 npx expo run:ios --device "iPhone 16 Pro"
```

`yarn ios` and `yarn podinstall` already set the locale, so on a configured shell you can just run `yarn ios -- --device "iPhone 16 Pro"`.

## Two non-obvious fixes the project carries

### 1. `LANG` exports in the dev scripts (`app/package.json`)

CocoaPods 1.15 / Ruby 3.3 calls `unicode_normalize` on the Podfile path before reading the Podfile. With `LANG=""` / `LC_CTYPE=C` (typical on a fresh macOS user), Ruby raises `Encoding::CompatibilityError`. The `ios` and `podinstall` scripts in `app/package.json` export `LANG=en_US.UTF-8 LC_ALL=en_US.UTF-8` on the script line so a fresh clone works without touching the shell profile. EAS Build workers already set the locale, so this is local-only.

### 2. Drop `useFrameworks`, declare modular headers for Firebase Obj-C deps (`app/app.config.js`)

With `useFrameworks: "static"` and RN 0.81's prebuilt React-Core, `@react-native-firebase` v22 fails to compile — its sources `#import <React/...>` headers that the source pod ships as non-modular, and wrapping every pod in a framework module turns those into hard errors (`must be imported from module 'RNFBApp.X' before it is required`, `non-modular include in framework module`).

`app/app.config.js` patches the `expo-build-properties` plugin entry at prebuild time:

1. Strip `ios.useFrameworks` so every pod is a plain static library and `#import <React/...>` is a text inclusion.
2. Append `ios.extraPods` with `modular_headers: true` for `FirebaseCore`, `FirebaseCoreExtension`, `FirebaseInstallations`, `GoogleDataTransport`, `GoogleUtilities`, `nanopb` — Firebase's Swift pods need their Obj-C deps to expose Clang modules they can `@import` once `use_frameworks!` is gone. `expo-modules-autolinking` reads `extraPods` from `Podfile.properties.json` on every `pod install`, including EAS.

The override lives in the main repo, not the whitelabel resources submodule, because the iOS build mechanics apply to every Oky brand. `use_modular_headers!` (global) is avoided because the auto-generated React-Core umbrella orders headers alphabetically and trips `unknown type name 'RCT_EXTERN'`.

## When something else goes wrong

`expo run:ios` truncates compile errors. To see the real failure, run `xcodebuild` directly:

```bash
cd app/ios
LANG=en_US.UTF-8 LC_ALL=en_US.UTF-8 xcodebuild \
  -workspace Oky.xcworkspace -scheme Oky -configuration Debug \
  -destination "id=$(xcrun simctl list devices available 'iPhone 16 Pro' | awk -F '[()]' '/iPhone 16 Pro \(/ {print $2; exit}')" \
  build 2>&1 | grep -E "error:|FAILED|fatal" | head -30
```

To reset everything:

```bash
cd app && rm -rf ios android node_modules && yarn && npx expo prebuild --clean
LANG=en_US.UTF-8 LC_ALL=en_US.UTF-8 npx expo run:ios --device "iPhone 16 Pro"
```

If a future Firebase or RN upgrade adds a new Swift pod whose Obj-C dep isn't yet modular, `pod install` will print `The Swift pod 'X' depends upon 'Y', which does not define modules.` — add `Y` to `FIREBASE_MODULAR_HEADER_PODS` in `app/app.config.js`.
