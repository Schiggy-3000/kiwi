const Jimp = require('jimp-compact');
const path = require('path');

const INPUT  = path.join(__dirname, '../assets/images/kiwi-icon.png');
const OUTPUT = path.join(__dirname, '../assets/images/splash-icon.png');

const RADIUS = 80; // corner radius in pixels

async function main() {
  const img = await Jimp.read(INPUT);
  const w = img.getWidth();
  const h = img.getHeight();

  img.scan(0, 0, w, h, function (x, y, idx) {
    // Check if pixel is inside any of the 4 rounded corners
    const inTopLeft     = x < RADIUS     && y < RADIUS     && (x - RADIUS)     ** 2 + (y - RADIUS)     ** 2 > RADIUS ** 2;
    const inTopRight    = x > w - RADIUS && y < RADIUS     && (x - (w - RADIUS)) ** 2 + (y - RADIUS)     ** 2 > RADIUS ** 2;
    const inBottomLeft  = x < RADIUS     && y > h - RADIUS && (x - RADIUS)     ** 2 + (y - (h - RADIUS)) ** 2 > RADIUS ** 2;
    const inBottomRight = x > w - RADIUS && y > h - RADIUS && (x - (w - RADIUS)) ** 2 + (y - (h - RADIUS)) ** 2 > RADIUS ** 2;

    if (inTopLeft || inTopRight || inBottomLeft || inBottomRight) {
      this.bitmap.data[idx + 3] = 0; // set alpha to 0 (transparent)
    }
  });

  await img.writeAsync(OUTPUT);
  console.log(`✅  Saved ${w}×${h} with rounded corners (r=${RADIUS}px):`, OUTPUT);
}

main().catch(err => { console.error(err); process.exit(1); });
