"use client";

import React, { useState, useEffect, useMemo } from "react";
import Select from "@/components/common/Select";
import Input from "@/components/common/Input";
import { useTranslation } from "@/contexts/TranslationContext";
import { MasterRecord } from "@/components/courses/types/MasterRecord";
import { isoToDateInput, dateStringToDate } from "@/utils/date";

interface CourseValidityFieldsProps {
  isViewMode?: boolean;
  masterData: MasterRecord[];

  courseValidity: string;
  expiryDate: string;
  courseSingleValidity: string;

  onCourseValidityChange: (val: string) => void;
  onExpiryDateChange: (val: string) => void;
  onCourseSingleValidityChange: (val: string) => void;

  errors?: Record<string, string>;
  onClearError?: (field: string) => void;
}

export default function CourseValidityFields({
  isViewMode = false,
  masterData,

  courseValidity,
  expiryDate,
  courseSingleValidity,

  onCourseValidityChange,
  onExpiryDateChange,
  onCourseSingleValidityChange,

  errors = {},
  onClearError,
}: CourseValidityFieldsProps) {
  const { t } = useTranslation();

  // master record for single validity
  const singleValidityMaster = useMemo(
    () =>
      masterData.find(
        (m) =>
          m.code_type === "COURSEVALIDITY" && m.code_code === "SINGLEVALIDITY"
      ),
    [masterData]
  );

  // Derive local values from props
  const localValues = useMemo(() => {
    return {
      courseValidity:
        courseValidity ||
        masterData.find((m) => m.code_type === "COURSEVALIDITY" && m.is_default)
          ?.code_code ||
        "",
      singleValidity:
        courseSingleValidity ||
        singleValidityMaster?.sub_codes.find((s) => s.is_default)?.subcode_code ||
        "",
      expiryDate: isoToDateInput(expiryDate),
    };
  }, [courseValidity, courseSingleValidity, expiryDate, masterData, singleValidityMaster]);

  // Handlers
  const handleCourseValidityChange = (val: string) => {
    onCourseValidityChange(val);
    if (val !== "SINGLEVALIDITY") onCourseSingleValidityChange("");
    if (val !== "COURSEEXPIRY") onExpiryDateChange("");

    onClearError?.("courseValidity");
    onClearError?.("courseSingleValidity");
    onClearError?.("expiryDate");
  };

  const handleSingleValidityChange = (val: string) => {
    onCourseSingleValidityChange(val);
    onClearError?.("courseSingleValidity");
  };

  const handleExpiryDateChange = (val: string) => {
    onExpiryDateChange(val);
    onClearError?.("expiryDate");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-1">
      {/* Course Validity */}
      <Select
        label={t("course_validity")}
        requiredField
        inputSize="sm"
        includeEmptyOption
        emptyOptionLabel={t("select_validity")}
        options={
          masterData
            .filter((m) => m.code_type === "COURSEVALIDITY")
            .map((m) => ({
              label: m.display_name,
              value: m.code_code,
              is_default: m.is_default,
            })) || []
        }
        value={localValues.courseValidity}
        onChange={(e) => handleCourseValidityChange(e.target.value)}
        disabled={isViewMode}
        error={errors.courseValidity || undefined}
      />

      {/* Expiry Date */}
      {localValues.courseValidity === "COURSEEXPIRY" && (
        <Input
          label={t("expiry_date")}
          type="date"
          inputSize="sm"
          requiredField
          value={localValues.expiryDate}
          dateValue={dateStringToDate(localValues.expiryDate)}
          onChange={(e) => handleExpiryDateChange(e.target.value)}
          disabled={isViewMode}
          error={errors.expiryDate || undefined}
        />
      )}

      {/* Single Validity Dropdown */}
      {localValues.courseValidity === "SINGLEVALIDITY" && (
        <Select
          label={t("single_validity")}
          requiredField
          inputSize="sm"
          includeEmptyOption
          emptyOptionLabel={t("select_single_validity")}
          options={
            singleValidityMaster?.sub_codes.map((sub) => ({
              label: sub.display_name,
              value: sub.subcode_code,
              is_default: sub.is_default,
            })) || []
          }
          value={localValues.singleValidity}
          onChange={(e) => handleSingleValidityChange(e.target.value)}
          disabled={isViewMode}
          error={errors.courseSingleValidity || undefined}
        />
      )}
    </div>
  );
}