'use server'
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { db } from "~/server/db"
import { users } from "~/server/db/schema"
import type { ActionResponse } from "~/types/delete-tryout"


export async function resetUserPass(prevState: ActionResponse | null, id: string): Promise<ActionResponse> {
  const pass = "$2y$04$o3SATkNJpj0pCInoWJs00OjHmbpxQ0YLxfCD58ANzzv0B7/DucgDy"
  try {
    await db.update(users)
      .set({
        password: pass,
      })
      .where(eq(users.id, id))

    revalidatePath("/edit/users")


    return { success: true, message: `user ${id} password reset successfully` }
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : 'An unknown error occurred' }
  }
}


