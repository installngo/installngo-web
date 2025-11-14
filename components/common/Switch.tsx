"use client";

import React from "react";
import clsx from "clsx";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: "sm" | "md";
  label?: string;
  requiredField?: boolean;
  helperText?: string;
  error?: string;
}

export default function Switch({
  checked,
  onChange,
  disabled = false,
  size = "md",
  label,
  requiredField = false,
  helperText,
  error,
}: SwitchProps) {
  const handleToggle = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  const sizes = {
    sm: { width: "w-8", height: "h-4", circle: "w-3 h-3" },
    md: { width: "w-10", height: "h-5", circle: "w-4 h-4" },
  };

  const { width, height, circle } = sizes[size];

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        {label && (
          <label
            className={clsx(
              "text-sm font-medium text-[var(--field-label)] flex items-center gap-1 select-none",
              disabled && "opacity-50"
            )}
          >
            <span>{label}</span>
            {requiredField && <span style={{ color: "var(--field-mandatory)" }}>*</span>}
          </label>
        )}
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          onClick={handleToggle}
          disabled={disabled}
          className={clsx(
            "relative inline-flex items-center rounded-full transition-colors duration-200 ease-in-out",
            width,
            height,
            checked
              ? "bg-[var(--button-primary)]"
              : "bg-[var(--button-secondary)]",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <span
            className={clsx(
              "absolute bg-white rounded-full shadow-sm transform transition-transform duration-200 ease-in-out",
              circle,
              checked
                ? size === "sm"
                  ? "translate-x-4"
                  : "translate-x-5"
                : "translate-x-1"
            )}
          />
        </button>
      </div>

      {error ? (
        <p className="text-xs mt-0.5 text-[var(--field-error)] font-inter">{error}</p>
      ) : helperText ? (
        <p className="text-xs mt-0.5 text-[var(--field-helper)] font-inter italic">{helperText}</p>
      ) : null}
    </div>
  );
}