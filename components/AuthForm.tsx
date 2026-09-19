"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FieldError, Input, Label } from "@/components/ui/input";

/**
 * Validation UI only — Stage 1 has no authentication. Submitting runs the
 * client-side checks and then shows what would happen next; Stage 2 replaces
 * `handleSubmit` with a Supabase auth call and keeps the same markup.
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
  const [values, setValues] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  const update = (field: keyof typeof values) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
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
    const next = validate();
    setErrors(next);
    setSubmitted(Object.keys(next).length === 0);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {isSignup ? (
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            value={values.name}
            onChange={update("name")}
            autoComplete="name"
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
          type="email"
          value={values.email}
          onChange={update("email")}
          autoComplete="email"
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
          type="password"
          value={values.password}
          onChange={update("password")}
          autoComplete={isSignup ? "new-password" : "current-password"}
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
            type="password"
            value={values.confirm}
            onChange={update("confirm")}
            autoComplete="new-password"
            aria-invalid={Boolean(errors.confirm)}
            aria-describedby={errors.confirm ? "confirm-error" : undefined}
          />
          <span id="confirm-error">
            <FieldError>{errors.confirm}</FieldError>
          </span>
        </div>
      ) : null}

      <Button type="submit" variant="primary" size="lg" className="w-full">
        {isSignup ? "Create account" : "Log in"}
      </Button>

      {submitted ? (
        <p role="status" className="rounded-input border border-line bg-paper p-3 text-meta text-ink-muted">
          Validation passed. Authentication arrives in Stage 2 — in the meantime, open the{" "}
          <Link href="/dashboard" className="text-accent underline underline-offset-2">
            demo dashboard
          </Link>
          .
        </p>
      ) : null}
    </form>
  );
}
