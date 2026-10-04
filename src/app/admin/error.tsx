'use client';
import fr from '../../../messages/fr.json';
export default function AdminError({ reset }: { reset: () => void }) { return <div className="error-page"><h1>{fr.errors.title}</h1><p>{fr.errors.description}</p><button className="button" onClick={reset}>{fr.errors.retry}</button></div>; }
