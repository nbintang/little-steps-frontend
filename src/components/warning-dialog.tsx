"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useShallow } from "zustand/shallow";
import { Button } from "./ui/button";
import { useDisplayWarningDialog } from "@/hooks/use-display-warning-dialog";

export default function WarningDialog() {
  const {
    isOpen,
    setOpenDialog,
    title,
    description,
    onConfirm,
    buttonVariants,
  } = useDisplayWarningDialog(
    useShallow((state) => ({
      isOpen: state.isOpen,
      setOpenDialog: state.setOpenDialog,
      title: state.title,
      description: state.description,
      onConfirm: state.onConfirm,
      buttonVariants: state.buttonVariants,
    }))
  );
  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(isOpen) => {
        setOpenDialog({
          isOpen,
          title,
          description,
          onConfirm,
          buttonVariants,
        });
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button variant={buttonVariants || "destructive"} onClick={onConfirm}>
            Continue
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
