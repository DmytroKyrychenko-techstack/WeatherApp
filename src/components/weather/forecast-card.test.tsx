import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ForecastCard, ForecastGrid } from "./forecast-card";
import type { ForecastDay } from "@/types/weather";

function makeForecastDay(overrides: Partial<ForecastDay> = {}): ForecastDay {
  return {
    date: "2024-06-15",
    date_epoch: 1718409600,
    day: {
      maxtemp_c: 28,
      maxtemp_f: 82,
      mintemp_c: 18,
      mintemp_f: 64,
      avgtemp_c: 23,
      avgtemp_f: 73,
      maxwind_mph: 12,
      maxwind_kph: 19,
      totalprecip_mm: 0,
      totalprecip_in: 0,
      avgvis_km: 10,
      avgvis_miles: 6,
      avghumidity: 55,
      daily_will_it_rain: 0,
      daily_chance_of_rain: 0,
      daily_will_it_snow: 0,
      daily_chance_of_snow: 0,
      condition: { text: "Sunny", icon: "//cdn.weatherapi.com/64x64/day/113.png", code: 1000 },
      uv: 5,
    },
    astro: {
      sunrise: "05:45 AM",
      sunset: "09:15 PM",
      moonrise: "11:00 PM",
      moonset: "06:00 AM",
      moon_phase: "Waxing Crescent",
      moon_illumination: 25,
    },
    hour: [],
    ...overrides,
  };
}

describe("ForecastCard", () => {
  it("renders day name from date", () => {
    const day = makeForecastDay({ date: "2024-06-15" }); // Saturday
    render(<ForecastCard day={day} />);
    expect(screen.getByText("Saturday")).toBeInTheDocument();
  });

  it("renders high and low temperatures rounded", () => {
    const day = makeForecastDay();
    day.day.maxtemp_c = 28.7;
    day.day.mintemp_c = 17.3;
    render(<ForecastCard day={day} />);
    expect(screen.getByText("29°")).toBeInTheDocument();
    expect(screen.getByText("17°")).toBeInTheDocument();
  });

  it("renders condition text", () => {
    const day = makeForecastDay();
    day.day.condition.text = "Partly Cloudy";
    render(<ForecastCard day={day} />);
    expect(screen.getByText("Partly Cloudy")).toBeInTheDocument();
  });

  it("renders weather icon with alt text", () => {
    const day = makeForecastDay();
    day.day.condition.text = "Sunny";
    render(<ForecastCard day={day} />);
    expect(screen.getByAltText("Sunny")).toBeInTheDocument();
  });

  it("shows rain badge when chance > 0", () => {
    const day = makeForecastDay();
    day.day.daily_chance_of_rain = 60;
    render(<ForecastCard day={day} />);
    expect(screen.getByText("60% rain")).toBeInTheDocument();
  });

  it("does not show rain badge when chance is 0", () => {
    const day = makeForecastDay();
    day.day.daily_chance_of_rain = 0;
    render(<ForecastCard day={day} />);
    expect(screen.queryByText(/rain/)).not.toBeInTheDocument();
  });
});

describe("ForecastGrid", () => {
  it("renders multiple forecast cards", () => {
    const days = [
      makeForecastDay({ date: "2024-06-15" }),
      makeForecastDay({ date: "2024-06-16" }),
      makeForecastDay({ date: "2024-06-17" }),
    ];
    render(<ForecastGrid days={days} />);
    expect(screen.getByText("Saturday")).toBeInTheDocument();
    expect(screen.getByText("Sunday")).toBeInTheDocument();
    expect(screen.getByText("Monday")).toBeInTheDocument();
  });
});
