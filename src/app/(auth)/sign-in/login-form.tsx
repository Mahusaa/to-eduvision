'use client';

import {
  AtSign,
  KeyIcon,
  CircleAlert,
} from 'lucide-react'
import { Button } from '~/components/ui/button';
import { useActionState } from 'react';
import { authenticate } from '~/actions/authenticate';
import { Label } from '~/components/ui/label';
import { Input } from '~/components/ui/input';

export default function LoginForm() {
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined,
  );

  return (
    <form action={formAction} className="space-y-3">
      <div className="flex-1 rounded-lg">
        <div className="w-full">
          <div>
            <Label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="email"
            >
              Email
            </Label>
            <div className="relative">
              <Input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email address"
                required
              />
              <AtSign className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-primary" />
            </div>
          </div>
          <div className="mt-4">
            <Label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="password"
            >
              Password
            </Label>
            <div className="relative">
              <Input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="password"
                type="password"
                name="password"
                placeholder="Enter password"
                required
                minLength={6}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-primary" />
            </div>
          </div>
        </div>
        <Button className="mt-8 w-full" aria-disabled={isPending}>
          Sign In
        </Button>


        <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {errorMessage && (
            <div className="flex items-center justify-center gap-2 mt-2 text-center">
              <CircleAlert className="h-5 w-5 text-red-500" />
              <p className="text-sm font-medium text-red-500">{errorMessage}</p>
            </div>
          )}

        </div>
      </div>
    </form>
  );
}
