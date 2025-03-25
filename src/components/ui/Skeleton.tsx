import { HTMLAttributes } from 'react'

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'line' | 'circle'
}

export function Skeleton({ className, variant = 'line', ...props }: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-zinc-800 rounded-lg'
  
  const variants = {
    line: 'h-4',
    circle: 'rounded-full'
  }

  return (
    <div
      className={`${baseClasses} ${variants[variant]} ${className || ''}`}
      {...props}
    />
  )
}