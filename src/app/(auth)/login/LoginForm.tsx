"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { loginSchema, LoginValues } from "@/lib/validation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { login } from "../actions/loginAction";
import { cn } from "@/lib/utils";
import { PasswordInput } from "@/components/ui/password-input";
import LoadingButton from "@/components/LoadingButton";

export default function LoginForm() {
  const [error, setError] = useState<string>();

  const [isPending, startTransition] = useTransition();

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginValues) {
    setError(undefined);
    startTransition(async () => {
      const { error } = await login(values);
      if (error) setError(error);
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col mt-6 md:mt-10 space-y-0 md:max-w-[30rem] mx-auto w-full"
      >
        <div className="h-[5.5rem]">
          <FormField
            name="username"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Username"
                    {...field}
                    className={cn("!mt-1 border !border-border", {
                      "border !border-pink-500": form.formState.errors.username,
                    })}
                  />
                </FormControl>
                <FormMessage className="text-right !mt-1 text-xs font-normal" />
              </FormItem>
            )}
          />
        </div>

        <div className="h-[5.5rem]">
          <FormField
            name="password"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder="Password"
                    {...field}
                    className={cn("border !border-border", {
                      "border !border-pink-500": form.formState.errors.password,
                    })}
                  />
                </FormControl>
                <FormMessage className="text-right !mt-1 text-xs font-normal" />
              </FormItem>
            )}
          />
        </div>

        <div className="pt-10 relative">
          {error && (
            <div className="absolute left-0 top-3 text-center text-destructive text-sm">
              {error}
            </div>
          )}
          <LoadingButton
            loading={isPending}
            type="submit"
            className="flex w-full justify-center rounded-md px-3 py-2 text-foreground text-sm font-semibold shadow transition duration-300 bg-accent"
          >
            {isPending ? "Logging in..." : "Log in"}
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
}
