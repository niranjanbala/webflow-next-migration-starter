import { cn } from '@/lib/utils';
import { WebflowComponentProps } from './types';
import WContainer from './w-container';

interface WFooterProps extends WebflowComponentProps {
  background?: 'white' | 'gray' | 'dark';
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

export default function WFooter({
  children,
  className = '',
  background = 'gray',
  maxWidth = 'xl',
  id,
  'data-w-id': dataWId,
  ...props
}: WFooterProps) {
  const backgroundClasses = {
    white: 'bg-white text-neutral-900',
    gray: 'bg-neutral-50 text-neutral-900',
    dark: 'bg-neutral-900 text-white'
  };

  const footerClasses = cn(
    'w-footer',
    'py-12',
    backgroundClasses[background],
    className
  );

  return (
    <footer
      className={footerClasses}
      id={id}
      data-w-id={dataWId}
      {...props}
    >
      <WContainer maxWidth={maxWidth}>
        {children}
      </WContainer>
    </footer>
  );
}