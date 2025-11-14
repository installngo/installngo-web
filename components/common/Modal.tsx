"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";

export interface Tab<T = string> {
  label: string;
  value: T;
}

interface ModalProps<T = string> {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  size?: "sm" | "md" | "lg" | "xl" | "xxl";
  widthClass?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  tabs?: Tab<T>[];
  activeTab?: T;
  onTabChange?: (tab: T) => void;
}

export default function Modal<T = string>({
  isOpen,
  onClose,
  title,
  subtitle,
  size = "md",
  widthClass,
  children,
  footer,
  tabs,
  activeTab,
  onTabChange,
}: ModalProps<T>) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm h-[125px]",
    md: "max-w-md h-[225px]",
    lg: "max-w-lg h-[325px]",
    xl: "max-w-2xl h-[425px]",
    xxl: "max-w-5xl h-[525px]",
  };

  const paddingClasses = {
    sm: "p-3",
    md: "p-4",
    lg: "p-5",
    xl: "p-6",
    xxl: "px-4 py-3",
  };

  const finalWidth = widthClass || sizeClasses[size];
  const padding = paddingClasses[size];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div
        className={`bg-[var(--modal-background)] rounded-lg shadow-lg w-full ${finalWidth} mx-4 flex flex-col`}
      >
        {/* Header */}
        <div
          className={`flex justify-between items-start ${padding} pb-2 border-b border-[var(--modal-border)] flex-none`}
        >
          <div>
            {title && (
              <h2 className="text-xl font-semibold text-[var(--modal-title-text)] leading-tight">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-xs text-[var(--modal-subtitle-text)] mt-0.5 leading-snug">
                {subtitle}
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            className="text-[var(--modal-subtitle-text)] hover:text-[var(--modal-title-text)] cursor-pointer mt-0.5"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        {tabs && tabs.length > 0 && (
          <div className="sticky top-0 z-20 bg-[var(--modal-background)] border-b-2 border-[var(--modal-tab-border)] flex-none">
            <div className="flex gap-1">
              {tabs.map((tab) => (
                <button
                  key={String(tab.value)}
                  className={`cursor-pointer text-base text-[var(--modal-tab-label)] px-4 py-2 rounded ${
                    activeTab === tab.value
                      ? "font-semibold border-b-3 border-[var(--modal-tab-focus)]"
                      : "font-normal"
                  }`}
                  onClick={() => onTabChange?.(tab.value)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Scrollable content */}
        <div
          className={`flex-1 overflow-y-auto ${padding} space-y-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent`}
        >
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div
            className={`flex justify-end items-center gap-3 ${padding} border-t border-[var(--modal-border)] bg-[var(--modal-background)] flex-none rounded-b-lg`}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}