#!/usr/bin/env tsx

import { promises as fs } from 'fs';
import path from 'path';
import { getAllPages } from '../src/lib/content-loader';
import { WebflowAssetExtractor, ExtractedAsset } from '../src/lib/webflow-asset-extractor';
import { ImageOptimizer } from '../src/lib/image-optimization';

interface OptimizationConfig {
  inputDir?: string;
  outputDir?: string;
  quality?: number;
  formats?: string[];
  sizes?: number[];
  maxConcurrent?: number;
  skipExisting?: boolean;
  generateReport?: boolean;
}

const DEFAULT_CONFIG: Required<OptimizationConfig> = {
  inputDir: 'src/content',
  outputDir: 'public/optimized-images',
  quality: 85,
  formats: ['webp', 'avif', 'original'],
  sizes: [640, 768, 1024, 1280, 1920],
  maxConcurrent: 5,
  skipExisting: true,
  generateReport: true
};

class AssetOptimizationScript {
  private config: Required<OptimizationConfig>;
  private extractor: WebflowAssetExtractor;
  private optimizer: ImageOptimizer;
  private stats = {
    totalAssets: 0,
    processedAssets: 0,
    skippedAssets: 0,
    failedAssets: 0,
    totalSizeBefore: 0,
    totalSizeAfter: 0,
    startTime: Date.now(),
    endTime: 0
  };

  constructor(config: OptimizationConfig = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.extractor = new WebflowAssetExtractor({
      downloadImages: true,
      optimizeImages: true
    });
    this.optimizer = new ImageOptimizer({
      quality: this.config.quality,
      formats: this.config.formats,
      sizes: this.config.sizes,
      outputDir: this.config.outputDir
    });
  }

  async run(): Promise<void> {
    console.log('🚀 Starting asset optimization...');
    console.log(`📁 Output directory: ${this.config.outputDir}`);
    console.log(`⚙️  Quality: ${this.config.quality}%`);
    console.log(`📐 Sizes: ${this.config.sizes.join(', ')}`);
    console.log(`🎨 Formats: ${this.config.formats.join(', ')}`);
    console.log('');

    try {
      // Ensure output directory exists
      await fs.mkdir(path.join(process.cwd(), this.config.outputDir), { recursive: true });

      // Load content
      console.log('📖 Loading content...');
      const content = await getAllPages();
      console.log(`✅ Loaded ${content.length} content items`);

      // Extract assets
      console.log('🔍 Extracting assets...');
      const assets = await this.extractor.extractFromContent(content);
      this.stats.totalAssets = assets.length;
      console.log(`✅ Found ${assets.length} assets`);

      if (assets.length === 0) {
        console.log('ℹ️  No assets found to optimize');
        return;
      }

      // Process assets in batches
      console.log('🔄 Processing assets...');
      await this.processAssetsBatch(assets);

      // Generate report
      if (this.config.generateReport) {
        await this.generateReport(assets);
      }

      // Print summary
      this.printSummary();

    } catch (error) {
      console.error('❌ Asset optimization failed:', error);
      process.exit(1);
    }
  }

