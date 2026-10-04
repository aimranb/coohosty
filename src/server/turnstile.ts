import 'server-only';
export async function verifyTurnstile(token?: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;
  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: new URLSearchParams({ secret, response: token }), signal: AbortSignal.timeout(10000) });
  const result: { success?: boolean } = await response.json();
  return result.success === true;
}
