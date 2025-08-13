
// src/utils.js
export function stringifySection(obj, orderedKeys) {
  // If orderedKeys is empty, return empty string (blank section placeholder)
  if (!orderedKeys || orderedKeys.length === 0) return '';
  return orderedKeys.map(k => (obj[k] ?? '')).join('|');
}
