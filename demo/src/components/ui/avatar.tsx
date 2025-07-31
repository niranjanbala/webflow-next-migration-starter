import { ReactNode } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  fallback?: ReactNode;
  className?: string;
}

const sizes = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
  '2xl': 'w-20 h-20',
};

const textSizes = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
};

export default function Avatar({
  src,
  alt = 'Avatar',
  size = 'md',
  fallback,
  className = ''
}: AvatarProps) {
  const sizeClass = sizes[size];
  const textSizeClass = textSizes[size];

  if (src) {
    return (
      <div className={cn('relative rounded-full overflow-hidden', sizeClass, className)}>
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes={`${parseInt(sizeClass.split('-')[1]) * 4}px`}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full bg-gray-100 text-gray-600 font-medium',
        sizeClass,
        textSizeClass,
        className
      )}
    >
      {fallback || alt.charAt(0).toUpperCase()}
    </div>
  );
}

// Avatar Group component for displaying multiple avatars
interface AvatarGroupProps {
  avatars: Array<{
    src?: string;
    alt: string;
    fallback?: ReactNode;
  }>;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  max?: number;
  className?: string;
}

export function AvatarGroup({
  avatars,
  size = 'md',
  max = 5,
  className = ''
}: AvatarGroupProps) {
  const displayAvatars = avatars.slice(0, max);
  const remainingCount = avatars.length - max;

  return (
    <div className={cn('flex -space-x-2', className)}>
      {displayAvatars.map((avatar, index) => (
        <Avatar
          key={index}
          src={avatar.src}
          alt={avatar.alt}
          fallback={avatar.fallback}
          size={size}
          className="ring-2 ring-white"
        />
      ))}
      {remainingCount > 0 && (
        <Avatar
          size={size}
          fallback={`+${remainingCount}`}
          className="ring-2 ring-white bg-gray-200"
        />
      )}
    </div>
  );
}