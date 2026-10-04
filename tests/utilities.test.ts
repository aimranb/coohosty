import { describe, it, expect } from 'vitest';
import { escapeHtml, csvCell } from '@/lib/escape';
import { validFile, detectImage } from '@/lib/files';
describe('safe export utilities', () => {
  it('escapes injected email markup', () => expect(escapeHtml('<script>"x" & y</script>')).toBe('&lt;script&gt;&quot;x&quot; &amp; y&lt;/script&gt;'));
  it('quotes delimiters, newlines and embedded quotes', () => expect(csvCell('a,"b"\nc')).toBe('"a,""b""\nc"'));
  it.each(['=HYPERLINK("evil")', '+cmd', '-1+1', '@SUM(A1)', '  =SUM(1)', '\t=1'])('neutralizes spreadsheet formulas %s', value => expect(csvCell(value)).toBe(`"'${value.replace(/"/g, '""')}"`));
  it('preserves Unicode', () => expect(csvCell('مراكش')).toBe('"مراكش"'));
});
describe('upload validation', () => {
  it('accepts only supported bounded images', () => { expect(validFile({ type: 'image/jpeg', size: 100 })).toBe(true); expect(validFile({ type: 'image/svg+xml', size: 100 })).toBe(false); expect(validFile({ type: 'image/png', size: 6000000 })).toBe(false); expect(validFile({ type: 'image/webp', size: 0 })).toBe(false); });
  it('validates image signatures independently from extension/MIME', () => { expect(detectImage(new Uint8Array([255, 216, 255, 0]))).toBe('image/jpeg'); expect(detectImage(new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]))).toBe('image/png'); expect(detectImage(Buffer.from('<svg>'))).toBeNull(); });
});
