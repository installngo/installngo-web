import { Course } from "@/components/courses/types/Course";

interface SaveCourseParams {
  course: Course | null;
  token: string | null;
  isPaid: boolean;
  courseTitle: string;
  courseDescription: string;
  thumbnailFile: File | null;
  selectedCategory: string;
  selectedSubCategory: string;
  originalPrice: number | "";
  discountPrice: number | "";
  effectivePrice: number | "";
  courseValidity: string;
  expiryDate: string;
  courseSingleValidity: string;
  markNew: boolean;
  markFeatured: boolean;
  hasOfflineMaterial: boolean;
  t: (key: string, fallback?: string) => string;
  onClose: () => void;
  onSaveSuccess?: () => void;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
  showLoading?: (msg?: string) => void;
  hideLoading?: () => void;
}

// Normalize expiry date to UTC end-of-day
const normalizeExpiryDate = (dateString?: string | null): string | null => {
  if (!dateString) return null;
  try {
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return new Date(`${dateString}T23:59:59Z`).toISOString();
    }
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return null;
    return new Date(
      Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 23, 59, 59)
    ).toISOString();
  } catch {
    return null;
  }
};

// Check if there are any changes
const hasChanges = (
  course: Course | null,
  params: Omit<
    SaveCourseParams,
    | "course"
    | "token"
    | "t"
    | "onClose"
    | "onSaveSuccess"
    | "showToast"
    | "showLoading"
    | "hideLoading"
  >
) => {
  if (!course) return true;

  return (
    course.course_title !== params.courseTitle ||
    course.course_description !== params.courseDescription ||
    !!params.thumbnailFile ||
    course.category_code !== params.selectedCategory ||
    course.subcategory_code !== params.selectedSubCategory ||
    course.original_price !==
      (params.originalPrice === "" ? 0 : Number(params.originalPrice)) ||
    course.discount_price !==
      (params.discountPrice === "" ? 0 : Number(params.discountPrice)) ||
    course.effective_price !==
      (params.effectivePrice === "" ? 0 : Number(params.effectivePrice)) ||
    course.validity_code !== params.courseValidity ||
    course.expiry_date !==
      (params.courseValidity === "COURSEEXPIRY" ? params.expiryDate : null) ||
    course.single_validity_code !==
      (params.courseValidity === "SINGLEVALIDITY"
        ? params.courseSingleValidity
        : null) ||
    course.mark_new !== params.markNew ||
    course.mark_featured !== params.markFeatured ||
    course.has_offline_material !== params.hasOfflineMaterial
  );
};

// Generate random 8-character course code
const generateCourseCode = (): string =>
  Math.random().toString(36).substring(2, 10).toUpperCase();

export async function saveCourse(params: SaveCourseParams) {
  const {
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
    showLoading,
    hideLoading,
  } = params;

  // Only save if there are changes
  if (
    !hasChanges(course, {
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
    })
  ) {
    onClose();
    return;
  }

  try {
    // Show loader
    showLoading?.(
      course
        ? t("updating_course")
        : t("creating_course")
    );

    const courseId = course?.course_id || crypto.randomUUID();
    const courseCode = course?.course_code || generateCourseCode();

    let uploadedThumbnailUrl = course?.thumbnail_url || null;
    const oldThumbnailUrl = course?.thumbnail_url || null;

    // Upload new thumbnail if provided
    if (thumbnailFile) {
      const formData = new FormData();
      formData.append("file", thumbnailFile);
      formData.append("folder", "courses");
      formData.append("course_code", courseCode);

      const uploadRes = await fetch("/api/storage/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const uploadJson = await uploadRes.json();
      if (!uploadRes.ok || !uploadJson.success) {
        throw new Error(uploadJson.error || "Failed to upload thumbnail");
      }

      // Use full CloudFront URL directly
      uploadedThumbnailUrl = uploadJson.url;

      // Delete old thumbnail if changed
      if (oldThumbnailUrl && oldThumbnailUrl !== uploadedThumbnailUrl) {
        await fetch("/api/storage/delete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ path: oldThumbnailUrl }),
        });
      }
    }

    const isCourseExpiry = courseValidity === "COURSEEXPIRY";
    const isSingleValidity = courseValidity === "SINGLEVALIDITY";

    const body = {
      course_id: courseId,
      course_code: courseCode,
      is_paid: isPaid,
      course_title: courseTitle,
      course_description: courseDescription,
      thumbnail_url: uploadedThumbnailUrl,
      category_code: selectedCategory,
      subcategory_code: selectedSubCategory,
      original_price: isPaid
        ? originalPrice === ""
          ? null
          : Number(originalPrice)
        : 0,
      discount_price: isPaid
        ? discountPrice === ""
          ? null
          : Number(discountPrice)
        : 0,
      effective_price: isPaid
        ? effectivePrice === ""
          ? null
          : Number(effectivePrice)
        : 0,
      validity_code: courseValidity || "",

      expiry_date: isCourseExpiry ? normalizeExpiryDate(expiryDate) : null,
      single_validity_code: isSingleValidity
        ? courseSingleValidity || ""
        : null,

      mark_new: markNew,
      mark_featured: markFeatured,
      has_offline_material: hasOfflineMaterial,
    };

    const method = course ? "PUT" : "POST";

    const res = await fetch("/api/courses", {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to save course: ${errorText}`);
    }

    showToast(
      course
        ? t("course_updated")
        : t("course_created"),
      "success"
    );

    onClose();
    onSaveSuccess?.();
  } catch (err: unknown) {
    console.error("saveCourse error:", err);
    showToast(
      err instanceof Error ? err.message : "Failed to save course",
      "error"
    );
  } finally {
    hideLoading?.();
  }
}