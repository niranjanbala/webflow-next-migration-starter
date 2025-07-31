import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { webflowPageGenerator } from '@/lib/webflow-page-generator';
import { webflowClient } from '@/lib/webflow-client';
import ContentRenderer from '@/lib/content-renderer';
import { BreadcrumbNavigation } from '@/components/navigation';

interface ProductPageProps {
  params: {
    slug: string;
  };
}

// Generate metadata for product pages
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  try {
    const result = await webflowPageGenerator.generatePage('product-page', params.slug, 'products');
    
    if (result) {
      return {
        ...result.metadata,
        openGraph: {
          ...result.metadata.openGraph,
          type: 'product'
        },
        twitter: {
          card: 'summary_large_image',
          title: result.metadata.title as string,
          description: result.metadata.description as string
        }
      };
    }

    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found.'
    };
  } catch (error) {
    console.error('Error generating product metadata:', error);
    return {
      title: 'Error',
      description: 'An error occurred while loading the product.'
    };
  }
}

// Generate static params for products
export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  try {
    const products = await webflowClient.getPublishedCollectionItems('products');
    
    return products
      .filter(product => product.slug)
      .map(product => ({
        slug: product.slug
      }));
  } catch (error) {
    console.error('Error generating product static params:', error);
    return [];
  }
}

// Product page component
export default async function ProductPage({ params }: ProductPageProps) {
  try {
    const result = await webflowPageGenerator.generatePage('product-page', params.slug, 'products');
    
    if (!result) {
      notFound();
    }

    // Get the product data for additional features
    const product = await webflowClient.getCollectionItemBySlug('products', params.slug);
    
    // Get related products
    const relatedProducts = await webflowClient.getRelatedCollectionItems(
      'products',
      product?.id || '',
      'category',
      3
    );

    return (
      <div className="min-h-screen">
        {/* Breadcrumbs */}
        <div className="bg-gray-50 border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <BreadcrumbNavigation 
              customLabels={{
                products: 'Products',
                [params.slug]: result.content.title
              }}
            />
          </div>
        </div>

        {/* Main content */}
        <ContentRenderer sections={result.content.sections} />

        {/* Product specifications */}
        {product?.fieldData.specifications && (
          <section className="bg-white py-16">
            <div className="max-w-7xl mx-auto px-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Specifications</h2>
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: String(product.fieldData.specifications) 
                }}
              />
            </div>
          </section>
        )}

        {/* FAQ Section */}
        {product?.fieldData.faq && (
          <section className="bg-gray-50 py-16">
            <div className="max-w-4xl mx-auto px-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                Frequently Asked Questions
              </h2>
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: String(product.fieldData.faq) 
                }}
              />
            </div>
          </section>
        )}

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <section className="bg-white py-16">
            <div className="max-w-7xl mx-auto px-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedProducts.map(relatedProduct => (
                  <div key={relatedProduct.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                    {relatedProduct.fieldData['hero-image'] && (
                      <div className="aspect-video bg-gray-200">
                        <img
                          src={(relatedProduct.fieldData['hero-image'] as { url: string }).url}
                          alt={relatedProduct.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        <a 
                          href={`/products/${relatedProduct.slug}`}
                          className="hover:text-blue-600 transition-colors"
                        >
                          {relatedProduct.name}
                        </a>
                      </h3>
                      {relatedProduct.fieldData.description && (
                        <p className="text-gray-600 text-sm mb-4">
                          {String(relatedProduct.fieldData.description)}
                        </p>
                      )}
                      {relatedProduct.fieldData.price && (
                        <div className="text-lg font-bold text-blue-600">
                          {String(relatedProduct.fieldData.price)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Contact sales CTA */}
        <section className="bg-blue-600 py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to get started?
            </h2>
            <p className="text-blue-100 mb-8 text-lg">
              Contact our sales team to learn more about {result.content.title}.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Contact Sales
              </a>
              <a
                href="/demo"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Schedule Demo
              </a>
            </div>
          </div>
        </section>
      </div>
    );
  } catch (error) {
    console.error('Error rendering product page:', error);
    
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
          <p className="text-gray-600">We encountered an error while loading this product.</p>
        </div>
      </div>
    );
  }
}