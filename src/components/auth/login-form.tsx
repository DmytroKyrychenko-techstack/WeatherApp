"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginAction } from "@/lib/actions/auth";

const styles = {
  form: "flex flex-col gap-4",
  fieldGroup: "flex flex-col gap-1.5",
  label: "text-sm font-medium",
  error: "text-sm text-destructive",
  footer: "text-sm text-center text-muted-foreground mt-2",
  footerLink: "text-foreground underline-offset-4 hover:underline",
} as const;

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, undefined);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Enter your email and password to continue</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className={styles.form}>
          <div className={styles.fieldGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>
          <div className={styles.fieldGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </div>
          {state?.error && !isPending && <p className={styles.error}>{state.error}</p>}
          <Button type="submit" disabled={isPending}>
            {isPending ? "Signing in…" : "Sign in"}
          </Button>
        </form>
        <p className={styles.footer}>
          No account?{" "}
          <Link href="/register" className={styles.footerLink}>
            Create one
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
