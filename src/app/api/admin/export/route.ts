import { adminRoute, ApiError } from '@/server/admin-route';
import { db } from '@/lib/db';
import { requestQuery } from '@/server/request-query';
import { csvHeaders, csvRow } from '@/server/csv';
import { csvCell } from '@/lib/escape';
export async function GET(request: Request) {
  return adminRoute(request, async () => {
    const parameters = new URL(request.url).searchParams;
    const id = parameters.get('id');
    const query = requestQuery(Object.fromEntries(parameters));
    if (id && !await db.auditRequest.findUnique({ where: { id }, select: { id: true } })) throw new ApiError(404, 'Not found');
    const encoder = new TextEncoder();
    let cursor: string | undefined;
    let first = true;
    const stream = new ReadableStream<Uint8Array>({
      async pull(controller) {
        try {
          if (first) { first = false; controller.enqueue(encoder.encode('\uFEFF' + csvHeaders.map(csvCell).join(',') + '\r\n')); return; }
          const records = await db.auditRequest.findMany({ where: id ? { id } : query.where, orderBy: query.orderBy, take: 100, ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}), include: { property: { include: { photos: true } } } });
          if (!records.length) { controller.close(); return; }
          cursor = records[records.length - 1].id;
          controller.enqueue(encoder.encode(records.map(csvRow).join('')));
          if (id || records.length < 100) controller.close();
        } catch { console.error('CSV export stream failed'); controller.error(new Error('Export unavailable')); }
      }
    });
    return new Response(stream, { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="cohosty-requests.csv"' } });
  });
}
