const fs = require('fs');
const path = require('path');

const clothingDir = path.join(__dirname, '../src/resources/assets/images/avatars/friend/display/clothing');
const tsxFile = path.join(clothingDir, 'ClothingComponents.tsx');
const tsxContent = fs.readFileSync(tsxFile, 'utf8');

// Map from animated class to AnimatedG prop name
const animatedPropToClass = {
  'leftHandAnimatedProps': 'leftHand',
  'rightHandAnimatedProps': 'rightHand',
  'leftLegAnimatedProps': 'leftLeg',
  'rightLegAnimatedProps': 'rightLeg',
};

// Convert component name back to filename
// ClothingBlazer1Large -> blazer-1-large.svg
function componentNameToFilename(componentName) {
  // Remove "Clothing" prefix
  let name = componentName.replace(/^Clothing/, '');

  // Split on transitions: letter->digit, digit->letter, uppercase->lowercase
  // e.g. "Blazer1Large" -> ["Blazer", "1", "Large"]
  const parts = [];
  let current = '';

  for (let i = 0; i < name.length; i++) {
    const ch = name[i];
    const prev = i > 0 ? name[i - 1] : '';

    if (i === 0) {
      current = ch;
      continue;
    }

    // Start new part on: uppercase letter after lowercase, digit after letter, letter after digit
    const isNewPart =
      (ch >= 'A' && ch <= 'Z' && prev >= 'a' && prev <= 'z') ||
      (ch >= '0' && ch <= '9' && (prev < '0' || prev > '9')) ||
      ((ch < '0' || ch > '9') && prev >= '0' && prev <= '9');

    if (isNewPart) {
      parts.push(current);
      current = ch;
    } else {
      current += ch;
    }
  }
  if (current) parts.push(current);

  return parts.map(p => p.toLowerCase()).join('-') + '.svg';
}

// Extract all components using export const pattern
const componentRegex = /export const (\w+): React\.FC<\w+Props> = \(\{[^}]*\}\) => \{[\s\S]*?return \(\s*<AnimatedSvg[^>]*viewBox="([^"]*)"[^>]*>\s*<Rect width="(\d+)" height="(\d+)" fill="none"\s*\/>([\s\S]*?)\s*<\/AnimatedSvg>\s*\)\s*\}/g;

let match;
let count = 0;

while ((match = componentRegex.exec(tsxContent)) !== null) {
  const componentName = match[1];
  const viewBox = match[2];
  const width = match[3];
  const height = match[4];
  let body = match[5];

  // Reverse JSX to SVG transformations

  // Handle AnimatedG -> g with class
  body = body.replace(/<AnimatedG animatedProps=\{(\w+)\}>/g, (m, propName) => {
    const className = animatedPropToClass[propName];
    if (className) {
      return `<g class="${className}">`;
    }
    return '<g>';
  });
  body = body.replace(/<\/AnimatedG>/g, '</g>');

  // Handle G -> g
  body = body.replace(/<G>/g, '<g>');
  body = body.replace(/<G\s+/g, '<g ');
  body = body.replace(/<\/G>/g, '</g>');

  // Handle other elements
  body = body.replace(/<Path/g, '<path');
  body = body.replace(/<\/Path>/g, '</path>');
  body = body.replace(/<Rect/g, '<rect');
  body = body.replace(/<\/Rect>/g, '</rect>');
  body = body.replace(/<Ellipse/g, '<ellipse');
  body = body.replace(/<\/Ellipse>/g, '</ellipse>');
  body = body.replace(/<Defs/g, '<defs');
  body = body.replace(/<\/Defs>/g, '</defs>');
  body = body.replace(/<Mask\s+/g, '<mask ');
  body = body.replace(/<\/Mask>/g, '</mask>');

  // Reverse attribute name changes
  body = body.replace(/fillRule/g, 'fill-rule');
  body = body.replace(/clipRule/g, 'clip-rule');
  body = body.replace(/fillOpacity/g, 'fill-opacity');
  body = body.replace(/strokeWidth/g, 'stroke-width');
  body = body.replace(/strokeLinecap/g, 'stroke-linecap');
  body = body.replace(/strokeLinejoin/g, 'stroke-linejoin');
  body = body.replace(/strokeMiterlimit/g, 'stroke-miterlimit');

  // Reverse mask type attributes
  body = body.replace(/maskType="luminance"/g, 'style="mask-type:luminance"');
  body = body.replace(/maskType="alpha"/g, 'style="mask-type:alpha"');

  // Remove extra leading Rect (the first <rect ... fill="none"/> that duplicates the outer one)
  // The generate script adds one Rect in the template, but the SVG content may also start with one
  body = body.replace(/^\s*<rect width="\d+" height="\d+" fill="none"\s*\/>\s*\n?/, '');

  // Clean up JSX self-closing syntax: remove spaces before />
  // (JSX often formats as `prop />` while SVG uses `prop/>`)
  // Actually, keep as-is since SVG allows spaces before />

  const filename = componentNameToFilename(componentName);

  const svgContent = `<svg width="${width}" height="${height}" viewBox="${viewBox}" fill="none" xmlns="http://www.w3.org/2000/svg">
${body}
</svg>
`;

  const outputPath = path.join(clothingDir, filename);
  fs.writeFileSync(outputPath, svgContent);
  count++;
  console.log(`  Generated: ${filename}`);
}

console.log(`\nGenerated ${count} SVG files in ${clothingDir}`);
