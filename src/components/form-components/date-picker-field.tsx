"use client";

import * as React from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { useFormContext, Control, FieldValues, Path } from "react-hook-form";

interface DatePickerFieldProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  control?: Control<TFieldValues>;
  label?: string;
  description?: string;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
}

export function DatePickerField<TFieldValues extends FieldValues>({
  name,
  control,
  label = "Select date",
  description,
  placeholder = "Pick a date",
  minDate,
  maxDate,
}: DatePickerFieldProps<TFieldValues>) {
  // Use context if control is not passed
  const methods = useFormContext<TFieldValues>();
  const formControl = control ?? methods.control;

  if (!formControl) {
    throw new Error(
      "DatePickerField must be used within a FormProvider or control must be provided"
    );
  }

  return (
    <FormField
      control={formControl}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel className="after:content-['*'] after:ml-1 after:text-red-500">
            {label}
          </FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !field.value && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {field.value ? (
                  format(new Date(field.value), "PPP")
                ) : (
                  <span>{placeholder}</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value ? new Date(field.value) : undefined}
                onSelect={field.onChange}
                autoFocus
                disabled={(date) =>
                  (minDate ? date < minDate : false) ||
                  (maxDate ? date > maxDate : false)
                }
              />
            </PopoverContent>
          </Popover>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
