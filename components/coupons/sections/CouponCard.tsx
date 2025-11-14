"use client";

import React from "react";
import { Coupon } from "@/components/coupons/types/Coupon";

interface CouponCardProps {
  coupon: Coupon;
  onEdit?: () => void;
  onViewAnalytics?: () => void;
}

export default function CouponCard({
  coupon,
  onEdit,
  //onViewAnalytics,
}: CouponCardProps) {
  // Determine active/expired
  const getStatus = (): "Active" | "Expired" => {
    if (coupon.is_lifetime) return "Active";
    const now = new Date();
    const endDate = coupon.end_date ? new Date(coupon.end_date) : now;
    return endDate >= now ? "Active" : "Expired";
  };

  const status = getStatus();

  // Format discount label
  const getDiscountLabel = () => {
    if (coupon.discount_type_code === "PERCENTAGE") {
      return `${coupon.percentage_discount_value || 0}%`;
    }

    const value = coupon.fixed_discount_value || 0;
    // Format as Indian currency with commas
    return `Up to ₹${value.toLocaleString("en-IN")}`;
  };

  // Format validity period
  const getValidityLabel = () => {
    if (coupon.is_lifetime) return "Unlimited";

    const start = coupon.start_date
      ? new Date(coupon.start_date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "-";

    const end = coupon.end_date
      ? new Date(coupon.end_date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "-";

    return `${start} - ${end}`;
  };

  return (
    <div className="p-3 rounded-lg border text-sm transition-all bg-[var(--card-bg)] border-[var(--card-border)] shadow-[var(--card-shadow)] hover:shadow-[var(--card-shadow-hover)]">
      {/* Coupon Title */}
      <h3 className="font-bold text-center text-xl text-[var(--card-title-text)] mb-2">
        {coupon.coupon_title}
      </h3>

      {/* Coupon Code & Discount Box */}
      <div className="border-2 border-dotted border-[var(--coupon-border)] bg-[var(--coupon-bg)] rounded-md text-center py-3 mb-2">
        <div className="text-base font-semibold text-[var(--card-title-text)] tracking-wider">
          {coupon.coupon_code}
        </div>
        <div className="text-sm font-medium text-[var(--card-value-text)]">
          {getDiscountLabel()}
        </div>
      </div>

      {/* Tags (Public/Private, Status, Validity) */}
      <div className="flex flex-wrap items-center gap-2 text-xs mb-2">
        <span
          className={`px-2 py-0.5 rounded font-medium ${
            coupon.is_public
              ? "bg-[var(--coupon-type-public)]/10 text-[var(--coupon-type-public)]"
              : "bg-[var(--coupon-type-private)]/10 text-[var(--coupon-type-private)]"
          }`}
        >
          {coupon.is_public ? "Public" : "Private"}
        </span>

        <span
          className={`px-2 py-0.5 rounded font-medium ${
            status === "Active"
              ? "bg-[var(--coupon-active)]/10 text-[var(--coupon-active)]"
              : "bg-[var(--coupon-expired)]/10 text-[var(--coupon-expired)]"
          }`}
        >
          {status}
        </span>

        {/* Validity */}
        <span className="text-[var(--color-muted-text)] ml-auto">
          {getValidityLabel()}
        </span>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center mt-1">
        {/* <button
          type="button"
          onClick={onViewAnalytics}
          className="text-xs font-medium text-[var(--link-color)] underline hover:text-[var(--link-hover)] transition-colors cursor-pointer"
        >
          Analytics
        </button> */}
        <button
          type="button"
          onClick={onEdit}
          className="text-xs font-medium text-[var(--link-color)] underline hover:text-[var(--link-hover)] transition-colors cursor-pointer"
        >
          Edit Details
        </button>
      </div>
    </div>
  );
}
