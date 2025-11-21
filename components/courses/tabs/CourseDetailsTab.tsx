"use client";

import React from "react";
import Image from "next/image";
import Input from "@/components/common/Input";
import Switch from "@/components/common/Switch";
import Select from "@/components/common/Select";
import PriceFields from "@/components/courses/sections/PriceFields";
import CourseValidityFields from "@/components/courses/sections/CourseValidityFields";
import { useTranslation } from "@/contexts/TranslationContext";
import { useToast } from "@/contexts/ToastContext";

import { Category } from "@/components/common/types/Category";
import { SubCategory } from "@/components/common/types/SubCategory";
import { MasterRecord } from "@/components/courses/types/MasterRecord";

interface CourseDetailsTabProps {
  isViewMode?: boolean;

  categories: Category[];
  subCategories: SubCategory[];
  masterData: MasterRecord[];

  isPaid: boolean;
  courseTitle: string;
  courseDescription: string;
  thumbnailPreview: string;
  selectedCategory: string;
  selectedSubCategory: string;
  originalPrice: number | "";
  discountPrice: number | "";
  effectivePrice: number | "";
  courseValidity: string;
  expiryDate: string;
  courseSingleValidity: string;

  onPaidChange: (val: boolean) => void;
  onTitleChange: (val: string) => void;
  onDescriptionChange: (val: string) => void;
  onThumbnailChange: (file: File | null, previewUrl: string) => void;
  onCategoryChange: (val: string) => void;
  onSubCategoryChange: (val: string) => void;
  onOriginalPriceChange: (val: number | "") => void;
  onDiscountPriceChange: (val: number | "") => void;
  onCourseValidityChange: (val: string) => void;
  onExpiryDateChange: (val: string) => void;
  onCourseSingleValidityChange: (val: string) => void;

  errors?: Record<string, string>;
  onClearError?: (field: string) => void;
}

