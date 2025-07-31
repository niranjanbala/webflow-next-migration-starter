#!/usr/bin/env tsx

import { ContentTransformer } from '../src/lib/content-transformer';
import { ScrapedPage } from '../src/lib/scraper';
import * as fs from 'fs/promises';
import * as path from 'path';

async function main() {
  const scrapedDataDir = path.join(process.cwd(), 'scraped-data');
  const contentDir = path.join(process.cwd(), 'src', 'content');
  
  console.log('🔄 Transforming scraped content...');
  
  try {
    // Read scraped pages
    const pagesData = await fs.readFile(
      path.join(scrapedDataDir, 'pages.json'),
      'utf-8'
    );
    const scrapedPages: ScrapedPage[] = JSON.parse(pagesData);
    
    console.log(`📄 Found ${scrapedPages.length} scraped pages`);
    
    // Create content directory
    await fs.mkdir(contentDir, { recursive: true });
    await fs.mkdir(path.join(contentDir, 'pages'), { recursive: true });
    
    // Transform content
    const transformer = new ContentTransformer();
    const transformedPages = transformer.transformAllPages(scrapedPages);
    
    console.log('\n📝 Transforming pages:');
    
    // Save individual page content files
    for (const page of transformedPages) {
      const filename = `${page.slug}.json`;
      const filepath = path.join(contentDir, 'pages', filename);
      
      await fs.writeFile(filepath, JSON.stringify(page, null, 2));
      console.log(`  ✓ ${filename} (${page.sections.length} sections)`);
    }
    
    // Generate site map
    const siteMap = transformer.generateSiteMap(transformedPages);
    await fs.writeFile(
      path.join(contentDir, 'sitemap.json'),
      JSON.stringify(siteMap, null, 2)
    );
    
    // Create a summary of the transformation
    const summary = {
      transformedAt: new Date().toISOString(),
      totalPages: transformedPages.length,
      pages: transformedPages.map(page => ({
        slug: page.slug,
        title: page.title,
        sections: page.sections.length,
        sectionTypes: [...new Set(page.sections.map(s => s.type))]
      })),
      sectionTypes: [...new Set(transformedPages.flatMap(p => p.sections.map(s => s.type)))],
      totalSections: transformedPages.reduce((sum, page) => sum + page.sections.length, 0)
    };
    
    await fs.writeFile(
      path.join(contentDir, 'transformation-summary.json'),
      JSON.stringify(summary, null, 2)
    );
    
    console.log('\n🎉 Content transformation complete!');
    console.log(`📊 Summary:`);
    console.log(`  - Pages transformed: ${summary.totalPages}`);
    console.log(`  - Total sections: ${summary.totalSections}`);
    console.log(`  - Section types: ${summary.sectionTypes.join(', ')}`);
    console.log(`\n📁 Content saved to: ${contentDir}`);
    
    // Show some sample content
    console.log('\n📋 Sample page structure:');
    const samplePage = transformedPages.find(p => p.slug === 'home') || transformedPages[0];
    console.log(`\n${samplePage.title} (/${samplePage.slug}):`);
    samplePage.sections.forEach((section, index) => {
      console.log(`  ${index + 1}. ${section.type} (${section.id})`);
    });
    
  } catch (error) {
    console.error('❌ Content transformation failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}