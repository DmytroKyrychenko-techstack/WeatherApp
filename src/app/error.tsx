"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

const styles = {
  root: "flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4",
  icon: "size-16 text-destructive/60",
  heading: "text-2xl font-semibold",
  description: "text-muted-foreground max-w-sm",
} as const;

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className={styles.root}>
      <AlertTriangle className={styles.icon} />
      <h1 className={styles.heading}>Something went wrong</h1>
      <p className={styles.description}>
        An unexpected error occurred. Please try again.
      </p>
      <Button onClick={() => unstable_retry()}>
        <RotateCcw className="size-4" />
        Try again
      </Button>
    </div>
  );
}
