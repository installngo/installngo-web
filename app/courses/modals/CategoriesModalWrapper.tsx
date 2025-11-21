"use client";

import ManageCategoriesModal from "@/components/categories/ManageCategoriesModal";
import { Category } from "@/components/common/types/Category";
import { SubCategory } from "@/components/common/types/SubCategory";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  subCategories: SubCategory[];
  onSaveSuccess: () => void;
}

export default function CategoriesModalWrapper(props: Props) {
  return <ManageCategoriesModal {...props} />;
}