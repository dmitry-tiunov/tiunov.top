// Адрес уменьшенной копии картинки; копии делает scripts/reel-thumbs.mjs после сборки
export const thumb = (src?: string) => (src ? '/thumbs' + src.replace(/\.\w+$/, '.webp') : undefined);
