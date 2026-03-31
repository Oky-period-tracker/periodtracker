# Avatar Animation System

This document explains how the avatar animation system works and how to add animation support to new avatar components (clothing, devices, hair, eyes).

## Overview

The avatar animation system uses **React Native Reanimated** to create smooth, performant animations that run on the UI thread. The system supports:

- **Jump animation**: Entire avatar moves up and down (applied to root SVG)
- **Hand animations**: Left and right hands wave (rotation around shoulder joint)
- **Leg animations**: Legs bend during jump (scaleY transform)
- **Eye animations**: Eyes look left and right (translateX transform)

All animations are coordinated through the `AnimatedAvatarPreview` component and passed down to individual components via `animatedTransforms` props.

---

## Architecture

### Component Hierarchy

```
AnimatedAvatarPreview
  └─> AvatarPreview
       └─> BodyComponents (BodySmall/Medium/Large)
       └─> ClothingComponents (ClothingBlazer1Small, etc.)
       └─> DevicesComponents (DeviceBandana, etc.)
       └─> HairComponents (Hair01, Hair02, etc.)
       └─> EyesComponents (Eye00, Eye01, etc.)
       └─> SmileComponents (Smile01, etc.)
```

### Animation Flow

1. **AnimatedAvatarPreview** creates shared values for each animation:
   - `jumpY`: Vertical movement for jump animation
   - `leftHandRotation` / `rightHandRotation`: Hand wave angles
   - `leftLegScaleY` / `rightLegScaleY`: Leg bend during jump
   - `eyeX`: Horizontal eye movement

2. **AnimatedAvatarPreview** orchestrates the animation sequence:
   - Eyes animation (5.2s)
   - Jump animation (1.6s) - starts after 1s pause
   - Left hand wave (2s) - starts after 1s pause
   - Right hand wave (2s) - starts after 1s pause
   - Sequence repeats infinitely

3. **AnimatedTransforms** object is passed to all components:
   ```typescript
   {
     jumpY: SharedValue<number>,
     leftHand: { rotation: SharedValue<number> },
     rightHand: { rotation: SharedValue<number> },
     leftLeg: { scaleY: SharedValue<number> },
     rightLeg: { scaleY: SharedValue<number> },
     eyes: { translateX: SharedValue<number> }
   }
   ```

4. **Individual components** receive `animatedTransforms` and apply animations:
   - Root SVG uses `AnimatedSvg` with `jumpY` transform
   - Hand groups use `AnimatedG` with rotation transforms
   - Leg groups use `AnimatedG` with scaleY transforms

---

## Component Structure

### Root SVG Element

All animated components use `AnimatedSvg` as the root element to apply the jump animation:

```typescript
import Animated from 'react-native-reanimated'
import Svg from 'react-native-svg'

const AnimatedSvg = Animated.createAnimatedComponent(Svg)

// In component:
const rootSvgAnimatedProps = useAnimatedProps(() => {
  'worklet'
  const jumpY = animatedTransforms?.jumpY?.value ?? 0
  return {
    transform: [
      { translateY: jumpY },
    ],
  }
})

return (
  <AnimatedSvg 
    width={width} 
    height={height} 
    viewBox="0 0 174 240" 
    animatedProps={rootSvgAnimatedProps}
  >
    {/* SVG content */}
  </AnimatedSvg>
)
```

### Animated Groups

Parts that need individual animations (hands, legs) use `AnimatedG`:

```typescript
import { G } from 'react-native-svg'
const AnimatedG = Animated.createAnimatedComponent(G)

// Hand animation example:
const leftHandAnimatedProps = useAnimatedProps(() => {
  'worklet'
  const rotation = animatedTransforms?.leftHand?.rotation?.value ?? 0
  if (rotation === 0) {
    return { transform: [] } // No transform when rotation is 0
  }
  const shoulderX = 75
  const shoulderY = 94
  // Rotate around shoulder joint: translate to point, rotate, translate back
  return {
    transform: [
      { translateX: shoulderX },
      { translateY: shoulderY },
      { rotate: `${rotation}deg` },
      { translateX: -shoulderX },
      { translateY: -shoulderY },
    ],
  }
})

return (
  <AnimatedG animatedProps={leftHandAnimatedProps}>
    {/* Hand SVG paths */}
  </AnimatedG>
)
```

