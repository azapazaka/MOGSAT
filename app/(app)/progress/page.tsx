import { LineChart as LineChartIcon } from "lucide-react";
import { getStudent, getStudentProgress } from "@/lib/data";
import { PageHeader, SectionHeading, StatTile } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/EmptyState";
import { ScoreTrendChart } from "@/components/charts/ScoreTrendChart";
import { DomainAccuracyChart, TimePerQuestionChart } from "@/components/charts/DomainAccuracyChart";
import { CalendarHeatmap } from "@/components/charts/CalendarHeatmap";
import { SkillMasteryGrid } from "@/components/SkillMasteryGrid";
import { DomainBadge } from "@/components/DomainBadge";
import { ProgressBar } from "@/components/ProgressRing";
import { formatDuration, formatPercent, signed } from "@/lib/utils";

export const metadata = { title: "Progress" };

export default async function ProgressPage() {
  const [progress, student] = await Promise.all([getStudentProgress(), getStudent("s-01")]);

  const firstScore = progress.trend[0]?.score ?? 0;
  const latestScore = progress.trend[progress.trend.length - 1]?.score ?? 0;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Progress"
        description="Everything tracked since you joined, rather than a single session."
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          label="Questions solved"
          value={progress.totalQuestions.toLocaleString("en-GB")}
          hint={`${formatPercent(student?.accuracy ?? 0)} accuracy overall`}
        />
        <StatTile
          label="Score change"
          value={signed(latestScore - firstScore)}
          hint="Since your first recorded test"
          tone={latestScore - firstScore >= 0 ? "positive" : "negative"}
        />
        <StatTile
          label="Average time"
          value={`${progress.averageTimeSeconds}s`}
          hint="Per question, across all domains"
        />
        <StatTile
          label="Current streak"
          value={`${progress.streakDays} days`}
          hint="Consecutive days with practice"
        />
      </div>

      <Card>
        <CardContent>
          <SectionHeading title="Score trend" />
          {progress.trend.length === 0 ? (
            <EmptyState
              icon={LineChartIcon}
              title="No score history yet"
              description="Take a full-length practice test to place your first point on this chart."
            />
          ) : (
            <ScoreTrendChart data={progress.trend} height={300} />
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent>
            <SectionHeading title="Accuracy by domain" />
            <DomainAccuracyChart data={progress.domainAccuracy} height={320} />
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <SectionHeading title="Average time per question" />
            <TimePerQuestionChart
              data={progress.averageTimeByDomain.map((entry) => ({
                domain: entry.domain,
                seconds: entry.seconds,
              }))}
              height={320}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent>
          <SectionHeading title="Hardest skills" />
          {progress.hardestSkills.length === 0 ? (
            <EmptyState
              title="Not enough data yet"
              description="Once you have answered a few questions in each skill, the weakest will be listed here."
            />
          ) : (
            <ol className="space-y-4">
              {progress.hardestSkills.map((skill, index) => (
                <li
                  key={skill.skill}
                  className="flex flex-wrap items-center gap-4 border-b border-line pb-4 last:border-0 last:pb-0"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-input border border-line text-meta tabular-nums text-ink-muted">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] text-ink">{skill.skill}</p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-3">
                      <DomainBadge domain={skill.domain} />
                      <span className="text-meta tabular-nums text-ink-muted">
                        {skill.attempted} questions · {formatDuration(skill.averageTimeSeconds)} average
                      </span>
                    </div>
                  </div>
                  <div className="w-full sm:w-[160px]">
                    <p className="mb-1 text-right text-meta tabular-nums text-ink-muted">
                      {formatPercent(skill.accuracy)}
                    </p>
                    <ProgressBar value={skill.accuracy} label={`${skill.skill} accuracy`} />
                  </div>
                </li>
              ))}
            </ol>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <SectionHeading title="Activity" />
          <CalendarHeatmap days={progress.activity} />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <SectionHeading title="Skill mastery" />
          <SkillMasteryGrid skills={progress.skillMastery} />
        </CardContent>
      </Card>
    </div>
  );
}
