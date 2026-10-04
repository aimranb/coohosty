'use client';
import { useWatch } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { propertyStatuses } from '@/validations/audit';
import { TextInput, SelectInput, NumberInput, CheckboxGroup, useAuditContext } from '../audit-fields';
export function SituationStep() {
  const t = useTranslations('form');
  const { control, setValue, getValues } = useAuditContext();
  const isRental = useWatch({ control, name: 'isRental' });
  return <>
    <fieldset className="field-full"><legend>{t('fields.isRental')}</legend><div className="radio-row">
      {[true, false].map(value => <label key={String(value)}>
        <input type="radio" name="rental" checked={isRental === value} onChange={() => {
          setValue('isRental', value);
          if (value && !getValues('management')) setValue('management', 'self');
          if (!value && !getValues('propertyStatus')) setValue('propertyStatus', 'empty');
        }}/>{t(value ? 'yes' : 'no')}
      </label>)}
    </div></fieldset>
    {isRental ? <>
      <TextInput name="listingUrl" type="url" full/>
      <CheckboxGroup name="platforms" options={['airbnb']}/>
      <NumberInput name="nightlyRate" max={1000000} optional/>
      <NumberInput name="occupancy" max={100} optional/>
      <NumberInput name="rating" max={10} optional/>
      <SelectInput name="management" options={['self', 'thirdParty']}/>
    </> : <SelectInput name="propertyStatus" options={propertyStatuses} full/>}
  </>;
}
