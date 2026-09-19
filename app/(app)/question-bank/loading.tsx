import { QuestionRowSkeletonList } from "@/components/QuestionCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function QuestionBankLoading() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Skeleton className="h-7 w-[220px]" />
        <Skeleton className="h-4 w-[420px]" />
      </div>
      <Skeleton className="h-8 w-[260px]" />
      <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
        <div className="space-y-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-3 w-[80px]" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-3/5" />
            </div>
          ))}
        </div>
        <QuestionRowSkeletonList count={8} />
      </div>
    </div>
  );
}
