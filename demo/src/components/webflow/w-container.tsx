import { cn } from '@/lib/utils';
import { WContainerProps } from './types';

export default function WContainer({
  children,
  className = '',
  maxWidth = 'xl',
  padding = true,
  id,
  'data-w-id': dataWId,
  ...props
}: WContainerProps) {
  const maxWidthClasses = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
    full: 'max-w-full'
  };

  const containerClasses = cn(
    'w-container',
    'mx-auto',
    typeof maxWidth === 'string' && maxWidthClasses[maxWidth as keyof typeof maxWidthClasses] 
      ? maxWidthClasses[maxWidth as keyof typeof maxWidthClasses]
      : maxWidth,
    padding && 'px-4 sm:px-6 lg:px-8',
    className
  );

  return (
    <div
      className={containerClasses}
      id={id}
      data-w-id={dataWId}
      {...props}
    >
      {children}
    </div>
  );
}