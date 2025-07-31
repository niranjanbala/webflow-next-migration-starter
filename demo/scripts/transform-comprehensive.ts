#!/usr/bin/env tsx

import { ContentTransformer } from '../src/lib/content-transformer';
import { ScrapedPage } from '../src/lib/scraper';
import * as fs from 'fs/promises';
import * as path from 'path';

async function main() {
  const scrapedDataDir = path.join(process.cwd(), 'scraped-data');
  const contentDir = path.join(process.cwd(), 'src', 'content');
  
  console.log('🔄 Transforming comprehensive scraped content...');
  
  try {
    // Read comprehensive scraped pages
    const pagesData = await fs.readFile(
      path.join(scrapedDataDir, 'comprehensive-pages.json'),
      'utf-8'
    );
    const scrapedPages: ScrapedPage[] = JSON.parse(pagesData);
    
    console.log(`📄 Found ${scrapedPages.length} comprehensive scraped pages`);
    
    // Create content directories
    await fs.mkdir(contentDir, { recursive: true });
    await fs.mkdir(path.join(contentDir, 'pages'), { recursive: true });
    await fs.mkdir(path.join(contentDir, 'blog'), { recursive: true });
    await fs.mkdir(path.join(contentDir, 'products'), { recursive: true });
    await fs.mkdir(path.join(contentDir, 'customers'), { recursive: true });
    await fs.mkdir(path.join(contentDir, 'solutions'), { recursive: true });
    
    // Transform content
    const transformer = new ContentTransformer();
    const transformedPages = transformer.transformAllPages(scrapedPages);
    
    console.log('\n📝 Organizing and saving pages by category:');
    
    const pagesByCategory = {
      main: [] as any[],
      blog: [] as any[],
      product: [] as any[],
      customer: [] as any[],
      solution: [] as any[]
    };
    
    // Organize pages by category and save
    for (const page of transformedPages) {
      const originalPage = scrapedPages.find(p => p.url === page.slug || p.title === page.title);
      const category = originalPage?.metadata?.category || 'main';
      
      let targetDir = 'pages';
      let categoryKey = 'main';
      
      if (category === 'blog') {
        targetDir = 'blog';
        categoryKey = 'blog';
      } else if (category === 'product') {
        targetDir = 'products';
        categoryKey = 'product';
      } else if (category === 'customer-story') {
        targetDir = 'customers';
        categoryKey = 'customer';
      } else if (category === 'solution') {
        targetDir = 'solutions';
        categoryKey = 'solution';
      }
      
      const filename = `${page.slug}.json`;
      const filepath = path.join(contentDir, targetDir, filename);
      
      // Add category metadata to page
      const enhancedPage = {
        ...page,
        category,
        originalUrl: originalPage?.url
      };
      
      await fs.writeFile(filepath, JSON.stringify(enhancedPage, null, 2));
      pagesByCategory[categoryKey as keyof typeof pagesByCategory].push(enhancedPage);
      
      console.log(`  ✓ ${targetDir}/${filename} (${page.sections.length} sections)`);
    }
    
    // Create category indexes
    console.log('\n📚 Creating category indexes:');
    
    for (const [categoryKey, pages] of Object.entries(pagesByCategory)) {
      if (pages.length > 0) {
        const index = {
          category: categoryKey,
          totalPages: pages.length,
          pages: pages.map(page => ({
            slug: page.slug,
            title: page.title,
            description: page.description,
            sections: page.sections.length,
            originalUrl: page.originalUrl
          })),
          createdAt: new Date().toISOString()
        };
        
        const indexPath = path.join(contentDir, `${categoryKey}-index.json`);
        await fs.writeFile(indexPath, JSON.stringify(index, null, 2));
        console.log(`  ✓ ${categoryKey}-index.json (${pages.length} pages)`);
      }
    }
    
    // Generate comprehensive site map
    const comprehensiveSiteMap = {
      ...transformer.generateSiteMap(transformedPages),
      categories: pagesByCategory,
      categoryCounts: Object.entries(pagesByCategory).reduce(
        (acc, [key, pages]) => {
          acc[key] = pages.length;
          return acc;
        },
        {} as Record<string, number>
      ),
      navigation: [
        { label: 'Home', href: '/', category: 'main' },
        { label: 'About', href: '/about', category: 'main' },
        { label: 'Pricing', href: '/pricing', category: 'main' },
        { label: 'Products', href: '/products', category: 'product' },
        { label: 'Solutions', href: '/solutions', category: 'solution' },
        { label: 'Case Studies', href: '/case-studies', category: 'main' },
        { label: 'Blog', href: '/blog', category: 'blog' },
        { label: 'Demo', href: '/demo', category: 'main' }
      ]
    };
    
    await fs.writeFile(
      path.join(contentDir, 'comprehensive-sitemap.json'),
      JSON.stringify(comprehensiveSiteMap, null, 2)
    );
    
    // Create a comprehensive summary
    const summary = {
      transformedAt: new Date().toISOString(),
      totalPages: transformedPages.length,
      categories: Object.entries(pagesByCategory).map(([category, pages]) => ({
        category,
        count: pages.length,
        samplePages: pages.slice(0, 3).map(p => ({ slug: p.slug, title: p.title }))
      })),
      sectionTypes: [...new Set(transformedPages.flatMap(p => p.sections.map(s => s.type)))],
      totalSections: transformedPages.reduce((sum, page) => sum + page.sections.length, 0),
      averageSectionsPerPage: Math.round(
        transformedPages.reduce((sum, page) => sum + page.sections.length, 0) / transformedPages.length
      )
    };
    
    await fs.writeFile(
      path.join(contentDir, 'comprehensive-summary.json'),
      JSON.stringify(summary, null, 2)
    );
    
    console.log('\n🎉 Comprehensive content transformation complete!');
    console.log(`📊 Summary:`);
    console.log(`  - Total pages transformed: ${summary.totalPages}`);
    console.log(`  - Total sections: ${summary.totalSections}`);
    console.log(`  - Average sections per page: ${summary.averageSectionsPerPage}`);
    console.log(`  - Section types: ${summary.sectionTypes.join(', ')}`);
    
    console.log(`\n📁 Content organized by category:`);
    summary.categories.forEach(cat => {
      console.log(`  - ${cat.category}: ${cat.count} pages`);
    });
    
    console.log(`\n📂 Directory structure:`);
    console.log(`  src/content/`);
    console.log(`  ├── pages/ (main pages)`);
    console.log(`  ├── blog/ (blog posts)`);
    console.log(`  ├── products/ (product pages)`);
    console.log(`  ├── customers/ (customer stories)`);
    console.log(`  ├── solutions/ (solution pages)`);
    console.log(`  ├── *-index.json (category indexes)`);
    console.log(`  ├── comprehensive-sitemap.json`);
    console.log(`  └── comprehensive-summary.json`);
    
  } catch (error) {
    console.error('❌ Comprehensive content transformation failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}