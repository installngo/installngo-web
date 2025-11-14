"use client";

import React from "react";
import Switch from "@/components/common/Switch";
import { useTranslation } from "@/contexts/TranslationContext";

interface AdvancedSettingsTabProps {
  isViewMode?: boolean;

  markNew: boolean;
  markFeatured: boolean;
  hasOfflineMaterial: boolean;

  onMarkNewChange: (val: boolean) => void;
  onMarkFeaturedChange: (val: boolean) => void;
  onHasOfflineMaterialChange: (val: boolean) => void;
}

export default function AdvancedSettingsTab({
  isViewMode = false,

  markNew,
  markFeatured,
  hasOfflineMaterial,

  onMarkNewChange,
  onMarkFeaturedChange,
  onHasOfflineMaterialChange,
}: AdvancedSettingsTabProps) {
  const { t } = useTranslation();

  return (
    <div className="mt-3 grid grid-cols-1 gap-3">
      <Switch
        label={t("mark_as_new")}
        helperText={t("hp_mark_as_new")}
        size="sm"
        checked={markNew}
        onChange={onMarkNewChange}
        disabled={isViewMode}
      />

      <Switch
        label={t("mark_as_featured")}
        helperText={t("hp_mark_as_featured")}
        size="sm"
        checked={markFeatured}
        onChange={onMarkFeaturedChange}
        disabled={isViewMode}
      />

      <Switch
        label={t("course_has_offline_material")}
        helperText={t("hp_course_has_offline_material")}
        size="sm"
        checked={hasOfflineMaterial}
        onChange={onHasOfflineMaterialChange}
        disabled={isViewMode}
      />
    </div>
  );
}
