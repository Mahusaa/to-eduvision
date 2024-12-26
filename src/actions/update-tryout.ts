'use server'

import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod'
import { db } from '~/server/db';
import { tryouts } from '~/server/db/schema';
import type { ActionResponse, UpdateTryoutFormData } from '~/types/update-tryout'


const updateSchema = z.object({
  tryoutId: z.number().min(1, "tryoutId must have at least 1 character"),
  name: z.string().nonempty("Name is required"),
  endedAt: z.date(),
  status: z.enum(["closed", "open", "completed"]),
});
enum StatusEnum {
  CLOSED = "closed",
  OPEN = "open",
  COMPLETED = "completed",
}


export async function updateTryout(prevState: ActionResponse | null, formData: FormData): Promise<ActionResponse> {

  try {
    const rawData: UpdateTryoutFormData = {
      tryoutId: Number(formData.get("tryoutId")) || 0,
      name: formData.get('tryoutName') as string,
      endedAt: new Date(formData.get("date") as string || "1970-01-01"),
      status: (() => {
        const statusValue = formData.get("status");
        if (
          statusValue === StatusEnum.CLOSED ||
          statusValue === StatusEnum.OPEN ||
          statusValue === StatusEnum.COMPLETED
        ) {
          return statusValue;
        }
        throw new Error("Invalid status value");
      })(),
    }


    const validatedData = updateSchema.safeParse(rawData)

    if (!validatedData.success) {
      return {
        success: false,
        message: 'Please fix the errors in the form',
        errors: validatedData.error.flatten().fieldErrors,
      }
    }
    await db.update(tryouts)
      .set({
        name: validatedData.data.name,
        endedAt: validatedData.data.endedAt,
        status: validatedData.data.status,
      })
      .where(eq(tryouts.id, validatedData.data.tryoutId))

    revalidatePath("/edit/tryout")


    return {
      success: true,
      message: 'Tryout updated successfully!',
    }
  } catch (error) {
    return {
      success: false,
      message: 'An unexpected error occurred',
    }
  }
}


