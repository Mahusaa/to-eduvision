"use client"


import { startTransition, useActionState, useState } from "react";
import { Input } from "~/components/ui/input";
import { Table, TableRow, TableHeader, TableHead, TableBody, TableCell } from "~/components/ui/table";
import { AlarmClock, FileScan, Filter, Loader2, Pencil, PlusCircle, Settings, Trash2 } from "lucide-react";
import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue } from "~/components/ui/select";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import format from "date-fns/format";
import { TryoutMakerDialog } from "~/components/tryout-editor/TryoutMakerDialog";
import { DeleteConfirmDialog } from "~/components/tryout-editor/DeleteConfirmDialog";
import { deleteTryout } from "~/actions/delete-tryout";
import type { ActionResponse } from "~/types/delete-tryout";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "~/components/ui/hover-card";
import { EditTryoutDialog } from "~/components/EditTryoutDialog";
import { SettingTryoutDialog } from "~/components/tryout-editor/SettingTryoutDialog";
import { TryoutResultDialog } from "~/components/admin-interface/TryoutResultDialog";
import Link from "next/link";


interface Tryout {
  id: number;
  name: string;
  tryoutNumber: number;
  status: 'closed' | 'open' | 'completed';
  endedAt: Date | null;
  duration: number | null;
  userTimes: {
    tryoutEnd: Date | null;
  }[];
}
interface TryoutData {
  tryout: Tryout[];
}

const initialState: ActionResponse = {
  success: false,
  message: '',
}



export default function TryoutTable({ tryout }: TryoutData) {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [tryoutToDelete, setTryoutToDelete] = useState<Tryout | null>(null)
  const [deleteState, deleteAction, deleteIsPending] = useActionState(deleteTryout, initialState)
  const filteredTests = tryout.filter(tryout => {
    const matchesSearch = tryout.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || tryout.status === statusFilter
    return matchesSearch && matchesStatus
  })
  const handleDeleteCancel = () => {
    setTryoutToDelete(null)
  }

  const handleDeleteClick = (tryout: Tryout) => {
    setTryoutToDelete(tryout)
  }

  const handleDeleteConfirm = async () => {
    if (tryoutToDelete) {
      startTransition(() => {
        deleteAction(tryoutToDelete.id)
      })
      setTryoutToDelete(null)
    }
  }
  const getStatusBadge = (status: string) => {
    const statusStyles = {
      closed: 'bg-red-100 text-red-800 hover:bg-red-200',
      open: 'bg-green-100 text-green-800 hover:bg-green-200',
      completed: 'bg-blue-100 text-blue-800 hover:bg-blue-200'
    }[status]

    return (
      <Badge className={`${statusStyles} cursor-default`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Input
            placeholder="Search tests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-[250px]"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <TryoutMakerDialog>
          <Button><PlusCircle className="w-4 h-4" />Buat Tryout</Button>
        </TryoutMakerDialog >
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Number</TableHead>
              <TableHead className="text-center">Nama Tryout</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">End Date</TableHead>
              <TableHead className="text-center">Duration</TableHead>
              <TableHead className="text-center">Participants</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTests.map((test) => (
              <TableRow key={test.id}>
                <TableCell className="font-medium text-center">{test.tryoutNumber}</TableCell>
                <TableCell className="font-medium text-center">{test.name}</TableCell>
                <TableCell className="text-center">{getStatusBadge(test.status)}</TableCell>
                <TableCell className="text-center">{format(test.endedAt!, 'PPP')}</TableCell>
                <TableCell className="text-center">{test.duration} min</TableCell>
                <TableCell className="text-center">{test.userTimes.length}</TableCell>
                <TableCell className="text-center ">
                  <div className="flex items-center justify-center space-x-2">
                    <HoverCard openDelay={100} closeDelay={100}>
                      <EditTryoutDialog tryoutId={test.id}>
                        <HoverCardTrigger asChild>
                          <Button variant="outline" size="icon" className="text-green-300 hover:text-green-500 hover:bg-green-50">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </HoverCardTrigger>
                      </EditTryoutDialog>
                      <HoverCardContent
                        side="top"
                        align="center"
                        className="p-2 w-30 rounded-xl shadow-lg bg-green-50 border border-gray-200"
                      >
                        <p className="text-sm text-gray-700">Edit Subtest</p>
                      </HoverCardContent>
                    </HoverCard>
                    <HoverCard openDelay={100} closeDelay={100}>
                      <TryoutResultDialog tryoutId={test.id}>
                        <HoverCardTrigger asChild>
                          <Button variant="outline" size="icon" className="text-blue-300 hover:text-blue-500 hover:bg-blue-50">
                            <FileScan className="h-4 w-4" />
                          </Button>
                        </HoverCardTrigger>
                      </TryoutResultDialog>
                      <HoverCardContent
                        side="top"
                        align="center"
                        className="p-2 w-30 rounded-xl shadow-lg bg-blue-50 border border-gray-200"
                      >
                        <p className="text-sm text-gray-700">Result</p>
                      </HoverCardContent>
                    </HoverCard>
                    <HoverCard openDelay={100} closeDelay={100}>
                      <HoverCardTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-yellow-500 hover:text-yellow-700 hover:bg-yellow-50"
                          asChild
                        >
                          <Link href={`/edit/user-time/${test.id}`} >
                            <AlarmClock className="w-4 h-4" />
                          </Link>
                        </Button>
                      </HoverCardTrigger>
                      <HoverCardContent
                        side="top"
                        align="center"
                        className="p-2 w-30 rounded-sm shadow-lg bg-yellow-50 border border-gray-200"
                      >
                        <p className="text-sm text-gray-700">User Time</p>
                      </HoverCardContent>
                    </HoverCard>
                    <HoverCard openDelay={100} closeDelay={100}>
                      <HoverCardTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDeleteClick(test)}
                          disabled={deleteIsPending}
                        >
                          {deleteIsPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
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
                    <HoverCard openDelay={100} closeDelay={100}>
                      <SettingTryoutDialog tryout={test}>
                        <HoverCardTrigger asChild>
                          <Button variant="outline" size="icon">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </HoverCardTrigger>
                      </SettingTryoutDialog>
                      <HoverCardContent
                        side="top"
                        align="center"
                        className="p-2 w-30 rounded-xl shadow-lg bg-white border border-gray-200"
                      >
                        <p className="text-sm text-gray-700">Settings</p>
                      </HoverCardContent>
                    </HoverCard>

                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <DeleteConfirmDialog
        isOpen={!!tryoutToDelete}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        itemName={tryoutToDelete?.name ?? ""}
      />
    </div>

  )
}
