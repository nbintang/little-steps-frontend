"use client"

import { Line, LineChart, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts"
import { useMemo } from "react"
import { ChartTooltip, ChartTooltipContent } from "./ui/chart";

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
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}
                />
              }
            />
            <Line
              dataKey={activeChart}
              type="monotone"
              stroke={`var(--color-${activeChart})`}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
      </ResponsiveContainer>
    )
  }, [data, empty])

  return <div>{content}</div>
}
