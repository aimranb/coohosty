import 'server-only';
import { Prisma, Plan, RequestStatus } from '@prisma/client';
import { z } from 'zod';
const filterSchema = z.object({ search: z.string().trim().max(120).catch(''), city: z.string().trim().max(120).catch(''), plan: z.enum(['', 'AUDIT', 'OPTIMIZE', 'COHOST', 'UNDECIDED']).catch(''), status: z.enum(['', 'NEW', 'IN_PROGRESS', 'AUDIT_SENT']).catch(''), sort: z.enum(['newest', 'oldest', 'name', 'city']).catch('newest'), page: z.coerce.number().int().min(1).max(100000).catch(1) });
export function requestQuery(input: Record<string, unknown>) {
  const filters = filterSchema.parse(input);
  const where: Prisma.AuditRequestWhereInput = {
    ...(filters.plan ? { plan: filters.plan as Plan } : {}),
    ...(filters.status ? { status: filters.status as RequestStatus } : {}),
    ...(filters.city ? { property: { city: { equals: filters.city, mode: 'insensitive' } } } : {}),
    ...(filters.search ? { OR: [ { fullName: { contains: filters.search, mode: 'insensitive' } }, { email: { contains: filters.search, mode: 'insensitive' } }, { phone: { contains: filters.search, mode: 'insensitive' } }, { property: { city: { contains: filters.search, mode: 'insensitive' } } } ] } : {})
  };
  const orderBy: Prisma.AuditRequestOrderByWithRelationInput[] = filters.sort === 'name' ? [{ fullName: 'asc' }, { id: 'asc' }] : filters.sort === 'city' ? [{ property: { city: 'asc' } }, { id: 'asc' }] : [{ createdAt: filters.sort === 'oldest' ? 'asc' : 'desc' }, { id: 'asc' }];
  return { filters, where, orderBy, take: 20, skip: (filters.page - 1) * 20 };
}
