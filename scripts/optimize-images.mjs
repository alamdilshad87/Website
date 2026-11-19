// Turns source images into responsive WebP files under public/.
//
//   npm run images -- "<folder with personal photos>"
//
// Design slides come from assets-src/design (committed). Personal photos are
// read from the folder you pass in, so the multi-MB camera originals never
// enter the repo; only the optimized outputs in public/photos are committed.
// Crops are in pixels of the upright (EXIF-rotated) image.
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const photoDir = process.argv[2];

const PHOTOS = [
  { src: 'DSC_8251.JPG', out: 'dev-laptop', crop: { left: 900, top: 1500, width: 2700, height: 3600 } },
  { src: 'IMG-20250206-WA0072.jpg.jpeg', out: 'des-poster', crop: { left: 0, top: 1150, width: 1300, height: 1950 } },
  { src: 'IMG-20250918-WA0006.jpg.jpeg', out: 'candid-flower', crop: { left: 400, top: 1050, width: 2000, height: 2400 } },
  { src: 'IMG-20260817-WA0022.jpg.jpeg', out: 'graduation' },
  { src: 'IMG_3364.JPG', out: 'aaruush-organiser' },
  { src: 'WhatsApp Image 2026-11-19 at 6.43.42 AM.jpeg', out: 'team-aaruush' },
  { src: 'WhatsApp Image 2026-11-19 at 6.44.29 AM.jpeg', out: 'portrait-rose' },
];

async function emit(input, outBase, widths, crop) {
  fs.mkdirSync(path.dirname(outBase), { recursive: true });
  for (const w of widths) {
    let img = sharp(input).rotate();
    if (crop) img = img.extract(crop);
    await img.resize({ width: w, withoutEnlargement: true }).webp({ quality: 78 }).toFile(`${outBase}-${w}.webp`);
  }
  console.log('wrote', path.relative(root, outBase), widths.join('/'));
}

const designDir = path.join(root, 'assets-src/design');
for (const f of fs.readdirSync(designDir)) {
  const name = path.parse(f).name;
  const widths = name === 'dilshad' ? [360, 720] : [800, 1500];
  await emit(path.join(designDir, f), path.join(root, 'public/design', name), widths);
}

if (photoDir) {
  for (const p of PHOTOS) {
    await emit(path.join(photoDir, p.src), path.join(root, 'public/photos', p.out), [640, 1280], p.crop);
  }
} else {
  console.log('No photo folder given, skipped personal photos.');
}
