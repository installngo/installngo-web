import React from "react";
import { TranslationProvider } from "@/contexts/TranslationContext";
import CoursesContent from "@/app/courses/CoursesContent";

export default function CoursesPage() {
  return (
    <TranslationProvider scope="portal" module="courses">
      <CoursesContent />
    </TranslationProvider>
  );
}