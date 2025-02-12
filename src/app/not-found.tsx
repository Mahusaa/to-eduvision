import Link from "next/link"
import { Frown } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="max-w-md w-full px-6 py-8 shadow-md rounded-lg">
        <div className="text-center">
          <Frown className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-600" />
          <h1 className="mt-6 text-3xl font-bold text-gray-900 dark:text-gray-100">Page not found</h1>
          <p className="mt-3 text-gray-600 dark:text-gray-400">Sorry, {`we couldn't`} find the page {"you're"} looking for.</p>
        </div>
        <div className="mt-8">
          <Link
            href="/"
            className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Go back home
          </Link>
        </div>
      </div>
    </div>
  )
}


