import { cn } from '@/lib/utils';
import { WCardProps } from './types';

export default function WCard({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
  hover = false,
  clickable = false,
  onClick,
  id,
  'data-w-id': dataWId,
  ...props
}: WCardProps) {
  const variantClasses = {
    default: 'bg-white border border-neutral-200',
    outlined: 'bg-white border-2 border-neutral-300',
    elevated: 'bg-white shadow-lg border-0',
    filled: 'bg-neutral-50 border-0'
  };

  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  };

  const cardClasses = cn(
    'w-card',
    'rounded-lg',
    'transition-all duration-200 ease-in-out',
    variantClasses[variant],
    paddingClasses[padding],
    hover && 'hover:shadow-lg hover:-translate-y-1',
    clickable && 'cursor-pointer',
    className
  );

  const Component = clickable ? 'button' : 'div';

  return (
    <Component
      className={cardClasses}
      onClick={onClick}
      id={id}
      data-w-id={dataWId}
      {...props}
    >
      {children}
    </Component>
  );
}