// Creates a minimal 1x1 PNG icon.ico for Tauri Windows build
const fs = require('fs');
const path = require('path');

// Minimal 1x1 PNG (valid PNG file)
const pngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
const pngBuffer = Buffer.from(pngBase64, 'base64');

// Create ICO file (ICO header + 1 entry + PNG data)
const icoHeader = Buffer.alloc(6);
icoHeader.writeUInt16LE(0, 0);  // reserved
icoHeader.writeUInt16LE(1, 2);  // type: ICO
icoHeader.writeUInt16LE(1, 4);  // count: 1

const entry = Buffer.alloc(16);
entry.writeUInt8(pngBuffer.length > 0 ? 1 : 1, 0);   // width (1px, 0=256)
entry.writeUInt8(1, 1);    // height (1px, 0=256)
entry.writeUInt8(0, 2);    // colors
entry.writeUInt8(0, 3);    // reserved
entry.writeUInt16LE(1, 4); // planes
entry.writeUInt16LE(32, 6); // bpp (32-bit)
entry.writeUInt32LE(pngBuffer.length, 8); // size
entry.writeUInt32LE(6 + 16, 12); // offset

const icoBuffer = Buffer.concat([icoHeader, entry, pngBuffer]);

const iconsDir = path.join(__dirname, 'src-tauri', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

fs.writeFileSync(path.join(iconsDir, 'icon.png'), pngBuffer);
fs.writeFileSync(path.join(iconsDir, 'icon.ico'), icoBuffer);

console.log('✅ Icon files created successfully!');
console.log(`   icon.png: ${pngBuffer.length} bytes`);
console.log(`   icon.ico: ${icoBuffer.length} bytes`);