import { NextResponse } from 'next/server';
import { generateRobotsTxt } from '@/lib/sitemap';

export async function GET() {
  const robotsTxt = generateRobotsTxt({
    baseUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://numeralhq.com',
    allowAll: true,
    disallowPaths: [
      '/api/',
      '/admin/',
      '/_next/',
      '/components-demo/',
      '/*.json$',
      '/private/'
    ],
    allowPaths: [
      '/blog/',
      '/resources/',
      '/customers/',
      '/integrations/'
    ],
    crawlDelay: 1
  });

  return new NextResponse(robotsTxt, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400', // Cache for 24 hours
    },
  });
}