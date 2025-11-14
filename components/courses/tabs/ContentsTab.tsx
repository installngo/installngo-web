"use client";

import React, { useState, useRef } from "react";
import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import Input from "@/components/common/Input";
import { ChevronRight } from "lucide-react";
import { useTranslation } from "@/contexts/TranslationContext";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { v4 as uuidv4 } from "uuid";
import SortableRow from "@/components/courses/sections/SortableItem";
import { Item } from "@/components/courses/types/TableItem";

export default function ContentsTab() {
  const { t } = useTranslation();

  const [items, setItems] = useState<Item[]>([]);
  const [folderPath, setFolderPath] = useState<{ id: string; name: string }[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<"new" | "rename" | "delete" | null>(null);
  const [currentItem, setCurrentItem] = useState<Item | null>(null);
  const [inputValue, setInputValue] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const currentFolderId = folderPath[folderPath.length - 1]?.id ?? null;
  const filteredItems = items.filter((i) => i.parentId === currentFolderId);
  const isEmpty = filteredItems.length === 0;

  // --- Modal handlers ---
  const handleAddFolder = () => {
    setModalAction("new");
    setInputValue("");
    setModalOpen(true);
  };

  const handleRename = (item: Item) => {
    setModalAction("rename");
    setCurrentItem(item);
    setInputValue(item.name);
    setModalOpen(true);
  };

  const handleDelete = (item: Item) => {
    setModalAction("delete");
    setCurrentItem(item);
    setModalOpen(true);
  };

  const handleLock = (item: Item) => {
    console.log("Lock item:", item.name);
  };

  const handleSubmitModal = () => {
    if (modalAction === "new") {
      const newFolder: Item = {
        id: uuidv4(),
        name: inputValue.trim() || t("new_folder_default_name") || "New Folder",
        type: "folder",
        createdAt: new Date().toISOString(),
        parentId: currentFolderId,
      };
      setItems((prev): Item[] => [...prev, newFolder]);
    } else if (modalAction === "rename" && currentItem) {
      setItems((prev) =>
        prev.map((i) => (i.id === currentItem.id ? { ...i, name: inputValue } : i))
      );
    } else if (modalAction === "delete" && currentItem) {
      setItems((prev) => prev.filter((i) => i.id !== currentItem.id));
    }
    setModalOpen(false);
  };

  // --- Folder navigation ---
  const handleOpenFolder = (folder: Item) => {
    if (folder.type === "folder") {
      setFolderPath((prev) => [...prev, { id: folder.id, name: folder.name }]);
    }
  };

  const handleBreadcrumbClick = (index: number) => {
    setFolderPath((prev) => prev.slice(0, index + 1));
  };

  // --- File upload ---
  const handleUploadClick = () => fileInputRef.current?.click();
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    const uploaded: Item[] = Array.from(files).map((f) => ({
      id: uuidv4(),
      name: f.name,
      type: "file",
      createdAt: new Date().toISOString(),
      parentId: currentFolderId,
    }));

    setItems((prev): Item[] => [...prev, ...uploaded]);
    e.target.value = "";
  };

  // --- Drag & drop ---
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setItems((prev) => {
      const oldIndex = prev.findIndex((i) => i.id === active.id);
      const newIndex = prev.findIndex((i) => i.id === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  return (
    <div className="flex flex-col h-full bg-[var(--field-background)] rounded-lg border border-[var(--field-border)] overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-[var(--field-border)] bg-[var(--field-background)] sticky top-0 z-20">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1 text-sm text-[var(--field-label)]">
          <span className="cursor-pointer hover:underline" onClick={() => setFolderPath([])}>
            {t("my_drive")}
          </span>
          {folderPath.map((folder, idx) => (
            <React.Fragment key={folder.id}>
              <ChevronRight className="w-4 h-4 text-[var(--field-label)]" />
              <span
                className="cursor-pointer hover:underline font-medium"
                onClick={() => handleBreadcrumbClick(idx)}
              >
                {folder.name}
              </span>
            </React.Fragment>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          <input
            type="file"
            multiple
            ref={fileInputRef}
            onChange={handleFileSelect}
            hidden
          />
          <Button variant="secondary" className="h-8 w-32 text-sm" onClick={handleUploadClick}>
            {t("upload_button")}
          </Button>
          <Button variant="primary" className="h-8 w-32 text-sm" onClick={handleAddFolder}>
            + {t("new_folder_button")}
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto relative">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full text-[var(--field-label)]">
            <p className="text-base font-medium">{t("empty_message")}</p>
          </div>
        ) : (
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={filteredItems} strategy={verticalListSortingStrategy}>
              <div className="grid grid-cols-[1fr_200px_80px] text-xs font-medium text-[var(--field-label)] border-b border-[var(--field-border)] bg-[var(--card-bg)] px-4 py-2">
                <div>{t("name_column")}</div>
                <div className="text-center">{t("created_date_column")}</div>
                <div className="text-right">{t("actions_column")}</div>
              </div>

              {filteredItems.map((item) => (
                <SortableRow
                  key={item.id}
                  item={item}
                  onDoubleClick={handleOpenFolder}
                  onRename={handleRename}
                  onDelete={handleDelete}
                  onLock={handleLock}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={
          modalAction === "new"
            ? t("new_folder_modal_title")
            : modalAction === "rename"
            ? t("rename_modal_title")
            : modalAction === "delete"
            ? t("delete_modal_title")
            : ""
        }
        size="md"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" className="h-8 w-24 text-sm" onClick={() => setModalOpen(false)}>
              {t("cancel_button")}
            </Button>
            {modalAction === "delete" ? (
              <Button variant="danger" className="h-8 w-24 text-sm" onClick={handleSubmitModal}>
                {t("delete_button")}
              </Button>
            ) : (
              <Button
                variant="primary"
                className="h-8 w-24 text-sm"
                onClick={handleSubmitModal}
                disabled={!inputValue.trim()}
              >
                {t("submit_button")}
              </Button>
            )}
          </div>
        }
      >
        {modalAction === "delete" ? (
          <p className="text-[var(--field-label)]">
            {t("delete_confirm_text")?.replace("{name}", currentItem?.name || "")}
          </p>
        ) : (
          <Input
            label={t("folder_name")}
            helperText={t("hp_folder_name")}
            placeholder={t("folder_name_placeholder")}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            fullWidth
            inputSize="sm"
            requiredField
          />
        )}
      </Modal>
    </div>
  );
}