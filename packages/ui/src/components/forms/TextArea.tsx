import React, { forwardRef } from 'react';

export interface TextAreaProps {
  label?: string;
  placeholder?: string;
  value?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  helperText?: string;
  rows?: number;
  fullWidth?: boolean;
  className?: string;
  textAreaClassName?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      label,
      placeholder,
      value,
      disabled = false,
      required = false,
      error,
      helperText,
      rows = 3,
      fullWidth = false,
      className = '',
      textAreaClassName = '',
      onChange,
      onBlur,
      onFocus,
      ...props
    },
    ref
  ) => {
    const baseTextAreaClasses = `
    block w-full rounded-lg border transition-colors duration-200 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-offset-2 resize-vertical
    disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-secondary-50
    px-4 py-2 text-sm
  `;

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

    const textAreaClasses = `
    ${baseTextAreaClasses}
    ${stateClasses}
    ${textAreaClassName}
  `
      .replace(/\s+/g, ' ')
      .trim();

    const containerClasses = `
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `
      .replace(/\s+/g, ' ')
      .trim();

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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

        <textarea
          ref={ref}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          rows={rows}
          className={textAreaClasses}
          onChange={handleChange}
          onBlur={onBlur}
          onFocus={onFocus}
          {...props}
        />

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

TextArea.displayName = 'TextArea';

export default TextArea;
