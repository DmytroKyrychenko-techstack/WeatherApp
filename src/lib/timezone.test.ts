import { describe, it, expect } from "vitest";
import { formatAstroTime } from "./timezone";

describe("formatAstroTime", () => {
  describe("parsing", () => {
    it("parses AM time correctly", () => {
      const result = formatAstroTime("06:45 AM", "2024-06-15", "Europe/London");
      expect(result.locationTime).toContain("6:45");
      expect(result.locationTime).toContain("AM");
    });

    it("parses PM time correctly", () => {
      const result = formatAstroTime("08:30 PM", "2024-06-15", "Europe/London");
      expect(result.locationTime).toContain("8:30");
      expect(result.locationTime).toContain("PM");
    });

    it("handles 12:00 AM (midnight)", () => {
      const result = formatAstroTime("12:00 AM", "2024-06-15", "Europe/London");
      expect(result.locationTime).toContain("12:00");
      expect(result.locationTime).toContain("AM");
    });

    it("handles 12:00 PM (noon)", () => {
      const result = formatAstroTime("12:00 PM", "2024-06-15", "Europe/London");
      expect(result.locationTime).toContain("12:00");
      expect(result.locationTime).toContain("PM");
    });

    it("returns raw string for unparseable input", () => {
      const result = formatAstroTime("invalid", "2024-06-15", "Europe/London");
      expect(result.locationTime).toBe("invalid");
      expect(result.userTime).toBeNull();
    });
  });

  describe("timezone conversion", () => {
    it("returns user time when userTzId is provided", () => {
      const result = formatAstroTime(
        "06:00 AM",
        "2024-06-15",
        "America/New_York",
        "Europe/London"
      );
      expect(result.locationTime).not.toBeNull();
      expect(result.userTime).not.toBeNull();
    });

    it("returns null userTime when userTzId is omitted", () => {
      const result = formatAstroTime("06:00 AM", "2024-06-15", "America/New_York");
      expect(result.userTime).toBeNull();
    });

    it("converts between timezones correctly", () => {
      // 6:00 AM in New York (UTC-4 in June) = 11:00 AM in London (UTC+1 in June)
      const result = formatAstroTime(
        "06:00 AM",
        "2024-06-15",
        "America/New_York",
        "Europe/London"
      );
      expect(result.locationTime).toContain("6:00");
      expect(result.locationTime).toContain("AM");
      expect(result.userTime).toContain("11:00");
      expect(result.userTime).toContain("AM");
    });

    it("handles timezone conversion across day boundary", () => {
      // 11:00 PM in London (UTC+1 in June) = next day 6:00 AM in Asia/Kolkata (UTC+5:30)
      const result = formatAstroTime(
        "11:00 PM",
        "2024-06-15",
        "Europe/London",
        "Asia/Kolkata"
      );
      expect(result.userTime).toContain("3:30");
      expect(result.userTime).toContain("AM");
    });
  });

  describe("formatting", () => {
    it("formats with hour:minute AM/PM pattern", () => {
      const result = formatAstroTime("06:45 AM", "2024-06-15", "UTC");
      expect(result.locationTime).toMatch(/\d{1,2}:\d{2}\s?(AM|PM)/);
    });
  });
});
