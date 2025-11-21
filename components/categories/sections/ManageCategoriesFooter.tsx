"use client";

import React from "react";
import Button from "@/components/common/Button";
import { useTranslation } from "@/contexts/TranslationContext";

interface ManageCategoriesFooterProps {
  activeTab: "Categories" | "SubCategories";
  TABS: { label: string; value: "Categories" | "SubCategories" }[];
  setActiveTab: (tab: "Categories" | "SubCategories") => void;
  onSave: () => void;
  disableSubCategories?: boolean;
}

export default function ManageCategoriesFooter({
  activeTab,
  TABS,
  setActiveTab,
  onSave,
  disableSubCategories = false,
}: ManageCategoriesFooterProps) {
  const { t } = useTranslation();

  const activeIndex = TABS.findIndex((tab) => tab.value === activeTab);
  const isFirstTab = activeIndex === 0;
  const isLastTab = activeIndex === TABS.length - 1;

  const buttons: React.ReactNode[] = [];

  if (isFirstTab) {
    buttons.push(
      <Button
        key="subcategories"
        variant="primary"
        className="h-8 w-32 text-sm"
        disabled={disableSubCategories}
        onClick={() => {
          if (disableSubCategories) return;
          const nextTab = TABS[activeIndex + 1];
          if (nextTab) setActiveTab(nextTab.value);
        }}
      >
        {t("subcategories_button")}
      </Button>
    );
  }

  if (isLastTab) {
    buttons.push(
      <Button
        key="previous"
        variant="secondary"
        className="h-8 w-24 text-sm"
        onClick={() => {
          const prevTab = TABS[activeIndex - 1];
          if (prevTab) setActiveTab(prevTab.value);
        }}
      >
        {t("previous_button")}
      </Button>
    );

    // Save
    buttons.push(
      <Button
        key="save"
        variant="primary"
        className="h-8 w-24 text-sm"
        onClick={onSave}
      >
        {t("save_button")}
      </Button>
    );
  }

  return <div className="flex items-center gap-2 justify-end">{buttons}</div>;
}