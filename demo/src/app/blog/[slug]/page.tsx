import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { webflowPageGenerator } from '@/lib/webflow-page-generator';
import { webflowClient } from '@/lib/webflow-client';
import ContentRenderer from '@/lib/content-renderer';
import { BreadcrumbNavigation } from '@/components/navigation';

interface BlogPostProps {
  params: {
    slug: string;
  };
}

// Generate metadata for blog posts
export async function generateMetadata({ params }: BlogPostProps): Promise<Metadata> {
  try {
    const result = await webflowPageGenerator.generatePage('blog-post', params.slug, 'blog-posts');
    
    if (result) {
      return {
        ...result.metadata,
        openGraph: {
          ...result.metadata.openGraph,
          type: 'article'
        },
        twitter: {
          card: 'summary_large_image',
          title: result.metadata.title as string,
          description: result.metadata.description as string
        }
      };
    }

    return {
      title: 'Blog Post Not Found',
      description: 'The requested blog post could not be found.'
    };
  } catch (error) {
    console.error('Error generating blog post metadata:', error);
    return {
      title: 'Error',
      description: 'An error occurred while loading the blog post.'
    };
  }
}

// Generate static params for blog posts
export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  try {
    const blogPosts = await webflowClient.getPublishedCollectionItems('blog-posts');
    
    return blogPosts
      .filter(post => post.slug)
      .map(post => ({
        slug: post.slug
      }));
  } catch (error) {
    console.error('Error generating blog post static params:', error);
    return [];
  }
}

// Blog post page component
export default async function BlogPost({ params }: BlogPostProps) {
  try {
    const result = await webflowPageGenerator.generatePage('blog-post', params.slug, 'blog-posts');
    
    if (!result) {
      notFound();
    }

    // Get related posts
    const relatedPosts = await webflowClient.getRelatedCollectionItems(
      'blog-posts',
      params.slug,
      'category',
      3
    );

    return (
      <article className="min-h-screen">
        {/* Breadcrumbs */}
        <div className="bg-gray-50 border-b">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <BreadcrumbNavigation 
              customLabels={{
                blog: 'Blog',
                [params.slug]: result.content.title
              }}
            />
          </div>
        </div>

        {/* Main content */}
        <ContentRenderer sections={result.content.sections} />

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <section className="bg-gray-50 py-16">
            <div className="max-w-4xl mx-auto px-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Posts</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map(post => (
                  <article key={post.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                    {post.fieldData['featured-image'] && (
                      <div className="aspect-video bg-gray-200">
                        <img
                          src={(post.fieldData['featured-image'] as { url: string }).url}
                          alt={post.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        <a 
                          href={`/blog/${post.slug}`}
                          className="hover:text-blue-600 transition-colors"
                        >
                          {post.name}
                        </a>
                      </h3>
                      {post.fieldData.summary && (
                        <p className="text-gray-600 text-sm">
                          {String(post.fieldData.summary)}
                        </p>
                      )}
                      <div className="mt-4 flex items-center text-sm text-gray-500">
                        <time dateTime={post.publishedOn}>
                          {new Date(post.publishedOn || post.createdOn).toLocaleDateString()}
                        </time>
                        {post.fieldData.category && (
                          <>
                            <span className="mx-2">•</span>
                            <span>{String(post.fieldData.category)}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Newsletter CTA */}
        <section className="bg-blue-600 py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Stay Updated
            </h2>
            <p className="text-blue-100 mb-8 text-lg">
              Get the latest insights and updates delivered to your inbox.
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
      </article>
    );
  } catch (error) {
    console.error('Error rendering blog post:', error);
    
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
          <p className="text-gray-600">We encountered an error while loading this blog post.</p>
        </div>
      </div>
    );
  }
}