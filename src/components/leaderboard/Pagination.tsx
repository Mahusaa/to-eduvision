import { Button } from "../ui/button"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pageNumbers = []

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1) ||
      (currentPage <= 3 && i <= 5) ||
      (currentPage >= totalPages - 2 && i >= totalPages - 4)
    ) {
      pageNumbers.push(i)
    } else if (pageNumbers[pageNumbers.length - 1] !== '...') {
      pageNumbers.push('...')
    }
  }

  return (
    <nav className="flex justify-center items-center space-x-2 p-4">
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded bg-blue-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </Button>
      {pageNumbers.map((number, index) => (
        <Button
          key={index}
          onClick={() => typeof number === 'number' && onPageChange(number)}
          className={`px-3 py-1 rounded ${number === currentPage
            ? 'bg-blue-600 text-white'
            : number === '...'
              ? 'cursor-default'
              : 'bg-gray-200 hover:bg-gray-300'
            }`}
        >
          {number}
        </Button>
      ))}
      <Button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded bg-blue-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </Button>
    </nav>
  )
}


