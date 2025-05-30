"use client";

import { ComponentPropsWithoutRef, ReactNode, useTransition } from "react";
import { Button } from "./ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { actionToast } from "@/hooks/use-toast";

interface DeleteActionButtonProps
  extends Omit<ComponentPropsWithoutRef<typeof Button>, "onClick"> {
  action: () => Promise<{ error: boolean; message: string }>;
  children: ReactNode;
  confirmPopup?: boolean;
}

export function DeleteActionButton({
  action,
  children,
  confirmPopup = false,
  ...props
}: DeleteActionButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      const data = await action();
      actionToast({ responseAction: data });
    });
  };

  if (confirmPopup) {
    return (
      <AlertDialog open={isPending ? true : undefined}>
        <AlertDialogTrigger asChild>
          <Button {...props}>{children}</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleClick} disabled={isPending}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <Button {...props} onClick={handleClick} variant="default">
      {children}
    </Button>
  );
}
