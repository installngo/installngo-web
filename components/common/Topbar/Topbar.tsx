"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "@/contexts/TranslationContext";
import Image from "next/image";
import Button from "@/components/common/Button";
import ProfileDropdown from "./ProfileDropdown";
import TopbarMenu from "./TopbarMenu";

interface OrgInfo {
  logoSrc: string;
  name: string;
  code: string;
}

export default function Topbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { setTheme } = useTheme();
  const { isLoggedIn, organizationType, logout } = useAuth();
  const { t } = useTranslation();

  const [orgInfo, setOrgInfo] = useState<OrgInfo>({
    logoSrc: "/logo-default.png",
    name: "My Organization",
    code: "ORG001",
  });

  const [showBorder, setShowBorder] = useState(false);

  // Safely update organization info without cascading renders
  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedName = localStorage.getItem("organizationName") || "My Organization";
    const storedCode = localStorage.getItem("organizationCode") || "ORG001";
    const logoSrc = isLoggedIn && organizationType
      ? `/logo-${organizationType.toLowerCase() || "default"}.png`
      : "/logo-default.png";

    // Defer the state update to avoid synchronous setState warning
    const id = setTimeout(() => {
      setOrgInfo(prev => {
        if (
          prev.logoSrc !== logoSrc ||
          prev.name !== storedName ||
          prev.code !== storedCode
        ) {
          return { logoSrc, name: storedName, code: storedCode };
        }
        return prev;
      });
    }, 0);

    return () => clearTimeout(id);
  }, [isLoggedIn, organizationType]);

  // Logout handler
  const handleLogout = async () => {
    try {
      await logout();
      localStorage.clear();
      sessionStorage.clear();
      setTheme("default");
      setOrgInfo({
        logoSrc: "/logo-default.png",
        name: "My Organization",
        code: "ORG001",
      });
      router.push("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // Border on scroll
  useEffect(() => {
    const handleScroll = () => setShowBorder(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        backgroundColor: "var(--topbar-bg)",
        color: "var(--topbar-text)",
        borderBottom: showBorder ? "1px solid var(--topbar-border)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-2 md:px-8 py-2 flex items-center justify-between">
        {/* LEFT: Logo + Menus */}
        <div className="flex items-center space-x-6">
          <Image
            src={orgInfo.logoSrc}
            alt="Logo"
            width={110}
            height={40}
            className="h-8 w-auto"
            priority
          />
          <TopbarMenu pathname={pathname} t={t} />
        </div>

        {/* RIGHT: Login/Profile */}
        <div className="flex items-center space-x-4">
          {!isLoggedIn ? (
            <Button
              variant="primary"
              onClick={() => router.push("/login")}
              className="h-8 w-25 text-sm"
            >
              {t("login")}
            </Button>
          ) : (
            <ProfileDropdown
              organizationName={orgInfo.name}
              organizationCode={orgInfo.code}
              onLogout={handleLogout}
            />
          )}
        </div>
      </div>
    </header>
  );
}