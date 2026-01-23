# Adding New Avatar Assets

This guide explains how to add new assets (clothes, devices, hair, eyes, or body types) to the avatar customization system.

## Overview

The avatar system uses **two sets of assets** for each customization option:

1. **Selection UI Assets** (PNG files) - Used in the customization screen where users select options
   - Location: `app/src/resources/assets/images/avatars/friend/customization-page/`
   - Format: PNG files (with @2x and @3x variants for retina displays)

2. **Preview Assets** (SVG files) - Used in the actual avatar preview/display
   - Location: `app/src/resources/assets/images/avatars/friend/avatar-parts/`
   - Format: SVG files that are automatically converted to React components via regeneration scripts
   - **Important**: After adding SVG files, you must run the regeneration script to convert them to React components

**Exception**: Body previews use JSX components (`BodyComponents.tsx`), not SVG files.

---

## File Structure

```
app/src/resources/assets/images/avatars/friend/
├── customization-page/          # Selection UI (PNG)
│   ├── bodies/
│   ├── hair/
│   ├── eyes/
│   ├── clothing/
│   ├── devices/
│   └── categories/
└── avatar-parts/                # Preview (SVG)
    ├── bodies/                  # (Uses JSX components, not SVG)
    ├── hair/
    ├── eyes/
    ├── clothing/
    ├── devices/
    └── smile/
```

---

## Step-by-Step Guide

### 1. Adding New Clothing

#### Step 1.1: Prepare Assets

**Selection UI (PNG):**
- Create PNG files: `customization-page/clothing/your-item-name.png`
- Include @2x and @3x variants for retina displays
- Recommended size: ~80x100px (base)

**Preview (SVG):**
- Create SVG files for each body size:
  - `avatar-parts/clothing/your-item-name-small.svg`
  - `avatar-parts/clothing/your-item-name-medium.svg`
  - `avatar-parts/clothing/your-item-name-large.svg`
- SVGs should be designed to layer on top of the body
- **After creating SVG files, run the regeneration script:**
  ```bash
  cd app && node scripts/regenerate-clothing-correct.js
  ```
  This will automatically convert your SVG files to React components with animation support in `ClothingComponents.tsx`

#### Step 1.2: Update `friendAssets.ts`

**Add to `selectionAssets.clothing`:**
```typescript
clothing: {
  // ... existing items
  'your-item-name': require('./images/avatars/friend/customization-page/clothing/your-item-name.png'),
}
```

**Add to `previewAssets.clothing`:**
```typescript
clothing: {
  // ... existing items
  'your-item-name-small': require('./images/avatars/friend/avatar-parts/clothing/your-item-name-small.svg'),
  'your-item-name-medium': require('./images/avatars/friend/avatar-parts/clothing/your-item-name-medium.svg'),
  'your-item-name-large': require('./images/avatars/friend/avatar-parts/clothing/your-item-name-large.svg'),
}
```

**Add to `clothingNameMapping` (if name differs):**
```typescript
const clothingNameMapping: Record<string, string> = {
  // ... existing mappings
  'your-item-name': 'your-item-name', // Usually 1:1, but can map to different SVG name
}
```

#### Step 1.3: Update `options.ts`

Add to `CLOTHING_OPTIONS` array:
```typescript
export const CLOTHING_OPTIONS = [
  // ... existing items
  'your-item-name',
]
```

#### Step 1.4: Add Translations

Add translation keys to all locale files:
- `app/src/resources/translations/app/en.ts`
- `app/src/resources/translations/app/pt.ts`
- `app/src/resources/translations/app/es.ts`
- etc.

```typescript
customizer_clothing_your-item-name: 'Your Item Display Name',
```

**Note**: Translation keys follow the pattern: `customizer_clothing_{item-name}`

---

### 2. Adding New Devices

#### Step 2.1: Prepare Assets

**Selection UI (PNG):**
- Create PNG file: `customization-page/devices/your-device-name.png`
- Include @2x and @3x variants

**Preview (SVG):**
- Create SVG file: `avatar-parts/devices/your-device-name.svg`
- **Exception**: If device needs size variants (like `prostetic2`), create:
  - `your-device-name-small.svg`
  - `your-device-name-medium.svg`
  - `your-device-name-large.svg`
- **After creating SVG files, run the regeneration script:**
  ```bash
  cd app && node scripts/regenerate-devices-correct.js
  ```
  This will automatically convert your SVG files to React components with animation support in `DevicesComponents.tsx`

