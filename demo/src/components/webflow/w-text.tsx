import { cn } from '@/lib/utils';
import { WTextProps } from './types';

export default function WText({
  children,
  className = '',
  size = 'base',
  weight = 'normal',
  color,
  align = 'left',
  italic = false,
  underline = false,
  lineThrough = false,
  id,
  'data-w-id': dataWId,
  ...props
}: WTextProps) {
  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
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

  const textClasses = cn(
    'w-text',
    sizeClasses[size],
    weightClasses[weight],
    alignClasses[align],
    color && `text-${color}`,
    italic && 'italic',
    underline && 'underline',
    lineThrough && 'line-through',
    'leading-relaxed',
    className
  );

  return (
    <p
      className={textClasses}
      id={id}
      data-w-id={dataWId}
      {...props}
    >
      {children}
    </p>
  );
}