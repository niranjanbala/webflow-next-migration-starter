/**
 * @jest-environment jsdom
 */

import {
  optimizedImageLoader,
  generateResponsiveUrls,
  generateSrcSet,
  generateSizesAttribute,
  supportsWebP,
  supportsAVIF,
  getBestSupportedFormat,
  preloadImage,
  LazyImageLoader
} from '../image-loader';

describe('Image Loader', () => {
  describe('optimizedImageLoader', () => {
    it('returns external URLs as-is', () => {
      const externalUrl = 'https://example.com/image.jpg';
      const result = optimizedImageLoader({ src: externalUrl, width: 800 });
      expect(result).toBe(externalUrl);
    });

    it('handles optimized images with auto optimization', () => {
      const src = '/optimized-images/test-image.jpg';
      const result = optimizedImageLoader({ 
        src, 
        width: 800, 
        format: 'webp',
        optimization: 'auto'
      });
      expect(result).toBe('/optimized-images/test-image-800w.webp');
    });

    it('handles optimized images with manual optimization', () => {
      const src = '/optimized-images/test-image.jpg';
      const result = optimizedImageLoader({ 
        src, 
        width: 800, 
        format: 'webp',
        optimization: 'manual'
      });
      expect(result).toBe('/optimized-images/test-image.webp');
    });

    it('uses original format when specified', () => {
      const src = '/optimized-images/test-image.jpg';
      const result = optimizedImageLoader({ 
        src, 
        width: 800, 
        format: 'original',
        optimization: 'auto'
      });
      expect(result).toBe('/optimized-images/test-image-800w.jpg');
    });

    it('handles regular local images', () => {
      const src = '/images/regular-image.jpg';
      const result = optimizedImageLoader({ src, width: 800, quality: 85 });
      expect(result).toContain('/_next/image?');
      expect(result).toContain('url=%2Fimages%2Fregular-image.jpg');
      expect(result).toContain('w=800');
      expect(result).toContain('q=85');
    });
  });

  describe('generateResponsiveUrls', () => {
    it('generates URLs for different sizes', () => {
      const src = '/optimized-images/test-image.jpg';
      const sizes = [640, 1024, 1920];
      const urls = generateResponsiveUrls(src, sizes, 'webp');

      expect(urls).toHaveLength(3);
      expect(urls[0]).toEqual({
        url: '/optimized-images/test-image-640w.webp',
        width: 640
      });
      expect(urls[1]).toEqual({
        url: '/optimized-images/test-image-1024w.webp',
        width: 1024
      });
      expect(urls[2]).toEqual({
        url: '/optimized-images/test-image-1920w.webp',
        width: 1920
      });
    });

    it('uses default sizes when not provided', () => {
      const src = '/optimized-images/test-image.jpg';
      const urls = generateResponsiveUrls(src);

      expect(urls.length).toBeGreaterThan(0);
      expect(urls[0].width).toBe(640);
    });
  });

  describe('generateSrcSet', () => {
    it('generates srcSet string', () => {
      const src = '/optimized-images/test-image.jpg';
      const sizes = [640, 1024];
      const srcSet = generateSrcSet(src, sizes, 'webp');

      expect(srcSet).toBe('/optimized-images/test-image-640w.webp 640w, /optimized-images/test-image-1024w.webp 1024w');
    });
  });

  describe('generateSizesAttribute', () => {
    it('generates sizes attribute with default breakpoints', () => {
      const sizes = generateSizesAttribute();
      
      expect(sizes).toContain('(min-width: 1280px) 1280px');
      expect(sizes).toContain('(min-width: 1024px) 1024px');
      expect(sizes).toContain('100vw');
    });

    it('generates sizes attribute with custom breakpoints', () => {
      const breakpoints = [
        { minWidth: 768, size: '50vw' },
        { size: '100vw' }
      ];
      const sizes = generateSizesAttribute(breakpoints);
      
      expect(sizes).toBe('(min-width: 768px) 50vw, 100vw');
    });
  });

  describe('Format Support Detection', () => {
    beforeEach(() => {
      // Reset DOM
      document.head.innerHTML = '';
    });

    it('detects WebP support', async () => {
      // Mock Image constructor
      const mockImage = {
        onload: null as any,
        onerror: null as any,
        height: 2,
        src: ''
      };

      global.Image = jest.fn(() => mockImage) as any;

      const supportPromise = supportsWebP();
      
      // Simulate successful load
      if (mockImage.onload) {
        mockImage.onload();
      }

      const result = await supportPromise;
      expect(result).toBe(true);
    });

    it('detects AVIF support', async () => {
      const mockImage = {
        onload: null as any,
        onerror: null as any,
        height: 2,
        src: ''
      };

      global.Image = jest.fn(() => mockImage) as any;

      const supportPromise = supportsAVIF();
      
      if (mockImage.onload) {
        mockImage.onload();
      }

      const result = await supportPromise;
      expect(result).toBe(true);
    });

    it('returns best supported format', async () => {
      // Mock both formats as supported
      const mockImage = {
        onload: null as any,
        onerror: null as any,
        height: 2,
        src: ''
      };

      global.Image = jest.fn(() => mockImage) as any;

      const formatPromise = getBestSupportedFormat();
      
      // Trigger the onload callbacks immediately
      setTimeout(() => {
        if (mockImage.onload) {
          mockImage.onload();
        }
      }, 0);

      const format = await formatPromise;
      expect(['avif', 'webp', 'original']).toContain(format);
    }, 10000);
  });

  describe('preloadImage', () => {
    beforeEach(() => {
      document.head.innerHTML = '';
    });

    it('creates preload link element', () => {
      const src = '/test-image.jpg';
      preloadImage(src);

      const link = document.head.querySelector('link[rel="preload"]') as HTMLLinkElement;
      expect(link).toBeTruthy();
      expect(link.href).toContain(src);
      expect(link.as).toBe('image');
    });

    it('creates preload link with options', () => {
      const src = '/test-image.jpg';
      preloadImage(src, {
        crossOrigin: 'anonymous',
        sizes: '(max-width: 768px) 100vw, 50vw',
        type: 'image/webp'
      });

      const link = document.head.querySelector('link[rel="preload"]') as HTMLLinkElement;
      expect(link.crossOrigin).toBe('anonymous');
      expect(link.getAttribute('imagesizes')).toBe('(max-width: 768px) 100vw, 50vw');
      expect(link.type).toBe('image/webp');
    });
  });

  describe('LazyImageLoader', () => {
    let loader: LazyImageLoader;
    let mockObserver: any;

    beforeEach(() => {
      // Mock IntersectionObserver
      mockObserver = {
        observe: jest.fn(),
        unobserve: jest.fn(),
        disconnect: jest.fn()
      };

      global.IntersectionObserver = jest.fn(() => mockObserver) as any;
      
      loader = new LazyImageLoader();
    });

    afterEach(() => {
      loader.disconnect();
    });

    it('creates lazy image loader', () => {
      expect(loader).toBeInstanceOf(LazyImageLoader);
      expect(IntersectionObserver).toHaveBeenCalled();
    });

    it('observes images', () => {
      const img = document.createElement('img');
      loader.observe(img);

      expect(mockObserver.observe).toHaveBeenCalledWith(img);
    });

    it('unobserves images', () => {
      const img = document.createElement('img');
      loader.observe(img);
      loader.unobserve(img);

      expect(mockObserver.unobserve).toHaveBeenCalledWith(img);
    });

    it('disconnects observer', () => {
      loader.disconnect();
      expect(mockObserver.disconnect).toHaveBeenCalled();
    });
  });
});