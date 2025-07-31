'use client';

import { ReactNode, FormHTMLAttributes, useId } from 'react';
import { cn } from '@/lib/utils';
import ScreenReaderOnly from './screen-reader-only';

interface AccessibleFormProps extends FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode;
  title?: string;
  description?: string;
  errorSummary?: string[];
  className?: string;
}

export default function AccessibleForm({
  children,
  title,
  description,
  errorSummary,
  className = '',
  ...props
}: AccessibleFormProps) {
  const titleId = useId();
  const descriptionId = useId();
  const errorSummaryId = useId();

  return (
    <form
      className={cn('space-y-6', className)}
      aria-labelledby={title ? titleId : undefined}
      aria-describedby={description ? descriptionId : undefined}
      noValidate
      {...props}
    >
      {title && (
        <h2 id={titleId} className="text-2xl font-bold text-gray-900">
          {title}
        </h2>
      )}
      
      {description && (
        <p id={descriptionId} className="text-gray-600">
          {description}
        </p>
      )}

      {errorSummary && errorSummary.length > 0 && (
        <div
          id={errorSummaryId}
          role="alert"
          aria-labelledby={`${errorSummaryId}-title`}
          className="bg-red-50 border border-red-200 rounded-lg p-4"
        >
          <h3 id={`${errorSummaryId}-title`} className="text-lg font-semibold text-red-800 mb-2">
            Please correct the following errors:
          </h3>
          <ul className="list-disc list-inside space-y-1">
            {errorSummary.map((error, index) => (
              <li key={index} className="text-red-700">
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      {children}
    </form>
  );
}

// Accessible form field component
interface AccessibleFieldProps {
  children: ReactNode;
  label: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  className?: string;
}

export function AccessibleField({
  children,
  label,
  required = false,
  error,
  helperText,
  className = ''
}: AccessibleFieldProps) {
  const fieldId = useId();
  const errorId = useId();
  const helperId = useId();

  return (
    <div className={cn('space-y-2', className)}>
      <label 
        htmlFor={fieldId}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
        {required && (
          <>
            <span className="text-red-500 ml-1" aria-hidden="true">*</span>
            <ScreenReaderOnly>(required)</ScreenReaderOnly>
          </>
        )}
      </label>
      
      <div className="relative">
        {/* Clone children and add accessibility props */}
        {typeof children === 'object' && children && 'props' in children
          ? {
              ...children,
              props: {
                ...children.props,
                id: fieldId,
                'aria-required': required,
                'aria-invalid': !!error,
                'aria-describedby': [
                  error ? errorId : null,
                  helperText ? helperId : null
                ].filter(Boolean).join(' ') || undefined
              }
            }
          : children
        }
      </div>

      {helperText && (
        <p id={helperId} className="text-sm text-gray-500">
          {helperText}
        </p>
      )}

      {error && (
        <p 
          id={errorId} 
          role="alert"
          className="text-sm text-red-600"
        >
          <span aria-hidden="true">⚠ </span>
          {error}
        </p>
      )}
    </div>
  );
}

// Accessible fieldset component
interface AccessibleFieldsetProps {
  children: ReactNode;
  legend: string;
  description?: string;
  className?: string;
}

export function AccessibleFieldset({
  children,
  legend,
  description,
  className = ''
}: AccessibleFieldsetProps) {
  const descriptionId = useId();

  return (
    <fieldset 
      className={cn('space-y-4', className)}
      aria-describedby={description ? descriptionId : undefined}
    >
      <legend className="text-lg font-medium text-gray-900 mb-4">
        {legend}
      </legend>
      
      {description && (
        <p id={descriptionId} className="text-sm text-gray-600 -mt-2 mb-4">
          {description}
        </p>
      )}
      
      {children}
    </fieldset>
  );
}