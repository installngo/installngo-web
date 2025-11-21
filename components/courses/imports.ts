// Types
export type { Course } from "./types/Course";
export type { Category } from "@/components/common/types/Category";
export type { SubCategory } from "@/components/common/types/SubCategory";
export type { MasterRecord } from "./types/MasterRecord";
export type { TabType } from "./types/CourseTabs";

export { COURSE_TABS_CREATE_EDIT, COURSE_TABS_VIEW } from "./types/CourseTabs";

// Tabs
export { default as AnalyticsTab } from "./tabs/AnalyticsTab";
export { default as CourseDetailsTab } from "./tabs/CourseDetailsTab";
export { default as ContentsTab } from "./tabs/ContentsTab";
export { default as AdvancedSettingsTab } from "./tabs/AdvancedSettingsTab";
export { default as StudentsEnrolledTab } from "./tabs/StudentsEnrolledTab";

export { default as ManageCourseFooter } from "./sections/ManageCourseFooter";