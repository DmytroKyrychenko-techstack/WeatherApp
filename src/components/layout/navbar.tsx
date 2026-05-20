"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/favorites", label: "Favorites", icon: Heart },
] as const;

const styles = {
  desktop:
    "sticky top-0 z-50 hidden md:flex items-center justify-center gap-1 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 h-14",
  mobile:
    "fixed bottom-0 left-0 right-0 z-50 flex md:hidden items-center justify-around border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pb-[env(safe-area-inset-bottom)]",
  link: "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-muted md:flex-row md:min-h-0 flex-col justify-center min-h-[56px] min-w-[64px]",
  linkActive: "text-foreground bg-muted",
  label: "text-[10px] md:text-sm",
  icon: "size-5 md:size-4",
} as const;

export function Navbar() {
  const pathname = usePathname();

  const links = navLinks.map(({ href, label, icon: Icon }) => (
    <Link
      key={href}
      href={href}
      className={cn(styles.link, pathname === href && styles.linkActive)}
    >
      <Icon className={styles.icon} />
      <span className={styles.label}>{label}</span>
    </Link>
  ));

  return (
    <>
      <nav className={styles.desktop} aria-label="Main navigation">
        {links}
      </nav>
      <nav className={styles.mobile} aria-label="Main navigation">
        {links}
      </nav>
    </>
  );
}
