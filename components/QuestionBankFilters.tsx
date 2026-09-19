"use client";

import { useRouter } from "next/navigation";
import { FilterSidebar, type QuestionFilterState } from "@/components/FilterSidebar";
import { serializeQuestionFilters } from "@/lib/query";
import type { QuestionFilters } from "@/lib/types";

/**
 * Bridges the presentational FilterSidebar to the URL. Changing a filter
 * navigates, which re-runs the server component and re-queries the data layer,
 * rather than filtering an already-downloaded list in the browser.
 */
export function QuestionBankFilters({
  filters,
  className,
}: {
  filters: QuestionFilters;
  className?: string;
}) {
  const router = useRouter();

  const value: QuestionFilterState = {
    section: filters.section ?? "all",
    domains: filters.domains ?? [],
    skills: filters.skills ?? [],
    difficulties: filters.difficulties ?? [],
    statuses: filters.statuses ?? [],
  };

  const handleChange = (next: QuestionFilterState) => {
    const params = serializeQuestionFilters({
      ...next,
      savedOnly: filters.savedOnly,
      search: filters.search,
      // Any filter change resets to the first page.
      page: 1,
    });
    const query = params.toString();
    router.push(query ? `/question-bank?${query}` : "/question-bank");
  };

  return <FilterSidebar value={value} onChange={handleChange} className={className} />;
}
