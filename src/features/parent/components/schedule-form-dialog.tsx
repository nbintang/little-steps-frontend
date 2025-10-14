import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScheduleAPI } from "@/types/schedule"
import { DayOfWeek } from "@/lib/enums/day-of-week"

const scheduleSchema = z
  .object({
    day: z.enum(DayOfWeek),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
    timezone: z.string().min(1, "Timezone is required"),
  })
  .refine(
    (val) => {
      // simple lexical compare assuming HH:mm format
      return val.startTime < val.endTime
    },
    { message: "End time must be after start time", path: ["endTime"] },
  )

type FormValues = z.infer<typeof scheduleSchema>

type Props = {
  defaultValues?: Partial<FormValues>
  onSubmit: (values: ScheduleAPI) => void
  onCancel: () => void
}

export function ScheduleFormDialog({ defaultValues, onSubmit, onCancel }: Props) {
  const form = useForm<FormValues>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      day: DayOfWeek.SUNDAY,
      startTime: "09:00",
      endTime: "10:00",
      timezone: "Asia/Jakarta",
      ...defaultValues,
    },
  })

  return (
    <Form {...form}>
      <form
        className="grid grid-cols-1 gap-4 md:grid-cols-4"
        onSubmit={form.handleSubmit((values) => onSubmit(values))}
      >
        <FormField
          control={form.control}
          name="day"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Day</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a day" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(DayOfWeek).map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="startTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start time</FormLabel>
              <FormControl>
                <Input type="time" step="300" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="endTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>End time</FormLabel>
              <FormControl>
                <Input type="time" step="300" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="timezone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Timezone</FormLabel>
              <FormControl>
                <Input placeholder="Asia/Jakarta" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="col-span-1 md:col-span-4 flex items-center justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save Schedule</Button>
        </div>
      </form>
    </Form>
  )
}
