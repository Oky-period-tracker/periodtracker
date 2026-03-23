const fs = require('fs');
const path = require('path');

const devicesDir = path.join(__dirname, '../src/resources/assets/images/avatars/friend/avatar-parts/devices');
const svgFiles = fs.readdirSync(devicesDir).filter(file => file.endsWith('.svg')).sort();

// Classes that should use AnimatedG (head and chest are now regular G, only hands and legs use AnimatedG)
const animatedClasses = ['leftHand', 'rightHand', 'leftLeg', 'rightLeg', 'legs'];

// Function to get component name from file path
function getComponentName(filePath) {
  const fileName = path.basename(filePath, '.svg');
  const parts = fileName.split('-');
  const pascalParts = parts.map(part => {
    if (/^\d+$/.test(part)) {
      return part;
    }
    return part.charAt(0).toUpperCase() + part.slice(1);
  });
  return 'Device' + pascalParts.join('');
}

// Function to convert SVG to JSX with proper G/AnimatedG handling
function convertSvgToJsx(svgPath, componentName) {
  const svgContent = fs.readFileSync(svgPath, 'utf8');
  
  const viewBoxMatch = svgContent.match(/viewBox="([^"]+)"/);
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 174 240';
  
  const widthMatch = svgContent.match(/width="([^"]+)"/);
  const heightMatch = svgContent.match(/height="([^"]+)"/);
  const width = widthMatch ? widthMatch[1] : '174';
  const height = heightMatch ? heightMatch[1] : '240';
  
  let cleanedContent = svgContent
    .replace(/<\?xml[^>]*\?>/g, '')
    .replace(/<sodipodi:[^>]*>/g, '')
    .replace(/<\/sodipodi:[^>]*>/g, '')
    .replace(/<inkscape:[^>]*>/g, '')
    .replace(/<\/inkscape:[^>]*>/g, '')
    .replace(/sodipodi:[^=]*="[^"]*"/g, '')
    .replace(/inkscape:[^=]*="[^"]*"/g, '');
  
  const svgMatch = cleanedContent.match(/<svg[^>]*>([\s\S]*)<\/svg>/);
  if (!svgMatch) {
    throw new Error(`Could not parse SVG content from ${svgPath}`);
  }
  
  let jsxContent = svgMatch[1];
  
  // First, preserve mask IDs by temporarily replacing them with placeholders
  const maskIdMap = new Map();
  let maskIdCounter = 0;
  jsxContent = jsxContent.replace(/<mask([^>]*)id="([^"]+)"([^>]*)>/g, (match, before, id, after) => {
    const placeholder = `__MASK_ID_${maskIdCounter}__`;
    maskIdMap.set(placeholder, id);
    maskIdCounter++;
    return `<mask${before}__MASK_ID_PLACEHOLDER_${maskIdCounter - 1}__${after}>`;
  });
  
  // Convert mask elements
  jsxContent = jsxContent.replace(/<mask\s+/g, '<Mask ');
  jsxContent = jsxContent.replace(/style="mask-type:luminance"/g, 'maskType="luminance"');
  jsxContent = jsxContent.replace(/style="mask-type:alpha"/g, 'maskType="alpha"');
  jsxContent = jsxContent.replace(/<\/mask>/g, '</Mask>');
  
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
    .replace(/<filter/g, '<Filter')
    .replace(/<\/filter>/g, '</Filter>')
    .replace(/<feFlood/g, '<FeFlood')
    .replace(/<\/feFlood>/g, '</FeFlood>')
    .replace(/<feColorMatrix/g, '<FeColorMatrix')
    .replace(/<\/feColorMatrix>/g, '</FeColorMatrix>')
    .replace(/<feOffset/g, '<FeOffset')
    .replace(/<\/feOffset>/g, '</FeOffset>')
    .replace(/<feBlend/g, '<FeBlend')
    .replace(/<\/feBlend>/g, '</FeBlend>')
    .replace(/fill-rule/g, 'fillRule')
    .replace(/clip-rule/g, 'clipRule')
    .replace(/fill-opacity/g, 'fillOpacity')
    .replace(/stroke-width/g, 'strokeWidth')
    .replace(/stroke-linecap/g, 'strokeLinecap')
    .replace(/stroke-linejoin/g, 'strokeLinejoin')
    .replace(/stroke-miterlimit/g, 'strokeMiterlimit')
    .replace(/color-interpolation-filters/g, 'colorInterpolationFilters')
    .replace(/flood-opacity/g, 'floodOpacity')
    .replace(/xmlns[^=]*="[^"]*"/g, '')
    .replace(/xmlns[^:]*:[^=]*="[^"]*"/g, '')
    .replace(/version="[^"]*"/g, '')
    .replace(/id="[^"]*"/g, '')
    .replace(/pagecolor="[^"]*"/g, '')
    .replace(/bordercolor="[^"]*"/g, '')
    .replace(/borderopacity="[^"]*"/g, '')
    .replace(/showgrid="[^"]*"/g, '')
    .replace(/inkscape:[^=]*="[^"]*"/g, '')
    .replace(/sodipodi:[^=]*="[^"]*"/g, '');
  
  // Restore mask IDs (after conversion to Mask, look for placeholders)
  maskIdMap.forEach((id, placeholder) => {
    jsxContent = jsxContent.replace(new RegExp(`<Mask([^>]*)__MASK_ID_PLACEHOLDER_${placeholder.replace('__MASK_ID_', '').replace('__', '')}__([^>]*)>`, 'g'), `<Mask$1 id="${id}"$2>`);
  });
  
  // Remove colorInterpolationFilters from Filter elements
  jsxContent = jsxContent.replace(/colorInterpolationFilters="sRGB"/g, '');
  
  // Now handle <g> tags carefully
  const lines = jsxContent.split('\n');
  const processedLines = [];
  let gStack = []; // Track opening tags to match closing tags
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    
    // Check for opening <g> tags
    const gOpenMatch = line.match(/<g\s+class="([^"]+)">/);
    if (gOpenMatch) {
      const className = gOpenMatch[1];
      if (animatedClasses.includes(className)) {
        // Convert to AnimatedG with props
        const propName = className === 'leftHand' ? 'leftHandAnimatedProps' :
                        className === 'rightHand' ? 'rightHandAnimatedProps' :
                        className === 'leftLeg' ? 'leftLegAnimatedProps' :
                        className === 'rightLeg' ? 'rightLegAnimatedProps' :
                        className === 'legs' ? 'leftLegAnimatedProps' : ''; // legs uses leftLeg animation
        line = line.replace(/<g\s+class="([^"]+)">/, `<AnimatedG animatedProps={${propName}}>`);
        gStack.push('AnimatedG');
      } else {
        // Convert to regular G (head and chest are now regular G)
        line = line.replace(/<g\s+class="([^"]+)">/, '<G>');
        gStack.push('G');
      }
    } else if (line.match(/<g\s+style=/)) {
      // <g style=... should be regular G
      line = line.replace(/<g\s+style=/, '<G style=');
      gStack.push('G');
    } else if (line.match(/<g\s+mask=/)) {
      // <g mask=... should be regular G
      line = line.replace(/<g\s+mask=/, '<G mask=');
      gStack.push('G');
    } else if (line.match(/<g>/)) {
      // Plain <g> should be regular G
      line = line.replace(/<g>/, '<G>');
      gStack.push('G');
    } else if (line.match(/<g\s+/)) {
      // Any other <g with attributes should be regular G
      line = line.replace(/<g\s+/, '<G ');
      gStack.push('G');
    }
    
    // Check for closing </g> tags
    if (line.includes('</g>')) {
      const tagType = gStack.pop();
      if (tagType === 'AnimatedG') {
        line = line.replace(/<\/g>/, '</AnimatedG>');
      } else {
        line = line.replace(/<\/g>/, '</G>');
      }
    }
    
    processedLines.push(line);
  }
  
  jsxContent = processedLines.join('\n');
  
  // Remove colorInterpolationFilters from Filter elements (not supported by react-native-svg)
  jsxContent = jsxContent.replace(/colorInterpolationFilters="[^"]*"/g, '');
  
  // Check if we need Defs
  const needsDefs = jsxContent.includes('<Defs') || jsxContent.includes('<Filter') || jsxContent.includes('<Mask');
  
  return {
    componentName,
    jsxContent,
    viewBox,
    width,
    height,
    needsDefs
  };
}

