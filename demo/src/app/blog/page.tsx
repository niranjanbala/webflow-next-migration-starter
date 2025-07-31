import { Metadata } from 'next';
import { webflowClient } from '@/lib/webflow-client';
import { BreadcrumbNavigation } from '@/components/navigation';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog | NumeralHQ - Sales Tax Insights & Updates',
  description: 'Stay updated with the latest insights on sales tax automation, compliance, and ecommerce tax strategies.',
  openGraph: {
    title: 'Blog | NumeralHQ - Sales Tax Insights & Updates',
    description: 'Stay updated with the latest insights on sales tax automation, compliance, and ecommerce tax strategies.',
    type: 'website'
  }
};

interface BlogPost {
  id: string;
  name: string;
  slug: string;
  fieldData: {
    'featured-image'?: { url: string };
    summary?: string;
    category?: string;
    'author-name'?: string;
    'read-time'?: string;
  };
  publishedOn?: string;
  createdOn: string;
}

export default async function BlogIndex() {
  try {
    // Get all published blog posts
    const blogPosts = await webflowClient.getPublishedCollectionItems('blog-posts', {
      sort: '-publishedOn',
      limit: 50
    }) as BlogPost[];

    // Get unique categories
    const categories = Array.from(
      new Set(
        blogPosts
          .map(post => post.fieldData.category)
          .filter(Boolean)
      )
    );

    // Featured post (most recent)
    const featuredPost = blogPosts[0];
    const otherPosts = blogPosts.slice(1);

    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="bg-gray-50 border-b">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <BreadcrumbNavigation 
              customLabels={{
                blog: 'Blog'
              }}
            />
            <h1 className="text-4xl font-bold text-gray-900 mt-4">Blog</h1>
            <p className="text-xl text-gray-600 mt-2">
              Insights, updates, and best practices for sales tax automation
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
                  href="/blog"
                  className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  All Posts
                </Link>
                {categories.map(category => (
                  <Link
                    key={category}
                    href={`/blog/category/${String(category).toLowerCase().replace(/\s+/g, '-')}`}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
                  >
                    {String(category)}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Featured post */}
          {featuredPost && (
            <section className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Post</h2>
              <article className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="md:flex">
                  {featuredPost.fieldData['featured-image'] && (
                    <div className="md:w-1/2">
                      <div className="aspect-video md:aspect-square bg-gray-200">
                        <img
                          src={featuredPost.fieldData['featured-image'].url}
                          alt={featuredPost.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                  <div className={`p-8 ${featuredPost.fieldData['featured-image'] ? 'md:w-1/2' : 'w-full'}`}>
                    {featuredPost.fieldData.category && (
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full mb-4">
                        {featuredPost.fieldData.category}
                      </span>
                    )}
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      <Link 
                        href={`/blog/${featuredPost.slug}`}
                        className="hover:text-blue-600 transition-colors"
                      >
                        {featuredPost.name}
                      </Link>
                    </h3>
                    {featuredPost.fieldData.summary && (
                      <p className="text-gray-600 mb-6 text-lg">
                        {featuredPost.fieldData.summary}
                      </p>
                    )}
                    <div className="flex items-center text-sm text-gray-500">
                      <time dateTime={featuredPost.publishedOn}>
                        {new Date(featuredPost.publishedOn || featuredPost.createdOn).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </time>
                      {featuredPost.fieldData['author-name'] && (
                        <>
                          <span className="mx-2">•</span>
                          <span>By {featuredPost.fieldData['author-name']}</span>
                        </>
                      )}
                      {featuredPost.fieldData['read-time'] && (
                        <>
                          <span className="mx-2">•</span>
                          <span>{featuredPost.fieldData['read-time']} read</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            </section>
          )}

          {/* All posts */}
          {otherPosts.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-8">All Posts</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {otherPosts.map(post => (
                  <article key={post.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                    {post.fieldData['featured-image'] && (
                      <div className="aspect-video bg-gray-200">
                        <img
                          src={post.fieldData['featured-image'].url}
                          alt={post.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      {post.fieldData.category && (
                        <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full mb-3">
                          {post.fieldData.category}
                        </span>
                      )}
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        <Link 
                          href={`/blog/${post.slug}`}
                          className="hover:text-blue-600 transition-colors"
                        >
                          {post.name}
                        </Link>
                      </h3>
                      {post.fieldData.summary && (
                        <p className="text-gray-600 text-sm mb-4">
                          {post.fieldData.summary}
                        </p>
                      )}
                      <div className="flex items-center text-xs text-gray-500">
                        <time dateTime={post.publishedOn}>
                          {new Date(post.publishedOn || post.createdOn).toLocaleDateString()}
                        </time>
                        {post.fieldData['author-name'] && (
                          <>
                            <span className="mx-2">•</span>
                            <span>{post.fieldData['author-name']}</span>
                          </>
                        )}
                        {post.fieldData['read-time'] && (
                          <>
                            <span className="mx-2">•</span>
                            <span>{post.fieldData['read-time']}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* Empty state */}
          {blogPosts.length === 0 && (
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">No blog posts yet</h2>
              <p className="text-gray-600">Check back soon for the latest insights and updates.</p>
            </div>
          )}
        </div>

        {/* Newsletter CTA */}
        <section className="bg-blue-600 py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Never miss an update
            </h2>
            <p className="text-blue-100 mb-8 text-lg">
              Subscribe to our newsletter for the latest insights on sales tax automation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-blue-300"
              />
              <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  } catch (error) {
    console.error('Error loading blog posts:', error);
    
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
          <p className="text-gray-600">We encountered an error while loading the blog.</p>
        </div>
      </div>
    );
  }
}