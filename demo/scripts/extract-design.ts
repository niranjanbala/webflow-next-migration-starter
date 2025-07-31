#!/usr/bin/env tsx

import { DesignExtractor } from '../src/lib/design-extractor';
import { ScrapedPage } from '../src/lib/scraper';
import * as fs from 'fs/promises';
import * as path from 'path';

async function main() {
  const scrapedDataDir = path.join(process.cwd(), 'scraped-data');
  
  console.log('🎨 Extracting design tokens...');
  
  try {
    // Read scraped pages
    const pagesData = await fs.readFile(
      path.join(scrapedDataDir, 'pages.json'),
      'utf-8'
    );
    const scrapedPages: ScrapedPage[] = JSON.parse(pagesData);
    
    console.log(`📄 Analyzing ${scrapedPages.length} pages for design tokens`);
    
    // Extract design tokens
    const extractor = new DesignExtractor();
    const tokens = await extractor.extractDesignTokens(scrapedPages);
    
    console.log('\n🎯 Extracted design tokens:');
    console.log(`  - Colors: ${Object.keys(tokens.colors).length}`);
    console.log(`  - Font families: ${tokens.fonts.families.length}`);
    console.log(`  - Font sizes: ${tokens.fonts.sizes.length}`);
    console.log(`  - Spacing values: ${tokens.spacing.length}`);
    
    // Save design tokens
    const tokensPath = path.join(process.cwd(), 'src', 'content', 'design-tokens.json');
    await fs.writeFile(tokensPath, JSON.stringify(tokens, null, 2));
    
    // Generate and save Tailwind config
    const tailwindConfigPath = path.join(process.cwd(), 'tailwind.config.extracted.ts');
    await extractor.saveTailwindConfig(tokens, tailwindConfigPath);
    
    console.log('\n📁 Files generated:');
    console.log(`  ✓ Design tokens: src/content/design-tokens.json`);
    console.log(`  ✓ Tailwind config: tailwind.config.extracted.ts`);
    
    // Show sample tokens
    console.log('\n🎨 Sample design tokens:');
    
    if (Object.keys(tokens.colors).length > 0) {
      console.log('\nColors:');
      Object.entries(tokens.colors).slice(0, 5).forEach(([name, value]) => {
        console.log(`  ${name}: ${value}`);
      });
    }
    
    if (tokens.fonts.families.length > 0) {
      console.log('\nFont families:');
      tokens.fonts.families.slice(0, 3).forEach(font => {
        console.log(`  - ${font}`);
      });
    }
    
    if (tokens.spacing.length > 0) {
      console.log('\nSpacing:');
      tokens.spacing.slice(0, 5).forEach(space => {
        console.log(`  - ${space}`);
      });
    }
    
    console.log('\n💡 Next steps:');
    console.log('  1. Review the extracted Tailwind config');
    console.log('  2. Merge relevant tokens into your main tailwind.config.ts');
    console.log('  3. Test the design tokens in your components');
    
  } catch (error) {
    console.error('❌ Design extraction failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}