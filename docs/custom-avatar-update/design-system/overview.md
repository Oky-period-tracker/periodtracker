# Design System Overview

This document provides a high-level overview of the design system and responsive breakpoints used throughout the application.

---

## Design System Architecture

The application uses a **dual breakpoint system** that combines height-based and width-based responsive configurations to ensure optimal layouts across all device sizes.

### Core Concepts

1. **Height-Based Breakpoints** (`BreakPointSize`): Determines overall UI configuration based on screen height
2. **Width-Based Breakpoints** (`WidthBreakpointSize`): Provides fine-grained control for width-specific adjustments
3. **UIConfig**: Centralized configuration object containing all design tokens and component specifications
4. **Scaling Functions**: Standardized utilities for responsive dimension calculations

---

## Breakpoint System

### Height-Based Breakpoints

**Purpose**: Determines the primary UI configuration based on screen height.

**Breakpoints**:
- **`s` (Small)**: `0px` - Default for phones and small devices
- **`m` (Medium)**: `840px` - Tablets and larger devices
- **`l` (Large)**: `900px` - Large tablets and desktops

**Usage**: The `size` value from `ResponsiveContext` selects the appropriate `UIConfig` from `responsiveConfig`.

### Width-Based Breakpoints

**Purpose**: Provides granular control for width-specific responsive adjustments.

**Breakpoints**:
- **`xs` (Extra Small)**: `< 360dp` - Very small phones
- **`sm` (Small)**: `360-480dp` - Small phones
- **`md` (Medium)**: `480-840dp` - Large phones and small tablets
- **`lg` (Large)**: `840-1200dp` - Tablets
- **`xl` (Extra Large)**: `> 1200dp` - Large tablets and desktops

**Usage**: Used for conditional styling, margin/padding adjustments, and component-specific responsive logic.

---

## UIConfig Structure

The `UIConfig` interface defines design tokens for all major UI components and screens:

### Component Configurations

- **Carousel**: Card dimensions and spacing for day scroll carousel
- **Center Card**: Main calendar card dimensions and typography
- **Tutorial**: Tutorial container and emoji card specifications
- **Progress Section**: Progress bar and icon sizing
- **Misc**: General touchable row dimensions

### Screen-Specific Configurations

- **Avatar Customization**: Color swatches, body types, option images, category icons, spacing
- **Avatar Selection**: Avatar sizes, margins, borders, typography, button padding
- **Theme Selection**: Theme card dimensions, margins, typography, button padding

### Design Tokens

Each configuration includes:
- **Dimensions**: Width, height, sizes
- **Spacing**: Margins, padding, gaps
- **Typography**: Font sizes, line heights
- **Layout**: Container widths, percentages, offsets

---

## Responsive Context

The `ResponsiveContext` provides access to responsive values throughout the application:

**Available Values**:
- `width`: Screen width (rounded to integer)
- `height`: Screen height
- `size`: Height-based breakpoint (`'s' | 'm' | 'l'`)
- `widthBreakpoint`: Width-based breakpoint (`'xs' | 'sm' | 'md' | 'lg' | 'xl'`)
- `UIConfig`: Complete UI configuration object for current size

**Usage**: Components access responsive values via `useResponsive()` hook.

---

## Scaling Functions

Standardized scaling utilities ensure consistent responsive behavior:

### Primary Scaling Functions

- **`scaleHorizontal(value)`**: Scales horizontal dimensions (width, padding, margins)
- **`scaleVertical(value)`**: Scales vertical dimensions (height, padding, margins)
- **`scaleFont(value)`**: Scales font sizes and text-related dimensions
- **`scaleDimension(value)`**: Scales general dimensions (icons, borders, etc.)

**Implementation**: All use `moderateScale` with a factor of `0.3` for consistent, moderate scaling.

### Utility Functions

- **`getWidthBreakpoint(width)`**: Determines current width breakpoint
- **`getResponsiveValue(width, values)`**: Gets responsive value with fallback to smaller breakpoints
- **`getResponsiveMargin(width, margins)`**: Gets responsive margin based on breakpoint
- **`getResponsivePadding(width, paddings)`**: Gets responsive padding based on breakpoint

