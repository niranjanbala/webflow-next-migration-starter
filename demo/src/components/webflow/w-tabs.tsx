import { cn } from '@/lib/utils';
import { WTabsProps } from './types';

export default function WTabs({
  children,
  className = '',
  defaultValue,
  value,
  onChange,
  orientation = 'horizontal',
  variant = 'default',
  id,
  'data-w-id': dataWId,
  ...props
}: WTabsProps) {
  const tabsClasses = cn(
    'w-tabs',
    orientation === 'vertical' ? 'flex' : 'block',
    className
  );

  return (
    <div
      className={tabsClasses}
      id={id}
      data-w-id={dataWId}
      {...props}
    >
      {children}
    </div>
  );
}