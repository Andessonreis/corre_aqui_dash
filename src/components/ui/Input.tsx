import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?:string;
  textarea?: boolean;
  rows?: number; 
  multiple?: boolean;
  checked?: boolean;
}

export const Input: React.FC<InputProps> = ({ label, error, className, ...props }) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <input
        className={`
          w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-gray-900
          focus:border-blue-500 focus:ring-2 focus:ring-blue-500
          dark:border-zinc-700 dark:bg-zinc-800 dark:text-white
          placeholder-gray-400 dark:placeholder-gray-500
          ${className || ''} 
        `}
        {...props}
      />
    </div>
  );
};