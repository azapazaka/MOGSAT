import { Suspense } from "react";
import Link from "next/link";
import { AuthForm } from "@/components/AuthForm";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = { title: "Log in" };

export default function LoginPage() {
  return (
    <div className="mx-auto w-full max-w-[420px] px-4 py-16 lg:py-24">
      <h1 className="text-[24px] font-semibold text-ink">Log in</h1>
      <p className="mt-2 text-[14px] text-ink-muted">
        Pick up where you left off.
      </p>
      {/* AuthForm reads the ?next= parameter, which makes it dynamic. The
          boundary lets the rest of the page prerender as static. */}
      <div className="mt-8">
        <Suspense fallback={<AuthFormFallback />}>
          <AuthForm mode="login" />
        </Suspense>
      </div>
      <p className="mt-6 text-[14px] text-ink-muted">
        No account yet?{" "}
        <Link href="/signup" className="text-accent underline underline-offset-2">
          Create one
        </Link>
        .
      </p>
    </div>
  );
}

function AuthFormFallback() {
  return (
    <div className="space-y-6" aria-hidden>
      {Array.from({ length: 2 }).map((_, index) => (
        <div key={index} className="space-y-2">
          <Skeleton className="h-3 w-[80px]" />
          <Skeleton className="h-9 w-full" />
        </div>
      ))}
      <Skeleton className="h-11 w-full" />
    </div>
  );
}
