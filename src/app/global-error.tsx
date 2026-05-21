"use client";

import { useEffect } from "react";

const styles = {
  body: "min-h-screen flex flex-col items-center justify-center gap-6 text-center px-4 font-sans bg-background text-foreground",
  heading: "text-2xl font-semibold",
  description: "text-muted-foreground max-w-sm",
  button:
    "inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors",
} as const;

export default function GlobalError({
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
    <html lang="en">
      <body className={styles.body}>
        <title>Error — Weather App</title>
        <h1 className={styles.heading}>Something went wrong</h1>
        <p className={styles.description}>
          A critical error occurred. Please try again.
        </p>
        <button onClick={() => unstable_retry()} className={styles.button}>
          Try again
        </button>
      </body>
    </html>
  );
}
