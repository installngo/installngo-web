"use client";

import React, {
  useState,
  CSSProperties,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  ChangeEvent,
  useEffect,
  forwardRef,
  useRef,
  FocusEvent,
} from "react";
import clsx from "clsx";
import { Eye, EyeOff, Calendar } from "lucide-react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DateInput = forwardRef<
  HTMLInputElement,
  {
    value?: string;
    onClick?: () => void;
    disabled?: boolean;
    sizeClasses?: string;
    placeholderSize?: string;
    uppercase?: boolean;
    className?: string;
    error?: string;
  }
>(({ value, onClick, disabled, sizeClasses, placeholderSize, uppercase, className, error }, ref) => (
  <div className="relative w-full">
    <input
      ref={ref}
      type="text"
      value={value}
      onClick={onClick}
      readOnly
      className={clsx(
        "rounded-md w-full border transition-colors font-inter",
        "border-2 border-[var(--field-border)]",
        "placeholder-[var(--field-placeholder)] placeholder-opacity-70",
        "text-[var(--field-input-text)]",
        sizeClasses,
        placeholderSize,
        uppercase && "uppercase",
        disabled
          ? "bg-[var(--field-disabled-background)] text-[var(--field-disabled-text)] cursor-not-allowed"
          : "bg-[var(--field-background)] focus:border-[var(--field-border-focus)] focus:ring-0 focus:outline-none",
        error && "border-[var(--field-error)] focus:border-[var(--field-error)]",
        className
      )}
      placeholder="DD/MM/YYYY"
    />
    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--field-icon)]" />
  </div>
));
DateInput.displayName = "DateInput";

interface CommonProps {
  label?: string;
  fullWidth?: boolean;
  width?: string;
  uppercase?: boolean;
  error?: string;
  helperText?: string;
  inputSize?: "sm" | "md";
  requiredField?: boolean;
  className?: string;
  currencySymbol?: string;
  calculated?: boolean;
  maxValue?: number;
  formatted?: boolean;
  minDate?: Date;
  maxDate?: Date;
}

type InputFieldProps = CommonProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "type"> & {
    type?:
      | "text"
      | "email"
      | "password"
      | "number"
      | "price"
      | "date"
      | "codetype";
    dateValue?: Date | null;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  };

type TextareaFieldProps = CommonProps &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange"> & {
    type: "textarea";
    onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  };

type FieldProps = InputFieldProps | TextareaFieldProps;

