'use client'

import { useActionState, useState } from 'react'
import { Button } from "~/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "~/components/ui/dialog"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { addTime } from '~/actions/add-time'
import { XCircle, CheckCircle2, Loader2 } from 'lucide-react'
import { Alert } from '../ui/alert'

interface AddTimeDialogProps {
  id: number
  field: string
  tryoutEnd: Date | null
  children: React.ReactNode
}

export function AddTimeDialog({ id, children, field, tryoutEnd }: AddTimeDialogProps) {
  const [open, setOpen] = useState(false)
  const [state, formAction, isPending] = useActionState(addTime, null)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle> Ganti waktu untuk {field}</DialogTitle>
          <DialogDescription>
            Ganti Waktu
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="field" value={field} />
          <input type="hidden" name="tryoutEnd" value={tryoutEnd ? tryoutEnd.toISOString() : ""} />
          <div className="grid gap-4">
            <div className="flex items-center gap-4">
              <Label htmlFor="minutes" className="text-right">
                Minutes
              </Label>
              <Input
                id="minutes"
                name="minutes"
                type="number"
                min={1}
                step={1}
                placeholder="Enter minutes"
                className="flex-1"
                required
              />
            </div>
          </div>
          <div className="my-3 items-center">
            {state?.message && (
              <Alert variant={state.success ? "default" : "destructive"} className={`items-center justify-center text-green-600 mr-2 ${state.success ? "bg-green-50" : ""}`}>
                <div className="flex items-center">
                  {state.success ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600 mr-2" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600 mr-2" />
                  )}
                  <p className={"text-sm"}>
                    {state.message}
                  </p>
                </div>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <Button className="w-full flex items-center justify-center" type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                "Change time"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}