---

## SVG Class Attributes

To enable animations in your SVG files, use `class` attributes to mark animated parts:

### Supported Classes

- `leftHand` - Left hand/arm (rotation animation)
- `rightHand` - Right hand/arm (rotation animation)
- `leftLeg` - Left leg (scaleY animation during jump)
- `rightLeg` - Right leg (scaleY animation during jump)
- `head` - Head (not animated, but can be used for grouping)
- `chest` - Chest/torso (not animated, but can be used for grouping)

### Example SVG Structure

```xml
<svg width="174" height="240" viewBox="0 0 174 240">
  <g class="leftHand">
    <!-- Left hand paths -->
  </g>
  <g class="rightHand">
    <!-- Right hand paths -->
  </g>
  <g class="leftLeg">
    <!-- Left leg paths -->
  </g>
  <g class="rightLeg">
    <!-- Right leg paths -->
  </g>
  <g>
    <!-- Other non-animated parts -->
  </g>
</svg>
```

**Note**: `head` and `chest` classes are converted to regular `<G>` tags (not animated). Only `leftHand`, `rightHand`, `leftLeg`, and `rightLeg` are converted to `AnimatedG`.

---

## Regeneration Scripts

The regeneration scripts automatically:

1. **Convert SVG to React components**:
   - `<svg>` → `<AnimatedSvg>`
   - `<g class="leftHand">` → `<AnimatedG animatedProps={leftHandAnimatedProps}>`
   - `<path>` → `<Path>`
   - `<rect>` → `<Rect>`
   - `<ellipse>` → `<Ellipse>`
   - `<mask>` → `<Mask>` (with ID preservation)

2. **Generate animated props**:
   - `rootSvgAnimatedProps` for jump animation
   - `leftHandAnimatedProps` / `rightHandAnimatedProps` for hand animations
   - `leftLegAnimatedProps` / `rightLegAnimatedProps` for leg animations

3. **Create TypeScript interfaces**:
   - Props interface with `animatedTransforms` type
   - Only includes animation types that are actually used in the component

4. **Handle special cases**:
   - Preserves mask IDs for `mask="url(#...)"` references
   - Converts `fill="currentColor"` to `fill={fillColor}` for hair/eyes
   - Removes unnecessary attributes (xmlns, version, etc.)

### Running Regeneration Scripts

```bash
# Clothing
cd app && node scripts/regenerate-clothing-correct.js

# Devices
cd app && node scripts/regenerate-devices-correct.js

# Hair
cd app && node scripts/regenerate-hair-correct.js

# Eyes
cd app && node scripts/regenerate-eyes-correct.js

# Smile
cd app && node scripts/regenerate-smile-correct.js
```

---

## Adding Animation Support to New Components

### Step 1: Prepare SVG File

1. Add `class` attributes to animated parts:
   ```xml
   <g class="leftHand">
     <!-- Left hand paths -->
   </g>
   <g class="rightHand">
     <!-- Right hand paths -->
   </g>
   ```

2. Ensure SVG structure is correct:
   - Root `<svg>` element with proper viewBox
   - Proper grouping of elements
   - Correct coordinate system

### Step 2: Run Regeneration Script

Run the appropriate regeneration script for your component type. The script will:

- ✅ Convert SVG to React component
- ✅ Add `AnimatedSvg` root element
- ✅ Convert animated groups to `AnimatedG`
- ✅ Generate `useAnimatedProps` hooks
- ✅ Create TypeScript interface
- ✅ Add to component file

### Step 3: Verify Component

Check the generated component:

1. **Root element** should be `AnimatedSvg`:
   ```typescript
   <AnimatedSvg animatedProps={rootSvgAnimatedProps}>
   ```

2. **Animated groups** should use `AnimatedG`:
   ```typescript
   <AnimatedG animatedProps={leftHandAnimatedProps}>
   ```

3. **Interface** should include `animatedTransforms`:
   ```typescript
   interface YourComponentProps {
     animatedTransforms?: {
       jumpY?: SharedValue<number>
       leftHand?: { rotation?: SharedValue<number> }
       // ... etc
     }
   }
   ```

### Step 4: Test Animation

1. Use the component in `AnimatedAvatarPreview`
2. Verify animations work correctly
3. Check that non-animated avatars are not affected (rotation === 0 check)

