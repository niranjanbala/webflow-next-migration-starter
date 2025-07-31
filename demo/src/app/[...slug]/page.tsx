import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { webflowPageGenerator } from '@/lib/webflow-page-generator';
import { webflowClient } from '@/lib/webflow-client';
import ContentRenderer from '@/lib/content-renderer';

interface PageProps {
  params: {
    slug: string[];
  };
}

// Generate metadata for the page
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const slug = params.slug.join('/');
  
  try {
    // Try to find a matching template and generate page
    const templates = webflowPageGenerator.getTemplates();
    
    for (const template of templates) {
      if (template.type === 'collection' && template.collectionId) {
        const item = await webflowClient.getCollectionItemBySlug(template.collectionId, slug);
        if (item) {
          const result = await webflowPageGenerator.generatePage(template.slug, item.id);
          if (result) {
            return result.metadata;
          }
        }
      }
    }

    // Fallback: try to find a static page
    const page = await webflowClient.getPageBySlug(slug);
    if (page) {
      return {
        title: page.seoTitle || page.title || page.name,
        description: page.seoDescription || `Learn more about ${page.name}`,
        openGraph: {
          title: page.openGraphTitle || page.seoTitle || page.title || page.name,
          description: page.openGraphDescription || page.seoDescription || `Learn more about ${page.name}`,
          type: 'website'
        }
      };
    }

    return {
      title: 'Page Not Found',
      description: 'The requested page could not be found.'
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Error',
      description: 'An error occurred while loading the page.'
    };
  }
}

// Generate static params for static generation
export async function generateStaticParams(): Promise<Array<{ slug: string[] }>> {
  try {
    const params: Array<{ slug: string[] }> = [];
    
    // Get all collection items from all templates
    const templates = webflowPageGenerator.getTemplates();
    
    for (const template of templates) {
      if (template.type === 'collection' && template.collectionId) {
        const items = await webflowClient.getPublishedCollectionItems(template.collectionId);
        
        for (const item of items) {
          if (item.slug) {
            params.push({
              slug: item.slug.split('/')
            });
          }
        }
      }
    }

    // Get all static pages
    const pages = await webflowClient.getPages();
    for (const page of pages) {
      if (page.slug && page.slug !== 'index' && page.publishedOn) {
        params.push({
          slug: page.slug.split('/')
        });
      }
    }

    return params;
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// Main page component
export default async function DynamicPage({ params }: PageProps) {
  const slug = params.slug.join('/');
  
  try {
    // Try to find a matching template and generate page
    const templates = webflowPageGenerator.getTemplates();
    
    for (const template of templates) {
      if (template.type === 'collection' && template.collectionId) {
        const item = await webflowClient.getCollectionItemBySlug(template.collectionId, slug);
        if (item) {
          const result = await webflowPageGenerator.generatePage(template.slug, item.id);
          if (result) {
            return (
              <div className="min-h-screen">
                <ContentRenderer sections={result.content.sections} />
              </div>
            );
          }
        }
      }
    }

    // Fallback: try to render a static page
    const page = await webflowClient.getPageBySlug(slug);
    if (page) {
      return (
        <div className="min-h-screen">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-6">{page.title || page.name}</h1>
            <div className="prose prose-lg max-w-none">
              {/* Static page content would be rendered here */}
              <p>This is a static page: {page.name}</p>
            </div>
          </div>
        </div>
      );
    }

    // Page not found
    notFound();
  } catch (error) {
    console.error('Error rendering page:', error);
    
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
          <p className="text-gray-600">We encountered an error while loading this page.</p>
        </div>
      </div>
    );
  }
}