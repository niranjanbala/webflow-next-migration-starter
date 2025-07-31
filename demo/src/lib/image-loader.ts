import { ImageLoaderProps } from 'next/image';

export interface OptimizedImageLoaderProps extends ImageLoaderProps {
  format?: 'webp' | 'avif' | 'original';
  optimization?: 'auto' | 'manual';
}

/**
 * Custom image loader for optimized images
 */
export function optimizedImageLoader({ 
  src, 
  width, 
  quality = 85,
  format = 'webp',
  optimization = 'auto'
}: OptimizedImageLoaderProps): string {
  // If it's already an external URL, return as-is
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }

  // If it's a local optimized image
  if (src.startsWith('/optimized-images/')) {
    const basePath = src.replace(/\.[^/.]+$/, '');
    const extension = format === 'original' ? getOriginalExtension(src) : format;
    
    if (optimization === 'auto') {
      return `${basePath}-${width}w.${extension}`;
    }
    
    return `${basePath}.${extension}`;
  }

  // For other local images, use Next.js default behavior
  const params = new URLSearchParams();
  params.set('url', src);
  params.set('w', width.toString());
  params.set('q', quality.toString());

  return `/_next/image?${params.toString()}`;
}

/**
 * Get the original file extension from a path
 */
function getOriginalExtension(src: string): string {
  const match = src.match(/\.([^/.]+)$/);
  return match ? match[1] : 'jpg';
}

/**
 * Generate responsive image URLs for different screen sizes
 */
export function generateResponsiveUrls(
  src: string, 
  sizes: number[] = [640, 768, 1024, 1280, 1920],
  format: 'webp' | 'avif' | 'original' = 'webp'
): Array<{ url: string; width: number }> {
  return sizes.map(width => ({
    url: optimizedImageLoader({ src, width, format }),
    width
  }));
}

/**
 * Generate srcSet string for responsive images
 */
export function generateSrcSet(
  src: string,
  sizes: number[] = [640, 768, 1024, 1280, 1920],
  format: 'webp' | 'avif' | 'original' = 'webp'
): string {
  const urls = generateResponsiveUrls(src, sizes, format);
  return urls.map(({ url, width }) => `${url} ${width}w`).join(', ');
}

/**
 * Generate sizes attribute for responsive images
 */
export function generateSizesAttribute(breakpoints: Array<{
  minWidth?: number;
  size: string;
}> = [
  { minWidth: 1280, size: '1280px' },
  { minWidth: 1024, size: '1024px' },
  { minWidth: 768, size: '768px' },
  { minWidth: 640, size: '640px' },
  { size: '100vw' }
]): string {
  return breakpoints
    .map(bp => bp.minWidth ? `(min-width: ${bp.minWidth}px) ${bp.size}` : bp.size)
    .join(', ');
}

/**
 * Check if browser supports WebP format
 */
export function supportsWebP(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }

    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
}

/**
 * Check if browser supports AVIF format
 */
export function supportsAVIF(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }

    const avif = new Image();
    avif.onload = avif.onerror = () => {
      resolve(avif.height === 2);
    };
    avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=';
  });
}

/**
 * Get the best supported format for the current browser
 */
export async function getBestSupportedFormat(): Promise<'avif' | 'webp' | 'original'> {
  if (await supportsAVIF()) {
    return 'avif';
  }
  
  if (await supportsWebP()) {
    return 'webp';
  }
  
  return 'original';
}

/**
 * Preload critical images
 */
export function preloadImage(
  src: string, 
  options: {
    as?: 'image';
    crossOrigin?: 'anonymous' | 'use-credentials';
    sizes?: string;
    type?: string;
  } = {}
): void {
  if (typeof window === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = src;
  link.as = options.as || 'image';
  
  if (options.crossOrigin) {
    link.crossOrigin = options.crossOrigin;
  }
  
  if (options.sizes) {
    link.setAttribute('imagesizes', options.sizes);
  }
  
  if (options.type) {
    link.type = options.type;
  }

  document.head.appendChild(link);
}

/**
 * Lazy load images with Intersection Observer
 */
export class LazyImageLoader {
  private observer: IntersectionObserver | null = null;
  private images: Set<HTMLImageElement> = new Set();

  constructor(options: IntersectionObserverInit = {}) {
    if (typeof window === 'undefined') return;

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          this.loadImage(img);
          this.observer?.unobserve(img);
          this.images.delete(img);
        }
      });
    }, {
      rootMargin: '50px',
      threshold: 0.1,
      ...options
    });
  }

  observe(img: HTMLImageElement): void {
    if (!this.observer) return;
    
    this.images.add(img);
    this.observer.observe(img);
  }

  unobserve(img: HTMLImageElement): void {
    if (!this.observer) return;
    
    this.observer.unobserve(img);
    this.images.delete(img);
  }

  private loadImage(img: HTMLImageElement): void {
    const dataSrc = img.dataset.src;
    const dataSrcSet = img.dataset.srcset;
    
    if (dataSrc) {
      img.src = dataSrc;
      img.removeAttribute('data-src');
    }
    
    if (dataSrcSet) {
      img.srcset = dataSrcSet;
      img.removeAttribute('data-srcset');
    }
    
    img.classList.remove('lazy');
    img.classList.add('loaded');
  }

  disconnect(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.images.clear();
    }
  }
}

// Global lazy loader instance
let globalLazyLoader: LazyImageLoader | null = null;

export function getGlobalLazyLoader(): LazyImageLoader {
  if (!globalLazyLoader) {
    globalLazyLoader = new LazyImageLoader();
  }
  return globalLazyLoader;
}