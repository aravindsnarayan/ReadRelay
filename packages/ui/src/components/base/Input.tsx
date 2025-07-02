import React, { forwardRef } from 'react';

export interface InputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  disabled?: boolean;
  required?: boolean;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  inputClassName?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      placeholder,
      value,
      type = 'text',
      disabled = false,
      required = false,
      error,
      helperText,
      icon,
      iconPosition = 'left',
      fullWidth = false,
      size = 'md',
      className = '',
      inputClassName = '',
      onChange,
      onBlur,
      onFocus,
      ...props
    },
    ref
  ) => {
    const baseInputClasses = `
    block w-full rounded-lg border transition-colors duration-200 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-offset-2 
    disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-secondary-50
  `;

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-4 py-3 text-base',
    };

    const stateClasses = error
      ? `
        border-error-300 text-error-900 placeholder-error-400
        focus:border-error-500 focus:ring-error-500
      `
      : `
        border-secondary-300 text-secondary-900 placeholder-secondary-500
        focus:border-primary-500 focus:ring-primary-500
        hover:border-secondary-400
      `;

    const iconClasses = icon
      ? {
          left: 'pl-10',
          right: 'pr-10',
        }
      : {};

    const inputClasses = `
    ${baseInputClasses}
    ${sizeClasses[size]}
    ${stateClasses}
    ${icon ? iconClasses[iconPosition] : ''}
    ${inputClassName}
  `
      .replace(/\s+/g, ' ')
      .trim();

    const containerClasses = `
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `
      .replace(/\s+/g, ' ')
      .trim();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.target.value);
    };

    return (
      <div className={containerClasses}>
        {label && (
          <label className="block text-sm font-medium text-secondary-700 mb-1">
            {label}
            {required && <span className="text-error-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {icon && iconPosition === 'left' && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <div className="text-secondary-400">{icon}</div>
            </div>
          )}

          <input
            ref={ref}
            type={type}
            value={value}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            className={inputClasses}
            onChange={handleChange}
            onBlur={onBlur}
            onFocus={onFocus}
            {...props}
          />

          {icon && iconPosition === 'right' && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <div className="text-secondary-400">{icon}</div>
            </div>
          )}
        </div>

        {(error || helperText) && (
          <p
            className={`mt-1 text-sm ${error ? 'text-error-600' : 'text-secondary-500'}`}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
