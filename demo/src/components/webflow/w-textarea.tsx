import { cn } from '@/lib/utils';
import { WTextareaProps } from './types';

export default function WTextarea({
  className = '',
  name,
  value,
  defaultValue,
  placeholder,
  disabled = false,
  required = false,
  readOnly = false,
  rows = 4,
  cols,
  resize = 'vertical',
  size = 'md',
  variant = 'default',
  error = false,
  helperText,
  onChange,
  onFocus,
  onBlur,
  id,
  'data-w-id': dataWId,
  ...props
}: WTextareaProps) {
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

  const resizeClasses = {
    none: 'resize-none',
    both: 'resize',
    horizontal: 'resize-x',
    vertical: 'resize-y'
  };

  const textareaClasses = cn(
    'w-textarea',
    'block w-full rounded-md',
    'transition-colors duration-200 ease-in-out',
    'focus:outline-none focus:ring-2 focus:ring-offset-0',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'placeholder:text-neutral-400',
    sizeClasses[size],
    variantClasses[variant],
    resizeClasses[resize],
    error && 'border-error-500 focus:border-error-500 focus:ring-error-500',
    className
  );

  return (
    <div className="w-textarea-wrapper">
      <textarea
        name={name}
        value={value}
        defaultValue={defaultValue}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        readOnly={readOnly}
        rows={rows}
        cols={cols}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        className={textareaClasses}
        id={id}
        data-w-id={dataWId}
        {...props}
      />
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