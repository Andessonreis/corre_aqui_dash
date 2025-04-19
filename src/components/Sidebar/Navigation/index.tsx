import { NavItem } from "./NavItem";

import { Tag, BarChart, Store, PieChart, ShoppingBag, Gift } from "lucide-react";

export interface NavigationProps {
  pathname: string;
  onNavItemClick: (newPath: string) => void;
}

export function Navigation({ pathname, onNavItemClick }: NavigationProps) {
  return (
    <nav className="space-y-2 px-4">
      <NavItem
        icon={Tag}
        title="Minhas Ofertas"
        href="/dashboard/offers"
        active={pathname === "/dashboard/offers"}
        badge="4"
        onClick={() => onNavItemClick("/dashboard/offers")}
      />
      <NavItem
        icon={ShoppingBag}
        title="Produtos"
        href="/dashboard/products"
        active={pathname === "/dashboard/products"}
        onClick={() => onNavItemClick("/dashboard/products")}
      />
      <NavItem
        icon={Gift}
        title="Promoções"
        href="/dashboard/promotions"
        active={pathname === "/dashboard/promotions"}
        onClick={() => onNavItemClick("/dashboard/promotions")}
      />
      <NavItem
        icon={Store}
        title="Minha Loja"
        href="/dashboard/store"
        active={pathname === "/dashboard/store"}
        onClick={() => onNavItemClick("/dashboard/store")}
      />
      <NavItem
        icon={BarChart}
        title="Análise Geral"
        href="/dashboard/analytics"
        active={pathname === "/dashboard/analytics"}
        onClick={() => onNavItemClick("/dashboard/analytics")}
      />
      <NavItem
        icon={PieChart}
        title="Relatórios Detalhados"
        href="/dashboard/reports"
        active={pathname === "/dashboard/reports"}
        onClick={() => onNavItemClick("/dashboard/reports")}
      />
    </nav>
  );
}