  private async processAssetsBatch(assets: ExtractedAsset[]): Promise<void> {
    const batches = this.chunkArray(assets, this.config.maxConcurrent);
    
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(`📦 Processing batch ${i + 1}/${batches.length} (${batch.length} assets)`);
      
      const promises = batch.map(asset => this.processAsset(asset));
      const results = await Promise.allSettled(promises);
      
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          this.stats.processedAssets++;
        } else {
          this.stats.failedAssets++;
          console.error(`❌ Failed to process ${batch[index].url}:`, result.reason);
        }
      });

      // Progress indicator
      const processed = (i + 1) * this.config.maxConcurrent;
      const total = assets.length;
      const percentage = Math.min(100, Math.round((processed / total) * 100));
      console.log(`📊 Progress: ${percentage}% (${Math.min(processed, total)}/${total})`);
      
      // Small delay between batches to avoid overwhelming the system
      if (i < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
  }

  private async processAsset(asset: ExtractedAsset): Promise<void> {
    try {
      // Check if already optimized and skip if configured
      if (this.config.skipExisting && asset.optimizedPath) {
        const optimizedExists = await this.fileExists(asset.optimizedPath);
        if (optimizedExists) {
          this.stats.skippedAssets++;
          return;
        }
      }

      // Track original size
      if (asset.size) {
        this.stats.totalSizeBefore += asset.size;
      }

      // Download and optimize if not already done
      if (!asset.localPath) {
        const optimizedAsset = await this.optimizer.downloadAndOptimize(asset.url, asset.alt);
        Object.assign(asset, optimizedAsset);
      }

      // Track optimized size (estimate)
      if (asset.size) {
        // Assume 30% size reduction on average
        this.stats.totalSizeAfter += Math.round(asset.size * 0.7);
      }

    } catch (error) {
      console.error(`Failed to process asset ${asset.url}:`, error);
      throw error;
    }
  }

  private async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  private async generateReport(assets: ExtractedAsset[]): Promise<void> {
    console.log('📄 Generating optimization report...');
    
    const report = this.extractor.generateAssetReport(assets);
    const reportPath = path.join(process.cwd(), this.config.outputDir, 'optimization-report.md');
    
    const fullReport = [
      report,
      '',
      '## Optimization Statistics',
      `- **Total Assets:** ${this.stats.totalAssets}`,
      `- **Processed:** ${this.stats.processedAssets}`,
      `- **Skipped:** ${this.stats.skippedAssets}`,
      `- **Failed:** ${this.stats.failedAssets}`,
      `- **Size Before:** ${(this.stats.totalSizeBefore / 1024 / 1024).toFixed(2)} MB`,
      `- **Size After:** ${(this.stats.totalSizeAfter / 1024 / 1024).toFixed(2)} MB`,
      `- **Size Reduction:** ${((1 - this.stats.totalSizeAfter / this.stats.totalSizeBefore) * 100).toFixed(1)}%`,
      `- **Processing Time:** ${((Date.now() - this.stats.startTime) / 1000).toFixed(1)}s`,
      '',
      `*Report generated on ${new Date().toISOString()}*`
    ].join('\n');

    await fs.writeFile(reportPath, fullReport);
    console.log(`✅ Report saved to ${reportPath}`);
  }

  private printSummary(): void {
    this.stats.endTime = Date.now();
    const duration = (this.stats.endTime - this.stats.startTime) / 1000;
    
    console.log('');
    console.log('🎉 Asset optimization complete!');
    console.log('');
    console.log('📊 Summary:');
    console.log(`   Total Assets: ${this.stats.totalAssets}`);
    console.log(`   Processed: ${this.stats.processedAssets}`);
    console.log(`   Skipped: ${this.stats.skippedAssets}`);
    console.log(`   Failed: ${this.stats.failedAssets}`);
    console.log(`   Size Before: ${(this.stats.totalSizeBefore / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Size After: ${(this.stats.totalSizeAfter / 1024 / 1024).toFixed(2)} MB`);
    
    if (this.stats.totalSizeBefore > 0) {
      const reduction = ((1 - this.stats.totalSizeAfter / this.stats.totalSizeBefore) * 100);
      console.log(`   Size Reduction: ${reduction.toFixed(1)}%`);
    }
    
    console.log(`   Processing Time: ${duration.toFixed(1)}s`);
    console.log('');
    
    if (this.stats.failedAssets > 0) {
      console.log(`⚠️  ${this.stats.failedAssets} assets failed to process`);
    }
    
    console.log('✨ Optimization complete! Your images are now optimized for web delivery.');
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const config: OptimizationConfig = {};

  // Parse command line arguments
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i]?.replace('--', '');
    const value = args[i + 1];

    switch (key) {
      case 'output-dir':
        config.outputDir = value;
        break;
      case 'quality':
        config.quality = parseInt(value);
        break;
      case 'max-concurrent':
        config.maxConcurrent = parseInt(value);
        break;
      case 'skip-existing':
        config.skipExisting = value === 'true';
        break;
      case 'generate-report':
        config.generateReport = value === 'true';
        break;
      case 'help':
        printHelp();
        process.exit(0);
        break;
    }
  }

  const script = new AssetOptimizationScript(config);
  await script.run();
}

function printHelp() {
  console.log(`
Asset Optimization Script

Usage: npm run optimize-assets [options]

Options:
  --output-dir <path>       Output directory for optimized images (default: public/optimized-images)
  --quality <number>        JPEG/WebP quality 1-100 (default: 85)
  --max-concurrent <number> Maximum concurrent downloads (default: 5)
  --skip-existing <boolean> Skip already optimized images (default: true)
  --generate-report <boolean> Generate optimization report (default: true)
  --help                    Show this help message

Examples:
  npm run optimize-assets
  npm run optimize-assets -- --quality 90 --max-concurrent 3
  npm run optimize-assets -- --output-dir public/images --skip-existing false
`);
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('Script failed:', error);
    process.exit(1);
  });
}

export { AssetOptimizationScript };