---

## Responsive Patterns

### Pattern 1: UIConfig-Based Configuration

Components use `UIConfig` values directly from `ResponsiveContext`:

```typescript
const { UIConfig } = useResponsive()
const cardWidth = UIConfig.carousel.cardWidth
```

### Pattern 2: Width Breakpoint Conditionals

Components adjust behavior based on width breakpoint:

```typescript
const { widthBreakpoint, width } = useResponsive()
if (widthBreakpoint === 'lg') {
  // Large screen adjustments
}
```

### Pattern 3: Responsive Value Lookup

Components use responsive value functions with breakpoint-specific values:

```typescript
const margin = getResponsiveMargin(width, {
  sm: 10,
  md: 20,
  lg: 30
})
```

### Pattern 4: Scaled Dimensions

Components use scaling functions for proportional adjustments:

```typescript
const padding = scaleHorizontal(16)
const fontSize = scaleFont(14)
```

---

## Design Principles

### 1. Mobile-First Approach

- Default configuration (`size: 's'`) targets mobile devices
- Larger breakpoints enhance rather than replace mobile layouts

### 2. Consistent Scaling

- All scaling uses the same factor (`0.3`) for visual consistency
- Scaling functions are used consistently across the application

### 3. Centralized Configuration

- All design tokens live in `UIConfig`
- Changes to design system happen in one place
- No hardcoded values in components

### 4. Progressive Enhancement

- Base layout works on smallest devices
- Larger breakpoints add enhancements (more spacing, larger fonts, etc.)
- Fallback logic ensures values always exist

### 5. Type Safety

- TypeScript interfaces ensure configuration consistency
- Breakpoint types prevent invalid values
- Autocomplete support for all configuration options

---

## Component Categories

### Layout Components

- **Carousel**: Day scroll carousel with responsive card sizing
- **Center Card**: Main calendar display with responsive dimensions
- **Touchable Rows**: List items with responsive padding and height

### Screen Components

- **Avatar Screens**: Customization and selection with extensive responsive configuration
- **Theme Screen**: Theme selection with responsive card layouts
- **Main Screen**: Calendar and day tracking with responsive carousel

### UI Elements

- **Progress Section**: Progress bars and icons with responsive sizing
- **Tutorial Components**: Tutorial cards and modals with responsive typography
- **Buttons**: Responsive padding and sizing

---

## Key Files

### Configuration

- **`app/src/config/UIConfig.ts`**: Main configuration file with all design tokens
- **`app/src/contexts/ResponsiveContext.tsx`**: Responsive context provider and hook

### Utilities

- **`app/src/utils/responsive.ts`**: Scaling functions and breakpoint utilities
- **`app/src/utils/layoutCalculations.ts`**: Advanced layout calculation utilities

### Usage

- Components import `useResponsive()` from `ResponsiveContext`
- Components import scaling functions from `utils/responsive`
- Components import `UIConfig` type for TypeScript support

---

## Best Practices

1. **Always use UIConfig**: Never hardcode dimensions, use `UIConfig` values
2. **Use scaling functions**: Apply scaling consistently using provided utilities
3. **Leverage breakpoints**: Use width breakpoints for fine-grained control
4. **Test across devices**: Verify layouts on multiple screen sizes
5. **Maintain consistency**: Follow existing patterns for new components
6. **Type safety**: Use TypeScript types for all configuration access

---

## Summary

The design system provides a comprehensive, type-safe approach to responsive design through:

- **Dual breakpoint system** (height + width) for flexible layouts
- **Centralized configuration** (`UIConfig`) for all design tokens
- **Standardized scaling** functions for consistent responsive behavior
- **Progressive enhancement** from mobile-first to larger screens
- **Type-safe** implementation with full TypeScript support

This architecture ensures consistent, maintainable, and scalable responsive design across all device sizes.

