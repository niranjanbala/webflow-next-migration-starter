import { cn } from '@/lib/utils';
import { WRowProps } from './types';

export default function WRow({
  children,
  className = '',
  gap,
  align = 'stretch',
  justify = 'start',
  wrap = true,
  id,
  'data-w-id': dataWId,
  ...props
}: WRowProps) {
  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch'
  };

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly'
  };

  const gapClass = gap ? (typeof gap === 'number' ? `gap-${gap}` : gap) : '';

  const rowClasses = cn(
    'w-row',
    'flex',
    wrap && 'flex-wrap',
    alignClasses[align],
    justifyClasses[justify],
    gapClass,
    className
  );

  return (
    <div
      className={rowClasses}
      id={id}
      data-w-id={dataWId}
      {...props}
    >
      {children}
    </div>
  );
}