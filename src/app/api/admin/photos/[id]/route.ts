import { adminRoute, ApiError } from '@/server/admin-route';
import { db } from '@/lib/db';
import { privatePhotoUrl } from '@/server/storage';
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  return adminRoute(request, async () => {
    const { id } = await params;
    const photo = await db.uploadedPhoto.findUnique({ where: { id } });
    if (!photo) throw new ApiError(404, 'Not found');
    const upstream = await fetch(privatePhotoUrl(photo.publicId), { cache: 'no-store', signal: AbortSignal.timeout(15000) });
    if (!upstream.ok) throw new ApiError(502, 'Photo temporarily unavailable');
    return new Response(upstream.body, { headers: { 'Content-Type': 'image/webp', 'Content-Disposition': 'inline; filename="property.webp"', 'X-Content-Type-Options': 'nosniff' } });
  });
}
