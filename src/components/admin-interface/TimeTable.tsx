"use client"
import { useState } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "~/components/ui/table"
import { Button } from "~/components/ui/button";
import { AddTimeDialog } from "~/components/admin-interface/AddTimeDialog";
import { Input } from "../ui/input";



interface UserTime {
  tryoutEnd: Date
  puEnd: Date
  pbmEnd: Date
  ppuEnd: Date
  kkEnd: Date
  lbindEnd: Date
  lbingEnd: Date
  pmEnd: Date
}

interface UserTimes {
  id: number
  userId: string | null
  tryoutEnd: Date | null
  puEnd: Date | null
  pbmEnd: Date | null
  ppuEnd: Date | null
  kkEnd: Date | null
  lbindEnd: Date | null
  lbingEnd: Date | null
  pmEnd: Date | null
  userName: string
  tryoutNumber: number
}



export default function TimeTable({ userTimes }: { userTimes: UserTimes[] }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [rowsPerPage, setRowsPerPage] = useState('10')
  const [currentPage, setCurrentPage] = useState(1)
  const filteredUsers = userTimes.filter(user =>
    user.userName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * parseInt(rowsPerPage),
    currentPage * parseInt(rowsPerPage)
  )
  const totalPages = Math.ceil(filteredUsers.length / parseInt(rowsPerPage))


  const getRemainingMinutes = (tryoutEnd: Date): number | string => {
    const tryoutEndTime = new Date(tryoutEnd); // Parse the tryoutEnd string into a Date object
    const currentTime = new Date(); // Get the current time
    const differenceInMs = tryoutEndTime.getTime() - currentTime.getTime();
    const differenceInMinutes = Math.floor(differenceInMs / 1000 / 60);
    return differenceInMinutes >= 0 ? differenceInMinutes : "ended";
  };
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="w-1/3">
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Nama</TableHead>
              <TableHead className="text-center">Tryout End</TableHead>
              <TableHead className=" text-center">PU End</TableHead>
              <TableHead className=" text-center">PBM End</TableHead>
              <TableHead className=" text-center">PPU End</TableHead>
              <TableHead className="text-center">KK End</TableHead>
              <TableHead className="text-center">LBIND End</TableHead>
              <TableHead className="text-center">LBING End</TableHead>
              <TableHead className="text-center">PM End</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.map((userTime) => (
              <TableRow key={userTime.id}>
                <TableCell className="text-center">{userTime.userName}</TableCell>
                {['tryoutEnd', 'puEnd', 'pbmEnd', 'ppuEnd', 'kkEnd', 'lbindEnd', 'lbingEnd', 'pmEnd'].map((field) => (
                  <TableCell key={field} className="text-center">
                    <AddTimeDialog
                      id={userTime.id}
                      field={field}
                      tryoutEnd={userTime.tryoutEnd}

                    >
                      <Button variant="ghost" className="w-full justify-start" disabled={!userTime[field as keyof UserTime]}>
                        {userTime[field as keyof UserTime]
                          ? getRemainingMinutes(userTime[field as keyof UserTime]!) === "ended" ? "ended" : "in " + getRemainingMinutes(userTime[field as keyof UserTime]!) + " minutes"
                          : "Not Started"}
                      </Button>
                    </AddTimeDialog>
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
              setRowsPerPage(value)
              setCurrentPage(1)
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
