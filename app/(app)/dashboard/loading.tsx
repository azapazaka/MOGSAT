import { Card, CardContent } from "@/components/ui/card";
import { ChartSkeleton, Skeleton, TextSkeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Skeleton className="h-7 w-[280px]" />
        <Skeleton className="h-4 w-[360px]" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <Card>
          <CardContent className="flex flex-col items-center py-8">
            <Skeleton className="h-[176px] w-[176px] rounded-full" />
            <Skeleton className="mt-6 h-4 w-[200px]" />
          </CardContent>
        </Card>
        <div className="grid gap-6 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index}>
              <CardContent>
                <Skeleton className="h-3 w-[100px]" />
                <Skeleton className="mt-3 h-7 w-[80px]" />
                <Skeleton className="mt-3 h-3 w-[140px]" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent>
            <Skeleton className="mb-4 h-4 w-[160px]" />
            <ChartSkeleton height={320} />
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Skeleton className="mb-4 h-4 w-[140px]" />
            <TextSkeleton lines={6} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