#### Step 2.2: Update `friendAssets.ts`

**Add to `selectionAssets.devices`:**
```typescript
devices: {
  // ... existing items
  'your-device-name': require('./images/avatars/friend/customization-page/devices/your-device-name.png'),
}
```

**Add to `previewAssets.devices`:**
```typescript
devices: {
  // ... existing items
  'your-device-name': require('./images/avatars/friend/avatar-parts/devices/your-device-name.svg'),
  // OR if size variants:
  'your-device-name-small': require('./images/avatars/friend/avatar-parts/devices/your-device-name-small.svg'),
  'your-device-name-medium': require('./images/avatars/friend/avatar-parts/devices/your-device-name-medium.svg'),
  'your-device-name-large': require('./images/avatars/friend/avatar-parts/devices/your-device-name-large.svg'),
}
```

**If size variants exist, update `getPreviewAsset` function:**
```typescript
} else if (category === 'devices') {
  // Some devices have size variants
  if (item === 'prostetic2') {
    // ... existing code
  } else if (item === 'your-device-name') {  // Add this
    const svgKey = `your-device-name-${bodySize}`
    const devicesCollection = previewAssets.devices as Record<string, any>
    svgModule = devicesCollection[svgKey] ?? null
  } else {
    // ... existing code
  }
}
```

#### Step 2.3: Update `options.ts`

Add to `DEVICE_OPTIONS` array:
```typescript
export const DEVICE_OPTIONS = [
  // ... existing items
  'your-device-name',
]
```

#### Step 2.4: Update `constants.ts` (if needed)

If the device belongs to a subcategory, add it to `DEVICE_SUBCATEGORIES`:
```typescript
export const DEVICE_SUBCATEGORIES = {
  hats: [/* ... */, 'your-device-name'],
  glasses: [/* ... */],
  accessories: [/* ... */],
  others: [/* ... */], // Items in 'others' allow multiple selection
} as const
```

**Subcategory Rules:**
- **Hats**: Headwear items (bandana, beanie, cap, etc.)
- **Glasses**: Eye wear (glasses, sunglasses, reading glasses)
- **Accessories**: Necklaces and similar items
- **Others**: Items that allow multiple selection (purse, prosthetics, cane, earings)

**Important**: Only items in the `others` subcategory allow multiple selection. Items in other subcategories are mutually exclusive within their subcategory.

#### Step 2.5: Add Translations

Add translation keys:
```typescript
customizer_device_your-device-name: 'Your Device Display Name',
```

---

### 3. Adding New Hair Styles

#### Step 3.1: Prepare Assets

**Selection UI (PNG):**
- Create PNG file: `customization-page/hair/XX.png` (where XX is a 2-digit number)
- Use the next available number (currently 00-18, so next would be 19)
- Include @2x and @3x variants

**Preview (SVG):**
- Create SVG file: `avatar-parts/hair/XX.svg`
- **Note**: '00' is reserved for bald (no hair SVG needed)
- **After creating SVG files, run the regeneration script:**
  ```bash
  cd app && node scripts/regenerate-hair-correct.js
  ```
  This will automatically convert your SVG files to React components with animation support in `HairComponents.tsx`

#### Step 3.2: Update `friendAssets.ts`

**Add to `selectionAssets.hair`:**
```typescript
hair: {
  // ... existing items
  '19': require('./images/avatars/friend/customization-page/hair/19.png'),
}
```

**Add to `previewAssets.hair`:**
```typescript
hair: {
  // ... existing items
  '19': require('./images/avatars/friend/avatar-parts/hair/19.svg'),
}
```

#### Step 3.3: Update `options.ts`

Update `HAIR_OPTIONS` array:
```typescript
export const HAIR_OPTIONS = ['00', ...Array.from({ length: 19 }, (_, i) => String(i + 1).padStart(2, '0'))]
// Change length from 18 to 19 (or whatever the new max is)
```

**Note**: '00' is always first (bald option), then numbered styles from '01' onwards.

#### Step 3.4: Add Translations

Add translation keys:
```typescript
customizer_hair_19: 'Hair Style 19',
```

---

### 4. Adding New Eye Shapes

#### Step 4.1: Prepare Assets

**Selection UI (PNG):**
- Create PNG file: `customization-page/eyes/XX.png` (where XX is a 2-digit number)
- Use the next available number (currently 00-06, so next would be 07)
- Include @2x and @3x variants

