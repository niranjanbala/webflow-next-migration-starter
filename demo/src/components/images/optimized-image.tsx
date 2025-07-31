'use client';

import Image, { ImageProps } from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ImageAsset {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
}

interface OptimizedImageProps extends Omit<ImageProps, 'src' | 'alt'> {
  asset?: ImageAsset;
  src?: string;
  alt: string;
  fallbackSrc?: string;
  showPlaceholder?: boolean;
  onLoadingComplete?: () => void;
  onError?: () => void;
}

export default function OptimizedImage({
  asset,
  src,
  alt,
  fallbackSrc,
  showPlaceholder = true,
  onLoadingComplete,
  onError,
  className,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Use asset if provided, otherwise create a basic one from src
  const imageAsset = asset || {
    url: src || '',
    alt,
    width: props.width as number,
    height: props.height as number
  };

  const handleLoadingComplete = () => {
    setIsLoading(false);
    onLoadingComplete?.();
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    onError?.();
  };

  // If we have an optimized asset, use the optimized props
  if (asset && asset.optimizedPath) {
    const optimizedProps = getImageProps(asset, {
      width: props.width as number,
      height: props.height as number,
      quality: props.quality,
      priority: props.priority,
      sizes: props.sizes
    });

    return (
      <div className={cn('relative overflow-hidden', className)}>
        {showPlaceholder && isLoading && (
          <div 
            className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center"
            style={{ aspectRatio: `${optimizedProps.width} / ${optimizedProps.height}` }}
          >
            <svg 
              className="w-8 h-8 text-gray-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
              />
            </svg>
          </div>
        )}
        
        {hasError && fallbackSrc ? (
          <Image
            {...props}
            src={fallbackSrc}
            alt={alt}
            onLoadingComplete={handleLoadingComplete}
            className={cn('transition-opacity duration-300', isLoading ? 'opacity-0' : 'opacity-100')}
          />
        ) : (
          <Image
            {...optimizedProps}
            {...props}
            alt={alt}
            onLoadingComplete={handleLoadingComplete}
            onError={handleError}
            className={cn('transition-opacity duration-300', isLoading ? 'opacity-0' : 'opacity-100')}
          />
        )}
      </div>
    );
  }

  // Fallback to regular Next.js Image
  return (
    <div className={cn('relative overflow-hidden', className)}>
      {showPlaceholder && isLoading && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center"
          style={{ aspectRatio: `${props.width} / ${props.height}` }}
        >
          <svg 
            className="w-8 h-8 text-gray-400" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
            />
          </svg>
        </div>
      )}
      
      <Image
        {...props}
        src={hasError && fallbackSrc ? fallbackSrc : (src || imageAsset.url)}
        alt={alt}
        onLoadingComplete={handleLoadingComplete}
        onError={handleError}
        className={cn('transition-opacity duration-300', isLoading ? 'opacity-0' : 'opacity-100')}
      />
    </div>
  );
}

// Gallery component for multiple optimized images
interface OptimizedImageGalleryProps {
  images: Array<{
    asset?: ImageAsset;
    src?: string;
    alt: string;
    caption?: string;
  }>;
  columns?: number;
  gap?: number;
  className?: string;
}

export function OptimizedImageGallery({
  images,
  columns = 3,
  gap = 4,
  className = ''
}: OptimizedImageGalleryProps) {
  return (
    <div 
      className={cn(
        'grid',
        `grid-cols-1 md:grid-cols-${Math.min(columns, 3)} lg:grid-cols-${columns}`,
        `gap-${gap}`,
        className
      )}
    >
      {images.map((image, index) => (
        <div key={index} className="space-y-2">
          <OptimizedImage
            asset={image.asset}
            src={image.src}
            alt={image.alt}
            width={400}
            height={300}
            className="w-full h-auto rounded-lg"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {image.caption && (
            <p className="text-sm text-gray-600 text-center">
              {image.caption}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

// Hero image component with optimized loading
interface OptimizedHeroImageProps {
  asset?: ImageAsset;
  src?: string;
  alt: string;
  overlay?: boolean;
  overlayColor?: string;
  overlayOpacity?: number;
  children?: React.ReactNode;
  className?: string;
}

export function OptimizedHeroImage({
  asset,
  src,
  alt,
  overlay = false,
  overlayColor = 'black',
  overlayOpacity = 0.4,
  children,
  className = ''
}: OptimizedHeroImageProps) {
  return (
    <div className={cn('relative w-full h-screen overflow-hidden', className)}>
      <OptimizedImage
        asset={asset}
        src={src}
        alt={alt}
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      
      {overlay && (
        <div 
          className="absolute inset-0"
          style={{
            backgroundColor: overlayColor,
            opacity: overlayOpacity
          }}
        />
      )}
      
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white z-10">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}