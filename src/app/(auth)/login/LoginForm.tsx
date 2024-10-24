"use client";

import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginValues } from "@/lib/validation";
import { useState, useTransition } from "react";
import { login } from "./actions";
import { PasswordInput } from "@/components/ui/password-input";
import LoadingButton from "@/components/ui/loader-button";

export default function LoginForm() {
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const [error, setError] = useState<string>();
  const [isPending, setTransition] = useTransition();

  async function onSubmit(values: LoginValues) {
    setError(undefined);
    setTransition(async () => {
      const { error } = await login(values);
      if (error) setError(error);
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        {error && <p className="text-center text-destructive">{error}</p>}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  id="username"
                  type="text"
                  placeholder="username"
                  required
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput
                  id="password"
                  type="password"
                  placeholder="password"
                  required
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton loading={isPending} type="submit" className="w-full">
          {isPending ? "Please wait..." : "Log In"}
        </LoadingButton>
      </form>
    </Form>
  );
}