// Generate the complete file
const header = `import * as React from 'react'
import Svg, { Path, Rect, Ellipse, G, Defs, Filter, FeFlood, FeColorMatrix, FeOffset, FeBlend, Mask } from 'react-native-svg'
import Animated, { useAnimatedProps, SharedValue } from 'react-native-reanimated'

const AnimatedG = Animated.createAnimatedComponent(G)
const AnimatedSvg = Animated.createAnimatedComponent(Svg)

`;

const components = [];

for (const svgFile of svgFiles) {
  const svgPath = path.join(devicesDir, svgFile);
  const { componentName, jsxContent, viewBox, width, height } = convertSvgToJsx(svgPath, getComponentName(svgPath));
  
  // Check which animated classes are used in this component
  const hasLeftHand = jsxContent.includes('animatedProps={leftHandAnimatedProps}')
  const hasRightHand = jsxContent.includes('animatedProps={rightHandAnimatedProps}')
  const hasLeftLeg = jsxContent.includes('animatedProps={leftLegAnimatedProps}')
  const hasRightLeg = jsxContent.includes('animatedProps={rightLegAnimatedProps}')
  
  // Build interface based on what's actually used
  const animatedTransformsInterface = ['    jumpY?: SharedValue<number> // Applied to root SVG - makes everything jump together']
  if (hasLeftHand) animatedTransformsInterface.push('    leftHand?: { rotation?: SharedValue<number>; translateX?: SharedValue<number>; translateY?: SharedValue<number> }')
  if (hasRightHand) animatedTransformsInterface.push('    rightHand?: { rotation?: SharedValue<number>; translateX?: SharedValue<number>; translateY?: SharedValue<number> }')
  if (hasLeftLeg) animatedTransformsInterface.push('    leftLeg?: { scaleY?: SharedValue<number> }')
  if (hasRightLeg) animatedTransformsInterface.push('    rightLeg?: { scaleY?: SharedValue<number> }')
  
  const interfaceCode = `interface ${componentName}Props {
  width?: number | string
  height?: number | string
  color?: string
  fill?: string
  animatedTransforms?: {
${animatedTransformsInterface.join('\n')}
  }
}

`;

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
${jsxContent.split('\n').map(line => '      ' + line).join('\n')}
    </AnimatedSvg>
  )
}

`;

  components.push(interfaceCode + componentCode);
}

const outputFile = path.join(devicesDir, 'DevicesComponents.tsx');
fs.writeFileSync(outputFile, header + components.join('\n'));
console.log(`Regenerated ${outputFile} with ${components.length} components`);
