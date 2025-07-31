import { ContentValidator } from '../content-validator';
import { PageContent } from '../types';

describe('ContentValidator', () => {
  let validator: ContentValidator;

  beforeEach(() => {
    validator = new ContentValidator();
  });

  describe('validatePage', () => {
    it('should validate a correct page', () => {
      const validPage: PageContent = {
        slug: 'test-page',
        title: 'Test Page',
        description: 'A test page description',
        sections: [
          {
            id: 'section-1',
            type: 'hero',
            data: {
              hero: {
                title: 'Hero Title',
                description: 'Hero description'
              }
            }
          }
        ]
      };

      const result = validator.validatePage(validPage);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect missing required fields', () => {
      const invalidPage: PageContent = {
        slug: '',
        title: '',
        description: '',
        sections: []
      };

      const result = validator.validatePage(invalidPage);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.field === 'slug')).toBe(true);
      expect(result.errors.some(e => e.field === 'title')).toBe(true);
    });

    it('should validate slug format', () => {
      const pageWithInvalidSlug: PageContent = {
        slug: 'Invalid Slug!',
        title: 'Test Page',
        description: 'Test description',
        sections: []
      };

      const result = validator.validatePage(pageWithInvalidSlug);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.field === 'slug' && e.message.includes('lowercase'))).toBe(true);
    });

    it('should warn about long titles and descriptions', () => {
      const pageWithLongContent: PageContent = {
        slug: 'test-page',
        title: 'This is a very long title that exceeds the recommended 60 character limit for SEO purposes',
        description: 'This is a very long description that exceeds the recommended 160 character limit for meta descriptions in search engine results pages and may be truncated by search engines when displayed',
        sections: []
      };

      const result = validator.validatePage(pageWithLongContent);
      expect(result.warnings.some(w => w.field === 'title')).toBe(true);
      expect(result.warnings.some(w => w.field === 'description')).toBe(true);
    });

    it('should validate section structure', () => {
      const pageWithInvalidSection: PageContent = {
        slug: 'test-page',
        title: 'Test Page',
        description: 'Test description',
        sections: [
          {
            id: '',
            type: 'invalid-type' as any,
            data: {}
          }
        ]
      };

      const result = validator.validatePage(pageWithInvalidSection);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.field.includes('sections[0].id'))).toBe(true);
      expect(result.errors.some(e => e.field.includes('sections[0].type'))).toBe(true);
    });

    it('should validate hero section content', () => {
      const pageWithEmptyHero: PageContent = {
        slug: 'test-page',
        title: 'Test Page',
        description: 'Test description',
        sections: [
          {
            id: 'hero-1',
            type: 'hero',
            data: {
              hero: {}
            }
          }
        ]
      };

      const result = validator.validatePage(pageWithEmptyHero);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.field.includes('hero.title'))).toBe(true);
    });
  });

  describe('validateUniquenesss', () => {
    it('should detect duplicate slugs', () => {
      const pages: PageContent[] = [
        {
          slug: 'duplicate-slug',
          title: 'Page 1',
          description: 'Description 1',
          sections: []
        },
        {
          slug: 'duplicate-slug',
          title: 'Page 2',
          description: 'Description 2',
          sections: []
        },
        {
          slug: 'unique-slug',
          title: 'Page 3',
          description: 'Description 3',
          sections: []
        }
      ];

      const errors = validator.validateUniquenesss(pages);
      expect(errors).toHaveLength(1);
      expect(errors[0].message).toContain('duplicate-slug');
      expect(errors[0].message).toContain('appears 2 times');
    });

    it('should not report errors for unique slugs', () => {
      const pages: PageContent[] = [
        {
          slug: 'page-1',
          title: 'Page 1',
          description: 'Description 1',
          sections: []
        },
        {
          slug: 'page-2',
          title: 'Page 2',
          description: 'Description 2',
          sections: []
        }
      ];

      const errors = validator.validateUniquenesss(pages);
      expect(errors).toHaveLength(0);
    });
  });

  describe('generateReport', () => {
    it('should generate a comprehensive validation report', () => {
      const pages: PageContent[] = [
        {
          slug: 'valid-page',
          title: 'Valid Page',
          description: 'Valid description',
          sections: [
            {
              id: 'section-1',
              type: 'hero',
              data: { hero: { title: 'Hero Title' } }
            }
          ]
        },
        {
          slug: 'invalid-page',
          title: '',
          description: '',
          sections: []
        }
      ];

      const report = validator.generateReport(pages);
      
      expect(report.summary.totalPages).toBe(2);
      expect(report.summary.pagesWithErrors).toBe(1);
      expect(report.details['valid-page'].isValid).toBe(true);
      expect(report.details['invalid-page'].isValid).toBe(false);
    });
  });
});