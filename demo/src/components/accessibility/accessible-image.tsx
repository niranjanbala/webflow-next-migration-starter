import Image, { ImageProps } from 'next/image';
import { AltTextGenerator } from '@/lib/accessibility';
import { cn } from '@/lib/utils';

interface AccessibleImageProps extends Omit<ImageProps, 'alt'> {
  alt?: string;
  decorative?: boolean;
  context?: string;
  longDescription?: string;
  longDescriptionId?: string;
}

export default function AccessibleImage({
  alt,
  decorative = false,
  context,
  longDescription,
  longDescriptionId,
  className,
  ...props
}: AccessibleImageProps) {
  // Generate alt text if not provided and not decorative
  const altText = decorative 
    ? '' 
    : alt || AltTextGenerator.generateImageAlt(props.src as string, context);

  // Validate alt text in development
  if (process.env.NODE_ENV === 'development' && !decorative && altText) {
    const validation = AltTextGenerator.validateAltText(altText);
    if (!validation.isValid) {
      console.warn('Alt text validation issues:', validation.issues);
      console.warn('Suggestions:', validation.suggestions);
    }
  }

  const imageProps: ImageProps = {
    ...props,
    alt: altText,
    className: cn(className),
    role: decorative ? 'presentation' : undefined,
    'aria-describedby': longDescriptionId || undefined
  } as ImageProps;

  return (
    <>
      <Image {...imageProps} />
      {longDescription && (
        <div 
          id={longDescriptionId}
          className="sr-only"
        >
          {longDescription}
        </div>
      )}
    </>
  );
}

// Utility component for image with caption
interface AccessibleFigureProps {
  src: string;
  alt: string;
  caption?: string;
  width: number;
  height: number;
  className?: string;
  imageClassName?: string;
  captionClassName?: string;
}

export function AccessibleFigure({
  src,
  alt,
  caption,
  width,
  height,
  className = '',
  imageClassName = '',
  captionClassName = ''
}: AccessibleFigureProps) {
  const captionId = caption ? `caption-${Math.random().toString(36).substr(2, 9)}` : undefined;

  return (
    <figure className={cn('', className)}>
      <AccessibleImage
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={imageClassName}
        longDescriptionId={captionId}
      />
      {caption && (
        <figcaption 
          id={captionId}
          className={cn('text-sm text-gray-600 mt-2', captionClassName)}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
}