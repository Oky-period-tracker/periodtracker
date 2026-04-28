const fs = require('fs')
const path = require('path')

const { stripUnsupportedSvgFeatures, safeStripIds } = require('./svg-utils')

const devicesDir = path.join(
  __dirname,
  '../src/resources/assets/images/avatars/friend/display/devices',
)
const svgFiles = fs
  .readdirSync(devicesDir)
  .filter((file) => file.endsWith('.svg'))
  .sort()

// Classes that should use AnimatedG (head and chest are now regular G, only hands and legs use AnimatedG)
const animatedClasses = ['leftHand', 'rightHand', 'leftLeg', 'rightLeg', 'legs']

// Devices whose entire content should be wrapped in a HandGroup (rotation around shoulder pivot,
// expanded viewBox to prevent clipping during rotation). Keyed by SVG basename (without .svg).
const handDeviceConfigs = {
  cane: { side: 'left', shoulderX: 75, shoulderY: 94 },
  prostetic1: { side: 'left', shoulderX: 75, shoulderY: 94 },
  purse: { side: 'right', shoulderX: 98.4, shoulderY: 94.5 },
}

// Devices whose entire content should be wrapped in a LegGroup (scaleY animation).
const legDevices = new Set(['prosteticleg2-large', 'prosteticleg2-medium', 'prosteticleg2-small'])

// Function to get component name from file path
function getComponentName(filePath) {
  const fileName = path.basename(filePath, '.svg')
  const parts = fileName.split('-')
  const pascalParts = parts.map((part) => {
    if (/^\d+$/.test(part)) {
      return part
    }
    return part.charAt(0).toUpperCase() + part.slice(1)
  })
  return 'Device' + pascalParts.join('')
}

