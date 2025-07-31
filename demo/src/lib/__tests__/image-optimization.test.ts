/**
 * @jest-environment jsdom
 */

import {
  ImageOptimizer,
  generateBlurDataURL,
  getImageProps,
  AssetManifestManager
} from '../image-optimization';

// Mock fetch for testing
global.fetch = jest.fn();

describe('Image Optimization', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('ImageOptimizer', () => {
    let optimizer: ImageOptimizer;

    beforeEach(() => {
      optimizer = new ImageOptimizer({
        quality: 85,
        formats: ['webp', 'original'],
        sizes: [640, 1024, 1920],
        outputDir: 'test-output'
      });
    });

    it('creates optimizer with default options', () => {
      const defaultOptimizer = new ImageOptimizer();
      expect(defaultOptimizer).toBeInstanceOf(ImageOptimizer);
    });

    it('creates optimizer with custom options', () => {
      expect(optimizer).toBeInstanceOf(ImageOptimizer);
    });

    it('generates responsive image set', () => {
      const asset = {
        url: 'https://example.com/image.jpg',
        alt: 'Test image',
        width: 1920,
        height: 1080,
        format: 'jpg',
        optimizedPath: '/optimized/test-image.webp'
      };

      const responsiveSet = optimizer.generateResponsiveImageSet(asset);

      expect(responsiveSet).toHaveProperty('src');
      expect(responsiveSet).toHaveProperty('srcSet');
      expect(responsiveSet).toHaveProperty('sizes');
      expect(responsiveSet.width).toBe(1920);
      expect(responsiveSet.height).toBe(1080);
      expect(responsiveSet.alt).toBe('Test image');
    });

    it('throws error for asset without dimensions', () => {
      const asset = {
        url: 'https://example.com/image.jpg',
        alt: 'Test image'
      };

      expect(() => {
        optimizer.generateResponsiveImageSet(asset);
      }).toThrow('Asset must have dimensions and optimized path');
    });

    it('gets optimized image URL', () => {
      const asset = {
        url: 'https://example.com/image.jpg',
        alt: 'Test image',
        width: 1920,
        height: 1080,
        format: 'jpg',
        optimizedPath: '/optimized/test-image.webp'
      };

      const url = optimizer.getOptimizedImageUrl(asset, 1024, 'webp');
      expect(url).toBe('/optimized/test-image-1024w.webp');
    });

    it('returns original URL when no optimized path', () => {
      const asset = {
        url: 'https://example.com/image.jpg',
        alt: 'Test image'
      };

      const url = optimizer.getOptimizedImageUrl(asset);
      expect(url).toBe('https://example.com/image.jpg');
    });
  });

  describe('generateBlurDataURL', () => {
    it('generates blur data URL for given dimensions', () => {
      const blurDataURL = generateBlurDataURL(800, 600);
      
      expect(blurDataURL).toMatch(/^data:image\/svg\+xml;base64,/);
      expect(typeof blurDataURL).toBe('string');
    });

    it('handles different aspect ratios', () => {
      const square = generateBlurDataURL(400, 400);
      const wide = generateBlurDataURL(1920, 1080);
      const tall = generateBlurDataURL(600, 800);
      
      expect(square).toMatch(/^data:image\/svg\+xml;base64,/);
      expect(wide).toMatch(/^data:image\/svg\+xml;base64,/);
      expect(tall).toMatch(/^data:image\/svg\+xml;base64,/);
    });
  });

  describe('getImageProps', () => {
    it('generates props for Next.js Image component', () => {
      const asset = {
        url: 'https://example.com/image.jpg',
        alt: 'Test image',
        width: 800,
        height: 600,
        format: 'jpg',
        optimizedPath: '/optimized/test-image.webp'
      };

      const props = getImageProps(asset, {
        width: 400,
        height: 300,
        quality: 90,
        priority: true
      });

      expect(props).toHaveProperty('src');
      expect(props).toHaveProperty('srcSet');
      expect(props).toHaveProperty('sizes');
      expect(props.width).toBe(400);
      expect(props.height).toBe(300);
      expect(props.alt).toBe('Test image');
      expect(props.quality).toBe(90);
      expect(props.priority).toBe(true);
      expect(props.placeholder).toBe('blur');
      expect(props.blurDataURL).toMatch(/^data:image\/svg\+xml;base64,/);
    });

    it('uses default options when not provided', () => {
      const asset = {
        url: 'https://example.com/image.jpg',
        alt: 'Test image',
        width: 800,
        height: 600,
        format: 'jpg',
        optimizedPath: '/optimized/test-image.webp'
      };

      const props = getImageProps(asset);

      expect(props.width).toBe(800);
      expect(props.height).toBe(600);
      expect(props.quality).toBe(85);
      expect(props.priority).toBe(false);
    });
  });

  describe('AssetManifestManager', () => {
    let manifestManager: AssetManifestManager;

    beforeEach(() => {
      manifestManager = new AssetManifestManager('test-manifest.json');
    });

    it('creates manifest manager with default path', () => {
      const defaultManager = new AssetManifestManager();
      expect(defaultManager).toBeInstanceOf(AssetManifestManager);
    });

    it('adds and retrieves assets', () => {
      const asset = {
        url: 'https://example.com/image.jpg',
        alt: 'Test image',
        width: 800,
        height: 600,
        format: 'jpg'
      };

      manifestManager.addAsset('test-url', asset);
      const retrieved = manifestManager.getAsset('test-url');

      expect(retrieved).toEqual(asset);
    });

    it('returns undefined for non-existent asset', () => {
      const retrieved = manifestManager.getAsset('non-existent');
      expect(retrieved).toBeUndefined();
    });

    it('removes assets', () => {
      const asset = {
        url: 'https://example.com/image.jpg',
        alt: 'Test image'
      };

      manifestManager.addAsset('test-url', asset);
      manifestManager.removeAsset('test-url');
      
      const retrieved = manifestManager.getAsset('test-url');
      expect(retrieved).toBeUndefined();
    });

    it('clears all assets', () => {
      const asset1 = { url: 'https://example.com/image1.jpg', alt: 'Image 1' };
      const asset2 = { url: 'https://example.com/image2.jpg', alt: 'Image 2' };

      manifestManager.addAsset('url1', asset1);
      manifestManager.addAsset('url2', asset2);
      
      expect(Object.keys(manifestManager.getAllAssets())).toHaveLength(2);
      
      manifestManager.clear();
      
      expect(Object.keys(manifestManager.getAllAssets())).toHaveLength(0);
    });

    it('gets all assets', () => {
      const asset1 = { url: 'https://example.com/image1.jpg', alt: 'Image 1' };
      const asset2 = { url: 'https://example.com/image2.jpg', alt: 'Image 2' };

      manifestManager.addAsset('url1', asset1);
      manifestManager.addAsset('url2', asset2);
      
      const allAssets = manifestManager.getAllAssets();
      
      expect(allAssets).toHaveProperty('url1');
      expect(allAssets).toHaveProperty('url2');
      expect(allAssets.url1).toEqual(asset1);
      expect(allAssets.url2).toEqual(asset2);
    });
  });
});