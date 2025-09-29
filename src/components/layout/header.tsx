
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, User as UserIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import Logo from '../icons/logo';
import { useAuth } from '@/contexts/auth-context';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Skeleton } from '../ui/skeleton';

export default function Header() {
  const pathname = usePathname();
  const { user, userProfile, isAdmin, logout, loading } = useAuth();

  const navLinks = [
    { href: '/', label: 'Map', show: true },
    { href: '/dashboard', label: 'Dashboard', show: isAdmin },
  ];

  const NavLinks = ({ className }: { className?: string }) => (
    <nav className={cn('flex items-center gap-4 lg:gap-6', className)}>
      {navLinks.filter(l => l.show).map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
            pathname === href ? 'text-primary' : 'text-muted-foreground'
          )}
        >
          {label}
        </Link>
      ))}
    </nav>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center px-4 md:px-8">
        <Link href="/" className="mr-6 flex items-center gap-2">
          <Logo className="h-6 w-6 text-primary" />
          <span className="hidden font-bold sm:inline-block">
            ChargeSpot Navigator
          </span>
        </Link>
        <div className="flex-1">
           <NavLinks className="hidden md:flex" />
        </div>
        <div className="flex items-center gap-4">
          {loading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <>
              {user && userProfile ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={user.photoURL ?? undefined} alt={userProfile.fullName || ''} />
                                <AvatarFallback>{userProfile.fullName?.charAt(0) ?? user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{userProfile.fullName}</p>
                            <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                            </p>
                        </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/profile">
                                <UserIcon className="mr-2 h-4 w-4" />
                                <span>Profile</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={logout}>
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/signup">Sign Up</Link>
                  </Button>
                </div>
              )}
            </>
          )}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <Link href="/" className="mr-6 flex items-center gap-2 mb-6">
                    <Logo className="h-6 w-6 text-primary" />
                    <span className="font-bold">ChargeSpot Navigator</span>
                </Link>
                <div className="flex flex-col gap-4">
                  <NavLinks className="flex-col items-start gap-4" />
                   {!loading && (
                    <>
                      {!user ? (
                        <div className="flex flex-col gap-2 mt-4">
                           <Button variant="outline" size="sm" asChild>
                              <Link href="/login">Login</Link>
                           </Button>
                           <Button size="sm" asChild>
                              <Link href="/signup">Sign Up</Link>
                           </Button>
                        </div>
                      ) : (
                         <div className="flex flex-col gap-2 mt-4 border-t pt-4">
                           <Link href="/profile" className="text-sm font-medium text-muted-foreground hover:text-primary">Profile</Link>
                           <Button variant="outline" size="sm" onClick={logout}>Logout</Button>
                         </div>
                      )}
                    </>
                   )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
