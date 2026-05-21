import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/layout/navbar";
import { getUser } from "@/lib/dal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Weather App",
  description:
    "Search for weather data by city, view detailed forecasts, and manage favorite cities.",
};

const styles = {
  html: "h-full antialiased",
  body: "min-h-full flex flex-col",
  main: "flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 md:pb-8 pt-6",
} as const;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${styles.html}`}
    >
      <body className={styles.body}>
        <Providers>
          <Navbar user={user} />
          <main className={styles.main}>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
