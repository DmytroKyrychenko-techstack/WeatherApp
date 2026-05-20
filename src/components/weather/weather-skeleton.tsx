import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const styles = {
  card: "w-full",
  headerRow: "flex items-start justify-between",
  locationBlock: "space-y-2",
  weatherBlock: "flex items-center gap-4 mt-2",
  statsGrid: "grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4",
  statItem: "space-y-1.5",
  forecastGrid: "grid grid-cols-1 sm:grid-cols-3 gap-4",
  forecastCard: "w-full",
  forecastContent: "flex flex-col items-center gap-3",
} as const;

export function CurrentWeatherSkeleton() {
  return (
    <Card className={styles.card}>
      <CardHeader>
        <div className={styles.headerRow}>
          <div className={styles.locationBlock}>
            <Skeleton className="h-7 w-40" />
            <Skeleton className="h-4 w-28" />
          </div>
          <Skeleton className="h-8 w-24 rounded-lg" />
        </div>
      </CardHeader>
      <CardContent>
        <div className={styles.weatherBlock}>
          <Skeleton className="size-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-12 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className={styles.statsGrid}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={styles.statItem}>
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-5 w-12" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function ForecastGridSkeleton() {
  return (
    <div className={styles.forecastGrid}>
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className={styles.forecastCard}>
          <CardHeader>
            <Skeleton className="h-5 w-24 mx-auto" />
          </CardHeader>
          <CardContent>
            <div className={styles.forecastContent}>
              <Skeleton className="size-12 rounded-full" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-4 w-28" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
