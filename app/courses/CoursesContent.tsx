"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Course } from "@/components/courses/types/Course";
import { Category } from "@/components/common/types/Category";
import { SubCategory } from "@/components/common/types/SubCategory";
import { MasterRecord } from "@/components/courses/types/MasterRecord";

import CoursesHeader from "./CoursesHeader";
import CoursesGrid from "./CoursesGrid";
import CourseModalWrapper from "./modals/CourseModalWrapper";
import CouponModalWrapper from "./modals/CouponModalWrapper";
import CategoriesModalWrapper from "./modals/CategoriesModalWrapper";
import { useLoading } from "@/contexts/LoadingContext";

export default function CoursesContent() {
  const { token } = useAuth();
  const { start, stop } = useLoading();

  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [masterData, setMasterData] = useState<MasterRecord[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [courseModalMode, setCourseModalMode] = useState<
    "create" | "edit" | "view"
  >("create");
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);  
  const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false);

  // Memoized start/stop wrappers
  const safeStart = useCallback((msg?: string) => start(msg), [start]);
  const safeStop = useCallback((id: string) => stop(id), [stop]);

  // ---------- Fetch Functions ----------
  const fetchCourses = useCallback(async () => {
    const loaderId = safeStart("Loading Courses...");
    try {
      const res = await fetch("/api/courses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setCourses(data.data);
        setFilteredCourses(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      safeStop(loaderId);
    }
  }, [token, safeStart, safeStop]);

  const fetchCategories = useCallback(async () => {
    const loaderId = safeStart("Loading Categories...");
    try {
      const [catRes, subCatRes] = await Promise.all([
        fetch("/api/category-subcategory?type=category", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/category-subcategory?type=subcategory", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      const catData = await catRes.json();
      const subCatData = await subCatRes.json();
      if (catData.success) setCategories(catData.data);
      if (subCatData.success) setSubCategories(subCatData.data);
    } catch (err) {
      console.error(err);
    } finally {
      safeStop(loaderId);
    }
  }, [token, safeStart, safeStop]);

  const fetchMasterData = useCallback(
    async (codeTypes: string[]) => {
      const loaderId = safeStart("Loading Master Data...");
      try {
        const allMaster: MasterRecord[] = [];
        for (const codeType of codeTypes) {
          const res = await fetch("/api/code-subcode", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ code_type: codeType }),
          });
          const data = await res.json();
          if (data.success && Array.isArray(data.data))
            allMaster.push(...data.data);
        }
        setMasterData(allMaster);
      } catch (err) {
        console.error(err);
      } finally {
        safeStop(loaderId);
      }
    },
    [token, safeStart, safeStop]
  );

  // ---------- Initial Load ----------
  useEffect(() => {
    fetchCourses();
    fetchCategories();
    fetchMasterData(["COURSEVALIDITY"]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- Debounce Search ----------
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    if (!debouncedSearch) setFilteredCourses(courses);
    else
      setFilteredCourses(
        courses.filter((c) =>
          c.course_title.toLowerCase().includes(debouncedSearch.toLowerCase())
        )
      );
  }, [debouncedSearch, courses]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <CoursesHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onCreateCourse={() => {
          setSelectedCourse(null);
          setCourseModalMode("create");
          setIsCourseModalOpen(true);
        }}
        onOpenCouponModal={() => setIsCouponModalOpen(true)}
        onOpenCategoriesModal={() => setIsCategoriesModalOpen(true)}
        hasCourses={courses.length > 0}
      />
      <CoursesGrid
        courses={filteredCourses}
        onEdit={(id) => {
          setSelectedCourse(courses.find((c) => c.course_id === id) ?? null);
          setCourseModalMode("edit");
          setIsCourseModalOpen(true);
        }}
        onView={(id) => {
          setSelectedCourse(courses.find((c) => c.course_id === id) ?? null);
          setCourseModalMode("view");
          setIsCourseModalOpen(true);
        }}
      />
      <CourseModalWrapper
        isOpen={isCourseModalOpen}
        course={selectedCourse}
        mode={courseModalMode}
        categories={categories}
        subCategories={subCategories}
        masterData={masterData}
        onClose={() => {
          setIsCourseModalOpen(false);
          setSelectedCourse(null);
        }}
        onSaveSuccess={() => {
          setIsCourseModalOpen(false);
          setSelectedCourse(null);
          fetchCourses();
        }}
      />
      <CouponModalWrapper
        isOpen={isCouponModalOpen}
        onClose={() => setIsCouponModalOpen(false)}
        courses={courses}
      />
      <CategoriesModalWrapper
        isOpen={isCategoriesModalOpen}
        onClose={() => setIsCategoriesModalOpen(false)}
        categories={categories}
        subCategories={subCategories}
        onSaveSuccess={() => fetchCategories()}
      />
    </div>
  );
}