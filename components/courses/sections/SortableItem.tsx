"use client";

import React from "react";
import { Folder, File, Edit2, Lock, Trash2 } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Item } from "@/components/courses/types/TableItem";

interface SortableRowProps {
  item: Item;
  onDoubleClick: (item: Item) => void;
  onRename: (item: Item) => void;
  onDelete: (item: Item) => void;
  onLock: (item: Item) => void;
}

export default function SortableRow({
  item,
  onDoubleClick,
  onRename,
  onDelete,
  onLock,
}: SortableRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="grid grid-cols-[1fr_160px_100px] items-center px-4 py-2 border-b border-[var(--field-border)] bg-[var(--card-bg)] hover:bg-[var(--hover-bg)] text-sm text-[var(--field-label)]"
      onDoubleClick={() => onDoubleClick(item)}
    >
      {/* === Name Cell (Drag handle area) === */}
      <div
        className="flex items-center gap-2 font-medium truncate cursor-grab active:cursor-grabbing select-none"
        {...attributes}
        {...listeners}
      >
        {item.type === "folder" ? (
          <Folder className="w-5 h-5 text-[var(--field-icon-folder)]" />
        ) : (
          <File className="w-5 h-5 text-[var(--field-icon-doc)]" />
        )}
        <span className="truncate">{item.name}</span>
      </div>

      {/* === Created Date === */}
      <div className="text-center">
        {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ""}
      </div>

      {/* === Action Icons (clickable area, not draggable) === */}
      <div className="flex justify-end gap-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRename(item);
          }}
          title="Rename"
          className="p-1 rounded hover:bg-[var(--field-icon-square-hover)] cursor-pointer"
        >
          <Edit2 className="w-4 h-4 text-[var(--field-icon)]" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onLock(item);
          }}
          title="Lock"
          className="p-1 rounded hover:bg-[var(--field-icon-square-hover)] cursor-pointer"
        >
          <Lock className="w-4 h-4 text-[var(--field-icon)]" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(item);
          }}
          title="Delete"
          className="p-1 rounded hover:bg-[var(--field-icon-square-hover)] cursor-pointer"
        >
          <Trash2 className="w-4 h-4 text-[var(--field-mandatory)]" />
        </button>
      </div>
    </div>
  );
}
