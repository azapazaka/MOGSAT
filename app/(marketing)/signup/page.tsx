import Link from "next/link";
import { AuthForm } from "@/components/AuthForm";

export const metadata = { title: "Create an account" };

export default function SignupPage() {
  return (
    <div className="mx-auto w-full max-w-[420px] px-4 py-16 lg:py-24">
      <h1 className="text-[24px] font-semibold text-ink">Create an account</h1>
      <p className="mt-2 text-[14px] text-ink-muted">
        Start with a diagnostic test and a first set of drills.
      </p>
      <div className="mt-8">
        <AuthForm mode="signup" />
      </div>
      <p className="mt-6 text-[14px] text-ink-muted">
        Already registered?{" "}
        <Link href="/login" className="text-accent underline underline-offset-2">
          Log in
        </Link>
        .
      </p>
    </div>
  );
}
