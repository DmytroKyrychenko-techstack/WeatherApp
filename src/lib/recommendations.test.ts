import { describe, it, expect } from "vitest";
import { getRecommendations } from "./recommendations";
import type { CurrentWeather } from "@/types/weather";

function makeWeather(overrides: Partial<CurrentWeather> = {}): CurrentWeather {
  return {
    last_updated_epoch: 0,
    last_updated: "",
    temp_c: 20,
    temp_f: 68,
    is_day: 1,
    condition: { text: "Sunny", icon: "", code: 1000 },
    wind_mph: 10,
    wind_kph: 16,
    wind_degree: 0,
    wind_dir: "N",
    pressure_mb: 1013,
    pressure_in: 29.92,
    precip_mm: 0,
    precip_in: 0,
    humidity: 50,
    cloud: 0,
    feelslike_c: 20,
    feelslike_f: 68,
    windchill_c: 20,
    windchill_f: 68,
    heatindex_c: 20,
    heatindex_f: 68,
    dewpoint_c: 10,
    dewpoint_f: 50,
    vis_km: 10,
    vis_miles: 6,
    uv: 3,
    gust_mph: 15,
    gust_kph: 24,
    ...overrides,
  };
}

describe("getRecommendations", () => {
  describe("rain/precipitation conditions", () => {
    it.each(["Light rain", "Heavy drizzle", "Blizzard", "Thunderstorm", "Sleet"])(
      "returns umbrella recommendation for '%s'",
      (text) => {
        const result = getRecommendations(
          makeWeather({ condition: { text, icon: "", code: 0 } })
        );
        expect(result).toContainEqual(
          expect.objectContaining({ icon: "umbrella", severity: "warning" })
        );
      }
    );
  });

  describe("extreme heat (> 35°C)", () => {
    it("returns heat warning", () => {
      const result = getRecommendations(makeWeather({ temp_c: 40 }));
      expect(result).toContainEqual(
        expect.objectContaining({ icon: "thermometer-sun", severity: "danger" })
      );
    });

    it("does not trigger at exactly 35°C", () => {
      const result = getRecommendations(makeWeather({ temp_c: 35 }));
      expect(result).not.toContainEqual(
        expect.objectContaining({ icon: "thermometer-sun" })
      );
    });
  });

  describe("cold (< 10°C)", () => {
    it("returns cold warning", () => {
      const result = getRecommendations(makeWeather({ temp_c: 5 }));
      expect(result).toContainEqual(
        expect.objectContaining({ icon: "snowflake", severity: "warning" })
      );
    });

    it("does not trigger at exactly 10°C", () => {
      const result = getRecommendations(makeWeather({ temp_c: 10 }));
      expect(result).not.toContainEqual(
        expect.objectContaining({ icon: "snowflake" })
      );
    });
  });

  describe("sunny/hot (25°C < temp <= 35°C)", () => {
    it("returns sunscreen recommendation at 30°C", () => {
      const result = getRecommendations(makeWeather({ temp_c: 30 }));
      expect(result).toContainEqual(
        expect.objectContaining({ icon: "sun", severity: "info" })
      );
    });

    it("does not trigger at exactly 25°C", () => {
      const result = getRecommendations(makeWeather({ temp_c: 25 }));
      expect(result).not.toContainEqual(
        expect.objectContaining({ icon: "sun" })
      );
    });

    it("does not trigger above 35°C (extreme heat takes over)", () => {
      const result = getRecommendations(makeWeather({ temp_c: 36 }));
      expect(result).not.toContainEqual(
        expect.objectContaining({ icon: "sun" })
      );
    });
  });

  describe("high UV (> 6)", () => {
    it("returns UV warning", () => {
      const result = getRecommendations(makeWeather({ uv: 8 }));
      expect(result).toContainEqual(
        expect.objectContaining({ icon: "shield-alert", severity: "warning" })
      );
    });

    it("does not trigger at exactly 6", () => {
      const result = getRecommendations(makeWeather({ uv: 6 }));
      expect(result).not.toContainEqual(
        expect.objectContaining({ icon: "shield-alert" })
      );
    });
  });

  describe("strong wind (> 40 km/h)", () => {
    it("returns wind warning", () => {
      const result = getRecommendations(makeWeather({ wind_kph: 50 }));
      expect(result).toContainEqual(
        expect.objectContaining({ icon: "wind", severity: "info" })
      );
    });

    it("does not trigger at exactly 40 km/h", () => {
      const result = getRecommendations(makeWeather({ wind_kph: 40 }));
      expect(result).not.toContainEqual(
        expect.objectContaining({ icon: "wind" })
      );
    });
  });

  describe("fog/mist conditions", () => {
    it.each(["Fog", "Mist", "Freezing fog", "Haze"])(
      "returns visibility warning for '%s'",
      (text) => {
        const result = getRecommendations(
          makeWeather({ condition: { text, icon: "", code: 0 } })
        );
        expect(result).toContainEqual(
          expect.objectContaining({ icon: "eye-off", severity: "warning" })
        );
      }
    );
  });

  describe("mild fallback", () => {
    it("returns outdoor activities message when no other conditions match", () => {
      const result = getRecommendations(makeWeather());
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({ icon: "smile", severity: "info" });
    });
  });

  describe("multiple simultaneous recommendations", () => {
    it("returns multiple when conditions overlap", () => {
      const result = getRecommendations(
        makeWeather({
          temp_c: 5,
          wind_kph: 50,
          uv: 8,
          condition: { text: "Light rain", icon: "", code: 0 },
        })
      );
      expect(result.length).toBeGreaterThanOrEqual(3);
      const icons = result.map((r) => r.icon);
      expect(icons).toContain("umbrella");
      expect(icons).toContain("snowflake");
      expect(icons).toContain("wind");
    });
  });
});
