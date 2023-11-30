# Optional Submodules

This project utilizes git submodules, read more about that [here](../modules.md).

Not all submodules are required to run the project. Optional features can be included or excluded by changing the urls in the [urls.sh](../bin//modules/urls.sh) file, and running `yarn modules`

Since these modules are optional, their files might not be included in the project, so we cannot simply import the files normally, otherwise the compiler will throw an error if the file does not exist.

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

When you use optional modules, make sure to import from the file with the try/catch import/export, not from the submodule directly.

For an example of this, see [Flower.tsx](../../packages/components/src/optional/Flower.tsx).

## Alternative for small features

If your optional feature is very small, consider conditionally including the code using environment variables instead.

For example:

```env
INCLUDE_OPTIONAL_FEATURE=true
```

```tsx
const Component = () => {
  return (
    <OtherComponents>
      {process.env.INCLUDE_OPTIONAL_FEATURE ? <OptionalFeature /> : null}
    </OtherComponents>
  )
}
```
