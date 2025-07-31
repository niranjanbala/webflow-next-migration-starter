#!/usr/bin/env tsx

import { WebScraper } from '../src/lib/scraper';
import { SitemapParser } from '../src/lib/sitemap-parser';
import * as fs from 'fs/promises';
import * as path from 'path';

async function main() {
  const siteUrl = 'https://www.numeralhq.com';
  const sitemapUrl = 'https://www.numeralhq.com/sitemap.xml';
  const outputDir = path.join(process.cwd(), 'scraped-data');
  
  console.log('🚀 Starting comprehensive site scraping...');
  console.log(`Target: ${siteUrl}`);
  console.log(`Sitemap: ${sitemapUrl}`);
  console.log(`Output: ${outputDir}`);
  
  try {
    // Parse sitemap
    console.log('\n📋 Parsing sitemap...');
    const sitemapParser = new SitemapParser();
    const allUrls = await sitemapParser.parseSitemap(sitemapUrl);
    
    console.log(`Found ${allUrls.length} URLs in sitemap`);
    
    // Analyze sitemap
    const categorized = sitemapParser.getUrlsByCategory(allUrls);
    console.log('\n📊 URL Categories:');
    Object.entries(categorized).forEach(([category, urls]) => {
      console.log(`  ${category}: ${urls.length} pages`);
    });
    
    // Save sitemap analysis
    await sitemapParser.saveSitemapAnalysis(
      allUrls, 
      path.join(outputDir, 'sitemap-analysis.json')
    );
    
    // Get high priority URLs for scraping
    const priorityUrls = sitemapParser.getHighPriorityUrls(allUrls);
    console.log(`\n🎯 Selected ${priorityUrls.length} high-priority URLs for scraping`);
    
    // Initialize scraper
    const scraper = new WebScraper(siteUrl);
    const scrapedPages = [];
    
    console.log('\n📄 Scraping priority pages...');
    
    // Scrape each priority URL
    for (let i = 0; i < priorityUrls.length; i++) {
      const urlInfo = priorityUrls[i];
      try {
        console.log(`[${i + 1}/${priorityUrls.length}] ${urlInfo.category}: ${urlInfo.url}`);
        
        const page = await scraper.scrapePage(urlInfo.url);
        page.metadata.category = urlInfo.category;
        scrapedPages.push(page);
        
        // Be respectful with delays
        if (i < priorityUrls.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
        
      } catch (error) {
        console.error(`  ❌ Failed to scrape ${urlInfo.url}:`, error);
      }
    }
    
    console.log(`\n✅ Successfully scraped ${scrapedPages.length} pages`);
    
    // Save comprehensive scraped data
    await fs.writeFile(
      path.join(outputDir, 'comprehensive-pages.json'),
      JSON.stringify(scrapedPages, null, 2)
    );
    
    // Create summary by category
    const summary = {
      scrapedAt: new Date().toISOString(),
      totalPages: scrapedPages.length,
      categories: {} as Record<string, any>
    };
    
    scrapedPages.forEach(page => {
      const category = page.metadata.category || 'other';
      if (!summary.categories[category]) {
        summary.categories[category] = {
          count: 0,
          pages: []
        };
      }
      
      summary.categories[category].count++;
      summary.categories[category].pages.push({
        url: page.url,
        title: page.title,
        sections: page.sections.length,
        assets: page.assets.length
      });
    });
    
    await fs.writeFile(
      path.join(outputDir, 'comprehensive-summary.json'),
      JSON.stringify(summary, null, 2)
    );
    
    // Download sample assets from different page types
    console.log('\n🖼️  Downloading sample assets...');
    const allAssets = scrapedPages.flatMap(page => page.assets);
    const uniqueAssets = Array.from(
      new Map(allAssets.map(asset => [asset.url, asset])).values()
    );
    
    // Prioritize different asset types
    const priorityAssets = [
      ...uniqueAssets.filter(a => a.type === 'image' && a.url.includes('logo')).slice(0, 5),
      ...uniqueAssets.filter(a => a.type === 'image' && !a.url.includes('logo')).slice(0, 15),
      ...uniqueAssets.filter(a => a.type === 'css').slice(0, 3),
      ...uniqueAssets.filter(a => a.type === 'font').slice(0, 3)
    ];
    
    let downloadedCount = 0;
    for (const asset of priorityAssets) {
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
    
    console.log(`\n🎉 Comprehensive scraping complete!`);
    console.log(`📊 Final Summary:`);
    console.log(`  - Total URLs in sitemap: ${allUrls.length}`);
    console.log(`  - Priority pages scraped: ${scrapedPages.length}`);
    console.log(`  - Total sections extracted: ${scrapedPages.reduce((sum, p) => sum + p.sections.length, 0)}`);
    console.log(`  - Total assets found: ${allAssets.length}`);
    console.log(`  - Assets downloaded: ${downloadedCount}`);
    
    console.log(`\n📁 Files created:`);
    console.log(`  - comprehensive-pages.json (full scraped data)`);
    console.log(`  - comprehensive-summary.json (organized summary)`);
    console.log(`  - sitemap-analysis.json (sitemap breakdown)`);
    
    console.log(`\n📋 Pages by category:`);
    Object.entries(summary.categories).forEach(([category, info]) => {
      console.log(`  ${category}: ${info.count} pages`);
    });
    
  } catch (error) {
    console.error('❌ Comprehensive scraping failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}