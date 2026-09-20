"use client";

import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FieldError, Input, Label } from "@/components/ui/input";
import { signIn, signUp } from "@/app/auth/actions";

/**
 * Sign-in and sign-up, backed by Supabase Auth.
 *
 * Client-side validation runs first so obvious mistakes never cost a round
 * trip, then the server action does the real work. The server is still the
 * authority — the checks here are a convenience, not a security boundary.
 */

interface Errors {
  name?: string;
  email?: string;
  password?: string;
  confirm?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const isSignup = mode === "signup";
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";

  const [values, setValues] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const update = (field: keyof typeof values) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setFormError(null);
  };

  const validate = (): Errors => {
    const next: Errors = {};
    if (isSignup && values.name.trim().length < 2) next.name = "Enter your full name.";
    if (!EMAIL_PATTERN.test(values.email)) next.email = "Enter a valid email address.";
    if (values.password.length < 8) next.password = "Use at least 8 characters.";
    if (isSignup && values.confirm !== values.password) next.confirm = "Passwords do not match.";
    return next;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const formData = new FormData();
    formData.set("email", values.email);
    formData.set("password", values.password);
    if (isSignup) formData.set("name", values.name);
    else formData.set("next", next);

    startTransition(async () => {
      // A successful action redirects, so control only returns here on failure.
      const result = isSignup ? await signUp(formData) : await signIn(formData);
      if (result?.error) setFormError(result.error);
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {isSignup ? (
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            name="name"
            value={values.name}
            onChange={update("name")}
            autoComplete="name"
            disabled={pending}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          <span id="name-error">
            <FieldError>{errors.name}</FieldError>
          </span>
        </div>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={values.email}
          onChange={update("email")}
          autoComplete="email"
          disabled={pending}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        <span id="email-error">
          <FieldError>{errors.email}</FieldError>
        </span>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          value={values.password}
          onChange={update("password")}
          autoComplete={isSignup ? "new-password" : "current-password"}
          disabled={pending}
          aria-invalid={Boolean(errors.password)}
          aria-describedby={errors.password ? "password-error" : undefined}
        />
        <span id="password-error">
          <FieldError>{errors.password}</FieldError>
        </span>
      </div>

      {isSignup ? (
        <div className="space-y-2">
          <Label htmlFor="confirm">Confirm password</Label>
          <Input
            id="confirm"
            name="confirm"
            type="password"
            value={values.confirm}
            onChange={update("confirm")}
            autoComplete="new-password"
            disabled={pending}
            aria-invalid={Boolean(errors.confirm)}
            aria-describedby={errors.confirm ? "confirm-error" : undefined}
          />
          <span id="confirm-error">
            <FieldError>{errors.confirm}</FieldError>
          </span>
        </div>
      ) : null}

      <Button type="submit" variant="primary" size="lg" className="w-full" disabled={pending}>
        {pending
          ? isSignup
            ? "Creating account…"
            : "Logging in…"
          : isSignup
            ? "Create account"
            : "Log in"}
      </Button>

      {formError ? (
        <p
          role="alert"
          className="rounded-input border border-incorrect bg-paper p-3 text-meta text-incorrect"
        >
          {formError}
        </p>
      ) : null}
    </form>
  );
}
