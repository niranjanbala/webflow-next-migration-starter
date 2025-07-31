import { NextResponse } from 'next/server';
import { getAllPages } from '@/lib/content-loader';
import { generateSitemapEntries, generateSitemapXML } from '@/lib/sitemap';

export async function GET() {
  try {
    // Load all content for sitemap generation
    const pages = await getAllPages();
    
    // Convert PageContent to ContentItem format for sitemap
    const content = pages.map(page => ({
      id: page.slug || 'unknown',
      title: page.title || 'Untitled',
      slug: page.slug,
      category: page.category || 'pages',
      content: page.content || '',
      createdAt: page.createdAt || new Date().toISOString(),
      updatedAt: page.updatedAt || page.createdAt || new Date().toISOString()
    }));
    
    // Generate sitemap entries
    const entries = generateSitemapEntries(content, {
      baseUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://numeralhq.com',
      excludePaths: ['/api', '/admin', '/_next', '/components-demo', '/sitemap.xml', '/robots.txt'],
      defaultChangeFreq: 'weekly',
      defaultPriority: 0.7
    });

    // Generate XML
    const sitemapXML = generateSitemapXML(entries);

    return new NextResponse(sitemapXML, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400', // Cache for 24 hours
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
}