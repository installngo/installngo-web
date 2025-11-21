"use client";

import { useState } from "react";
import { useTranslation } from "@/contexts/TranslationContext";

import { Category } from "@/components/common/types/Category";

interface CategoriesTabProps {
  categories: Category[];
  setCategories?: (categories: Category[]) => void;
}

export default function CategoriesTab({ categories }: CategoriesTabProps) {
  const { t } = useTranslation();

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    categories.length > 0 ? categories[0].category_id : null
  );

  const handleRowClick = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
  };

  // Find selected category details
  const selectedCategory = categories.find(cat => cat.category_id === selectedCategoryId);

  // If no categories, just show message
  if (categories.length === 0) {
    return (
      <div className="flex items-center justify-center">
        <p className="text-gray-500">{t("no_categories")}</p>
      </div>
    );
  }

  // If categories exist, show split view
  return (
    <div className="flex h-[500px] border border-gray-300 overflow-hidden">
      {/* Left side: Categories table */}
      <div className="w-1/2 overflow-auto border-r border-gray-300">
        <table className="w-full table-auto">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr className="text-center">
              <th className="px-4 py-2 border">Code</th>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Order</th>
              <th className="px-4 py-2 border">Active</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat, index) => (
              <tr
                key={cat.category_id || `category-${index}`}
                className={`text-center cursor-pointer ${
                  selectedCategoryId === cat.category_id ? "bg-blue-100" : ""
                }`}
                onClick={() => handleRowClick(cat.category_id)}
              >
                <td className="px-4 py-2 border">{cat.category_code || "-"}</td>
                <td className="px-4 py-2 border">{cat.display_name || "-"}</td>
                <td className="px-4 py-2 border">{cat.display_order ?? "-"}</td>
                <td className="px-4 py-2 border">{cat.is_active ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Right side: Selected category details */}
      <div className="w-1/2 p-4">
        {selectedCategory ? (
          <div>
            <h3 className="font-semibold mb-2">Category Details</h3>
            <p><strong>Code:</strong> {selectedCategory.category_code}</p>
            <p><strong>Name:</strong> {selectedCategory.display_name}</p>
            <p><strong>Order:</strong> {selectedCategory.display_order}</p>
            <p><strong>Active:</strong> {selectedCategory.is_active ? "Yes" : "No"}</p>
          </div>
        ) : (
          <p className="text-gray-500 text-center mt-4">Select a category to see details</p>
        )}
      </div>
    </div>
  );
}
