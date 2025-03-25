import { ElementType } from 'react'
import Link from 'next/link'

interface NavItemProps {
  title: string
  icon: ElementType
  variant?: 'default' | 'ghost'
  className?: string
  href?: string
}

export function NavItem({ title, icon: Icon, href }: NavItemProps) {
  return href ? (
    <Link
      href={href}
      className="
        flex items-center gap-3 rounded-md px-4 py-3
        transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-cyan-400
        bg-transparent hover:bg-cyan-400/10
        text-white hover:text-cyan-300
      "
    >
      <Icon className="h-5 w-5 text-cyan-300 transition-transform hover:scale-105" />
      <span className="font-medium">{title}</span>
    </Link>
  ) : (
    <div
      className="
        flex items-center gap-3 rounded-md px-4 py-3
        transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-cyan-400
        bg-transparent hover:bg-cyan-400/10
        text-white hover:text-cyan-300
      "
    >
      <Icon className="h-5 w-5 text-cyan-300 transition-transform hover:scale-105" />
      <span className="font-medium">{title}</span>
    </div>
  );
}