"use client";

import React, { useState, useEffect } from "react";
import Modal from "@/components/common/Modal";
import { useTranslation } from "@/contexts/TranslationContext";
import { useToast } from "@/contexts/ToastContext";
import { useLoading } from "@/contexts/LoadingContext";
import { useAuth } from "@/contexts/AuthContext";

import {
  Coupon,
  CouponTabType,
  COUPON_TABS_CREATE,
  COUPON_TABS_LIST,
  COUPON_TABS_EDIT,
  COUPON_TABS_ANALYTICS,
  CouponListTab,
  CouponDetailsTab,
  ApplicableCoursesTab,
  CouponAnalyticsTab,
  ManageCouponFooter,
} from "@/components/coupons/imports";
import { Course } from "@/components/courses/types/Course";
import { MasterRecord } from "@/components/courses/types/MasterRecord";

import { saveCoupon } from "@/components/coupons/actions/saveCoupon";

interface ManageCouponModalProps {
  isOpen: boolean;
  coupons: Coupon[];
  courses: Course[];
  discountTypes: MasterRecord[];
  editingCoupon?: Coupon | null;
  onClose: () => void;
  onRefresh: () => void;
}

export default function ManageCouponModal({
  isOpen,
  coupons,
  courses,
  discountTypes,
  editingCoupon = null,
  onClose,
  onRefresh,
}: ManageCouponModalProps) {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const { start: startLoading, stop: stopLoading } = useLoading();
  const { token } = useAuth();

  const [mode, setMode] = useState<"create" | "list" | "edit" | "analytics">(
    coupons.length > 0 ? "list" : "create"
  );

  const [activeTab, setActiveTab] = useState<CouponTabType>(
    coupons.length > 0 ? "Coupons List" : "Coupon Details"
  );

  // Keep the full coupon object for editing
  const [currentCoupon, setCurrentCoupon] = useState<Coupon | null>(
    editingCoupon ?? null
  );

  // Coupon form states
  const [couponTitle, setCouponTitle] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [maxUses, setMaxUses] = useState<number | "">("");
  const [perUserLimit, setPerUserLimit] = useState<number | "">("");
  const [discountTypeCode, setDiscountTypeCode] = useState("");
  const [fixedDiscountValue, setFixedDiscountValue] = useState<number | "">(
    ""
  );
  const [percentageDiscountValue, setPercentageDiscountValue] = useState<
    number | ""
  >("");
  const [isPublic, setIsPublic] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [isLifetime, setIsLifetime] = useState(false);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Combine state updates to avoid cascading setState
  useEffect(() => {
    if (!isOpen) return;

    const newMode = editingCoupon ? "edit" : coupons.length > 0 ? "list" : "create";
    const newActiveTab =
      editingCoupon
        ? "Coupon Details"
        : coupons.length > 0
        ? "Coupons List"
        : "Coupon Details";

    setMode(newMode);
    setActiveTab(newActiveTab);

    // batch updating all coupon form states at once
    setCurrentCoupon(editingCoupon ?? null);
    setCouponTitle(editingCoupon?.coupon_title ?? "");
    setCouponCode(editingCoupon?.coupon_code ?? "");
    setMaxUses(editingCoupon?.max_uses ?? "");
    setPerUserLimit(editingCoupon?.per_user_limit ?? "");
    setDiscountTypeCode(editingCoupon?.discount_type_code ?? "");
    setFixedDiscountValue(editingCoupon?.fixed_discount_value ?? "");
    setPercentageDiscountValue(editingCoupon?.percentage_discount_value ?? "");
    setIsPublic(editingCoupon?.is_public ?? true);
    setIsVisible(editingCoupon?.is_visible ?? true);
    setIsLifetime(editingCoupon?.is_lifetime ?? false);
    setStartDate(editingCoupon?.start_date ?? null);
    setEndDate(editingCoupon?.end_date ?? null);
    setSelectedCourseIds(editingCoupon?.applicable_courses ?? []);
    setErrors({});
  }, [isOpen, editingCoupon, coupons.length]);

  // Clear a specific field error
  const handleClearError = (field: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  // Validation for coupon details
  const validateCouponDetails = () => {
    const newErrors: Record<string, string> = {};
    if (!couponTitle.trim()) newErrors.couponTitle = t("coupon_title_required");
    if (!couponCode.trim()) newErrors.couponCode = t("coupon_code_required");

    if (maxUses === "" || maxUses <= 0)
      newErrors.maxUses = t("max_uses_required");
    if (perUserLimit === "" || perUserLimit <= 0)
      newErrors.perUserLimit = t("per_user_limit_required");

    if (discountTypeCode === "FIXED" && (!fixedDiscountValue || fixedDiscountValue <= 0))
      newErrors.fixedDiscountValue = t("fixed_discount_required");
    else if (discountTypeCode === "PERCENTAGE" && (!percentageDiscountValue || percentageDiscountValue <= 0))
      newErrors.percentageDiscountValue = t("percentage_discount_required");

    if (!isLifetime) {
      if (!startDate) newErrors.startDate = t("start_date_required");
      if (!endDate) newErrors.endDate = t("end_date_required");
      if (startDate && endDate && startDate > endDate)
        newErrors.endDate = t("end_date_invalid");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateCouponDetails()) return;

    const loaderId = startLoading(t("saving_coupon"));
    try {
      await saveCoupon({
        coupon: currentCoupon,
        token,
        couponTitle,
        couponCode,
        maxUses,
        perUserLimit,
        discountTypeCode,
        fixedDiscountValue,
        percentageDiscountValue,
        isPublic,
        isVisible,
        isLifetime,
        startDate,
        endDate,
        applicableCourses: selectedCourseIds,
        t,
        onClose,
        onSaveSuccess: onRefresh,
        showToast,
      });
    } finally {
      stopLoading(loaderId);
    }
  };

  // Handle cancel separately to skip validation
  const handleCancel = () => {
    if (mode === "create" && coupons.length === 0) {
      onClose();
    } else {
      setMode("list");
      setActiveTab("Coupons List");
      setCouponTitle("");
      setCouponCode("");
      setMaxUses("");
      setPerUserLimit("");
      setDiscountTypeCode("");
      setFixedDiscountValue("");
      setPercentageDiscountValue("");
      setIsPublic(true);
      setIsVisible(true);
      setIsLifetime(false);
      setStartDate(null);
      setEndDate(null);
      setSelectedCourseIds([]);
      setErrors({});
      setCurrentCoupon(null);
    }
  };

  const getTabs = () => {
    switch (mode) {
      case "create": return COUPON_TABS_CREATE;
      case "list": return COUPON_TABS_LIST;
      case "edit": return COUPON_TABS_EDIT;
      case "analytics": return COUPON_TABS_ANALYTICS;
      default: return [];
    }
  };
  const TABS = getTabs().map((tab) => ({ ...tab, label: t(tab.label) }));

  const handleSetActiveTab = (tab: CouponTabType) => {
    if (activeTab === "Coupon Details" && (mode === "create" || mode === "edit")) {
      if (!validateCouponDetails()) return;
    }
    setActiveTab(tab);
    if (tab === "Coupons List") setMode("list");
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Coupons List":
        return (
          <CouponListTab
            coupons={coupons}
            onEdit={(coupon) => {
              setMode("edit");
              setActiveTab("Coupon Details");
              setCurrentCoupon(coupon);

              setCouponTitle(coupon.coupon_title);
              setCouponCode(coupon.coupon_code);
              setMaxUses(coupon.max_uses ?? "");
              setPerUserLimit(coupon.per_user_limit ?? "");
              setDiscountTypeCode(coupon.discount_type_code ?? "");
              setFixedDiscountValue(coupon.fixed_discount_value ?? "");
              setPercentageDiscountValue(coupon.percentage_discount_value ?? "");
              setIsPublic(coupon.is_public);
              setIsVisible(coupon.is_visible);
              setIsLifetime(coupon.is_lifetime);
              setStartDate(coupon.start_date ?? null);
              setEndDate(coupon.end_date ?? null);
              setSelectedCourseIds(coupon.applicable_courses);
            }}
            onViewAnalytics={() => {
              setMode("analytics");
              setActiveTab("Analytics");
            }}
          />
        );
      case "Coupon Details":
        return (
          <CouponDetailsTab
            couponTitle={couponTitle}
            onTitleChange={setCouponTitle}
            couponCode={couponCode}
            onCodeChange={setCouponCode}
            maxUses={maxUses}
            onMaxUsesChange={setMaxUses}
            perUserLimit={perUserLimit}
            onPerUserLimitChange={setPerUserLimit}
            discountTypes={discountTypes}
            discountTypeCode={discountTypeCode}
            onDiscountTypeChange={setDiscountTypeCode}
            fixedDiscountValue={fixedDiscountValue}
            onFixedDiscountChange={setFixedDiscountValue}
            percentageDiscountValue={percentageDiscountValue}
            onPercentageDiscountChange={setPercentageDiscountValue}
            isPublic={isPublic}
            onPublicChange={(val) => {
              setIsPublic(val);
              if (!val) setIsVisible(false);
            }}
            isVisible={isVisible}
            onVisibleChange={setIsVisible}
            isLifetime={isLifetime}
            onLifetimeChange={setIsLifetime}
            startDate={startDate}
            onStartDateChange={setStartDate}
            endDate={endDate}
            onEndDateChange={setEndDate}
            errors={errors}
            onClearError={handleClearError}
          />
        );
      case "Applicable Courses":
        return (
          <ApplicableCoursesTab
            courses={courses}
            selectedCourseIds={selectedCourseIds}
            onChange={setSelectedCourseIds}
          />
        );
      case "Analytics":
        return <CouponAnalyticsTab />;
      default:
        return null;
    }
  };

  return (
    <Modal
      title={t("manage_coupons")}
      subtitle={t("manage_coupons_subtitle")}
      isOpen={isOpen}
      onClose={onClose}
      size="xxl"
      tabs={TABS}
      activeTab={activeTab}
      onTabChange={handleSetActiveTab}
      footer={
        <ManageCouponFooter
          mode={mode}
          activeTab={activeTab}
          TABS={TABS}
          setActiveTab={handleSetActiveTab}
          onClose={onClose}
          onAddNew={() => {
            setMode("create");
            setActiveTab("Coupon Details");
            setCouponTitle("");
            setCouponCode("");
            setMaxUses("");
            setPerUserLimit("");
            setDiscountTypeCode("");
            setFixedDiscountValue("");
            setPercentageDiscountValue("");
            setIsPublic(true);
            setIsVisible(true);
            setIsLifetime(false);
            setStartDate(null);
            setEndDate(null);
            setSelectedCourseIds([]);
            setErrors({});
            setCurrentCoupon(null);
          }}
          onSaveSuccess={handleSave}
          onCancel={handleCancel}
          coupons={coupons}
        />
      }
    >
      {renderTabContent()}
    </Modal>
  );
}