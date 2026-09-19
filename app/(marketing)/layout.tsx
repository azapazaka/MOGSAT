import Link from "next/link";
import { ThemeToggle } from "@/components/shell/ThemeToggle";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <header className="border-b border-line">
        <div className="mx-auto flex h-[56px] w-full max-w-[1200px] items-center gap-6 px-4 lg:px-8">
          <Link href="/" className="text-[15px] font-semibold text-ink">
            MOGSAT
          </Link>
          <nav aria-label="Marketing" className="ml-auto flex items-center gap-4">
            <Link
              href="/login"
              className="text-[14px] text-ink-muted transition-ui hover:text-ink"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-input border border-accent bg-accent px-4 py-2 text-[14px] font-medium text-on-accent transition-ui hover:opacity-90"
            >
              Create account
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <main id="main" className="flex-1">
        {children}
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex w-full max-w-[1200px] flex-wrap items-center justify-between gap-4 px-4 py-8 text-meta text-ink-muted lg:px-8">
          <p>MOGSAT — Digital SAT preparation.</p>
          <p>
            Stage 1 preview. Practice content is original placeholder material and is not
            affiliated with the College Board.
          </p>
        </div>
      </footer>
    </div>
  );
}
