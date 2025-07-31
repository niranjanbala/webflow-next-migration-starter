import { cn } from '@/lib/utils';
import { WHeadingProps } from './types';

export default function WHeading({
  children,
  className = '',
  level = 1,
  size,
  weight = 'bold',
  color,
  align = 'left',
  id,
  'data-w-id': dataWId,
  ...props
}: WHeadingProps) {
  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
    '5xl': 'text-5xl',
    '6xl': 'text-6xl'
  };

  const defaultSizes = {
    1: 'text-4xl md:text-5xl lg:text-6xl',
    2: 'text-3xl md:text-4xl lg:text-5xl',
    3: 'text-2xl md:text-3xl lg:text-4xl',
    4: 'text-xl md:text-2xl lg:text-3xl',
    5: 'text-lg md:text-xl lg:text-2xl',
    6: 'text-base md:text-lg lg:text-xl'
  };

  const weightClasses = {
    thin: 'font-thin',
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
    extrabold: 'font-extrabold',
    black: 'font-black'
  };

  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify'
  };

  const headingClasses = cn(
    'w-heading',
    size ? sizeClasses[size] : defaultSizes[level],
    weightClasses[weight],
    alignClasses[align],
    color && `text-${color}`,
    'leading-tight tracking-tight',
    className
  );

  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  return (
    <Tag
      className={headingClasses}
      id={id}
      data-w-id={dataWId}
      {...props}
    >
      {children}
    </Tag>
  );
}