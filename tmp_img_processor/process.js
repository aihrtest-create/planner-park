const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const folder = '/Users/dima/Desktop/DR-construct(Anti)/public/cakes';

async function processAll() {
    const files = fs.readdirSync(folder).filter(f => f.endsWith('.jpeg') || f.endsWith('.jpg') || f.endsWith('.png'));

    for (const f of files) {
        const file = path.join(folder, f);
        const img = sharp(file);
        const { width, height } = await img.metadata();
        const shift = Math.floor(height * 0.25); // shift by 1/4

        // Create a new image of the same size with a black background
        // First we extract the bottom 3/4 of the original image
        const extracted = await sharp(file)
            .extract({ left: 0, top: shift, width: width, height: height - shift })
            .toBuffer();
        
        // Then we place it at the top of a new black canvas of size W x H
        await sharp({
            create: {
                width: width,
                height: height,
                channels: 3,
                background: { r: 0, g: 0, b: 0 }
            }
        })
        .composite([{ input: extracted, top: 0, left: 0 }])
        .toFile(path.join(folder, 'temp_' + f));

        fs.renameSync(path.join(folder, 'temp_' + f), file);
    }
    console.log("Finished converting all " + files.length + " files.");
}

processAll().catch(console.error);
