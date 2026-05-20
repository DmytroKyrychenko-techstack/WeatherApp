import { Heart } from "lucide-react";

const styles = {
  root: "flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4",
  icon: "size-12 text-muted-foreground/30",
  heading: "text-2xl font-semibold",
  description: "text-muted-foreground max-w-xs",
} as const;

export default function FavoritesPage() {
  return (
    <div className={styles.root}>
      <Heart className={styles.icon} />
      <h1 className={styles.heading}>Favorites</h1>
      <p className={styles.description}>
        Save cities as favorites to quickly check their weather.
      </p>
    </div>
  );
}