---

## Hand Animation Details

### Shoulder Pivot Points

Hand animations rotate around the shoulder joint. The pivot coordinates vary by body size:

**Body Small:**
- Left shoulder: (75.31, 93.84)
- Right shoulder: (98.75, 93.84)

**Body Medium:**
- Left shoulder: (75, 94)
- Right shoulder: (98.88, 94.46)

**Body Large:**
- Left shoulder: (75, 94)
- Right shoulder: (97.57, 95.14)

### Rotation Pattern

To rotate around a pivot point, use the translate-rotate-translate pattern:

```typescript
transform: [
  { translateX: shoulderX },    // Move to pivot
  { translateY: shoulderY },
  { rotate: `${rotation}deg` },  // Rotate
  { translateX: -shoulderX },   // Move back
  { translateY: -shoulderY },
]
```

### Zero Rotation Check

Always check if rotation is 0 to avoid affecting non-animated avatars:

```typescript
if (rotation === 0) {
  return { transform: [] } // No transform
}
```

---

## Leg Animation Details

### Scale Transform

Legs use `scaleY` transform to create a bending effect during jump:

```typescript
const leftLegAnimatedProps = useAnimatedProps(() => {
  'worklet'
  const scaleY = animatedTransforms?.leftLeg?.scaleY?.value ?? 1
  return {
    transform: [
      { scaleY },
    ],
  }
})
```

- `scaleY: 1` = normal leg
- `scaleY: 0.95` = slightly bent (during jump)
- Scale is synchronized with `jumpY` animation

---

## Eye Animation Details

### Horizontal Movement

Eyes use `translateX` for left/right movement:

```typescript
const eyesAnimatedProps = useAnimatedProps(() => {
  'worklet'
  const translateX = animatedTransforms?.eyes?.translateX?.value ?? 0
  return {
    transform: [
      { translateX },
    ],
  }
})
```

- `translateX: -3` = look left
- `translateX: 0` = look center
- `translateX: 3` = look right

---

## Important Notes

### 1. Worklet Directive

All `useAnimatedProps` callbacks **must** include the `'worklet'` directive:

```typescript
const animatedProps = useAnimatedProps(() => {
  'worklet'  // ← Required!
  // ... animation code
})
```

This ensures the code runs on the UI thread for smooth animations.

### 2. Transform Format

Use React Native array format for transforms:

```typescript
// ✅ Correct
transform: [
  { translateX: 10 },
  { translateY: 20 },
  { rotate: '45deg' },
]

// ❌ Wrong (SVG string format)
transform: 'translate(10, 20) rotate(45)'
```

### 3. No Dependency Arrays

Don't add dependency arrays to `useAnimatedProps`:

```typescript
// ✅ Correct
const animatedProps = useAnimatedProps(() => {
  'worklet'
  // ...
})

// ❌ Wrong
const animatedProps = useAnimatedProps(() => {
  'worklet'
  // ...
}, []) // ← Don't add this!
```

Reanimated automatically tracks shared values used within the worklet.

### 4. Conditional Rendering

For non-animated avatars, use conditional rendering:

```typescript
// Check if animations are present
const hasHandAnimations = animatedTransforms?.rightHand?.rotation || animatedTransforms?.leftHand?.rotation
const RightHandGroup = hasHandAnimations ? AnimatedG : G
const rightHandProps = hasHandAnimations ? { animatedProps: rightHandAnimatedProps } : {}

return (
  <RightHandGroup {...rightHandProps}>
    {/* Hand content */}
  </RightHandGroup>
)
```

This ensures non-animated avatars use regular `G` elements without transforms.

### 5. Mask IDs

If your SVG uses masks, ensure mask IDs are preserved:

```xml
<mask id="mask0_123456">
  <!-- mask content -->
</mask>
<g mask="url(#mask0_123456)">
  <!-- masked content -->
</g>
```

The regeneration scripts automatically preserve mask IDs.

---

## Animation Sequence

The complete animation sequence (from `AnimatedAvatarPreview.tsx`):

1. **Eyes** (5.2s total):
   - Look left (400ms)
   - Stay left (2000ms)
   - Look right (400ms)
   - Stay right (2000ms)
   - Return center (400ms)

2. **Jump** (1.6s total, starts after 1s pause):
   - Jump up (800ms)
   - Come down (800ms)
   - Legs scale down/up simultaneously