export default function CourseDetailsTab({
  isViewMode = false,

  categories,
  subCategories,
  masterData,

  isPaid,
  courseTitle,
  courseDescription,
  thumbnailPreview,
  selectedCategory,
  selectedSubCategory,
  originalPrice,
  discountPrice,
  effectivePrice,
  courseValidity,
  expiryDate,
  courseSingleValidity,

  onPaidChange,
  onTitleChange,
  onDescriptionChange,
  onThumbnailChange,
  onCategoryChange,
  onSubCategoryChange,
  onOriginalPriceChange,
  onDiscountPriceChange,
  onCourseValidityChange,
  onExpiryDateChange,
  onCourseSingleValidityChange,

  errors = {},
  onClearError,
}: CourseDetailsTabProps) {
  // General
  const { t } = useTranslation();
  const { showToast } = useToast();

  const filteredSubCategories = subCategories.filter(
    (s) => s.category_code === selectedCategory
  );

  // Top Helper Text
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

  // Thumbnail Preview
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 1.5 * 1024 * 1024;
    if (file.size > maxSize) {
      showToast("File is too large. Max 1.5 MB allowed.", "error");
      e.currentTarget.value = "";
      return;
    }

    if (!["image/png", "image/jpeg"].includes(file.type)) {
      showToast("Invalid file type. Only PNG and JPEG are allowed.", "error");
      e.currentTarget.value = "";
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    onThumbnailChange(file, previewUrl);
    onClearError?.("thumbnail");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* --- Left Side Section --*/}
      <div className="col-span-1 md:col-span-2 flex flex-col gap-3">
        <p className="text-xs text-[var(--field-label)]">
          {renderHelperText()}
        </p>

        <Switch
          label={t("paid_course")}
          helperText={t("hp_paid_course")}
          checked={isPaid}
          size="sm"
          onChange={(val) => {
            onPaidChange(val);

            if (!val) {
              onOriginalPriceChange("");
              onDiscountPriceChange("");

              onClearError?.("originalPrice");
              onClearError?.("discountPrice");
            } else {
              onClearError?.("originalPrice");
              onClearError?.("discountPrice");
            }

            onClearError?.("is_paid");
          }}
          disabled={isViewMode}
        />

        <Input
          label={t("course_title")}
          placeholder={t("enter_course_title")}
          requiredField
          fullWidth
          inputSize="sm"
          value={courseTitle}
          onChange={(e) => {
            onTitleChange(e.target.value);
            onClearError?.("title");
          }}
          error={errors.title}
          disabled={isViewMode}
        />

        <Input
          label={t("course_description")}
          placeholder={t("enter_course_description")}
          requiredField
          fullWidth
          inputSize="sm"
          type="textarea"
          rows={5}
          value={courseDescription}
          onChange={(e) => {
            onDescriptionChange(e.target.value);
            onClearError?.("description");
          }}
          error={errors.description}
          disabled={isViewMode}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label={t("category")}
            placeholder={t("select_category")}
            requiredField
            inputSize="sm"
            includeEmptyOption
            emptyOptionLabel={t("select_category")}
            options={categories.map((cat) => ({
              label: cat.display_name,
              value: cat.category_code,
              is_default: cat.is_default,
            }))}
            value={selectedCategory}
            onChange={(e) => {
              const val = e.target.value;
              onCategoryChange(val);
              onClearError?.("category");

              const relatedSubs = subCategories.filter(
                (s) => s.category_code === val
              );
              const defaultSub = relatedSubs.find((s) => s.is_default);
              if (defaultSub) {
                onSubCategoryChange(defaultSub.subcategory_code);
                onClearError?.("subcategory");
              } else {
                onSubCategoryChange("");
              }
            }}
            disabled={isViewMode}
            error={errors.category || undefined}
          />

          <Select
            label={t("subcategory")}
            requiredField
            inputSize="sm"
            includeEmptyOption
            emptyOptionLabel={t("select_subcategory")}
            options={filteredSubCategories.map((sub) => ({
              label: sub.display_name,
              value: sub.subcategory_code,
              is_default: sub.is_default,
            }))}
            value={selectedSubCategory}
            onChange={(e) => {
              onSubCategoryChange(e.target.value);
              onClearError?.("subcategory");
            }}
            disabled={isViewMode}
            error={errors.subcategory || undefined}
          />
        </div>

        {isPaid && (
          <PriceFields
            isViewMode={isViewMode}
            originalPrice={originalPrice}
            discountPrice={discountPrice}
            effectivePrice={effectivePrice}
            onOriginalPriceChange={(val) => {
              onOriginalPriceChange(val);
              onClearError?.("originalPrice");
            }}
            onDiscountPriceChange={(val) => {
              onDiscountPriceChange(val);
              onClearError?.("discountPrice");
            }}
            errors={errors}
          />
        )}

        <CourseValidityFields
          isViewMode={isViewMode}
          masterData={masterData}
          courseValidity={courseValidity}
          expiryDate={expiryDate}
          courseSingleValidity={courseSingleValidity}
          onCourseValidityChange={onCourseValidityChange}
          onExpiryDateChange={onExpiryDateChange}
          onCourseSingleValidityChange={onCourseSingleValidityChange}
          errors={errors}
          onClearError={onClearError}
        />
      </div>

      {/* --- Right Side Section --- */}
      <div className="col-span-1 flex flex-col gap-2">
        <label className="text-sm font-medium text-[var(--field-label)]">
          {t("course_thumbnail")}
          <span style={{ color: "var(--field-mandatory)" }}> *</span>
        </label>

        <div className="relative w-full max-w-[300px]">
          <input
            id="thumbnail-upload"
            type="file"
            accept="image/png, image/jpeg"
            className="hidden"
            onChange={handleThumbnailChange}
            disabled={isViewMode}
          />

          <div
            className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg transition p-3 text-center min-h-[180px] ${
              errors.thumbnail
                ? "border-[var(--field-error)]"
                : "border-[var(--field-border)] hover:border-[var(--field-border-focus)]"
            }`}
          >
            {thumbnailPreview ? (
              <div className="relative">
                <Image
                  loader={({ src }) => src}
                  src={thumbnailPreview}
                  alt="Thumbnail preview"
                  width={260}
                  height={150}
                  className="object-contain rounded-md"
                  unoptimized
                />
                {!isViewMode && (
                  <button
                    type="button"
                    onClick={() =>
                      document.getElementById("thumbnail-upload")?.click()
                    }
                    className="absolute bottom-2 right-2 bg-[var(--button-primary)] text-[var(--button-danger-text)] text-xs px-2 py-1 rounded shadow hover:border-[var(--button-primary-hover)] transition cursor-pointer"
                  >
                    {t("change_thumbnail_image")}
                  </button>
                )}
              </div>
            ) : (
              !isViewMode && (
                <label
                  htmlFor="thumbnail-upload"
                  className="cursor-pointer flex flex-col items-center justify-center w-full h-full"
                >
                  <div
                    className={`text-sm font-medium ${
                      errors.thumbnail
                        ? "text-[var(--field-error)]"
                        : "text-[var(--field-label)]"
                    }`}
                  >
                    {t("recommended_thumbnail_size")}
                  </div>
                </label>
              )
            )}
          </div>

          {errors.thumbnail && (
            <p className="text-xs text-[var(--field-error)] mt-1">
              {errors.thumbnail}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}