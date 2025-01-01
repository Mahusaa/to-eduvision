'use client'

import { startTransition, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useActionState } from 'react'
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { ArrowLeft, Eye, EyeOff, Loader2 } from 'lucide-react'
import { updateProfile } from '~/actions/update-profile'
import { useToast } from '~/hooks/use-toast'

interface PasswordInputProps {
  id: string;
  name: string;
  label: string;
}


function PasswordInput({ id, name, label }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          name={name}
          type={showPassword ? "text" : "password"}
          className="pr-10"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4 text-gray-500" />
          ) : (
            <Eye className="h-4 w-4 text-gray-500" />
          )}
        </Button>
      </div>
    </div>
  )
}
export default function ProfileEditPage({ userName, email, id }: { id: string, userName: string, email: string }) {
  const initialState = {
    id,
    name: userName ? userName : "",
    email: email ? email : "",
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    message: null,
    error: null,

  }

  const router = useRouter()
  const [state, formAction, isPending] = useActionState(updateProfile, initialState)
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    try {
      startTransition(() => {
        formAction(formData)
        toast({
          title: state.message ? state.message : "Oh No, something went wrong",
          description: state.error
        })
      })
    } catch {
      toast({
        title: state.message ? state.message : "Failed to update",
        description: state.error,
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="p-4">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={state.name}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={state.email}
                required
              />
            </div>

            <PasswordInput
              id="currentPassword"
              name="currentPassword"
              label="Current Password"
            />

            <PasswordInput
              id="newPassword"
              name="newPassword"
              label="New Password"
            />

            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm New Password"
            />
            <Input id="id" name="id" type="hidden" defaultValue={id} />

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>

          </form>

        </CardContent>
      </Card>
    </div>
  )
}


