"use client";

import * as React from "react";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useFormContext, Control, FieldValues, Path } from "react-hook-form";
import { AsyncSelect, AsyncSelectProps } from "@/components/ui/async-select"; // sesuaikan path
interface AsyncSelectFieldProps<TFieldValues extends FieldValues, TOption> {
  name: Path<TFieldValues>;
  control?: Control<TFieldValues>;
  label?: string;
  description?: string;
  placeholder?: string;
  fetcher: AsyncSelectProps<TOption>["fetcher"];
  getOptionValue: AsyncSelectProps<TOption>["getOptionValue"];
  getDisplayValue: AsyncSelectProps<TOption>["getDisplayValue"];
  renderOption: AsyncSelectProps<TOption>["renderOption"];
  notFound?: React.ReactNode;
  disabled?: boolean;
  clearable?: boolean;

  /** Custom transform function for onChange */
  transformValue?: (option: string) => any;
}


export function AsyncSelectField<TFieldValues extends FieldValues, TOption>({
  name,
  control,
  label,
  description,
  placeholder,
  fetcher,
  getOptionValue,
  getDisplayValue,
  renderOption,
  notFound,
  disabled,
  clearable = true,
  transformValue,
}: AsyncSelectFieldProps<TFieldValues, TOption>) {
  const methods = useFormContext<TFieldValues>();
  const formControl = control ?? methods.control;

  return (
    <FormField
      control={formControl}
      name={name}
      render={({ field }) => (
        <FormItem className="sm:col-span-2 max-w-full">
          {label && <FormLabel>{label}</FormLabel>}
          {description && <FormDescription>{description}</FormDescription>}
          <FormControl>
            <AsyncSelect<TOption>
              fetcher={fetcher}
              getOptionValue={getOptionValue}
              getDisplayValue={getDisplayValue}
              renderOption={renderOption}
              notFound={notFound}
              value={field.value ? getOptionValue(field.value) : ""}
              onChange={(val) => {
                if (!val) return field.onChange(clearable ? undefined : "");
                // Jika ada transformValue, pakai itu
                if (transformValue) {
                  field.onChange(transformValue(val));
                } else {
                  field.onChange(val as unknown as TOption);
                }
              }}
              placeholder={placeholder}
              label={label ?? ""}
              disabled={disabled}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
