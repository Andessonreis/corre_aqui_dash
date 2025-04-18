import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  labelClassName?: string;
  error?: string;
  textarea?: boolean;
  rows?: number;
}

export const Input: React.FC<InputProps> = ({
  label,
  labelClassName,
  error,
  className,
  textarea,
  rows,
  ...props
}) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className={`text-sm font-medium ${labelClassName || 'text-gray-800'}`}>
          {label}
        </label>
      )}

      {textarea ? (
        <textarea
          className={`
            w-full rounded-lg border px-4 py-2
            focus:border-blue-500 focus:ring-2 focus:ring-blue-500
            ${className || ''}
          `}
          rows={rows || 4}
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          className={`
            w-full rounded-lg border px-4 py-2
            focus:border-blue-500 focus:ring-2 focus:ring-blue-500
            ${className || ''}
          `}
          {...props}
        />
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};
