import { Suspense } from "react";
import Link from "next/link";
import { AuthForm } from "@/components/AuthForm";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = { title: "Create an account" };

export default function SignupPage() {
  return (
    <div className="mx-auto w-full max-w-[420px] px-4 py-16 lg:py-24">
      <h1 className="text-[24px] font-semibold text-ink">Create an account</h1>
      <p className="mt-2 text-[14px] text-ink-muted">
        Start with a diagnostic test and a first set of drills.
      </p>
      {/* AuthForm reads search params, which makes it dynamic. The boundary
          lets the rest of the page prerender as static. */}
      <div className="mt-8">
        <Suspense fallback={<AuthFormFallback />}>
          <AuthForm mode="signup" />
        </Suspense>
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

function AuthFormFallback() {
  return (
    <div className="space-y-6" aria-hidden>
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="space-y-2">
          <Skeleton className="h-3 w-[80px]" />
          <Skeleton className="h-9 w-full" />
        </div>
      ))}
      <Skeleton className="h-11 w-full" />
    </div>
  );
}
