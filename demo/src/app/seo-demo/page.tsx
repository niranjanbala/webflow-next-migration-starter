import { Metadata } from 'next';
import { PageSEO, generateMetadata, Breadcrumbs, generateBreadcrumbs } from '@/components/seo';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';

export const metadata: Metadata = generateMetadata({
  title: "SEO Demo Page - Advanced Meta Tags & Structured Data",
  description: "Comprehensive demonstration of SEO optimization features including meta tags, Open Graph, Twitter Cards, and structured data implementation.",
  keywords: ["SEO", "meta tags", "structured data", "Open Graph", "Twitter Cards", "schema.org"],
  url: "/seo-demo",
  type: "article",
  author: "Numeral Team"
});

export default function SEODemoPage() {
  const breadcrumbs = generateBreadcrumbs('/seo-demo', {
    'seo-demo': 'SEO Demo'
  });

  const faqs = [
    {
      question: "What is structured data and why is it important?",
      answer: "Structured data is a standardized format for providing information about a page and classifying the page content. It helps search engines understand your content better and can lead to rich snippets in search results."
    },
    {
      question: "How do meta tags improve SEO?",
      answer: "Meta tags provide metadata about your HTML document. They help search engines understand what your page is about and can influence how your page appears in search results."
    },
    {
      question: "What are Open Graph tags?",
      answer: "Open Graph tags are meta tags that control how your content appears when shared on social media platforms like Facebook, LinkedIn, and others."
    },
    {
      question: "How does a sitemap help with SEO?",
      answer: "A sitemap is a file that provides information about the pages, videos, and other files on your site, and the relationships between them. Search engines use this file to crawl your site more efficiently."
    }
  ];

  const article = {
    title: "SEO Demo Page - Advanced Meta Tags & Structured Data",
    description: "Comprehensive demonstration of SEO optimization features including meta tags, Open Graph, Twitter Cards, and structured data implementation.",
    author: "Numeral Team",
    publishedTime: "2024-01-15T10:00:00Z",
    modifiedTime: "2024-01-15T15:30:00Z",
    image: "/images/seo-demo-og.jpg",
    url: "/seo-demo",
    section: "Technical Documentation",
    tags: ["SEO", "Web Development", "Meta Tags", "Structured Data"]
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <PageSEO 
        faqs={faqs}
        breadcrumbs={breadcrumbs}
        article={article}
      />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Breadcrumbs items={breadcrumbs} />
        </div>

        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              SEO Optimization Demo
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              This page demonstrates comprehensive SEO optimization including meta tags, 
              structured data, breadcrumbs, and social media optimization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Meta Tags Implementation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Basic Meta Tags</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Title tag with proper length and keywords</li>
                    <li>• Meta description optimized for CTR</li>
                    <li>• Keywords meta tag for legacy support</li>
                    <li>• Author and publication information</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Robots Meta Tags</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Index/NoIndex directives</li>
                    <li>• Follow/NoFollow link directives</li>
                    <li>• Google-specific bot instructions</li>
                    <li>• Canonical URL specification</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Open Graph & Twitter Cards</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Open Graph Tags</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• og:title for social media titles</li>
                    <li>• og:description for social previews</li>
                    <li>• og:image with proper dimensions</li>
                    <li>• og:type and og:url for content classification</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Twitter Cards</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• twitter:card type specification</li>
                    <li>• twitter:title and twitter:description</li>
                    <li>• twitter:image for rich previews</li>
                    <li>• twitter:creator attribution</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Structured Data (JSON-LD)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Article Schema</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Article headline and description</li>
                    <li>• Author and publisher information</li>
                    <li>• Publication and modification dates</li>
                    <li>• Article section and keywords</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">FAQ Schema</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Question and answer pairs</li>
                    <li>• Structured for rich snippets</li>
                    <li>• Enhanced search visibility</li>
                    <li>• Voice search optimization</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Technical SEO Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Breadcrumb Navigation</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Hierarchical navigation structure</li>
                    <li>• Breadcrumb structured data</li>
                    <li>• Improved user experience</li>
                    <li>• Search engine understanding</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Sitemap & Robots</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Dynamic XML sitemap generation</li>
                    <li>• Robots.txt configuration</li>
                    <li>• Crawl optimization</li>
                    <li>• Content discovery enhancement</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div key={index}>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO Testing Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Validation Tools</h3>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <a 
                        href="https://search.google.com/test/rich-results" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Google Rich Results Test
                      </a>
                    </li>
                    <li>
                      <a 
                        href="https://developers.facebook.com/tools/debug/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Facebook Sharing Debugger
                      </a>
                    </li>
                    <li>
                      <a 
                        href="https://cards-dev.twitter.com/validator" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Twitter Card Validator
                      </a>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Analysis Tools</h3>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <a 
                        href="https://pagespeed.web.dev/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        PageSpeed Insights
                      </a>
                    </li>
                    <li>
                      <a 
                        href="https://search.google.com/search-console" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Google Search Console
                      </a>
                    </li>
                    <li>
                      <a 
                        href="https://validator.schema.org/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Schema.org Validator
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}