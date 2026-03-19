const fs = require('fs');
const path = require('path');

const eyesDir = path.join(__dirname, '../src/resources/assets/images/avatars/friend/avatar-parts/eyes');
const svgFiles = fs.readdirSync(eyesDir).filter(file => file.endsWith('.svg')).sort();

// Classes that should use AnimatedG (for eyes, "eye" class)
const animatedClasses = ['eye', 'eyes'];

// Function to get component name from file path
function getComponentName(filePath) {
  const fileName = path.basename(filePath, '.svg');
  // Eye files are like "00.svg", "01.svg", etc.
  const match = fileName.match(/^(\d+)$/);
  if (match) {
    const num = match[1].padStart(2, '0');
    return `Eye${num}`;
  }
  // Fallback: capitalize first letter
  return 'Eye' + fileName.charAt(0).toUpperCase() + fileName.slice(1);
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
  
  // Convert other SVG elements
  jsxContent = jsxContent
    .replace(/<rect/g, '<Rect')
    .replace(/<\/rect>/g, '</Rect>')
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
    .replace(/id="[^"]*"/g, '')
    .replace(/pagecolor="[^"]*"/g, '')
    .replace(/bordercolor="[^"]*"/g, '')
    .replace(/borderopacity="[^"]*"/g, '')
    .replace(/showgrid="[^"]*"/g, '')
    .replace(/inkscape:[^=]*="[^"]*"/g, '')
    .replace(/sodipodi:[^=]*="[^"]*"/g, '');
  
  // Now handle <g> tags carefully
  const lines = jsxContent.split('\n');
  const processedLines = [];
  let gStack = []; // Track opening tags to match closing tags
  let eyeCount = 0; // Track which eye (left or right)
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    
    // Check for opening <g> tags
    const gOpenMatch = line.match(/<g\s+class="([^"]+)">/);
    if (gOpenMatch) {
      const className = gOpenMatch[1];
      if (animatedClasses.includes(className)) {
        // Convert to AnimatedG with props
        // Determine if it's left or right eye based on position (first eye = right, second = left)
        const isLeftEye = eyeCount > 0;
        eyeCount++;
        const propName = isLeftEye ? 'leftEyeAnimatedProps' : 'rightEyeAnimatedProps';
        line = line.replace(/<g\s+class="([^"]+)">/, `<AnimatedG animatedProps={${propName}}>`);
        gStack.push('AnimatedG');
      } else {
        // Convert to regular G
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
  
  // Replace fill="currentColor" with fill={fillColor} so the color prop works
  jsxContent = jsxContent.replace(/fill="currentColor"/g, 'fill={fillColor}');
  
  // Check if we need Defs
  const needsDefs = jsxContent.includes('<Defs') || jsxContent.includes('<Filter');
  
  return {
    componentName,
    jsxContent,
    viewBox,
    width,
    height,
    needsDefs,
    hasEyes: eyeCount > 0
  };
}

// Generate the complete file
const header = `import * as React from 'react'
import Svg, { Path, Rect, G, Defs } from 'react-native-svg'
import Animated, { useAnimatedProps, SharedValue } from 'react-native-reanimated'

const AnimatedG = Animated.createAnimatedComponent(G)
const AnimatedSvg = Animated.createAnimatedComponent(Svg)

`;

const components = [];

for (const svgFile of svgFiles) {
  const svgPath = path.join(eyesDir, svgFile);
  const { componentName, jsxContent, viewBox, width, height, hasEyes } = convertSvgToJsx(svgPath, getComponentName(svgPath));
  
  // Build interface
  const animatedTransformsInterface = ['    jumpY?: SharedValue<number> // Applied to root SVG - makes everything jump together']
  if (hasEyes) {
    animatedTransformsInterface.push('    eyes?: { translateX?: SharedValue<number>; translateY?: SharedValue<number> }')
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

`;

  // Build animated props
  const animatedPropsCode = []
  
  // Always add root SVG animated props for jump
  animatedPropsCode.push(`  // Animated props for root SVG - applies jump to entire eyes
  const rootSvgAnimatedProps = useAnimatedProps(() => {
    'worklet'
    const jumpY = animatedTransforms?.jumpY?.value ?? 0
    return {
      transform: [
        { translateY: jumpY },
      ],
    }
  })`)
  
  if (hasEyes) {
    animatedPropsCode.push(`  // Animated props for right eye
  const rightEyeAnimatedProps = useAnimatedProps(() => {
    'worklet'
    const translateX = animatedTransforms?.eyes?.translateX?.value ?? 0
    return {
      transform: [
        { translateX },
      ],
    }
  })
  
  // Animated props for left eye
  const leftEyeAnimatedProps = useAnimatedProps(() => {
    'worklet'
    const translateX = animatedTransforms?.eyes?.translateX?.value ?? 0
    return {
      transform: [
        { translateX },
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

const outputFile = path.join(eyesDir, 'EyesComponents.tsx');
fs.writeFileSync(outputFile, header + components.join('\n'));
console.log(`Regenerated ${outputFile} with ${components.length} components`);
