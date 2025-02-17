'use client';

import {
  AtSign,
  KeyIcon,
  CircleAlert,
  Loader2,
} from 'lucide-react'
import { Button } from '~/components/ui/button';
import { useActionState } from 'react';
import { authenticate } from '~/actions/authenticate';
import { Label } from '~/components/ui/label';
import { Input } from '~/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '~/components/ui/card';
import { Checkbox } from '~/components/ui/checkbox';
import Link from 'next/link';
import LogoSVG from 'public/Logo';

export default function LoginForm() {
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined,
  );

  return (
    <Card className="w-full max-w-md mx-auto sm:max-w-sm md:max-w-md">
      <CardHeader className="space-y-1 px-4 sm:px-6 pt-6 pb-4">
        <div className="flex flex-col items-center space-y-2">
          <Link href="/" className="flex items-center space-x-2">
            <LogoSVG className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold text-primary">EDUVISION</span>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div>
            <Label
              className="mb-2 block text-xs font-medium text-gray-900"
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
          <div className="flex items-center space-x-2">
            <Checkbox id="remember" />
            <Label htmlFor="remember" className="text-sm sm:text-base">
              Remember me
            </Label>
          </div>
          {errorMessage && <p className="text-sm font-medium text-destructive">{errorMessage}</p>}
          <Button type="submit" className="w-full text-sm sm:text-base" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form >
      </CardContent>
      <CardFooter className="flex flex-col items-center justify-center space-y-2 px-4 sm:px-6">
        <p className="text-xs sm:text-sm text-muted-foreground text-center">
          Belum punya akun?{' '}
          <Link
            href="https://bit.ly/TryOutEduvision"
            className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
