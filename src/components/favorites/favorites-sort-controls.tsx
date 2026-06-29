"use client";

import { ArrowUp, ArrowDown, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { SortDirection, SortField } from "@/hooks/use-favorites-view";

interface FavoritesSortControlsProps {
  sortField: SortField;
  sortDirection: SortDirection;
  filter: string;
  onSortChange: (field: SortField) => void;
  onDirectionToggle: () => void;
  onFilterChange: (value: string) => void;
  onReset: () => void;
}

const styles = {
  container: "flex flex-col gap-4 mb-6",
  filterRow: "flex gap-2",
  filterInput: "flex-1",
  buttonGroup: "flex gap-2 flex-wrap",
  sortButton:
    "px-3 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-muted active:bg-muted",
  sortButtonActive: "bg-muted text-foreground",
  sortButtonInactive: "text-muted-foreground hover:text-foreground",
  directionButton: "px-3 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-muted",
  directionIcon: "size-4 inline mr-1",
  resetButton: "px-3 py-2 text-sm font-medium rounded-lg transition-colors text-muted-foreground hover:text-foreground hover:bg-muted",
  resetIcon: "size-4 inline mr-1",
} as const;

export function FavoritesSortControls({
  sortField,
  sortDirection,
  filter,
  onSortChange,
  onDirectionToggle,
  onFilterChange,
  onReset,
}: FavoritesSortControlsProps) {
  return (
    <div className={styles.container}>
      <div className={styles.filterRow}>
        <Input
          type="text"
          placeholder="Filter by city name..."
          value={filter}
          onChange={(e) => onFilterChange(e.target.value)}
          className={styles.filterInput}
          aria-label="Filter favorites by city name"
        />
      </div>

      <div className={styles.buttonGroup}>
        <button
          onClick={() => onSortChange("name")}
          className={`${styles.sortButton} ${
            sortField === "name" ? styles.sortButtonActive : styles.sortButtonInactive
          }`}
          aria-pressed={sortField === "name"}
          title="Sort by city name"
        >
          Name
        </button>

        <button
          onClick={() => onSortChange("dateAdded")}
          className={`${styles.sortButton} ${
            sortField === "dateAdded" ? styles.sortButtonActive : styles.sortButtonInactive
          }`}
          aria-pressed={sortField === "dateAdded"}
          title="Sort by date added"
        >
          Date Added
        </button>

        <button
          onClick={onDirectionToggle}
          className={styles.directionButton}
          aria-label={`Sort ${sortDirection === "asc" ? "descending" : "ascending"}`}
          title={`Currently sorting ${sortDirection === "asc" ? "ascending" : "descending"}`}
        >
          {sortDirection === "asc" ? (
            <ArrowUp className={styles.directionIcon} />
          ) : (
            <ArrowDown className={styles.directionIcon} />
          )}
          {sortDirection === "asc" ? "A→Z" : "Z→A"}
        </button>

        {(sortField !== "dateAdded" || sortDirection !== "desc" || filter) && (
          <button onClick={onReset} className={styles.resetButton} title="Reset to default">
            <RotateCcw className={styles.resetIcon} />
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
