"use client";

import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
  fullWidth?: boolean;
};

export default function Button({
  variant = "primary",
  fullWidth = false,
  className,
  type = "button",
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses =
    "rounded-lg font-medium transition-colors duration-200 cursor-pointer";

  const variantClasses = {
    primary:
      "bg-[var(--button-primary)] text-[var(--button-text-inverse)] hover:bg-[var(--button-primary-hover)]",
    secondary:
      "bg-[var(--button-secondary)] text-[var(--button-secondary-text)] hover:bg-[var(--button-secondary-hover)]",
    danger:
      "bg-[var(--button-danger)] text-[var(--button-danger-text)] hover:bg-[var(--button-danger-hover)]",
  };

  const disabledClasses = disabled
    ? "opacity-50 cursor-not-allowed pointer-events-none"
    : "";

  return (
    <button
      {...props}
      type={type}
      disabled={disabled}
      className={clsx(
        baseClasses,
        variantClasses[variant],
        fullWidth && "w-full",
        disabledClasses,
        className
      )}
    />
  );
}