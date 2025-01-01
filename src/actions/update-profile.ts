'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const ProfileSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email address"),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(8, "New password must be at least 8 characters long").optional(),
  confirmPassword: z.string().optional(),
})
  .refine((data) => {
    if (data.newPassword && !data.currentPassword) {
      return false
    }
    return true
  }, {
    message: "Current password is required to set a new password",
    path: ["currentPassword"],
  })
  .refine((data) => {
    if (data.newPassword && data.newPassword !== data.confirmPassword) {
      return false
    }
    return true
  }, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

type ProfileState = z.infer<typeof ProfileSchema> & {
  message: string | null;
  error?: string | null;
}

export async function updateProfile(prevState: ProfileState, formData: FormData): Promise<ProfileState> {
  const result = ProfileSchema.safeParse(Object.fromEntries(formData))

  if (!result.success) {
    return {
      ...prevState,
      error: result.error.issues[0]?.message,
      message: null
    }
  }

  const { id, name, email, currentPassword, newPassword } = result.data

  // Simulate a delay to mimic a database operation
  await new Promise(resolve => setTimeout(resolve, 1000))
  console.log(id, name, email, currentPassword, newPassword, "in server")

  // Here you would typically validate the current password and update the user's profile in your database
  // For this example, we'll just simulate the update

  // Revalidate the profile page to reflect the changes
  revalidatePath('/profile')

  return {
    id,
    name,
    email,
    message: 'Profile updated successfully!',
    error: "",
  }
}


