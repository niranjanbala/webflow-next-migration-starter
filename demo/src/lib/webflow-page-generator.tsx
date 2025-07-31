import { Metadata } from 'next';
import { WebflowItem, WebflowCollection, PageContent, ContentSection } from './types';
import { WebflowClient } from './webflow-client';
import { ContentRenderer } from './content-renderer';
import { generateMetadata } from './seo';

export interface WebflowPageTemplate {
  type: 'static' | 'collection' | 'category' | 'blog' | 'product' | 'custom';
  name: string;
  slug: string;
  collectionId?: string;
  template: PageTemplateConfig;
}

export interface PageTemplateConfig {
  layout: 'default' | 'blog' | 'product' | 'landing' | 'minimal';
  sections: SectionTemplate[];
  seo: SEOTemplate;
  navigation?: NavigationConfig;
}

export interface SectionTemplate {
  type: 'hero' | 'content' | 'gallery' | 'features' | 'testimonials' | 'cta' | 'custom';
  mapping: FieldMapping;
  styling?: SectionStyling;
  conditions?: RenderCondition[];
}

export interface FieldMapping {
  [key: string]: string | FieldTransform;
}

export interface FieldTransform {
  field: string;
  transform?: 'html' | 'markdown' | 'image' | 'date' | 'rich-text' | 'plain-text';
  fallback?: string;
  conditions?: Array<{
    field: string;
    operator: 'equals' | 'contains' | 'exists' | 'not-empty';
    value?: string;
  }>;
}

export interface RenderCondition {
  field: string;
  operator: 'equals' | 'contains' | 'exists' | 'not-empty' | 'greater-than' | 'less-than';
  value?: string | number;
}

export interface SEOTemplate {
  title: FieldMapping;
  description: FieldMapping;
  openGraph?: FieldMapping;
  canonical?: string;
  noindex?: boolean;
}

export interface NavigationConfig {
  breadcrumbs?: boolean;
  sidebar?: boolean;
  pagination?: boolean;
}

export interface SectionStyling {
  backgroundColor?: string;
  textColor?: string;
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  margin?: 'sm' | 'md' | 'lg' | 'xl';
  containerWidth?: 'full' | 'container' | 'narrow';
  customClasses?: string[];
}

export class WebflowPageGenerator {
  private webflowClient: WebflowClient;
  private templates: Map<string, WebflowPageTemplate> = new Map();

  constructor() {
    this.webflowClient = new WebflowClient();
    this.initializeDefaultTemplates();
  }

