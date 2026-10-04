import { ImageResponse } from 'next/og';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export default function OpenGraphImage() {
  return new ImageResponse(<div style={{ display: 'flex', width: '100%', height: '100%', background: '#F5F5F5', padding: 90, flexDirection: 'column', justifyContent: 'space-between', color: '#171717' }}><div style={{ display: 'flex', fontSize: 38, letterSpacing: 6 }}>COOHOSTY</div><div style={{ display: 'flex', fontSize: 78, lineHeight: 1.1, flexDirection: 'column' }}><span>Votre bien. Notre expertise.</span><span>Plus de potentiel.</span></div><div style={{ display: 'flex', fontSize: 22 }}>CO-HOSTING · GESTION DES REVENUS</div></div>, size);
}
