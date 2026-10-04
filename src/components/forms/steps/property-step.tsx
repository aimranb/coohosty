'use client';
import { useCallback } from 'react';
import { useWatch } from 'react-hook-form';
import { amenities, propertyTypes, finishes } from '@/validations/audit';
import { TextInput, SelectInput, NumberInput, CheckboxGroup, useAuditContext } from '../audit-fields';
import { PhotoUpload } from '../photo-upload';
export function PropertyStep({ onBusy }: { onBusy: (busy: boolean) => void }) {
  const { control, setValue } = useAuditContext();
  const receipts = useWatch({ control, name: 'photoReceipts' });
  const submissionKey = useWatch({ control, name: 'submissionKey' });
  const onChange = useCallback((items: string[]) => setValue('photoReceipts', items), [setValue]);
  return <>
    <TextInput name="city"/><TextInput name="neighborhood"/>
    <SelectInput name="type" options={propertyTypes}/><NumberInput name="surface" max={100000} min={1}/>
    <NumberInput name="bedrooms" max={100}/><NumberInput name="beds" max={200} min={1}/>
    <NumberInput name="bathrooms" max={100} min={1}/><NumberInput name="capacity" max={500} min={1}/>
    <CheckboxGroup name="amenities" options={amenities}/>
    <SelectInput name="finish" options={finishes} full/>
    <PhotoUpload submissionKey={submissionKey} receipts={receipts} onChange={onChange} onBusy={onBusy}/>
  </>;
}
