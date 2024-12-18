"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogHeader,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "~/components/ui/dialog";
import TryoutForm from "./TryoutForm";


export function TryoutMakerDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[90vw] md:max-w-[600px] p-4 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Buat Tryout</DialogTitle>
          <DialogDescription>Masukkan detail dibawah</DialogDescription>
        </DialogHeader>

        <TryoutForm />

      </DialogContent>
    </Dialog>
  );
}



