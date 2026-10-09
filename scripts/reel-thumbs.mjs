// После сборки: уменьшенные копии картинок для ленты на главной (dist/thumbs/...), чтобы не грузить хайрезы
import { readFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import sharp from 'sharp';

const html = readFileSync('dist/index.html', 'utf8');
const m = html.match(/pool = (\[[^\]]*\])/);
const pool = m ? JSON.parse(m[1]) : [];
for (const src of pool) {
  const from = join('dist', decodeURI(src));
  const to = join('dist/thumbs', decodeURI(src).replace(/\.\w+$/, '.webp'));
  if (!existsSync(from)) continue;
  mkdirSync(dirname(to), { recursive: true });
  await sharp(from).resize({ width: 720, withoutEnlargement: true }).webp({ quality: 78 }).toFile(to);
}
console.log(`reel thumbs: ${pool.length}`);
