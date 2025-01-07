"use server"
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { db } from '~/server/db';
import { users } from '~/server/db/schema';
import type { BatchActionResponse } from '~/types/import-users';

const UserSchema = z.array(z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  role: z.enum(["user", "admin", "mulyono"]),
}));

export async function importUsers(
  prevState: BatchActionResponse,
  formData: FormData
): Promise<BatchActionResponse> {
  const file = formData.get('file') as File;
  if (!file) {
    return { success: false, message: 'No file uploaded' };
  }

  const fileContent = await file.text();
  const lines = fileContent.split('\n');

  try {
    const rawUsers = lines.slice(1).filter(line => line.trim() !== '').map((line) => {
      const [email, name, role] = line.split(',');
      return {
        email: email!.trim(),
        name: name!.trim(),
        role: role!.trim()
      };
    });

    const validatedUsers = UserSchema.parse(rawUsers);
    const newUsers = validatedUsers.map(user => ({
      ...user,
      password: "$2y$10$CmLZbqDQrYS6WdT.CcziaOY89bJT598wGAD9WmoF.JAEV9PfwP5oq",
    }));

    await db.insert(users).values(newUsers);
    revalidatePath("/edit/users");

    return { success: true, message: "Successfully uploaded new user" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.errors.map(err => {
        const path = err.path.join('.');
        return `${path}: ${err.message}`;
      });

      return { success: false, message: `Validation errors: ${formattedErrors.join(', ')}` };
    }
    return { success: false, message: 'An unexpected error occurred' };
  }
}

