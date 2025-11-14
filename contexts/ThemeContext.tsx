"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";

export type Theme = "default" | "academy";

interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const typeToThemeMap: Record<string, Theme> = {
  academy: "academy",
  default: "default",
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { organizationType, isLoggedIn } = useAuth();
  const [currentTheme, setCurrentTheme] = useState<Theme>("default");
  const [initialized, setInitialized] = useState(false);

  const applyTheme = (theme: Theme) => {
    if (typeof document === "undefined") return;
    document.documentElement.setAttribute("data-theme", theme);
  };

  useEffect(() => {
    applyTheme("default");
    Promise.resolve().then(() => setInitialized(true));
  }, []);

  useEffect(() => {
    const storedType = localStorage.getItem("organizationType");
    const typeSource = isLoggedIn ? organizationType || storedType : storedType;

    if (!typeSource) return;

    const derivedTheme = typeToThemeMap[typeSource.toLowerCase()] || "default";
    Promise.resolve().then(() => {
      setCurrentTheme(derivedTheme);
      applyTheme(derivedTheme);
    });
  }, [isLoggedIn, organizationType]);

  const updateTheme = (theme: Theme) => {
    setCurrentTheme(theme);
    applyTheme(theme);
  };

  if (!initialized) return null;

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme: updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}