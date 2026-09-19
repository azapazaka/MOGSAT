import Link from "next/link";
import { getCohortAnalytics } from "@/lib/data";
import { PageHeader, SectionHeading } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { DomainAccuracyChart } from "@/components/charts/DomainAccuracyChart";
import { DifficultyBadge, DomainBadge } from "@/components/DomainBadge";
import { ProgressBar } from "@/components/ProgressRing";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { formatPercent } from "@/lib/utils";

export const metadata = { title: "Cohort analytics" };

export default async function AdminAnalyticsPage() {
  const analytics = await getCohortAnalytics();
  const weakest = analytics.domainAccuracy[0];
  const maxWeekly = Math.max(...analytics.weeklyActivity.map((week) => week.questions), 1);
  const maxBand = Math.max(...analytics.scoreDistribution.map((band) => band.students), 1);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Analytics"
        description="Where the group as a whole is losing marks, and which questions are doing the damage."
      />

      <Card>
        <CardContent>
          <SectionHeading title="Accuracy by domain, cohort-wide" />
          {weakest ? (
            <p className="mb-4 text-[14px] text-ink-muted">
              Weakest domain: <span className="text-ink">{weakest.domain}</span> at{" "}
              {formatPercent(weakest.accuracy)} across {weakest.attempted.toLocaleString("en-GB")}{" "}
              answered questions.
            </p>
          ) : null}
          <DomainAccuracyChart data={analytics.domainAccuracy} height={340} />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent>
            <SectionHeading title="Skills the group struggles with" />
            <ul className="space-y-4">
              {analytics.skillGaps.map((gap) => (
                <li key={gap.skill} className="border-b border-line pb-4 last:border-0 last:pb-0">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-[14px] text-ink">{gap.skill}</span>
                    <span className="shrink-0 text-meta tabular-nums text-ink-muted">
                      {formatPercent(gap.accuracy)}
                    </span>
                  </div>
                  <ProgressBar value={gap.accuracy} className="mt-2" label={`${gap.skill} accuracy`} />
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    <DomainBadge domain={gap.domain} />
                    <span className="text-meta text-ink-muted">
                      {gap.studentsBelowThreshold} student
                      {gap.studentsBelowThreshold === 1 ? "" : "s"} below 60%
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardContent>
              <SectionHeading title="Score distribution" />
              <ul className="space-y-3">
                {analytics.scoreDistribution.map((band) => (
                  <li key={band.band} className="flex items-center gap-4">
                    <span className="w-[120px] shrink-0 text-meta text-ink-muted">{band.band}</span>
                    <div className="flex-1">
                      <ProgressBar
                        value={band.students}
                        max={maxBand}
                        label={`${band.students} students in ${band.band}`}
                      />
                    </div>
                    <span className="w-6 shrink-0 text-right text-meta tabular-nums text-ink">
                      {band.students}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <SectionHeading title="Questions answered per week" />
              <ul className="space-y-3">
                {analytics.weeklyActivity.map((week) => (
                  <li key={week.week} className="flex items-center gap-4">
                    <span className="w-[80px] shrink-0 text-meta text-ink-muted">{week.week}</span>
                    <div className="flex-1">
                      <ProgressBar
                        value={week.questions}
                        max={maxWeekly}
                        label={`${week.questions} questions in ${week.week}`}
                      />
                    </div>
                    <span className="w-12 shrink-0 text-right text-meta tabular-nums text-ink">
                      {week.questions}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardContent>
          <SectionHeading title="Questions most often answered incorrectly" />
          <Table>
            <THead>
              <TR className="border-b-0">
                <TH>Question</TH>
                <TH>Domain</TH>
                <TH>Difficulty</TH>
                <TH>Attempts</TH>
                <TH>Incorrect</TH>
                <TH>Rate</TH>
              </TR>
            </THead>
            <TBody>
              {analytics.hardestQuestions.map((stat) => (
                <TR key={stat.question.id}>
                  <TD className="max-w-[360px]">
                    <Link
                      href={`/question-bank/${stat.question.id}`}
                      className="line-clamp-2 text-[14px] transition-ui hover:text-accent"
                    >
                      {stat.question.stem}
                    </Link>
                    <span className="mt-0.5 block font-mono text-meta text-ink-muted">
                      {stat.question.id}
                    </span>
                  </TD>
                  <TD>
                    <DomainBadge domain={stat.question.domain} />
                  </TD>
                  <TD>
                    <DifficultyBadge difficulty={stat.question.difficulty} />
                  </TD>
                  <TD className="tabular-nums">{stat.attempts}</TD>
                  <TD className="tabular-nums">{stat.incorrect}</TD>
                  <TD>
                    <div className="flex items-center gap-3">
                      <span className="w-10 shrink-0 tabular-nums">
                        {formatPercent(stat.incorrectRate)}
                      </span>
                      <ProgressBar
                        value={stat.incorrectRate}
                        className="w-16"
                        label={`${stat.question.id} incorrect rate`}
                      />
                    </div>
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
