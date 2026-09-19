import { Card, CardContent } from "@/components/ui/card";
import { ChartSkeleton, Skeleton, TableSkeleton } from "@/components/ui/skeleton";

export default function AdminAnalyticsLoading() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Skeleton className="h-7 w-[180px]" />
        <Skeleton className="h-4 w-[420px]" />
      </div>
      <Card>
        <CardContent>
          <Skeleton className="mb-4 h-4 w-[260px]" />
          <ChartSkeleton height={340} />
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Skeleton className="mb-4 h-4 w-[300px]" />
          <TableSkeleton rows={8} columns={6} />
        </CardContent>
      </Card>
    </div>
  );
}
