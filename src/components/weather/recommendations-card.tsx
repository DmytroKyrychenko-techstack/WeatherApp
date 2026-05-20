import type { LucideIcon } from "lucide-react";
import {
  Umbrella,
  ThermometerSun,
  Snowflake,
  Sun,
  ShieldAlert,
  Wind,
  EyeOff,
  Smile,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getRecommendations } from "@/lib/recommendations";
import type { CurrentWeather, WeatherRecommendation } from "@/types/weather";

interface RecommendationsCardProps {
  current: CurrentWeather;
}

const ICON_MAP: Record<string, LucideIcon> = {
  umbrella: Umbrella,
  "thermometer-sun": ThermometerSun,
  snowflake: Snowflake,
  sun: Sun,
  "shield-alert": ShieldAlert,
  wind: Wind,
  "eye-off": EyeOff,
  smile: Smile,
};

const SEVERITY_STYLES: Record<
  WeatherRecommendation["severity"],
  { item: string; icon: string }
> = {
  info: {
    item: "border-blue-500/30 bg-blue-500/10",
    icon: "text-blue-500",
  },
  warning: {
    item: "border-yellow-500/30 bg-yellow-500/10",
    icon: "text-yellow-500",
  },
  danger: {
    item: "border-red-500/30 bg-red-500/10",
    icon: "text-red-500",
  },
};

const styles = {
  card: "w-full",
  list: "flex flex-col gap-2",
  item: "flex items-start gap-3 rounded-lg border px-3 py-2.5",
  iconWrapper: "mt-0.5 shrink-0",
  icon: "size-4",
  text: "text-sm leading-snug",
} as const;

export function RecommendationsCard({ current }: RecommendationsCardProps) {
  const recommendations = getRecommendations(current);

  if (recommendations.length === 0) return null;

  return (
    <Card className={styles.card}>
      <CardHeader>
        <CardTitle className="text-base">Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className={styles.list}>
          {recommendations.map((rec) => {
            const Icon = ICON_MAP[rec.icon] ?? Sun;
            const severityStyle = SEVERITY_STYLES[rec.severity];
            return (
              <li
                key={rec.text}
                className={cn(styles.item, severityStyle.item)}
              >
                <span className={styles.iconWrapper}>
                  <Icon className={cn(styles.icon, severityStyle.icon)} />
                </span>
                <p className={styles.text}>{rec.text}</p>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
