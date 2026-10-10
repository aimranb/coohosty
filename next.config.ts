import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
const config: NextConfig = {
  poweredByHeader: false,
  outputFileTracingIncludes: { '/api/admin/requests/*/pdf': ['./node_modules/@fontsource/noto-sans/files/noto-sans-latin-400-normal.woff', './node_modules/@fontsource/noto-sans-arabic/files/noto-sans-arabic-arabic-400-normal.woff'] },
  images: { deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2560, 3840], remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }, { protocol: 'https', hostname: 'images.pexels.com' }, { protocol: 'https', hostname: 'upload.wikimedia.org' }, { protocol: 'https', hostname: 'res.cloudinary.com' }] },
  async headers() {
    return [{ source: '/images/optimized/:path*', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] }, { source: '/:path*', headers: [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
      { key: 'Content-Security-Policy', value: `default-src 'self'; script-src 'self' 'unsafe-inline' ${process.env.NODE_ENV === 'development' ? "'unsafe-eval'" : ''} https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://images.unsplash.com https://images.pexels.com https://upload.wikimedia.org https://res.cloudinary.com https://www.google.com; media-src 'self'; font-src 'self'; connect-src 'self' ${process.env.NODE_ENV === 'development' ? 'ws: wss:' : ''} https://challenges.cloudflare.com; frame-src https://challenges.cloudflare.com https://www.openstreetmap.org; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'` }
    ] }];
  }
};
export default createNextIntlPlugin('./src/i18n/request.ts')(config);
