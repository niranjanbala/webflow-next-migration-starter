import { cn } from '@/lib/utils';
import { WebflowComponentProps } from './types';

interface WRadioProps extends WebflowComponentProps {
  name?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  required?: boolean;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function WRadio({
  children,
  className = '',
  name,
  checked,
  defaultChecked,
  disabled = false,
  required = false,
  value,
  onChange,
  id,
  'data-w-id': dataWId,
  ...props
}: WRadioProps) {
  const radioClasses = cn(
    'w-radio',
    'h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    className
  );

  return (
    <div className="flex items-center">
      <input
        type="radio"
        name={name}
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        required={required}
        value={value}
        onChange={onChange}
        className={radioClasses}
        id={id}
        data-w-id={dataWId}
        {...props}
      />
      {children && (
        <label htmlFor={id} className="ml-2 text-sm text-neutral-700">
          {children}
        </label>
      )}
    </div>
  );
}