"use client";

import React, { useState, useMemo } from "react";
import Input from "@/components/common/Input";
import CouponCard from "@/components/coupons/sections/CouponCard";
import { Coupon } from "@/components/coupons/types/Coupon";
import { useTranslation } from "@/contexts/TranslationContext";

interface CouponListTabProps {
  coupons: Coupon[];
  onEdit?: (coupon: Coupon) => void;
  onViewAnalytics?: (coupon: Coupon) => void;
}

export default function CouponListTab({
  coupons,
  onEdit,
  onViewAnalytics,
}: CouponListTabProps) {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");

  // Filter coupons by title or code
  const filteredCoupons = useMemo(() => {
    const term = search.toLowerCase();
    return coupons.filter(
      (c) =>
        c.coupon_title.toLowerCase().includes(term) ||
        c.coupon_code.toLowerCase().includes(term)
    );
  }, [search, coupons]);

  return (
    <div className="flex flex-col h-full">
      {/* Search bar */}
      <div className="sticky top-0 z-10 bg-[var(--card-bg)] p-2 border-b border-[var(--card-border)] flex justify-end">
        <Input
          placeholder={t("search_coupon")}
          inputSize="sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          width="200px"
        />
      </div>

      {/* Scrollable coupon list */}
      <div className="flex-1 overflow-y-auto hide-scrollbar p-2">
        {filteredCoupons.length === 0 ? (
          <div className="text-center text-sm text-[var(--color-secondary-text)] py-6">
            {t("no_coupons_found")}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCoupons.map((coupon) => (
              <CouponCard
                key={coupon.coupon_id}
                coupon={coupon}
                onEdit={() => onEdit?.(coupon)}
                onViewAnalytics={() => onViewAnalytics?.(coupon)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}