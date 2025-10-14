"use client";

import { useMemo, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parseISO, isValid } from "date-fns";

import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSet,
  FieldContent,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  CalendarIcon,
  LinkIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const schema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  bio: z.string().max(280, "Bio must be 280 characters or less"),
  birthDate: z.string().refine((val) => {
    const d = parseISO(val);
    return val && isValid(d) && d <= new Date();
  }, "Please select a valid birth date"),
  avatarUrl: z.url("Please enter a valid URL"),
  location: z.string().min(2, "Location is required"),
  phone: z.string().regex(/^\+?[0-9\-() ]{7,}$/, "Enter a valid phone number"),
  createdAt: z.string(),
  user: z.object({
    name: z.string(),
    email: z.email(),
  }),
});

type Profile = z.infer<typeof schema>;

const dummyData: Profile = {
  fullName: "John Doe",
  bio: "I'm a software developer",
  birthDate: "1990-01-01",
  avatarUrl: "/placeholder-user.jpg",
  location: "New York, USA",
  phone: "+1 (123) 456-7890",
  createdAt: new Date().toISOString(),
  user: {
    name: "John Doe",
    email: "aL2oE@example.com",
  },
};

export default function SettingAccount() {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: dummyData,
  });

  const values = form.watch();
  const avatarPreview = values.avatarUrl?.trim()
    ? values.avatarUrl
    : "/placeholder-user.jpg";

  const birthDateAsDate = useMemo(() => {
    try {
      const d = parseISO(values.birthDate ?? "");
      return isValid(d) ? d : undefined;
    } catch {
      return undefined;
    }
  }, [values.birthDate]);

  const [openDOB, setOpenDOB] = useState(false);

  const onSubmit = async (data: z.infer<typeof schema>) => {
    await new Promise((r) => setTimeout(r, 600));
    toast("Profile updated successfully!");
    // console.log to help debugging in v0 preview
    console.log("[v0] Submitted Profile:", data);
  };

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="size-16">
            <AvatarImage
              src={avatarPreview || "/placeholder.svg"}
              alt="Profile avatar preview"
            />
            <AvatarFallback>AJ</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-pretty text-xl font-semibold">
              {values.fullName || "Your Name"}
            </h1>
            <p className="text-muted-foreground text-sm">
              {values.user.email} • Joined{" "}
              {format(parseISO(values.createdAt), "LLL d, yyyy")}
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => form.reset(dummyData)}
          className="w-full md:w-auto"
        >
          Reset to dummy data
        </Button>
      </section>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-10"
        >
          <FieldGroup className="rounded-lg border p-4 md:p-6">
            <FieldLegend>Profile details</FieldLegend>
            <FieldSet>
              {/* Full Name */}
              <FormField
                control={form.control}
                name="fullName"
                render={({ field, fieldState }) => (
                  <Field data-invalid={!!fieldState.error}>
                    <FieldLabel htmlFor="fullName">
                      <UserIcon className="size-4 text-muted-foreground" />
                      Full name
                    </FieldLabel>
                    <FieldContent>
                      <FormItem>
                        <FormControl>
                          <Input
                            id="fullName"
                            placeholder="Your full name"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Use your real name so people can recognize you.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    </FieldContent>
                  </Field>
                )}
              />

              {/* Bio */}
              <FormField
                control={form.control}
                name="bio"
                render={({ field, fieldState }) => (
                  <Field data-invalid={!!fieldState.error}>
                    <FieldLabel htmlFor="bio">Bio</FieldLabel>
                    <FieldContent>
                      <FormItem>
                        <FormControl>
                          <Textarea
                            id="bio"
                            placeholder="Tell others a bit about yourself..."
                            rows={5}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>Max 280 characters.</FormDescription>
                        <div className="text-muted-foreground mt-1 text-xs">
                          {field.value?.length || 0}/280
                        </div>
                        <FormMessage />
                      </FormItem>
                    </FieldContent>
                  </Field>
                )}
              />

              {/* Avatar URL */}
              <FormField
                control={form.control}
                name="avatarUrl"
                render={({ field, fieldState }) => (
                  <Field data-invalid={!!fieldState.error}>
                    <FieldLabel htmlFor="avatarUrl">
                      <LinkIcon className="size-4 text-muted-foreground" />
                      Avatar URL
                    </FieldLabel>
                    <FieldContent>
                      <FormItem>
                        <FormControl>
                          <Input
                            id="avatarUrl"
                            placeholder="https://..."
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Paste a link to your profile picture.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    </FieldContent>
                  </Field>
                )}
              />
            </FieldSet>
          </FieldGroup>

          <FieldGroup className="rounded-lg border p-4 md:p-6">
            <FieldLegend>Contact & personal info</FieldLegend>
            <FieldSet>
              {/* Birth Date */}
              <FormField
                control={form.control}
                name="birthDate"
                render={({ field, fieldState }) => (
                  <Field data-invalid={!!fieldState.error}>
                    <FieldLabel>Birth date</FieldLabel>
                    <FieldContent>
                      <FormItem>
                        <Popover open={openDOB} onOpenChange={setOpenDOB}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              type="button"
                              className={cn(
                                "w-full justify-start font-normal",
                                !birthDateAsDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 size-4" />
                              {birthDateAsDate
                                ? format(birthDateAsDate, "PPP")
                                : "Pick a date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent align="start" className="p-0">
                            <Calendar
                              mode="single"
                              selected={birthDateAsDate}
                              onSelect={(d) => {
                                if (d) {
                                  const iso = new Date(
                                    Date.UTC(
                                      d.getFullYear(),
                                      d.getMonth(),
                                      d.getDate()
                                    )
                                  )
                                    .toISOString()
                                    .slice(0, 10);
                                  field.onChange(iso);
                                }
                                setOpenDOB(false);
                              }}
                              captionLayout="dropdown"
                              fromYear={1950}
                              toYear={new Date().getFullYear()}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormDescription>
                          Your date of birth won’t be public.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    </FieldContent>
                  </Field>
                )}
              />

              {/* Location */}
              <FormField
                control={form.control}
                name="location"
                render={({ field, fieldState }) => (
                  <Field data-invalid={!!fieldState.error}>
                    <FieldLabel htmlFor="location">
                      <MapPinIcon className="size-4 text-muted-foreground" />
                      Location
                    </FieldLabel>
                    <FieldContent>
                      <FormItem>
                        <FormControl>
                          <Input
                            id="location"
                            placeholder="City, Country"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>Where are you based?</FormDescription>
                        <FormMessage />
                      </FormItem>
                    </FieldContent>
                  </Field>
                )}
              />

              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field, fieldState }) => (
                  <Field data-invalid={!!fieldState.error}>
                    <FieldLabel htmlFor="phone">
                      <PhoneIcon className="size-4 text-muted-foreground" />
                      Phone
                    </FieldLabel>
                    <FieldContent>
                      <FormItem>
                        <FormControl>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="+1 (555) 000-0000"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Optional. Include country code.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    </FieldContent>
                  </Field>
                )}
              />
            </FieldSet>
          </FieldGroup>

          <FieldSeparator>System</FieldSeparator>

          <FieldGroup className="rounded-lg border p-4 md:p-6">
            <FieldLegend variant="label">User metadata</FieldLegend>
            <FieldSet>
              <Field>
                <FieldLabel>User name</FieldLabel>
                <FieldContent>
                  <div className="text-sm rounded-md border bg-secondary/40 px-3 py-2">
                    {values.user.name}
                  </div>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>Email</FieldLabel>
                <FieldContent>
                  <div className="text-sm rounded-md border bg-secondary/40 px-3 py-2">
                    {values.user.email}
                  </div>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>Created at</FieldLabel>
                <FieldContent>
                  <div className="text-sm rounded-md border bg-secondary/40 px-3 py-2">
                    {format(parseISO(values.createdAt), "PPpp")}
                  </div>
                </FieldContent>
              </Field>
            </FieldSet>
          </FieldGroup>

          {form.formState.isDirty && (
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
              <Button
                type="button"
                variant="ghost"
                onClick={() => form.reset()}
              >
                Cancel
              </Button>
              <Button type="submit">Save changes</Button>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
