import { Metadata } from 'next';
import { ContentLoader } from './content-loader';
import { PageContent } from './types';
import MainLayout from '@/components/layout/main-layout';
import ContentRenderer from './content-renderer';

export async function generatePageMetadata(slug: string): Promise<Metadata> {
  const page = await ContentLoader.getStaticPage(slug);
  
  if (!page) {
    return {
      title: 'Page Not Found - Numeral',
      description: 'The requested page could not be found.',
    };
  }

  return {
    title: page.seoTitle || page.title,
    description: page.seoDescription || page.description,
    openGraph: {
      title: page.seoTitle || page.title,
      description: page.seoDescription || page.description,
      images: page.openGraphImage ? [page.openGraphImage] : undefined,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: page.seoTitle || page.title,
      description: page.seoDescription || page.description,
      images: page.openGraphImage ? [page.openGraphImage] : undefined,
    },
  };
}

interface DynamicPageProps {
  page: PageContent;
}

export function DynamicPage({ page }: DynamicPageProps) {
  return (
    <MainLayout>
      <ContentRenderer sections={page.sections} />
    </MainLayout>
  );
}

export async function generateStaticParams() {
  const contentLoader = new ContentLoader();
  const slugs = await contentLoader.getPageSlugs();
  
  return slugs
    .filter(slug => slug !== 'home') // Home page is handled by index
    .map(slug => ({ slug }));
}

// Utility function to get page data for static generation
export async function getPageData(slug: string): Promise<PageContent | null> {
  return ContentLoader.getStaticPage(slug);
}

// Utility function to get all pages for sitemap generation
export async function getAllPages(): Promise<PageContent[]> {
  return ContentLoader.getAllStaticPages();
}

// Category-specific page generators
export async function getBlogPosts(): Promise<PageContent[]> {
  const contentLoader = new ContentLoader();
  return contentLoader.getPagesByCategory('blog');
}

export async function getProductPages(): Promise<PageContent[]> {
  const contentLoader = new ContentLoader();
  return contentLoader.getPagesByCategory('product');
}

export async function getCustomerStories(): Promise<PageContent[]> {
  const contentLoader = new ContentLoader();
  return contentLoader.getPagesByCategory('customer');
}

export async function getSolutionPages(): Promise<PageContent[]> {
  const contentLoader = new ContentLoader();
  return contentLoader.getPagesByCategory('solution');
}

// Generate category index pages
export async function generateCategoryIndex(category: string) {
  const contentLoader = new ContentLoader();
  const categoryIndex = await contentLoader.getCategoryIndex(category);
  const pages = await contentLoader.getPagesByCategory(category);
  
  return {
    categoryIndex,
    pages
  };
}