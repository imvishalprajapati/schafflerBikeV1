const fs = require('fs');
const content = fs.readFileSync('src/data/components.js', 'utf8');
const regex = /id:\s*\"([^\"]+)\"/g;
let ids = [];
let match;
while ((match = regex.exec(content)) !== null) {
  ids.push(match[1]);
}
console.log('Total IDs found:', ids.length);
console.log('IDs:', ids.join(', '));
