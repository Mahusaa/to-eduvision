"use client"
import { useActionState, useState } from "react"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Button } from "../ui/button"
import { CheckCircle2, Loader2, XCircle } from "lucide-react"
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "../ui/select"
import { Alert } from "../ui/alert"
import type { ActionResponse } from "~/types/create-user"
import { createUser } from "~/actions/create-user"


const initialState: ActionResponse = {
  success: false,
  message: '',
}


export function CreateUserDialog({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<"user" | "admin" | "mulyono">("user")
  const [state, action, isPending] = useActionState(createUser, initialState)
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create User</DialogTitle>
        </DialogHeader>
        <form action={action}>
          <div className="space-y-4">
            <div className="grid grid-cols-4 items-center justify-start gap-2">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                className="col-span-3"
              />
              {state?.errors?.name && (
                <p id="streetAddress-error" className="text-sm text-red-500">
                  {state.errors.name[0]}
                </p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center justify-start gap-2">
              <Label htmlFor="userName" className="text-right">
                Name
              </Label>
              <Input
                id="userName"
                name="userName"
                className="col-span-3"
              />
              {state?.errors?.name && (
                <p id="streetAddress-error" className="text-sm text-red-500">
                  {state.errors.name[0]}
                </p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Select
                value={role}
                onValueChange={(value: "user" | "admin" | "mulyono") => setRole(value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Input
            type="hidden"
            name="role"
            value={role}
          />
          {state?.errors?.name && (
            <p id="streetAddress-error" className="text-sm text-red-500">
              {state.errors.name[0]} error name
            </p>
          )}
          {state?.errors?.role && (
            <p id="streetAddress-error" className="text-sm text-red-500">
              {state.errors.role[0]} error role
            </p>
          )}
          {state?.errors?.role && (
            <p id="streetAddress-error" className="text-sm text-red-500">
              {state.errors.role[0]} error role
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
              "Create User"
            )}
          </Button>

        </form>
      </DialogContent>
    </Dialog>
  )

}
