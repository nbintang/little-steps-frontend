
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { ChevronDown } from "lucide-react"
import { useMemo, useState } from "react"
import { cn } from "@/lib/utils"

export type ChartType = "overall" | "weekly" | "monthly"

export default function Filters(props: {
  type: ChartType
  onTypeChange: (v: ChartType) => void
  startDate: string
  endDate: string
  onStartDateChange: (v: string) => void
  onEndDateChange: (v: string) => void
  category: string
  onCategoryChange: (v: string) => void
  child: string
  onChildChange: (v: string) => void
  quiz: string
  onQuizChange: (v: string) => void
  categoryOptions: string[]
  onReset: () => void
}) {
  const {
    type,
    onTypeChange,
    startDate,
    endDate,
    onStartDateChange,
    onEndDateChange,
    category,
    onCategoryChange,
    child,
    onChildChange,
    quiz,
    onQuizChange,
    categoryOptions,
    onReset,
  } = props

  // Local popover open states to improve a11y/focus
  const [catOpen, setCatOpen] = useState(false)

  const catLabel = category || "All categories"

  const hasAnyFilter = useMemo(
    () => !!(startDate || endDate || category || type !== "overall"),
    [startDate, endDate, category, child, quiz, type],
  )

  return (
    <div className="flex flex-col gap-4">
      {/* Type selection */}
      <div className="flex flex-col gap-2">
        <Label className="text-sm">Type</Label>
        <Tabs value={type} onValueChange={(v) => onTypeChange(v as ChartType)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overall">Overall</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Combobox row */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Combobox
          label="Category"
          placeholder="Search category…"
          value={category}
          display={catLabel}
          options={categoryOptions}
          onChange={(v) => onCategoryChange(v)}
          open={catOpen}
          setOpen={setCatOpen}
          clearable
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2">
        <Button variant="secondary" onClick={onReset} disabled={!hasAnyFilter}>
          Reset
        </Button>
      </div>
    </div>
  )
}

function Combobox(props: {
  label: string
  placeholder: string
  value: string
  display: string
  options: string[]
  onChange: (v: string) => void
  open: boolean
  setOpen: (v: boolean) => void
  clearable?: boolean
}) {
  const { label, placeholder, value, display, options, onChange, open, setOpen, clearable } = props

  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-transparent"
          >
            <span className={cn(!value && "text-muted-foreground")}>{display}</span>
            <ChevronDown className="size-4 opacity-70" aria-hidden="true" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
          <Command>
            <CommandInput placeholder={placeholder} />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {clearable && (
                  <CommandItem
                    value="__clear__"
                    onSelect={() => {
                      onChange("")
                      setOpen(false)
                    }}
                  >
                    All
                  </CommandItem>
                )}
                {options.map((opt) => (
                  <CommandItem
                    key={opt}
                    value={opt}
                    onSelect={(v) => {
                      onChange(v)
                      setOpen(false)
                    }}
                  >
                    {opt}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
