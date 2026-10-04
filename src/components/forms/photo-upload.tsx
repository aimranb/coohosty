'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { X, LoaderCircle } from 'lucide-react';
import { site } from '@/config/site';
import { validFile } from '@/lib/files';
type Preview = { id: string; src: string; file?: File; receipt?: string; status: 'uploading' | 'done' | 'error' };
async function compress(file: File): Promise<File> {
  const bitmap = await createImageBitmap(file);
  try {
    const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale); canvas.height = Math.round(bitmap.height * scale);
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Image processing unavailable');
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(value => value ? resolve(value) : reject(new Error('Compression failed')), 'image/webp', 0.82));
    if (blob.size > 3900000) throw new Error('Image too large');
    return new File([blob], 'property.webp', { type: 'image/webp' });
  } finally { bitmap.close(); }
}
export function PhotoUpload({ submissionKey, receipts, onChange, onBusy }: { submissionKey: string; receipts: string[]; onChange: (receipts: string[]) => void; onBusy: (busy: boolean) => void }) {
  const t = useTranslations('form');
  const [previews, setPreviews] = useState<Preview[]>([]);
  const [error, setError] = useState('');
  const current = useRef<Preview[]>([]);
  const mounted = useRef(true);
  const input = useRef<HTMLInputElement>(null);
  const callbacks = useRef({ onChange, onBusy });
  useEffect(() => { callbacks.current = { onChange, onBusy }; }, [onChange, onBusy]);
  useEffect(() => {
    mounted.current = true;
    // Uploaded images remain private; restored drafts show neutral placeholders.
    const restored: Preview[] = receipts.map((receipt, i) => ({ id: `saved-${i}`, src: '', receipt, status: 'done' }));
    current.current = restored;
    queueMicrotask(() => setPreviews(restored));
    return () => { mounted.current = false; current.current.forEach(photo => { if (photo.src) URL.revokeObjectURL(photo.src); }); };
    // Initial receipts only: this component publishes subsequent updates itself.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  function update(items: Preview[]) {
    current.current = items;
    if (mounted.current) setPreviews(items);
    callbacks.current.onChange(items.flatMap(item => item.receipt ? [item.receipt] : []));
    callbacks.current.onBusy(items.some(item => item.status !== 'done'));
  }
  async function upload(id: string, file: File) {
    update(current.current.map((item): Preview => item.id === id ? { ...item, status: 'uploading' } : item));
    try {
      const optimized = await compress(file);
      const data = new FormData(); data.set('file', optimized); data.set('submissionKey', submissionKey);
      const response = await fetch('/api/uploads', { method: 'POST', body: data });
      const result: { receipt?: string } = await response.json();
      if (!response.ok || !result.receipt) throw new Error('Upload failed');
      update(current.current.map((item): Preview => item.id === id ? { ...item, receipt: result.receipt, status: 'done' } : item));
    } catch { update(current.current.map((item): Preview => item.id === id ? { ...item, status: 'error' } : item)); }
  }
  async function choose(files: FileList | null) {
    if (!files) return;
    const selected = Array.from(files);
    if (selected.length + current.current.length > site.upload.maxFiles || selected.some(file => !validFile(file))) { setError(t('fileError')); if (input.current) input.current.value = ''; return; }
    setError('');
    const items: Preview[] = selected.map(file => ({ id: crypto.randomUUID(), src: URL.createObjectURL(file), file, status: 'uploading' }));
    update([...current.current, ...items]);
    // Sequential uploads keep memory and network usage bounded on mobile.
    for (const item of items) if (item.file && current.current.some(photo => photo.id === item.id)) await upload(item.id, item.file);
    if (input.current) input.current.value = '';
  }
  return <div className="field field-full"><label htmlFor="photos">{t('fields.photos')} · {t('optional')}</label><div className="upload-area"><input ref={input} id="photos" type="file" multiple accept="image/jpeg,image/png,image/webp" onChange={event => void choose(event.target.files)} disabled={previews.some(photo => photo.status === 'uploading')}/><p className="form-note">{t('photosHelp')}</p></div>{error && <p className="field-error" role="alert">{error}</p>}<div className="photo-previews">{previews.map((photo, i) => <div key={photo.id} className="photo-preview">{photo.src ? <Image src={photo.src} alt={`${t('fields.photos')} ${i + 1}`} width={150} height={100} unoptimized/> : <div className="skeleton" style={{ height: 75 }}/>}<button type="button" aria-label={`${t('remove')} ${i + 1}`} onClick={() => { if (photo.src) URL.revokeObjectURL(photo.src); update(current.current.filter(item => item.id !== photo.id)); }}><X size={12}/></button>{photo.status === 'uploading' && <span className="photo-status"><LoaderCircle className="spinner" size={10}/>{t('uploading')}</span>}{photo.status === 'error' && <><span className="field-error">{t('uploadError')}</span><button className="retry-upload" type="button" onClick={() => photo.file && void upload(photo.id, photo.file)}>{t('retry')}</button></>}</div>)}</div></div>;
}
