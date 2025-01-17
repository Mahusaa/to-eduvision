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
        <Link href="/">
          <div className="flex flex-row items-center justify-center text-center space-x-4">
            <LogoSVG className="w-16 h-16 text-primary" />
            <h1 className="text-3xl font-bold text-primary">EDUVISION</h1>
          </div>
        </Link>

        <h2 className="mt-2 text-3xl font-extrabold text-gray-900">
          Selamat Datang di Eduvision
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Belum punya akun?{' '}
          <a
            href="https://bit.ly/TryOutEduvision"
            className="font-medium text-indigo-600 hover:underline hover:text-indigo-500"
          >
            Daftar Sekarang
          </a>
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-md rounded-lg sm:px-10">
          <LoginForm />
        </div>
      </div>
    </div>

  )
}

