import { Star, StarHalf } from "lucide-react"

interface StarRatingProps {
  rating: number
  className?: string
}

export function StarRating({ rating, className = "" }: StarRatingProps) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5

  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {Array.from({ length: 5 }).map((_, i) => {
        if (i < fullStars) {
          return <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        }
        if (i === fullStars && hasHalfStar) {
          return <StarHalf key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        }
        return <Star key={i} className="h-4 w-4 text-gray-300" />
      })}
      <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span>
    </div>
  )
}


