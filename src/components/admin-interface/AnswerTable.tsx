"use client"
import { useState } from "react";
import { Input } from "../ui/input";
import { Table, TableRow, TableHead, TableHeader, TableBody, TableCell } from "../ui/table";
import { Button } from "../ui/button";
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Select, SelectItem, SelectValue, SelectContent, SelectTrigger } from "../ui/select";
import { Download } from "lucide-react";


interface User {
  id: string;
  name: string;
  answers: string[];
}



export default function AnswerTable({ userAnswer, answerKey }: { userAnswer: User[], answerKey: string[] }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [rowsPerPage, setRowsPerPage] = useState('10')
  const [currentPage, setCurrentPage] = useState(1)
  const filteredUsers = userAnswer.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  )
  const downloadCSV = () => {
    const headers = ['User ID', 'Name', ...Array(answerKey.length).fill(0).map((_, i) => `Q${i + 1}`)]
    const csvContent = [
      headers.join(','),
      ['Answer Key', '', ...answerKey].join(','),
      ...userAnswer.map(user =>
        [
          user.id,
          user.name,
          ...user.answers.map((answer, index) =>
            answer === answerKey[index] ? '1' : '0'
          )
        ].join(',')
      )
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'answer_comparison.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }


  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * parseInt(rowsPerPage),
    currentPage * parseInt(rowsPerPage)
  )

  const totalPages = Math.ceil(filteredUsers.length / parseInt(rowsPerPage))
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="w-1/3">
          <Input
            placeholder="Search Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={downloadCSV}><Download className="w-4 h-4" />Download Data</Button>
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center w-[80px] border">ID</TableHead>
              <TableHead className="text-center w-[150px] border">Name</TableHead>
              {answerKey.map((_, index) => (
                <TableHead key={index} className="text-center w-12 border">
                  Q{index + 1}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="border text-center bg-green-100"></TableCell>
              <TableCell className=" border text-center font-bold bg-green-100">ANSWER KEY</TableCell>
              {answerKey.map((answer, index) => (
                <TableCell key={index} className="text-center font-bold border bg-green-100">{answer}</TableCell>
              ))}
            </TableRow>
            {paginatedUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="text-center font-mono border w-[80px]">
                  <TooltipProvider>
                    <Tooltip delayDuration={100}>
                      <TooltipTrigger className="truncate block max-w-full">
                        {user.id.slice(0, 6)}...
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-sm font-mono">{user.id}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell className="text-center border w-[150px]">
                  {user.name}
                </TableCell>
                {user.answers.map((answer, index) => (
                  <TableCell
                    key={index}
                    className={`text-center border ${answer === answerKey[index]
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                      }`}
                  >
                    {answer}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700 dark:text-gray-400">
            Rows per page
          </span>
          <Select
            value={rowsPerPage}
            onValueChange={(value) => {
              setRowsPerPage(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder={rowsPerPage} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-700 dark:text-gray-400">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>


  )

}

