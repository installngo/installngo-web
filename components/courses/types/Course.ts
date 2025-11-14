export interface Course {
  course_id: string;
  course_code: string;

  is_paid?: boolean;

  course_title: string;
  course_description: string; 

  thumbnail_url?: string;

  category_code?: string;
  subcategory_code?: string;

  original_price?: number;
  discount_price?: number;
  effective_price?: number;

  validity_code?: string;
  single_validity_code?: string;

  expiry_date?: string;

  mark_new?: boolean;
  mark_featured?: boolean;
  has_offline_material?: boolean;
}