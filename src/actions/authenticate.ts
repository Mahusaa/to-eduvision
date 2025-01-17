'use server';

import { AuthError } from 'next-auth';
import { signIn } from '~/server/auth';

// ...

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Email atau Password salah';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}
