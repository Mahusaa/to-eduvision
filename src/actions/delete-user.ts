'use server'
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { db } from "~/server/db"
import { userAnswer, users, userScore, userTime } from "~/server/db/schema"
import type { ActionResponse } from "~/types/delete-tryout"


export async function deleteUser(prevState: ActionResponse | null, id: string): Promise<ActionResponse> {
  try {

    await db.delete(userAnswer)
      .where(eq(userAnswer.userId, id))

    await db.delete(userScore)
      .where(eq(userScore.userId, id))


    await db.delete(userTime)
      .where(eq(userTime.userId, id))

    await db.delete(users)
      .where(eq(users.id, id))


    revalidatePath("/edit/users")


    return { success: true, message: `Item ${id} deleted successfully` }
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : 'An unknown error occurred' }
  }
}


