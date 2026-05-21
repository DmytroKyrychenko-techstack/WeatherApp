import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Log in — Weather App",
  description: "Sign in to your Weather App account to access your favorites and search history.",
};

export default function LoginPage() {
  return <LoginForm />;
}
