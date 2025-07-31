import { ContentSection } from './types';
import HeroSection from '@/components/sections/hero-section';
import ContentSectionWrapper from '@/components/sections/content-section';
import FeaturesGrid from '@/components/sections/features-grid';
import CompanyLogos from '@/components/sections/company-logos';
import CTASection from '@/components/sections/cta-section';

interface ContentRendererProps {
  sections: ContentSection[];
}

export default function ContentRenderer({ sections }: ContentRendererProps) {
  return (
    <>
      {sections.map((section, index) => {
        switch (section.type) {
          case 'hero':
            return (
              <HeroRenderer 
                key={section.id} 
                section={section} 
                index={index}
              />
            );
          
          case 'content':
            return (
              <ContentSectionRenderer 
                key={section.id} 
                section={section} 
                index={index}
              />
            );
          
          case 'gallery':
            return (
              <GalleryRenderer 
                key={section.id} 
                section={section} 
                index={index}
              />
            );
          
          case 'contact':
            return (
              <ContactRenderer 
                key={section.id} 
                section={section} 
                index={index}
              />
            );
          
          case 'custom':
          default:
            return (
              <CustomRenderer 
                key={section.id} 
                section={section} 
                index={index}
              />
            );
        }
      })}
    </>
  );
}

function HeroRenderer({ section, index }: { section: ContentSection; index: number }) {
  const heroData = section.data.hero as {
    title?: string;
    description?: string;
    buttons?: Array<{ text: string; href: string }>;
  };

  const title = heroData?.title || extractTextFromHtml(section.data.html as string, 'h1') || 'Welcome';
  const description = heroData?.description || extractTextFromHtml(section.data.html as string, 'p') || '';
  
  const primaryButton = heroData?.buttons?.[0];

  return (
    <HeroSection
      title={title}
      description={description}
      ctaText={primaryButton?.text || 'Get Started'}
      ctaHref={primaryButton?.href || '/demo'}
      imageSrc={extractImageFromHtml(section.data.html as string)}
      badges={extractBadgesFromHtml(section.data.html as string)}
    />
  );
}

function ContentSectionRenderer({ section, index }: { section: ContentSection; index: number }) {
  const backgroundColor = index % 2 === 0 ? 'white' : 'gray';
  
  return (
    <ContentSectionWrapper backgroundColor={backgroundColor} padding="lg">
      <div 
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: section.data.html as string }}
      />
    </ContentSectionWrapper>
  );
}

function GalleryRenderer({ section }: { section: ContentSection; index: number }) {
  const images = section.data.images as Array<{ src: string; alt: string }> || [];
  
  if (images.length === 0) {
    return <ContentSectionRenderer section={section} index={0} />;
  }

  const features = images.map(img => ({
    title: img.alt || 'Feature',
    description: 'Feature description',
    image: img.src
  }));

  return (
    <ContentSectionWrapper backgroundColor="white" padding="xl">
      <FeaturesGrid
        title="Gallery"
        features={features}
        columns={3}
      />
    </ContentSectionWrapper>
  );
}

function ContactRenderer({ section }: { section: ContentSection; index: number }) {
  return (
    <CTASection
      title="Get in Touch"
      description="Ready to get started? Contact us today."
      primaryCTA={{
        text: "Contact Us",
        href: "/contact"
      }}
      secondaryCTA={{
        text: "Learn More",
        href: "/about"
      }}
      backgroundColor="gray"
    />
  );
}

