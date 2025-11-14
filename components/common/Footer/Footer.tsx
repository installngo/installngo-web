"use client";

import { useAuth } from "@/contexts/AuthContext";

export default function Footer() {
  const { isLoggedIn } = useAuth();
  const year = new Date().getFullYear();

  if (isLoggedIn) return null;

  return (
    <footer className="bg-footer p-6">
      <div className="text-center px-4 sm:px-6 lg:px-12">
        <p className="text-footer-secondary font-medium text-xs sm:text-xs md:text-xs">
          © {year} Install &apos;n Go. All rights reserved.
        </p>
      </div>
    </footer>
  );
}