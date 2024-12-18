'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
type User = {
  name?: string | null;
  email: string;
  image: string;
  id: string;
  role: string;
};
type Session = {
  user: Partial<User>; // Semua properti menjadi opsional
  expires: string;
};

const Header = ({ session }: { session: Session }) => {
  const pathname = usePathname()

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-emerald-600">Eduvision Tryout</span>
            </Link>
            {session && (
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <NavLink href="/dashboard" current={pathname === '/dashboard'}>Dashboard</NavLink>
                <NavLink href="/analitik" current={pathname === '/analitik'}>Analitik</NavLink>
                {session.user.role === "admin" &&
                  <NavLink href="/edit/tryout" current={pathname === '/edit/tryout'}>Edit</NavLink>}
              </div>
            )}
          </div>
          <div className="flex items-center">
            {!session && (
              <Link
                href="/sign-in"
                className="text-sm font-medium text-emerald-600 hover:text-emerald-800"
              >
                Login
              </Link>
            )}
            {session && (
              <span className="text-sm font-medium text-gray-700">
                Hi, {session.user?.name ?? 'User'}
              </span>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}

const NavLink = ({ href, current, children }:
  {
    href: string;
    current: boolean;
    children: React.ReactNode;
  }) => (
  <Link
    href={href}
    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${current
      ? 'border-emerald-500 text-gray-900'
      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
      }`}
  >
    {children}
  </Link>
)

export default Header


