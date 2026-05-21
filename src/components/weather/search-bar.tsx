"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { useCitySearch } from "@/hooks/use-weather";
import { useSearchHistory } from "@/hooks/use-search-history";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import type { SearchResult } from "@/types/weather";
import type { SearchHistoryRecord } from "@/types/api";

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
  historyLabel:
    "px-3 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide",
  historyItem:
    "flex items-center gap-2 px-3 py-2.5 cursor-pointer transition-colors hover:bg-muted min-h-[44px]",
  historyIcon: "size-4 text-muted-foreground shrink-0",
} as const;

function HistoryDropdown({
  history,
  highlightIndex,
  onSelect,
  onHighlight,
}: {
  history: SearchHistoryRecord[];
  highlightIndex: number;
  onSelect: (searchTerm: string) => void;
  onHighlight: (index: number) => void;
}) {
  return (
    <>
      <div className={styles.historyLabel}>Recent searches</div>
      {history.map((item, index) => (
        <div
          key={item.id}
          role="option"
          aria-selected={index === highlightIndex}
          className={cn(
            styles.historyItem,
            index === highlightIndex && styles.dropdownItemActive
          )}
          onMouseDown={() => onSelect(item.searchTerm)}
          onMouseEnter={() => onHighlight(index)}
        >
          <Clock className={styles.historyIcon} />
          <span className={styles.cityName}>{item.searchTerm}</span>
        </div>
      ))}
    </>
  );
}

function AutocompleteDropdown({
  results,
  isLoading,
  highlightIndex,
  onSelect,
  onHighlight,
}: {
  results: SearchResult[] | undefined;
  isLoading: boolean;
  highlightIndex: number;
  onSelect: (city: SearchResult) => void;
  onHighlight: (index: number) => void;
}) {
  if (results && results.length > 0) {
    return results.map((city, index) => (
      <div
        key={city.id}
        role="option"
        aria-selected={index === highlightIndex}
        className={cn(
          styles.dropdownItem,
          index === highlightIndex && styles.dropdownItemActive
        )}
        onMouseDown={() => onSelect(city)}
        onMouseEnter={() => onHighlight(index)}
      >
        <span className={styles.cityName}>{city.name}</span>
        <span className={styles.cityRegion}>
          {city.region}, {city.country}
        </span>
      </div>
    ));
  }

  if (!isLoading) {
    return <p className={styles.noResults}>No cities found</p>;
  }

  return null;
}

export function SearchBar() {
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { history, addToHistory } = useSearchHistory(isAuthenticated);
  const debouncedValue = useDebounce(inputValue);
  const { data: results, isLoading } = useCitySearch(debouncedValue);

  const isHistoryMode =
    isOpen && inputValue.length < 3 && history.length > 0;
  const isAutocompleteMode = isOpen && inputValue.length >= 3;
  const showDropdown = isHistoryMode || isAutocompleteMode;
  const itemCount = isHistoryMode
    ? history.length
    : (results?.length ?? 0);

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
    setHighlightIndex(-1);
  }, []);

  const selectCity = useCallback(
    (city: SearchResult) => {
      if (isAuthenticated) addToHistory(city.name);
      setInputValue("");
      closeDropdown();
      inputRef.current?.blur();
      router.push(`/weather/${encodeURIComponent(city.name)}`);
    },
    [router, isAuthenticated, addToHistory, closeDropdown]
  );

  const selectHistoryItem = useCallback(
    (searchTerm: string) => {
      addToHistory(searchTerm);
      setInputValue("");
      closeDropdown();
      inputRef.current?.blur();
      router.push(`/weather/${encodeURIComponent(searchTerm)}`);
    },
    [router, addToHistory, closeDropdown]
  );

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!showDropdown || itemCount === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightIndex((prev) =>
          prev < itemCount - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightIndex((prev) =>
          prev > 0 ? prev - 1 : itemCount - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlightIndex >= 0) {
          if (isHistoryMode && history[highlightIndex]) {
            selectHistoryItem(history[highlightIndex].searchTerm);
          } else if (results?.[highlightIndex]) {
            selectCity(results[highlightIndex]);
          }
        }
        break;
      case "Escape":
        closeDropdown();
        break;
    }
  }

  return (
    <div
      className={styles.wrapper}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) closeDropdown();
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
        {isLoading && debouncedValue.length >= 3 && (
          <Loader2 className={styles.spinner} />
        )}
      </div>

      {showDropdown && (
        <div className={styles.dropdown} role="listbox">
          {isHistoryMode ? (
            <HistoryDropdown
              history={history}
              highlightIndex={highlightIndex}
              onSelect={selectHistoryItem}
              onHighlight={setHighlightIndex}
            />
          ) : (
            <AutocompleteDropdown
              results={results}
              isLoading={isLoading}
              highlightIndex={highlightIndex}
              onSelect={selectCity}
              onHighlight={setHighlightIndex}
            />
          )}
        </div>
      )}
    </div>
  );
}
