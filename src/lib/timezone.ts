/**
 * Format sunrise/sunset time with both location and user timezone.
 *
 * WeatherAPI returns astro times as strings like "06:45 AM" in the
 * location's local time. We find the actual UTC moment and display
 * both the location's local time and (if different) the user's local time.
 */
export function formatAstroTime(
  timeStr: string,
  locationDate: string,
  locationTzId: string,
  userTzId?: string
): { locationTime: string; userTime: string | null } {
  const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) {
    return { locationTime: timeStr, userTime: null };
  }

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3].toUpperCase();
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  const asIfUtc = new Date(
    `${locationDate}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00Z`
  );
  const locationOffsetMin = getUtcOffsetMinutes(locationTzId, asIfUtc);
  const actualUtc = new Date(asIfUtc.getTime() - locationOffsetMin * 60_000);

  const fmt = (tz: string) =>
    new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(actualUtc);

  const locationFormatted = fmt(locationTzId);
  const userFormatted = userTzId ? fmt(userTzId) : null;

  return {
    locationTime: locationFormatted,
    userTime: userFormatted,
  };
}

/**
 * Returns the UTC offset for `tz` at `date`, in minutes east of UTC.
 * Positive = UTC+, negative = UTC-.
 */
function getUtcOffsetMinutes(tz: string, date: Date): number {
  const utcWall = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }));
  const tzWall = new Date(date.toLocaleString("en-US", { timeZone: tz }));
  return (tzWall.getTime() - utcWall.getTime()) / 60_000;
}
