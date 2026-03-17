const Jimp = require('jimp-compact');
const path = require('path');

const INPUT  = path.join(__dirname, '../play-store-assets/app_icon.PNG');
const OUTPUT = path.join(__dirname, '../assets/images/readme-icon.png');

async function main() {
  const img = await Jimp.read(INPUT);
  const w = img.getWidth();
  const h = img.getHeight();
  const r = Math.round(w * 0.18); // corner radius: 18% of width

  img.scan(0, 0, w, h, function(x, y, idx) {
    // Check if pixel is inside the rounded rectangle
    const inLeft   = x < r;
    const inRight  = x > w - r - 1;
    const inTop    = y < r;
    const inBottom = y > h - r - 1;

    if (inLeft && inTop) {
      if ((x - r) ** 2 + (y - r) ** 2 > r ** 2)
        this.bitmap.data[idx + 3] = 0;
    } else if (inRight && inTop) {
      if ((x - (w - r - 1)) ** 2 + (y - r) ** 2 > r ** 2)
        this.bitmap.data[idx + 3] = 0;
    } else if (inLeft && inBottom) {
      if ((x - r) ** 2 + (y - (h - r - 1)) ** 2 > r ** 2)
        this.bitmap.data[idx + 3] = 0;
    } else if (inRight && inBottom) {
      if ((x - (w - r - 1)) ** 2 + (y - (h - r - 1)) ** 2 > r ** 2)
        this.bitmap.data[idx + 3] = 0;
    }
  });

  await img.writeAsync(OUTPUT);
  console.log('✅  Saved:', OUTPUT);
}

main().catch(err => { console.error(err); process.exit(1); });
