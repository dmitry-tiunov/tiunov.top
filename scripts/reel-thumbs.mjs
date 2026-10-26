// После сборки: уменьшенные копии картинок (dist/thumbs/...), чтобы не грузить хайрезы.
// Берём пул ленты на главной и все ссылки вида /thumbs/... из собранных страниц.
import { readFileSync, readdirSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import sharp from 'sharp';

const pages = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
  const p = join(dir, e.name);
  return e.isDirectory() ? pages(p) : e.name.endsWith('.html') ? [p] : [];
});
const html = readFileSync('dist/index.html', 'utf8');
const m = html.match(/pool = (\[[^\]]*\])/);
const srcs = new Set(m ? JSON.parse(m[1]) : []);
for (const page of pages('dist')) {
  for (const [, t] of readFileSync(page, 'utf8').matchAll(/["(]\/thumbs(\/[^"')\s]+\.webp)/g)) srcs.add(t);
}
let made = 0;
for (const src of srcs) {
  const base = decodeURI(src).replace(/\.\w+$/, '');
  const from = ['.webp', '.jpg', '.jpeg', '.png'].map((ext) => join('dist', base + ext)).find(existsSync);
  const to = join('dist/thumbs', base + '.webp');
  if (!from || existsSync(to)) continue;
  mkdirSync(dirname(to), { recursive: true });
  await sharp(from).resize({ width: 720, withoutEnlargement: true }).webp({ quality: 78 }).toFile(to);
  made++;
}
console.log(`thumbs: ${made}`);
