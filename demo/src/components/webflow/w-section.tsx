import { cn } from '@/lib/utils';
import { WSectionProps } from './types';

export default function WSection({
  children,
  className = '',
  padding = 'md',
  background = 'transparent',
  fullHeight = false,
  id,
  'data-w-id': dataWId,
  ...props
}: WSectionProps) {
  const paddingClasses = {
    none: '',
    sm: 'py-8 md:py-12',
    md: 'py-12 md:py-16 lg:py-20',
    lg: 'py-16 md:py-20 lg:py-24',
    xl: 'py-20 md:py-24 lg:py-32'
  };

  const backgroundClasses = {
    transparent: 'bg-transparent',
    white: 'bg-white',
    gray: 'bg-neutral-50',
    primary: 'bg-primary-500 text-white',
    secondary: 'bg-neutral-500 text-white'
  };

  const sectionClasses = cn(
    'w-section',
    'relative',
    paddingClasses[padding],
    typeof background === 'string' && backgroundClasses[background as keyof typeof backgroundClasses]
      ? backgroundClasses[background as keyof typeof backgroundClasses]
      : background,
    fullHeight && 'min-h-screen flex items-center',
    className
  );

  return (
    <section
      className={sectionClasses}
      id={id}
      data-w-id={dataWId}
      {...props}
    >
      {children}
    </section>
  );
}