# Asset validation

A common problem when adding new assets to the project is that the dimensions are incorrect, and the files are too large. We want the dimensions to be the same so that they get displayed correctly within the app, and keep the files small so that the app stays small, and easier to download.

---

### Lotties

Run this command to validate the lottie files inside your `/packages/components/src/assets/lottie` folder

```bash
yarn validate:lotties
```

This will output information about each lottie file you have in that folder.
Eg:

```
File: ari_lottie.json
Size: 1433 KB
Default viewport size: 2000 x 4000
Aspect ratio: 0.50
```

If a file does not match our recommended specifications, it will display a warning

```
WARNING: Lottie file is larger than 2000 KB
WARNING: Incorrect aspect ratio, expected 0.5
```

---

### Images

> The image validation script uses a package called `sharp` which was causing issues with the docker environment when installed normally.

Install sharp:
(Please do NOT commit the changes that this will make to the package.json and yarn.lock files)

```bash
yarn add sharp@0.28.3 --ignore-workspace-root-check
```

```bash
yarn validate:images
```

This command generates a file containing information about all the images in your /assets folder
eg:

```ts
{
    path: './images/filename.png',
    format: 'png',
    width: 123,
    height: 137,
    size: 6273,
}
```

It then compares this data against some hardcoded values we have, and displays a warning when an the dimensions or size of an image are not ideal. This currently only examines the avatar and background images.
