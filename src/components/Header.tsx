'use client'

import Link from 'next/link'
import * as React from "react"
import { useTransition } from 'react'
import { NavigationMenuLink, NavigationMenuItem, NavigationMenu, NavigationMenuList, NavigationMenuTrigger, NavigationMenuContent, navigationMenuTriggerStyle } from './ui/navigation-menu'
import { Button } from './ui/button'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuContent } from './ui/dropdown-menu'
import LogoSVG from 'public/Logo';
import { cn } from '~/lib/utils'
import { LogOut, User, Menu, LayoutDashboard, BarChart3, Settings, ChevronRight } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { logoutAction } from '~/actions/logout-action'
import { usePathname } from 'next/navigation'
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from './ui/sheet'
import { NavUser } from './nav-user'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible"


type User = {
  name?: string | null;
  email: string;
  image: string;
  id: string;
  role: string;
};
type Session = {
  user: Partial<User>;
  expires: string;
};



const Header = ({ session }: { session: Session | null }) => {
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction()
    })
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex justify-start gap-5">
            <Link href="/" className="flex-shrink-0 flex  gap-2">
              <LogoSVG className="text-primary w-8 h-8" />
              <span className="text-2xl font-bold text-primary">EDUVISION</span>
            </Link>
            {session && (
              <>
                {/* Navigation Menu for Larger Screens */}
                <NavigationMenu className="hidden md:block md-flex">
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <NavLink href="/dashboard" active={pathname === "/dashboard"}>
                        Dashboard
                      </NavLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <NavLink href="/analitik" active={pathname === "/analitik"}>
                        Analitik
                      </NavLink>
                    </NavigationMenuItem>
                    {session.user.role === "admin" && (
                      <NavigationMenuItem>
                        <NavigationMenuTrigger
                          className={cn(
                            "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
                            "relative",
                            pathname.startsWith("/edit") &&
                            "after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-blue-600",
                            "hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:h-[2px] hover:after:w-full hover:after:bg-blue-600",
                          )}
                        >Admin</NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[400px]">
                            <ListItem href="/edit/tryout" title="Tryout">
                              Manage and organize tryouts for new team members.
                            </ListItem>
                            <ListItem href="/edit/users" title="Users">
                              Manage user accounts and permissions within the system.
                            </ListItem>
                          </ul>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    )}
                  </NavigationMenuList>
                </NavigationMenu>
              </>
            )}
          </div>
          <div className="flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-primary hover:text-primary">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <MobileNav session={session} />
              </SheetContent>
            </Sheet>
          </div>

          <div className="hidden md:block">
            {!session ? (
              <Button asChild variant="ghost">
                <Link href="/sign-in">Login</Link>
              </Button>
            ) : (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={session.user?.image ?? ''} alt={session.user?.name ?? ''} />
                        <AvatarFallback>{session.user?.name?.[0] ?? 'U'}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <Link href="/profile">
                      <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem
                      className="!text-red-500 !hover:text-red-500 hover:bg-red-50"
                      onClick={handleLogout}
                      disabled={isPending}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header


const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"

function MobileNav({ session }: { session: Session | null }) {
  const pathname = usePathname()
  return (
    <div className="flex flex-col py-4 h-full">
      <div className="px-2 flex-grow">
        {session && (
          <div className="space-y-1">
            <MobileNavLink href="/dashboard" active={pathname === "/dashboard"}>
              Dashboard
            </MobileNavLink>
            <MobileNavLink href="/analytics" active={pathname === "/analytics"}>
              Analytics
            </MobileNavLink>
            <nav className="w-64 bg-background">
              <ul className="space-y-2">
                <li>
                  <Collapsible>
                    <div className="flex items-center">
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" className="w-full justify-between group">
                          <span>Admin</span>
                          <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-90" />
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                    <CollapsibleContent className="flex flex-col">
                      <Button asChild variant="ghost" className="justify-start">
                        <a href="#sub-item-1">Tryout</a>
                      </Button>
                      <Button asChild variant="ghost" className="justify-start">
                        <a href="#sub-item-2">User</a>
                      </Button>
                    </CollapsibleContent>
                  </Collapsible>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>

      <div className="px-2 mt-auto">
        {session ? (
          <div className="space-y-1">
            <NavUser user={session.user} />
          </div>
        ) : (
          <Button asChild variant="default" className="w-full">
            <Link href="/sign-in">Login</Link>
          </Button>
        )}
      </div>
    </div>
  )
}

function MobileNavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Button variant="ghost" className={cn("w-full justify-start", active && "text-blue-600 font-medium")} asChild>
      <Link href={href}>{children}</Link>
    </Button>
  )
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link href={href} legacyBehavior passHref>
      <NavigationMenuLink
        className={cn(
          "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors  backdrop-blur hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-10 data-[active]:bg-accent/10 data-[state=open]:bg-accent/10",
          "relative",
          active &&
          "after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-blue-600",
          "hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:h-[2px] hover:after:w-full hover:after:bg-blue-600",
        )}
      >
        {children}
      </NavigationMenuLink>
    </Link>
  )
}


