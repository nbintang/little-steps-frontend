"use client"

import { Line, LineChart, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts"
import { useMemo } from "react"

export default function QuizLineChart({
  data,
  type,
  empty,
}: {
  data: { date: string; score: number }[]
  type: "overall" | "weekly" | "monthly"
  empty?: boolean
}) {
  const tickFormatter = (value: string) => {
    const d = new Date(value + "T00:00:00")
    if (Number.isNaN(d.getTime())) return value
    const opts: Intl.DateTimeFormatOptions =
      type === "monthly" ? { month: "short", year: "numeric" } : { month: "short", day: "numeric" }
    return new Intl.DateTimeFormat(undefined, opts).format(d)
  }

  const tooltipFormatter = (value: number) => [`${value}`, "Score"]

  const content = useMemo(() => {
    if (empty) {
      return (
        <div className="flex h-[240px] items-center justify-center rounded-md bg-secondary text-sm text-muted-foreground md:h-[300px]">
          No data for the selected filters.
        </div>
      )
    }
    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 8, right: 12, left: 4, bottom: 0 }}>
          <CartesianGrid stroke="hsl(var(--muted))" strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={tickFormatter}
            stroke="var(--muted-foreground)"
            fontSize={12}
            tickMargin={8}
          />
          <YAxis
            stroke="var(--muted-foreground)"
            fontSize={12}
            tickMargin={8}
            domain={[0, 100]}
            label={{
              value: "Score",
              angle: -90,
              position: "insideLeft",
              fill: "var(--muted-foreground)",
              fontSize: 12,
            }}
          />
          <Tooltip
            cursor={{ stroke: "var(--muted-foreground)", strokeDasharray: "3 3" }}
            formatter={tooltipFormatter}
            labelFormatter={(v: string) => `Date: ${tickFormatter(v)}`}
            contentStyle={{
              background: "var(--popover)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              color: "hsl(var(--popover-foreground))",
              fontSize: 12,
            }}
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke="var(--chart-1)"
            strokeWidth={3}
            dot={{ r: 3, stroke: "var(--chart-1)", fill: "var(--background)" }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    )
  }, [data, empty])

  return <div>{content}</div>
}