  /**
   * Initialize default page templates for common Webflow page types
   */
  private initializeDefaultTemplates() {
    // Blog post template
    this.registerTemplate({
      type: 'blog',
      name: 'Blog Post',
      slug: 'blog-post',
      collectionId: 'blog-posts',
      template: {
        layout: 'blog',
        sections: [
          {
            type: 'hero',
            mapping: {
              title: 'name',
              description: { field: 'summary', transform: 'plain-text', fallback: '' },
              image: { field: 'featured-image', transform: 'image' },
              publishDate: { field: 'created-on', transform: 'date' },
              author: 'author-name',
              category: 'category'
            },
            styling: {
              backgroundColor: 'white',
              padding: 'lg'
            }
          },
          {
            type: 'content',
            mapping: {
              content: { field: 'post-body', transform: 'rich-text' }
            },
            styling: {
              backgroundColor: 'white',
              padding: 'xl',
              containerWidth: 'narrow'
            }
          },
          {
            type: 'cta',
            mapping: {
              title: 'Subscribe to our newsletter',
              description: 'Get the latest updates and insights delivered to your inbox.',
              primaryButton: {
                text: 'Subscribe',
                href: '/newsletter'
              }
            },
            styling: {
              backgroundColor: 'gray',
              padding: 'lg'
            },
            conditions: [
              {
                field: 'show-newsletter-cta',
                operator: 'equals',
                value: 'true'
              }
            ]
          }
        ],
        seo: {
          title: { 
            field: 'seo-title',
            fallback: { field: 'name', transform: 'plain-text' }
          },
          description: {
            field: 'seo-description',
            fallback: { field: 'summary', transform: 'plain-text' }
          },
          openGraph: {
            image: { field: 'featured-image', transform: 'image' },
            type: 'article'
          }
        },
        navigation: {
          breadcrumbs: true,
          pagination: true
        }
      }
    });

    // Product page template
    this.registerTemplate({
      type: 'product',
      name: 'Product Page',
      slug: 'product-page',
      collectionId: 'products',
      template: {
        layout: 'product',
        sections: [
          {
            type: 'hero',
            mapping: {
              title: 'name',
              description: { field: 'description', transform: 'plain-text' },
              image: { field: 'hero-image', transform: 'image' },
              price: 'price',
              features: { field: 'key-features', transform: 'html' }
            },
            styling: {
              backgroundColor: 'white',
              padding: 'xl'
            }
          },
          {
            type: 'features',
            mapping: {
              title: 'Features & Benefits',
              features: { field: 'features-list', transform: 'html' }
            },
            styling: {
              backgroundColor: 'gray',
              padding: 'xl'
            }
          },
          {
            type: 'testimonials',
            mapping: {
              title: 'What our customers say',
              testimonials: { field: 'testimonials', transform: 'html' }
            },
            styling: {
              backgroundColor: 'white',
              padding: 'xl'
            },
            conditions: [
              {
                field: 'testimonials',
                operator: 'not-empty'
              }
            ]
          },
          {
            type: 'cta',
            mapping: {
              title: 'Ready to get started?',
              description: { field: 'cta-description', fallback: 'Start your free trial today.' },
              primaryButton: {
                text: 'Start Free Trial',
                href: '/signup'
              },
              secondaryButton: {
                text: 'Schedule Demo',
                href: '/demo'
              }
            },
            styling: {
              backgroundColor: 'blue',
              padding: 'xl'
            }
          }
        ],
        seo: {
          title: {
            field: 'seo-title',
            fallback: { field: 'name', transform: 'plain-text' }
          },
          description: {
            field: 'seo-description',
            fallback: { field: 'description', transform: 'plain-text' }
          },
          openGraph: {
            image: { field: 'hero-image', transform: 'image' },
            type: 'product'
          }
        },
        navigation: {
          breadcrumbs: true
        }
      }
    });

    // Landing page template
    this.registerTemplate({
      type: 'static',
      name: 'Landing Page',
      slug: 'landing-page',
      template: {
        layout: 'landing',
        sections: [
          {
            type: 'hero',
            mapping: {
              title: 'hero-title',
              description: 'hero-description',
              image: { field: 'hero-image', transform: 'image' },
              primaryButton: {
                text: { field: 'hero-cta-text', fallback: 'Get Started' },
                href: { field: 'hero-cta-link', fallback: '/signup' }
              }
            },
            styling: {
              backgroundColor: 'gradient',
              padding: 'xl'
            }
          },
          {
            type: 'features',
            mapping: {
              title: 'features-title',
              description: 'features-description',
              features: { field: 'features-list', transform: 'html' }
            },
            styling: {
              backgroundColor: 'white',
              padding: 'xl'
            }
          },
          {
            type: 'testimonials',
            mapping: {
              title: 'testimonials-title',
              testimonials: { field: 'testimonials-list', transform: 'html' }
            },
            styling: {
              backgroundColor: 'gray',
              padding: 'xl'
            },
            conditions: [
              {
                field: 'show-testimonials',
                operator: 'equals',
                value: 'true'
              }
            ]
          },
          {
            type: 'cta',
            mapping: {
              title: 'final-cta-title',
              description: 'final-cta-description',
              primaryButton: {
                text: { field: 'final-cta-text', fallback: 'Get Started' },
                href: { field: 'final-cta-link', fallback: '/signup' }
              }
            },
            styling: {
              backgroundColor: 'blue',
              padding: 'xl'
            }
          }
        ],
        seo: {
          title: {
            field: 'seo-title',
            fallback: { field: 'page-title', transform: 'plain-text' }
          },
          description: {
            field: 'seo-description',
            fallback: { field: 'page-description', transform: 'plain-text' }
          },
          openGraph: {
            image: { field: 'og-image', transform: 'image' },
            type: 'website'
          }
        }
      }
    });
  }

