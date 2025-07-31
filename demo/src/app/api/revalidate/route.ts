import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { WebhookPayload, shouldRevalidate, getPagesToRevalidate } from '@/lib/isr-config';
import { CachedContentLoader } from '@/lib/content-cache';

export async function POST(request: NextRequest) {
  try {
    // Verify the request is authorized
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.REVALIDATE_TOKEN;
    
    if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const payload: WebhookPayload = await request.json();
    
    // Validate payload
    if (!payload.type || !payload.timestamp) {
      return NextResponse.json(
        { error: 'Invalid payload' },
        { status: 400 }
      );
    }

    // Check if we should revalidate
    if (!shouldRevalidate(payload)) {
      return NextResponse.json({
        message: 'No revalidation needed',
        payload
      });
    }

    // Get pages to revalidate
    const pagesToRevalidate = getPagesToRevalidate(payload);
    
    // Clear relevant cache entries
    if (payload.slug) {
      CachedContentLoader.invalidateCache(payload.slug);
    }
    if (payload.category) {
      CachedContentLoader.invalidateCache(payload.category);
    }

    // Revalidate pages
    const revalidationResults = [];
    for (const pagePath of pagesToRevalidate) {
      try {
        revalidatePath(pagePath);
        revalidationResults.push({ path: pagePath, status: 'success' });
      } catch (error) {
        console.error(`Failed to revalidate ${pagePath}:`, error);
        revalidationResults.push({ 
          path: pagePath, 
          status: 'error', 
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return NextResponse.json({
      message: 'Revalidation completed',
      payload,
      revalidated: revalidationResults,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Revalidation webhook error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'revalidation-webhook'
  });
}