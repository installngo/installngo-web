"use client";

import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import { useTranslation } from "@/contexts/TranslationContext";

interface Props {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  onCreateCourse: () => void;
  onOpenCouponModal: () => void;
  onOpenCategoriesModal: () => void;
  hasCourses: boolean;
}

export default function CoursesHeader({
  searchTerm,
  setSearchTerm,
  onCreateCourse,
  onOpenCouponModal,
  onOpenCategoriesModal,
  hasCourses,
}: Props) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-4 border-b border-[var(--field-border)] bg-[var(--background)] z-10 sticky top-0">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--color-primary-text)]">
          {t("courses")}
        </h1>
        <h3 className="text-sm text-[var(--color-secondary-text)]">
          {t("manageCoursesSubtitle")}
        </h3>
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <Input
          placeholder={t("searchCourses", "Search courses...")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-60"
          inputSize="sm"
        />

        <div className="flex gap-2">
          <Button
            variant="primary"
            onClick={onOpenCouponModal}
            disabled={!hasCourses}
            className="h-8 w-30 text-sm"
          >
            {t("create_coupon_button")}
          </Button>

          <Button
            variant="primary"
            onClick={onCreateCourse}
            className="h-8 w-30 text-sm"
          >
            {t("create_course_button")}
          </Button>

          <Button
            variant="secondary"
            onClick={onOpenCategoriesModal}
            className="h-8 w-36 text-sm"
          >
            {t("manage_categories_button")}
          </Button>
        </div>
      </div>
    </div>
  );
}