import { auth } from '~/server/auth';
import LoginForm from './login-form'
import { redirect } from 'next/navigation';
import LogoSVG from 'public/Logo';
import Link from 'next/link';

export default async function LoginPage() {
  const session = await auth()

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8 min-h-screen bg-gradient-to-b from-white to-blue-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">

      </div>
      <LoginForm />
    </div>

  )
}

