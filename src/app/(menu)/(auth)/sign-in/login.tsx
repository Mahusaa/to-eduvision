'use server';

import { redirect } from 'next/navigation';
import { signIn } from '~/server/auth';

export async function loginAction(email: string, password: string) {
  const credential = await signIn('credentials', {
    redirect: true,
    email,
    password,
  });

  if (!credential) {
    throw new Error('User not found'); // Handle error appropriately
  }


  redirect('/');
}

