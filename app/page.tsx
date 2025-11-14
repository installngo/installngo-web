"use client";

import { useTranslation } from "@/contexts/TranslationContext";

export default function Home() {
  const { t } = useTranslation();

  return (
    <section className="flex items-center justify-center h-full">
      <h1 className="text-2xl font-bold text-[var(--color-foreground)]">
        {t("home_title")}
      </h1>
    </section>
  );
}