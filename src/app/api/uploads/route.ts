import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requestIp, sameOrigin, readBytes } from '@/server/security';
import { rateLimit } from '@/server/rate-limit';
import { uploadPhoto } from '@/server/storage';
export const runtime = 'nodejs';
export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const size = Number(request.headers.get('content-length'));
  if (size > 4200000) return NextResponse.json({ error: 'Image is too large.' }, { status: 413 });
  try {
    if (!await rateLimit(`upload:${requestIp(request)}`, 24, 3600)) return NextResponse.json({ error: 'Upload limit reached.' }, { status: 429 });
    const buffer = await readBytes(request, 4200000);
    const data = await new Response(new Uint8Array(buffer), { headers: { 'Content-Type': request.headers.get('content-type') || '' } }).formData();
    const file = data.get('file');
    const key = z.uuid().safeParse(data.get('submissionKey'));
    if (!(file instanceof File) || !key.success) return NextResponse.json({ error: 'Invalid upload.' }, { status: 400 });
    const result = await uploadPhoto(file, key.data);
    return NextResponse.json(result);
  } catch (error) { console.error('Photo upload failed', error instanceof Error ? error.name : 'Error'); return NextResponse.json({ error: 'Unable to upload this image. Try again or submit without it.' }, { status: 400 }); }
}
