'use client';
import { useCallback } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import type { Locale } from '@/config/site';
import { objectives } from '@/validations/audit';
import { TextInput, SelectInput, useAuditContext } from '../audit-fields';
import { Field } from '../form-field';
import { Turnstile } from '../turnstile';
export function ObjectivesStep({ locale }: { locale: Locale }) {
  const t = useTranslations('form');
  const { register, setValue, formState: { errors } } = useAuditContext();
  const onToken = useCallback((token: string) => setValue('turnstileToken', token), [setValue]);
  return <>
    <SelectInput name="objective" options={objectives} full/>
    <TextInput name="availability" full/>
    <Field name="comments" full error={errors.comments}>
      <textarea id="comments" {...register('comments')} rows={3} maxLength={5000} aria-invalid={!!errors.comments} aria-describedby={errors.comments ? 'comments-error' : undefined}/>
    </Field>
    <div className="field-full">
      <label className="consent-label"><input type="checkbox" {...register('consent')} aria-invalid={!!errors.consent} aria-describedby={errors.consent ? 'consent-error' : undefined}/>{t('consent')}</label>
      {errors.consent && <p className="field-error" id="consent-error">{t('validation.consent')}</p>}
      <Link className="privacy-link" href={`/${locale}/privacy`} target="_blank" rel="noopener noreferrer">{t('privacy')}</Link>
    </div>
    <Turnstile onToken={onToken}/>
  </>;
}
