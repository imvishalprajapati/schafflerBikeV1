/**
 * Utility for robust 3D mesh name cleaning and mapping.
 * Handles common GLTF exporter suffixes and provides fuzzy matching.
 */

/**
 * Strips common GLTF suffixes like _primitive0, _mesh, _node, etc.
 * to get the "base" logical name (e.g., M4C_primitive0 -> M4C)
 */
export const getBaseName = (name) => {
  if (!name) return '';
  return name.replace(/_primitive\d+$/i, '')
             .replace(/_mesh\d*$/i, '')
             .replace(/_node\d*$/i, '')
             .replace(/__\d+$/g, '')
             .trim();
};

/**
 * Cleans a string of all non-alphanumeric characters and converts to lowercase.
 */
export const cleanString = (str) => {
  if (!str) return '';
  return str.replace(/[^a-z0-9]/gi, '').toLowerCase();
};

/**
 * Checks if a mesh name matches any of the target names for a component.
 * Performs deep cleaning and suffix-stripping on both sides.
 */
export const isMeshMatch = (meshName, targetNames = [], componentId = '') => {
  const meshFullClean = cleanString(meshName);
  const meshBaseClean = cleanString(getBaseName(meshName));
  
  const searchTargets = [...(targetNames || []), componentId].filter(Boolean);
  
  return searchTargets.some(target => {
    const targetClean = cleanString(getBaseName(target));
    
    // Prevent empty string false matches (e.g., 'bms'.includes(''))
    if (!targetClean || !meshBaseClean) return false;
    // Don't match on single generic characters
    if (targetClean.length < 2 || meshBaseClean.length < 2) return false;

    // 1. Exact match after cleaning (M4C == m4c)
    // 2. Substring match (M4C_primitive0 includes m4c)
    // 3. Reverse substring (m4c includes M4)
    return meshFullClean === targetClean || 
           meshFullClean.includes(targetClean) ||
           targetClean.includes(meshBaseClean);
  });
};
