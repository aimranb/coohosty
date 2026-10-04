'use client';
import { useFormContext } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { Field } from './form-field';
import type { AuditInput, AuditData } from '@/validations/audit';
export const useAuditContext = () => useFormContext<AuditInput, unknown, AuditData>();
type TextName = 'fullName' | 'phone' | 'email' | 'country' | 'city' | 'neighborhood' | 'listingUrl' | 'availability';
type SelectName = 'plan' | 'type' | 'finish' | 'management' | 'propertyStatus' | 'authorization' | 'objective';
type NumberName = 'surface' | 'bedrooms' | 'beds' | 'bathrooms' | 'capacity' | 'nightlyRate' | 'occupancy' | 'rating';
const autocomplete: Record<TextName, string> = { fullName: 'name', phone: 'tel', email: 'email', country: 'country-name', city: 'address-level2', neighborhood: 'address-level3', listingUrl: 'url', availability: 'off' };
export function TextInput({ name, type = 'text', full = false }: { name: TextName; type?: string; full?: boolean }) {
  const { register, formState: { errors } } = useAuditContext();
  return <Field name={name} error={errors[name]} full={full}>
    <input id={name} {...register(name)} type={type}
      maxLength={name === 'listingUrl' ? 2048 : name === 'availability' ? 300 : 254}
      autoComplete={autocomplete[name]} dir={['phone', 'email', 'listingUrl'].includes(name) ? 'ltr' : undefined}
      aria-invalid={!!errors[name]} aria-describedby={errors[name] ? `${name}-error` : undefined}/>
  </Field>;
}
export function SelectInput({ name, options, full = false }: { name: SelectName; options: readonly string[]; full?: boolean }) {
  const t = useTranslations('form');
  const { register, formState: { errors } } = useAuditContext();
  return <Field name={name} error={errors[name]} full={full}>
    <select id={name} {...register(name)} aria-invalid={!!errors[name]} aria-describedby={errors[name] ? `${name}-error` : undefined}>
      <option value="">{t('select')}</option>
      {options.map(value => <option value={value} key={value}>{t(`options.${value}`)}</option>)}
    </select>
  </Field>;
}
export function NumberInput({ name, max, min = 0, optional = false }: { name: NumberName; max: number; min?: number; optional?: boolean }) {
  const { register, formState: { errors } } = useAuditContext();
  return <Field name={name} error={errors[name]}>
    <input id={name} {...register(name, { setValueAs: value => value === '' ? optional ? null : NaN : Number(value) })}
      type="number" inputMode="decimal" min={min} max={max}
      step={['surface', 'nightlyRate', 'occupancy', 'rating'].includes(name) ? '0.1' : '1'}
      aria-invalid={!!errors[name]} aria-describedby={errors[name] ? `${name}-error` : undefined}/>
  </Field>;
}
export function CheckboxGroup({ name, options }: { name: 'amenities' | 'platforms'; options: readonly string[] }) {
  const t = useTranslations('form'); const { register } = useAuditContext();
  return <fieldset className="field-full">
    <legend>{t(`fields.${name}`)}</legend>
    <div className="checkbox-grid">{options.map(value => <label key={value}>
      <input type="checkbox" value={value} {...register(name)}/>{t(`options.${value}`)}
    </label>)}</div>
  </fieldset>;
}
