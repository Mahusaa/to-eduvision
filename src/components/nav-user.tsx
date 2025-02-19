"use client"

import {
  BadgeCheck,
  ChevronsUpDown,
  LogOut,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { Button } from "./ui/button"
import { useTransition } from "react"
import { logoutAction } from "~/actions/logout-action"
import Link from "next/link"

type User = {
  name?: string | null;
  email?: string
  image?: string;
  id?: string;
  role?: string;
};

export function NavUser({
  user,
}: {
  user: User
}) {
  const [isPending, startTransition] = useTransition()
  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction()
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="lg"
          className="w-full gap-4 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          variant="ghost"
        >
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src={user.image} alt={user.name ?? "CN"} />
            <AvatarFallback className="rounded-lg">{user.name?.[0]}</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{user.name}</span>
            <span className="truncate text-xs">{user.email}</span>
          </div>
          <ChevronsUpDown className="ml-auto size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        side="top"
        align="start"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-4 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={user.image} alt={user.name ?? "CN"} />
              <AvatarFallback className="rounded-lg">{user.name?.[0] ?? "U"}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{user.name}</span>
              <span className="truncate text-xs">{user.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/profile">
            <DropdownMenuItem>
              <BadgeCheck />
              Akun
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="!text-red-500 !hover:text-red-500 hover:bg-red-50"
          onClick={handleLogout}
          disabled={isPending}
        >
          <LogOut />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

