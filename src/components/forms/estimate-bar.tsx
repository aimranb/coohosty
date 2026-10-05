'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm, type FieldError } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Check, House, LoaderCircle, Mail } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { site, type Locale } from '@/config/site';
import { estimateSchema, estimateSteps, estimateTypes, estimateBedrooms, estimateGoals, estimateDurations, estimateStarts, type EstimateInput, type EstimateData } from '@/validations/estimate';
import { Turnstile } from './turnstile';
import { WhatsAppIcon } from '@/components/ui/whatsapp-icon';

type Benchmark = { lower: number; upper: number; currency: 'EUR'; listings: number; retrievedAt: string; provider: 'PriceLabs'; bedrooms: number };
type Result = { channel: 'email' | 'whatsapp'; data: EstimateData; benchmark?: Benchmark | null; delivery?: string };
const cities = ['Casablanca', 'Rabat', 'Marrakech', 'Tanger', 'Agadir', 'Fès', 'Meknès', 'Essaouira', 'Tétouan', 'Oujda', 'El Jadida', 'Kénitra', 'Mohammedia', 'Chefchaouen', 'Ifrane', 'Dakhla', 'Nador', 'Ouarzazate', 'Safi', 'Béni Mellal'];

type PropertyDetails = Pick<EstimateInput, 'type' | 'bedrooms' | 'city' | 'address'>;

