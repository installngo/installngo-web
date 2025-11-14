"use client";

import { useState } from "react";
import { useTranslation } from "@/contexts/TranslationContext";
import EmailAuthForm from "./EmailAuthForm";
import SignUpForm from "./SignUpForm";
import Button from "@/components/common/Button";

export default function AuthSelector() {
  const [mode, setMode] = useState<"select" | "signin" | "signup">("select");
  const { t } = useTranslation();

  // Render the appropriate form based on mode
  if (mode === "signin") return <EmailAuthForm onBack={() => setMode("select")} />;
  if (mode === "signup") return <SignUpForm onBack={() => setMode("select")} />;

  // Default selection screen
  return (
    <div className="text-center space-y-5">
      <div className="flex flex-row gap-3 justify-center flex-wrap">
        <Button
          onClick={() => setMode("signup")}
          variant="primary"
          className="h-10 w-100 text-sm"
        >
          {t("signUpAsOrganization", "Sign up as Organization")}
        </Button>
        
        <Button
          onClick={() => setMode("signin")}
          variant="primary"
          className="h-10 w-100 text-sm"
        >
          {t("signInAsOrganization", "Sign in as Organization")}
        </Button>
      </div>
    </div>
  );
}