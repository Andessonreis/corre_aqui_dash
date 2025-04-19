import { ElementType } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface NavItemProps {
  title: string;
  icon: ElementType;
  href?: string;
  className?: string;
  variant?: 'default' | 'ghost';
  active?: boolean;
  onClick?: () => void;
  badge?: number | string;
}

export function NavItem({
  title,
  icon: Icon,
  href,
  active = false,
  onClick,
  badge,
  className = "",
  variant = "default"
}: NavItemProps) {

  const baseClasses = `
    flex items-center gap-4 px-4 py-3.5 rounded-lg transition-all duration-300
    ${active
      ? "bg-red-50 text-red-600 font-medium shadow-sm border border-red-100"
      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm"}
    ${className}
  `;

  const iconColor = active ? "text-red-500" : "text-gray-500";
  const badgeColor = active
    ? "bg-red-100 text-red-600"
    : "bg-gray-100 text-gray-800";

  const content = (
    <>
      <Icon className={`h-6 w-6 ${iconColor}`} />
      <span className="text-base">{title}</span>
      {badge && (
        <span className={`ml-auto px-2 py-0.5 ${badgeColor} text-xs font-medium rounded-full`}>
          {badge}
        </span>
      )}
    </>
  );

  const Wrapper = href ? Link : "button";
  const wrapperProps = href
    ? { href, className: baseClasses }
    : { onClick, className: `${baseClasses} w-full text-left` };

  return (
    <motion.div
      whileHover={{ x: 4 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
    >
      <Wrapper {...(wrapperProps as any)}>
        {content}
      </Wrapper>
    </motion.div>
  );
}
