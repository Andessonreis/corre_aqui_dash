import {
  Home,
  BarChart,
  Tag,
  Store,
} from 'lucide-react'

import { NavItem } from './NavItem'

export interface NavigationProps {}

export function Navigation(props: NavigationProps) {
  return (
    <nav className="flex flex-col gap-0.5">
      <NavItem icon={Home} title="Home" href="/dashboard" />
      <NavItem icon={Tag} title="Ofertas" href='/dashboard/offers' />
      <NavItem icon={BarChart} title="Analytics" />
      <NavItem icon={Store} title="Minha Loja" />
    </nav>
  )
}
