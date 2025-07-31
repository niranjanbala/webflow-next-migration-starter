import { notFound } from 'next/navigation';
import { generatePageMetadata, DynamicPage, getPageData, generateStaticParams } from '@/lib/page-generator';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  return generatePageMetadata(slug);
}

export { generateStaticParams };

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const page = await getPageData(slug);

  if (!page) {
    notFound();
  }

  return <DynamicPage page={page} />;
}