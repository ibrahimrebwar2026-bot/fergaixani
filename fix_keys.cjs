const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// The items map button key
code = code.replace(/key=\{item\}/g, "key={`group-item-${item}`}");

// Replace any generic key={i} in the school section
// First let's do a wider replace of key={i} where it might conflict.
code = code.replace(/key=\{i\}/g, "key={`index-${i}`}");

// Check items map index
code = code.replace(/key=\{_idx\}/g, "key={`idx-${_idx}`}");

fs.writeFileSync('src/App.tsx', code);
console.log("Keys replaced");
