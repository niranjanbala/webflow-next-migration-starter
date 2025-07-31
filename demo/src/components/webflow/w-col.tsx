import { cn } from '@/lib/utils';
import { WColProps } from './types';

export default function WCol({
  children,
  className = '',
  span,
  offset,
  order,
  xs,
  sm,
  md,
  lg,
  xl,
  '2xl': xl2,
  id,
  'data-w-id': dataWId,
  ...props
}: WColProps) {
  const getResponsiveClasses = (breakpoint: string, value: boolean | string | number | undefined) => {
    if (value === undefined) return '';
    
    const prefix = breakpoint === 'xs' ? '' : `${breakpoint}:`;
    
    if (typeof value === 'boolean') {
      return value ? `${prefix}flex-1` : `${prefix}flex-none`;
    }
    
    if (typeof value === 'number') {
      return `${prefix}w-${value}/12`;
    }
    
    return `${prefix}${value}`;
  };

  const colClasses = cn(
    'w-col',
    span === 'auto' ? 'flex-auto' : span ? `w-${span}/12` : 'flex-1',
    offset && `ml-${offset}/12`,
    order && `order-${order}`,
    getResponsiveClasses('xs', xs),
    getResponsiveClasses('sm', sm),
    getResponsiveClasses('md', md),
    getResponsiveClasses('lg', lg),
    getResponsiveClasses('xl', xl),
    getResponsiveClasses('2xl', xl2),
    className
  );

  return (
    <div
      className={colClasses}
      id={id}
      data-w-id={dataWId}
      {...props}
    >
      {children}
    </div>
  );
}