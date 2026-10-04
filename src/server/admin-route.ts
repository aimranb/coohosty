import 'server-only';
import { NextResponse } from 'next/server';
import { currentAdmin } from './auth';
import { sameOrigin } from './security';
export class ApiError extends Error { constructor(public status: number, message: string) { super(message); } }
export async function adminRoute(request: Request, handler: (user: { id: string; email: string }) => Promise<Response>, mutation = false) {
  try {
    const user = await currentAdmin();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (mutation && !sameOrigin(request)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    const response = await handler(user);
    response.headers.set('Cache-Control', 'private, no-store');
    return response;
  } catch (error) {
    if (error instanceof ApiError) return NextResponse.json({ error: error.message }, { status: error.status });
    console.error('Admin operation failed', error instanceof Error ? error.name : 'Error');
    return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });
  }
}
