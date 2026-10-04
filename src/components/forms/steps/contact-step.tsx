'use client';
import { plans } from '@/config/site';
import { TextInput, SelectInput } from '../audit-fields';
export function ContactStep() {
  return <>
    <TextInput name="fullName" full/>
    <TextInput name="phone" type="tel"/>
    <TextInput name="email" type="email"/>
    <TextInput name="country"/>
    <SelectInput name="plan" options={plans}/>
  </>;
}
