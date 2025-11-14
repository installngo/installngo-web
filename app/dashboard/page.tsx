"use client";

import { useAuth } from "@/contexts/AuthContext";
import DashboardCard from "@/components/dashboard/DashboardCard";
import { useState } from "react";

export default function DashboardPage() {
  const { organizationName } = useAuth();

  // Safe state initialization from localStorage
  const [organizationCode] = useState(
    () => localStorage.getItem("organizationCode") || ""
  );

  return (
    <div className="pt-[10px] px-8">
      <h1 className="text-2xl font-bold text-[var(--color-primary-text)]">
        Welcome, {organizationName}
      </h1>
      <p className="text-[var(--color-secondary-text)] mb-8">
        Organization Code: <b>{organizationCode}</b>
      </p>

      {/* Dashboard Summary Cards */}
      <div className="flex gap-3">
        <DashboardCard title="No. of Courses" value={12} />
        <DashboardCard title="No. of Users" value={85} />
        <DashboardCard title="Payments" value="RM 3,240" />
      </div>
    </div>
  );
}