export function EstimateBar({ locale, emailEnabled, completion = false, initialProperty }: { locale: Locale; emailEnabled: boolean; completion?: boolean; initialProperty?: PropertyDetails }) {
  const router = useRouter();
  const t = useTranslations('estimate');
  const validation = useTranslations('form.validation');
  const reduced = useReducedMotion();
  const [step, setStep] = useState(initialProperty ? 1 : 0);
  const [error, setError] = useState('');
  const [result, setResult] = useState<Result | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const locked = useRef(false);
  const previousPayload = useRef('');
  const form = useForm<EstimateInput, unknown, EstimateData>({ resolver: zodResolver(estimateSchema), mode: 'onBlur', defaultValues: { type: 'apartment', bedrooms: '2', city: '', address: '', fullName: '', email: '', phone: '', channel: emailEnabled ? 'email' : 'whatsapp', consent: false, locale, honeypot: '', submissionKey: '', ...initialProperty } });
  const { register, setValue, formState: { errors, isSubmitting } } = form;
  useEffect(() => { setValue('submissionKey', crypto.randomUUID()); }, [setValue]);
  const onToken = useCallback((token: string) => setValue('turnstileToken', token), [setValue]);

  function showStep(index: number) { setError(''); setStep(index); requestAnimationFrame(() => heading.current?.focus()); }
  async function next() {
    if (!await form.trigger(estimateSteps[step], { shouldFocus: true })) return;
    if (step === 0 && !completion) {
      const { type, bedrooms, city, address } = form.getValues();
      try {
        sessionStorage.setItem(`coohosty-estimate-property-${locale}`, JSON.stringify({ type, bedrooms, city, address }));
      } catch { setError(t('error')); return; }
      router.push(`/${locale}/estimate`);
      return;
    }
    showStep(step + 1);
  }
  function fieldError(name: keyof EstimateInput) {
    const issue = errors[name] as FieldError | undefined;
    if (!issue) return null;
    const key = ['required', 'email', 'phone', 'consent', 'tooLong', 'invalid'].includes(issue.message || '') ? issue.message! : 'required';
    return <span className="estimate-field-error" id={`estimate-${name}-error`}>{validation(key)}</span>;
  }
  function select(name: 'type' | 'bedrooms' | 'objective' | 'duration' | 'ready', options: readonly string[], full = false) {
    return <label className={`estimate-field ${full ? 'estimate-full' : ''}`} htmlFor={`estimate-${name}`}><span>{t(`fields.${name}`)}</span><select id={`estimate-${name}`} {...register(name)} aria-invalid={!!errors[name]} aria-describedby={errors[name] ? `estimate-${name}-error` : undefined}><option value="" disabled>{t('select')}</option>{options.map(value => <option key={value} value={value}>{name === 'bedrooms' ? t('bedrooms', { count: Number(value) }) : t(`options.${value}`)}</option>)}</select>{fieldError(name)}</label>;
  }
  function input(name: 'city' | 'address' | 'fullName' | 'email' | 'phone', full = false) {
    const autoComplete = { city: 'address-level2', address: 'street-address', fullName: 'name', email: 'email', phone: 'tel' };
    return <label className={`estimate-field ${full ? 'estimate-full' : ''}`} htmlFor={`estimate-${name}`}><span>{t(`fields.${name}`)}</span><input id={`estimate-${name}`} {...register(name)} type={name === 'email' ? 'email' : name === 'phone' ? 'tel' : 'text'} autoComplete={autoComplete[name]} maxLength={name === 'address' ? 300 : name === 'email' ? 254 : name === 'phone' ? 24 : 120} list={name === 'city' ? 'estimate-morocco-cities' : undefined} placeholder={t(`placeholders.${name}`)} aria-invalid={!!errors[name]} aria-describedby={errors[name] ? `estimate-${name}-error` : undefined}/>{fieldError(name)}</label>;
  }
  function whatsappUrl(data: EstimateData, benchmark?: Benchmark | null) {
    const entries: [string, string][] = [
      [t('fields.fullName'), data.fullName], [t('fields.email'), data.email], [t('fields.phone'), data.phone || '—'],
      [t('fields.type'), t(`options.${data.type}`)], [t('fields.bedrooms'), data.bedrooms],
      [t('fields.city'), `${data.city}, Morocco`], [t('fields.address'), data.address],
      [t('fields.objective'), t(`options.${data.objective}`)], [t('fields.duration'), t(`options.${data.duration}`)], [t('fields.ready'), t(`options.${data.ready}`)],
    ];
    const revenue = benchmark ? `\n${t('benchmark')}: ${money(benchmark.lower)} – ${money(benchmark.upper)} / ${t('month')} (PriceLabs)` : '';
    return `${site.whatsapp}?text=${encodeURIComponent(`${t('whatsappIntro')}\n\n${entries.map(([key, value]) => `${key}: ${value}`).join('\n')}${revenue}`)}`;
  }
  function money(value: number) { return new Intl.NumberFormat(locale === 'ar' ? 'ar-MA' : locale === 'fr' ? 'fr-MA' : 'en-GB', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value); }
  async function submit(data: EstimateData) {
    if (locked.current) return;
    locked.current = true; setError('');
    const { submissionKey: _key, turnstileToken: _token, ...stable } = data;
    void _key; void _token;
    const fingerprint = JSON.stringify(stable);
    if (previousPayload.current && previousPayload.current !== fingerprint) { data.submissionKey = crypto.randomUUID(); setValue('submissionKey', data.submissionKey); }
    previousPayload.current = fingerprint;
    try {
      const response = await fetch('/api/estimate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      const body = await response.json();
      if (!response.ok) {
        if (data.channel === 'whatsapp') { setResult({ channel: 'whatsapp', data }); return; }
        if (body.fields) {
          for (const [name, message] of Object.entries(body.fields)) if (name in data) form.setError(name as keyof EstimateInput, { type: 'server', message: String(message) });
          const invalidStep = estimateSteps.findIndex(fields => fields.some(name => body.fields[name]));
          if (invalidStep >= 0) setStep(invalidStep);
        }
        setError(t(body.error === 'rate' ? 'rateError' : body.error === 'email_unavailable' ? 'emailUnavailable' : 'error')); return;
      }
      setResult({ channel: data.channel, data, benchmark: body.benchmark, delivery: body.delivery });
    } catch {
      if (data.channel === 'whatsapp') setResult({ channel: 'whatsapp', data });
      else setError(t('error'));
    } finally { locked.current = false; }
  }

  if (result) return <div id="estimate" className="estimate-bar estimate-result" role="region" aria-label={t('title')}>
    <div className="estimate-success-icon"><Check size={20}/></div><h2>{t(result.channel === 'whatsapp' ? 'whatsappReady' : 'success')}</h2><p role="status">{t(result.channel === 'whatsapp' ? 'whatsappReadyText' : result.delivery === 'sent' ? 'successText' : 'queuedText')}</p>
    {result.benchmark ? <div className="estimate-income"><span>{t('benchmark')}</span><strong>{t('incomeMessage', { bedrooms: result.data.bedrooms, city: result.data.city, lower: money(result.benchmark.lower), upper: money(result.benchmark.upper) })}</strong><small>{t('basis', { count: result.benchmark.listings })}</small><small>{t('grossNote')}</small></div> : <div className="estimate-income"><strong>{t('personalReview')}</strong><span>{t('personalReviewText', { city: result.data.city })}</span></div>}
    <a className="estimate-whatsapp" href={whatsappUrl(result.data, result.benchmark)} target="_blank" rel="noopener noreferrer"><WhatsAppIcon width={17} height={17}/>{t(result.channel === 'whatsapp' ? 'openWhatsapp' : 'continueWhatsapp')}</a>
    <button className="estimate-edit" onClick={() => { setResult(null); setStep(0); }}>{t('edit')}</button>
  </div>;

  return <motion.form layout={!reduced} id="estimate" className="estimate-bar" noValidate onSubmit={event => { event.preventDefault(); if (step < 2) void next(); else void form.handleSubmit(submit)(event); }} aria-label={t('title')}>
    <div className="estimate-heading"><span><House size={15}/>{t('eyebrow')}</span><b>{step + 1}/3</b></div>
    <h2 ref={heading} tabIndex={-1}>{t('title')}</h2><p className="estimate-intro">{t('subtitle')}</p>
    <ol className="estimate-progress" aria-label={t('progress')}>{['property', 'plans', 'contact'].map((name, index) => <li key={name} className={index <= step ? 'is-active' : ''} aria-current={index === step ? 'step' : undefined}><span>{index < step ? <Check size={10}/> : index + 1}</span>{t(`steps.${name}`)}</li>)}</ol>
    <AnimatePresence mode="wait" initial={false}><motion.div className="estimate-fields" key={step} initial={{ opacity: 0, x: reduced ? 0 : locale === 'ar' ? -12 : 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: reduced ? 0 : locale === 'ar' ? 8 : -8 }} transition={{ duration: reduced ? 0 : .18 }}>
      {step === 0 && <>{select('type', estimateTypes)}{select('bedrooms', estimateBedrooms)}{input('city')}{input('address')}<datalist id="estimate-morocco-cities">{cities.map(city => <option key={city} value={city}/>)}</datalist><small className="estimate-full estimate-location-note">{t('allMorocco')}</small></>}
      {step === 1 && <>{select('objective', estimateGoals, true)}{select('duration', estimateDurations, true)}{select('ready', estimateStarts, true)}</>}
      {step === 2 && <>{input('fullName', true)}{input('email')}{input('phone')}<fieldset className="estimate-full estimate-channel"><legend>{t('fields.channel')}</legend>{(['email', 'whatsapp'] as const).map(channel => <label key={channel}><input type="radio" value={channel} disabled={channel === 'email' && !emailEnabled} {...register('channel')}/>{channel === 'email' ? <Mail size={15}/> : <WhatsAppIcon width={15} height={15}/>}<span>{channel === 'email' ? t('emailOption') : 'WhatsApp'}</span></label>)}</fieldset><div className="estimate-full"><label className="estimate-consent"><input type="checkbox" {...register('consent')} aria-invalid={!!errors.consent} aria-describedby={errors.consent ? 'estimate-consent-error' : undefined}/><span>{t('consent')}</span></label>{fieldError('consent')}<Link className="estimate-privacy" href={`/${locale}/privacy`} target="_blank" rel="noopener noreferrer">{t('privacy')}</Link></div><Turnstile onToken={onToken}/></>}
    </motion.div></AnimatePresence>
    <div className="estimate-honeypot" aria-hidden="true"><label htmlFor="estimate-company">Company</label><input id="estimate-company" tabIndex={-1} autoComplete="off" {...register('honeypot')}/></div>
    {error && <p className="estimate-submit-error" role="alert">{error}</p>}
    <div className="estimate-actions">{step > 0 && <button type="button" className="estimate-back" disabled={isSubmitting} onClick={() => showStep(step - 1)} aria-label={t('back')}><ArrowLeft size={16}/></button>}<button className="estimate-next" type="submit" disabled={isSubmitting}>{isSubmitting ? <><LoaderCircle className="estimate-spinner" size={16}/>{t('sending')}</> : <>{t(step < 2 ? 'next' : 'submit')}<ArrowRight size={16}/></>}</button></div>
    <div className="estimate-footer">{t('footer')}</div>
  </motion.form>;
}
