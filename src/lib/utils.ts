import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function resolveWeatherIcon(icon: string): string {
  return `https:${icon}`;
}

export function normalizeLocationQuery(query: string): string {
  const coordMatch = query.match(/^(-?\d+\.?\d*),(-?\d+\.?\d*)$/);
  if (coordMatch) {
    const lat = parseFloat(coordMatch[1]).toFixed(2);
    const lon = parseFloat(coordMatch[2]).toFixed(2);
    return `${lat},${lon}`;
  }
  return query.trim().toLowerCase();
}
