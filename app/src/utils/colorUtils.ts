/**
 * Color utility functions for avatar skin color calculations
 */

/**
 * Converts hex color to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

/**
 * Converts RGB to HSL
 */
function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      case b:
        h = ((r - g) / d + 4) / 6
        break
    }
  }

  return { h, s, l }
}

/**
 * Converts HSL to RGB
 */
function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  let r: number
  let g: number
  let b: number

  if (s === 0) {
    r = g = b = l // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q

    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  }
}

/**
 * Converts RGB to hex
 */
function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('')
}

/**
 * Calculates the darker shade of a skin color based on the relationship
 * between the original light grey (#EFEFEF) and dark grey (#C1C1C1) body colors.
 * 
 * The original colors:
 * - Light grey: #EFEFEF (rgb(239, 239, 239)) - main body
 * - Dark grey: #C1C1C1 (rgb(193, 193, 193)) - shadow parts
 * 
 * This function calculates the same lightness reduction ratio and applies it
 * to any given skin color to generate the darker shadow color.
 * 
 * @param skinColor - Hex color string (e.g., "#F1B98C")
 * @returns Hex color string for the darker shadow version
 */
export function getDarkerSkinColor(skinColor: string): string {
  // Original grey colors
  const lightGrey = '#EFEFEF'
  const darkGrey = '#C1C1C1'

  // Convert to RGB
  const lightGreyRgb = hexToRgb(lightGrey)
  const darkGreyRgb = hexToRgb(darkGrey)
  const skinColorRgb = hexToRgb(skinColor)

  if (!lightGreyRgb || !darkGreyRgb || !skinColorRgb) {
    // Fallback: return a slightly darker version using simple RGB reduction
    const fallbackRgb = {
      r: Math.max(0, skinColorRgb ? skinColorRgb.r - 46 : 0),
      g: Math.max(0, skinColorRgb ? skinColorRgb.g - 46 : 0),
      b: Math.max(0, skinColorRgb ? skinColorRgb.b - 46 : 0),
    }
    return rgbToHex(fallbackRgb.r, fallbackRgb.g, fallbackRgb.b)
  }

  // Convert to HSL
  const lightGreyHsl = rgbToHsl(lightGreyRgb.r, lightGreyRgb.g, lightGreyRgb.b)
  const darkGreyHsl = rgbToHsl(darkGreyRgb.r, darkGreyRgb.g, darkGreyRgb.b)
  const skinColorHsl = rgbToHsl(skinColorRgb.r, skinColorRgb.g, skinColorRgb.b)

  // Calculate the lightness ratio: dark lightness / light lightness
  // This preserves the same proportional darkening for any color
  const lightnessRatio = darkGreyHsl.l / lightGreyHsl.l

  // Apply the same ratio to the skin color's lightness
  const darkerLightness = skinColorHsl.l * lightnessRatio

  // Keep the same hue and saturation, only reduce lightness
  const darkerHsl = {
    h: skinColorHsl.h,
    s: skinColorHsl.s,
    l: Math.max(0, Math.min(1, darkerLightness)), // Clamp between 0 and 1
  }

  // Convert back to RGB and then to hex
  const darkerRgb = hslToRgb(darkerHsl.h, darkerHsl.s, darkerHsl.l)
  return rgbToHex(darkerRgb.r, darkerRgb.g, darkerRgb.b)
}