3. **Left Hand** (2s total, starts after 1s pause):
   - Wave to left side (300ms)
   - Hold (200ms)
   - Return (500ms)
   - Repeat once

4. **Right Hand** (2s total, starts after 1s pause):
   - Wave to right side (300ms)
   - Hold (200ms)
   - Return (500ms)
   - Repeat once

**Total sequence duration**: ~13.8s, then repeats infinitely.

---

## Troubleshooting

### Animation Not Visible

1. **Check `'worklet'` directive**: Must be present in all `useAnimatedProps`
2. **Check transform format**: Must use array format, not string
3. **Check shared values**: Ensure `animatedTransforms` are passed correctly
4. **Check component structure**: Root should be `AnimatedSvg`, animated parts should be `AnimatedG`

### Hands Moving Incorrectly

1. **Check shoulder coordinates**: Must match body size
2. **Check rotation pivot**: Use translate-rotate-translate pattern
3. **Check zero rotation**: Return empty transform when rotation is 0

### Legs Not Bending

1. **Check scaleY value**: Should animate from 1 to 0.95 and back
2. **Check synchronization**: Leg animation should match jump timing
3. **Check AnimatedG**: Leg groups must use `AnimatedG` with `scaleY` transform

### Mask Not Working

1. **Check mask ID**: Must be preserved in regeneration
2. **Check mask reference**: `mask="url(#maskId)"` must match mask `id`
3. **Check Mask component**: Should use `<Mask>` not `<mask>`

---

## Examples

### Example 1: Adding Animation to New Clothing

1. Create SVG file: `blazer2-small.svg`
2. Add class attributes:
   ```xml
   <g class="leftHand"><!-- left hand --></g>
   <g class="rightHand"><!-- right hand --></g>
   ```
3. Run: `node scripts/regenerate-clothing-correct.js`
4. Component is automatically generated with animation support

### Example 2: Adding Animation to New Device

1. Create SVG file: `sunglasses.svg`
2. No class attributes needed (devices typically don't animate)
3. Run: `node scripts/regenerate-devices-correct.js`
4. Component is generated with `jumpY` support only

### Example 3: Manual Animation Setup (Advanced)

If you need to manually add animations:

```typescript
import Animated, { useAnimatedProps, SharedValue } from 'react-native-reanimated'
import Svg, { G, Path } from 'react-native-svg'

const AnimatedG = Animated.createAnimatedComponent(G)
const AnimatedSvg = Animated.createAnimatedComponent(Svg)

interface MyComponentProps {
  animatedTransforms?: {
    jumpY?: SharedValue<number>
    leftHand?: { rotation?: SharedValue<number> }
  }
}

export const MyComponent: React.FC<MyComponentProps> = ({ animatedTransforms }) => {
  const rootSvgAnimatedProps = useAnimatedProps(() => {
    'worklet'
    const jumpY = animatedTransforms?.jumpY?.value ?? 0
    return {
      transform: [{ translateY: jumpY }],
    }
  })

  const leftHandAnimatedProps = useAnimatedProps(() => {
    'worklet'
    const rotation = animatedTransforms?.leftHand?.rotation?.value ?? 0
    if (rotation === 0) {
      return { transform: [] }
    }
    return {
      transform: [
        { translateX: 75 },
        { translateY: 94 },
        { rotate: `${rotation}deg` },
        { translateX: -75 },
        { translateY: -94 },
      ],
    }
  })

  return (
    <AnimatedSvg width={174} height={240} animatedProps={rootSvgAnimatedProps}>
      <AnimatedG animatedProps={leftHandAnimatedProps}>
        {/* Hand paths */}
      </AnimatedG>
    </AnimatedSvg>
  )
}
```

---

## Related Documentation

- [Adding New Assets](./adding-new-assets.md) - How to add new avatar assets
- [React Native Reanimated Docs](https://docs.swmansion.com/react-native-reanimated/) - Official Reanimated documentation
- [React Native SVG Docs](https://github.com/react-native-svg/react-native-svg) - Official SVG documentation

---

## Support

For questions or issues:

1. Check existing animated components for reference
2. Review the regeneration scripts in `app/scripts/`
3. Test animations in `AnimatedAvatarPreview` component
4. Verify `'worklet'` directive and transform format
