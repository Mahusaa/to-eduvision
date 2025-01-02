'use client'

import Link from 'next/link'
import * as React from "react"
import { NavigationMenuLink, NavigationMenuItem, NavigationMenu, NavigationMenuList, NavigationMenuTrigger, NavigationMenuContent, navigationMenuTriggerStyle } from './ui/navigation-menu'
import { Button } from './ui/button'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuContent } from './ui/dropdown-menu'
import LogoSVG from 'public/Logo';
import { cn } from '~/lib/utils'
import { LogOut, User } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
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

  return (
    <header className="bg-gradient-to-b from-blue-50 to-white border-b shadow-sm">
      <div className=" px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex justify-start gap-5">
            <Link href="/" className="flex-shrink-0 flex  gap-2">
              <LogoSVG className="text-primary w-8 h-8" />
              <span className="text-2xl font-bold text-primary">EDUVISION</span>
            </Link>
            {session && (
              <NavigationMenu >
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <Link href="/dashboard" legacyBehavior passHref>
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        Dashboard
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link href="/analitik" legacyBehavior passHref>
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        Analitik
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  {session.user.role === "admin" && (
                    <NavigationMenuItem>
                      <NavigationMenuTrigger>Admin</NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[300px] lg:grid-cols-[.75fr_1fr">
                          <li className="row-span-3">
                            <NavigationMenuLink asChild>
                              <Link
                                href="/edit/tryout"
                                className="block select-none space-y-1 rounded-md p-3  transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              >
                                <div className="text-sm font-medium leading-none">Tryout</div>
                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                  Edit tryout content and settings
                                </p>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                          <li>
                            <NavigationMenuLink asChild>
                              <Link
                                href="/edit/users"
                                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              >
                                <div className="text-sm font-medium leading-none">Users</div>
                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                  Manage user accounts and permissions
                                </p>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  )}
                </NavigationMenuList>
              </NavigationMenu>
            )}

          </div>


          <div className="flex">
            {!session ? (
              <Button asChild variant="ghost">
                <Link href="/sign-in">Login</Link>
              </Button>
            ) : (
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
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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



