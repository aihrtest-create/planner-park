const Jimp = require('jimp');
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'Начинки');
const outDir = path.join(__dirname, 'Начинки', '800x800');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir);
}

fs.readdirSync(dir).forEach(file => {
  if (file.endsWith('.png')) {
    const filePath = path.join(dir, file);
    const outPath = path.join(outDir, file);
    
    Jimp.read(filePath)
      .then(img => {
        new Jimp(800, 800, 0x00000000, (err, bg) => {
          if (err) throw err;
          
          const x = (800 - img.bitmap.width) / 2;
          const y = (800 - img.bitmap.height) / 2;
          
          bg.composite(img, x, y);
          bg.write(outPath);
          console.log(`Processed ${file}`);
        });
      })
      .catch(err => {
        console.error(`Error processing ${file}:`, err);
      });
  }
});
