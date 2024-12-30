'use client'

import { startTransition, useState, useActionState } from 'react'
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import { Badge } from "~/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card'
import { Upload, UserPlus, Loader2, Trash2, KeyRound } from 'lucide-react'
import type { User } from '~/server/db/schema'
import { ImportUserDialog } from './ImportUserDialog'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'
import { DeleteConfirmDialog } from '../tryout-editor/DeleteConfirmDialog'
import { type ActionResponse } from '~/types/delete-tryout'
import { deleteUser } from '~/actions/delete-user'
import { resetUserPass } from '~/actions/reset-password'
import { ResetPasswordDialog } from '../tryout-editor/ResetPasswordDialog'

const getRoleBadgeColor = (role: User['role']) => {
  switch (role) {
    case 'admin':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    case 'user':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    default:
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
  }
}
const initialState: ActionResponse = {
  success: false,
  message: '',
}




export default function UserManagement({ users }: { users: User[] }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [rowsPerPage, setRowsPerPage] = useState('10')
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const [userToReset, setUserToReset] = useState<User | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteState, deleteAction, deleteIsPending] = useActionState(deleteUser, initialState)
  const [resetPassState, resetPassAction, resetPassIsPending] = useActionState(resetUserPass, initialState)
  const handleDeleteCancel = () => {
    setUserToDelete(null)
  }
  const handleResetPassCancel = () => {
    setUserToReset(null)
  }

  const handleUserToDelete = (user: User) => {
    setUserToDelete(user)
  }
  const handleUserToReset = (user: User) => {
    setUserToReset(user)
  }

  const handleDeleteConfirm = async () => {
    if (userToDelete) {
      startTransition(() => {
        deleteAction(userToDelete.id)
      })
      setUserToDelete(null)
    }
  }
  const handleResetPass = async () => {
    if (userToReset) {
      startTransition(() => {
        resetPassAction(userToReset.id)
      })
      setUserToReset(null)
    }
  }


  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="flex gap-2">
          <ImportUserDialog>
            <Button variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Import Users
            </Button>
          </ImportUserDialog>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center ">ID</TableHead>
              <TableHead className="text-center">Email</TableHead>
              <TableHead className="text-center">Name</TableHead>
              <TableHead className="text-center">Role</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-mono text-center">
                  <TooltipProvider>
                    <Tooltip delayDuration={100}>
                      <TooltipTrigger>
                        {user.id.slice(0, 6)}...
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{user.id}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell >
                <TableCell className="text-center">{user.email}</TableCell>
                <TableCell className="text-center">{user.name}</TableCell>
                <TableCell className="text-center">
                  <Badge variant="secondary" className={getRoleBadgeColor(user.role)}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <HoverCard openDelay={100} closeDelay={100}>
                      <HoverCardTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-yellow-400 hover:text-yellow-700 hover:bg-yellow-50"
                          onClick={() => handleUserToReset(user)}
                          disabled={resetPassIsPending && userToReset?.id === user.id}
                        >
                          {resetPassIsPending && userToReset?.id === user.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
                        </Button>
                      </HoverCardTrigger>
                      <HoverCardContent
                        side="top"
                        align="center"
                        className="p-2 w-30 rounded-sm shadow-lg bg-yellow-50 border border-gray-200"
                      >
                        <p className="text-sm text-gray-700">Reset Password</p>
                      </HoverCardContent>
                    </HoverCard>
                    <HoverCard openDelay={100} closeDelay={100}>
                      <HoverCardTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleUserToDelete(user)}
                          disabled={deleteIsPending && userToDelete?.id === user.id}
                        >
                          {deleteIsPending && userToDelete?.id === user.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        </Button>
                      </HoverCardTrigger>
                      <HoverCardContent
                        side="top"
                        align="center"
                        className="p-2 w-30 rounded-sm shadow-lg bg-red-50 border border-gray-200"
                      >
                        <p className="text-sm text-gray-700">Delete</p>
                      </HoverCardContent>
                    </HoverCard>
                  </div>
                </TableCell>
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
      <DeleteConfirmDialog
        isOpen={!!userToDelete}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        itemName={userToDelete?.name ?? ""}
      />
      <ResetPasswordDialog
        isOpen={!!userToReset}
        onClose={handleResetPassCancel}
        onConfirm={handleResetPass}
        itemName={userToReset?.name ?? ""}
      />

    </div>
  )
}


