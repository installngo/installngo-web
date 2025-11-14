"use client";

import { ReactNode } from "react";
import { LoadingProvider } from "./LoadingContext";
import { ToastProvider } from "./ToastContext";
import { AuthProvider } from "./AuthContext";
import { ThemeProvider } from "./ThemeContext";
import { TranslationProvider } from "./TranslationContext";
import { PreloginProvider } from "./PreloginContext";

interface ProvidersProps {
  children: ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <LoadingProvider>
      <ToastProvider>
        <AuthProvider>
          <ThemeProvider>
            <TranslationProvider>
              <PreloginProvider>
                {children}
              </PreloginProvider>
            </TranslationProvider>
          </ThemeProvider>
        </AuthProvider>
      </ToastProvider>
    </LoadingProvider>
  );
};