import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
const db = new PrismaClient();
async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  if (!z.email().safeParse(email).success || !email || !passwordHash || !/^\$2[aby]\$1[2-6]\$[./A-Za-z0-9]{53}$/.test(passwordHash)) throw new Error('Set ADMIN_EMAIL and a bcrypt hash (cost 12–16) in ADMIN_PASSWORD_HASH.');
  await db.user.upsert({ where: { email }, create: { email, passwordHash }, update: { passwordHash } });
  // Rotating credentials also invalidates existing sessions.
  await db.session.deleteMany({ where: { user: { email } } });
  console.log('Admin created/updated. No sample customer data was inserted.');
}
main().catch(() => { console.error('Admin seed failed. Check environment and database connectivity.'); process.exitCode = 1; }).finally(() => db.$disconnect());