**Preview (SVG):**
- Create SVG file: `avatar-parts/eyes/XX.svg`
- **After creating SVG files, run the regeneration script:**
  ```bash
  cd app && node scripts/regenerate-eyes-correct.js
  ```
  This will automatically convert your SVG files to React components with animation support in `EyesComponents.tsx`

#### Step 4.2: Update `friendAssets.ts`

**Add to `selectionAssets.eyes`:**
```typescript
eyes: {
  // ... existing items
  '07': require('./images/avatars/friend/customization-page/eyes/07.png'),
}
```

**Add to `previewAssets.eyes`:**
```typescript
eyes: {
  // ... existing items
  '07': require('./images/avatars/friend/avatar-parts/eyes/07.svg'),
}
```

#### Step 4.3: Update `options.ts`

Update `EYE_OPTIONS` array:
```typescript
export const EYE_OPTIONS = Array.from({ length: 8 }, (_, i) => String(i).padStart(2, '0'))
// Change length from 7 to 8 (or whatever the new max is)
```

#### Step 4.4: Add Translations

Add translation keys:
```typescript
customizer_eyes_07: 'Eye Shape 07',
```

---

### 5. Adding New Body Types

**Note**: Body types are fixed at 3 options (small, medium, large). Adding new body types requires significant changes to the body rendering system and is not recommended.

If you need to modify body assets:

1. **Selection UI**: Update PNG files in `customization-page/bodies/`
2. **Preview**: Update JSX components in `avatar-parts/bodies/BodyComponents.tsx`

The body preview system uses JSX components with color props, not SVG files.

---

## Naming Conventions

### General Rules

1. **Use lowercase with hyphens** for multi-word names:
   - ✅ `short-and-shirt`
   - ❌ `shortAndShirt` or `short_and_shirt`

2. **Use consistent naming** between selection and preview assets:
   - Selection: `your-item-name.png`
   - Preview: `your-item-name-small.svg`, `your-item-name-medium.svg`, `your-item-name-large.svg`

3. **Hair and Eyes**: Use 2-digit zero-padded numbers:
   - ✅ `01`, `02`, `03`
   - ❌ `1`, `2`, `3`

4. **Clothing**: Use descriptive names:
   - ✅ `dress1`, `blazer1`, `traditional1`
   - ❌ `clothing1`, `item1`

### Special Cases

- **Hair '00'**: Reserved for bald (no hair)
- **Clothing size variants**: Must include `-small`, `-medium`, `-large` suffix for preview assets
- **Device size variants**: Only `prostetic2` currently has size variants (others may be added)

---

## Asset Requirements

### Selection UI Assets (PNG)

- **Format**: PNG
- **Recommended size**: 
  - Bodies: ~80x100px (base)
  - Hair/Eyes: ~80x100px (base)
  - Clothing/Devices: ~80x100px (base)
- **Retina variants**: Include @2x and @3x versions
- **Background**: Transparent
- **Optimization**: Compress for web/mobile

### Preview Assets (SVG)

- **Format**: SVG
- **Design considerations**:
  - Must layer correctly on top of body
  - Should align with body parts
  - Use consistent coordinate system
- **Colors**: Can use `color` or `fill` props for dynamic coloring (hair, eyes)
- **Size variants**: Clothing must have 3 sizes (small, medium, large)
- **Animation support**: SVG files are automatically converted to React components with animation support
  - Use `class` attributes in SVG to mark animated parts (e.g., `class="leftHand"`, `class="rightHand"`, `class="leftLeg"`, `class="rightLeg"`)
  - The regeneration scripts will automatically create `AnimatedG` components for these parts
  - See [Animation System Documentation](./avatar-animations.md) for details

---

## Code Files Reference

### Files to Update

1. **`app/src/resources/assets/friendAssets.ts`**
   - `selectionAssets` - Add PNG asset reference
   - `previewAssets` - Add SVG asset reference
   - `clothingNameMapping` - Add mapping if needed (clothing only)
   - `getPreviewAsset` - Add size variant logic if needed (devices only)

2. **`app/src/screens/CustomAvatarScreen/options.ts`**
   - `CLOTHING_OPTIONS` - Add clothing item name
   - `DEVICE_OPTIONS` - Add device item name
   - `HAIR_OPTIONS` - Update array length
   - `EYE_OPTIONS` - Update array length

