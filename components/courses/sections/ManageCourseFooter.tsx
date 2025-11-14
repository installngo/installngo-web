"use client";

import React from "react";
import Button from "@/components/common/Button";
import { TabType } from "@/components/courses/imports";
import { useTranslation } from "@/contexts/TranslationContext";

interface ManageCourseFooterProps {
  mode: "create" | "edit" | "view";

  activeTab: TabType;
  TABS: { label: string; value: TabType }[];

  setActiveTab: (tab: TabType) => void;
  onClose: () => void;
  onSaveSuccess?: () => void;
}

export default function ManageCourseFooter({
  mode,

  activeTab,
  TABS,

  setActiveTab,
  onSaveSuccess,
}: ManageCourseFooterProps) {
  // General
  const { t } = useTranslation();
  const isViewMode = mode === "view";

  const activeTabIndex = TABS.findIndex((tab) => tab.value === activeTab);

  const isFirstTab = activeTabIndex === 0;
  const isLastTab = activeTabIndex === TABS.length - 1;

  // View Mode
  if (isViewMode) {
    return (
      <div className="flex justify-between gap-2">
        <div className="flex gap-2">
          <Button
            variant="secondary"
            className="h-8 w-24 text-sm"
            disabled={isFirstTab}
            onClick={() =>
              !isFirstTab && setActiveTab(TABS[activeTabIndex - 1].value)
            }
          >
            {t("previous_button")}
          </Button>
          <Button
            variant="primary"
            className="h-8 w-24 text-sm"
            disabled={isLastTab}
            onClick={() =>
              !isLastTab && setActiveTab(TABS[activeTabIndex + 1].value)
            }
          >
            {t("next_button")}
          </Button>
        </div>
      </div>
    );
  }

  // Create/Edit Mode
  let nextButtonLabel = t("next_button");
  let nextButtonWidth = "w-24";

  if (activeTab === "Course Details") {
    nextButtonLabel = t("advanced_settings_button");
    nextButtonWidth = "w-36";
  }
  if (isLastTab) {
    nextButtonLabel = t("save_button");
    nextButtonWidth = "w-32";
  }

  // Render
  return (
    <div className="flex items-center gap-2">
      {!isFirstTab && (
        <Button
          variant="secondary"
          className="h-8 w-24 text-sm"
          onClick={() => setActiveTab(TABS[activeTabIndex - 1].value)}
        >
          {t("previous_button")}
        </Button>
      )}

      <Button
        variant="primary"
        className={`h-8 ${nextButtonWidth} text-sm`}
        onClick={() => {
          if (!isLastTab) {
            setActiveTab(TABS[activeTabIndex + 1].value);
          } else {
            onSaveSuccess?.();
          }
        }}
      >
        {nextButtonLabel}
      </Button>
    </div>
  );
}