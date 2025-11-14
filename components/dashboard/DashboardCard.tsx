"use client";

import React from "react";

interface DashboardCardProps {
  title: string;
  value: string | number;
}

export default function DashboardCard({ title, value }: DashboardCardProps) {
  return (
    <div
      className="flex flex-col justify-between rounded p-3 min-w-[200px] max-w-[200px] transition-all duration-300 hover:-translate-y-1"
      style={{
        backgroundColor: "var(--card-bg)",
        border: "1.5px solid var(--card-border)",
        boxShadow: "var(--card-shadow)",
      }}
      onMouseEnter={(e) =>
        ((e.currentTarget.style.boxShadow = "var(--card-shadow-hover)"))
      }
      onMouseLeave={(e) =>
        ((e.currentTarget.style.boxShadow = "var(--card-shadow)"))
      }
    >
      <h3
        className="text-sm font-semibold"
        style={{ color: "var(--card-title-text)" }}
      >
        {title}
      </h3>
      <p
        className="text-lg font-bold mt-3"
        style={{ color: "var(--card-value-text)" }}
      >
        {value}
      </p>
    </div>
  );
}
