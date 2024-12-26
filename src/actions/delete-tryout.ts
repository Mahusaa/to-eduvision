'use server'
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { db } from "~/server/db"
import { answerKey, questions, tryouts, userAnswer, userTime } from "~/server/db/schema"
import type { ActionResponse } from "~/types/delete-tryout"


export async function deleteTryout(prevState: ActionResponse | null, id: number): Promise<ActionResponse> {
  try {

    await db.delete(answerKey)
      .where(eq(answerKey.tryoutId, id))

    await db.delete(userAnswer)
      .where(eq(userAnswer.tryoutId, id))

    await db.delete(questions)
      .where(eq(questions.tryoutId, id))

    await db.delete(userTime)
      .where(eq(userTime.tryoutId, id))

    await db.delete(tryouts)
      .where(eq(tryouts.id, id))


    revalidatePath("/edit/tryout")


    return { success: true, message: `Item ${id} deleted successfully` }
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : 'An unknown error occurred' }
  }
}

