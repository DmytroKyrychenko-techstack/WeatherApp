"use client";

import { MapPin, MapPinOff, Globe } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type GeoPromptStatus = "idle" | "denied" | "unavailable";

interface GeoPromptProps {
  status: GeoPromptStatus;
  onRequestPermission: () => void;
}

const config = {
  idle: {
    icon: MapPin,
    title: "See your local weather",
    description:
      "Allow location access to automatically show the weather for your current area.",
    buttonText: "Enable Location",
    buttonVariant: "default" as const,
  },
  denied: {
    icon: MapPinOff,
    title: "Location access denied",
    description:
      "Location permission was denied. You can enable it in your browser settings, or try requesting access again.",
    buttonText: "Try Again",
    buttonVariant: "outline" as const,
  },
  unavailable: {
    icon: Globe,
    title: "Geolocation not available",
    description:
      "Your browser doesn't support geolocation. Use the search bar above to find weather for any city.",
    buttonText: "",
    buttonVariant: "outline" as const,
  },
} as const;

const styles = {
  card: "w-full max-w-md mx-auto text-center",
  iconWrapper: "flex justify-center mb-2",
  icon: "size-10 text-muted-foreground",
  content: "flex flex-col items-center gap-4",
} as const;

export function GeoPrompt({ status, onRequestPermission }: GeoPromptProps) {
  const { icon: Icon, title, description, buttonText, buttonVariant } =
    config[status];

  return (
    <Card className={styles.card}>
      <CardHeader>
        <div className={styles.iconWrapper}>
          <Icon className={styles.icon} />
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      {buttonText && (
        <CardContent>
          <div className={styles.content}>
            <Button variant={buttonVariant} onClick={onRequestPermission}>
              <MapPin className="size-4" />
              {buttonText}
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
