"use client";

import { Sunrise, Sunset, Moon, MoonStar } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatAstroTime } from "@/lib/timezone";
import type { ForecastDay } from "@/types/weather";

interface AstronomyCardProps {
  astro: ForecastDay["astro"];
  locationDate: string;
  locationTzId: string;
}

const styles = {
  card: "w-full",
  grid: "grid grid-cols-1 sm:grid-cols-2 gap-6",
  section: "flex flex-col gap-3",
  sectionHeading:
    "text-sm font-semibold text-muted-foreground uppercase tracking-wide",
  eventRow: "flex items-start gap-3",
  eventIcon: "size-5 shrink-0 mt-0.5 text-muted-foreground",
  eventTextBlock: "flex flex-col",
  eventLabel: "text-xs text-muted-foreground leading-none mb-0.5",
  eventTime: "text-sm font-medium",
  eventUserTime: "text-xs text-muted-foreground mt-0.5",
  moonPhaseRow: "flex items-center gap-2 pt-2 border-t mt-1",
  moonPhaseLabel: "text-xs text-muted-foreground",
  moonPhaseValue: "text-sm font-medium",
  moonIllumination: "text-xs text-muted-foreground",
} as const;

export function AstronomyCard({
  astro,
  locationDate,
  locationTzId,
}: AstronomyCardProps) {
  const userTzId = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const sunrise = formatAstroTime(
    astro.sunrise,
    locationDate,
    locationTzId,
    userTzId
  );
  const sunset = formatAstroTime(
    astro.sunset,
    locationDate,
    locationTzId,
    userTzId
  );
  const moonrise = formatAstroTime(
    astro.moonrise,
    locationDate,
    locationTzId,
    userTzId
  );
  const moonset = formatAstroTime(
    astro.moonset,
    locationDate,
    locationTzId,
    userTzId
  );

  return (
    <Card className={styles.card}>
      <CardHeader>
        <CardTitle className="text-base">Sun &amp; Moon</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={styles.grid}>
          <div className={styles.section}>
            <p className={styles.sectionHeading}>Sun</p>

            <div className={styles.eventRow}>
              <Sunrise className={styles.eventIcon} />
              <div className={styles.eventTextBlock}>
                <span className={styles.eventLabel}>Sunrise</span>
                <span className={styles.eventTime}>{sunrise.locationTime}</span>
                <span className={styles.eventUserTime}>{sunrise.userTime} your time</span>
              </div>
            </div>

            <div className={styles.eventRow}>
              <Sunset className={styles.eventIcon} />
              <div className={styles.eventTextBlock}>
                <span className={styles.eventLabel}>Sunset</span>
                <span className={styles.eventTime}>{sunset.locationTime}</span>
                <span className={styles.eventUserTime}>{sunset.userTime} your time</span>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <p className={styles.sectionHeading}>Moon</p>

            <div className={styles.eventRow}>
              <MoonStar className={styles.eventIcon} />
              <div className={styles.eventTextBlock}>
                <span className={styles.eventLabel}>Moonrise</span>
                <span className={styles.eventTime}>{moonrise.locationTime}</span>
                <span className={styles.eventUserTime}>{moonrise.userTime} your time</span>
              </div>
            </div>

            <div className={styles.eventRow}>
              <Moon className={styles.eventIcon} />
              <div className={styles.eventTextBlock}>
                <span className={styles.eventLabel}>Moonset</span>
                <span className={styles.eventTime}>{moonset.locationTime}</span>
                <span className={styles.eventUserTime}>{moonset.userTime} your time</span>
              </div>
            </div>

            <div className={styles.moonPhaseRow}>
              <span className={styles.moonPhaseLabel}>Phase:</span>
              <span className={styles.moonPhaseValue}>{astro.moon_phase}</span>
              <span className={styles.moonIllumination}>
                ({astro.moon_illumination}% illuminated)
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
