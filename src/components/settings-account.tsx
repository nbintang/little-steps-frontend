"use client";

import { useEffect, useMemo, useState } from "react";
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
  Trash2,
  UserIcon,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ProfileAPI, ProfileDetailAPIWithLocation } from "@/types/profile";
import { AvatarUploader } from "./form-components/avatar-uploader";
import { DatePickerField } from "./form-components/date-picker-field";
import { AsyncSelectField } from "./form-components/async-select-field";
import { searchLocationService } from "@/services/search-location-service";
import { usePatch } from "@/hooks/use-patch";
import useImageUploader from "@/hooks/use-image-uploader";

const schema = z.object({
  fullName: z.string().min(8, "Full name must be at least 8 characters"),
  bio: z.string().max(280, "Bio must be 280 characters or less"),
  birthDate: z.date().max(new Date(), "Birth date cannot be in the future"),
  avatarUrl: z.url("Please enter a valid URL").optional(),
  location: z.string().optional(),
  phone: z
    .string()
    .regex(
      /^\+?\d{10,15}$/,
      "Phone harus berupa angka 10-15 digit, bisa diawali +"
    ),
});

type ProfileFormValues = z.infer<typeof schema>;

export default function SettingsAccount({
  profile,
}: {
  profile: ProfileDetailAPIWithLocation;
}) {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      bio: "",
      birthDate: new Date(),
      avatarUrl: "",
      location: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        fullName: profile.fullName,
        bio: profile.bio,
        birthDate: parseISO(format(profile.birthDate, "yyyy-MM-dd")),
        avatarUrl: profile.avatarUrl,
        location: profile.location ?? "",
        phone: profile.phone,
      });
    }
  }, [profile, form]);

  const values = form.watch();
  const { mutateAsync: uploadImage } = useImageUploader();
  const { mutate: updateProfile, isPending } = usePatch<ProfileAPI>({
    endpoint: "profile/me",
    keys: "profile",
  });
  const onSubmit = async (data: ProfileFormValues) => {
    // ubah location jadi latitude & longitude, tapi jangan kirim field location
    let latitude: number | undefined = undefined;
    let longitude: number | undefined = undefined;

    if (data.location) {
      const [lat, lon] = data.location.split(",").map((v) => v.trim());
      latitude = parseFloat(lat);
      longitude = parseFloat(lon);
    }

    // handle avatar upload
    let avatarUrl = data.avatarUrl;
    if (avatarUrl) {
      const imageResponse = await uploadImage(avatarUrl);
      avatarUrl = imageResponse.data?.secureUrl ?? avatarUrl;
    }

    // kirim ke backend
    updateProfile({
      fullName: data.fullName,
      bio: data.bio,
      birthDate: data.birthDate,
      phone: data.phone,
      avatarUrl,
      name: data.fullName,
      ...(latitude && longitude ? { latitude, longitude } : {}),
    });
  };
  return (
    <div className="flex flex-col gap-8">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-7"
        >
          <AvatarUploader<ProfileFormValues> name="avatarUrl" label="Avatar" />
          {values.avatarUrl && (
            <div className="flex justify-end">
              <Button
                type="button"
                size={"icon"}
                variant={"destructive"}
                onClick={() => {
                  form.setValue("avatarUrl", undefined);
                }}
                disabled={!values.avatarUrl}
              >
                <Trash2 />
              </Button>
            </div>
          )}
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
            </FieldSet>
          </FieldGroup>

          <FieldGroup className="rounded-lg border p-4 md:p-6">
            <FieldLegend>Contact & personal info</FieldLegend>
            <FieldSet>
              <DatePickerField<ProfileFormValues>
                name="birthDate"
                label="Birth date"
              />
              <AsyncSelectField<ProfileFormValues, LocationResponse>
                name="location"
                label="Location"
                description="Search your location"
                placeholder="Search location"
                fetcher={searchLocationService}
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
              />
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
          {form.formState.isDirty && (
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
              <Button
                type="button"
                variant="ghost"
                onClick={() => form.reset()}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting || isPending}
              >
                {form.formState.isSubmitting || isPending
                  ? "Saving..."
                  : "Save changes"}
              </Button>
            </div>
          )}
          <FieldSeparator>System</FieldSeparator>

          <FieldGroup className="rounded-lg border p-4 md:p-6">
            <FieldLegend variant="label">User metadata</FieldLegend>
            <FieldSet>
              <Field>
                <FieldLabel>User name</FieldLabel>
                <FieldContent>
                  <div className="text-sm rounded-md border bg-secondary/40 px-3 py-2">
                    {profile.user.name}
                  </div>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>Email</FieldLabel>
                <FieldContent>
                  <div className="text-sm rounded-md border bg-secondary/40 px-3 py-2">
                    {profile.user.email}
                  </div>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>Created at</FieldLabel>
                <FieldContent>
                  <div className="text-sm rounded-md border bg-secondary/40 px-3 py-2">
                    {profile.createdAt
                      ? format(
                          parseISO(profile.createdAt.toString()),
                          "LLL d, yyyy"
                        )
                      : "Unknown date"}
                  </div>
                </FieldContent>
              </Field>
            </FieldSet>
          </FieldGroup>
        </form>
      </Form>
    </div>
  );
}
