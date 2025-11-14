"use client";

import React, { useState, useMemo } from "react";
import { Course } from "@/components/courses/types/Course";
import Input from "@/components/common/Input";

interface Props {
  courses: Course[];
  selectedCourseIds: string[];
  onChange: (selectedIds: string[]) => void;
}

export default function ApplicableCoursesTab({
  courses,
  selectedCourseIds,
  onChange,
}: Props) {
  const [search, setSearch] = useState("");

  // Filter only paid courses and search
  const filteredCourses = useMemo(() => {
    return courses
      .filter((course) => course.is_paid) // Only paid courses
      .filter((course) =>
        course.course_title.toLowerCase().includes(search.toLowerCase())
      );
  }, [courses, search]);

  const toggleCourse = (id: string) => {
    if (selectedCourseIds.includes(id)) {
      onChange(selectedCourseIds.filter((c) => c !== id));
    } else {
      onChange([...selectedCourseIds, id]);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Sticky Top Bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-2 flex justify-end">
        <Input
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          inputSize="sm"
          width="200px"
        />
      </div>

      {/* Courses Grid (scrollable) */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filteredCourses.map((course) => {
            const isSelected = selectedCourseIds.includes(course.course_id);

            const hasDiscount =
              course.discount_price &&
              course.discount_price < (course.original_price ?? 0);
            const discountPercentage = hasDiscount
              ? Math.round(
                  ((course.original_price! - course.discount_price!) /
                    course.original_price!) *
                    100
                )
              : 0;

            return (
              <button
                key={course.course_id}
                onClick={() => toggleCourse(course.course_id)}
                className={`border rounded-md p-2 text-left w-full flex flex-col justify-between transition-all duration-150 ${
                  isSelected
                    ? "bg-blue-50 border-blue-400"
                    : "bg-white border-gray-300 hover:shadow"
                }`}
                style={{ minHeight: "80px" }} // Reduced height
              >
                {/* Title */}
                <div className="font-medium text-sm line-clamp-2">
                  {course.course_title}
                </div>

                {/* Price */}
                <div className="text-xs flex flex-col gap-0.5 mt-1">
                  {hasDiscount ? (
                    <>
                      <span className="text-gray-400 line-through">
                        ${course.original_price?.toFixed(2)}
                      </span>
                      <span className="text-green-600 font-semibold">
                        ${course.discount_price?.toFixed(2)} ({discountPercentage}%
                        off)
                      </span>
                    </>
                  ) : (
                    <span className="text-gray-800 font-semibold">
                      ${course.original_price?.toFixed(2)}
                    </span>
                  )}
                </div>
              </button>
            );
          })}

          {filteredCourses.length === 0 && (
            <div className="col-span-full text-center text-gray-500 mt-4">
              No courses found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}