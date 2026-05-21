import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Register — Weather App",
  description: "Create a Weather App account to save favorite cities and track your search history.",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
