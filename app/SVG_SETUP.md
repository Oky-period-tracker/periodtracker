# SVG Transformer Setup

This document explains the SVG setup for the custom avatar system.

## What Was Configured

1. **Metro Config** (`metro.config.js`)
   - Configured `react-native-svg-transformer` to transform SVG files into React components
   - SVG files are now imported as React components instead of image assets

2. **TypeScript Declarations** (`src/declaration.d.ts`)
   - Added type declarations for SVG imports
   - SVGs are typed as React components with `SvgProps` and optional `color`/`fill` props

3. **AvatarPreview Component** (`src/components/AvatarPreview/index.tsx`)
   - Updated to use SVG components directly
   - Colors are applied via `color` and `fill` props
   - All layers are properly stacked with z-index

4. **Friend Assets** (`src/resources/assets/friendAssets.ts`)
   - Updated to import SVGs as React components
   - Returns SVG components instead of image sources for preview assets

## How It Works

When you `require()` an SVG file, `react-native-svg-transformer` automatically converts it to a React component. You can then use it like:

```tsx
const MySvg = require('./path/to/file.svg')

<MySvg width={100} height={100} color="#FF0000" />
```

## Color Support

For colors to work properly, SVG files should use `currentColor` for fill/stroke attributes that should be colored dynamically:

```xml
<svg>
  <path fill="currentColor" d="..."/>
</svg>
```

When you pass a `color` prop to the SVG component, it will apply to all elements using `currentColor`.

## Next Steps (Optional)

If you want full color control over SVG elements:

1. **Modify SVG files** to use `currentColor` for dynamic colors:
   - Hair SVGs: Change fill to `currentColor`
   - Eye SVGs: Change fill to `currentColor`
   - Body SVGs: Keep as-is (skin color is applied as background)

2. **Or use a build script** to automatically replace fill colors with `currentColor` in specific SVG files

## Testing

After making these changes:

1. **Clear Metro cache**: `yarn start --reset-cache` or `npx expo start --clear`
2. **Restart the development server** to pick up the new Metro config
3. **Test the avatar preview** to ensure SVGs render correctly

## Troubleshooting

If SVGs don't render:

1. Make sure Metro cache is cleared
2. Verify `react-native-svg-transformer` is installed: `yarn list react-native-svg-transformer`
3. Check that `metro.config.js` is in the app root directory
4. Ensure SVG files exist in the expected paths
5. Check Metro bundler logs for any transformation errors

