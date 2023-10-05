# Optional Imports

This project utilises git submodules, read more about that [here](../modules.md).

The purpose of this folder is to import files from optional submodules.

Since these modules are optional, their files might not be included in the project, so we cannot simply import the files as normal, the compiler will throw an error if it cannot find the file.

We solve this problem by using try/catch:

```typescript
let Module = {}

try {
  Module = require('./module')
} catch (e) {
  //
}

export default Module
```

This will import the file called `module` if it exists, otherwise it will set the module to an empty object, and export that instead.

If you are going to create a new feature for this project which will be optional, you will need to add a file to import your module in the same way as above.

If your optional feature is very small, consider conditionally including the code using environment variables instead.
