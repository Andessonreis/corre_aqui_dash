import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  textarea?: boolean;
  rows?: number; 
  multiple?: boolean;
  checked?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className,
  ...props
}) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="text-sm font-medium">
          {label}
        </label>
      )}
      <input
        className={`
          w-full rounded-lg border px-4 py-2
          focus:border-blue-500 focus:ring-2 focus:ring-blue-500
          ${className || ''} 
        `}
        {...props}
      />
    </div>
  );
};
