// Types
export type { Coupon } from "./types/Coupon";
export type { CouponTabType } from "./types/CouponTabs";

// Tabs Config
export {
  COUPON_TABS_CREATE,
  COUPON_TABS_LIST,
  COUPON_TABS_EDIT,
  COUPON_TABS_ANALYTICS,
} from "./types/CouponTabs";

// Tabs
export { default as CouponListTab } from "./tabs/CouponListTab";
export { default as CouponDetailsTab } from "./tabs/CouponDetailsTab";
export { default as ApplicableCoursesTab } from "./tabs/ApplicableCoursesTab";
export { default as CouponAnalyticsTab } from "./tabs/CouponAnalyticsTab";

// Sections
export { default as ManageCouponFooter } from "./sections/ManageCouponFooter";