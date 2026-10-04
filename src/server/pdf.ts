import 'server-only';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { PDFDocument, rgb, type PDFFont } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { requestSections, type FullRequest } from '@/lib/request-data';
const arabicPattern = /[\u0600-\u06ff\u0750-\u077f\u08a0-\u08ff]/;
export async function requestPdf(request: FullRequest) {
  const document = await PDFDocument.create(); document.registerFontkit(fontkit);
  document.setTitle('COOHOSTY — Audit de propriété'); document.setAuthor('COOHOSTY');
  const [latinBytes, arabicBytes] = await Promise.all([
    readFile(path.join(process.cwd(), 'node_modules/@fontsource/noto-sans/files/noto-sans-latin-400-normal.woff')),
    readFile(path.join(process.cwd(), 'node_modules/@fontsource/noto-sans-arabic/files/noto-sans-arabic-arabic-400-normal.woff'))
  ]);
  const latin = await document.embedFont(latinBytes, { subset: true });
  const arabic = await document.embedFont(arabicBytes, { subset: true });
  let page = document.addPage([595.28, 841.89]); let y = 780; let pageNumber = 1;
  const ink = rgb(0.145, 0.137, 0.2), purple = rgb(0.545, 0.361, 0.965), grey = rgb(0.46, 0.44, 0.5);
  function fontFor(word: string): PDFFont { return arabicPattern.test(word) ? arabic : latin; }
  function footer() { page.drawText(`coohosty.com · ${pageNumber}`, { x: 45, y: 30, size: 9, font: latin, color: grey }); }
  function space(height: number) { if (y < 65 + height) { footer(); page = document.addPage([595.28, 841.89]); pageNumber++; y = 780; } }
  function lines(text: string, size = 10, maxWidth = 495) {
    const result: string[][] = [];
    for (const paragraph of text.split(/\r?\n/)) {
      let words: string[] = [], width = 0;
      for (const word of paragraph.split(/\s+/).filter(Boolean)) {
        // Split long unbroken strings (URLs/comments) without overflowing the page.
        const segments: string[] = []; let segment = '';
        for (const char of word) { const next = segment + char; if (fontFor(next).widthOfTextAtSize(next, size) > maxWidth) { segments.push(segment); segment = char; } else segment = next; }
        if (segment) segments.push(segment);
        for (const part of segments) {
          const wordWidth = fontFor(part).widthOfTextAtSize(part, size) + latin.widthOfTextAtSize(' ', size);
          if (width + wordWidth > maxWidth && words.length) { result.push(words); words = []; width = 0; }
          words.push(part); width += wordWidth;
        }
      }
      result.push(words);
    }
    return result;
  }
  function paragraph(text: string, size = 10, color = ink) {
    for (const line of lines(text, size)) {
      space(size + 8);
      const rtl = line.some(word => arabicPattern.test(word));
      const arranged = rtl ? [...line].reverse() : line;
      const lineWidth = arranged.reduce((width, word) => width + fontFor(word).widthOfTextAtSize(word, size) + latin.widthOfTextAtSize(' ', size), 0);
      let x = rtl ? 550 - lineWidth : 45;
      for (const word of arranged) { const font = fontFor(word); page.drawText(word, { x, y, font, size, color }); x += font.widthOfTextAtSize(word, size) + latin.widthOfTextAtSize(' ', size); }
      y -= size + 8;
    }
  }
  paragraph('COOHOSTY', 24, purple); paragraph('Audit de propriété', 15); paragraph(request.createdAt.toLocaleString('fr-MA'), 10, grey); y -= 20;
  for (const section of requestSections(request)) {
    space(55); paragraph(section.title, 14, purple); y -= 3;
    for (const row of section.rows) { paragraph(row.label, 9, grey); paragraph(row.value, 10); y -= 7; }
    y -= 14;
  }
  footer();
  return document.save();
}
