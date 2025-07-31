import { cn } from '@/lib/utils';
import { WAccordionProps } from './types';

export default function WAccordion({
  children,
  className = '',
  multiple = false,
  defaultValue,
  value,
  onChange,
  id,
  'data-w-id': dataWId,
  ...props
}: WAccordionProps) {
  const accordionClasses = cn(
    'w-accordion',
    'space-y-2',
    className
  );

  return (
    <div
      className={accordionClasses}
      id={id}
      data-w-id={dataWId}
      {...props}
    >
      {children}
    </div>
  );
}