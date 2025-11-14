export type CouponTabType =
  | "Coupons List"
  | "Coupon Details"
  | "Applicable Courses"
  | "Analytics";

export const COUPON_TABS_CREATE = [
  { label: "coupon_details", value: "Coupon Details" as CouponTabType },
  { label: "applicable_courses", value: "Applicable Courses" as CouponTabType },
];

export const COUPON_TABS_LIST = [
  { label: "coupons_list", value: "Coupons List" as CouponTabType },
];

export const COUPON_TABS_EDIT = [
  { label: "coupon_details", value: "Coupon Details" as CouponTabType },
  { label: "applicable_courses", value: "Applicable Courses" as CouponTabType },
];

export const COUPON_TABS_ANALYTICS = [
  { label: "coupon_analytics", value: "Analytics" as CouponTabType },
];