'use client';
import { useTranslations } from 'next-intl';
import { authorizations } from '@/validations/audit';
import { SelectInput } from '../audit-fields';
export function ComplianceStep() {
  const t = useTranslations('form');
  return <><SelectInput name="authorization" options={authorizations} full/><p className="form-note field-full">{t('complianceNote')}</p></>;
}
