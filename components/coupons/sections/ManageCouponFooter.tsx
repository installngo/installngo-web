"use client";

import React from "react";
import Button from "@/components/common/Button";
import { CouponTabType } from "@/components/coupons/types/CouponTabs";
import { useTranslation } from "@/contexts/TranslationContext";
import { Coupon } from "@/components/coupons/types/Coupon";

interface ManageCouponFooterProps {
  mode: "create" | "edit" | "list" | "analytics";
  activeTab: CouponTabType;
  TABS: { label: string; value: CouponTabType }[];
  setActiveTab: (tab: CouponTabType) => void;
  onClose: () => void;
  onSaveSuccess?: () => void;
  onAddNew?: () => void;
  coupons?: Coupon[];
  onCancel?: () => void;
}

export default function ManageCouponFooter({
  mode,
  activeTab,
  TABS,
  setActiveTab,
  onClose,
  onSaveSuccess,
  onAddNew,
  coupons = [],
  onCancel,
}: ManageCouponFooterProps) {
  const { t } = useTranslation();
  const activeIndex = TABS.findIndex((tab) => tab.value === activeTab);
  const isFirstTab = activeIndex === 0;
  const isLastTab = activeIndex === TABS.length - 1;

  const buttons: React.ReactNode[] = [];

  // List Mode
  if (mode === "list" && activeTab === "Coupons List") {
    buttons.push(
      <Button key="close" variant="secondary" className="h-8 w-24 text-sm" onClick={onClose}>
        {t("close_button")}
      </Button>
    );
    buttons.push(
      <Button key="add" variant="primary" className="h-8 w-32 text-sm" onClick={onAddNew}>
        {t("add_new_button")}
      </Button>
    );
  }

  // Create/Edit Mode
  if (mode === "create" || mode === "edit") {
    if (isFirstTab) {
      buttons.push(
        <Button
          key="cancel"
          variant="secondary"
          className="h-8 w-24 text-sm"
          onClick={onCancel}
        >
          {t("cancel_button")}
        </Button>
      );
    }

    if (!isFirstTab) {
      buttons.push(
        <Button
          key="previous"
          variant="secondary"
          className="h-8 w-24 text-sm"
          onClick={() => setActiveTab(TABS[activeIndex - 1].value)}
        >
          {t("previous_button")}
        </Button>
      );
    }

    // Next / Save button
    let nextLabel = t("next_button");
    let nextWidth = "w-24";

    // Navigate to Applicable Courses tab instead of saving
    const isCouponDetailsTab = activeTab === "Coupon Details";
    if (isCouponDetailsTab) {
      nextLabel = t("applicable_courses_button");
      nextWidth = "w-36";
    }

    if (isLastTab) {
      nextLabel = t("save_button");
      nextWidth = "w-24";
    }

    const handleNextClick = () => {
      if (isCouponDetailsTab) {
        // Navigate to the next tab (Applicable Courses)
        const nextTab = TABS[activeIndex + 1];
        if (nextTab) setActiveTab(nextTab.value);
      } else if (isLastTab) {
        // Save only on last tab
        onSaveSuccess?.();
      } else {
        // Navigate to next tab
        const nextTab = TABS[activeIndex + 1];
        if (nextTab) setActiveTab(nextTab.value);
      }
    };

    buttons.push(
      <Button
        key="next"
        variant="primary"
        className={`h-8 ${nextWidth} text-sm`}
        onClick={handleNextClick}
      >
        {nextLabel}
      </Button>
    );
  }

  // Analytics Mode
  if (mode === "analytics" && activeTab === "Analytics") {
    buttons.push(
      <Button
        key="back"
        variant="secondary"
        className="h-8 w-24 text-sm"
        onClick={() => setActiveTab("Coupons List")}
      >
        {t("cancel_button")}
      </Button>
    );
  }

  return <div className="flex items-center gap-2 justify-end">{buttons}</div>;
}