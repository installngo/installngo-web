"use client";

import React, { useState, useEffect } from "react";
import Input from "@/components/common/Input";
import Switch from "@/components/common/Switch";
import Select from "@/components/common/Select";
import { useTranslation } from "@/contexts/TranslationContext";
import { MasterRecord } from "@/components/courses/types/MasterRecord";
import { isoToDateInput, dateStringToDate } from "@/utils/date";

interface CouponDetailsTabProps {
  couponTitle: string;
  onTitleChange: (val: string) => void;
  couponCode: string;
  onCodeChange: (val: string) => void;

  maxUses: number | "";
  onMaxUsesChange: (val: number | "") => void;
  perUserLimit: number | "";
  onPerUserLimitChange: (val: number | "") => void;

  discountTypes: MasterRecord[];
  discountTypeCode?: string;
  onDiscountTypeChange: (val: string) => void;
  fixedDiscountValue: number | "";
  onFixedDiscountChange: (val: number | "") => void;
  percentageDiscountValue: number | "";
  onPercentageDiscountChange: (val: number | "") => void;

  isPublic: boolean;
  onPublicChange: (val: boolean) => void;
  isVisible: boolean;
  onVisibleChange: (val: boolean) => void;
  isLifetime: boolean;
  onLifetimeChange: (val: boolean) => void;
  startDate?: string | null;
  onStartDateChange: (val: string) => void;
  endDate?: string | null;
  onEndDateChange: (val: string) => void;
  errors?: Record<string, string>;
  onClearError?: (field: string) => void;
}

