import { Card, CardContent } from "@/components/ui/card";
import { Skeleton, TableSkeleton } from "@/components/ui/skeleton";

export default function AdminStudentsLoading() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Skeleton className="h-7 w-[160px]" />
        <Skeleton className="h-4 w-[380px]" />
      </div>
      <Card>
        <CardContent className="space-y-6">
          <Skeleton className="h-9 w-[320px]" />
          <TableSkeleton rows={8} columns={7} />
        </CardContent>
      </Card>
    </div>
  );
}
