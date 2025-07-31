import { promises as fs } from 'fs';
import path from 'path';
import { createHash } from 'crypto';

export interface ImageAsset {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
  format?: string;
  size?: number;
  localPath?: string;
  optimizedPath?: string;
  hash?: string;
}

export interface ImageOptimizationOptions {
  quality?: number;
  formats?: string[];
  sizes?: number[];
  outputDir?: string;
  maxWidth?: number;
  maxHeight?: number;
  progressive?: boolean;
  webpQuality?: number;
  avifQuality?: number;
}

export interface ResponsiveImageSet {
  src: string;
  srcSet: string;
  sizes: string;
  width: number;
  height: number;
  alt: string;
  formats: {
    webp?: string;
    avif?: string;
    original: string;
  };
}

const DEFAULT_OPTIONS: Required<ImageOptimizationOptions> = {
  quality: 85,
  formats: ['webp', 'avif', 'original'],
  sizes: [640, 768, 1024, 1280, 1920],
  outputDir: 'public/optimized-images',
  maxWidth: 1920,
  maxHeight: 1080,
  progressive: true,
  webpQuality: 80,
  avifQuality: 75
};

export class ImageOptimizer {
  private options: Required<ImageOptimizationOptions>;
  private cache: Map<string, ImageAsset> = new Map();

