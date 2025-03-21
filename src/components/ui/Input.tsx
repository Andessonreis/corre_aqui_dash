import React from "react"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input: React.FC<InputProps> = ({ className = "", ...props }) => {
  return (
    <input
      className={`w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-gray-900
        transition-all duration-200 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-blue-500 
        dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:ring-blue-400
        placeholder-gray-400 dark:placeholder-gray-500 ${className}`}
      {...props}
    />
  )
}
