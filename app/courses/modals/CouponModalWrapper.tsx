"use client";

import { useState, useEffect, useCallback } from "react";
import ManageCouponModal from "@/components/coupons/ManageCouponModal";
import { useAuth } from "@/contexts/AuthContext";
import { Course } from "@/components/courses/types/Course";
import { Coupon } from "@/components/coupons/types/Coupon";
import { MasterRecord } from "@/components/courses/types/MasterRecord";
import { useLoading } from "@/contexts/LoadingContext";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  courses: Course[];
}

export default function CouponModalWrapper({
  isOpen,
  onClose,
  courses,
}: Props) {
  const { token } = useAuth();
  const { start, stop } = useLoading();

  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [discountTypes, setDiscountTypes] = useState<MasterRecord[]>([]);

  // Memoized wrappers for safe usage
  const safeStart = useCallback((msg?: string) => start(msg), [start]);
  const safeStop = useCallback((id: string) => stop(id), [stop]);

  const fetchCoupons = useCallback(async () => {
    const loaderId = safeStart("Loading Coupons...");
    try {
      const res = await fetch("/api/coupons", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data?.success) setCoupons(data.data ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      safeStop(loaderId);
    }
  }, [token, safeStart, safeStop]);

  const fetchDiscountTypes = useCallback(async () => {
    const loaderId = safeStart("Loading Discount Types...");
    try {
      const res = await fetch("/api/code-subcode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ code_type: "DISCOUNTTYPE" }),
      });
      const data = await res.json();
      if (data?.success && Array.isArray(data.data)) {
        setDiscountTypes(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      safeStop(loaderId);
    }
  }, [token, safeStart, safeStop]);

  useEffect(() => {
    if (!isOpen) return;

    fetchCoupons();
    fetchDiscountTypes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <ManageCouponModal
      isOpen={isOpen}
      onClose={onClose}
      coupons={coupons}
      onRefresh={fetchCoupons}
      courses={courses}
      discountTypes={discountTypes}
    />
  );
}