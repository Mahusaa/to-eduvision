'use server'
import { db } from '~/server/db';
import { userTime } from '~/server/db/schema';
import { eq } from 'drizzle-orm';

import { revalidatePath } from 'next/cache'
import { z } from "zod";

interface ActionResponse {
  success: boolean;
  message: string;
}

const addTimeSchema = z.object({
  id: z.number().int().positive(), // Assuming id is a UUID
  field: z.enum([
    "tryoutEnd",
    "puEnd",
    "pbmEnd",
    "ppuEnd",
    "kkEnd",
    "lbindEnd",
    "lbingEnd",
    "pmEnd",
  ]),
  minutes: z.number().int().positive(),
  tryoutEnd: z
    .string()
    .nullable()
    .transform((value) => (value ? new Date(value) : null)),
});

export async function addTime(prevState: ActionResponse | null, formData: FormData): Promise<ActionResponse> {
  try {
    const data = addTimeSchema.parse({
      id: parseInt(formData.get("id") as string),
      field: formData.get("field"),
      minutes: parseInt(formData.get("minutes") as string, 10),
      tryoutEnd: formData.get("tryoutEnd"),
    });

    const { id, field, minutes } = data;

    const currentTime = new Date();

    const newTime = new Date(currentTime.getTime() + minutes * 60000);

    if (field === "tryoutEnd") {
      await db
        .update(userTime)
        .set({ tryoutEnd: newTime }) // Dynamically update the specified field
        .where(eq(userTime.id, id));
    } else {
      await db
        .update(userTime)
        .set({ [field]: newTime }) // Dynamically update the specified field
        .where(eq(userTime.id, id));
    }


    revalidatePath("/");

    return { success: true, message: `Added ${minutes} minutes to ${field}.` };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: `Validation failed: ${error.message}` };
    }
    console.error("Database update error:", error);
    return { success: false, message: "An error occurred while adding time." };
  }
}