3. **`app/src/screens/CustomAvatarScreen/constants.ts`**
   - `DEVICE_SUBCATEGORIES` - Add device to appropriate subcategory (devices only)

4. **Translation files** (`app/src/resources/translations/app/*.ts`)
   - Add translation key: `customizer_{category}_{item-name}`

### Translation Key Patterns

- Clothing: `customizer_clothing_{item-name}`
- Devices: `customizer_device_{item-name}`
- Hair: `customizer_hair_{number}` (e.g., `customizer_hair_01`)
- Eyes: `customizer_eyes_{number}` (e.g., `customizer_eyes_00`)

---

## Regeneration Scripts

After adding new SVG files, you must run the appropriate regeneration script to convert them to React components:

- **Clothing**: `node scripts/regenerate-clothing-correct.js`
- **Devices**: `node scripts/regenerate-devices-correct.js`
- **Hair**: `node scripts/regenerate-hair-correct.js`
- **Eyes**: `node scripts/regenerate-eyes-correct.js`
- **Smile**: `node scripts/regenerate-smile-correct.js`

These scripts:
1. Read all SVG files from the respective directories
2. Convert SVG elements to React Native SVG components
3. Add animation support (AnimatedSvg, AnimatedG) where needed
4. Generate TypeScript interfaces with proper props
5. Write the complete component file

**Important**: Always run the regeneration script after adding or modifying SVG files.

## Testing Checklist

After adding new assets:

- [ ] Run the appropriate regeneration script
- [ ] Selection UI shows the new asset in the customization screen
- [ ] Preview shows the new asset correctly on the avatar
- [ ] Asset appears in the correct category/tab
- [ ] Asset can be selected and deselected
- [ ] Asset renders correctly with different body sizes (for clothing)
- [ ] Asset renders correctly with different colors (for hair/eyes)
- [ ] Asset animates correctly (if animations are enabled)
- [ ] Translation keys work in all supported languages
- [ ] Device subcategory logic works correctly (if applicable)
- [ ] Multiple device selection works correctly (if in 'others' subcategory)

---

## Common Pitfalls

1. **Missing size variants for clothing**: All clothing must have 3 size variants (small, medium, large) in preview assets
2. **Incorrect file paths**: Double-check require() paths match actual file locations
3. **Missing translations**: Add translations to ALL locale files, not just English
4. **Wrong subcategory**: Devices must be in the correct subcategory for proper selection logic
5. **Naming mismatch**: Selection asset name must match the name in `CLOTHING_OPTIONS` or `DEVICE_OPTIONS`
6. **Hair '00'**: Don't add a preview SVG for hair '00' (it's bald)
7. **Array length**: When adding hair/eyes, remember to update the array length in `options.ts`

---

## Examples

### Example 1: Adding a New Dress

1. Create `customization-page/clothing/dress4.png` (with @2x, @3x)
2. Create `avatar-parts/clothing/dress4-small.svg`, `dress4-medium.svg`, `dress4-large.svg`
3. Add to `selectionAssets.clothing`: `'dress4': require(...)`
4. Add to `previewAssets.clothing`: `'dress4-small': require(...)`, etc.
5. Add to `CLOTHING_OPTIONS`: `'dress4'`
6. Add translations: `customizer_clothing_dress4: 'Dress 4'`

### Example 2: Adding a New Hat Device

1. Create `customization-page/devices/baseballcap.png` (with @2x, @3x)
2. Create `avatar-parts/devices/baseballcap.svg`
3. Add to `selectionAssets.devices`: `'baseballcap': require(...)`
4. Add to `previewAssets.devices`: `'baseballcap': require(...)`
5. Add to `DEVICE_OPTIONS`: `'baseballcap'`
6. Add to `DEVICE_SUBCATEGORIES.hats`: `'baseballcap'`
7. Add translations: `customizer_device_baseballcap: 'Baseball Cap'`

### Example 3: Adding a New Hair Style

1. Create `customization-page/hair/19.png` (with @2x, @3x)
2. Create `avatar-parts/hair/19.svg`
3. Add to `selectionAssets.hair`: `'19': require(...)`
4. Add to `previewAssets.hair`: `'19': require(...)`
5. Update `HAIR_OPTIONS`: Change length from 18 to 19
6. Add translations: `customizer_hair_19: 'Hair Style 19'`

---

## Support

For questions or issues:
1. Check existing assets for reference
2. Review the code in `friendAssets.ts` for similar implementations
3. Test thoroughly in the app before committing