// Function to convert SVG to JSX with proper G/AnimatedG handling
function convertSvgToJsx(svgPath, componentName) {
  const svgContent = fs.readFileSync(svgPath, 'utf8')

  const viewBoxMatch = svgContent.match(/viewBox="([^"]+)"/)
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 174 240'

  const widthMatch = svgContent.match(/width="([^"]+)"/)
  const heightMatch = svgContent.match(/height="([^"]+)"/)
  const width = widthMatch ? widthMatch[1] : '174'
  const height = heightMatch ? heightMatch[1] : '240'

  let cleanedContent = svgContent
    .replace(/<\?xml[^>]*\?>/g, '')
    .replace(/<sodipodi:[^>]*>/g, '')
    .replace(/<\/sodipodi:[^>]*>/g, '')
    .replace(/<inkscape:[^>]*>/g, '')
    .replace(/<\/inkscape:[^>]*>/g, '')
    .replace(/sodipodi:[^=]*="[^"]*"/g, '')
    .replace(/inkscape:[^=]*="[^"]*"/g, '')

  const svgMatch = cleanedContent.match(/<svg[^>]*>([\s\S]*)<\/svg>/)
  if (!svgMatch) {
    throw new Error(`Could not parse SVG content from ${svgPath}`)
  }

  let jsxContent = svgMatch[1]

  // Strip unsupported SVG features before conversion
  jsxContent = stripUnsupportedSvgFeatures(jsxContent)

  // Convert mask elements
  jsxContent = jsxContent.replace(/<mask\s+/g, '<Mask ')
  jsxContent = jsxContent.replace(/style="mask-type:luminance"/g, 'maskType="luminance"')
  jsxContent = jsxContent.replace(/style="mask-type:alpha"/g, 'maskType="alpha"')
  jsxContent = jsxContent.replace(/<\/mask>/g, '</Mask>')

  // Convert other SVG elements
  jsxContent = jsxContent
    .replace(/<rect/g, '<Rect')
    .replace(/<\/rect>/g, '</Rect>')
    .replace(/<ellipse/g, '<Ellipse')
    .replace(/<\/ellipse>/g, '</Ellipse>')
    .replace(/<path/g, '<Path')
    .replace(/<\/path>/g, '</Path>')
    .replace(/<defs/g, '<Defs')
    .replace(/<\/defs>/g, '</Defs>')
    .replace(/fill-rule/g, 'fillRule')
    .replace(/clip-rule/g, 'clipRule')
    .replace(/fill-opacity/g, 'fillOpacity')
    .replace(/stroke-width/g, 'strokeWidth')
    .replace(/stroke-linecap/g, 'strokeLinecap')
    .replace(/stroke-linejoin/g, 'strokeLinejoin')
    .replace(/stroke-miterlimit/g, 'strokeMiterlimit')
    .replace(/xmlns[^=]*="[^"]*"/g, '')
    .replace(/xmlns[^:]*:[^=]*="[^"]*"/g, '')
    .replace(/version="[^"]*"/g, '')
    .replace(/pagecolor="[^"]*"/g, '')
    .replace(/bordercolor="[^"]*"/g, '')
    .replace(/borderopacity="[^"]*"/g, '')
    .replace(/showgrid="[^"]*"/g, '')
    .replace(/inkscape:[^=]*="[^"]*"/g, '')
    .replace(/sodipodi:[^=]*="[^"]*"/g, '')

  // Strip id="..." attributes but preserve mask ids (needed for mask="url(#...)" references)
  jsxContent = safeStripIds(jsxContent)

  // Now handle <g> tags carefully
  const lines = jsxContent.split('\n')
  const processedLines = []
  let gStack = [] // Track opening tags to match closing tags

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i]

    // Check for opening <g> tags
    const gOpenMatch = line.match(/<g\s+class="([^"]+)">/)
    if (gOpenMatch) {
      const className = gOpenMatch[1]
      if (animatedClasses.includes(className)) {
        // Convert to AnimatedG with props
        const propName =
          className === 'leftHand'
            ? 'leftHandAnimatedProps'
            : className === 'rightHand'
            ? 'rightHandAnimatedProps'
            : className === 'leftLeg'
            ? 'leftLegAnimatedProps'
            : className === 'rightLeg'
            ? 'rightLegAnimatedProps'
            : className === 'legs'
            ? 'leftLegAnimatedProps'
            : '' // legs uses leftLeg animation
        line = line.replace(/<g\s+class="([^"]+)">/, `<AnimatedG animatedProps={${propName}}>`)
        gStack.push('AnimatedG')
      } else {
        // Convert to regular G (head and chest are now regular G)
        line = line.replace(/<g\s+class="([^"]+)">/, '<G>')
        gStack.push('G')
      }
    } else if (line.match(/<g\s+style=/)) {
      // <g style=... should be regular G
      line = line.replace(/<g\s+style=/, '<G style=')
      gStack.push('G')
    } else if (line.match(/<g\s+mask=/)) {
      // <g mask=... should be regular G
      line = line.replace(/<g\s+mask=/, '<G mask=')
      gStack.push('G')
    } else if (line.match(/<g>/)) {
      // Plain <g> should be regular G
      line = line.replace(/<g>/, '<G>')
      gStack.push('G')
    } else if (line.match(/<g\s+/)) {
      // Any other <g with attributes should be regular G
      line = line.replace(/<g\s+/, '<G ')
      gStack.push('G')
    }

    // Check for closing </g> tags
    if (line.includes('</g>')) {
      const tagType = gStack.pop()
      if (tagType === 'AnimatedG') {
        line = line.replace(/<\/g>/, '</AnimatedG>')
      } else {
        line = line.replace(/<\/g>/, '</G>')
      }
    }

    processedLines.push(line)
  }

  jsxContent = processedLines.join('\n')

  // Check if we need Defs
  const needsDefs = jsxContent.includes('<Defs') || jsxContent.includes('<Mask')

  return {
    componentName,
    jsxContent,
    viewBox,
    width,
    height,
    needsDefs,
  }
}

// Generate the complete file
const header = `import * as React from 'react'
import Svg, { Path, Rect, Ellipse, G, Mask } from 'react-native-svg'
import Animated, { useAnimatedProps, SharedValue } from 'react-native-reanimated'

const AnimatedG = Animated.createAnimatedComponent(G)
const AnimatedSvg = Animated.createAnimatedComponent(Svg)

// Shared hook for hand rotation animation on device accessories
const useHandRotation = (
  animatedTransforms: { leftHand?: { rotation?: SharedValue<number> }; rightHand?: { rotation?: SharedValue<number> } } | undefined,
  side: 'left' | 'right',
  shoulderX: number,
  shoulderY: number,
) => {
  const rotation = side === 'left' ? animatedTransforms?.leftHand?.rotation : animatedTransforms?.rightHand?.rotation

  const handAnimatedProps = useAnimatedProps(() => {
    'worklet'
    const r = rotation?.value ?? 0
    if (r === 0) return { transform: [] }
    return {
      transform: [
        { translateX: shoulderX },
        { translateY: shoulderY },
        { rotate: \`\${r}deg\` },
        { translateX: -shoulderX },
        { translateY: -shoulderY },
      ],
    }
  })

  const HandGroup = rotation ? AnimatedG : G
  const handGroupProps = rotation ? { animatedProps: handAnimatedProps } : {}

  return { HandGroup, handGroupProps }
}

// Shared hook for leg scale animation on prosthetic leg devices
const useLegScale = (
  animatedTransforms: { leftLeg?: { scaleY?: SharedValue<number> } } | undefined,
) => {
  const legAnimatedProps = useAnimatedProps(() => {
    'worklet'
    const scaleY = animatedTransforms?.leftLeg?.scaleY?.value ?? 1
    return { transform: [{ scaleY }] }
  })

  const hasLeg = animatedTransforms?.leftLeg?.scaleY
  const LegGroup = hasLeg ? AnimatedG : G
  const legGroupProps = hasLeg ? { animatedProps: legAnimatedProps } : {}

  return { LegGroup, legGroupProps }
}

// Shared viewBox expansion for hand-attached devices (prevents SVG clipping during rotation)
const useExpandedViewBox = (width: number | string, height: number | string) => {
  const pad = 100
  const vbW = 174 + pad * 2
  const vbH = 240 + pad * 2
  const w = Number(width) * vbW / 174
  const h = Number(height) * vbH / 240
  const s = Math.min(Number(width) / 174, Number(height) / 240)
  const oX = -pad * s
  const oY = -pad * s + 5
  const viewBox = \`\${-pad} \${-pad} \${vbW} \${vbH}\`
  return { w, h, viewBox, oX, oY }
}

`

