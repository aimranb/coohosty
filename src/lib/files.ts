import { site } from '@/config/site';
export function validFile(file: { type: string; size: number }) {
  return site.upload.types.includes(file.type) && file.size > 0 && file.size <= site.upload.maxSize;
}
export function detectImage(buffer: Uint8Array): string | null {
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return 'image/jpeg';
  if ([137, 80, 78, 71, 13, 10, 26, 10].every((value, i) => buffer[i] === value)) return 'image/png';
  if (Buffer.from(buffer.slice(0, 4)).toString() === 'RIFF' && Buffer.from(buffer.slice(8, 12)).toString() === 'WEBP') return 'image/webp';
  return null;
}
