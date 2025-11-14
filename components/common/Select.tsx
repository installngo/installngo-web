"use client";

import React, { CSSProperties, SelectHTMLAttributes } from "react";
import clsx from "clsx";

type OptionType = {
  label: string;
  value: string | number;
  is_default?: boolean;
};

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  fullWidth?: boolean;
  width?: string;
  uppercase?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  inputSize?: "sm" | "md";
  requiredField?: boolean;
  className?: string;
  value?: string | number;
  options?: OptionType[];
  placeholder?: string;
  includeEmptyOption?: boolean;
  emptyOptionLabel?: string;
};

export default function Select({
  label,
  fullWidth = false,
  width,
  uppercase = false,
  disabled = false,
  error,
  helperText,
  inputSize = "md",
  requiredField = false,
  className,
  value,
  options,
  placeholder,
  includeEmptyOption = false,
  emptyOptionLabel,
  children,
  ...props
}: SelectProps) {
  const isTailwindWidth = width && /^w-/.test(width);
  const widthClasses = fullWidth ? "w-full" : isTailwindWidth ? width : "";
  const widthStyle: CSSProperties | undefined =
    width && !isTailwindWidth ? { width } : undefined;

  const sizeClasses = inputSize === "sm" ? "h-8 px-2 text-sm" : "h-10 px-3 text-base";

  // Determine the selected value: priority = controlled value > is_default > ""
  const  selectedValue =
    value !== undefined
      ? value
      : options?.find((opt) => opt.is_default)?.value ?? "";

  return (
    <div className={clsx("flex flex-col gap-1 font-inter", widthClasses)} style={widthStyle}>
      {label && (
        <label className="text-sm font-medium text-[var(--field-label)] flex items-center gap-1">
          <span>{label}</span>
          {requiredField && <span style={{ color: "var(--field-mandatory)" }}>*</span>}
        </label>
      )}

      <select
        {...props}
        value={selectedValue}
        disabled={disabled}
        className={clsx(
          "rounded-md border w-full transition-colors font-inter",
          sizeClasses,
          uppercase && "uppercase",
          disabled
            ? "bg-[var(--field-disabled-background)] text-[var(--field-disabled-text)] cursor-not-allowed"
            : "bg-[var(--field-background)] focus:border-[var(--field-border-focus)] focus:ring-0 focus:outline-none",
          error && "border-[var(--field-error)] focus:border-[var(--field-error)]",
          "border-2 border-[var(--field-border)] text-[var(--field-input-text)] placeholder-[var(--field-placeholder)] placeholder-opacity-70",
          className
        )}
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        {includeEmptyOption && (
          <option value="">
            {emptyOptionLabel ?? placeholder ?? "Select an option"}
          </option>
        )}

        {options
          ? options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))
          : children}
      </select>

      {error ? (
        <p className="text-xs mt-0.5 text-[var(--field-error)] font-inter">{error}</p>
      ) : helperText ? (
        <p className="text-xs mt-0.5 text-[var(--field-helper)] font-inter">{helperText}</p>
      ) : null}
    </div>
  );
}