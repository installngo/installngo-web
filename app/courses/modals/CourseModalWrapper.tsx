"use client";

import ManageCourseModal from "@/components/courses/ManageCourseModal";
import { Course } from "@/components/courses/types/Course";
import { Category } from "@/components/common/types/Category";
import { SubCategory } from "@/components/common/types/SubCategory";
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