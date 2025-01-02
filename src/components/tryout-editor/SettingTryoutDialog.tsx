"use client"
import { useActionState, useState } from "react"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Button } from "../ui/button"
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover"
import { CalendarIcon, CheckCircle2, Loader2, XCircle } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "../ui/calendar"
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "../ui/select"
import { updateTryout } from "~/actions/update-tryout"
import { type ActionResponse } from "~/types/update-tryout"
import { Alert } from "../ui/alert"


const initialState: ActionResponse = {
  success: false,
  message: '',
}

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


export function SettingTryoutDialog({ children, tryout }: { children: React.ReactNode, tryout: Tryout }) {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [status, setStatus] = useState<"completed" | "closed" | "open">("closed")
  const [state, action, isPending] = useActionState(updateTryout, initialState)
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Tryout</DialogTitle>
        </DialogHeader>
        <form action={action}>
          <div className="space-y-4">
            <div className="grid grid-cols-4 items-center justify-start gap-2">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="tryoutName"
                name="tryoutName"
                defaultValue={tryout.name}
                className="col-span-3"
              />
              {state?.errors?.name && (
                <p id="streetAddress-error" className="text-sm text-red-500">
                  {state.errors.name[0]}
                </p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select
                value={status}
                onValueChange={(value: "completed" | "open" | "closed") => setStatus(value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="publishDate" className="text-right">
                End Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={`col-span-3 justify-start text-left font-normal ${!date && "text-muted-foreground"}`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <Input
            type="hidden"
            name="tryoutId"
            value={tryout.id}
          />
          <Input
            type="hidden"
            name="date"
            value={date ? date.toISOString() : ""}
          />
          <Input
            type="hidden"
            name="status"
            value={status}
          />
          {state?.errors?.endedAt && (
            <p id="streetAddress-error" className="text-sm text-red-500">
              {state.errors.endedAt[0]} error ended
            </p>
          )}
          {state?.errors?.tryoutId && (
            <p id="streetAddress-error" className="text-sm text-red-500">
              {state.errors.tryoutId[0]} error toid
            </p>
          )}
          {state?.errors?.status && (
            <p id="streetAddress-error" className="text-sm text-red-500">
              {state.errors.status[0]} error status
            </p>
          )}
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
          <Button className="w-full flex items-center justify-center" type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              "Save Tryout"
            )}
          </Button>

        </form>
      </DialogContent>
    </Dialog>
  )

}
