import { ScrapedPage, ScrapedSection } from './scraper';
import { PageContent, ContentSection, SectionStyling } from './types';

export class ContentTransformer {
  
  transformScrapedPage(scrapedPage: ScrapedPage): PageContent {
    const slug = this.extractSlugFromUrl(scrapedPage.url);
    
    return {
      slug,
      title: scrapedPage.title,
      description: scrapedPage.description,
      seoTitle: scrapedPage.metadata.ogTitle || scrapedPage.title,
      seoDescription: scrapedPage.metadata.ogDescription || scrapedPage.description,
      openGraphImage: scrapedPage.metadata.ogImage,
      sections: scrapedPage.sections.map(section => this.transformSection(section))
    };
  }

  private extractSlugFromUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      
      if (pathname === '/' || pathname === '') {
        return 'home';
      }
      
      return pathname.replace(/^\/|\/$/g, '').replace(/\//g, '-') || 'page';
    } catch {
      return 'page';
    }
  }

  private transformSection(scrapedSection: ScrapedSection): ContentSection {
    const sectionType = this.mapSectionType(scrapedSection.type);
    
    return {
      id: scrapedSection.id,
      type: sectionType,
      data: this.extractSectionData(scrapedSection),
      styling: this.transformStyling(scrapedSection)
    };
  }

  private mapSectionType(scrapedType: string): ContentSection['type'] {
    switch (scrapedType) {
      case 'hero':
      case 'banner':
        return 'hero';
      case 'gallery':
      case 'image':
        return 'gallery';
      case 'contact':
      case 'form':
        return 'contact';
      case 'content':
      case 'about':
      case 'features':
      case 'testimonial':
        return 'content';
      default:
        return 'custom';
    }
  }

  private extractSectionData(scrapedSection: ScrapedSection): Record<string, unknown> {
    const data: Record<string, unknown> = {
      html: scrapedSection.html,
      text: scrapedSection.text,
      originalClasses: scrapedSection.classes
    };

    // Extract specific data based on section type
    switch (scrapedSection.type) {
      case 'hero':
        data.hero = this.extractHeroData(scrapedSection);
        break;
      case 'contact':
        data.form = this.extractFormData(scrapedSection);
        break;
      case 'gallery':
        data.images = this.extractImageData(scrapedSection);
        break;
      default:
        data.content = this.extractContentData(scrapedSection);
    }

    return data;
  }

  private extractHeroData(section: ScrapedSection): Record<string, unknown> {
    // Try to extract hero-specific elements
    const heroData: Record<string, unknown> = {};
    
    // Look for headings
    const headingMatch = section.html.match(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/i);
    if (headingMatch) {
      heroData.title = headingMatch[1].replace(/<[^>]*>/g, '').trim();
    }
    
    // Look for paragraphs or descriptions
    const paragraphMatch = section.html.match(/<p[^>]*>(.*?)<\/p>/i);
    if (paragraphMatch) {
      heroData.description = paragraphMatch[1].replace(/<[^>]*>/g, '').trim();
    }
    
    // Look for buttons/CTAs
    const buttonMatches = section.html.match(/<a[^>]*class="[^"]*btn[^"]*"[^>]*>(.*?)<\/a>/gi);
    if (buttonMatches) {
      heroData.buttons = buttonMatches.map(match => {
        const textMatch = match.match(/>(.*?)<\/a>/);
        const hrefMatch = match.match(/href="([^"]*)"/);
        return {
          text: textMatch ? textMatch[1].replace(/<[^>]*>/g, '').trim() : '',
          href: hrefMatch ? hrefMatch[1] : '#'
        };
      });
    }
    
    return heroData;
  }

  private extractFormData(section: ScrapedSection): Record<string, unknown> {
    const formData: Record<string, unknown> = {};
    
    // Extract form fields
    const inputMatches = section.html.match(/<input[^>]*>/gi) || [];
    const textareaMatches = section.html.match(/<textarea[^>]*>.*?<\/textarea>/gi) || [];
    
    const fields: Array<{
      type: string;
      name: string;
      placeholder: string;
    }> = [];
    
    inputMatches.forEach(input => {
      const typeMatch = input.match(/type="([^"]*)"/);
      const nameMatch = input.match(/name="([^"]*)"/);
      const placeholderMatch = input.match(/placeholder="([^"]*)"/);
      
      if (nameMatch) {
        fields.push({
          type: typeMatch ? typeMatch[1] : 'text',
          name: nameMatch[1],
          placeholder: placeholderMatch ? placeholderMatch[1] : ''
        });
      }
    });
    
    textareaMatches.forEach(textarea => {
      const nameMatch = textarea.match(/name="([^"]*)"/);
      const placeholderMatch = textarea.match(/placeholder="([^"]*)"/);
      
      if (nameMatch) {
        fields.push({
          type: 'textarea',
          name: nameMatch[1],
          placeholder: placeholderMatch ? placeholderMatch[1] : ''
        });
      }
    });
    
    formData.fields = fields;
    return formData;
  }

  private extractImageData(section: ScrapedSection): Record<string, unknown> {
    const imageData: Record<string, unknown> = {};
    
    const imageMatches = section.html.match(/<img[^>]*>/gi) || [];
    const images = imageMatches.map(img => {
      const srcMatch = img.match(/src="([^"]*)"/);
      const altMatch = img.match(/alt="([^"]*)"/);
      
      return {
        src: srcMatch ? srcMatch[1] : '',
        alt: altMatch ? altMatch[1] : ''
      };
    });
    
    imageData.images = images;
    return imageData;
  }

  private extractContentData(section: ScrapedSection): Record<string, unknown> {
    return {
      html: section.html,
      text: section.text,
      hasChildren: section.children.length > 0,
      children: section.children.map(child => this.transformSection(child))
    };
  }

  private transformStyling(scrapedSection: ScrapedSection): SectionStyling {
    const styling: SectionStyling = {
      customClasses: scrapedSection.classes
    };

    // Extract common CSS properties
    if (scrapedSection.styles.backgroundColor) {
      styling.backgroundColor = scrapedSection.styles.backgroundColor;
    }
    
    if (scrapedSection.styles.color) {
      styling.textColor = scrapedSection.styles.color;
    }
    
    if (scrapedSection.styles.padding) {
      styling.padding = scrapedSection.styles.padding;
    }
    
    if (scrapedSection.styles.margin) {
      styling.margin = scrapedSection.styles.margin;
    }

    return styling;
  }

  transformAllPages(scrapedPages: ScrapedPage[]): PageContent[] {
    return scrapedPages.map(page => this.transformScrapedPage(page));
  }

  generateSiteMap(pages: PageContent[]): Record<string, unknown> {
    return {
      pages: pages.map(page => ({
        slug: page.slug,
        title: page.title,
        description: page.description,
        sections: page.sections.length
      })),
      navigation: this.extractNavigation(pages),
      totalPages: pages.length,
      generatedAt: new Date().toISOString()
    };
  }

  private extractNavigation(pages: PageContent[]): Array<{ label: string; href: string }> {
    // Create navigation based on pages
    return pages
      .filter(page => page.slug !== 'home') // Exclude home page
      .map(page => ({
        label: page.title,
        href: page.slug === 'home' ? '/' : `/${page.slug}`
      }))
      .slice(0, 6); // Limit to 6 nav items
  }
}