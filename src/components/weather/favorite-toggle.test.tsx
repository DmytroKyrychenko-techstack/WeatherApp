import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FavoriteToggle } from "./favorite-toggle";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

let mockIsAuthenticated = true;
let mockIsFavorite = false;
const mockAddFavorite = vi.fn();
const mockRemoveFavorite = vi.fn();

vi.mock("@/hooks/use-auth", () => ({
  useAuth: () => ({ isAuthenticated: mockIsAuthenticated }),
}));

vi.mock("@/hooks/use-favorites", () => ({
  useFavorites: () => ({
    isFavorite: () => mockIsFavorite,
    addFavorite: mockAddFavorite,
    removeFavorite: mockRemoveFavorite,
  }),
}));

describe("FavoriteToggle", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsAuthenticated = true;
    mockIsFavorite = false;
  });

  it("renders add to favorites button when not favorited", () => {
    mockIsFavorite = false;
    render(<FavoriteToggle cityName="London" />);
    expect(screen.getByLabelText("Add to favorites")).toBeInTheDocument();
  });

  it("renders remove from favorites button when favorited", () => {
    mockIsFavorite = true;
    render(<FavoriteToggle cityName="London" />);
    expect(screen.getByLabelText("Remove from favorites")).toBeInTheDocument();
  });

  it("calls addFavorite when clicking unfavorited city", () => {
    mockIsFavorite = false;
    render(<FavoriteToggle cityName="London" />);
    fireEvent.click(screen.getByRole("button"));
    expect(mockAddFavorite).toHaveBeenCalledWith("London");
  });

  it("calls removeFavorite when clicking favorited city", () => {
    mockIsFavorite = true;
    render(<FavoriteToggle cityName="London" />);
    fireEvent.click(screen.getByRole("button"));
    expect(mockRemoveFavorite).toHaveBeenCalledWith("London");
  });

  it("redirects to login when not authenticated", () => {
    mockIsAuthenticated = false;
    render(<FavoriteToggle cityName="London" />);
    fireEvent.click(screen.getByRole("button"));
    expect(mockPush).toHaveBeenCalledWith("/login");
    expect(mockAddFavorite).not.toHaveBeenCalled();
  });

  it("has aria-pressed attribute matching favorite state", () => {
    mockIsFavorite = true;
    render(<FavoriteToggle cityName="London" />);
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
  });
});
