"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useClerk } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { redirect } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { keyIsCorrect } from "../actions/admin-request";

const formSchema = z.object({ password: z.string().min(1, "Required") });

export function FormAdminRequest() {
  const { isSignedIn, redirectToSignIn } = useClerk();
  const [isValidKey, setIsValidKey] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
  });

  if (isSignedIn) {
    redirect("/");
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { error, message } = await keyIsCorrect(values.password);
    toast({
      variant: error ? "destructive" : "default",
      description: message,
    });
    if (!error) {
      setIsValidKey(true);
    }
  };

  return (
    <div>
      {isValidKey ? (
        <Button
          className="text-lg font-bold"
          onClick={() => {
            if (!isSignedIn) redirectToSignIn();
          }}
        >
          Log in
        </Button>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex items-baseline gap-x-2"
          >
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Key"
                      className="neo-brutalist-input"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={form.formState.isSubmitting}>
              Enter
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}
