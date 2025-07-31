import Image from 'next/image';
import { cn } from '@/lib/utils';
import { WImageProps } from './types';

export default function WImage({
  src,
  alt,
  className = '',
  width,
  height,
  objectFit = 'cover',
  loading = 'lazy',
  priority = false,
  placeholder = 'empty',
  blurDataURL,
  id,
  'data-w-id': dataWId,
  ...props
}: WImageProps) {
  const objectFitClasses = {
    contain: 'object-contain',
    cover: 'object-cover',
    fill: 'object-fill',
    none: 'object-none',
    'scale-down': 'object-scale-down'
  };

  const imageClasses = cn(
    'w-image',
    objectFitClasses[objectFit],
    className
  );

  // Handle responsive images
  if (typeof width === 'string' && typeof height === 'string') {
    return (
      <div
        className={cn('relative', width, height)}
        id={id}
        data-w-id={dataWId}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className={imageClasses}
          loading={loading}
          priority={priority}
          placeholder={placeholder}
          blurDataURL={blurDataURL}
          {...props}
        />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={typeof width === 'number' ? width : parseInt(width || '0')}
      height={typeof height === 'number' ? height : parseInt(height || '0')}
      className={imageClasses}
      loading={loading}
      priority={priority}
      placeholder={placeholder}
      blurDataURL={blurDataURL}
      id={id}
      data-w-id={dataWId}
      {...props}
    />
  );
}