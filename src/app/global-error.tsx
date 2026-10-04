'use client';
import fr from '../../messages/fr.json';
export default function GlobalError({ reset }: { reset: () => void }) {
  return <html lang="fr"><body style={{ margin: 0, background: '#f7f7f7', color: '#171717', fontFamily: 'Arial,sans-serif' }}><main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 30, textAlign: 'center' }}><h1>{fr.errors.title}</h1><p>{fr.errors.description}</p><button onClick={reset} style={{ background: '#111111', color: 'white', border: 0, borderRadius: 6, padding: '14px 25px', cursor: 'pointer' }}>{fr.errors.retry}</button></main></body></html>;
}
