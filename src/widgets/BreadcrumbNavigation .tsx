"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ReactNode } from "react";

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: ReactNode;
}

interface BreadcrumbNavigationProps {
  items: BreadcrumbItem[];
  maxLength?: number;
  separator?: ReactNode;
  className?: string;
  showHome?: boolean;
  homeHref?: string;
}

export const BreadcrumbNavigation = ({
  items,
  maxLength = 15,
  separator = <ChevronRight className="w-4 h-4 text-gray-400" />,
  className = "",
  showHome = false,
  homeHref = "/",
}: BreadcrumbNavigationProps) => {
  const truncateText = (text: string, max: number): string => {
    if (text.length <= max) return text;
    return `${text.slice(0, max)}...`;
  };

  // Формируем полный список элементов с учетом showHome
  let allItems = [...items];
  
  if (showHome) {
    allItems = [
      { label: "Главная", href: homeHref,  },
      ...allItems,
    ];
  }

  // Если нет элементов, ничего не рендерим
  if (allItems.length === 0) {
    return null;
  }

  return (
    <nav className={`flex items-center flex-wrap gap-2 ${className}`}>
      {allItems.map((item, index) => {
        const isLast = index === allItems.length - 1;
        const displayLabel = item.icon ? null : truncateText(item.label, maxLength);
        
        return (
          <div key={index} className="flex items-center gap-2">
            {isLast || !item.href ? (
              // Последний элемент или элемент без ссылки
              <span className="text-black font-medium flex items-center gap-1">
                {item.icon && <span className="text-gray-500">{item.icon}</span>}
                {displayLabel && <span title={item.label}>{displayLabel}</span>}
              </span>
            ) : (
              // Ссылка
              <Link
                href={item.href}
                className="text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-1"
                title={item.label}
              >
                {item.icon && <span>{item.icon}</span>}
                {displayLabel && <span>{displayLabel}</span>}
              </Link>
            )}
            
            {!isLast && separator}
          </div>
        );
      })}
    </nav>
  );
};