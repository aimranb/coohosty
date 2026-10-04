import { describe, it, expect } from 'vitest';
import fr from '../messages/fr.json';
import en from '../messages/en.json';
import ar from '../messages/ar.json';
function keys(object: object, prefix = ''): string[] { return Object.entries(object).flatMap(([key, value]) => typeof value === 'object' && value !== null ? keys(value, `${prefix}${key}.`) : [`${prefix}${key}`]).sort(); }
describe('translation completeness', () => { it('has matching keys for every supported language', () => { expect(keys(en)).toEqual(keys(fr)); expect(keys(ar)).toEqual(keys(fr)); }); });