const components = []

for (const svgFile of svgFiles) {
  const svgPath = path.join(devicesDir, svgFile)
  const svgBaseName = path.basename(svgFile, '.svg')
  const { componentName, jsxContent, viewBox, width, height } = convertSvgToJsx(
    svgPath,
    getComponentName(svgPath),
  )

  // Some devices wrap their entire content in a HandGroup or LegGroup using shared hooks.
  // For these, we emit a custom template instead of the default AnimatedG-class-driven one.
  const handConfig = handDeviceConfigs[svgBaseName]
  const isLegDevice = legDevices.has(svgBaseName)

  if (handConfig || isLegDevice) {
    const animatedTransformsInterface = [
      '    jumpY?: SharedValue<number> // Applied to root SVG - makes everything jump together',
    ]
    if (handConfig) {
      const handKey = handConfig.side === 'left' ? 'leftHand' : 'rightHand'
      animatedTransformsInterface.push(`    ${handKey}?: { rotation?: SharedValue<number> }`)
    } else {
      animatedTransformsInterface.push('    leftLeg?: { scaleY?: SharedValue<number> }')
    }

    const interfaceCode = `interface ${componentName}Props {
  width?: number | string
  height?: number | string
  color?: string
  fill?: string
  animatedTransforms?: {
${animatedTransformsInterface.join('\n')}
  }
}

`

    const rootSvgAnimatedPropsCode = `  // Animated props for root SVG - applies jump to entire device
  const rootSvgAnimatedProps = useAnimatedProps(() => {
    'worklet'
    const jumpY = animatedTransforms?.jumpY?.value ?? 0
    return {
      transform: [
        { translateY: jumpY },
      ],
    }
  })`

    const indentedJsx = jsxContent
      .split('\n')
      .map((line) => '      ' + line)
      .join('\n')

    let componentCode
    if (handConfig) {
      const { side, shoulderX, shoulderY } = handConfig
      componentCode = `export const ${componentName}: React.FC<${componentName}Props> = ({
  width = ${width},
  height = ${height},
  color,
  fill,
  animatedTransforms,
}) => {
  const fillColor = color || fill || 'currentColor'

${rootSvgAnimatedPropsCode}

  const { HandGroup, handGroupProps } = useHandRotation(animatedTransforms, '${side}', ${shoulderX}, ${shoulderY})
  const { w, h, viewBox, oX, oY } = useExpandedViewBox(width, height)

  return (
    <AnimatedSvg width={w} height={h} viewBox={viewBox} fill="none" preserveAspectRatio="xMinYMin meet" style={{ position: 'absolute', top: oY, left: oX }} animatedProps={rootSvgAnimatedProps}>
      <Rect width="${width}" height="${height}" fill="none"/>

      <HandGroup {...handGroupProps}>
${indentedJsx}
      </HandGroup>

    </AnimatedSvg>
  )
}

`
    } else {
      componentCode = `export const ${componentName}: React.FC<${componentName}Props> = ({
  width = ${width},
  height = ${height},
  color,
  fill,
  animatedTransforms,
}) => {
  const fillColor = color || fill || 'currentColor'

${rootSvgAnimatedPropsCode}

  const { LegGroup, legGroupProps } = useLegScale(animatedTransforms)

  return (
    <AnimatedSvg width={width} height={height} viewBox="${viewBox}" fill="none" animatedProps={rootSvgAnimatedProps}>
      <Rect width="${width}" height="${height}" fill="none"/>

      <LegGroup {...legGroupProps}>
${indentedJsx}
      </LegGroup>

    </AnimatedSvg>
  )
}

`
    }

    components.push(interfaceCode + componentCode)
    continue
  }

  // Check which animated classes are used in this component
  const hasLeftHand = jsxContent.includes('animatedProps={leftHandAnimatedProps}')
  const hasRightHand = jsxContent.includes('animatedProps={rightHandAnimatedProps}')
  const hasLeftLeg = jsxContent.includes('animatedProps={leftLegAnimatedProps}')
  const hasRightLeg = jsxContent.includes('animatedProps={rightLegAnimatedProps}')

  // Build interface based on what's actually used
  const animatedTransformsInterface = [
    '    jumpY?: SharedValue<number> // Applied to root SVG - makes everything jump together',
  ]
  if (hasLeftHand)
    animatedTransformsInterface.push(
      '    leftHand?: { rotation?: SharedValue<number>; translateX?: SharedValue<number>; translateY?: SharedValue<number> }',
    )
  if (hasRightHand)
    animatedTransformsInterface.push(
      '    rightHand?: { rotation?: SharedValue<number>; translateX?: SharedValue<number>; translateY?: SharedValue<number> }',
    )
  if (hasLeftLeg) animatedTransformsInterface.push('    leftLeg?: { scaleY?: SharedValue<number> }')
  if (hasRightLeg)
    animatedTransformsInterface.push('    rightLeg?: { scaleY?: SharedValue<number> }')

  const interfaceCode = `interface ${componentName}Props {
  width?: number | string
  height?: number | string
  color?: string
  fill?: string
  animatedTransforms?: {
${animatedTransformsInterface.join('\n')}
  }
}

`

  // Build animated props definitions based on what's used
  const animatedPropsCode = []

  // Always add root SVG animated props for jump
  animatedPropsCode.push(`  // Animated props for root SVG - applies jump to entire device
  const rootSvgAnimatedProps = useAnimatedProps(() => {
    'worklet'
    const jumpY = animatedTransforms?.jumpY?.value ?? 0
    return {
      transform: [
        { translateY: jumpY },
      ],
    }
  })`)

  if (hasLeftHand) {
    animatedPropsCode.push(`  const leftHandAnimatedProps = useAnimatedProps(() => {
    'worklet'
    const rotation = animatedTransforms?.leftHand?.rotation?.value ?? 0
    const translateX = animatedTransforms?.leftHand?.translateX?.value ?? 0
    const translateY = animatedTransforms?.leftHand?.translateY?.value ?? 0
    return {
      transform: [
        { translateX },
        { translateY },
        { rotate: \`\${rotation}deg\` },
      ],
    }
  })`)
  }
  if (hasRightHand) {
    animatedPropsCode.push(`  const rightHandAnimatedProps = useAnimatedProps(() => {
    'worklet'
    const rotation = animatedTransforms?.rightHand?.rotation?.value ?? 0
    const translateX = animatedTransforms?.rightHand?.translateX?.value ?? 0
    const translateY = animatedTransforms?.rightHand?.translateY?.value ?? 0
    return {
      transform: [
        { translateX },
        { translateY },
        { rotate: \`\${rotation}deg\` },
      ],
    }
  })`)
  }
  if (hasLeftLeg) {
    animatedPropsCode.push(`  const leftLegAnimatedProps = useAnimatedProps(() => {
    'worklet'
    const scaleY = animatedTransforms?.leftLeg?.scaleY?.value ?? 1
    return {
      transform: [
        { scaleY },
      ],
    }
  })`)
  }
  if (hasRightLeg) {
    animatedPropsCode.push(`  const rightLegAnimatedProps = useAnimatedProps(() => {
    'worklet'
    const scaleY = animatedTransforms?.rightLeg?.scaleY?.value ?? 1
    return {
      transform: [
        { scaleY },
      ],
    }
  })`)
  }

  const componentCode = `export const ${componentName}: React.FC<${componentName}Props> = ({
  width = ${width},
  height = ${height},
  color,
  fill,
  animatedTransforms,
}) => {
  const fillColor = color || fill || 'currentColor'

${animatedPropsCode.join('\n\n')}

  return (
    <AnimatedSvg width={width} height={height} viewBox="${viewBox}" fill="none" animatedProps={rootSvgAnimatedProps}>
      <Rect width="${width}" height="${height}" fill="none"/>
${jsxContent
  .split('\n')
  .map((line) => '      ' + line)
  .join('\n')}
    </AnimatedSvg>
  )
}

`

  components.push(interfaceCode + componentCode)
}

const outputFile = path.join(devicesDir, 'DevicesComponents.tsx')
fs.writeFileSync(outputFile, header + components.join('\n'))
console.log(`Regenerated ${outputFile} with ${components.length} components`)
