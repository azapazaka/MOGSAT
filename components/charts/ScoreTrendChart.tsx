"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ProgressPoint } from "@/lib/types";
import { formatShortDate } from "@/lib/utils";
import { AXIS_TICK, ChartFrame, ChartTooltip, GRID_PROPS } from "./chart-parts";

/**
 * Total score over time: a plain 2px accent line, no area fill, no legend.
 * The y-domain is padded around the data rather than anchored at 0, since SAT
 * composites start at 400.
 */
export function ScoreTrendChart({
  data,
  height = 260,
}: {
  data: ProgressPoint[];
  height?: number;
}) {
  const scores = data.map((point) => point.score);
  const min = Math.min(...scores);
  const max = Math.max(...scores);
  const pad = Math.max(40, Math.round((max - min) * 0.25));

  return (
    <ChartFrame height={height}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
          <CartesianGrid {...GRID_PROPS} />
          <XAxis
            dataKey="date"
            tickFormatter={(value: string) => formatShortDate(value)}
            tick={AXIS_TICK}
            tickLine={false}
            axisLine={{ stroke: "var(--line)" }}
            minTickGap={24}
          />
          <YAxis
            domain={[Math.max(400, min - pad), Math.min(1600, max + pad)]}
            tick={AXIS_TICK}
            tickLine={false}
            axisLine={false}
            width={48}
          />
          <Tooltip
            cursor={{ stroke: "var(--line)", strokeWidth: 1 }}
            content={({ active, payload, label }) =>
              active && payload?.length ? (
                <ChartTooltip
                  label={formatShortDate(String(label))}
                  rows={[
                    { label: "Total", value: payload[0].payload.score },
                    { label: "Math", value: payload[0].payload.math },
                    { label: "Reading and Writing", value: payload[0].payload.rw },
                  ]}
                />
              ) : null
            }
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke="var(--accent)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: "var(--accent)", stroke: "var(--surface)", strokeWidth: 2 }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}
