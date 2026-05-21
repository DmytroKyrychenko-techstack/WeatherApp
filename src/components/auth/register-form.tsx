"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerAction } from "@/lib/actions/auth";

const styles = {
  form: "flex flex-col gap-4",
  fieldGroup: "flex flex-col gap-1.5",
  label: "text-sm font-medium",
  error: "text-sm text-destructive",
  footer: "text-sm text-center text-muted-foreground mt-2",
  footerLink: "text-foreground underline-offset-4 hover:underline",
} as const;

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(registerAction, undefined);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create account</CardTitle>
        <CardDescription>Sign up to save your favorite cities</CardDescription>
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
              placeholder="Min. 8 characters"
              autoComplete="new-password"
              required
              minLength={8}
            />
          </div>
          <div className={styles.fieldGroup}>
            <label htmlFor="confirmPassword" className={styles.label}>
              Confirm password
            </label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              required
            />
          </div>
          {state?.error && !isPending && <p className={styles.error}>{state.error}</p>}
          <Button type="submit" disabled={isPending}>
            {isPending ? "Creating account…" : "Create account"}
          </Button>
        </form>
        <p className={styles.footer}>
          Already have an account?{" "}
          <Link href="/login" className={styles.footerLink}>
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
