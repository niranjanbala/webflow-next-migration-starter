import { cn } from '@/lib/utils';
import { WNavbarProps } from './types';
import WContainer from './w-container';

export default function WNavbar({
  children,
  brand,
  className = '',
  sticky = false,
  transparent = false,
  shadow = true,
  maxWidth = 'xl',
  id,
  'data-w-id': dataWId,
  ...props
}: WNavbarProps) {
  const navbarClasses = cn(
    'w-navbar',
    'w-full z-50',
    sticky && 'sticky top-0',
    transparent ? 'bg-transparent' : 'bg-white',
    shadow && !transparent && 'shadow-sm border-b border-neutral-200',
    'transition-all duration-200 ease-in-out',
    className
  );

  return (
    <nav
      className={navbarClasses}
      id={id}
      data-w-id={dataWId}
      {...props}
    >
      <WContainer maxWidth={maxWidth}>
        <div className="flex items-center justify-between h-16">
          {brand && (
            <div className="flex-shrink-0">
              {brand}
            </div>
          )}
          <div className="flex items-center space-x-4">
            {children}
          </div>
        </div>
      </WContainer>
    </nav>
  );
}