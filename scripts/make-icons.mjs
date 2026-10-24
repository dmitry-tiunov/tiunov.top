// Иконки сайта из знака public/mark.svg (белый): фавиконы, иконки для телефонов и картинка для превью ссылок.
// Знак белый, поэтому кладём его на чёрный фон: так он виден и на светлых, и на тёмных вкладках.
// Запуск после замены знака: npm run icons
import { readFileSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';

const mark = readFileSync('public/mark.svg', 'utf8');
const [, vw, vh] = mark.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/).map(Number);
const inner = mark.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');

// Квадрат size×size, знак занимает share ширины и стоит по центру.
function squareSvg(size, { share, radius }) {
  const s = (size * share) / vw;
  const x = (size - vw * s) / 2;
  const y = (size - vh * s) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">` +
    `<rect width="${size}" height="${size}" rx="${radius}" fill="#000"/>` +
    `<g transform="translate(${x.toFixed(2)} ${y.toFixed(2)}) scale(${s.toFixed(5)})">${inner.trim()}</g></svg>\n`;
}

const png = (svg, size) => sharp(Buffer.from(svg)).resize(size, size).png().toBuffer();

// favicon.svg: скруглённый квадрат, для современных браузеров.
const favicon = squareSvg(512, { share: 0.86, radius: 96 });
writeFileSync('public/favicon.svg', favicon);

// favicon.ico: 16, 32 и 48 px внутри одного файла (PNG в ICO). Его по умолчанию берёт Яндекс.
const sizes = [16, 32, 48];
const images = await Promise.all(sizes.map((n) => png(favicon, n)));
const header = Buffer.alloc(6 + 16 * sizes.length);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
sizes.forEach((n, i) => {
  const e = 6 + 16 * i;
  header.writeUInt8(n, e);
  header.writeUInt8(n, e + 1);
  header.writeUInt16LE(1, e + 4);
  header.writeUInt16LE(32, e + 6);
  header.writeUInt32LE(images[i].length, e + 8);
  header.writeUInt32LE(offset, e + 12);
  offset += images[i].length;
});
writeFileSync('public/favicon.ico', Buffer.concat([header, ...images]));

// Иконки для телефонов: без скругления (iOS и Android скругляют сами), знак с запасом по краям.
const full = squareSvg(512, { share: 0.64, radius: 0 });
writeFileSync('public/apple-touch-icon.png', await png(full, 180));
writeFileSync('public/icon-192.png', await png(full, 192));
writeFileSync('public/icon-512.png', await png(full, 512));

// Превью ссылок по умолчанию (og:image) 1200×630: знак и надпись Design Tiunov на чёрном.
const markH = 170;
const markW = Math.round((vw * markH) / vh);
const word = readFileSync('public/logo.svg');
const wordW = 560;
const markPng = await sharp(Buffer.from(mark)).resize({ height: markH }).png().toBuffer();
const wordPng = await sharp(word).resize({ width: wordW }).png().toBuffer();
const wordH = (await sharp(wordPng).metadata()).height;
const gap = 56;
const top = Math.round((630 - markH - gap - wordH) / 2);
await sharp({ create: { width: 1200, height: 630, channels: 3, background: '#000' } })
  .composite([
    { input: markPng, left: Math.round((1200 - markW) / 2), top },
    { input: wordPng, left: Math.round((1200 - wordW) / 2), top: top + markH + gap },
  ])
  .png()
  .toFile('public/og-default.png');

console.log('icons: favicon.svg, favicon.ico, apple-touch-icon.png, icon-192.png, icon-512.png, og-default.png');
