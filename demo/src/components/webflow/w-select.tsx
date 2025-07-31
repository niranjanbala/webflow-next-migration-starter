import { cn } from '@/lib/utils';
import { WebflowComponentProps } from './types';

interface WSelectProps extends WebflowComponentProps {
  name?: string;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  required?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'outline';
  error?: boolean;
  helperText?: string;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function WSelect({
  children,
  className = '',
  name,
  value,
  defaultValue,
  disabled = false,
  required = false,
  size = 'md',
  variant = 'default',
  error = false,
  helperText,
  onChange,
  id,
  'data-w-id': dataWId,
  ...props
}: WSelectProps) {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  };

  const variantClasses = {
    default: 'border border-neutral-300 bg-white focus:border-primary-500 focus:ring-primary-500',
    filled: 'border-0 bg-neutral-100 focus:bg-white focus:ring-primary-500',
    outline: 'border-2 border-neutral-300 bg-transparent focus:border-primary-500 focus:ring-primary-500'
  };

  const selectClasses = cn(
    'w-select',
    'block w-full rounded-md',
    'transition-colors duration-200 ease-in-out',
    'focus:outline-none focus:ring-2 focus:ring-offset-0',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    sizeClasses[size],
    variantClasses[variant],
    error && 'border-error-500 focus:border-error-500 focus:ring-error-500',
    className
  );

  return (
    <div className="w-select-wrapper">
      <select
        name={name}
        value={value}
        defaultValue={defaultValue}
        disabled={disabled}
        required={required}
        onChange={onChange}
        className={selectClasses}
        id={id}
        data-w-id={dataWId}
        {...props}
      >
        {children}
      </select>
      {helperText && (
        <p className={cn(
          'mt-1 text-sm',
          error ? 'text-error-600' : 'text-neutral-600'
        )}>
          {helperText}
        </p>
      )}
    </div>
  );
}