export default function Input(props: FieldProps) {
  const {
    label,
    fullWidth = false,
    width,
    uppercase = false,
    error,
    helperText,
    inputSize = "md",
    className,
    requiredField = false,
    disabled,
    currencySymbol,
    calculated = false,
    maxValue,
    formatted = true,
    minDate,
    maxDate,
    ...rest
  } = props;

  const [showPassword, setShowPassword] = useState(false);
  const [internalValue, setInternalValue] = useState<string>("");
  const [dateValue, setDateValue] = useState<Date | null>(null);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const prevParentValueRef = useRef<string | number | undefined>(undefined);

  const isTextarea = props.type === "textarea";
  const isPassword = props.type === "password";
  const isPrice = props.type === "price";
  const isNumber = props.type === "number";
  const isDate = props.type === "date";
  const isCodeType = props.type === "codetype";

  const inputId = (props as { id?: string; name?: string }).id || props.name;
  const dynamicSymbol = currencySymbol || "₹";

  const isTailwindWidth = width && /^w-/.test(width);
  const widthClasses = fullWidth ? "w-full" : isTailwindWidth ? width : "";
  const widthStyle: CSSProperties | undefined =
    width && !isTailwindWidth ? { width } : undefined;

  const sizeClasses =
    inputSize === "sm" ? "h-8 px-2 text-sm" : "h-10 px-3 text-base";
  const textareaSize = inputSize === "sm" ? "p-2 text-sm" : "p-3 text-base";
  const placeholderSize =
    inputSize === "sm" ? "placeholder:text-xs" : "placeholder:text-sm";
  const passwordPadding =
    isPassword && !isTextarea ? (inputSize === "sm" ? "pr-8" : "pr-10") : "";

  const formatNumber = (val: string | number | undefined, fmt: boolean) => {
    if (!fmt) return String(val ?? "");
    if (val === "" || val === undefined || val === null) return "";
    const num = Number(String(val).replace(/,/g, ""));
    if (isNaN(num)) return "";
    return num.toLocaleString("en-IN");
  };

  // Extract parent value
  const parentValueRaw = (rest as InputFieldProps).value;
  const parentValue: string | number | undefined = Array.isArray(parentValueRaw)
    ? parentValueRaw[0]
    : parentValueRaw;

  useEffect(() => {
    if (prevParentValueRef.current === parentValue) return;
    prevParentValueRef.current = parentValue;

    let newInternalValue = "";
    let newDateValue: Date | null = null;

    if (isPrice || isNumber) {
      newInternalValue = formatNumber(parentValue, formatted);
    } else if (isDate && parentValue) {
      const parts = String(parentValue).split("/");
      if (parts.length === 3) {
        newDateValue = new Date(+parts[2], +parts[1] - 1, +parts[0]);
        newInternalValue = String(parentValue);
      }
    } else {
      newInternalValue = String(parentValue ?? "");
    }

    // ✅ Defer state updates to avoid cascading renders
    setTimeout(() => {
      setInternalValue(newInternalValue);
      setDateValue(newDateValue);
    }, 0);
  }, [parentValue, isPrice, isNumber, formatted, isDate]);

  const inputType =
    isPassword && !showPassword ? "password" : isPassword ? "text" : "text";

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (isPrice || isNumber) {
      const raw = e.target.value.replace(/\D/g, "");
      if (raw === "") {
        setInternalValue("");
        (props as InputFieldProps).onChange?.({
          ...e,
          target: { ...e.target, value: "" },
        });
        return;
      }

      let num = Number(raw);
      if (maxValue !== undefined && num > maxValue) num = maxValue;

      const formattedValue = formatNumber(num, formatted);

      const prevCursor = e.target.selectionStart ?? raw.length;

      const prevCommas = (internalValue.match(/,/g) || []).length;
      const newCommas = (formattedValue.match(/,/g) || []).length;

      let newCursor = prevCursor + (newCommas - prevCommas);
      if (newCursor < 0) newCursor = 0;
      if (newCursor > formattedValue.length) newCursor = formattedValue.length;

      setInternalValue(formattedValue);

      setTimeout(() => {
        inputRef.current?.setSelectionRange(newCursor, newCursor);
      }, 0);

      (props as InputFieldProps).onChange?.({
        ...e,
        target: { ...e.target, value: String(num) },
      });
    } else if (isCodeType) {
      const inputEl = e.target as HTMLInputElement;
      const cursor = inputEl.selectionStart || 0;

      const transformed = inputEl.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
      const diff = transformed.length - inputEl.value.length;

      setInternalValue(transformed);
      (props as InputFieldProps).onChange?.({
        ...e,
        target: { ...e.target, value: transformed },
      });

      requestAnimationFrame(() => {
        try {
          inputEl.setSelectionRange(cursor + diff, cursor + diff);
        } catch (_) {}
      });
    } else {
      setInternalValue(e.target.value);
      (props as InputFieldProps).onChange?.(e);
    }
  };

  const handleTextareaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInternalValue(e.target.value);
    (props as TextareaFieldProps).onChange?.(e);
  };

  const handleDateChangeCustom = (date: Date | null) => {
    setDateValue(date);
    if (date) {
      const formatted = `${date.getDate().toString().padStart(2, "0")}/${(
        date.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}/${date.getFullYear()}`;
      setInternalValue(formatted);

      (props as InputFieldProps).onChange?.({
        target: {
          value: `${date.getFullYear()}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`,
        },
      } as ChangeEvent<HTMLInputElement>);
    } else {
      setInternalValue("");
      (props as InputFieldProps).onChange?.({
        target: { value: "" },
      } as ChangeEvent<HTMLInputElement>);
    }
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    if (isCodeType) {
      const trimmed = internalValue.trim();
      if (trimmed !== internalValue) {
        setInternalValue(trimmed);
        (props as InputFieldProps).onChange?.({
          ...e,
          target: { ...e.target, value: trimmed },
        } as unknown as ChangeEvent<HTMLInputElement>);
      }
    }
    (props as InputFieldProps).onBlur?.(e);
  };

  return (
    <div
      className={clsx("flex flex-col gap-1 font-inter", widthClasses)}
      style={widthStyle}
    >
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-[var(--field-label)] flex items-center gap-1"
        >
          <span>{label}</span>
          {requiredField && (
            <span style={{ color: "var(--field-mandatory)" }}>*</span>
          )}
        </label>
      )}

      <div className="relative overflow-visible">
        {isTextarea ? (
          <textarea
            {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            id={inputId}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={
              error
                ? `${inputId}-error`
                : helperText
                ? `${inputId}-helper`
                : undefined
            }
            className={clsx(
              "rounded-md border w-full transition-colors font-inter resize-none",
              textareaSize,
              "text-[var(--field-input-text)] placeholder-[var(--field-placeholder)] placeholder-opacity-70",
              "border-2 border-[var(--field-border)]",
              uppercase && "uppercase",
              disabled
                ? "bg-[var(--field-disabled-background)] text-[var(--field-disabled-text)] cursor-not-allowed"
                : "bg-[var(--field-background)] focus:border-[var(--field-border-focus)] focus:ring-0 focus:outline-none",
              error &&
                "border-[var(--field-error)] focus:border-[var(--field-error)]",
              className
            )}
            value={internalValue}
            onChange={handleTextareaChange}
          />
        ) : isDate ? (
          <ReactDatePicker
            selected={props.dateValue || dateValue}
            onChange={handleDateChangeCustom}
            dateFormat="dd/MM/yyyy"
            customInput={
              <DateInput
                disabled={disabled}
                sizeClasses={sizeClasses}
                placeholderSize={placeholderSize}
                uppercase={uppercase}
                className={className}
                error={error}
              />
            }
            minDate={minDate}
            maxDate={maxDate}
            popperPlacement="bottom-start"
            portalId="datepicker-portal"
          />
        ) : (
          <>
            {isPrice && (
              <span
                className={clsx(
                  "absolute left-2 top-1/2 -translate-y-1/2 text-[var(--field-placeholder)] select-none",
                  inputSize === "sm" ? "text-xs" : "text-sm"
                )}
              >
                {dynamicSymbol}
              </span>
            )}

            <input
              {...(rest as InputHTMLAttributes<HTMLInputElement>)}
              ref={inputRef as React.RefObject<HTMLInputElement>}
              id={inputId}
              type={inputType}
              disabled={disabled || calculated}
              inputMode={isPrice || isNumber ? "numeric" : undefined}
              aria-invalid={!!error}
              aria-describedby={
                error
                  ? `${inputId}-error`
                  : helperText
                  ? `${inputId}-helper`
                  : undefined
              }
              value={internalValue}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={clsx(
                "rounded-md w-full border transition-colors font-inter",
                "border-2 border-[var(--field-border)]",
                "placeholder-[var(--field-placeholder)] placeholder-opacity-70",
                "text-[var(--field-input-text)]",
                isPrice && "text-left pl-7",
                disabled
                  ? "bg-[var(--field-disabled-background)] text-[var(--field-disabled-text)] cursor-not-allowed"
                  : "bg-[var(--field-background)] focus:border-[var(--field-border-focus)] focus:ring-0 focus:outline-none",
                sizeClasses,
                placeholderSize,
                passwordPadding,
                (uppercase || isCodeType) && "uppercase",
                isCodeType && "[&::placeholder]:normal-case",
                error &&
                  "border-[var(--field-error)] focus:border-[var(--field-error)]",
                className
              )}
            />
          </>
        )}

        {isPassword && !disabled && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className={clsx(
              "absolute top-1/2 -translate-y-1/2 text-[var(--field-icon)] hover:text-[var(--field-icon-hover)]",
              inputSize === "sm" ? "right-2" : "right-3"
            )}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {error ? (
        <p
          id={`${inputId}-error`}
          className="text-xs mt-0.5 text-[var(--field-error)] font-inter"
        >
          {error}
        </p>
      ) : helperText ? (
        <p
          id={`${inputId}-helper`}
          className="text-xs mt-0.5 text-[var(--field-helper)] font-inter italic"
        >
          {helperText}
        </p>
      ) : null}

      <style jsx>{`
        input[type="number"].no-spinner::-webkit-inner-spin-button,
        input[type="number"].no-spinner::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"].no-spinner {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
}