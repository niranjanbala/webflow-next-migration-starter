import { cn } from '@/lib/utils';
import { WModalProps } from './types';

export default function WModal({
  children,
  className = '',
  open,
  onClose,
  size = 'md',
  centered = true,
  backdrop = true,
  closeOnBackdrop = true,
  closeOnEscape = true,
  id,
  'data-w-id': dataWId,
  ...props
}: WModalProps) {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full'
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      id={id}
      data-w-id={dataWId}
    >
      {/* Backdrop */}
      {backdrop && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={closeOnBackdrop ? onClose : undefined}
        />
      )}

      {/* Modal */}
      <div className={cn(
        'flex min-h-full items-center justify-center p-4',
        centered ? 'items-center' : 'items-start pt-16'
      )}>
        <div
          className={cn(
            'w-modal',
            'relative w-full bg-white rounded-lg shadow-xl',
            'transform transition-all',
            sizeClasses[size],
            className
          )}
          {...props}
        >
          {children}
        </div>
      </div>
    </div>
  );
}