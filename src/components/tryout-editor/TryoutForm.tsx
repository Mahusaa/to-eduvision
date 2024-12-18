"use client"
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";
import { Progress } from "~/components/ui/progress";
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { z } from "zod";

// Duration and total for each subtest
const subtestFields = [
  { name: "Penalaran Umum", code: "pu" },
  { name: "Penalaran Matematika", code: "pm" },
  { name: "Kemampuan Memahami Bacaan dan Menulis", code: "pbm" },
  { name: "Pengetahuan dan Pemahaman Umum", code: "ppu" },
  { name: "Kemampuan Kuantitatif", code: "kk" },
  { name: "Literasi Bahasa Indonesia", code: "lbin" },
  { name: "Literasi Bahasa Inggris", code: "lbing" },
];

// Zod schema for validation
const tryoutSchema = z.object({
  tryoutName: z.string().min(1, "Nama Tryout Wajib Diisi"),
  tryoutEnd: z.date().min(new Date(2024 - 12 - 12), "Tryout Berakhir Wajib Diisi"),
  tryoutNumber: z.number().min(1, "Tryout Number must be at least 1"),
  subtestData: z.object(
    subtestFields.reduce((acc, field) => {
      acc[field.code] = z.object({
        duration: z.number().min(1, `${field.name} Durasi wajib diisi`),
        total: z.number().min(1, `${field.name} Total soal wajib diisi`),
      });
      return acc;
    }, {} as Record<string, z.ZodObject<{ duration: z.ZodNumber; total: z.ZodNumber }>>)
  ),
});


export default function TryoutForm({ className }: React.ComponentProps<`form`>) {
  const [step, setStep] = useState(1);
  const [tryoutName, setTryoutName] = useState<string>("");
  const [tryoutEnd, setTryoutEnd] = useState<string>("");
  const [tryoutNumber, setTryoutNumber] = useState<number>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [subtestData, setSubtestData] = useState(
    subtestFields.reduce((acc, field) => {
      acc[field.code] = { duration: "", total: "" };
      return acc;
    }, {} as Record<string, { duration: string; total: string }>)
  );

  const validateStep = (currentStep: number) => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!tryoutName.trim()) newErrors.tryoutName = "Nama Tryout Wajib Diisi";
      if (!tryoutEnd) newErrors.tryoutEnd = "Tryout Berakhir Wajib Diisi";
      if (!tryoutNumber || tryoutNumber < 1) newErrors.tryoutNumber = "Tryout Number must be at least 1";
    } else if (currentStep === 2) {
      subtestFields.forEach((field) => {
        if (!subtestData[field.code]?.duration) {
          newErrors[`${field.code}-duration`] = `${field.name} Durasi wajib diisi`;
        }
        if (!subtestData[field.code]?.total) {
          newErrors[`${field.code}-total`] = `${field.name} Total soal wajib diisi`;
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const parsedTryoutEnd = new Date(tryoutEnd);

    // Convert subtestData's duration and total to numbers
    const parsedSubtestData = Object.fromEntries(
      Object.entries(subtestData).map(([code, data]) => [
        code,
        {
          duration: Number(data.duration),
          total: Number(data.total),
        },
      ])
    );

    const tryoutData = {
      tryoutName,
      tryoutEnd: parsedTryoutEnd,
      tryoutNumber,
      subtestData: parsedSubtestData,
    }


    try {
      tryoutSchema.parse({
        tryoutName,
        tryoutEnd: parsedTryoutEnd,
        tryoutNumber,
        subtestData: parsedSubtestData,
      })

      const response = await fetch("/api/create-tryout", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tryoutData),
      })
      if (response.ok) {
        const result = await response.json() as { message: string};
        console.log('Tryout created successfully:', result);
        alert('Tryout created successfully!');
      } else {
        const error = await response.json() as {message: string};
        console.error('Error:', error.message);
        alert('Failed to create tryout!');
      }

    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error(error.errors)
      }
    }

  };

  const handleSubtestChange = (
    code: string,
    field: "duration" | "total",
    value: string
  ) => {
    setSubtestData((prev) => ({
      ...prev,
      [code]: {
        // Ensure that both fields are always strings
        duration: prev[code]?.duration ?? "", // Default to empty string if undefined
        total: prev[code]?.total ?? "",       // Default to empty string if undefined
        [field]: value,                       // Update the specific field
      },
    }));
  };


  return (
    <form className={cn("grid items-start gap-4", className)} >
      <Progress value={(step / 3) * 100} className="w-full" />
      {step === 1 && (
        <div className="space-y-3">
          <div>
            <Label htmlFor="tryoutName">Nama Tryout</Label>
            <Input
              type="text"
              id="tryoutName"
              placeholder="Masukkan Nama Tryout"
              value={tryoutName}
              onChange={(e) => setTryoutName(e.target.value)}
              required
            />
            {errors.tryoutName && (
              <p className="text-xs text-red-500 mt-1">{errors.tryoutName}</p>
            )}
          </div>
          <div>
            <Label htmlFor="tryoutEnd">Tryout End Date</Label>
            <Input
              type="date"
              id="tryoutEnd"
              value={tryoutEnd}
              onChange={(e) => setTryoutEnd(e.target.value)}
              required
            />
            {errors.tryoutEnd && (
              <p className="text-xs text-red-500 mt-1">{errors.tryoutEnd}</p>
            )}
          </div>
          <div>
            <Label htmlFor="tryoutNumber">Tryout Number</Label>
            <Input
              type="number"
              id="tryoutNumber"
              value={tryoutNumber}
              onChange={(e) => setTryoutNumber(Number(e.target.value))}
              min={1}
              required
            />
            {errors.tryoutNumber && (
              <p className="text-xs text-red-500 mt-1">{errors.tryoutNumber}</p>
            )}
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
                  value={subtestData[field.code]?.duration}
                  onChange={(e) =>
                    handleSubtestChange(field.code, "duration", e.target.value)
                  }
                  required
                  className="mt-1"
                />
                {errors[`${field.code}-duration`] && (
                  <p className="text-xs text-red-500 mt-1">{errors[`${field.code}-duration`]}</p>
                )}
              </div>
              <div>
                <Label htmlFor={`${field.code}-total`} className="text-sm">
                  {field.name} Jumlah Soal
                </Label>
                <Input
                  type="number"
                  id={`${field.code}-total`}
                  placeholder="Total"
                  value={subtestData[field.code]?.total}
                  onChange={(e) =>
                    handleSubtestChange(field.code, "total", e.target.value)
                  }
                  required
                  className="mt-1"
                />
                {errors[`${field.code}-total`] && (
                  <p className="text-xs text-red-500 mt-1">{errors[`${field.code}-total`]}</p>
                )}
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
            <p>Name: {tryoutName}</p>
            <p>End Date: {tryoutEnd}</p>
            <p>Number: {tryoutNumber}</p>
          </div>
          <div className="text-sm">
            <h4 className="font-semibold">Subtest Details</h4>
            {subtestFields.map((field) => (
              <p key={field.code}>
                {field.name}: {subtestData[field.code]?.duration} min, {subtestData[field.code]?.total} questions
              </p>
            ))}
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

        {step < 3 ? (
          <Button
            type="button"
            onClick={handleNext}
            className="w-auto"
          >
            Next
          </Button>
        ) : (
          <Button
            type="button"
            className="bg-green-600 hover:bg-green-700 w-auto"
            onClick={handleSubmit}
          >
            Create Tryout
          </Button>
        )}
      </div>
    </form>
  )
}


