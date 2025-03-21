import React from "react"

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[]
}

export const Select: React.FC<SelectProps> = ({ options, className = "", ...props }) => {
  return (
    <select
      className={`w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-gray-900
        transition-all duration-200 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-blue-500 
        dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:ring-blue-400
        placeholder-gray-400 dark:placeholder-gray-500 hover:bg-gray-200 dark:hover:bg-zinc-700
        cursor-pointer ${className}`}
      {...props}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value} className="text-gray-900 dark:text-white">
          {option.label}
        </option>
      ))}
    </select>
  )
}
