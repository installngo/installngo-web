import { Coupon } from "@/components/coupons/types/Coupon";

interface SaveCouponParams {
  coupon: Coupon | null;
  token: string | null;
  couponTitle: string;
  couponCode: string;
  maxUses: number | "";
  perUserLimit: number | "";
  discountTypeCode: string;
  fixedDiscountValue: number | "";
  percentageDiscountValue: number | "";
  isPublic: boolean;
  isVisible: boolean;
  isLifetime: boolean;
  startDate: string | null;
  endDate: string | null;
  applicableCourses: string[];
  t: (key: string, fallback?: string) => string;
  onClose: () => void;
  onSaveSuccess?: () => void;
  showToast: (msg: string, type?: "success" | "error" | "info") => void;
  showLoading?: (msg?: string) => void;
  hideLoading?: () => void;
}

// Normalize values for comparison
const normalizeValue = (val: number | "" | null | undefined) =>
  val === "" || val === null || val === undefined ? null : Number(val);

const normalizeDate = (date?: string | null) => {
  if (!date) return null;
  try {
    return new Date(date).toISOString();
  } catch {
    return null;
  }
};

const arraysEqual = (a: string[] = [], b: string[] = []) => {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort();
  const sortedB = [...b].sort();
  return sortedA.every((val, idx) => val === sortedB[idx]);
};

// Check if coupon fields changed
const hasChanges = (
  coupon: Coupon | null,
  params: Omit<
    SaveCouponParams,
    "coupon" | "token" | "t" | "onClose" | "onSaveSuccess" | "showToast" | "showLoading" | "hideLoading"
  >
) => {
  if (!coupon) return true;
  return (
    coupon.coupon_title !== params.couponTitle ||
    coupon.coupon_code !== params.couponCode ||
    coupon.max_uses !== normalizeValue(params.maxUses) ||
    coupon.per_user_limit !== normalizeValue(params.perUserLimit) ||
    coupon.discount_type_code !== params.discountTypeCode ||
    coupon.fixed_discount_value !== normalizeValue(params.fixedDiscountValue) ||
    coupon.percentage_discount_value !== normalizeValue(params.percentageDiscountValue) ||
    coupon.is_public !== params.isPublic ||
    coupon.is_visible !== params.isVisible ||
    coupon.is_lifetime !== params.isLifetime ||
    coupon.start_date !== (params.isLifetime ? null : normalizeDate(params.startDate)) ||
    coupon.end_date !== (params.isLifetime ? null : normalizeDate(params.endDate)) ||
    !arraysEqual(coupon.applicable_courses, params.applicableCourses)
  );
};

export async function saveCoupon(params: SaveCouponParams) {
  const {
    coupon,
    token,
    couponTitle,
    couponCode,
    maxUses,
    perUserLimit,
    discountTypeCode,
    fixedDiscountValue,
    percentageDiscountValue,
    isPublic,
    isVisible,
    isLifetime,
    startDate,
    endDate,
    applicableCourses,
    t,
    onClose,
    onSaveSuccess,
    showToast,
    showLoading,
    hideLoading,
  } = params;

  // Skip save if nothing changed
  if (!hasChanges(coupon, params)) {
    onClose();
    return;
  }

  try {
    showLoading?.(coupon ? t("updating_coupon") : t("creating_coupon"));

    const body = {
      coupon_id: coupon?.coupon_id ?? null,
      coupon_title: couponTitle,
      coupon_code: couponCode,
      max_uses: normalizeValue(maxUses),
      per_user_limit: normalizeValue(perUserLimit),
      discount_type_code: discountTypeCode,
      fixed_discount_value: normalizeValue(fixedDiscountValue),
      percentage_discount_value: normalizeValue(percentageDiscountValue),
      is_public: isPublic,
      is_visible: isVisible,
      is_lifetime: isLifetime,
      start_date: !isLifetime ? normalizeDate(startDate) : null,
      end_date: !isLifetime ? normalizeDate(endDate) : null,
      applicable_courses: applicableCourses,
    };

    const method = coupon ? "PUT" : "POST";
    const res = await fetch("/api/coupons", {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error(await res.text());

    showToast(coupon ? t("coupon_updated") : t("coupon_created"), "success");
    onClose();
    onSaveSuccess?.();
  } catch (err: unknown) {
    showToast(err instanceof Error ? err.message : "Failed to save coupon", "error");
  } finally {
    hideLoading?.();
  }
}