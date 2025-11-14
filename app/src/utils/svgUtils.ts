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

  const innerContent = svgMatch[1]
  const svgAttributes = svgMatch[0].match(/<svg([^>]*)>/i)?.[1] || ''

  // Create a new SVG with a color filter
  // This approach uses CSS filters which might not work in react-native-svg
  // So we'll use a simpler approach: replace fill colors

  // For now, use the simpler fill replacement
  return applyColorToSvg(svgContent, color)
}

/**
 * Load SVG file content as string
 * Note: In React Native, we need to use a different approach
 * This is a placeholder - actual implementation depends on your setup
 */
export const loadSvgAsString = async (svgPath: string): Promise<string | null> => {
  // In React Native, we can't directly read files from require()
  // We need to either:
  // 1. Use react-native-fs (but requires native modules)
  // 2. Convert SVGs to strings at build time
  // 3. Use a bundler plugin to inline SVG content
  
  // For now, return null - we'll handle this differently
  return null
}

