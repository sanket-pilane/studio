
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import Logo from '../icons/logo';
import { useAuth } from '@/contexts/auth-context';

export default function Header() {
  const pathname = usePathname();
  const { user, isAdmin, logout, loading } = useAuth();

  const navLinks = [
    { href: '/', label: 'Map', show: true },
    { href: '/dashboard', label: 'Dashboard', show: isAdmin },
    { href: '/profile', label: 'Profile', show: !!user },
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
           {!loading && <NavLinks className="hidden md:flex" />}
        </div>
        <div className="flex items-center gap-2">
          {!loading && (
            <>
              {user ? (
                <Button variant="outline" size="sm" onClick={logout}>
                  Logout
                </Button>
              ) : (
                <>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/signup">Sign Up</Link>
                  </Button>
                </>
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
                {!loading && <NavLinks className="flex-col items-start gap-4" />}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
