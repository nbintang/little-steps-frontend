import { DayOfWeek } from "@/lib/enums/day-of-week"

export type ScheduleAPI = {
  id?: string
  day: DayOfWeek
  startTime: string // HH:mm in demo
  endTime: string // HH:mm in demo
}

