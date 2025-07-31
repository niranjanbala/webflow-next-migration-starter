#!/usr/bin/env tsx

import { WebScraper } from '../src/lib/scraper';
import * as fs from 'fs/promises';
import * as path from 'path';

async function main() {
  const siteUrl = 'https://numeralhq.com';
  const outputDir = path.join(process.cwd(), 'scraped-data');
  
  console.log('🚀 Starting site scraping...');
  console.log(`Target: ${siteUrl}`);
  console.log(`Output: ${outputDir}`);
  
  // Create output directory
  await fs.mkdir(outputDir, { recursive: true });
  await fs.mkdir(path.join(outputDir, 'assets'), { recursive: true });
  
  // Initialize scraper
  const scraper = new WebScraper(siteUrl);
  
  try {
    // Scrape the full site
    console.log('\n📄 Scraping pages...');
    const pages = await scraper.scrapeFullSite();
    
    console.log(`\n✅ Scraped ${pages.length} pages:`);
    pages.forEach(page => {
      console.log(`  - ${page.url} (${page.title})`);
    });
    
    // Save scraped data
    console.log('\n💾 Saving scraped data...');
    await fs.writeFile(
      path.join(outputDir, 'pages.json'),
      JSON.stringify(pages, null, 2)
    );
    
    // Extract and save site structure
    const siteStructure = {
      baseUrl: siteUrl,
      scrapedAt: new Date().toISOString(),
      pages: pages.map(page => ({
        url: page.url,
        title: page.title,
        description: page.description,
        sections: page.sections.length,
        assets: page.assets.length
      })),
      totalSections: pages.reduce((sum, page) => sum + page.sections.length, 0),
      totalAssets: pages.reduce((sum, page) => sum + page.assets.length, 0)
    };
    
    await fs.writeFile(
      path.join(outputDir, 'site-structure.json'),
      JSON.stringify(siteStructure, null, 2)
    );
    
    // Download critical assets
    console.log('\n🖼️  Downloading assets...');
    const allAssets = pages.flatMap(page => page.assets);
    const uniqueAssets = Array.from(
      new Map(allAssets.map(asset => [asset.url, asset])).values()
    );
    
    let downloadedCount = 0;
    for (const asset of uniqueAssets.slice(0, 20)) { // Limit to first 20 assets
      try {
        const localPath = await scraper.downloadAsset(
          asset, 
          path.join(outputDir, 'assets')
        );
        asset.localPath = localPath;
        downloadedCount++;
        console.log(`  ✓ Downloaded: ${path.basename(localPath)}`);
      } catch (error) {
        console.log(`  ✗ Failed: ${asset.url}`);
      }
    }
    
    console.log(`\n🎉 Scraping complete!`);
    console.log(`📊 Summary:`);
    console.log(`  - Pages scraped: ${pages.length}`);
    console.log(`  - Sections extracted: ${siteStructure.totalSections}`);
    console.log(`  - Assets found: ${siteStructure.totalAssets}`);
    console.log(`  - Assets downloaded: ${downloadedCount}`);
    console.log(`\n📁 Data saved to: ${outputDir}`);
    
  } catch (error) {
    console.error('❌ Scraping failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}