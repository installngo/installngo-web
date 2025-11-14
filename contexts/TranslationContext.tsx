"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";

export type Language = "english" | "tamil" | "hindi";
export type TranslationScope = "site" | "portal";

interface TranslationContextType {
  currentLang: Language;
  setCurrentLang: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
}

const SUPPORTED_LANGUAGES: Language[] = ["english", "tamil", "hindi"];
const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

interface TranslationProviderProps {
  children: ReactNode;
  scope?: TranslationScope;
  module?: string;
}

export const TranslationProvider = ({
  children,
  scope = "site",
  module = "default",
}: TranslationProviderProps) => {
  const { organizationType, organizationLanguage } = useAuth();
  const [currentLang, setCurrentLang] = useState<Language>("english");
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [isReady, setIsReady] = useState(false);

  // Load language on mount or when dependencies change
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const storageKey = scope === "portal" ? "portalLang" : "siteLang";
        const savedLang = localStorage.getItem(storageKey) as Language | null;

        // Determine language: stored > org default > fallback
        const lang: Language =
          scope === "portal"
            ? savedLang && SUPPORTED_LANGUAGES.includes(savedLang)
              ? savedLang
              : (organizationLanguage as Language) || "english"
            : savedLang && SUPPORTED_LANGUAGES.includes(savedLang)
            ? savedLang
            : "english";

        setCurrentLang(lang);
        localStorage.setItem(storageKey, lang);

        const folder = scope === "portal" ? organizationType || "default" : "default";
        const path = module !== "default" ? `${module}/${lang}.json` : `${folder}/${lang}.json`;

        const localeData = await import(`@/locales/${path}`);
        setTranslations(localeData.default || {});
      } catch (error) {
        console.warn("Failed to load translations:", error);
      } finally {
        setIsReady(true);
      }
    };

    loadLanguage();
  }, [scope, organizationType, organizationLanguage, module]);

  // Update language dynamically
  const updateLang = async (lang: Language) => {
    if (lang === currentLang) return;
    try {
      const storageKey = scope === "portal" ? "portalLang" : "siteLang";
      localStorage.setItem(storageKey, lang);
      setCurrentLang(lang);

      const folder = scope === "portal" ? organizationType || "default" : "default";
      const path = module !== "default" ? `${module}/${lang}.json` : `${folder}/${lang}.json`;

      const localeData = await import(`@/locales/${path}`);
      setTranslations(localeData.default || {});
    } catch (error) {
      console.warn("Failed to update translations:", error);
    }
  };

  // Translation function
  const t = (key: string, fallback?: string) => translations[key] ?? fallback ?? key;

  if (!isReady) return null;

  return (
    <TranslationContext.Provider value={{ currentLang, setCurrentLang: updateLang, t }}>
      {children}
    </TranslationContext.Provider>
  );
};

// Hook to consume translations
export const useTranslation = (): TranslationContextType => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }
  return context;
};