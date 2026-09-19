import Link from "next/link";
import { AuthForm } from "@/components/AuthForm";

export const metadata = { title: "Log in" };

export default function LoginPage() {
  return (
    <div className="mx-auto w-full max-w-[420px] px-4 py-16 lg:py-24">
      <h1 className="text-[24px] font-semibold text-ink">Log in</h1>
      <p className="mt-2 text-[14px] text-ink-muted">
        Pick up where you left off.
      </p>
      <div className="mt-8">
        <AuthForm mode="login" />
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
