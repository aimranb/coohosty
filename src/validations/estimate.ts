import { z } from 'zod';
import { locales } from '@/config/site';

export const estimateTypes = ['apartment', 'villa'] as const;
export const estimateBedrooms = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'] as const;
export const estimateGoals = ['revenue', 'time', 'remote', 'investment'] as const;
export const estimateDurations = ['under3', '3to6', '6to12', 'yearplus', 'flexible'] as const;
export const estimateStarts = ['now', 'month', 'threeMonths', 'exploring'] as const;
const text = (max: number) => z.string().trim().min(1, 'required').max(max, 'tooLong').refine(value => !/[\u0000-\u001f\u007f]/.test(value), 'invalid');
export const estimateSchema = z.object({
  type: z.enum(estimateTypes), bedrooms: z.enum(estimateBedrooms),
  city: text(120), address: text(300), objective: z.enum(estimateGoals),
  duration: z.enum(estimateDurations), ready: z.enum(estimateStarts),
  fullName: text(120), email: z.email('email').max(254).transform(value => value.toLowerCase()),
  phone: z.string().trim().max(24).refine(value => !value || /^\+?[\d ().-]{8,24}$/.test(value) && value.replace(/\D/g, '').length >= 8 && value.replace(/\D/g, '').length <= 15, 'phone'),
  channel: z.enum(['email', 'whatsapp']), consent: z.boolean().refine(value => value, 'consent'),
  locale: z.enum(locales), submissionKey: z.uuid(), honeypot: z.string().max(0, 'invalid'), turnstileToken: z.string().max(2048).optional(),
});
export type EstimateInput = z.input<typeof estimateSchema>;
export type EstimateData = z.output<typeof estimateSchema>;
export const estimateSteps: (keyof EstimateInput)[][] = [
  ['type', 'bedrooms', 'city', 'address'], ['objective', 'duration', 'ready'], ['fullName', 'email', 'phone', 'channel', 'consent'],
];
