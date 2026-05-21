import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SearchBar } from "./search-bar";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock("@/hooks/use-auth", () => ({
  useAuth: () => ({ isAuthenticated: true, user: { email: "test@test.com" }, isLoading: false }),
}));

const mockAddToHistory = vi.fn();
vi.mock("@/hooks/use-search-history", () => ({
  useSearchHistory: () => ({
    history: [],
    addToHistory: mockAddToHistory,
  }),
}));

let mockSearchResults: { id: number; name: string; region: string; country: string }[] = [];
let mockIsLoading = false;

vi.mock("@/hooks/use-weather", () => ({
  useCitySearch: () => ({
    data: mockSearchResults,
    isLoading: mockIsLoading,
  }),
}));

vi.mock("@/hooks/use-debounce", () => ({
  useDebounce: (value: string) => value,
}));

describe("SearchBar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchResults = [];
    mockIsLoading = false;
  });

  it("renders search input", () => {
    render(<SearchBar />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search for a city...")).toBeInTheDocument();
  });

  it("shows autocomplete dropdown when typing 3+ chars with results", () => {
    mockSearchResults = [
      { id: 1, name: "London", region: "City of London", country: "UK" },
    ];
    render(<SearchBar />);
    const input = screen.getByRole("combobox");
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "Lon" } });
    expect(screen.getByText("London")).toBeInTheDocument();
    expect(screen.getByText("City of London, UK")).toBeInTheDocument();
  });

  it("shows no results message when no cities match", () => {
    mockSearchResults = [];
    render(<SearchBar />);
    const input = screen.getByRole("combobox");
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "xyz" } });
    expect(screen.getByText("No cities found")).toBeInTheDocument();
  });

  it("navigates to weather page on city selection", () => {
    mockSearchResults = [
      { id: 1, name: "London", region: "City of London", country: "UK" },
    ];
    render(<SearchBar />);
    const input = screen.getByRole("combobox");
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "Lon" } });
    fireEvent.mouseDown(screen.getByText("London"));
    expect(mockPush).toHaveBeenCalledWith("/weather/London");
  });

  it("records search history on city selection", () => {
    mockSearchResults = [
      { id: 1, name: "Paris", region: "Ile-de-France", country: "France" },
    ];
    render(<SearchBar />);
    const input = screen.getByRole("combobox");
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "Par" } });
    fireEvent.mouseDown(screen.getByText("Paris"));
    expect(mockAddToHistory).toHaveBeenCalledWith("Paris");
  });

  it("supports keyboard navigation with ArrowDown and Enter", () => {
    mockSearchResults = [
      { id: 1, name: "Berlin", region: "Berlin", country: "Germany" },
      { id: 2, name: "Bern", region: "Bern", country: "Switzerland" },
    ];
    render(<SearchBar />);
    const input = screen.getByRole("combobox");
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "Ber" } });
    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(mockPush).toHaveBeenCalledWith("/weather/Berlin");
  });

  it("closes dropdown on Escape", () => {
    mockSearchResults = [
      { id: 1, name: "Tokyo", region: "Tokyo", country: "Japan" },
    ];
    render(<SearchBar />);
    const input = screen.getByRole("combobox");
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "Tok" } });
    expect(screen.getByText("Tokyo")).toBeInTheDocument();
    fireEvent.keyDown(input, { key: "Escape" });
    expect(screen.queryByText("Tokyo")).not.toBeInTheDocument();
  });
});
