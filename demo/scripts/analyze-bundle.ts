#!/usr/bin/env tsx

import { execSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

interface BundleStats {
  timestamp: string;
  totalSize: number;
  gzippedSize: number;
  chunks: Array<{
    name: string;
    size: number;
    gzippedSize: number;
  }>;
  assets: Array<{
    name: string;
    size: number;
  }>;
}

class BundleAnalyzer {
  private statsPath = join(process.cwd(), '.next', 'bundle-stats.json');
  private historyPath = join(process.cwd(), 'bundle-history.json');

  async analyze() {
    console.log('🔍 Analyzing bundle...');
    
    // Build with analysis
    execSync('ANALYZE=true npm run build', { stdio: 'inherit' });
    
    // Read build stats
    const stats = this.readBuildStats();
    if (stats) {
      this.saveStats(stats);
      this.generateReport(stats);
      this.compareWithHistory(stats);
    }
  }

  private readBuildStats(): BundleStats | null {
    try {
      if (!existsSync(this.statsPath)) {
        console.warn('⚠️  Bundle stats not found');
        return null;
      }

      const rawStats = JSON.parse(readFileSync(this.statsPath, 'utf-8'));
      
      return {
        timestamp: new Date().toISOString(),
        totalSize: rawStats.assets?.reduce((sum: number, asset: any) => sum + asset.size, 0) || 0,
        gzippedSize: rawStats.assets?.reduce((sum: number, asset: any) => sum + (asset.gzippedSize || asset.size * 0.3), 0) || 0,
        chunks: rawStats.chunks?.map((chunk: any) => ({
          name: chunk.names?.[0] || chunk.id,
          size: chunk.size,
          gzippedSize: chunk.size * 0.3, // Estimate
        })) || [],
        assets: rawStats.assets?.map((asset: any) => ({
          name: asset.name,
          size: asset.size,
        })) || [],
      };
    } catch (error) {
      console.error('❌ Error reading bundle stats:', error);
      return null;
    }
  }

  private saveStats(stats: BundleStats) {
    try {
      let history: BundleStats[] = [];
      
      if (existsSync(this.historyPath)) {
        history = JSON.parse(readFileSync(this.historyPath, 'utf-8'));
      }
      
      history.push(stats);
      
      // Keep only last 10 builds
      if (history.length > 10) {
        history = history.slice(-10);
      }
      
      writeFileSync(this.historyPath, JSON.stringify(history, null, 2));
      console.log('💾 Bundle stats saved to history');
    } catch (error) {
      console.error('❌ Error saving stats:', error);
    }
  }

  private generateReport(stats: BundleStats) {
    console.log('\n📊 Bundle Analysis Report');
    console.log('========================');
    console.log(`Total Size: ${this.formatBytes(stats.totalSize)}`);
    console.log(`Gzipped Size: ${this.formatBytes(stats.gzippedSize)}`);
    console.log(`Number of Chunks: ${stats.chunks.length}`);
    console.log(`Number of Assets: ${stats.assets.length}`);
    
    console.log('\n🔝 Largest Chunks:');
    const largestChunks = stats.chunks
      .sort((a, b) => b.size - a.size)
      .slice(0, 5);
    
    largestChunks.forEach((chunk, index) => {
      console.log(`${index + 1}. ${chunk.name}: ${this.formatBytes(chunk.size)}`);
    });
    
    console.log('\n📦 Largest Assets:');
    const largestAssets = stats.assets
      .sort((a, b) => b.size - a.size)
      .slice(0, 5);
    
    largestAssets.forEach((asset, index) => {
      console.log(`${index + 1}. ${asset.name}: ${this.formatBytes(asset.size)}`);
    });
  }

  private compareWithHistory(currentStats: BundleStats) {
    try {
      if (!existsSync(this.historyPath)) return;
      
      const history: BundleStats[] = JSON.parse(readFileSync(this.historyPath, 'utf-8'));
      if (history.length < 2) return;
      
      const previousStats = history[history.length - 2];
      const sizeDiff = currentStats.totalSize - previousStats.totalSize;
      const gzippedDiff = currentStats.gzippedSize - previousStats.gzippedSize;
      
      console.log('\n📈 Comparison with Previous Build:');
      console.log('==================================');
      
      if (sizeDiff > 0) {
        console.log(`📈 Total size increased by ${this.formatBytes(sizeDiff)}`);
      } else if (sizeDiff < 0) {
        console.log(`📉 Total size decreased by ${this.formatBytes(Math.abs(sizeDiff))}`);
      } else {
        console.log('➡️  Total size unchanged');
      }
      
      if (gzippedDiff > 0) {
        console.log(`📈 Gzipped size increased by ${this.formatBytes(gzippedDiff)}`);
      } else if (gzippedDiff < 0) {
        console.log(`📉 Gzipped size decreased by ${this.formatBytes(Math.abs(gzippedDiff))}`);
      } else {
        console.log('➡️  Gzipped size unchanged');
      }
      
      // Warn if bundle size increased significantly
      if (sizeDiff > 100000) { // 100KB
        console.log('⚠️  WARNING: Bundle size increased significantly!');
      }
    } catch (error) {
      console.error('❌ Error comparing with history:', error);
    }
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  async checkBundleSize() {
    console.log('🔍 Checking current bundle size...');
    
    try {
      if (!existsSync(this.historyPath)) {
        console.log('📊 No bundle history found. Run analyze first.');
        return;
      }
      
      const history: BundleStats[] = JSON.parse(readFileSync(this.historyPath, 'utf-8'));
      if (history.length === 0) {
        console.log('📊 No bundle history found.');
        return;
      }
      
      const latest = history[history.length - 1];
      this.generateReport(latest);
      
      // Check against thresholds
      const maxSize = 2 * 1024 * 1024; // 2MB
      const maxGzippedSize = 500 * 1024; // 500KB
      
      if (latest.totalSize > maxSize) {
        console.log(`⚠️  WARNING: Bundle size (${this.formatBytes(latest.totalSize)}) exceeds threshold (${this.formatBytes(maxSize)})`);
      }
      
      if (latest.gzippedSize > maxGzippedSize) {
        console.log(`⚠️  WARNING: Gzipped size (${this.formatBytes(latest.gzippedSize)}) exceeds threshold (${this.formatBytes(maxGzippedSize)})`);
      }
    } catch (error) {
      console.error('❌ Error checking bundle size:', error);
    }
  }
}

// CLI interface
const command = process.argv[2];
const analyzer = new BundleAnalyzer();

switch (command) {
  case 'analyze':
    analyzer.analyze();
    break;
  case 'check':
    analyzer.checkBundleSize();
    break;
  default:
    console.log('Usage: tsx scripts/analyze-bundle.ts [analyze|check]');
    process.exit(1);
}