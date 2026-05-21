"use client";

import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useFavorites } from "@/hooks/use-favorites";

interface FavoriteToggleProps {
  cityName: string;
}

const styles = {
  btn: "transition-colors",
  active: "text-rose-500 hover:text-rose-600",
  icon: "size-5",
  iconFilled: "fill-current",
} as const;

export function FavoriteToggle({ cityName }: FavoriteToggleProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const favorited = isFavorite(cityName);

  function handleClick() {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (favorited) {
      removeFavorite(cityName);
    } else {
      addFavorite(cityName);
    }
  }

  return (
    <button
      onClick={handleClick}
      aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
      aria-pressed={favorited}
      className={cn(
        buttonVariants({ variant: "ghost", size: "icon" }),
        styles.btn,
        favorited && styles.active
      )}
    >
      <Heart className={cn(styles.icon, favorited && styles.iconFilled)} />
    </button>
  );
}
