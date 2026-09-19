import { Card, CardContent } from "@/components/ui/card";
import { ChartSkeleton, Skeleton } from "@/components/ui/skeleton";

export default function ProgressLoading() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Skeleton className="h-7 w-[180px]" />
        <Skeleton className="h-4 w-[380px]" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardContent>
              <Skeleton className="h-3 w-[100px]" />
              <Skeleton className="mt-3 h-7 w-[80px]" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardContent>
          <Skeleton className="mb-4 h-4 w-[120px]" />
          <ChartSkeleton height={300} />
        </CardContent>
      </Card>
      <div className="grid gap-6 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <Card key={index}>
            <CardContent>
              <Skeleton className="mb-4 h-4 w-[180px]" />
              <ChartSkeleton height={320} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
