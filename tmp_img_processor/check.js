const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const folder = '/Users/dima/Desktop/DR-construct(Anti)/public/cakes';

async function checkBounds() {
    const files = fs.readdirSync(folder).filter(f => f.endsWith('.jpeg') || f.endsWith('.jpg') || f.endsWith('.png'));
    if (files.length === 0) {
        console.log("No files found.");
        return;
    }
    const file = path.join(folder, files[0]);
    console.log(`Checking ${files[0]}`);

    // Get metadata
    const { width, height } = await sharp(file).metadata();
    
    // Find content bounds by trimming black
    const trimmed = await sharp(file).trim({
        background: { r: 10, g: 10, b: 10, alpha: 1 },
        threshold: 20
    }).metadata();
    
    console.log(`Original: ${width}x${height}`);
    console.log(`Content (trimmed): width: ${trimmed.width}, height: ${trimmed.height}`);
    // Wait, sharp's trim removes borders but doesn't easily return the offsets natively in `.metadata()` in all versions, 
    // actually trim info is returned if we do it. Let's do a raw pixel check or just try trimming and see.
}

checkBounds().catch(console.error);
