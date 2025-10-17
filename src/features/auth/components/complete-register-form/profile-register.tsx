import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { AsyncSelect } from "@/components/ui/async-select";
import axios from "axios";
import { CompleteProfile } from "../../schemas/complete-register-schema";
export const ProfileRegister = () => {
  const form = useFormContext<CompleteProfile>();
  return (
    <>
      <FormField
        control={form.control}
        name="firstName"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="after:content-['*'] after:ml-1 after:text-red-500">
              Nama Depan
            </FormLabel>
            <FormControl>
              <Input
                id="firstName"
                placeholder="Masukkan Nama Depan"
                type="text"
                disabled={form.formState.isSubmitting}
                {...field}
              />
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="lastName"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="after:content-['*'] after:ml-1 after:text-red-500">
              Nama Belakang
            </FormLabel>
            <FormControl>
              <Input
                id="lastName"
                placeholder="Masukkan Nama Belakang"
                type="text"
                disabled={form.formState.isSubmitting}
                {...field}
              />
            </FormControl>

            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem className="grid gap-3 relative">
            <FormLabel className="after:content-['*'] after:ml-1 after:text-red-500">
              Phone
            </FormLabel>
            <FormControl>
              <Input
                id="phone"
                placeholder="08xxxxxxxx"
                type="text"
                disabled={form.formState.isSubmitting}
                {...field}
              />
            </FormControl>

            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="birthDate"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel className="after:content-['*'] after:ml-1 after:text-red-500">
              Date of birth
            </FormLabel>
            <Popover>
              <PopoverTrigger className=" " asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {field.value ? (
                    format(field.value, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                  selected={field.value ? new Date(field.value) : undefined}
                  onSelect={field.onChange}
                  autoFocus
                />
              </PopoverContent>
            </Popover>
            <FormDescription>
              Your date of birth is used to calculate your age.
            </FormDescription>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem className="sm:col-span-2 max-w-full">
            <FormLabel>Location</FormLabel>
            <FormDescription>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Itaque
              eius quisquam quidem!
            </FormDescription>
            <FormControl>
              <AsyncSelect<LocationResponse>
                fetcher={async (query) => {
                  const response = await axios.get<LocationResponse[]>(
                    "https://nominatim.openstreetmap.org/search",
                    {
                      params: {
                        q: query,
                        format: "jsonv2",
                        addressdetails: 1,
                        countrycodes: "id",
                        "accept-language": "id",
                        limit: 10,
                      },
                    }
                  );
                  return response.data;
                }}
                getDisplayValue={(option) => (
                  <div className={"max-w-xs"}>
                    <p className="truncate">{option.display_name}</p>
                  </div>
                )}
                notFound={
                  <div className="py-6 text-center text-sm">
                    No location found
                  </div>
                }
                getOptionValue={(option) => `${option.lat},${option.lon}`}
                renderOption={(option) => (
                  <div className="flex items-center gap-3">
                    <div className="  whitespace-nowrap ">
                      {option.display_name}
                    </div>
                  </div>
                )}
                onChange={(option) => {
                  const [lat, lon] = option.split(",").map((v) => v.trim());
                  if (option) {
                    field.onChange({
                      lat,
                      lon,
                    });
                  } else {
                    field.onChange("");
                  }
                }}
                value={`${field.value?.lat},${field.value?.lon}`}
                placeholder="Search location"
                label="Location"
                disabled={form.formState.isSubmitting}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
