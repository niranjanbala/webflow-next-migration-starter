import { Metadata } from 'next';

export interface SEOData {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
  noIndex?: boolean;
  noFollow?: boolean;
}

export interface StructuredData {
  '@context': string;
  '@type': string;
  [key: string]: unknown;
}

const DEFAULT_SEO = {
  title: 'Numeral - Sales Tax Automation Platform',
  description: 'Automate your sales tax compliance with Numeral\'s comprehensive platform. Handle calculations, filing, and remittance across all jurisdictions.',
  keywords: ['sales tax', 'tax automation', 'compliance', 'tax software', 'business tax'],
  image: '/images/og-default.jpg',
  type: 'website' as const,
  url: 'https://numeralhq.com'
};

export function generateMetadata(seoData: SEOData = {}): Metadata {
  const {
    title = DEFAULT_SEO.title,
    description = DEFAULT_SEO.description,
    keywords = DEFAULT_SEO.keywords,
    image = DEFAULT_SEO.image,
    url = DEFAULT_SEO.url,
    type = DEFAULT_SEO.type,
    publishedTime,
    modifiedTime,
    author,
    noIndex = false,
    noFollow = false
  } = seoData;

  const fullTitle = title === DEFAULT_SEO.title ? title : `${title} | Numeral`;
  const fullUrl = url.startsWith('http') ? url : `https://numeralhq.com${url}`;
  const fullImageUrl = image ? (image.startsWith('http') ? image : `https://numeralhq.com${image}`) : undefined;

  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords: keywords.join(', '),
    authors: author ? [{ name: author }] : undefined,
    openGraph: {
      title: fullTitle,
      description,
      url: fullUrl,
      siteName: 'Numeral',
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: title
        }
      ],
      type,
      publishedTime,
      modifiedTime
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [fullImageUrl],
      creator: '@numeralhq'
    },
    robots: {
      index: !noIndex,
      follow: !noFollow,
      googleBot: {
        index: !noIndex,
        follow: !noFollow,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    },
    alternates: {
      canonical: fullUrl
    }
  };

  return metadata;
}

export function generateOrganizationStructuredData(): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Numeral',
    url: 'https://numeralhq.com',
    logo: 'https://numeralhq.com/images/logo.png',
    description: 'Sales tax automation platform for businesses',
    foundingDate: '2020',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-555-0123',
      contactType: 'customer service',
      availableLanguage: 'English'
    },
    sameAs: [
      'https://twitter.com/numeralhq',
      'https://linkedin.com/company/numeralhq'
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'US',
      addressRegion: 'CA',
      addressLocality: 'San Francisco'
    }
  };
}

export function generateWebsiteStructuredData(): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Numeral',
    url: 'https://numeralhq.com',
    description: 'Sales tax automation platform for businesses',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://numeralhq.com/search?q={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    }
  };
}

export function generateArticleStructuredData(article: {
  title: string;
  description: string;
  author: string;
  publishedTime: string;
  modifiedTime?: string;
  image: string;
  url: string;
  section?: string;
  tags?: string[];
}): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.image.startsWith('http') ? article.image : `https://numeralhq.com${article.image}`,
    url: article.url.startsWith('http') ? article.url : `https://numeralhq.com${article.url}`,
    datePublished: article.publishedTime,
    dateModified: article.modifiedTime || article.publishedTime,
    author: {
      '@type': 'Person',
      name: article.author
    },
    publisher: {
      '@type': 'Organization',
      name: 'Numeral',
      logo: {
        '@type': 'ImageObject',
        url: 'https://numeralhq.com/images/logo.png'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': article.url.startsWith('http') ? article.url : `https://numeralhq.com${article.url}`
    },
    articleSection: article.section,
    keywords: article.tags?.join(', ')
  };
}

export function generateProductStructuredData(product: {
  name: string;
  description: string;
  image: string;
  url: string;
  price?: number;
  currency?: string;
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
  brand?: string;
  category?: string;
}): StructuredData {
  const structuredData: StructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image.startsWith('http') ? product.image : `https://numeralhq.com${product.image}`,
    url: product.url.startsWith('http') ? product.url : `https://numeralhq.com${product.url}`,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'Numeral'
    },
    category: product.category
  };

  if (product.price && product.currency) {
    structuredData.offers = {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency,
      availability: `https://schema.org/${product.availability || 'InStock'}`,
      seller: {
        '@type': 'Organization',
        name: 'Numeral'
      }
    };
  }

  return structuredData;
}

export function generateBreadcrumbStructuredData(breadcrumbs: Array<{
  name: string;
  url: string;
}>): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url.startsWith('http') ? crumb.url : `https://numeralhq.com${crumb.url}`
    }))
  };
}

export function generateFAQStructuredData(faqs: Array<{
  question: string;
  answer: string;
}>): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}