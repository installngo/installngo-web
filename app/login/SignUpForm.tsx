"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import Select from "@/components/common/Select";
import { useTranslation } from "@/contexts/TranslationContext";
import { useToast } from "@/contexts/ToastContext";
import { useLoading } from "@/contexts/LoadingContext";
import { usePrelogin, OrganizationType } from "@/contexts/PreloginContext";
import { useAuth } from "@/contexts/AuthContext";

interface SignUpFormProps {
  onBack: () => void;
}

export default function SignUpForm({ onBack }: SignUpFormProps) {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const { start, stop } = useLoading();
  const { flat } = usePrelogin();
  const { login } = useAuth();
  const router = useRouter();

  const countries = flat?.countries ?? [];
  const organizationTypes = useMemo(
    () => flat?.organization_types ?? [],
    [flat?.organization_types]
  );

  const [form, setForm] = useState({
    orgName: "",
    orgType: "",
    country: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const filteredOrganizationTypes = useMemo<OrganizationType[]>(() => {
    if (!form.country) return [];
    return organizationTypes.filter((t) => t.country_code === form.country);
  }, [organizationTypes, form.country]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    if (name === "country") setForm((prev) => ({ ...prev, orgType: "" }));
  };

  const validateStep = (): boolean => {
    const newErrors: Partial<typeof form> = {};

    if (!form.orgName) newErrors.orgName = t("err_organizationName", "Enter your organization name");
    if (!form.country) newErrors.country = t("err_country", "Select your country");
    if (!form.orgType) newErrors.orgType = t("err_orgType", "Select organization type");
    if (!form.email) newErrors.email = t("err_email", "Enter your email");
    if (form.email && !emailRegex.test(form.email))
      newErrors.email = t("err_invalid_email", "Invalid email address.");
    if (!form.password) newErrors.password = t("err_password", "Enter your password");
    if (!form.confirmPassword) newErrors.confirmPassword = t("err_confirmPassword", "Enter your confirm password");
    if (form.password && form.confirmPassword && form.password !== form.confirmPassword)
      newErrors.confirmPassword = t("err_passwordNotMatch", "Passwords do not match.");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;

    const signupLoaderId = start("Creating your organization...");

    try {
      // Step 1: Signup
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Signup failed. Please try again.");

      showToast("Organization registered successfully!", "success");

      // Step 2: Login
      const loginLoaderId = start("Logging you in...");
      const loginRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email_id: form.email, password: form.password }),
      });

      const loginData = await loginRes.json();

      if (!loginRes.ok) throw new Error(loginData.error || "Login failed after signup.");

      const { token, organization: org } = loginData;

      // Step 3: Save session
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

      stop(loginLoaderId); // stop login loader
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      showToast(message, "error");
      console.error("Signup/Login error:", err);
    } finally {
      stop(signupLoaderId); // stop signup loader
    }
  };

  return (
    <div className="hidden lg:flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-1 text-center text-[var(--color-primary-text)]">
        {t("signup_form_title", "Sign up as Organization")}
      </h1>
      <h3 className="text-sm text-center text-[var(--color-secondary-text)] mb-4">
        {t("signup_form_subtitle", "Create your organization account to get started.")}
      </h3>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center space-y-3"
        style={{ width: "350px" }}
      >
        <Input
          name="orgName"
          placeholder={t("ph_organizationName", "Organization Name")}
          value={form.orgName}
          onChange={handleChange}
          fullWidth
          inputSize="sm"
          error={errors.orgName}
        />

        <div className="flex gap-3 w-full">
          <Select
            name="country"
            value={form.country}
            onChange={handleChange}
            fullWidth
            inputSize="sm"
            error={errors.country}
          >
            <option value="">{t("select_country", "Select Country")}</option>
            {countries.map((c) => (
              <option key={c.country_code} value={c.country_code}>
                {c.country_name}
              </option>
            ))}
          </Select>

          <Select
            name="orgType"
            value={form.orgType}
            onChange={handleChange}
            fullWidth
            inputSize="sm"
            error={errors.orgType}
            disabled={!form.country || filteredOrganizationTypes.length === 0}
          >
            <option value="">{t("select_orgType", "Select Type")}</option>
            {filteredOrganizationTypes.map((type) => (
              <option
                key={type.organization_type_code}
                value={type.organization_type_code}
              >
                {type.type_name}
              </option>
            ))}
          </Select>
        </div>

        <Input
          name="email"
          type="email"
          placeholder={t("ph_email", "Email")}
          value={form.email}
          onChange={handleChange}
          fullWidth
          inputSize="sm"
          error={errors.email}
        />

        <Input
          name="password"
          type="password"
          placeholder={t("ph_password", "Password")}
          value={form.password}
          onChange={handleChange}
          fullWidth
          inputSize="sm"
          error={errors.password}
        />

        <Input
          name="confirmPassword"
          type="password"
          placeholder={t("ph_confirmPassword", "Confirm Password")}
          value={form.confirmPassword}
          onChange={handleChange}
          fullWidth
          inputSize="sm"
          error={errors.confirmPassword}
        />

        <p className="text-xs text-gray-500 mt-1 self-start">
          * {t("mandatory_fields", "All fields are mandatory")}
        </p>

        <div className="flex justify-center gap-3 w-full mt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onBack}
            className="h-8 w-24 text-sm"
          >
            {t("back", "Back")}
          </Button>
          <Button type="submit" variant="primary" className="h-8 w-24 text-sm">
            {t("signUp", "Sign Up")}
          </Button>
        </div>
      </form>
    </div>
  );
}