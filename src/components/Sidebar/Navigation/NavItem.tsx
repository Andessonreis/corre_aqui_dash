import { ChevronDown } from 'lucide-react'
import { ElementType } from 'react'
import Link from 'next/link'

interface NavItemProps {
  title: string
  icon: ElementType
  variant?: 'default' | 'ghost'
  className?: string
  href?: string
}

export function NavItem({ title, icon: Icon, variant = 'default', className, href }: NavItemProps) {
  const Component = href ? Link : 'div'

  return (
    <Component
      href={href || ''}
      className={`
        group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all
        outline-none focus-visible:ring-2 focus-visible:ring-violet-500
        ${variant === 'ghost'}
        ${className}
        ${href ? 'cursor-pointer' : ''}
      `}
    >
      <Icon className="h-5 w-5 flex-shrink-0 text-zinc-500 dark:text-zinc-400" />
      <span className="font-medium text-zinc-700 group-hover:text-violet-500 dark:text-zinc-100 dark:group-hover:text-violet-300">
        {title}
      </span>
      <ChevronDown className="ml-auto h-5 w-5 text-zinc-400 dark:text-zinc-600" />
    </Component>
  )
}