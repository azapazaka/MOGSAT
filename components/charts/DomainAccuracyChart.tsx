"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DomainAccuracy } from "@/lib/types";
import { DOMAIN_ABBREVIATIONS } from "@/lib/taxonomy";
import { AXIS_TICK, ChartFrame, ChartTooltip } from "./chart-parts";

/**
 * Accuracy by domain as horizontal bars, so the eight domain names stay
 * readable. Single accent series, 4px rounded data-ends, 2px surface gap
 * between adjacent bars.
 */
export function DomainAccuracyChart({
  data,
  height = 300,
  useAbbreviations = false,
}: {
  data: DomainAccuracy[];
  height?: number;
  useAbbreviations?: boolean;
}) {
  const rows = data.map((entry) => ({
    ...entry,
    label: useAbbreviations ? DOMAIN_ABBREVIATIONS[entry.domain] : entry.domain,
    percent: Math.round(entry.accuracy * 100),
  }));

  return (
    <ChartFrame height={height}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={rows}
          layout="vertical"
          margin={{ top: 4, right: 32, bottom: 0, left: 8 }}
          barCategoryGap={6}
        >
          <CartesianGrid stroke="var(--line)" horizontal={false} />
          <XAxis
            type="number"
            domain={[0, 100]}
            tick={AXIS_TICK}
            tickLine={false}
            axisLine={{ stroke: "var(--line)" }}
            tickFormatter={(value: number) => `${value}%`}
          />
          <YAxis
            type="category"
            dataKey="label"
            tick={AXIS_TICK}
            tickLine={false}
            axisLine={false}
            width={useAbbreviations ? 56 : 188}
          />
          <Tooltip
            cursor={{ fill: "var(--accent-soft)" }}
            content={({ active, payload }) =>
              active && payload?.length ? (
                <ChartTooltip
                  label={payload[0].payload.domain}
                  rows={[
                    { label: "Accuracy", value: `${payload[0].payload.percent}%` },
                    {
                      label: "Answered",
                      value: `${payload[0].payload.correct} of ${payload[0].payload.attempted}`,
                    },
                  ]}
                />
              ) : null
            }
          />
          <Bar dataKey="percent" radius={[0, 4, 4, 0]} isAnimationActive={false} barSize={14}>
            {rows.map((row) => (
              <Cell key={row.domain} fill="var(--accent)" />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}

/** Average seconds per question by domain — same form, different measure. */
export function TimePerQuestionChart({
  data,
  height = 300,
}: {
  data: { domain: string; seconds: number }[];
  height?: number;
}) {
  return (
    <ChartFrame height={height}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 32, bottom: 0, left: 8 }}
          barCategoryGap={6}
        >
          <CartesianGrid stroke="var(--line)" horizontal={false} />
          <XAxis
            type="number"
            tick={AXIS_TICK}
            tickLine={false}
            axisLine={{ stroke: "var(--line)" }}
            tickFormatter={(value: number) => `${value}s`}
          />
          <YAxis
            type="category"
            dataKey="domain"
            tick={AXIS_TICK}
            tickLine={false}
            axisLine={false}
            width={188}
          />
          <Tooltip
            cursor={{ fill: "var(--accent-soft)" }}
            content={({ active, payload }) =>
              active && payload?.length ? (
                <ChartTooltip
                  label={payload[0].payload.domain}
                  rows={[{ label: "Average", value: `${payload[0].payload.seconds}s per question` }]}
                />
              ) : null
            }
          />
          <Bar dataKey="seconds" fill="var(--accent)" radius={[0, 4, 4, 0]} isAnimationActive={false} barSize={14} />
        </BarChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}
