"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/common/Modal";
import { useTranslation } from "@/contexts/TranslationContext";

import {
  Category,
  SubCategory,
  CATEGORY_TABS,
  CategoriesTab,
  SubCategoriesTab,
  ManageCategoriesFooter
} from "@/components/categories/imports";

interface ManageCategoriesModalProps {
  isOpen: boolean;
  categories: Category[];
  subCategories: SubCategory[];
  onClose: () => void;
  onSaveSuccess: () => void;
}

export default function ManageCategoriesModal({
  isOpen,
  categories,
  subCategories,
  onClose,
  onSaveSuccess,
}: ManageCategoriesModalProps) {
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState<"Categories" | "SubCategories">(
    "Categories"
  );

  // Local state for categories/subCategories
  const [localCategories, setLocalCategories] = useState<Category[]>([]);
  const [localsubCategories, setLocalsubCategories] = useState<SubCategory[]>([]);

  // Sync prop values to local state whenever they change
  useEffect(() => {
    setLocalCategories(categories);
  }, [categories]);

  useEffect(() => {
    setLocalsubCategories(subCategories);
  }, [subCategories]);

  const handleSetActiveTab = (tab: "Categories" | "SubCategories") => {
    if (tab === "SubCategories" && localCategories.length === 0) return;
    setActiveTab(tab);
  };

  const TABS = CATEGORY_TABS.map((tab) => ({
    label: t(tab.label),
    value: tab.value,
  }));

  return (
    <Modal
      title={t("manage_categories")}
      subtitle={t("manage_categories_subtitle")}
      isOpen={isOpen}
      onClose={onClose}
      size="xxl"
      tabs={TABS}
      activeTab={activeTab}
      onTabChange={handleSetActiveTab}
      footer={
        <ManageCategoriesFooter
          activeTab={activeTab}
          TABS={TABS as { label: string; value: "Categories" | "SubCategories" }[]}
          setActiveTab={handleSetActiveTab}
          onSave={onSaveSuccess}
          disableSubCategories={localCategories.length === 0}
        />
      }
    >
      {activeTab === "Categories" ? (
        <CategoriesTab
          categories={localCategories}
          setCategories={setLocalCategories}
        />
      ) : (
        <SubCategoriesTab />
      )}
    </Modal>
  );
}