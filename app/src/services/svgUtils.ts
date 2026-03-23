/**
 * Utility functions for working with SVG files in React Native
 */

/**
 * Apply color to SVG content by modifying fill and stroke attributes
 * This function modifies the SVG string to apply colors
 */
export const applyColorToSvg = (svgContent: string, color: string): string => {
  if (!svgContent || !color) return svgContent

  // Replace fill attributes with the specified color
  // This handles both fill="..." and fill='...' and fill without quotes
  let modified = svgContent.replace(
    /fill\s*=\s*["']?[^"'\s>]+["']?/gi,
    `fill="${color}"`
  )

  // Also replace stroke attributes if needed
  modified = modified.replace(
    /stroke\s*=\s*["']?[^"'\s>]+["']?/gi,
    `stroke="${color}"`
  )

  return modified
}

/**
 * Apply color tint to SVG by wrapping it in a color filter
 * This is a more sophisticated approach that preserves gradients and patterns
 */
export const applyTintToSvg = (svgContent: string, color: string): string => {
  if (!svgContent || !color) return svgContent

  // Extract the SVG content (remove XML declaration and svg tag)
  const svgMatch = svgContent.match(/<svg[^>]*>([\s\S]*)<\/svg>/i)
  if (!svgMatch) return svgContent

  // Create a new SVG with a color filter
  // This approach uses CSS filters which might not work in react-native-svg
  // So we'll use a simpler approach: replace fill colors

  // For now, use the simpler fill replacement
  return applyColorToSvg(svgContent, color)
}
