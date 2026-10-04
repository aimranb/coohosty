import { NextResponse } from 'next/server';
import { adminRoute } from '@/server/admin-route';
import { deliverEmails } from '@/server/emails';
import { db } from '@/lib/db';
import { ApiError } from '@/server/admin-route';
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  return adminRoute(request, async () => {
    const { id } = await params;
    if (!await db.auditRequest.findUnique({ where: { id }, select: { id: true } })) throw new ApiError(404, 'Not found');
    const result = await deliverEmails(id);
    if (result.deferred || result.failed) throw new ApiError(503, 'Email delivery deferred');
    return NextResponse.json({ ok: true });
  }, true);
}
