import { describe, it, expect } from "vitest";
import { GET, POST } from "@/app/api/history/route";

describe("Search History API Integration", () => {
  it("GET returns 401 without auth", async () => {
    const request = new Request("http://localhost:3000/api/history", {
      method: "GET",
    });
    const response = await GET(request);
    expect(response.status).toBe(401);
  });

  it("POST returns 401 without auth", async () => {
    const request = new Request("http://localhost:3000/api/history", {
      method: "POST",
      body: JSON.stringify({ searchTerm: "London" }),
    });
    const response = await POST(request);
    expect(response.status).toBe(401);
  });

});
