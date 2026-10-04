import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { adminRoute, ApiError } from '@/server/admin-route';
import { readJson } from '@/server/security';
const schema = z.object({ status: z.enum(['NEW', 'IN_PROGRESS', 'AUDIT_SENT']) });
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  return adminRoute(request, async user => {
    const { id } = await params;
    let raw: unknown; try { raw = await readJson(request, 1000); } catch { throw new ApiError(400, 'Invalid input'); }
    const input = schema.safeParse(raw);
    if (!input.success) throw new ApiError(422, 'Invalid status');
    await db.$transaction(async tx => {
      const existing = await tx.auditRequest.findUnique({ where: { id } });
      if (!existing) throw new ApiError(404, 'Not found');
      if (existing.status === input.data.status) return;
      const updated = await tx.auditRequest.updateMany({ where: { id, status: existing.status }, data: { status: input.data.status } });
      if (!updated.count) throw new ApiError(409, 'Request changed. Refresh and try again.');
      await tx.activityLog.create({ data: { requestId: id, userId: user.id, action: `${existing.status} → ${input.data.status}` } });
    });
    return NextResponse.json({ ok: true });
  }, true);
}
