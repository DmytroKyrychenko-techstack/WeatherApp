"use client";

import { useTransition } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Heart, LogIn, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/lib/actions/auth";

interface NavbarProps {
  user: { id: string; email: string } | null;
}

const styles = {
  desktop:
    "sticky top-0 z-50 hidden md:flex items-center justify-center gap-1 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 h-14",
  mobile:
    "fixed bottom-0 left-0 right-0 z-50 flex md:hidden items-center justify-around border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pb-[env(safe-area-inset-bottom)]",
  link: "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-muted md:flex-row md:min-h-0 flex-col justify-center min-h-[56px] min-w-[64px]",
  linkActive: "text-foreground bg-muted",
  label: "text-[10px] md:text-sm",
  icon: "size-5 md:size-4",
  authDesktop: "ml-auto flex items-center gap-2",
  userEmail: "text-xs text-muted-foreground hidden lg:block max-w-[140px] truncate",
  logoutBtn:
    "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-muted cursor-pointer disabled:opacity-50",
} as const;

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/favorites", label: "Favorites", icon: Heart },
] as const;

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function handleLogout() {
    startTransition(() => {
      logoutAction();
    });
  }

  const mainLinks = navLinks.map(({ href, label, icon: Icon }) => (
    <Link
      key={href}
      href={href}
      className={cn(styles.link, pathname === href && styles.linkActive)}
    >
      <Icon className={styles.icon} />
      <span className={styles.label}>{label}</span>
    </Link>
  ));

  const logoutButton = (extraClass?: string) => (
    <button
      onClick={handleLogout}
      disabled={isPending}
      aria-label="Sign out"
      className={cn(styles.logoutBtn, extraClass)}
    >
      <LogOut className={styles.icon} />
      <span className={styles.label}>Sign out</span>
    </button>
  );

  return (
    <>
      <nav className={styles.desktop} aria-label="Main navigation">
        {mainLinks}
        {user ? (
          <>
            <span className={styles.userEmail}>{user.email}</span>
            {logoutButton()}
          </>
        ) : (
          <Link
            href="/login"
            className={cn(styles.link, pathname === "/login" && styles.linkActive)}
          >
            <LogIn className={styles.icon} />
            <span>Sign in</span>
          </Link>
        )}
      </nav>
      <nav className={styles.mobile} aria-label="Main navigation">
        {mainLinks}
        {user ? (
          logoutButton(styles.link)
        ) : (
          <Link
            href="/login"
            className={cn(styles.link, pathname === "/login" && styles.linkActive)}
          >
            <LogIn className={styles.icon} />
            <span className={styles.label}>Sign in</span>
          </Link>
        )}
      </nav>
    </>
  );
}