  /**
   * Register a new page template
   */
  registerTemplate(template: WebflowPageTemplate) {
    this.templates.set(template.slug, template);
  }

  /**
   * Generate a page from Webflow data using a template
   */
  async generatePage(
    templateSlug: string, 
    itemId?: string, 
    collectionSlug?: string
  ): Promise<{ content: PageContent; metadata: Metadata } | null> {
    const template = this.templates.get(templateSlug);
    if (!template) {
      throw new Error(`Template not found: ${templateSlug}`);
    }

    let webflowData: WebflowItem | null = null;

    // Fetch data based on template type
    if (template.type === 'collection' && itemId && template.collectionId) {
      webflowData = await this.webflowClient.getCollectionItem(template.collectionId, itemId);
    } else if (template.type === 'static' && itemId) {
      webflowData = await this.webflowClient.getPage(itemId);
    } else if (collectionSlug && itemId) {
      const collection = await this.webflowClient.getCollectionBySlug(collectionSlug);
      if (collection) {
        webflowData = await this.webflowClient.getCollectionItem(collection.id, itemId);
      }
    }

    if (!webflowData) {
      return null;
    }

    // Generate page content
    const pageContent = await this.generatePageContent(template, webflowData);
    const metadata = await this.generatePageMetadata(template, webflowData);

    return {
      content: pageContent,
      metadata
    };
  }

  /**
   * Generate page content from template and Webflow data
   */
  private async generatePageContent(
    template: WebflowPageTemplate, 
    data: WebflowItem
  ): Promise<PageContent> {
    const sections: ContentSection[] = [];

    for (const sectionTemplate of template.template.sections) {
      // Check render conditions
      if (sectionTemplate.conditions && !this.evaluateConditions(sectionTemplate.conditions, data)) {
        continue;
      }

      const sectionData = this.mapFields(sectionTemplate.mapping, data);
      
      sections.push({
        id: `section-${sections.length}`,
        type: sectionTemplate.type,
        data: sectionData,
        styling: sectionTemplate.styling
      });
    }

    return {
      slug: data.slug || data.id,
      title: this.extractFieldValue('name', data) || 'Untitled',
      description: this.extractFieldValue('description', data) || '',
      sections
    };
  }

  /**
   * Generate page metadata from template and Webflow data
   */
  private async generatePageMetadata(
    template: WebflowPageTemplate, 
    data: WebflowItem
  ): Promise<Metadata> {
    const seoTemplate = template.template.seo;
    
    const title = this.mapFieldValue(seoTemplate.title, data) || 'Untitled';
    const description = this.mapFieldValue(seoTemplate.description, data) || '';
    
    let openGraphImage: string | undefined;
    if (seoTemplate.openGraph?.image) {
      openGraphImage = this.mapFieldValue(seoTemplate.openGraph.image, data);
    }

    return generateMetadata({
      title,
      description,
      url: `/${data.slug || data.id}`,
      type: 'website',
      image: openGraphImage
    });
  }

  /**
   * Map template fields to actual data values
   */
  private mapFields(mapping: FieldMapping, data: WebflowItem): Record<string, unknown> {
    const result: Record<string, unknown> = {};

    for (const [key, fieldConfig] of Object.entries(mapping)) {
      result[key] = this.mapFieldValue(fieldConfig, data);
    }

    return result;
  }

  /**
   * Map a single field value with transformations
   */
  private mapFieldValue(fieldConfig: string | FieldTransform, data: WebflowItem): unknown {
    if (typeof fieldConfig === 'string') {
      return this.extractFieldValue(fieldConfig, data);
    }

    const { field, transform, fallback, conditions } = fieldConfig;

    // Check conditions if specified
    if (conditions && !this.evaluateFieldConditions(conditions, data)) {
      return fallback || null;
    }

    let value = this.extractFieldValue(field, data);

    // Apply fallback if value is empty
    if (!value && fallback) {
      if (typeof fallback === 'string') {
        value = fallback;
      } else {
        value = this.mapFieldValue(fallback, data);
      }
    }

    // Apply transformations
    if (value && transform) {
      value = this.transformValue(value, transform);
    }

    return value;
  }

