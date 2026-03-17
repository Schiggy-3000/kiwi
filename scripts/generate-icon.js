const Jimp = require('jimp-compact');
const path = require('path');

const INPUT = path.join(__dirname, '../assets/images/kiwi-icon.png');
const OUTPUT = path.join(__dirname, '../assets/images/play-store-icon-512.png');

const BRAND_GREEN = 0x004e2aff; // #004e2a fully opaque

async function main() {
  const logo = await Jimp.read(INPUT);
  const side = Math.max(logo.getWidth(), logo.getHeight()); // 546

  // Create a square green canvas
  const canvas = new Jimp(side, side, BRAND_GREEN);

  // Composite logo centered vertically and horizontally
  const x = Math.floor((side - logo.getWidth()) / 2);
  const y = Math.floor((side - logo.getHeight()) / 2);
  canvas.composite(logo, x, y);

  // Resize down to 512×512
  canvas.resize(512, 512);

  await canvas.writeAsync(OUTPUT);
  console.log('✅  Saved:', OUTPUT);
}

main().catch(err => { console.error(err); process.exit(1); });
