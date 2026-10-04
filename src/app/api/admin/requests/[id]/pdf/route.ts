import { adminRoute, ApiError } from '@/server/admin-route';
import { db } from '@/lib/db';
import { requestPdf } from '@/server/pdf';
export const runtime = 'nodejs';
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  return adminRoute(request, async () => {
    const { id } = await params;
    const record = await db.auditRequest.findUnique({ where: { id }, include: { property: { include: { photos: true } } } });
    if (!record) throw new ApiError(404, 'Not found');
    const pdf = await requestPdf(record);
    return new Response(new Uint8Array(pdf), { headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename="cohosty-audit.pdf"' } });
  });
}
