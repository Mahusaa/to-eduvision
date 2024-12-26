'use server'

import { z } from 'zod'
import type { ActionResponse, TryoutFormData } from '~/types/create-tryout';

const subtestFields = [
  { name: "Penalaran Umum", code: "pu" },
  { name: "Penalaran Matematika", code: "pm" },
  { name: "Kemampuan Memahami Bacaan dan Menulis", code: "pbm" },
  { name: "Pengetahuan dan Pemahaman Umum", code: "ppu" },
  { name: "Kemampuan Kuantitatif", code: "kk" },
  { name: "Literasi Bahasa Indonesia", code: "lbind" },
  { name: "Literasi Bahasa Inggris", code: "lbing" },
];



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

export async function createTryout(prevState: ActionResponse | null, formData: FormData): Promise<ActionResponse> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log(formData.get("tryoutName"), "should be work")

  try {
    const rawData: TryoutFormData = {
      tryoutName: formData.get("tryoutName") as string,
      tryoutEnd:
        typeof formData.get("tryoutEnd") === "string" && formData.get("tryoutEnd")
          ? new Date(formData.get("tryoutEnd") as string)
          : new Date(),
      tryoutNumber: formData.get("tryoutNumber") ? Number(formData.get("tryoutNumber")) : 0,
      subtestData: subtestFields.reduce((acc, field) => {
        acc[field.code] = {
          duration: formData.get(`${field.code}-duration`)
            ? Number(formData.get(`${field.code}-duration`))
            : 0, // Default to 0 if missing
          total: formData.get(`${field.code}-total`)
            ? Number(formData.get(`${field.code}-total`))
            : 0, // Default to 0 if missing
        };
        return acc;
      }, {} as Record<string, { duration: number; total: number }>),
    };

    // Log the raw data before validation
    console.log("Raw data before validation:", rawData);

    const validatedData = tryoutSchema.safeParse(rawData);

    // Log the validation results
    console.log("Validation result:", validatedData);

    if (!validatedData.success) {
      const errors = Object.entries(validatedData.error.flatten().fieldErrors).reduce(
        (acc, [key, value]) => {
          if (Array.isArray(value)) {
            acc[key as keyof TryoutFormData] = value.join(", ");
          }
          return acc;
        },
        {} as Partial<Record<keyof TryoutFormData, string | Record<string, string>>>
      );

      console.log("Validation errors:", errors);

      return {
        success: false,
        message: "Validation failed.",
        errors,
      };
    }

    console.log("Validated data:", validatedData.data);

    return {
      success: true,
      message: "Validation successful.",
    };
  } catch (error) {
    console.error("An unexpected error occurred:", error);

    return {
      success: false,
      message: "An unexpected error occurred",
    };
  }
}
