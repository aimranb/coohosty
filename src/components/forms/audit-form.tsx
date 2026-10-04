'use client';
import { useEffect, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { ArrowRight, ArrowLeft, LoaderCircle, LockKeyhole } from 'lucide-react';
import { auditSchema, stepFields, selectPlan, type AuditInput, type AuditData } from '@/validations/audit';
import type { Locale } from '@/config/site';
import { useAuditDraft, clearDraft } from '@/hooks/use-audit-draft';
import { defaultAudit } from './default-values';
import { ContactStep } from './steps/contact-step';
import { PropertyStep } from './steps/property-step';
import { SituationStep } from './steps/situation-step';
import { ComplianceStep } from './steps/compliance-step';
import { ObjectivesStep } from './steps/objectives-step';
import { SuccessScreen } from './success-screen';

const stepNames = ['contact', 'property', 'situation', 'compliance', 'objectives'];
type SubmissionResult = { error?: string; fields?: Record<string, string> };

export function AuditForm({ locale }: { locale: Locale }) {
  const t = useTranslations('form');
  const [step, setStep] = useState(0);
  const [uploadBusy, setUploadBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const locked = useRef(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const form = useForm<AuditInput, unknown, AuditData>({
    resolver: zodResolver(auditSchema), mode: 'onBlur', defaultValues: defaultAudit(locale)
  });
  const { register, formState: { isSubmitting }, setValue } = form;
  useAuditDraft(form, step, setStep, locale);

  useEffect(() => {
    const apply = (plan: string | null) => {
      const selected = selectPlan(plan);
      if (selected) { setValue('plan', selected); setStep(0); }
    };
    queueMicrotask(() => {
      apply(new URLSearchParams(window.location.search).get('plan'));
      const url = new URL(window.location.href);
      if (url.searchParams.has('plan')) {
        url.searchParams.delete('plan');
        window.history.replaceState(null, '', url);
      }
    });
    const listener = (event: Event) => apply((event as CustomEvent<string>).detail);
    window.addEventListener('cohosty:plan', listener);
    return () => window.removeEventListener('cohosty:plan', listener);
  }, [setValue]);

  function showStep(value: number) {
    setStep(value);
    requestAnimationFrame(() => heading.current?.focus());
  }

  async function next() {
    if (uploadBusy) return;
    if (await form.trigger(stepFields[step], { shouldFocus: true })) {
      showStep(Math.min(4, step + 1));
      setError('');
    }
  }

  async function submit(data: AuditData) {
    if (locked.current || uploadBusy) return;
    locked.current = true;
    setError('');
    try {
      const response = await fetch('/api/audit', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result: SubmissionResult = await response.json();
      if (!response.ok) {
        if (result.error === 'photos') { setValue('photoReceipts', []); showStep(1); }
        if (result.fields) {
          const keys = Object.keys(result.fields) as (keyof AuditInput)[];
          keys.forEach(key => form.setError(key, { type: 'server', message: result.fields![key] }));
          const firstStep = stepFields.findIndex(fields => keys.some(key => fields.includes(key)));
          if (firstStep >= 0) showStep(firstStep);
        }
        throw new Error(response.status === 429 ? 'rateError' : result.error === 'photos' ? 'restoreError' : 'error');
      }
      clearDraft();
      setSuccess(true);
    } catch (cause) {
      const key = cause instanceof Error && ['rateError', 'restoreError'].includes(cause.message) ? cause.message : 'error';
      setError(t(key));
    } finally { locked.current = false; }
  }

  if (success) return <SuccessScreen locale={locale}/>;

  return <div className="audit-shell">
    <div className="progress-header">
      <span>{t('step')} {step + 1} {t('of')} 5</span>
      <span>{t(`steps.${stepNames[step]}`)}</span>
    </div>
    <div className="progress-bars" role="progressbar" aria-valuemin={1} aria-valuemax={5} aria-valuenow={step + 1} aria-label={t('step')}>
      {stepNames.map((name, i) => <span key={name} className={i <= step ? 'active' : ''}/>)}
    </div>
    <ol className="audit-step-labels">{stepNames.map((name,index) => <li key={name} className={index === step ? 'is-current' : ''} aria-current={index === step ? 'step' : undefined}>{t(`steps.${name}`)}</li>)}</ol>
    <h3 ref={heading} tabIndex={-1}>{t(`steps.${stepNames[step]}`)}</h3>
    <p className="audit-step-help">{t(`comfort.help.${stepNames[step]}`)}</p>
    <FormProvider {...form}>
      <form noValidate onSubmit={event => {
        if (step < 4) { event.preventDefault(); void next(); }
        else void form.handleSubmit(submit, invalid => {
          const keys = Object.keys(invalid) as (keyof AuditInput)[];
          const index = stepFields.findIndex(fields => keys.some(key => fields.includes(key)));
          if (index >= 0) showStep(index);
        })(event);
      }}>
        <div className="honeypot" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input id="website" {...register('honeypot')} tabIndex={-1} autoComplete="off"/>
        </div>
        <div className="form-grid">
          {step === 0 && <ContactStep/>}
          {step === 1 && <PropertyStep onBusy={setUploadBusy}/>}
          {step === 2 && <SituationStep/>}
          {step === 3 && <ComplianceStep/>}
          {step === 4 && <ObjectivesStep locale={locale}/>}
        </div>
        {error && <div className="alert" role="alert">{error}</div>}
        <div className="form-actions">
          {step > 0 && <button className="back-button" type="button" disabled={isSubmitting || uploadBusy} onClick={() => showStep(step - 1)}>
            <ArrowLeft size={12} style={{ display: 'inline', marginInlineEnd: 6 }}/>{t('back')}
          </button>}
          <button className="button" type="submit" disabled={isSubmitting || uploadBusy}>
            {isSubmitting ? <><LoaderCircle size={15} className="spinner"/>{t('submitting')}</> :
              <>{step < 4 ? t('next') : t('submit')}<ArrowRight size={15}/></>}
          </button>
        </div>
        <div className="saved-note">
          <span><LockKeyhole size={11}/>{t('saved')}</span>
          <button className="reset-button" type="button" disabled={isSubmitting || uploadBusy} onClick={() => {
            clearDraft(); form.reset(defaultAudit(locale));
            form.setValue('submissionKey', crypto.randomUUID()); showStep(0); setError('');
          }}>{t('reset')}</button>
        </div>
      </form>
    </FormProvider>
  </div>;
}
