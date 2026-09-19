import { getAllQuestions } from "@/lib/data";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { QuestionAdminTable } from "@/components/QuestionAdminTable";

export const metadata = { title: "Question management" };

export default async function AdminQuestionsPage() {
  const questions = await getAllQuestions();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Questions"
        description="The whole bank, with create, edit and delete. All content is original placeholder material written for this project."
      />
      <Card>
        <CardContent>
          <QuestionAdminTable questions={questions} />
        </CardContent>
      </Card>
    </div>
  );
}
