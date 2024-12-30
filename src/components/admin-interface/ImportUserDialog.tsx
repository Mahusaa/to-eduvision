"use client"

import { useActionState, useState } from "react"
import { Button } from "~/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import { CheckCircle2, Download } from "lucide-react"
import { Input } from "../ui/input"
import { importUsers } from "~/actions/import-users"
import type { BatchActionResponse } from "~/types/import-users"
import { Alert, AlertDescription } from "../ui/alert"

const initialState: BatchActionResponse = {
  success: false,
  message: '',
}

export function ImportUserDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [state, action, isPending] = useActionState(importUsers, initialState)


  const downloadTemplate = () => {
    const template = 'email,name,role\njohn@example.com,John Doe,user\njane@example.com,Jane Smith,admin'
    const blob = new Blob([template], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'import-user-template.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Import Users</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Upload a CSV file with the following columns: email, name, role
          </div>
          <Button variant="outline" onClick={downloadTemplate} className="w-full">
            <Download className="mr-2 h-4 w-4" />
            Download Template
          </Button>
          <form action={action} className="space-y-4">
            <Input
              type="file"
              name="file"
              accept=".csv"
              required
            />
            {state?.message && (
              <Alert variant={state.success ? "default" : "destructive"}>
                {state.success && <CheckCircle2 className="h-4 w-4" />}
                <AlertDescription>{state.message}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? 'Importing...' : 'Import'}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}



