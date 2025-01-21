'use client'

import { useState, useEffect } from 'react'
import LeaderboardEntry from './LeaderboardEntry'
import Pagination from './Pagination'
import { Button } from '../ui/button'
import type { LeaderboardEntryType } from './LeaderboardEntry'

interface LeaderboardProps {
  data: LeaderboardEntryType[]
}

export default function Leaderboard({ data }: LeaderboardProps) {
  const [sortBy, setSortBy] = useState<number>(-1)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortedData, setSortedData] = useState<LeaderboardEntryType[]>([])
  const entriesPerPage = 10

  useEffect(() => {
    const sorted = [...data].sort((a, b) => {
      if (sortBy === -1) {
        const avgA = a.scores?.reduce((sum, score) => sum + score, 0) / (a.scores?.length || 1);
        const avgB = b.scores?.reduce((sum, score) => sum + score, 0) / (b.scores?.length || 1);
        return (avgB || 0) - (avgA || 0);
      } else {
        const scoreA = a.scores?.[sortBy] ?? 0; // Default to 0 if undefined
        const scoreB = b.scores?.[sortBy] ?? 0; // Default to 0 if undefined
        return scoreB - scoreA;
      }
    });
    setSortedData(sorted);
  }, [data, sortBy]);


  const indexOfLastEntry = currentPage * entriesPerPage
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage
  const currentEntries = sortedData.slice(indexOfFirstEntry, indexOfLastEntry)

  const handleSortChange = (index: number) => {
    setSortBy(index)
    setCurrentPage(1) // Reset to first page when sorting changes
  }

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="bg-blue-600 text-white px-4 py-4 sm:px-6">
        <h2 className="text-xl font-semibold mb-3">Top Performers</h2>
        <div className="flex flex-wrap gap-2">
          <SortButton onClick={() => handleSortChange(-1)} isActive={sortBy === -1} label="Semua" />
          {["PU", "PBM", "PPU", "KK", "LBIND", "LBING", "PM"].map((subtest, index) => (
            <SortButton
              key={subtest}
              onClick={() => handleSortChange(index)}
              isActive={sortBy === index}
              label={`${subtest}`}
            />
          ))}
        </div>
      </div>
      <div className="divide-y divide-gray-200">
        {currentEntries.map((entry, index) => (
          <LeaderboardEntry
            key={entry.id}
            entry={entry}
            rank={indexOfFirstEntry + index + 1}
            sortBy={sortBy}
          />
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(data.length / entriesPerPage)}
        onPageChange={handlePageChange}
      />
    </div>
  )
}

function SortButton({ onClick, isActive, label }: { onClick: () => void; isActive: boolean; label: string }) {
  return (
    <Button
      onClick={onClick}
      className={`px-2 py-1 text-sm rounded ${isActive ? 'bg-white text-blue-600' : 'bg-blue-500 hover:bg-blue-700'
        } transition duration-300 ease-in-out`}
      variant={isActive ? 'secondary' : 'default'}
    >
      {label}
    </Button>
  )
}


