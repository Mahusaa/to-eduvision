'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Header = () => {
  const pathname = usePathname()

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-emerald-600">Eduvision Tryout</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NavLink href="/problems" current={pathname === '/problems'}>Tryout</NavLink>
              <NavLink href="/scores" current={pathname === '/scores'}>Scores</NavLink>
            </div>
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


