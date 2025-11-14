// Define a type for tabs
export type TabType =
  | "Analytics"
  | "Course Details"
  | "Contents"
  | "Advanced Settings"
  | "Students Enrolled";

// Tabs for create/edit mode
export const COURSE_TABS_CREATE_EDIT = [
  { label: "course_details", value: "Course Details" as TabType },
  { label: "course_advanced_settings", value: "Advanced Settings" as TabType },
];

// Tabs for view mode
export const COURSE_TABS_VIEW = [
  { label: "course_analytics", value: "Analytics" as TabType },
  { label: "course_details", value: "Course Details" as TabType },
  { label: "course_advanced_settings", value: "Advanced Settings" as TabType },
  { label: "course_contents", value: "Contents" as TabType },
  { label: "course_students_enrolled", value: "Students Enrolled" as TabType },
];