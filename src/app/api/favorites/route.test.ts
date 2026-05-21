import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, POST, DELETE } from "./route";

const mockFindMany = vi.fn();
const mockCreate = vi.fn();
const mockDeleteMany = vi.fn();

vi.mock("@/lib/db", () => ({
  getPrisma: () => ({
    favoriteCity: {
      findMany: mockFindMany,
      create: mockCreate,
      deleteMany: mockDeleteMany,
    },
  }),
}));

let mockAuthUser: { id: string; email: string } | null = { id: "user-1", email: "test@test.com" };

vi.mock("@/lib/auth", () => ({
  getAuthUser: () => mockAuthUser,
}));

vi.mock("@/generated/prisma/client", () => {
  class PrismaClientKnownRequestError extends Error {
    code: string;
    clientVersion: string;
    constructor(message: string, { code, clientVersion }: { code: string; clientVersion?: string }) {
      super(message);
      this.code = code;
      this.clientVersion = clientVersion ?? "0.0.0";
    }
  }
  return {
    Prisma: { PrismaClientKnownRequestError },
  };
});

function makeRequest(body?: object, method = "GET"): Request {
  if (body) {
    return new Request("http://localhost/api/favorites", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  }
  return new Request("http://localhost/api/favorites", { method });
}

describe("/api/favorites", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthUser = { id: "user-1", email: "test@test.com" };
  });

  describe("GET", () => {
    it("returns 401 when not authenticated", async () => {
      mockAuthUser = null;
      const res = await GET(makeRequest());
      expect(res.status).toBe(401);
    });

    it("returns list of favorites for authenticated user", async () => {
      mockFindMany.mockResolvedValue([
        { id: "1", cityName: "London", userId: "user-1", createdAt: new Date("2024-01-01") },
        { id: "2", cityName: "Paris", userId: "user-1", createdAt: new Date("2024-01-02") },
      ]);
      const res = await GET(makeRequest());
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toHaveLength(2);
      expect(data[0].cityName).toBe("London");
      expect(data[1].cityName).toBe("Paris");
    });

    it("scopes query to authenticated user", async () => {
      mockFindMany.mockResolvedValue([]);
      await GET(makeRequest());
      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { userId: "user-1" } })
      );
    });
  });

  describe("POST", () => {
    it("returns 401 when not authenticated", async () => {
      mockAuthUser = null;
      const res = await POST(makeRequest({ cityName: "London" }, "POST"));
      expect(res.status).toBe(401);
    });

    it("returns 400 for invalid body", async () => {
      const res = await POST(makeRequest({ cityName: "" }, "POST"));
      expect(res.status).toBe(400);
    });

    it("creates a favorite and returns 201", async () => {
      mockCreate.mockResolvedValue({
        id: "1",
        cityName: "London",
        userId: "user-1",
        createdAt: new Date("2024-01-01"),
      });
      const res = await POST(makeRequest({ cityName: "London" }, "POST"));
      expect(res.status).toBe(201);
      const data = await res.json();
      expect(data.cityName).toBe("London");
    });

    it("returns 409 when city is already favorited (P2002)", async () => {
      const { Prisma } = await import("@/generated/prisma/client");
      mockCreate.mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError("Unique constraint", { code: "P2002", clientVersion: "0.0.0" })
      );
      const res = await POST(makeRequest({ cityName: "London" }, "POST"));
      expect(res.status).toBe(409);
      const data = await res.json();
      expect(data.error).toBe("Already favorited");
    });

    it("returns 400 for invalid JSON", async () => {
      const req = new Request("http://localhost/api/favorites", {
        method: "POST",
        body: "not json",
      });
      const res = await POST(req);
      expect(res.status).toBe(400);
    });
  });

  describe("DELETE", () => {
    it("returns 401 when not authenticated", async () => {
      mockAuthUser = null;
      const res = await DELETE(makeRequest({ cityName: "London" }, "DELETE"));
      expect(res.status).toBe(401);
    });

    it("returns 400 for invalid body", async () => {
      const res = await DELETE(makeRequest({ cityName: "" }, "DELETE"));
      expect(res.status).toBe(400);
    });

    it("deletes a favorite and returns success", async () => {
      mockDeleteMany.mockResolvedValue({ count: 1 });
      const res = await DELETE(makeRequest({ cityName: "London" }, "DELETE"));
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
    });

    it("scopes delete to authenticated user", async () => {
      mockDeleteMany.mockResolvedValue({ count: 1 });
      await DELETE(makeRequest({ cityName: "London" }, "DELETE"));
      expect(mockDeleteMany).toHaveBeenCalledWith({
        where: { userId: "user-1", cityName: "London" },
      });
    });
  });
});
