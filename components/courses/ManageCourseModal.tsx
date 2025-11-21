"use client";

import { useState, useEffect, useRef } from "react";
import Modal from "@/components/common/Modal";
import { useTranslation } from "@/contexts/TranslationContext";
import { useToast } from "@/contexts/ToastContext";
import { saveCourse } from "@/components/courses/actions/saveCourse";
import { useAuth } from "@/contexts/AuthContext";
import { useLoading } from "@/contexts/LoadingContext";

import {
  Course,
  Category,
  SubCategory,
  MasterRecord,
  TabType,
  COURSE_TABS_CREATE_EDIT,
  COURSE_TABS_VIEW,
  AnalyticsTab,
  CourseDetailsTab,
  ContentsTab,
  AdvancedSettingsTab,
  StudentsEnrolledTab,
  ManageCourseFooter,
} from "@/components/courses/imports";

interface ManageCourseModalProps {
  isOpen: boolean;

  mode?: "create" | "edit" | "view";
  course?: Course | null;
  categories?: Category[];
  subCategories?: SubCategory[];
  masterData?: MasterRecord[];

  onClose: () => void;
  onSaveSuccess?: () => void;
}

export default function ManageCourseModal({
  isOpen,

  mode = "create",

  course = null,
  categories = [],
  subCategories = [],
  masterData = [],

  onClose,
  onSaveSuccess,
}: ManageCourseModalProps) {
  // General
  const { t } = useTranslation();
  const { showToast } = useToast();
  const { token } = useAuth();
  const { start: rawShowLoading, stop: rawHideLoading } = useLoading();
  const loaderIdRef = useRef<string | null>(null);

  const isViewMode = mode === "view";

  const TABS = (isViewMode ? COURSE_TABS_VIEW : COURSE_TABS_CREATE_EDIT).map(
    (tab) => ({ ...tab, label: t(tab.label) })
  );

  const [activeTab, setActiveTab] = useState<TabType>(TABS[0].value);

  // Form States
  const [isPaid, setIsPaid] = useState(course?.is_paid ?? false);
  const [courseTitle, setCourseTitle] = useState(course?.course_title ?? "");
  const [courseDescription, setCourseDescription] = useState(
    course?.course_description ?? ""
  );
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>(
    course?.thumbnail_url ?? ""
  );
  const [selectedCategory, setSelectedCategory] = useState(
    course?.category_code ?? ""
  );
  const [selectedSubCategory, setSelectedSubCategory] = useState(
    course?.subcategory_code ?? ""
  );
  const [originalPrice, setOriginalPrice] = useState<number | "">(
    course?.original_price ?? ""
  );
  const [discountPrice, setDiscountPrice] = useState<number | "">(
    course?.discount_price ?? ""
  );
  const [effectivePrice, setEffectivePrice] = useState<number | "">(
    course?.effective_price ?? ""
  );
  const [courseValidity, setCourseValidity] = useState(
    course?.validity_code ?? ""
  );
  const [expiryDate, setExpiryDate] = useState(course?.expiry_date ?? "");
  const [courseSingleValidity, setCourseSingleValidity] = useState(
    course?.single_validity_code ?? ""
  );
  const [markNew, setMarkNew] = useState(course?.mark_new ?? false);
  const [markFeatured, setMarkFeatured] = useState(
    course?.mark_featured ?? false
  );
  const [hasOfflineMaterial, setHasOfflineMaterial] = useState(
    course?.has_offline_material ?? false
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch signed URL for thumbnail if available
  useEffect(() => {
    const fetchThumbnailUrl = async () => {
      if (!course?.thumbnail_url) return;

      try {
        const res = await fetch(
          `/api/storage/download?path=${encodeURIComponent(
            course.thumbnail_url
          )}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        if (data.success && data.url) setThumbnailPreview(data.url);
        else setThumbnailPreview("/images/placeholder.png");
      } catch (error) {
        console.error("Error fetching thumbnail URL:", error);
        setThumbnailPreview("/images/placeholder.png");
      }
    };

    if (course && !thumbnailFile) fetchThumbnailUrl();
  }, [course, thumbnailFile, token]);

  // Reset form when modal opens
  useEffect(() => {
    if (!isOpen) return;

    const defaultCategory =
      categories.find((c) => c.is_default)?.category_code ?? "";
    const defaultSubCategory =
      subCategories.find(
        (s) => s.is_default && s.category_code === defaultCategory
      )?.subcategory_code ?? "";

    setTimeout(() => {
      setActiveTab(
        isViewMode
          ? COURSE_TABS_VIEW[0].value
          : COURSE_TABS_CREATE_EDIT[0].value
      );
      setIsPaid(course?.is_paid ?? false);
      setCourseTitle(course?.course_title ?? "");
      setCourseDescription(course?.course_description ?? "");
      setThumbnailFile(null);
      setThumbnailPreview(course?.thumbnail_url ?? "");
      if (mode === "create") {
        setSelectedCategory(defaultCategory);
        setSelectedSubCategory(defaultSubCategory);
      } else {
        setSelectedCategory(course?.category_code ?? "");
        setSelectedSubCategory(course?.subcategory_code ?? "");
      }
      setOriginalPrice(course?.original_price ?? "");
      setDiscountPrice(course?.discount_price ?? "");
      setEffectivePrice(course?.effective_price ?? "");

      if (mode === "create") {
        const defaultValidity =
          masterData.find(
            (m) => m.code_type === "COURSEVALIDITY" && m.is_default
          )?.code_code ?? "";

        setCourseValidity(defaultValidity);

        if (defaultValidity === "SINGLEVALIDITY") {
          const defaultSingleValidity = masterData
            .find(
              (m) =>
                m.code_type === "COURSEVALIDITY" &&
                m.code_code === "SINGLEVALIDITY"
            )
            ?.sub_codes.find((s) => s.is_default)?.subcode_code;

          setCourseSingleValidity(defaultSingleValidity ?? "");
          setExpiryDate("");
        } else if (defaultValidity === "COURSEEXPIRY") {
          setExpiryDate("");
          setCourseSingleValidity("");
        } else {
          setExpiryDate("");
          setCourseSingleValidity("");
        }
      } else {
        setCourseValidity(course?.validity_code ?? "");
        setCourseSingleValidity(course?.single_validity_code ?? "");
        setExpiryDate(course?.expiry_date ?? "");
      }

      setExpiryDate(course?.expiry_date ?? "");
      setMarkNew(course?.mark_new ?? false);
      setMarkFeatured(course?.mark_featured ?? false);
      setHasOfflineMaterial(course?.has_offline_material ?? false);
      setErrors({});
    }, 0);
  }, [isOpen, mode, course, isViewMode, masterData, categories, subCategories]);

  // Auto-calculate effective price
  useEffect(() => {
    setTimeout(() => {
      if (originalPrice === "" && discountPrice === "") {
        setEffectivePrice("");
        return;
      }
      const orig = Number(originalPrice) || 0;
      const disc = Number(discountPrice) || 0;
      setEffectivePrice(Math.max(orig - disc, 0));
    }, 0);
  }, [originalPrice, discountPrice]);

  // Validation
  const validateCourseDetails = () => {
    const newErrors: Record<string, string> = {};

    if (!courseTitle.trim()) newErrors.title = t("course_title_required");
    if (!courseDescription.trim())
      newErrors.description = t("course_description_required");
    if (!thumbnailPreview) newErrors.thumbnail = t("course_thumbnail_required");
    if (!selectedCategory) newErrors.category = t("category_required");
    if (!selectedSubCategory) newErrors.subcategory = t("subcategory_required");
    if (isPaid) {
      if (originalPrice === "" || Number(originalPrice) <= 0)
        newErrors.originalPrice = t("original_price_required");
      if (discountPrice === "" || Number(discountPrice) < 0)
        newErrors.discountPrice = t("discount_price_required");
    }
    if (
      originalPrice !== "" &&
      discountPrice !== "" &&
      Number(discountPrice) >= Number(originalPrice)
    ) {
      newErrors.discountPrice = t("discount_must_be_less");
    }
    if (
      originalPrice !== "" &&
      discountPrice !== "" &&
      Number(discountPrice) === Number(originalPrice)
    ) {
      newErrors.discountPrice = t("discount_not_same");
    }

    if (!courseValidity) newErrors.courseValidity = t("validity_type_required");
    else if (courseValidity === "COURSEEXPIRY" && !expiryDate)
      newErrors.expiryDate = t("expiry_date_required");
    else if (courseValidity === "SINGLEVALIDITY" && !courseSingleValidity)
      newErrors.courseSingleValidity = t("single_validity_required");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClearError = (field: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  // Handle Tab Changes
  const handleTabChange = (tab: TabType) => {
    if (
      activeTab === "Course Details" &&
      (mode === "create" || mode === "edit")
    ) {
      if (!validateCourseDetails()) return;
    }

    setActiveTab(tab);
  };

  // Save Handler
  const handleSave = async () => {
    if (!validateCourseDetails()) return;

    await saveCourse({
      course,
      token,

      isPaid,
      courseTitle,
      courseDescription,
      thumbnailFile,
      selectedCategory,
      selectedSubCategory,
      originalPrice,
      discountPrice,
      effectivePrice,
      courseValidity,
      expiryDate,
      courseSingleValidity,
      markNew,
      markFeatured,
      hasOfflineMaterial,

      t,
      onClose,
      onSaveSuccess,

      showToast,

      // Wrap loading to match zero-arg signature
      showLoading: () => {
        loaderIdRef.current = rawShowLoading("Saving course...");
      },
      hideLoading: () => {
        if (loaderIdRef.current) {
          rawHideLoading(loaderIdRef.current);
          loaderIdRef.current = null;
        }
      },
    });
  };

  // Tab Contents Render
  const renderTabContent = () => {
    switch (activeTab) {
      case "Analytics":
        return <AnalyticsTab />;
      case "Course Details":
        return (
          <CourseDetailsTab
            isViewMode={isViewMode}
            categories={categories}
            subCategories={subCategories}
            masterData={masterData}
            isPaid={isPaid}
            courseTitle={courseTitle}
            courseDescription={courseDescription}
            thumbnailPreview={thumbnailPreview ?? ""}
            selectedCategory={selectedCategory}
            selectedSubCategory={selectedSubCategory}
            originalPrice={originalPrice}
            discountPrice={discountPrice}
            effectivePrice={effectivePrice}
            courseValidity={courseValidity}
            expiryDate={expiryDate}
            courseSingleValidity={courseSingleValidity}
            errors={errors}
            onPaidChange={setIsPaid}
            onTitleChange={setCourseTitle}
            onDescriptionChange={setCourseDescription}
            onThumbnailChange={(file, preview) => {
              setThumbnailFile(file);
              setThumbnailPreview(preview ?? "");
            }}
            onCategoryChange={setSelectedCategory}
            onSubCategoryChange={setSelectedSubCategory}
            onOriginalPriceChange={setOriginalPrice}
            onDiscountPriceChange={setDiscountPrice}
            onCourseValidityChange={setCourseValidity}
            onExpiryDateChange={setExpiryDate}
            onCourseSingleValidityChange={setCourseSingleValidity}
            onClearError={handleClearError}
          />
        );
      case "Contents":
        return <ContentsTab />;
      case "Advanced Settings":
        return (
          <AdvancedSettingsTab
            isViewMode={isViewMode}
            markNew={markNew}
            markFeatured={markFeatured}
            hasOfflineMaterial={hasOfflineMaterial}
            onMarkNewChange={setMarkNew}
            onMarkFeaturedChange={setMarkFeatured}
            onHasOfflineMaterialChange={setHasOfflineMaterial}
          />
        );
      case "Students Enrolled":
        return <StudentsEnrolledTab />;
      default:
        return null;
    }
  };

  return (
    <Modal
      title={
        mode === "create"
          ? t("create_course")
          : mode === "edit"
          ? t("edit_course")
          : t("view_course")
      }
      subtitle={
        mode === "create"
          ? t("create_course_subtitle")
          : mode === "edit"
          ? t("edit_course_subtitle")
          : t("view_course_subtitle")
      }
      isOpen={isOpen}
      onClose={onClose}
      size="xxl"
      footer={
        <ManageCourseFooter
          mode={mode}
          activeTab={activeTab}
          TABS={TABS}
          setActiveTab={handleTabChange}
          onClose={onClose}
          onSaveSuccess={handleSave}
        />
      }
      tabs={TABS}
      activeTab={activeTab}
      onTabChange={handleTabChange}
    >
      {renderTabContent()}
    </Modal>
  );
}
