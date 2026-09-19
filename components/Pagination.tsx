import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** Page links that preserve the current filters in the query string. */
export function Pagination({
  page,
  pageCount,
  total,
  basePath,
  params,
}: {
  page: number;
  pageCount: number;
  total: number;
  basePath: string;
  params: URLSearchParams;
}) {
  if (pageCount <= 1) {
    return (
      <p className="text-meta tabular-nums text-ink-muted">
        {total} question{total === 1 ? "" : "s"}
      </p>
    );
  }

  const hrefFor = (target: number) => {
    const next = new URLSearchParams(params);
    if (target <= 1) next.delete("page");
    else next.set("page", String(target));
    const query = next.toString();
    return query ? `${basePath}?${query}` : basePath;
  };

  const pages = Array.from({ length: pageCount }, (_, index) => index + 1).filter(
    (candidate) =>
      candidate === 1 ||
      candidate === pageCount ||
      Math.abs(candidate - page) <= 1,
  );

  return (
    <nav aria-label="Pagination" className="flex flex-wrap items-center justify-between gap-4">
      <p className="text-meta tabular-nums text-ink-muted">
        Page {page} of {pageCount} · {total} question{total === 1 ? "" : "s"}
      </p>

      <div className="flex items-center gap-2">
        <PageLink href={hrefFor(page - 1)} disabled={page === 1} label="Previous page">
          <ChevronLeft size={16} />
        </PageLink>

        {pages.map((candidate, index) => {
          const previous = pages[index - 1];
          const gap = previous !== undefined && candidate - previous > 1;
          return (
            <span key={candidate} className="flex items-center gap-2">
              {gap ? <span className="text-meta text-ink-muted">…</span> : null}
              <Link
                href={hrefFor(candidate)}
                aria-label={`Page ${candidate}`}
                aria-current={candidate === page ? "page" : undefined}
                className={cn(
                  "flex h-9 min-w-9 items-center justify-center rounded-input border px-2 text-[14px] tabular-nums transition-ui",
                  candidate === page
                    ? "border-ink bg-ink text-paper"
                    : "border-line text-ink hover:border-ink-muted",
                )}
              >
                {candidate}
              </Link>
            </span>
          );
        })}

        <PageLink href={hrefFor(page + 1)} disabled={page === pageCount} label="Next page">
          <ChevronRight size={16} />
        </PageLink>
      </div>
    </nav>
  );
}

function PageLink({
  href,
  disabled,
  label,
  children,
}: {
  href: string;
  disabled: boolean;
  label: string;
  children: React.ReactNode;
}) {
  if (disabled) {
    return (
      <span
        aria-disabled
        aria-label={label}
        className="flex h-9 w-9 items-center justify-center rounded-input border border-line text-line"
      >
        {children}
      </span>
    );
  }
  return (
    <Link
      href={href}
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-input border border-line text-ink transition-ui hover:border-ink-muted"
    >
      {children}
    </Link>
  );
}
