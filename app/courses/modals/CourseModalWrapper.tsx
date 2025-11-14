"use client";

import React from "react";
import ManageCourseModal from "@/components/courses/ManageCourseModal";
import { Course } from "@/components/courses/types/Course";
import { Category } from "@/components/courses/types/Category";
import { SubCategory } from "@/components/courses/types/SubCategory";
import { MasterRecord } from "@/components/courses/types/MasterRecord";

interface Props {
  isOpen: boolean;
  course: Course | null;
  mode: "create" | "edit" | "view";
  categories: Category[];
  subCategories: SubCategory[];
  masterData: MasterRecord[];
  onClose: () => void;
  onSaveSuccess: () => void;
}

export default function CourseModalWrapper(props: Props) {
  return <ManageCourseModal {...props} />;
}
