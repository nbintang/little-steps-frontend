import React from "react";
import { useFormContext } from "react-hook-form";
import { UserRegisterValues } from "../../schemas/register-schema";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";

export const UserRegister = () => {
  const form = useFormContext<UserRegisterValues>();
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </div>
      <div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="after:content-['*'] after:ml-1 after:text-red-500">
                Email
              </FormLabel>
              <FormControl>
                <Input
                  id="email"
                  placeholder="Masukkan Email"
                  type="email"
                  disabled={form.formState.isSubmitting}
                  {...field}
                />
              </FormControl>

              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel
              htmlFor="confirmPassword"
              className="after:content-['*'] after:ml-1 after:text-red-500"
            >
              Kata Sandi
            </FormLabel>
            <FormControl>
              <Input
                id="password"
                placeholder="********"
                type="password"
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
        name="confirmPassword"
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="confirmPassword">Konfirmasi Kata Sandi</FormLabel>
            <FormControl>
              <Input
                id="password"
                placeholder="********"
                type="password"
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
        name="acceptedTerms"
        render={({ field }) => (
          <FormItem className=" flex items-start gap-3 flex-row  rounded-md border p-3">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="grid gap-2">
              <FormLabel>Terima Syarat dan Ketentuan</FormLabel>
              <FormDescription>
                Dengan mendaftar, saya menyetujui
                <Link className="text-blue-500 hover:underline" href={"/terms"}>
                  {" "}
                  Syarat dan Ketentuan yang berlaku
                </Link>
                .
              </FormDescription>
              <FormMessage className="text-xs" />
            </div>
          </FormItem>
        )}
      />
    </>
  );
};
