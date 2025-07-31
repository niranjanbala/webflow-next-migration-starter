import Link from 'next/link';
import { cn } from '@/lib/utils';
import { WLinkProps } from './types';

export default function WLink({
  children,
  href,
  className = '',
  target,
  rel,
  external = false,
  underline = false,
  color = 'primary-500',
  id,
  'data-w-id': dataWId,
  ...props
}: WLinkProps) {
  const linkClasses = cn(
    'w-link',
    'transition-colors duration-200 ease-in-out',
    `text-${color}`,
    `hover:text-${color.replace('500', '600')}`,
    underline && 'underline underline-offset-2',
    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500',
    className
  );

  // External links
  if (external || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
    return (
      <a
        href={href}
        target={target || '_blank'}
        rel={rel || 'noopener noreferrer'}
        className={linkClasses}
        id={id}
        data-w-id={dataWId}
        {...props}
      >
        {children}
      </a>
    );
  }

  // Internal links
  return (
    <Link
      href={href}
      target={target}
      className={linkClasses}
      id={id}
      data-w-id={dataWId}
      {...props}
    >
      {children}
    </Link>
  );
}