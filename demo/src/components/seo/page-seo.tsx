import { Metadata } from 'next';
import StructuredDataComponent from './structured-data';
import { 
  SEOData, 
  generateMetadata,
  generateOrganizationStructuredData,
  generateWebsiteStructuredData,
  generateArticleStructuredData,
  generateProductStructuredData,
  generateBreadcrumbStructuredData,
  generateFAQStructuredData,
  StructuredData
} from '@/lib/seo';

interface PageSEOProps {
  seoData?: SEOData;
  structuredData?: StructuredData[];
  breadcrumbs?: Array<{ name: string; url: string }>;
  faqs?: Array<{ question: string; answer: string }>;
  article?: {
    title: string;
    description: string;
    author: string;
    publishedTime: string;
    modifiedTime?: string;
    image: string;
    url: string;
    section?: string;
    tags?: string[];
  };
  product?: {
    name: string;
    description: string;
    image: string;
    url: string;
    price?: number;
    currency?: string;
    availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
    brand?: string;
    category?: string;
  };
  includeOrganization?: boolean;
  includeWebsite?: boolean;
}

export function generatePageMetadata(props: PageSEOProps): Metadata {
  return generateMetadata(props.seoData);
}

export default function PageSEO({
  structuredData = [],
  breadcrumbs,
  faqs,
  article,
  product,
  includeOrganization = false,
  includeWebsite = false
}: PageSEOProps) {
  const allStructuredData: StructuredData[] = [...structuredData];

  // Add organization structured data
  if (includeOrganization) {
    allStructuredData.push(generateOrganizationStructuredData());
  }

  // Add website structured data
  if (includeWebsite) {
    allStructuredData.push(generateWebsiteStructuredData());
  }

  // Add breadcrumb structured data
  if (breadcrumbs && breadcrumbs.length > 0) {
    allStructuredData.push(generateBreadcrumbStructuredData(breadcrumbs));
  }

  // Add FAQ structured data
  if (faqs && faqs.length > 0) {
    allStructuredData.push(generateFAQStructuredData(faqs));
  }

  // Add article structured data
  if (article) {
    allStructuredData.push(generateArticleStructuredData(article));
  }

  // Add product structured data
  if (product) {
    allStructuredData.push(generateProductStructuredData(product));
  }

  if (allStructuredData.length === 0) {
    return null;
  }

  return <StructuredDataComponent data={allStructuredData} />;
}