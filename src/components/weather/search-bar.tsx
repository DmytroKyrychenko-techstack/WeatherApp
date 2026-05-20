"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { useCitySearch } from "@/hooks/use-weather";
import { cn } from "@/lib/utils";
import type { SearchResult } from "@/types/weather";

const styles = {
  wrapper: "relative w-full max-w-lg mx-auto",
  inputWrapper: "relative",
  searchIcon:
    "pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground",
  input: "pl-9 h-10",
  spinner:
    "absolute right-2.5 top-1/2 -translate-y-1/2 size-4 animate-spin text-muted-foreground",
  dropdown:
    "absolute top-full left-0 right-0 z-50 mt-1 max-h-64 overflow-y-auto rounded-lg border bg-popover text-popover-foreground shadow-lg",
  dropdownItem:
    "flex flex-col gap-0.5 px-3 py-2.5 cursor-pointer transition-colors hover:bg-muted min-h-[44px] justify-center",
  dropdownItemActive: "bg-muted",
  cityName: "text-sm font-medium",
  cityRegion: "text-xs text-muted-foreground",
  noResults: "px-3 py-4 text-sm text-center text-muted-foreground",
} as const;

export function SearchBar() {
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const debouncedValue = useDebounce(inputValue);
  const { data: results, isLoading } = useCitySearch(debouncedValue);

  const showDropdown = isOpen && inputValue.length >= 2;

  const selectCity = useCallback(
    (city: SearchResult) => {
      setInputValue("");
      setIsOpen(false);
      setHighlightIndex(-1);
      inputRef.current?.blur();
      router.push(`/weather/${encodeURIComponent(city.name)}`);
    },
    [router]
  );

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!showDropdown || !results?.length) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightIndex((prev) =>
          prev < results.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightIndex((prev) =>
          prev > 0 ? prev - 1 : results.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlightIndex >= 0 && results[highlightIndex]) {
          selectCity(results[highlightIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setHighlightIndex(-1);
        break;
    }
  }

  return (
    <div
      className={styles.wrapper}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setIsOpen(false);
          setHighlightIndex(-1);
        }
      }}
    >
      <div className={styles.inputWrapper}>
        <Search className={styles.searchIcon} />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search for a city..."
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setIsOpen(true);
            setHighlightIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className={styles.input}
          aria-label="Search for a city"
          aria-expanded={showDropdown}
          aria-autocomplete="list"
          role="combobox"
        />
        {isLoading && debouncedValue.length >= 2 && (
          <Loader2 className={styles.spinner} />
        )}
      </div>

      {showDropdown && (
        <div className={styles.dropdown} role="listbox">
          {results && results.length > 0
            ? results.map((city, index) => (
                <div
                  key={city.id}
                  role="option"
                  aria-selected={index === highlightIndex}
                  className={cn(
                    styles.dropdownItem,
                    index === highlightIndex && styles.dropdownItemActive
                  )}
                  onMouseDown={() => selectCity(city)}
                  onMouseEnter={() => setHighlightIndex(index)}
                >
                  <span className={styles.cityName}>{city.name}</span>
                  <span className={styles.cityRegion}>
                    {city.region}, {city.country}
                  </span>
                </div>
              ))
            : !isLoading && (
                <p className={styles.noResults}>No cities found</p>
              )}
        </div>
      )}
    </div>
  );
}
