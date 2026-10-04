import { createHmac } from 'node:crypto';
import { describe, it, expect, beforeAll } from 'vitest';
import { verifyReceipt } from '@/server/storage';
const key = '123e4567-e89b-42d3-a456-426614174000';
beforeAll(() => { process.env.AUTH_SECRET = 'test-only-secret-at-least-thirty-two-characters'; });
function receipt(expires = Date.now() + 10000) { const encoded = Buffer.from(JSON.stringify({ submissionKey: key, url: 'https://res.cloudinary.com/test/image/authenticated/photo.webp', publicId: `cohosty/audits/${key}/${key}`, size: 1000, mimeType: 'image/webp', expires })).toString('base64url'); return `${encoded}.${createHmac('sha256', process.env.AUTH_SECRET!).update(encoded).digest('base64url')}`; }
describe('signed private photo receipts', () => {
  it('accepts a genuine receipt for its own submission', () => expect(verifyReceipt(receipt(), key).size).toBe(1000));
  it('rejects forged receipts', () => expect(() => verifyReceipt(receipt() + 'forged', key)).toThrow());
  it('rejects expired receipts', () => expect(() => verifyReceipt(receipt(Date.now() - 1000), key)).toThrow());
  it('rejects reuse for another submission', () => expect(() => verifyReceipt(receipt(), '123e4567-e89b-42d3-a456-426614174001')).toThrow());
});
