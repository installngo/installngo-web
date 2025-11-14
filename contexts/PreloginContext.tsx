"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useMemo,
} from "react";
import { useAuth } from "@/contexts/AuthContext";

export interface Continent {
  continent_code: string;
  continent_code_iso: string | null;
  continent_abbrevation: string | null;
  continent_name: string;
  continent_description: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string | null;
  updated_at: string | null;
}

export interface Subregion {
  subregion_code: string;
  continent_code: string;
  subregion_name: string;
  subregion_description: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string | null;
  updated_at: string | null;
}

export interface Country {
  country_code: string;
  continent_code: string;
  subregion_code: string;
  country_name: string;
  native_name: string | null;
  iso_alpha_3: string | null;
  numeric_code: string | null;
  time_zone: string | null;
  phone_code: string | null;
  phone_regex: string | null;
  phone_format: string | null;
  currency_name: string | null;
  currency_symbol: string | null;
  flag_url: string | null;
  flag_emoji: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string | null;
  updated_at: string | null;
}

export interface Language {
  language_code: string;
  language_name: string;
  native_name: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string | null;
  updated_at: string | null;
}

export interface CountryLanguage {
  country_code: string;
  language_code: string;
  is_official: boolean;
  display_order: number;
  is_active: boolean;
  created_at: string | null;
  updated_at: string | null;
}

export interface Currency {
  currency_code: string;
  currency_symbol: string | null;
  currency_name: string;
  display_order: number;
  is_active: boolean;
  created_at: string | null;
  updated_at: string | null;
}

export interface CountryCurrency {
  country_code: string;
  currency_code: string;
  is_default: boolean;
  display_order: number;
  is_active: boolean;
  created_at: string | null;
  updated_at: string | null;
}

export interface OrganizationCategory {
  organization_category_code: string;
  category_name: string;
  category_description: string | null;
}

export interface OrganizationType {
  organization_type_code: string;
  type_name: string;
  type_description: string | null;
  country_code: string | null;
  categories: OrganizationCategory[];
}

export interface FlatPreloginData {
  continents: Continent[];
  subregions: Subregion[];
  countries: Country[];
  languages: Language[];
  country_languages: CountryLanguage[];
  currencies: Currency[];
  country_currencies: CountryCurrency[];
  organization_types: OrganizationType[];
}

export interface NestedPreloginData {
  continents: (Continent & {
    subregions: (Subregion & {
      countries: (Country & {
        languages: (Language & { is_official: boolean })[];
        currencies: (Currency & { is_default: boolean })[];
      })[];
    })[];
  })[];
}

export interface PreloginData {
  flat: FlatPreloginData | null;
  nested: NestedPreloginData | null;
  isLoading: boolean;
  error: string | null;
}

interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message?: string;
}

const PreloginContext = createContext<PreloginData | undefined>(undefined);

export const usePrelogin = (): PreloginData => {
  const ctx = useContext(PreloginContext);
  if (!ctx) throw new Error("usePrelogin must be used within PreloginProvider");
  return ctx;
};

export const PreloginProvider = ({ children }: { children: ReactNode }) => {
  const { isLoggedIn } = useAuth();
  const [flat, setFlat] = useState<FlatPreloginData | null>(null);
  const [nested, setNested] = useState<NestedPreloginData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoggedIn) {
      setFlat(null);
      setNested(null);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    const { signal } = controller;

    const loadPrelogin = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [flatRes, nestedRes, orgTypesRes]: [
          ApiResponse<FlatPreloginData>,
          ApiResponse<NestedPreloginData>,
          ApiResponse<OrganizationType[]>
        ] = await Promise.all([
          fetch("/api/prelogin/data", { signal }).then((r) => r.json()),
          fetch("/api/prelogin/nested", { signal }).then((r) => r.json()),
          fetch("/api/prelogin/organization-types", { signal }).then((r) => r.json()),
        ]);

        if (!flatRes.success || !nestedRes.success || !orgTypesRes.success) {
          throw new Error("Prelogin API returned an error");
        }

        const orgTypes: OrganizationType[] = (orgTypesRes.data ?? []).map((t) => ({
          ...t,
          country_code: t.country_code ?? null,
          categories: t.categories ?? [],
        }));

        setFlat({
          ...(flatRes.data as FlatPreloginData),
          organization_types: orgTypes,
        });

        setNested(nestedRes.data ?? null);
      } catch (err) {
        if (!signal.aborted) {
          console.error("Prelogin load error:", err);
          setError("Failed to load prelogin data. Please refresh.");
        }
      } finally {
        if (!signal.aborted) setIsLoading(false);
      }
    };

    loadPrelogin();

    return () => controller.abort();
  }, [isLoggedIn]);

  const value = useMemo(() => ({ flat, nested, isLoading, error }), [
    flat,
    nested,
    isLoading,
    error,
  ]);

  return <PreloginContext.Provider value={value}>{children}</PreloginContext.Provider>;
};