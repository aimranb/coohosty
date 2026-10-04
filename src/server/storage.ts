import 'server-only';
import { v2 as cloudinary } from 'cloudinary';
import { createHmac, randomUUID } from 'node:crypto';
import sharp from 'sharp';
import { z } from 'zod';
import { secret, secureEqual } from './security';
import { detectImage, validFile } from '@/lib/files';
const receiptSchema = z.object({ submissionKey: z.uuid(), url: z.url(), publicId: z.string().regex(/^cohosty\/audits\/[a-f0-9-]{36}\/[a-f0-9-]{36}$/), size: z.number().int().positive(), mimeType: z.literal('image/webp'), expires: z.number() });
export type PhotoReceipt = z.infer<typeof receiptSchema>;
export function configureStorage() {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) throw new Error('Photo storage is not configured');
  cloudinary.config({ cloud_name: process.env.CLOUDINARY_CLOUD_NAME, api_key: process.env.CLOUDINARY_API_KEY, api_secret: process.env.CLOUDINARY_API_SECRET, secure: true });
}
export async function uploadPhoto(file: File, submissionKey: string) {
  if (!validFile(file)) throw new Error('Invalid image');
  const buffer = Buffer.from(await file.arrayBuffer());
  if (detectImage(buffer) !== file.type) throw new Error('Invalid image signature');
  const optimized = await sharp(buffer, { limitInputPixels: 40000000, animated: false }).rotate().resize(1800, 1800, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 82 }).toBuffer();
  if (optimized.length > 3900000) throw new Error('Optimized image exceeds delivery limit');
  configureStorage();
  const publicId = `cohosty/audits/${submissionKey}/${randomUUID()}`;
  const upload = await new Promise<{ secure_url: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ public_id: publicId, resource_type: 'image', type: 'authenticated', overwrite: false }, (error, result) => error || !result ? reject(error || new Error('Upload failed')) : resolve(result));
    stream.end(optimized);
  });
  const receipt: PhotoReceipt = { submissionKey, url: upload.secure_url, publicId, size: optimized.length, mimeType: 'image/webp', expires: Date.now() + 24 * 60 * 60 * 1000 };
  const encoded = Buffer.from(JSON.stringify(receipt)).toString('base64url');
  return { receipt: `${encoded}.${createHmac('sha256', secret()).update(encoded).digest('base64url')}` };
}
export function verifyReceipt(token: string, submissionKey: string) {
  const [encoded, signature, extra] = token.split('.');
  if (!encoded || !signature || extra || !secureEqual(signature, createHmac('sha256', secret()).update(encoded).digest('base64url'))) throw new Error('Invalid upload receipt');
  const receipt = receiptSchema.parse(JSON.parse(Buffer.from(encoded, 'base64url').toString()));
  if (receipt.submissionKey !== submissionKey || receipt.expires < Date.now()) throw new Error('Expired upload receipt');
  return receipt;
}
export function privatePhotoUrl(publicId: string) {
  configureStorage();
  return cloudinary.url(publicId, { resource_type: 'image', type: 'authenticated', sign_url: true, secure: true });
}
