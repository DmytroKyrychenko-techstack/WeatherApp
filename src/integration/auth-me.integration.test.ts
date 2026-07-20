import { describe, it, expect } from "vitest";
import { GET } from "@/app/api/auth/me/route";
import { createTestUser, makeAuthRequest } from "./helpers";

describe("GET /api/auth/me Integration", () => {
  it("returns 401 without auth cookie", async () => {
    const request = new Request("http://localhost:3000/api/auth/me", {
      method: "GET",
    });
    const response = await GET(request);
    expect(response.status).toBe(401);
  });

  it("returns user data with valid JWT cookie", async () => {
    const { user, token } = await createTestUser();
    const request = makeAuthRequest("http://localhost:3000/api/auth/me", token, {
      method: "GET",
    });
    const response = await GET(request);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toMatchObject({
      id: user.id,
      email: user.email,
      createdAt: expect.any(String),
    });
  });

  it("returns 401 with syntactically invalid token", async () => {
    const request = makeAuthRequest(
      "http://localhost:3000/api/auth/me",
      "not.a.valid.jwt",
      {
        method: "GET",
      }
    );
    const response = await GET(request);
    expect(response.status).toBe(401);
  });

  it("returns 401 with JWT signed with wrong secret", async () => {
    const wrongToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0IiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIn0.wrong_signature";
    const request = makeAuthRequest(
      "http://localhost:3000/api/auth/me",
      wrongToken,
      {
        method: "GET",
      }
    );
    const response = await GET(request);
    expect(response.status).toBe(401);
  });

});
