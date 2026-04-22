
const fs = require('fs');
const path = require('path');

function countMeshes(filePath) {
    const buffer = fs.readFileSync(filePath);
    
    // Header check
    const magic = buffer.readUInt32LE(0);
    if (magic !== 0x46546C67) { // "glTF"
        console.error('Not a valid GLB file');
        return;
    }
    
    // Chunk 0 header
    const jsonChunkLength = buffer.readUInt32LE(12);
    const jsonChunkType = buffer.readUInt32LE(16);
    
    if (jsonChunkType !== 0x4E4F534A) { // "JSON"
        console.error('First chunk is not JSON');
        return;
    }
    
    const jsonContent = buffer.toString('utf8', 20, 20 + jsonChunkLength);
    try {
        const gltf = JSON.parse(jsonContent);
        const meshCount = gltf.meshes ? gltf.meshes.length : 0;
        const nodeCount = gltf.nodes ? gltf.nodes.length : 0;
        const meshesWithNames = gltf.meshes ? gltf.meshes.map(m => m.name || 'unnamed') : [];
        
        console.log(`Mesh Count: ${meshCount}`);
        console.log(`Node Count: ${nodeCount}`);
        console.log(`Mesh Names: ${JSON.stringify(meshesWithNames)}`);
    } catch (e) {
        console.error('Error parsing JSON chunk:', e);
    }
}

const glbPath = process.argv[2];
if (glbPath) {
    countMeshes(glbPath);
} else {
    console.error('Please provide a GLB file path');
}
