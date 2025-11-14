"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useMenu } from "@/hooks/useMenu";

interface Props {
  pathname: string;
  t: (key: string, fallback?: string) => string;
}

export default function TopbarMenu({ pathname, t }: Props) {
  const { menus, loading } = useMenu();
  const [openSubmenuIndex, setOpenSubmenuIndex] = useState<number | null>(null);

  const safeMenus = Array.isArray(menus) ? menus : [];

  if (loading)
    return <span className="text-sm opacity-70">{t("loading", "Loading...")}</span>;

  if (safeMenus.length === 0)
    return <span className="text-sm opacity-60">{t("noMenus", "No menus available")}</span>;

  return (
    <nav className="hidden md:flex space-x-1">
      {safeMenus.map((menu, idx) => {
        const hasSubmenu = Array.isArray(menu.sub_menus) && menu.sub_menus.length > 0;
        const isActive = pathname === menu.path;
        const submenuOpen = openSubmenuIndex === idx;

        return (
          <div
            key={`${menu.path || menu.name}-${idx}`}
            className="relative"
            onMouseEnter={() => hasSubmenu && setOpenSubmenuIndex(idx)}
            onMouseLeave={() => hasSubmenu && setOpenSubmenuIndex(null)}
          >
            <a
              href={menu.path || "#"}
              className={`flex items-center px-4 py-2 rounded text-sm font-medium transition-colors duration-150 cursor-pointer
                ${
                  isActive
                    ? "bg-[var(--menu-active-bg)] text-[var(--menu-active-text)]"
                    : "hover:bg-[var(--menu-hover-bg)] hover:text-[var(--menu-hover-text)]"
                }`}
            >
              {menu.name}
              {hasSubmenu && (
                <ChevronDown
                  size={14}
                  className={`ml-2 transition-transform duration-200 ${
                    submenuOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              )}
            </a>

            {hasSubmenu && submenuOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-[var(--submenu-bg)] text-[var(--submenu-text)] rounded-md shadow-lg p-3 z-50">
                {menu.sub_menus!.map((sub, subIdx) => (
                  <a
                    key={`${sub.path || sub.name}-${subIdx}`}
                    href={sub.path || "#"}
                    className={`block px-4 py-2 rounded-md text-sm transition-colors duration-150
                      ${
                        pathname === sub.path
                          ? "bg-[var(--menu-active-bg)] text-[var(--menu-active-text)]"
                          : "hover:bg-[var(--menu-hover-bg)] hover:text-[var(--menu-hover-text)]"
                      }`}
                  >
                    {sub.name}
                  </a>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}