import { PageContent, ContentSection } from './types';

export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

export class ContentValidator {
  
  validatePage(page: PageContent): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    // Required fields validation
    if (!page.slug) {
      errors.push({
        field: 'slug',
        message: 'Page slug is required',
        severity: 'error'
      });
    }

    if (!page.title) {
      errors.push({
        field: 'title',
        message: 'Page title is required',
        severity: 'error'
      });
    }

    if (!page.description) {
      warnings.push({
        field: 'description',
        message: 'Page description is recommended for SEO',
        severity: 'warning'
      });
    }

    // SEO validation
    if (page.title && page.title.length > 60) {
      warnings.push({
        field: 'title',
        message: 'Title is longer than 60 characters, may be truncated in search results',
        severity: 'warning'
      });
    }

    if (page.description && page.description.length > 160) {
      warnings.push({
        field: 'description',
        message: 'Description is longer than 160 characters, may be truncated in search results',
        severity: 'warning'
      });
    }

    // Slug validation
    if (page.slug && !/^[a-z0-9-]+$/.test(page.slug)) {
      errors.push({
        field: 'slug',
        message: 'Slug should only contain lowercase letters, numbers, and hyphens',
        severity: 'error'
      });
    }

    // Sections validation
    if (!page.sections || page.sections.length === 0) {
      warnings.push({
        field: 'sections',
        message: 'Page has no content sections',
        severity: 'warning'
      });
    } else {
      page.sections.forEach((section, index) => {
        const sectionErrors = this.validateSection(section, index);
        errors.push(...sectionErrors.filter(e => e.severity === 'error'));
        warnings.push(...sectionErrors.filter(e => e.severity === 'warning'));
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  validateSection(section: ContentSection, index: number): ValidationError[] {
    const errors: ValidationError[] = [];

    // Required fields
    if (!section.id) {
      errors.push({
        field: `sections[${index}].id`,
        message: 'Section ID is required',
        severity: 'error'
      });
    }

    if (!section.type) {
      errors.push({
        field: `sections[${index}].type`,
        message: 'Section type is required',
        severity: 'error'
      });
    }

    // Valid section types
    const validTypes = ['hero', 'content', 'gallery', 'contact', 'custom'];
    if (section.type && !validTypes.includes(section.type)) {
      errors.push({
        field: `sections[${index}].type`,
        message: `Invalid section type: ${section.type}. Must be one of: ${validTypes.join(', ')}`,
        severity: 'error'
      });
    }

    // Content validation
    if (!section.data || Object.keys(section.data).length === 0) {
      errors.push({
        field: `sections[${index}].data`,
        message: 'Section data is required',
        severity: 'error'
      });
    }

    // Hero section specific validation
    if (section.type === 'hero') {
      const heroData = section.data.hero as { title?: string; description?: string } | undefined;
      if (!heroData?.title && !section.data.html) {
        errors.push({
          field: `sections[${index}].data.hero.title`,
          message: 'Hero section must have a title',
          severity: 'error'
        });
      }
    }

    return errors;
  }

  validateBatch(pages: PageContent[]): { [slug: string]: ValidationResult } {
    const results: { [slug: string]: ValidationResult } = {};
    
    pages.forEach(page => {
      results[page.slug] = this.validatePage(page);
    });

    return results;
  }

  // Check for duplicate slugs
  validateUniquenesss(pages: PageContent[]): ValidationError[] {
    const errors: ValidationError[] = [];
    const slugCounts = new Map<string, number>();

    pages.forEach(page => {
      const count = slugCounts.get(page.slug) || 0;
      slugCounts.set(page.slug, count + 1);
    });

    slugCounts.forEach((count, slug) => {
      if (count > 1) {
        errors.push({
          field: 'slug',
          message: `Duplicate slug found: ${slug} (appears ${count} times)`,
          severity: 'error'
        });
      }
    });

    return errors;
  }

  // Generate validation report
  generateReport(pages: PageContent[]): {
    summary: {
      totalPages: number;
      validPages: number;
      pagesWithErrors: number;
      pagesWithWarnings: number;
    };
    details: { [slug: string]: ValidationResult };
    duplicateErrors: ValidationError[];
  } {
    const batchResults = this.validateBatch(pages);
    const duplicateErrors = this.validateUniquenesss(pages);

    const summary = {
      totalPages: pages.length,
      validPages: 0,
      pagesWithErrors: 0,
      pagesWithWarnings: 0
    };

    Object.values(batchResults).forEach(result => {
      if (result.isValid && result.warnings.length === 0) {
        summary.validPages++;
      }
      if (result.errors.length > 0) {
        summary.pagesWithErrors++;
      }
      if (result.warnings.length > 0) {
        summary.pagesWithWarnings++;
      }
    });

    return {
      summary,
      details: batchResults,
      duplicateErrors
    };
  }
}

// Utility function to validate content on build
export async function validateAllContent(): Promise<void> {
  const { ContentLoader } = await import('./content-loader');
  const validator = new ContentValidator();
  
  try {
    const allPages = await ContentLoader.getAllStaticPages();
    const report = validator.generateReport(allPages);
    
    console.log('Content Validation Report:');
    console.log(`Total pages: ${report.summary.totalPages}`);
    console.log(`Valid pages: ${report.summary.validPages}`);
    console.log(`Pages with errors: ${report.summary.pagesWithErrors}`);
    console.log(`Pages with warnings: ${report.summary.pagesWithWarnings}`);
    
    if (report.duplicateErrors.length > 0) {
      console.error('Duplicate slug errors:');
      report.duplicateErrors.forEach(error => {
        console.error(`- ${error.message}`);
      });
    }
    
    // Log detailed errors
    Object.entries(report.details).forEach(([slug, result]) => {
      if (result.errors.length > 0) {
        console.error(`Errors in ${slug}:`);
        result.errors.forEach(error => {
          console.error(`  - ${error.field}: ${error.message}`);
        });
      }
    });
    
    // Fail build if there are critical errors
    const totalErrors = report.summary.pagesWithErrors + report.duplicateErrors.length;
    if (totalErrors > 0) {
      throw new Error(`Content validation failed with ${totalErrors} errors`);
    }
    
  } catch (error) {
    console.error('Content validation failed:', error);
    throw error;
  }
}