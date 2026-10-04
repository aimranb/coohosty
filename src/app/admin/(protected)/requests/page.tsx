import Link from 'next/link';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { requireAdmin } from '@/server/auth';
import { requestQuery } from '@/server/request-query';
import { RequestsTable } from '@/components/admin/requests-table';
import { displayValue } from '@/lib/request-data';
import { plans } from '@/config/site';
import fr from '../../../../../messages/fr.json';
export default async function RequestsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireAdmin();
  const input = await searchParams;
  const query = requestQuery(input);
  const [count, requests, cities] = await Promise.all([db.auditRequest.count({ where: query.where }), db.auditRequest.findMany({ where: query.where, orderBy: query.orderBy, skip: query.skip, take: query.take, include: { property: true } }), db.property.findMany({ distinct: ['city'], select: { city: true }, orderBy: { city: 'asc' }, take: 500 })]);
  const { filters } = query; const t = fr.admin;
  const pages = Math.max(1, Math.ceil(count / query.take));
  const params = new URLSearchParams(Object.entries(filters).map(([key, value]) => [key, String(value)]));
  if (filters.page > pages) { params.set('page', String(pages)); redirect(`/admin/requests?${params}`); }
  const pageUrl = (page: number) => { const updated = new URLSearchParams(params); updated.set('page', String(page)); return `/admin/requests?${updated}`; };
  return <><div className="admin-heading"><div><h1>{t.requests}</h1><p>{count} {t.result}</p></div><a className="button button-outline" href={`/api/admin/export?${params}`}>{t.export} ↓</a></div><div className="admin-panel"><form action="/admin/requests"><div className="filter-form"><div><label htmlFor="search">{t.search}</label><input name="search" id="search" defaultValue={filters.search} placeholder={t.searchPlaceholder} maxLength={120}/></div><div><label htmlFor="filter-city">{t.city}</label><select id="filter-city" name="city" defaultValue={filters.city}><option value="">{t.all}</option>{cities.map(({ city }) => <option key={city}>{city}</option>)}</select></div><div><label htmlFor="filter-plan">{t.plan}</label><select id="filter-plan" name="plan" defaultValue={filters.plan}><option value="">{t.all}</option>{plans.map(plan => <option value={plan} key={plan}>{displayValue(plan)}</option>)}</select></div><div><label htmlFor="filter-status">{t.status}</label><select id="filter-status" name="status" defaultValue={filters.status}><option value="">{t.all}</option>{(['NEW', 'IN_PROGRESS', 'AUDIT_SENT'] as const).map(status => <option value={status} key={status}>{t[`status${status}`]}</option>)}</select></div><div><label htmlFor="filter-sort">{t.sort}</label><select id="filter-sort" name="sort" defaultValue={filters.sort}>{[{ value: 'newest', label: t.newest }, { value: 'oldest', label: t.oldest }, { value: 'name', label: t.sortName }, { value: 'city', label: t.sortCity }].map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select></div></div><div className="filter-actions"><div><button className="button" type="submit">{t.filter}</button><Link href="/admin/requests">{t.clear}</Link></div></div></form><RequestsTable requests={requests}/><div className="pagination"><span>{t.page} {filters.page} {t.of} {pages}</span><div className="pagination-links">{filters.page > 1 && <Link href={pageUrl(filters.page - 1)}>← {t.previous}</Link>}{filters.page < pages && <Link href={pageUrl(filters.page + 1)}>{t.next} →</Link>}</div></div></div></>;
}
