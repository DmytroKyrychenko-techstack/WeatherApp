import { describe, it, expect } from "vitest";
import { GET, POST, DELETE } from "@/app/api/favorites/route";
import { createTestUser, makeAuthRequest } from "./helpers";

describe("Favorites API Integration", () => {
  it("GET returns 401 without auth", async () => {
    const request = new Request("http://localhost:3000/api/favorites", {
      method: "GET",
    });
    const response = await GET(request);
    expect(response.status).toBe(401);
  });

  it("GET returns empty array for new user", async () => {
    const { token } = await createTestUser();
    const request = makeAuthRequest("http://localhost:3000/api/favorites", token, {
      method: "GET",
    });
    const response = await GET(request);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual([]);
  });

  it("POST creates a favorite city", async () => {
    const { token } = await createTestUser();
    const request = makeAuthRequest("http://localhost:3000/api/favorites", token, {
      method: "POST",
      body: JSON.stringify({ cityName: "London" }),
    });
    const response = await POST(request);
    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data).toMatchObject({
      cityName: "London",
      id: expect.any(String),
      userId: expect.any(String),
      createdAt: expect.any(String),
    });
  });

  it("GET returns the created favorite", async () => {
    const { token } = await createTestUser();

    const createReq = makeAuthRequest("http://localhost:3000/api/favorites", token, {
      method: "POST",
      body: JSON.stringify({ cityName: "Paris" }),
    });
    await POST(createReq);

    const getReq = makeAuthRequest("http://localhost:3000/api/favorites", token, {
      method: "GET",
    });
    const response = await GET(getReq);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveLength(1);
    expect(data[0].cityName).toBe("Paris");
  });

  it("POST returns 409 when adding duplicate favorite", async () => {
    const { token } = await createTestUser();

    const firstReq = makeAuthRequest("http://localhost:3000/api/favorites", token, {
      method: "POST",
      body: JSON.stringify({ cityName: "Tokyo" }),
    });
    await POST(firstReq);

    const secondReq = makeAuthRequest("http://localhost:3000/api/favorites", token, {
      method: "POST",
      body: JSON.stringify({ cityName: "Tokyo" }),
    });
    const response = await POST(secondReq);
    expect(response.status).toBe(409);
    const data = await response.json();
    expect(data.error).toBe("Already favorited");
  });

  it("DELETE removes a favorite city", async () => {
    const { token } = await createTestUser();

    const createReq = makeAuthRequest("http://localhost:3000/api/favorites", token, {
      method: "POST",
      body: JSON.stringify({ cityName: "Berlin" }),
    });
    await POST(createReq);

    const deleteReq = makeAuthRequest("http://localhost:3000/api/favorites", token, {
      method: "DELETE",
      body: JSON.stringify({ cityName: "Berlin" }),
    });
    const response = await DELETE(deleteReq);
    expect(response.status).toBe(200);

    const getReq = makeAuthRequest("http://localhost:3000/api/favorites", token, {
      method: "GET",
    });
    const getResponse = await GET(getReq);
    const data = await getResponse.json();
    expect(data).toHaveLength(0);
  });

  it("DELETE returns 200 even if city was not favorited", async () => {
    const { token } = await createTestUser();

    const deleteReq = makeAuthRequest("http://localhost:3000/api/favorites", token, {
      method: "DELETE",
      body: JSON.stringify({ cityName: "NonExistent" }),
    });
    const response = await DELETE(deleteReq);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
  });

  it("favorites are user-scoped", async () => {
    const { token: token1 } = await createTestUser();
    const { token: token2 } = await createTestUser();

    const createReq1 = makeAuthRequest("http://localhost:3000/api/favorites", token1, {
      method: "POST",
      body: JSON.stringify({ cityName: "Amsterdam" }),
    });
    await POST(createReq1);

    const getReq2 = makeAuthRequest("http://localhost:3000/api/favorites", token2, {
      method: "GET",
    });
    const response = await GET(getReq2);
    const data = await response.json();
    expect(data).toHaveLength(0);
  });
});
