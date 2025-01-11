'use server'

import { revalidatePath } from 'next/cache';
import { z } from 'zod'
import { db } from '~/server/db';
import { users } from '~/server/db/schema';
import { type ActionResponse, type CreateUserFormData } from '~/types/create-user';


const updateSchema = z.object({
  name: z.string().nonempty("Name is required"),
  email: z.string().nonempty("Email is required"),
  role: z.enum(["user", "admin", "mulyono"]),
});
enum RoleEnum {
  USER = "user",
  ADMIN = "admin",
  MULYONO = "mulyono",
}


export async function createUser(prevState: ActionResponse | null, formData: FormData): Promise<ActionResponse> {
  try {
    const rawData: CreateUserFormData = {
      name: formData.get('userName') as string,
      email: formData.get('email') as string,
      role: (() => {
        const statusValue = formData.get("role");
        if (
          statusValue === RoleEnum.USER ||
          statusValue === RoleEnum.ADMIN ||
          statusValue === RoleEnum.MULYONO
        ) {
          return statusValue;
        }
        throw new Error("Invalid role value");
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

    await db.insert(users).values({
      name: validatedData.data.name,
      email: validatedData.data.email,
      role: validatedData.data.role,
      password: "$2y$10$CmLZbqDQrYS6WdT.CcziaOY89bJT598wGAD9WmoF.JAEV9PfwP5oq"
    })

    revalidatePath("/edit/users")


    return {
      success: true,
      message: 'Create user successfully!',
    }
  } catch (error) {
    return {
      success: false,
      message: 'An unexpected error occurred',
    }
  }
}