function CustomRenderer({ section, index }: { section: ContentSection; index: number }) {
  // Check if this looks like a company logos section
  if (hasMultipleImages(section.data.html as string)) {
    const logos = extractLogosFromHtml(section.data.html as string);
    if (logos.length > 3) {
      return (
        <ContentSectionWrapper backgroundColor="gray" padding="md">
          <CompanyLogos
            title="Trusted by leading companies"
            logos={logos}
          />
        </ContentSectionWrapper>
      );
    }
  }

  // Check if this looks like a CTA section
  if (hasCallToAction(section.data.html as string)) {
    const ctaData = extractCTAFromHtml(section.data.html as string);
    return (
      <CTASection
        title={ctaData.title}
        description={ctaData.description}
        primaryCTA={ctaData.primaryCTA}
        secondaryCTA={ctaData.secondaryCTA}
        backgroundColor="orange"
      />
    );
  }

  // Default to content renderer
  return <ContentSectionRenderer section={section} index={index} />;
}

// Helper functions for extracting data from HTML
function extractTextFromHtml(html: string, tag: string): string {
  const regex = new RegExp(`<${tag}[^>]*>(.*?)<\/${tag}>`, 'i');
  const match = html.match(regex);
  return match ? match[1].replace(/<[^>]*>/g, '').trim() : '';
}

function extractImageFromHtml(html: string): string | undefined {
  const imgRegex = /<img[^>]+src="([^">]+)"/i;
  const match = html.match(imgRegex);
  return match ? match[1] : undefined;
}

function extractBadgesFromHtml(html: string): Array<{ src: string; alt: string; text?: string }> {
  const badges: Array<{ src: string; alt: string; text?: string }> = [];
  const imgRegex = /<img[^>]+src="([^">]+)"[^>]*alt="([^">]*)"[^>]*>/gi;
  let match;
  
  while ((match = imgRegex.exec(html)) !== null) {
    if (match[1].includes('badge') || match[1].includes('logo')) {
      badges.push({
        src: match[1],
        alt: match[2],
        text: extractAdjacentText(html, match[0])
      });
    }
  }
  
  return badges.slice(0, 3); // Limit to 3 badges
}

function extractLogosFromHtml(html: string): Array<{ src: string; alt: string }> {
  const logos: Array<{ src: string; alt: string }> = [];
  const imgRegex = /<img[^>]+src="([^">]+)"[^>]*alt="([^">]*)"[^>]*>/gi;
  let match;
  
  while ((match = imgRegex.exec(html)) !== null) {
    logos.push({
      src: match[1],
      alt: match[2] || 'Company Logo'
    });
  }
  
  return logos;
}

function extractAdjacentText(html: string, imgTag: string): string | undefined {
  const imgIndex = html.indexOf(imgTag);
  if (imgIndex === -1) return undefined;
  
  const afterImg = html.substring(imgIndex + imgTag.length, imgIndex + imgTag.length + 100);
  const textMatch = afterImg.match(/>([^<]+)</);
  return textMatch ? textMatch[1].trim() : undefined;
}

function hasMultipleImages(html: string): boolean {
  const imgMatches = html.match(/<img[^>]*>/gi);
  return imgMatches ? imgMatches.length > 2 : false;
}

function hasCallToAction(html: string): boolean {
  const ctaKeywords = ['get started', 'sign up', 'contact', 'learn more', 'try now', 'book demo'];
  const lowerHtml = html.toLowerCase();
  return ctaKeywords.some(keyword => lowerHtml.includes(keyword));
}

function extractCTAFromHtml(html: string): {
  title: string;
  description: string;
  primaryCTA: { text: string; href: string };
  secondaryCTA?: { text: string; href: string };
} {
  const title = extractTextFromHtml(html, 'h2') || extractTextFromHtml(html, 'h1') || 'Ready to get started?';
  const description = extractTextFromHtml(html, 'p') || '';
  
  const linkRegex = /<a[^>]+href="([^">]+)"[^>]*>([^<]+)<\/a>/gi;
  const links: Array<{ href: string; text: string }> = [];
  let match;
  
  while ((match = linkRegex.exec(html)) !== null) {
    links.push({ href: match[1], text: match[2].trim() });
  }
  
  return {
    title,
    description,
    primaryCTA: links[0] || { text: 'Get Started', href: '/demo' },
    secondaryCTA: links[1]
  };
}