# AvatarPreview Component

A reusable component for displaying custom avatars throughout the app. This component stacks SVG layers and applies colors dynamically.

## Usage

### Basic Usage

```tsx
import { AvatarPreview } from '../../components/AvatarPreview'

<AvatarPreview
  bodyType="body-medium"
  skinColor="#FFDBAC"
  hairStyle="01"
  hairColor="#000000"
  eyeShape="00"
  eyeColor="#000000"
  smile="smile"
  clothing="blazer"
  devices="glasses"
  width={150}
  height={200}
/>
```

### Using with useAvatar Hook

```tsx
import { AvatarPreview } from '../../components/AvatarPreview'
import { useAvatar } from '../../hooks/useAvatar'

const MyComponent = () => {
  const avatarData = useAvatar()
  
  if (!avatarData) {
    return <Text>No avatar configured</Text>
  }
  
  return (
    <AvatarPreview
      bodyType={avatarData.bodyType}
      skinColor={avatarData.skinColor}
      hairStyle={avatarData.hairStyle}
      hairColor={avatarData.hairColor}
      eyeShape={avatarData.eyeShape}
      eyeColor={avatarData.eyeColor}
      smile={avatarData.smile}
      clothing={avatarData.clothing}
      devices={avatarData.devices}
    />
  )
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `bodyType` | `'body-small' \| 'body-medium' \| 'body-large'` | Required | Body size type |
| `skinColor` | `string` | `'#FFDBAC'` | Skin color (hex) |
| `hairStyle` | `string \| null` | `null` | Hair style ID (01-18) |
| `hairColor` | `string` | `'#000000'` | Hair color (hex) |
| `eyeShape` | `string \| null` | `null` | Eye shape ID (00-06) |
| `eyeColor` | `string` | `'#000000'` | Eye color (hex) |
| `smile` | `string \| null` | `'smile'` | Smile asset identifier |
| `clothing` | `string \| null` | `null` | Clothing item name |
| `devices` | `string \| null` | `null` | Device/accessory name |
| `width` | `number` | `150` | Avatar width |
| `height` | `number` | `200` | Avatar height |
| `style` | `ViewStyle` | `undefined` | Additional container styles |

## How It Works

1. **Layer Stacking**: The component renders SVG layers in a specific order:
   - Body (base layer with skin color background)
   - Hair (with color tint)
   - Eyes (with color tint)
   - Clothing
   - Devices (topmost layer)

2. **Color Application**:
   - **Skin Color**: Applied as a background color behind the body SVG
   - **Hair/Eye Colors**: Applied using `tintColor` on the Image component
   - **Clothing/Devices**: Rendered as-is without color modification

3. **SVG Rendering**: Currently uses React Native's `Image` component with `tintColor` for color support. This works for simple SVGs but has limitations.

## Future Improvements

For better SVG rendering with full color support, consider:

1. **Setup react-native-svg-transformer**:
   ```bash
   yarn add react-native-svg-transformer
   ```
   
   Then configure `metro.config.js`:
   ```js
   const { getDefaultConfig } = require('expo/metro-config');
   
   const config = getDefaultConfig(__dirname);
   
   config.transformer = {
     ...config.transformer,
     babelTransformerPath: require.resolve('react-native-svg-transformer'),
   };
   config.resolver = {
     ...config.resolver,
     assetExts: config.resolver.assetExts.filter(ext => ext !== 'svg'),
     sourceExts: [...config.resolver.sourceExts, 'svg'],
   };
   
   module.exports = config;
   ```

2. **Modify SVG files** to use `currentColor` for fill/stroke attributes that should be colored dynamically

3. **Update AvatarPreview** to use imported SVG components instead of Image component

## Notes

- All SVG layers are positioned absolutely and stacked on top of each other
- SVGs should have the same dimensions for proper alignment
- The component handles body size variants automatically (small/medium/large)
- Clothing and devices automatically use the correct size variant based on body type

