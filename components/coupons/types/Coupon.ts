export interface Coupon {
  coupon_id: string;
  organization_id: string;

  coupon_title: string;
  coupon_code: string;

  discount_type_code: string;
  fixed_discount_value?: number | null;
  percentage_discount_value?: number | null;

  is_lifetime: boolean;
  start_date?: string | null;
  end_date?: string | null;

  max_uses?: number | null;
  per_user_limit?: number | null;

  is_public: boolean;
  is_visible: boolean;
  is_active: boolean;

  applicable_courses: string[];

  created_at?: string;
  updated_at?: string;
}