export default function CouponDetailsTab({
  couponTitle,
  onTitleChange,
  couponCode,
  onCodeChange,
  maxUses,
  onMaxUsesChange,
  perUserLimit,
  onPerUserLimitChange,
  discountTypes,
  discountTypeCode,
  onDiscountTypeChange,
  fixedDiscountValue,
  onFixedDiscountChange,
  percentageDiscountValue,
  onPercentageDiscountChange,
  isPublic,
  onPublicChange,
  isVisible,
  onVisibleChange,
  isLifetime,
  onLifetimeChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  errors = {},
  onClearError,
}: CouponDetailsTabProps) {
  const { t } = useTranslation();

  // Local state for discount type & dates
  const [localDiscountType, setLocalDiscountType] = useState<string>("");
  const [localStartDate, setLocalStartDate] = useState<string>("");
  const [localEndDate, setLocalEndDate] = useState<string>("");

  // Initialize default discount type
  useEffect(() => {
    const defaultType =
      discountTypeCode ||
      discountTypes.find((d) => d.is_default)?.code_code ||
      "";
    setTimeout(() => {
      setLocalDiscountType(defaultType);
      onDiscountTypeChange(defaultType);
    }, 0);
  }, [discountTypes, discountTypeCode, onDiscountTypeChange]);

  // Initialize local start/end dates from props
  useEffect(() => {
    setTimeout(() => {
      setLocalStartDate(isoToDateInput(startDate));
      setLocalEndDate(isoToDateInput(endDate));
    }, 0);
  }, [startDate, endDate]);

  // Handlers
  const handleDiscountTypeChange = (val: string) => {
    setLocalDiscountType(val);
    onDiscountTypeChange(val);
    onClearError?.("discountTypeCode");

    // Reset dependent fields
    if (val !== "FIXED") onFixedDiscountChange("");
    if (val !== "PERCENTAGE") onPercentageDiscountChange("");
  };

  const handleStartDateChange = (val: string) => {
    setLocalStartDate(val);
    onStartDateChange(val);
    onClearError?.("startDate");
  };

  const handleEndDateChange = (val: string) => {
    setLocalEndDate(val);
    onEndDateChange(val);
    onClearError?.("endDate");
  };

  const renderHelperText = () =>
    t("all_mandatory_fields")
      .split("*")
      .map((part, index, arr) => (
        <React.Fragment key={index}>
          {part}
          {index < arr.length - 1 && (
            <span style={{ color: "var(--field-mandatory)" }}>*</span>
          )}
        </React.Fragment>
      ));

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="col-span-1 md:col-span-2 flex flex-col gap-3">
        <p className="text-xs text-[var(--field-label)]">
          {renderHelperText()}
        </p>

        {/* Coupon Title & Code */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label={t("coupon_title")}
            placeholder={t("enter_coupon_title")}
            requiredField
            inputSize="sm"
            value={couponTitle}
            onChange={(e) => {
              onTitleChange(e.target.value);
              onClearError?.("couponTitle");
            }}
            error={errors.couponTitle}
          />

          <Input
            type="codetype"
            label={t("coupon_code")}
            placeholder={t("enter_coupon_code")}
            requiredField
            inputSize="sm"
            value={couponCode}
            onChange={(e) => {
              onCodeChange(e.target.value);
              onClearError?.("couponCode");
            }}
            error={errors.couponCode}
          />
        </div>

        {/* Max Uses & Per User Limit */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label={t("max_uses")}
            placeholder={t("enter_max_uses")}
            type="number"
            requiredField
            inputSize="sm"
            value={maxUses}
            onChange={(e) => {
              onMaxUsesChange(Number(e.target.value));
              onClearError?.("maxUses");
            }}
            error={errors.maxUses}
            helperText={t("hp_max_uses")}
          />
          <Input
            label={t("per_user_limit")}
            placeholder={t("enter_per_user_limit")}
            type="number"
            requiredField
            inputSize="sm"
            value={perUserLimit}
            onChange={(e) => {
              onPerUserLimitChange(Number(e.target.value));
              onClearError?.("perUserLimit");
            }}
            error={errors.perUserLimit}
            helperText={t("hp_per_user_limit")}
          />
        </div>

        {/* Discount Type & Value */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label={t("discount_type")}
            inputSize="sm"
            options={discountTypes.map((type) => ({
              label: t(type.display_name),
              value: type.code_code,
            }))}
            value={localDiscountType}
            onChange={(e) => handleDiscountTypeChange(e.target.value)}
          />

          {localDiscountType === "FIXED" && (
            <Input
              label={t("fixed_discount")}
              placeholder={t("enter_fixed_discount")}
              type="price"
              requiredField
              inputSize="sm"
              maxValue={9999999}
              value={fixedDiscountValue}
              onChange={(e) => {
                onFixedDiscountChange(Number(e.target.value));
                onClearError?.("fixedDiscountValue");
              }}
              error={errors.fixedDiscountValue}
            />
          )}

          {localDiscountType === "PERCENTAGE" && (
            <Input
              label={t("percentage_discount")}
              placeholder={t("enter_percentage_discount")}
              type="price"
              requiredField
              inputSize="sm"
              currencySymbol="%"
              maxValue={99}
              value={percentageDiscountValue}
              onChange={(e) => {
                onPercentageDiscountChange(Number(e.target.value));
                onClearError?.("percentageDiscountValue");
              }}
              error={errors.percentageDiscountValue}
            />
          )}
        </div>

        {/* Lifetime & Start/End Dates */}
        <div className="flex flex-col gap-2">
          <Switch
            label={t("lifetime_coupon")}
            helperText={t("hp_lifetime_coupon")}
            checked={isLifetime}
            size="sm"
            onChange={onLifetimeChange}
          />

          {!isLifetime && (
            <div className="flex gap-3">
              <Input
                label={t("start_date")}
                placeholder={t("select_start_date")}
                requiredField
                inputSize="sm"
                type="date"
                value={localStartDate}
                dateValue={dateStringToDate(localStartDate)}
                onChange={(e) => handleStartDateChange(e.target.value)}
                error={errors.startDate}
                className="flex-1"
              />

              <Input
                label={t("end_date")}
                placeholder={t("select_end_date")}
                requiredField
                inputSize="sm"
                type="date"
                value={localEndDate}
                dateValue={dateStringToDate(localEndDate)}
                onChange={(e) => handleEndDateChange(e.target.value)}
                error={errors.endDate}
                className="flex-1"
              />
            </div>
          )}
        </div>

        {/* Public & Visible Switches */}
        <div className="flex flex-col gap-2">
          <Switch
            label={t("public_coupon")}
            helperText={t("hp_public_coupon")}
            checked={isPublic}
            size="sm"
            onChange={(val) => {
              onPublicChange(val);
              if (!val) onVisibleChange(false);
            }}
          />

          <Switch
            label={t("visible_in_purchase")}
            helperText={t("hp_visible_in_purchase")}
            checked={isVisible}
            size="sm"
            onChange={onVisibleChange}
            disabled={!isPublic}
          />
        </div>
      </div>

      <div className="col-span-1 flex flex-col gap-2">
        {/* Placeholder for coupon preview / extra info */}
      </div>
    </div>
  );
}