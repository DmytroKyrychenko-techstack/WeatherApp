import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, POST } from "./route";

const mockFindMany = vi.fn();
const mockFindFirst = vi.fn();
const mockCreate = vi.fn();
const mockUpdate = vi.fn();
const mockCount = vi.fn();
const mockDelete = vi.fn();
const mockTransaction = vi.fn();

vi.mock("@/lib/db", () => ({
  getPrisma: () => ({
    searchHistory: {
      findMany: mockFindMany,
    },
    $transaction: mockTransaction,
  }),
}));

let mockAuthUser: { id: string; email: string } | null = { id: "user-1", email: "test@test.com" };

vi.mock("@/lib/auth", () => ({
  getAuthUser: () => mockAuthUser,
}));

function makeRequest(body?: object, method = "GET"): Request {
  if (body) {
    return new Request("http://localhost/api/history", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  }
  return new Request("http://localhost/api/history", { method });
}

describe("/api/history", () => {
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

    it("returns search history for authenticated user", async () => {
      mockFindMany.mockResolvedValue([
        { id: "1", searchTerm: "London", userId: "user-1", timestamp: new Date("2024-01-02") },
        { id: "2", searchTerm: "Paris", userId: "user-1", timestamp: new Date("2024-01-01") },
      ]);
      const res = await GET(makeRequest());
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toHaveLength(2);
      expect(data[0].searchTerm).toBe("London");
      expect(data[1].searchTerm).toBe("Paris");
    });

    it("limits to 5 results ordered by newest first", async () => {
      mockFindMany.mockResolvedValue([]);
      await GET(makeRequest());
      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 5,
          orderBy: { timestamp: "desc" },
        })
      );
    });
  });

  describe("POST", () => {
    it("returns 401 when not authenticated", async () => {
      mockAuthUser = null;
      const res = await POST(makeRequest({ searchTerm: "London" }, "POST"));
      expect(res.status).toBe(401);
    });

    it("returns 400 for invalid body", async () => {
      const res = await POST(makeRequest({ searchTerm: "" }, "POST"));
      expect(res.status).toBe(400);
    });

    it("creates history record and returns 201", async () => {
      const record = {
        id: "1",
        searchTerm: "London",
        userId: "user-1",
        timestamp: new Date("2024-01-01"),
      };
      mockTransaction.mockImplementation(async (fn) => {
        return fn({
          searchHistory: {
            findFirst: vi.fn().mockResolvedValue(null),
            count: vi.fn().mockResolvedValue(0),
            create: vi.fn().mockResolvedValue(record),
          },
        });
      });
      const res = await POST(makeRequest({ searchTerm: "London" }, "POST"));
      expect(res.status).toBe(201);
      const data = await res.json();
      expect(data.searchTerm).toBe("London");
    });

    it("updates timestamp for existing search term", async () => {
      const existing = {
        id: "1",
        searchTerm: "London",
        userId: "user-1",
        timestamp: new Date("2024-01-01"),
      };
      const updated = { ...existing, timestamp: new Date("2024-01-02") };
      mockTransaction.mockImplementation(async (fn) => {
        return fn({
          searchHistory: {
            findFirst: vi.fn().mockResolvedValue(existing),
            update: vi.fn().mockResolvedValue(updated),
          },
        });
      });
      const res = await POST(makeRequest({ searchTerm: "London" }, "POST"));
      expect(res.status).toBe(201);
    });

    it("removes oldest when at max capacity", async () => {
      const mockDeleteFn = vi.fn().mockResolvedValue({});
      const newRecord = {
        id: "6",
        searchTerm: "Tokyo",
        userId: "user-1",
        timestamp: new Date("2024-01-06"),
      };
      mockTransaction.mockImplementation(async (fn) => {
        return fn({
          searchHistory: {
            findFirst: vi.fn()
              .mockResolvedValueOnce(null) // no existing
              .mockResolvedValueOnce({ id: "oldest" }), // oldest record
            count: vi.fn().mockResolvedValue(5),
            delete: mockDeleteFn,
            create: vi.fn().mockResolvedValue(newRecord),
          },
        });
      });
      const res = await POST(makeRequest({ searchTerm: "Tokyo" }, "POST"));
      expect(res.status).toBe(201);
      expect(mockDeleteFn).toHaveBeenCalledWith({ where: { id: "oldest" } });
    });

    it("returns 400 for invalid JSON", async () => {
      const req = new Request("http://localhost/api/history", {
        method: "POST",
        body: "not json",
      });
      const res = await POST(req);
      expect(res.status).toBe(400);
    });
  });
});
