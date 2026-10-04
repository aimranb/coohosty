'use client';
import { useEffect, useRef } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import type { AuditInput, AuditData } from '@/validations/audit';
const storageKey = 'cohosty-audit-v1';
const draftSchema = z.object({ data: z.record(z.string(), z.unknown()), step: z.number().int().min(0).max(4), savedAt: z.number() });
export function clearDraft() { try { localStorage.removeItem(storageKey); } catch { /* Storage may be disabled by the browser. */ } }
export function useAuditDraft(form: UseFormReturn<AuditInput, unknown, AuditData>, step: number, setStep: (step: number) => void, locale: AuditInput['locale']) {
  const restored = useRef(false);
  useEffect(() => {
    const defaults = form.getValues();
    let restoredStep = 0;
    try {
      const raw = localStorage.getItem(storageKey);
      const parsed = raw ? draftSchema.safeParse(JSON.parse(raw)) : null;
      if (parsed?.success && Date.now() - parsed.data.savedAt < 7 * 86400000) {
        const data = parsed.data.data;
        for (const key of Object.keys(defaults) as (keyof AuditInput)[]) {
          const value = data[key];
          if (value === undefined || key === 'locale' || key === 'honeypot' || key === 'turnstileToken') continue;
          if (Array.isArray(defaults[key])) {
            if (Array.isArray(value) && value.every(item => typeof item === 'string') && value.length <= 20) Object.assign(defaults, { [key]: value });
          } else if (typeof value === typeof defaults[key] || defaults[key] === null && (value === null || typeof value === 'number' || typeof value === 'string')) Object.assign(defaults, { [key]: value });
        }
        restoredStep = parsed.data.step;
      } else if (raw) clearDraft();
    } catch { clearDraft(); }
    defaults.locale = locale;
    if (!z.uuid().safeParse(defaults.submissionKey).success) defaults.submissionKey = crypto.randomUUID();
    defaults.consent = false;
    form.reset(defaults);
    queueMicrotask(() => setStep(restoredStep));
    restored.current = true;
  }, [form, locale, setStep]);
  useEffect(() => {
    if (!restored.current) return;
    const save = () => {
      try {
        const data = { ...form.getValues(), turnstileToken: undefined, honeypot: '', consent: false };
        localStorage.setItem(storageKey, JSON.stringify({ data, step, savedAt: Date.now() }));
      } catch { /* The form still works when browser storage is unavailable. */ }
    };
    save();
    return form.subscribe({ formState: { values: true }, callback: save });
  }, [form, step]);
}
