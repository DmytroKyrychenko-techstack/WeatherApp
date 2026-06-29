export type TemperatureUnit = "celsius" | "fahrenheit";

export function toFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32;
}

export function toCelsius(fahrenheit: number): number {
  return ((fahrenheit - 32) * 5) / 9;
}

export function convertTemp(
  value: number,
  fromUnit: TemperatureUnit,
  toUnit: TemperatureUnit
): number {
  if (fromUnit === toUnit) return value;
  if (fromUnit === "celsius" && toUnit === "fahrenheit") return toFahrenheit(value);
  return toCelsius(value);
}

export function formatTemp(value: number, unit: TemperatureUnit): string {
  return `${Math.round(value)}°${unit === "celsius" ? "C" : "F"}`;
}
