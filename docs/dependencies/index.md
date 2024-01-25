These instructions assume that you are using an apple Mac.

## Apps to install:

### Required:

- [VS code](https://code.visualstudio.com/)
- [Xcode](https://developer.apple.com/xcode/)
- [Android studio](https://developer.android.com/studio)
- [Docker desktop](https://www.docker.com/products/docker-desktop/)

[Here](vscode.md) you will find recommendations for using vscode

> M1 mac users may need to open [Xcode with rosetta](./M1#Rosetta)

<strong>Note:</strong> Follow the android studio setup recommended by react native. At the time of development the SDK build tools version used was `28.0.3` as indicated in the `build.gradle`.

You will need to login / create a dockerhub account

### Optional but recommended:

- [Warp](https://www.warp.dev/)

---

## Packages to Install via Command Line:

### Homebrew

[Homebrew](https://docs.brew.sh/Installation) will be used to install other packages

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

> _M1 Mac users_ may need to [edit their .zshrc file](M1.md#Homebrew)

---

### NVM

[nvm](https://github.com/nvm-sh/nvm) is optional, but it will make it a lot easier to install and manage different versions of Node on your mac.

```bash
brew install nvm
```

> _M1 Mac users_ may need to [edit their .zshrc file](M1.md#nvm)

---

### Node

The recommended version is `v16.13.1`

```bash
nvm install 16.13.1
```

---

## React native cli

```bash
npm i -g @react-native-community/cli@6.3.1
```

To check installed version of react-native-community/cli and its dev depedencies, use following command:

```bash
yarn list --pattern @react-native-community/cli
```

---

## Yarn

[Yarn](https://yarnpkg.com/) is a package manager recommended by facebook

```bash
brew install yarn
```

---

## Cocoapods

A dependency manager required for iOS development

```bash
brew install cocoapods
```

---

## Typescript

It is not necessary to install typescript globally as it is installed as a dependency. However given that the project is a mono-repository it is crucial that the version of typescript is consistent throughout. This can be checked in the root directory with:

```bash
yarn list typescript
```

If you install a package and adjust the typescript version from an upgrade operation remember that typescript has / will change in the future. Make sure you have a single version across the mono repository by running:

```bash
cat yarn.lock | grep typescript
```

If there are multiple versions of typescript it may be necessary to revert:

```bash
git checkout origin/master -- yarn.lock // this is only necesarry if you have typescripting errors
```

---

> There are additional steps for M1 mac users [here](M1.md)
