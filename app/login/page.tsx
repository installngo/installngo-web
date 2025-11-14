"use client";

import { useEffect, useState } from "react";
import AuthSelector from "./AuthSelector";
import { useTranslation } from "@/contexts/TranslationContext";

export default function LoginPage() {
  const { t } = useTranslation();
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isDesktop) {
    return (
      <main className="h-full flex items-center justify-center text-center overflow-hidden">
        <div>
          <h1 className="text-xl font-semibold text-[var(--color-primary-text)] mb-2">
            {t("mobileNotSupportedTitle", "Limited Access")}
          </h1>
          <p className="text-gray-600">
            {t(
              "mobileNotSupportedMessage",
              "For a better experience, please use a laptop or desktop device."
            )}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="h-full w-full flex flex-col overflow-hidden">
      <div className="flex flex-1 flex-col md:flex-row items-center justify-center">
        {/* Left: Welcome text */}
        <section className="hidden md:flex flex-1 flex-col items-center text-center justify-center p-12">
          <h1 className="text-4xl font-bold mb-2 text-[var(--color-primary-text)]">
            {t("welcomeTitle", "Welcome to InstallnGo")}
          </h1>
          <h1 className="text-sm text-gray-600">
            {t("welcomeSubtitle", "Manage your organization efficiently")}
          </h1>
        </section>

        {/* Right: Auth form */}
        <section className="flex flex-1 items-center justify-center w-full p-4">
          <div className="w-full max-w-md">
            <AuthSelector />
          </div>
        </section>
      </div>
    </main>
  );
}