"use client";

import { createContext, useContext, useState, useEffect, useMemo, ReactNode } from "react";

interface AuthState {
  token: string | null;
  organizationId: string | null;
  organizationCode: string | null;
  organizationName: string | null;
  organizationType: string | null;
  organizationCategory: string | null;
  organizationCountry: string | null;
  organizationLanguage: string | null;
}

interface AuthContextType extends AuthState {
  isLoggedIn: boolean;
  login: (
    token: string,
    orgId?: string,
    code?: string,
    name?: string,
    type?: string,
    category?: string,
    country?: string,
    language?: string
  ) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_KEYS: (keyof AuthState)[] = [
  "token",
  "organizationId",
  "organizationCode",
  "organizationName",
  "organizationType",
  "organizationCategory",
  "organizationCountry",
  "organizationLanguage",
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    token: null,
    organizationId: null,
    organizationCode: null,
    organizationName: null,
    organizationType: null,
    organizationCategory: null,
    organizationCountry: null,
    organizationLanguage: null,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    Promise.resolve().then(() => {
      const savedState: Partial<AuthState> = {};
      LOCAL_KEYS.forEach((key) => {
        const value = localStorage.getItem(key);
        if (value !== null) savedState[key] = value;
      });
      setAuthState((prev) => ({ ...prev, ...savedState }));
    });
  }, []);

  const isLoggedIn = Boolean(authState.token);

  const login = (
    token: string,
    orgId?: string,
    code?: string,
    name?: string,
    type?: string,
    category?: string,
    country?: string,
    language?: string
  ) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
      if (orgId) localStorage.setItem("organizationId", orgId);
      if (code) localStorage.setItem("organizationCode", code);
      if (name) localStorage.setItem("organizationName", name);
      if (type) localStorage.setItem("organizationType", type);
      if (category) localStorage.setItem("organizationCategory", category);
      if (country) localStorage.setItem("organizationCountry", country);
      if (language) localStorage.setItem("organizationLanguage", language);
    }

    setAuthState((prev) => ({
      ...prev,
      token,
      organizationId: orgId ?? prev.organizationId,
      organizationCode: code ?? prev.organizationCode,
      organizationName: name ?? prev.organizationName,
      organizationType: type ?? prev.organizationType,
      organizationCategory: category ?? prev.organizationCategory,
      organizationCountry: country ?? prev.organizationCountry,
      organizationLanguage: language ?? prev.organizationLanguage,
    }));
  };

  const logout = () => {
    if (typeof window !== "undefined") localStorage.clear();
    setAuthState({
      token: null,
      organizationId: null,
      organizationCode: null,
      organizationName: null,
      organizationType: null,
      organizationCategory: null,
      organizationCountry: null,
      organizationLanguage: null,
    });
  };

  const value = useMemo(() => ({ ...authState, isLoggedIn, login, logout }), [authState, isLoggedIn]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};