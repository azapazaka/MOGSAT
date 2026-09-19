import { notFound } from "next/navigation";
import { getSessionReview } from "@/lib/data";
import { PageHeader } from "@/components/PageHeader";
import { ReviewContent } from "@/components/ReviewContent";
import { formatDate } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  const review = await getSessionReview(sessionId);
  return { title: review ? `Review · ${review.session.title}` : "Review" };
}

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  const review = await getSessionReview(sessionId);
  if (!review) notFound();

  const completed = review.session.completedAt;

  return (
    <div className="space-y-8">
      <PageHeader
        title={review.session.title}
        description={`${review.session.kind === "practice_test" ? "Practice test" : "Drill"} · ${
          review.session.timed ? "Timed" : "Untimed"
        }${completed ? ` · Completed ${formatDate(completed)}` : ""}`}
      />
      <ReviewContent review={review} />
    </div>
  );
}
