import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';
const db = new PrismaClient();
type Resource = { public_id: string; created_at: string };
async function main() {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) throw new Error('Storage configuration missing');
  cloudinary.config({ cloud_name: process.env.CLOUDINARY_CLOUD_NAME, api_key: process.env.CLOUDINARY_API_KEY, api_secret: process.env.CLOUDINARY_API_SECRET });
  const apply = process.argv.includes('--apply'); let cursor: string | undefined; let candidates = 0;
  do {
    const page: { resources: Resource[]; next_cursor?: string } = await cloudinary.api.resources({ type: 'authenticated', resource_type: 'image', prefix: 'cohosty/audits/', max_results: 100, ...(cursor ? { next_cursor: cursor } : {}) });
    const old = page.resources.filter(resource => Date.parse(resource.created_at) < Date.now() - 48 * 3600000);
    const references = await db.uploadedPhoto.findMany({ where: { publicId: { in: old.map(resource => resource.public_id) } }, select: { publicId: true } });
    const referenced = new Set(references.map(photo => photo.publicId));
    for (const resource of old) if (!referenced.has(resource.public_id)) { candidates++; if (apply) await cloudinary.uploader.destroy(resource.public_id, { type: 'authenticated', resource_type: 'image', invalidate: true }); }
    cursor = page.next_cursor;
  } while (cursor);
  console.log(`${candidates} abandoned uploads ${apply ? 'removed' : 'eligible; dry run only'}.`);
}
main().catch(() => { console.error('Upload cleanup failed. No request records were modified.'); process.exitCode = 1; }).finally(() => db.$disconnect());