  /**
   * Extract field value from Webflow data
   */
  private extractFieldValue(fieldPath: string, data: WebflowItem): unknown {
    const keys = fieldPath.split('.');
    let value: unknown = data;

    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = (value as Record<string, unknown>)[key];
      } else {
        return null;
      }
    }

    return value;
  }

  /**
   * Transform field values based on type
   */
  private transformValue(value: unknown, transform: string): unknown {
    if (!value) return value;

    switch (transform) {
      case 'html':
        return typeof value === 'string' ? value : String(value);
      
      case 'markdown':
        // Convert HTML to markdown if needed
        return typeof value === 'string' ? value.replace(/<[^>]*>/g, '') : String(value);
      
      case 'plain-text':
        return typeof value === 'string' ? value.replace(/<[^>]*>/g, '').trim() : String(value);
      
      case 'image':
        if (typeof value === 'object' && value && 'url' in value) {
          return (value as { url: string }).url;
        }
        return typeof value === 'string' ? value : null;
      
      case 'date':
        if (typeof value === 'string' || typeof value === 'number') {
          const date = new Date(value);
          return date.toISOString();
        }
        return value;
      
      case 'rich-text':
        // Handle Webflow rich text format
        if (typeof value === 'object' && value && 'html' in value) {
          return (value as { html: string }).html;
        }
        return typeof value === 'string' ? value : String(value);
      
      default:
        return value;
    }
  }

  /**
   * Evaluate render conditions
   */
  private evaluateConditions(conditions: RenderCondition[], data: WebflowItem): boolean {
    return conditions.every(condition => this.evaluateCondition(condition, data));
  }

  /**
   * Evaluate field conditions
   */
  private evaluateFieldConditions(
    conditions: Array<{
      field: string;
      operator: 'equals' | 'contains' | 'exists' | 'not-empty';
      value?: string;
    }>, 
    data: WebflowItem
  ): boolean {
    return conditions.every(condition => {
      const fieldValue = this.extractFieldValue(condition.field, data);
      
      switch (condition.operator) {
        case 'equals':
          return fieldValue === condition.value;
        case 'contains':
          return typeof fieldValue === 'string' && condition.value 
            ? fieldValue.includes(condition.value) 
            : false;
        case 'exists':
          return fieldValue !== null && fieldValue !== undefined;
        case 'not-empty':
          return fieldValue !== null && fieldValue !== undefined && fieldValue !== '';
        default:
          return false;
      }
    });
  }

  /**
   * Evaluate a single render condition
   */
  private evaluateCondition(condition: RenderCondition, data: WebflowItem): boolean {
    const fieldValue = this.extractFieldValue(condition.field, data);
    
    switch (condition.operator) {
      case 'equals':
        return fieldValue === condition.value;
      case 'contains':
        return typeof fieldValue === 'string' && condition.value 
          ? fieldValue.includes(String(condition.value)) 
          : false;
      case 'exists':
        return fieldValue !== null && fieldValue !== undefined;
      case 'not-empty':
        return fieldValue !== null && fieldValue !== undefined && fieldValue !== '';
      case 'greater-than':
        return typeof fieldValue === 'number' && typeof condition.value === 'number' 
          ? fieldValue > condition.value 
          : false;
      case 'less-than':
        return typeof fieldValue === 'number' && typeof condition.value === 'number' 
          ? fieldValue < condition.value 
          : false;
      default:
        return false;
    }
  }

  /**
   * Generate static paths for all collection items
   */
  async generateStaticPaths(templateSlug: string): Promise<Array<{ params: Record<string, string> }>> {
    const template = this.templates.get(templateSlug);
    if (!template || !template.collectionId) {
      return [];
    }

    const items = await this.webflowClient.getCollectionItems(template.collectionId);
    
    return items.map(item => ({
      params: {
        slug: item.slug || item.id
      }
    }));
  }

  /**
   * Get all available templates
   */
  getTemplates(): WebflowPageTemplate[] {
    return Array.from(this.templates.values());
  }

  /**
   * Get template by slug
   */
  getTemplate(slug: string): WebflowPageTemplate | undefined {
    return this.templates.get(slug);
  }
}

// Export singleton instance
export const webflowPageGenerator = new WebflowPageGenerator();