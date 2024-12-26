"use client";

import { useActionState } from "react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";
import { Progress } from "~/components/ui/progress";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import type { ActionResponse } from "~/types/create-tryout";
import { createTryout } from "~/actions/create-tryout";

const subtestFields = [
  { name: "Penalaran Umum", code: "pu" },
  { name: "Penalaran Matematika", code: "pm" },
  { name: "Kemampuan Memahami Bacaan dan Menulis", code: "pbm" },
  { name: "Pengetahuan dan Pemahaman Umum", code: "ppu" },
  { name: "Kemampuan Kuantitatif", code: "kk" },
  { name: "Literasi Bahasa Indonesia", code: "lbind" },
  { name: "Literasi Bahasa Inggris", code: "lbing" },
];

const initialState: ActionResponse = {
  success: false,
  message: "",
};

export default function TryoutForms({ className }: React.ComponentProps<"form">) {
  const [step, setStep] = useState(1);
  const [state, action, isPending] = useActionState(createTryout, initialState);

  const validateStep = (currentStep: number) => {
    // Add validation logic for each step
    return true; // Temporarily allow all steps
  };

  const handleNext = () => {
    if (validateStep(step)) {
      if (step < 3) {
        setStep((prevStep) => prevStep + 1);
      }
    }
  };

  const handleBack = () => {
    setStep((prevStep) => prevStep - 1);
  };

  return (
    <form action={action} className={cn("grid items-start gap-4", className)}>
      <Progress value={(step / 3) * 100} className="w-full" />

      {step === 1 && (
        <div className="space-y-3">
          <div>
            <Label htmlFor="tryoutName">Nama Tryout</Label>
            <Input
              type="text"
              id="tryoutName"
              name="tryoutName"
              placeholder="Masukkan Nama Tryout"
              required
            />
          </div>
          <div>
            <Label htmlFor="tryoutEnd">Tryout End Date</Label>
            <Input
              type="date"
              id="tryoutEnd"
              name="tryoutEnd"
              required />
          </div>
          <div>
            <Label htmlFor="tryoutNumber">Tryout Number</Label>
            <Input type="number" id="tryoutNumber" min={1} required />
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Detail Subtest</h3>
          {subtestFields.map((field) => (
            <div key={field.code} className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor={`${field.code}-duration`} className="text-sm">
                  {field.name} Durasi (min)
                </Label>
                <Input
                  type="number"
                  id={`${field.code}-duration`}
                  placeholder="Durasi"
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor={`${field.code}-total`} className="text-sm">
                  {field.name} Jumlah Soal
                </Label>
                <Input
                  type="number"
                  id={`${field.code}-total`}
                  placeholder="Total"
                  required
                  className="mt-1"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {step === 3 && (
        <div className="space-y-3">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Confirmation</AlertTitle>
            <AlertDescription className="text-sm">
              Please review your tryout details before submitting.
            </AlertDescription>
          </Alert>
          <div className="text-sm">
            <h4 className="font-semibold">Tryout Information</h4>
            <p>Name: Tryout Akbar</p>
            <p>End Date: 2029</p>
            <p>Number: 5</p>
          </div>
        </div>
      )}

      <div className="flex justify-end items-center gap-4 mt-6">
        {step > 1 && (
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            className="w-auto"
          >
            Back
          </Button>
        )}

        {step < 3 && (
          <Button type="button" onClick={handleNext} className="w-auto">
            Next
          </Button>
        )}
        {step === 3 && (
          <Button
            type="submit"
            className="bg-green-600 hover:bg-green-700 w-auto"
          >
            Create Tryout
          </Button>
        )}
      </div>
    </form>
  );
}

