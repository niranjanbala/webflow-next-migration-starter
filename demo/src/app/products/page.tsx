import { Metadata } from 'next';
import { webflowClient } from '@/lib/webflow-client';
import { BreadcrumbNavigation } from '@/components/navigation';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Products | NumeralHQ - Sales Tax Automation Solutions',
  description: 'Explore our comprehensive suite of sales tax automation products designed for ecommerce and SaaS businesses.',
  openGraph: {
    title: 'Products | NumeralHQ - Sales Tax Automation Solutions',
    description: 'Explore our comprehensive suite of sales tax automation products designed for ecommerce and SaaS businesses.',
    type: 'website'
  }
};

interface Product {
  id: string;
  name: string;
  slug: string;
  fieldData: {
    'hero-image'?: { url: string };
    description?: string;
    price?: string;
    category?: string;
    'key-features'?: string;
    popular?: boolean;
  };
  publishedOn?: string;
  createdOn: string;
}

export default async function ProductsIndex() {
  try {
    // Get all published products
    const products = await webflowClient.getPublishedCollectionItems('products', {
      sort: 'name',
      limit: 50
    }) as Product[];

    // Get unique categories
    const categories = Array.from(
      new Set(
        products
          .map(product => product.fieldData.category)
          .filter(Boolean)
      )
    );

    // Separate popular products
    const popularProducts = products.filter(product => product.fieldData.popular);
    const otherProducts = products.filter(product => !product.fieldData.popular);

    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="bg-gray-50 border-b">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <BreadcrumbNavigation 
              customLabels={{
                products: 'Products'
              }}
            />
            <h1 className="text-4xl font-bold text-gray-900 mt-4">Products</h1>
            <p className="text-xl text-gray-600 mt-2">
              Comprehensive sales tax automation solutions for modern businesses
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Categories */}
          {categories.length > 0 && (
            <div className="mb-12">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Categories</h2>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/products"
                  className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  All Products
                </Link>
                {categories.map(category => (
                  <Link
                    key={category}
                    href={`/products/category/${String(category).toLowerCase().replace(/\s+/g, '-')}`}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
                  >
                    {String(category)}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Popular products */}
          {popularProducts.length > 0 && (
            <section className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Popular Products</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {popularProducts.map(product => (
                  <div key={product.id} className="bg-white rounded-lg shadow-lg border-2 border-blue-200 overflow-hidden relative">
                    <div className="absolute top-4 right-4 z-10">
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Popular
                      </span>
                    </div>
                    {product.fieldData['hero-image'] && (
                      <div className="aspect-video bg-gray-200">
                        <img
                          src={product.fieldData['hero-image'].url}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      {product.fieldData.category && (
                        <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full mb-3">
                          {product.fieldData.category}
                        </span>
                      )}
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        <Link 
                          href={`/products/${product.slug}`}
                          className="hover:text-blue-600 transition-colors"
                        >
                          {product.name}
                        </Link>
                      </h3>
                      {product.fieldData.description && (
                        <p className="text-gray-600 mb-4">
                          {product.fieldData.description}
                        </p>
                      )}
                      {product.fieldData['key-features'] && (
                        <div 
                          className="text-sm text-gray-600 mb-4"
                          dangerouslySetInnerHTML={{ 
                            __html: String(product.fieldData['key-features']).substring(0, 150) + '...' 
                          }}
                        />
                      )}
                      <div className="flex items-center justify-between">
                        {product.fieldData.price && (
                          <div className="text-2xl font-bold text-blue-600">
                            {product.fieldData.price}
                          </div>
                        )}
                        <Link
                          href={`/products/${product.slug}`}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                          Learn More
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* All products */}
          {otherProducts.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                {popularProducts.length > 0 ? 'All Products' : 'Our Products'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {otherProducts.map(product => (
                  <div key={product.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                    {product.fieldData['hero-image'] && (
                      <div className="aspect-video bg-gray-200">
                        <img
                          src={product.fieldData['hero-image'].url}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      {product.fieldData.category && (
                        <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full mb-3">
                          {product.fieldData.category}
                        </span>
                      )}
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        <Link 
                          href={`/products/${product.slug}`}
                          className="hover:text-blue-600 transition-colors"
                        >
                          {product.name}
                        </Link>
                      </h3>
                      {product.fieldData.description && (
                        <p className="text-gray-600 text-sm mb-4">
                          {product.fieldData.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        {product.fieldData.price && (
                          <div className="text-lg font-bold text-blue-600">
                            {product.fieldData.price}
                          </div>
                        )}
                        <Link
                          href={`/products/${product.slug}`}
                          className="text-blue-600 font-medium hover:text-blue-800 transition-colors"
                        >
                          Learn More →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Empty state */}
          {products.length === 0 && (
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">No products available</h2>
              <p className="text-gray-600">Check back soon for our latest product offerings.</p>
            </div>
          )}
        </div>

        {/* CTA Section */}
        <section className="bg-blue-600 py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Need help choosing the right product?
            </h2>
            <p className="text-blue-100 mb-8 text-lg">
              Our sales team can help you find the perfect solution for your business needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Contact Sales
              </Link>
              <Link
                href="/demo"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Schedule Demo
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  } catch (error) {
    console.error('Error loading products:', error);
    
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
          <p className="text-gray-600">We encountered an error while loading the products.</p>
        </div>
      </div>
    );
  }
}