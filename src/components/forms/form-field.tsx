'use client';
import { useTranslations } from 'next-intl';
import type { FieldError } from 'react-hook-form';
export function Field({ name, error, children, full = false }: { name: string; error?: FieldError; children: React.ReactNode; full?: boolean }) {
  const t = useTranslations('form');
  const errorKey = error?.message && ['required', 'email', 'phone', 'url', 'number', 'consent', 'tooLong', 'invalid'].includes(error.message) ? error.message : 'required';
  return <div className={`field ${full ? 'field-full' : ''}`}><label htmlFor={name}>{t(`fields.${name}`)}</label>{children}{error && <p className="field-error" id={`${name}-error`}>{t(`validation.${errorKey}`)}</p>}</div>;
}
