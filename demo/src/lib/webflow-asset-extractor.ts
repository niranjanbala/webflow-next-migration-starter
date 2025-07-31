import { ImageOptimizer, ImageAsset, AssetManifestManager } from './image-optimization';
import { ContentItem } from './content-loader';

export interface WebflowAssetExtractionOptions {
  downloadImages?: boolean;
  optimizeImages?: boolean;
  extractFromContent?: boolean;
  extractFromMetadata?: boolean;
  allowedDomains?: string[];
  maxFileSize?: number; // in bytes
  supportedFormats?: string[];
}

export interface ExtractedAsset extends ImageAsset {
  sourceType: 'content' | 'metadata' | 'inline';
  contentId?: string;
  fieldName?: string;
  context?: string;
}

const DEFAULT_OPTIONS: Required<WebflowAssetExtractionOptions> = {
  downloadImages: true,
  optimizeImages: true,
  extractFromContent: true,
  extractFromMetadata: true,
  allowedDomains: ['uploads-ssl.webflow.com', 'assets.website-files.com', 'images.unsplash.com'],
  maxFileSize: 10 * 1024 * 1024, // 10MB
  supportedFormats: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg']
};

export class WebflowAssetExtractor {
  private optimizer: ImageOptimizer;
  private manifestManager: AssetManifestManager;
  private options: Required<WebflowAssetExtractionOptions>;

  constructor(options: WebflowAssetExtractionOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.optimizer = new ImageOptimizer();
    this.manifestManager = new AssetManifestManager();
  }

  /**
   * Extract all assets from Webflow content
   */
  async extractFromContent(content: ContentItem[]): Promise<ExtractedAsset[]> {
    await this.manifestManager.load();
    
    const allAssets: ExtractedAsset[] = [];
    
    for (const item of content) {
      try {
        const itemAssets = await this.extractFromContentItem(item);
        allAssets.push(...itemAssets);
      } catch (error) {
        console.error(`Failed to extract assets from content item ${item.id}:`, error);
      }
    }

    // Remove duplicates based on URL
    const uniqueAssets = this.deduplicateAssets(allAssets);
    
    // Save updated manifest
    await this.manifestManager.save();
    
    return uniqueAssets;
  }

  /**
   * Extract assets from a single content item
   */
  private async extractFromContentItem(item: ContentItem): Promise<ExtractedAsset[]> {
    const assets: ExtractedAsset[] = [];

    // Extract from content HTML
    if (this.options.extractFromContent && item.content) {
      const contentAssets = await this.extractFromHTML(item.content, item.id, 'content');
      assets.push(...contentAssets);
    }

    // Extract from metadata/fields
    if (this.options.extractFromMetadata && item.metadata) {
      const metadataAssets = await this.extractFromMetadata(item.metadata, item.id);
      assets.push(...metadataAssets);
    }

    return assets;
  }

  /**
   * Extract image URLs from HTML content
   */
  private async extractFromHTML(html: string, contentId: string, sourceType: 'content' | 'metadata'): Promise<ExtractedAsset[]> {
    const assets: ExtractedAsset[] = [];
    
    // Regular expressions to find image URLs
    const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
    const backgroundRegex = /background-image:\s*url\(["']?([^"')]+)["']?\)/gi;
    const srcsetRegex = /srcset=["']([^"']+)["']/gi;

    // Extract img src attributes
    let match;
    while ((match = imgRegex.exec(html)) !== null) {
      const url = match[1];
      const altMatch = match[0].match(/alt=["']([^"']*)["']/i);
      const alt = altMatch ? altMatch[1] : '';
      
      if (this.isValidImageUrl(url)) {
        const asset = await this.processImageUrl(url, alt, contentId, sourceType, 'img-src');
        if (asset) assets.push(asset);
      }
    }

    // Extract background images
    while ((match = backgroundRegex.exec(html)) !== null) {
      const url = match[1];
      
      if (this.isValidImageUrl(url)) {
        const asset = await this.processImageUrl(url, '', contentId, sourceType, 'background');
        if (asset) assets.push(asset);
      }
    }

    // Extract srcset URLs
    while ((match = srcsetRegex.exec(html)) !== null) {
      const srcset = match[1];
      const urls = this.parseSrcset(srcset);
      
      for (const { url } of urls) {
        if (this.isValidImageUrl(url)) {
          const asset = await this.processImageUrl(url, '', contentId, sourceType, 'srcset');
          if (asset) assets.push(asset);
        }
      }
    }

    return assets;
  }

  /**
   * Extract assets from metadata object
   */
  private async extractFromMetadata(metadata: Record<string, any>, contentId: string): Promise<ExtractedAsset[]> {
    const assets: ExtractedAsset[] = [];

    const processValue = async (value: any, fieldName: string): Promise<void> => {
      if (typeof value === 'string' && this.isValidImageUrl(value)) {
        const asset = await this.processImageUrl(value, '', contentId, 'metadata', fieldName);
        if (asset) assets.push(asset);
      } else if (Array.isArray(value)) {
        for (const item of value) {
          await processValue(item, fieldName);
        }
      } else if (typeof value === 'object' && value !== null) {
        for (const [key, val] of Object.entries(value)) {
          await processValue(val, `${fieldName}.${key}`);
        }
      }
    };

    for (const [fieldName, value] of Object.entries(metadata)) {
      await processValue(value, fieldName);
    }

    return assets;
  }

