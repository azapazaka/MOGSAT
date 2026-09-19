import { Card, CardContent } from "@/components/ui/card";
import { Skeleton, TextSkeleton } from "@/components/ui/skeleton";

export default function ReviewLoading() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Skeleton className="h-7 w-[300px]" />
        <Skeleton className="h-4 w-[240px]" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardContent>
              <Skeleton className="h-3 w-[80px]" />
              <Skeleton className="mt-3 h-7 w-[70px]" />
            </CardContent>
          </Card>
        ))}
      </div>
      {Array.from({ length: 3 }).map((_, index) => (
        <Card key={index}>
          <CardContent>
            <Skeleton className="h-4 w-[200px]" />
            <div className="mt-4">
              <TextSkeleton lines={4} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
