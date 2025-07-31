import { cn } from '@/lib/utils';
import { WFormProps } from './types';

export default function WForm({
  children,
  className = '',
  onSubmit,
  method = 'POST',
  action,
  noValidate = false,
  id,
  'data-w-id': dataWId,
  ...props
}: WFormProps) {
  const formClasses = cn('w-form', 'space-y-4', className);

  return (
    <form
      className={formClasses}
      onSubmit={onSubmit}
      method={method}
      action={action}
      noValidate={noValidate}
      id={id}
      data-w-id={dataWId}
      {...props}
    >
      {children}
    </form>
  );
}