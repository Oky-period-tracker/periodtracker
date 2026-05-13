// Shared utilities for SVG-to-React-Native component generation scripts
//
// react-native-svg does not reliably support certain SVG features on iOS/Android:
// - SVG filter primitives (filter, feFlood, feBlend, feColorMatrix, feOffset) cause native crashes on iOS
// - CSS style strings like "mix-blend-mode:..." are not supported (react-native-svg expects style objects)
// These are purely cosmetic effects (drop shadows, blend modes) — stripping them is safe.

/**
 * Strip SVG features not reliably supported by react-native-svg on iOS/Android.
 * Call this on raw SVG inner content BEFORE converting elements to JSX.
 */
function stripUnsupportedSvgFeatures(content) {
  // Remove filter="url(...)" attributes from elements
  content = content.replace(/\s*filter="url\([^)]*\)"/g, '');
  // Remove style="mix-blend-mode:..." CSS strings (keeps other attributes like opacity)
  content = content.replace(/\s*style="mix-blend-mode:[^"]*"/g, '');
  // Remove <filter>...</filter> blocks entirely (multi-line)
  content = content.replace(/<filter[\s\S]*?<\/filter>/gi, '');
  // Remove empty <defs></defs> blocks left after filter removal
  content = content.replace(/<defs>\s*<\/defs>/gi, '');
  return content;
}

/**
 * Strip all id="..." attributes EXCEPT those on <mask> elements.
 *
 * <mask> elements need their ids for mask="url(#...)" references to work.
 * Without ids, react-native-svg crashes on iOS with a nil dictionary key
 * in -[RNSVGSvgView defineMask:maskName:].
 *
 * Use this instead of a raw .replace(/id="[^"]*"/g, '') in the scripts.
 */
function safeStripIds(content) {
  // Temporarily replace mask id="..." with placeholders
  const maskIds = [];
  content = content.replace(/<(mask|Mask)([^>]*)id="([^"]+)"([^>]*)>/g, (_match, tag, before, id, after) => {
    const placeholder = `__MASK_ID_${maskIds.length}__`;
    maskIds.push(id);
    return `<${tag}${before}${placeholder}${after}>`;
  });

  // Strip all remaining id="..." attributes
  content = content.replace(/id="[^"]*"/g, '');

  // Restore mask ids
  maskIds.forEach((id, idx) => {
    content = content.replace(`__MASK_ID_${idx}__`, `id="${id}"`);
  });

  return content;
}

module.exports = { stripUnsupportedSvgFeatures, safeStripIds };