  constructor(options: ImageOptimizationOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  /**
   * Download and optimize an image from a URL
   */
  async downloadAndOptimize(url: string, alt?: string): Promise<ImageAsset> {
    const hash = this.generateHash(url);
    
    // Check cache first
    if (this.cache.has(hash)) {
      return this.cache.get(hash)!;
    }

    try {
      // Download the image
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to download image: ${response.statusText}`);
      }

      const buffer = await response.arrayBuffer();
      const imageBuffer = Buffer.from(buffer);
      
      // Get image metadata
      const metadata = await this.getImageMetadata(imageBuffer);
      
      // Create asset object
      const asset: ImageAsset = {
        url,
        alt,
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        size: imageBuffer.length,
        hash
      };

      // Save original image
      const originalPath = await this.saveImage(imageBuffer, hash, metadata.format);
      asset.localPath = originalPath;

      // Generate optimized versions
      asset.optimizedPath = await this.generateOptimizedVersions(imageBuffer, hash, metadata);

      // Cache the result
      this.cache.set(hash, asset);
      
      return asset;
    } catch (error) {
      console.error(`Failed to download and optimize image ${url}:`, error);
      throw error;
    }
  }

  /**
   * Generate responsive image set for Next.js Image component
   */
  generateResponsiveImageSet(asset: ImageAsset): ResponsiveImageSet {
    if (!asset.width || !asset.height || !asset.optimizedPath) {
      throw new Error('Asset must have dimensions and optimized path');
    }

    const aspectRatio = asset.width / asset.height;
    const basePath = asset.optimizedPath.replace(/\.[^/.]+$/, '');
    
    // Generate srcSet for different sizes
    const srcSetEntries: string[] = [];
    const availableSizes = this.options.sizes.filter(size => size <= asset.width!);
    
    availableSizes.forEach(width => {
      const height = Math.round(width / aspectRatio);
      srcSetEntries.push(`${basePath}-${width}w.webp ${width}w`);
    });

    const srcSet = srcSetEntries.join(', ');
    
    // Generate sizes attribute
    const sizes = this.generateSizesAttribute(availableSizes);

    return {
      src: `${basePath}-${availableSizes[0] || asset.width}w.webp`,
      srcSet,
      sizes,
      width: asset.width,
      height: asset.height,
      alt: asset.alt || '',
      formats: {
        webp: `${basePath}.webp`,
        avif: `${basePath}.avif`,
        original: asset.localPath || asset.url
      }
    };
  }

  /**
   * Batch process multiple images
   */
  async batchOptimize(urls: string[]): Promise<ImageAsset[]> {
    const results: ImageAsset[] = [];
    const batchSize = 5; // Process 5 images at a time to avoid overwhelming the server

    for (let i = 0; i < urls.length; i += batchSize) {
      const batch = urls.slice(i, i + batchSize);
      const batchPromises = batch.map(url => this.downloadAndOptimize(url));
      
      try {
        const batchResults = await Promise.allSettled(batchPromises);
        
        batchResults.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            results.push(result.value);
          } else {
            console.error(`Failed to process image ${batch[index]}:`, result.reason);
          }
        });
      } catch (error) {
        console.error('Batch processing error:', error);
      }

      // Add delay between batches to be respectful to the server
      if (i + batchSize < urls.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return results;
  }

  /**
   * Get optimized image URL for Next.js Image component
   */
  getOptimizedImageUrl(asset: ImageAsset, width?: number, format: 'webp' | 'avif' | 'original' = 'webp'): string {
    if (!asset.optimizedPath) {
      return asset.url; // Fallback to original URL
    }

    const basePath = asset.optimizedPath.replace(/\.[^/.]+$/, '');
    
    if (width) {
      return `${basePath}-${width}w.${format === 'original' ? asset.format : format}`;
    }
    
    return `${basePath}.${format === 'original' ? asset.format : format}`;
  }

  /**
   * Clean up old optimized images
   */
  async cleanup(maxAge: number = 7 * 24 * 60 * 60 * 1000): Promise<void> {
    try {
      const outputDir = path.join(process.cwd(), this.options.outputDir);
      const files = await fs.readdir(outputDir);
      const now = Date.now();

      for (const file of files) {
        const filePath = path.join(outputDir, file);
        const stats = await fs.stat(filePath);
        
        if (now - stats.mtime.getTime() > maxAge) {
          await fs.unlink(filePath);
          console.log(`Cleaned up old image: ${file}`);
        }
      }
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  }

  private generateHash(input: string): string {
    return createHash('md5').update(input).digest('hex');
  }

  private async getImageMetadata(buffer: Buffer): Promise<{
    width: number;
    height: number;
    format: string;
  }> {
    // Simple image metadata extraction
    // In a real implementation, you'd use a library like 'sharp' or 'image-size'
    
    // Check for JPEG
    if (buffer[0] === 0xFF && buffer[1] === 0xD8) {
      return this.getJpegMetadata(buffer);
    }
    
    // Check for PNG
    if (buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]))) {
      return this.getPngMetadata(buffer);
    }
    
    // Check for WebP
    if (buffer.subarray(0, 4).equals(Buffer.from('RIFF', 'ascii')) && 
        buffer.subarray(8, 12).equals(Buffer.from('WEBP', 'ascii'))) {
      return this.getWebpMetadata(buffer);
    }
    
    // Default fallback
    return {
      width: 800,
      height: 600,
      format: 'jpg'
    };
  }

  private getJpegMetadata(buffer: Buffer): { width: number; height: number; format: string } {
    // Simplified JPEG metadata extraction
    let offset = 2;
    
    while (offset < buffer.length) {
      if (buffer[offset] === 0xFF) {
        const marker = buffer[offset + 1];
        
        if (marker === 0xC0 || marker === 0xC2) { // SOF0 or SOF2
          const height = buffer.readUInt16BE(offset + 5);
          const width = buffer.readUInt16BE(offset + 7);
          return { width, height, format: 'jpg' };
        }
        
        const length = buffer.readUInt16BE(offset + 2);
        offset += length + 2;
      } else {
        offset++;
      }
    }
    
    return { width: 800, height: 600, format: 'jpg' };
  }

  private getPngMetadata(buffer: Buffer): { width: number; height: number; format: string } {
    const width = buffer.readUInt32BE(16);
    const height = buffer.readUInt32BE(20);
    return { width, height, format: 'png' };
  }

  private getWebpMetadata(buffer: Buffer): { width: number; height: number; format: string } {
    // Simplified WebP metadata extraction
    const width = buffer.readUInt16LE(26) + 1;
    const height = buffer.readUInt16LE(28) + 1;
    return { width, height, format: 'webp' };
  }

  private async saveImage(buffer: Buffer, hash: string, format: string): Promise<string> {
    const outputDir = path.join(process.cwd(), this.options.outputDir);
    await fs.mkdir(outputDir, { recursive: true });
    
    const filename = `${hash}.${format}`;
    const filepath = path.join(outputDir, filename);
    
    await fs.writeFile(filepath, buffer);
    
    return filepath;
  }

  private async generateOptimizedVersions(
    buffer: Buffer, 
    hash: string, 
    metadata: { width: number; height: number; format: string }
  ): Promise<string> {
    // In a real implementation, you'd use Sharp or similar for actual image processing
    // For now, we'll simulate the process and return the original path
    
    const outputDir = path.join(process.cwd(), this.options.outputDir);
    const basePath = path.join(outputDir, hash);
    
    // Simulate generating different formats and sizes
    const formats = ['webp', 'avif'];
    const sizes = this.options.sizes.filter(size => size <= metadata.width);
    
    // Create placeholder files (in real implementation, these would be actual optimized images)
    for (const format of formats) {
      const formatPath = `${basePath}.${format}`;
      await fs.writeFile(formatPath, buffer); // Placeholder - would be optimized
      
      for (const size of sizes) {
        const sizePath = `${basePath}-${size}w.${format}`;
        await fs.writeFile(sizePath, buffer); // Placeholder - would be resized and optimized
      }
    }
    
    return `${basePath}.webp`;
  }

  private generateSizesAttribute(availableSizes: number[]): string {
    // Generate responsive sizes attribute
    const breakpoints = [
      { minWidth: 1280, size: '1280px' },
      { minWidth: 1024, size: '1024px' },
      { minWidth: 768, size: '768px' },
      { minWidth: 640, size: '640px' },
      { minWidth: 0, size: '100vw' }
    ];
    
    return breakpoints
      .filter(bp => availableSizes.some(size => size >= parseInt(bp.size)))
      .map(bp => bp.minWidth > 0 ? `(min-width: ${bp.minWidth}px) ${bp.size}` : bp.size)
      .join(', ');
  }
}

// Utility functions for Next.js Image component
export function getImageProps(asset: ImageAsset, options: {
  width?: number;
  height?: number;
  quality?: number;
  priority?: boolean;
  sizes?: string;
} = {}) {
  const optimizer = new ImageOptimizer();
  const responsiveSet = optimizer.generateResponsiveImageSet(asset);
  
  return {
    src: responsiveSet.src,
    srcSet: responsiveSet.srcSet,
    sizes: options.sizes || responsiveSet.sizes,
    width: options.width || responsiveSet.width,
    height: options.height || responsiveSet.height,
    alt: responsiveSet.alt,
    quality: options.quality || 85,
    priority: options.priority || false,
    placeholder: 'blur' as const,
    blurDataURL: generateBlurDataURL(asset.width || 800, asset.height || 600)
  };
}

export function generateBlurDataURL(width: number, height: number): string {
  // Generate a simple blur placeholder
  const aspectRatio = width / height;
  const blurWidth = 40;
  const blurHeight = Math.round(blurWidth / aspectRatio);
  
  // Create a simple SVG blur placeholder
  const svg = `
    <svg width="${blurWidth}" height="${blurHeight}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#f3f4f6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#e5e7eb;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad)" />
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

// Asset manifest for tracking optimized images
export interface AssetManifest {
  version: string;
  timestamp: number;
  assets: Record<string, ImageAsset>;
}

export class AssetManifestManager {
  private manifestPath: string;
  private manifest: AssetManifest;

  constructor(manifestPath: string = 'public/asset-manifest.json') {
    this.manifestPath = path.join(process.cwd(), manifestPath);
    this.manifest = {
      version: '1.0.0',
      timestamp: Date.now(),
      assets: {}
    };
  }

  async load(): Promise<void> {
    try {
      const content = await fs.readFile(this.manifestPath, 'utf-8');
      this.manifest = JSON.parse(content);
    } catch (error) {
      // Manifest doesn't exist, use default
      console.log('Asset manifest not found, creating new one');
    }
  }

  async save(): Promise<void> {
    this.manifest.timestamp = Date.now();
    await fs.writeFile(this.manifestPath, JSON.stringify(this.manifest, null, 2));
  }

  addAsset(url: string, asset: ImageAsset): void {
    this.manifest.assets[url] = asset;
  }

  getAsset(url: string): ImageAsset | undefined {
    return this.manifest.assets[url];
  }

  getAllAssets(): Record<string, ImageAsset> {
    return this.manifest.assets;
  }

  removeAsset(url: string): void {
    delete this.manifest.assets[url];
  }

  clear(): void {
    this.manifest.assets = {};
  }
}