"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useLoading } from "@/contexts/LoadingContext";
import { useToast } from "@/contexts/ToastContext";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";

interface Props {
  onBack: () => void;
}

interface LoginResponse {
  token: string;
  organization: {
    organization_id: string;
    code: string;
    full_name: string;
    type_code?: string;
    category_code?: string;
    country_code?: string;
    status_code?: string;
  };
  error?: string;
}

export default function EmailAuthForm({ onBack }: Props) {
  const { login } = useAuth();
  const { start, stop } = useLoading();
  const { showToast } = useToast();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const newErrors: typeof errors = {};
    if (!email) newErrors.email = "Enter your email";
    if (!password) newErrors.password = "Enter your password";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const loaderId = start("Signing you in..."); // <-- start loader
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email_id: email, password }),
      });

      const data = (await res.json()) as LoginResponse;

      if (!res.ok) {
        showToast(data?.error || "Invalid login credentials. Please try again.", "error");
        return;
      }

      const { token, organization: org } = data;

      // Store all org info using AuthContext
      login(
        token,
        org.organization_id,
        org.code,
        org.full_name,
        org.type_code,
        org.category_code,
        org.country_code
      );

      showToast("Logged in successfully!", "success");

      router.push("/dashboard");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";
      showToast(message, "error");
      console.error("Login failed:", err);
    } finally {
      stop(loaderId); // <-- stop loader
    }
  };

  return (
    <div className="hidden lg:flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold mb-6 text-center text-[var(--color-primary-text)]">
        Organization Login
      </h2>

      <form
        onSubmit={handleLogin}
        className="flex flex-col items-center space-y-3"
        style={{ width: "350px" }}
      >
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          inputSize="sm"
          error={errors.email}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          inputSize="sm"
          error={errors.password}
        />

        <div className="flex justify-center gap-3 w-full mt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onBack}
            className="h-8 w-24 text-sm"
          >
            Back
          </Button>

          <Button type="submit" variant="primary" className="h-8 w-24 text-sm">
            Sign In
          </Button>
        </div>
      </form>
    </div>
  );
}