  /**
   * Process a single image URL
   */
  private async processImageUrl(
    url: string, 
    alt: string, 
    contentId: string, 
    sourceType: 'content' | 'metadata', 
    fieldName: string
  ): Promise<ExtractedAsset | null> {
    try {
      // Check if we already have this asset
      const existingAsset = this.manifestManager.getAsset(url);
      if (existingAsset) {
        return {
          ...existingAsset,
          sourceType,
          contentId,
          fieldName,
          context: alt
        } as ExtractedAsset;
      }

      // Download and optimize if enabled
      if (this.options.downloadImages) {
        const optimizedAsset = await this.optimizer.downloadAndOptimize(url, alt);
        
        const extractedAsset: ExtractedAsset = {
          ...optimizedAsset,
          sourceType,
          contentId,
          fieldName,
          context: alt
        };

        // Add to manifest
        this.manifestManager.addAsset(url, optimizedAsset);
        
        return extractedAsset;
      }

      // Just create asset metadata without downloading
      return {
        url,
        alt,
        sourceType,
        contentId,
        fieldName,
        context: alt
      };
    } catch (error) {
      console.error(`Failed to process image URL ${url}:`, error);
      return null;
    }
  }

  /**
   * Check if URL is a valid image URL
   */
  private isValidImageUrl(url: string): boolean {
    try {
      const parsedUrl = new URL(url, 'https://example.com');
      
      // Check domain whitelist
      if (this.options.allowedDomains.length > 0) {
        const hostname = parsedUrl.hostname;
        if (!this.options.allowedDomains.some(domain => hostname.includes(domain))) {
          return false;
        }
      }

      // Check file extension
      const pathname = parsedUrl.pathname.toLowerCase();
      const hasValidExtension = this.options.supportedFormats.some(format => 
        pathname.endsWith(`.${format}`)
      );

      // Also check for Webflow-style URLs without extensions
      const isWebflowUrl = hostname.includes('webflow.com') || hostname.includes('website-files.com');
      
      return hasValidExtension || isWebflowUrl;
    } catch {
      return false;
    }
  }

  /**
   * Parse srcset attribute
   */
  private parseSrcset(srcset: string): Array<{ url: string; width?: number }> {
    return srcset
      .split(',')
      .map(entry => entry.trim())
      .map(entry => {
        const parts = entry.split(/\s+/);
        const url = parts[0];
        const descriptor = parts[1];
        
        let width: number | undefined;
        if (descriptor && descriptor.endsWith('w')) {
          width = parseInt(descriptor.slice(0, -1));
        }
        
        return { url, width };
      })
      .filter(entry => entry.url);
  }

  /**
   * Remove duplicate assets based on URL
   */
  private deduplicateAssets(assets: ExtractedAsset[]): ExtractedAsset[] {
    const seen = new Set<string>();
    return assets.filter(asset => {
      if (seen.has(asset.url)) {
        return false;
      }
      seen.add(asset.url);
      return true;
    });
  }

  /**
   * Get asset statistics
   */
  getAssetStats(assets: ExtractedAsset[]): {
    total: number;
    bySourceType: Record<string, number>;
    byFormat: Record<string, number>;
    totalSize: number;
    optimizedCount: number;
  } {
    const stats = {
      total: assets.length,
      bySourceType: {} as Record<string, number>,
      byFormat: {} as Record<string, number>,
      totalSize: 0,
      optimizedCount: 0
    };

    assets.forEach(asset => {
      // Count by source type
      stats.bySourceType[asset.sourceType] = (stats.bySourceType[asset.sourceType] || 0) + 1;
      
      // Count by format
      if (asset.format) {
        stats.byFormat[asset.format] = (stats.byFormat[asset.format] || 0) + 1;
      }
      
      // Add to total size
      if (asset.size) {
        stats.totalSize += asset.size;
      }
      
      // Count optimized assets
      if (asset.optimizedPath) {
        stats.optimizedCount++;
      }
    });

    return stats;
  }

  /**
   * Generate asset report
   */
  generateAssetReport(assets: ExtractedAsset[]): string {
    const stats = this.getAssetStats(assets);
    
    const report = [
      '# Webflow Asset Extraction Report',
      '',
      `**Total Assets:** ${stats.total}`,
      `**Optimized Assets:** ${stats.optimizedCount}`,
      `**Total Size:** ${(stats.totalSize / 1024 / 1024).toFixed(2)} MB`,
      '',
      '## By Source Type',
      ...Object.entries(stats.bySourceType).map(([type, count]) => `- ${type}: ${count}`),
      '',
      '## By Format',
      ...Object.entries(stats.byFormat).map(([format, count]) => `- ${format}: ${count}`),
      '',
      '## Asset Details',
      ...assets.slice(0, 10).map(asset => 
        `- **${asset.url}** (${asset.sourceType}) - ${asset.width}x${asset.height} - ${asset.format}`
      ),
      assets.length > 10 ? `... and ${assets.length - 10} more assets` : ''
    ].join('\n');

    return report;
  }
}

// Utility function to extract assets from scraped content
export async function extractWebflowAssets(
  content: ContentItem[], 
  options?: WebflowAssetExtractionOptions
): Promise<ExtractedAsset[]> {
  const extractor = new WebflowAssetExtractor(options);
  return await extractor.extractFromContent(content);
}

// Utility function to get optimized image component props
export function getOptimizedImageProps(asset: ExtractedAsset) {
  return {
    asset,
    alt: asset.alt || asset.context || 'Image',
    width: asset.width || 800,
    height: asset.height || 600
  };
}