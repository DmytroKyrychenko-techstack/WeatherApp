import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Favorites — Weather App",
  description:
    "View weather summaries for your saved favorite cities at a glance.",
};

export default function FavoritesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
