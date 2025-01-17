'use client'

import { useState } from 'react'

export interface LeaderboardEntryType {
  id: number
  name: string
  scores: number[]
}
interface LeaderboardEntryProps {
  entry: LeaderboardEntryType
  rank: number
  sortBy: number
}

const labels = ["Penalaran Umum", "Kemampuan Kuantitatif", "Pemahaman Bacaan dan Menulis", "Pengetahuan dan Pemahaman Umum", "Literasi Bahasa Indonesia", "Literasi Bahasa Inggris", "Penalaran Matematika"];
export default function LeaderboardEntry({ entry, rank, sortBy }: LeaderboardEntryProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const averageScore = entry.scores.reduce((sum, score) => sum + score, 0) / entry.scores.length

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  const displayScore = sortBy === -1 ? averageScore : entry.scores[sortBy]

  return (
    <div
      onClick={toggleExpand}
      className="p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-300 ease-in-out"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className={`font-bold text-lg ${getRankColor(rank)}`}>
            {rank}
          </span>
          <span className="font-semibold text-lg truncate">{entry.name}</span>
        </div>
        <span className="font-bold text-lg text-blue-600">{displayScore ? displayScore.toFixed(2) : 0}</span>
      </div>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-96' : 'max-h-0'
          }`}
      >
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
          {entry.scores.map((score, index) => (
            <div
              key={index}
              className={`p-2 rounded text-sm ${sortBy === index ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-100'
                }`}
            >
              <span className="font-semibold">{labels[index]}: </span> {score}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function getRankColor(rank: number): string {
  switch (rank) {
    case 1:
      return 'text-yellow-500'
    case 2:
      return 'text-gray-400'
    case 3:
      return 'text-amber-600'
    default:
      return 'text-gray-500'
  }
}


