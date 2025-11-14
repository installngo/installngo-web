"use client";

import React from "react";
import Input from "@/components/common/Input";
import { useTranslation } from "@/contexts/TranslationContext";

interface PriceFieldsProps {
  isViewMode?: boolean;

  originalPrice: number | "";
  discountPrice: number | "";
  effectivePrice: number | "";

  onOriginalPriceChange: (val: number | "") => void;
  onDiscountPriceChange: (val: number | "") => void;

  errors?: Record<string, string>;
  onClearError?: (field: string) => void;
}

export default function PriceFields({
  isViewMode = false,

  originalPrice,
  discountPrice,
  effectivePrice,

  onOriginalPriceChange,
  onDiscountPriceChange,

  errors = {},
  onClearError,
}: PriceFieldsProps) {
  // General
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-1">
      <Input
        label={t("original_price")}
        placeholder={t("enter_original_price")}
        requiredField
        inputSize="sm"
        type="price"
        value={originalPrice}
        maxValue={9999999}
        onChange={(e) => {
          const val = e.target.value === "" ? "" : Number(e.target.value);
          onOriginalPriceChange(val);
          onClearError?.("originalPrice");
        }}
        disabled={isViewMode}
        error={errors.originalPrice || undefined}
      />

      <Input
        label={t("discount_price")}
        placeholder={t("enter_discount_price")}
        requiredField
        inputSize="sm"
        type="price"
        value={discountPrice}
        maxValue={9999999}
        onChange={(e) => {
          const val = e.target.value === "" ? "" : Number(e.target.value);
          onDiscountPriceChange(val);
          onClearError?.("discountPrice");
        }}
        disabled={isViewMode}
        error={errors.discountPrice || undefined}
      />

      <Input
        label={t("effective_price")}
        inputSize="sm"
        type="price"
        value={String(effectivePrice)}
        disabled
        calculated
      />
    </div>
  );
}