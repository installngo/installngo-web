"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import defaultMenus from "@/data/defaultMenus.json";

export interface MenuItem {
  name: string;
  path: string | null;
  sub_menus?: MenuItem[];
  is_premium?: boolean;
  menu_status_code?: string;
  allowed_roles?: string[];
}

export function useMenu() {
  const { isLoggedIn, organizationType, token } = useAuth();
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const defaultMenuItems = Array.isArray(defaultMenus) ? defaultMenus : [];

    if (!isLoggedIn || !organizationType || !token) {
      setMenus(defaultMenuItems);
      return;
    }

    let mounted = true;

    const fetchMenus = async () => {
      const cacheKey = `menu_${organizationType}`;
      const cached = localStorage.getItem(cacheKey);

      if (cached) {
        try {
          const parsed = JSON.parse(cached) as MenuItem[];
          if (mounted) setMenus(parsed);
          return;
        } catch (e) {
          console.warn("Failed to parse cached menus:", e);
        }
      }

      if (mounted) setLoading(true);

      try {
        const res = await fetch(`/api/menus?type=${organizationType}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch menus");

        const resData = await res.json();
        const validMenus: MenuItem[] = Array.isArray(resData.data)
          ? resData.data
          : defaultMenuItems;

        if (mounted) setMenus(validMenus);
        localStorage.setItem(cacheKey, JSON.stringify(validMenus));
      } catch (err) {
        console.error("Menu fetch failed:", err);
        if (mounted) setMenus(defaultMenuItems);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchMenus();

    return () => {
      mounted = false;
    };
  }, [isLoggedIn, organizationType, token]);

  return { menus, loading };
}