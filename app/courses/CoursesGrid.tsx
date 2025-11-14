"use client";

import React from "react";
import { Course } from "@/components/courses/types/Course";
import CourseCard from "@/app/courses/CourseCard";
import { useTranslation } from "@/contexts/TranslationContext";

interface Props {
  courses: Course[];
  onEdit: (id: string) => void;
  onView: (id: string) => void;
}

export default function CoursesGrid({ courses, onEdit, onView }: Props) {
  const { t } = useTranslation();

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {courses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
          {courses.map((course) => (
            <CourseCard
              key={course.course_id}
              course={course}
              onEdit={onEdit}
              onView={onView}
              onDelete={() => {}}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center mt-6">
          <h2 className="text-4xl font-semibold text-[var(--field-label)]">{t("noCoursesFound")}</h2>
          <p className="text-xl text-[var(--field-label)] text-center">
            {t("noCoursesSubtitle")}
          </p>
        </div>
      )}
    </div>
  );
}