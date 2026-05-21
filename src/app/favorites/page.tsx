"use client";

import { Heart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { FavoriteCityCard } from "@/components/favorites/favorite-city-card";
import { useFavorites } from "@/hooks/use-favorites";

const styles = {
  root: "flex flex-col gap-6 pb-20 md:pb-0",
  heading: "text-2xl font-semibold",
  grid: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4",
  emptyRoot: "flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4",
  emptyIcon: "size-12 text-muted-foreground/30",
  emptyHeading: "text-2xl font-semibold",
  emptyDesc: "text-muted-foreground max-w-xs",
  skeletonCard: "h-32 rounded-xl",
} as const;

function FavoritesGridSkeleton() {
  return (
    <div className={styles.grid}>
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className={styles.skeletonCard} />
      ))}
    </div>
  );
}

function FavoritesEmptyState() {
  return (
    <div className={styles.emptyRoot}>
      <Heart className={styles.emptyIcon} />
      <h1 className={styles.emptyHeading}>No favorites yet</h1>
      <p className={styles.emptyDesc}>
        Search for a city and tap the heart icon to save it here.
      </p>
    </div>
  );
}

export default function FavoritesPage() {
  const { favorites, isLoading, removeFavorite } = useFavorites();

  if (isLoading) {
    return (
      <div className={styles.root}>
        <h1 className={styles.heading}>Favorites</h1>
        <FavoritesGridSkeleton />
      </div>
    );
  }

  if (favorites.length === 0) {
    return <FavoritesEmptyState />;
  }

  return (
    <div className={styles.root}>
      <h1 className={styles.heading}>Favorites</h1>
      <div className={styles.grid}>
        {favorites.map((cityName) => (
          <FavoriteCityCard
            key={cityName}
            cityName={cityName}
            onRemove={() => removeFavorite(cityName)}
          />
        ))}
      </div>
    </div>
  );
}
