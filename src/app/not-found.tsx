import Link from "next/link";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const styles = {
  root: "flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4",
  code: "text-8xl font-bold text-muted-foreground/30 tabular-nums leading-none",
  heading: "text-2xl font-semibold",
  description: "text-muted-foreground max-w-xs",
} as const;

export default function NotFound() {
  return (
    <div className={styles.root}>
      <span className={styles.code}>404</span>
      <h1 className={styles.heading}>Page not found</h1>
      <p className={styles.description}>
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Button nativeButton={false} render={<Link href="/" />}>
        <Home className="size-4" />
        Go home
      </Button>
    </div>
  );
}
