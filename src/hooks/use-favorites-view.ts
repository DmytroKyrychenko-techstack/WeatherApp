"use client";

import { useReducer, useCallback } from "react";

export type SortField = "name" | "dateAdded";
export type SortDirection = "asc" | "desc";

export interface FavoritesViewState {
  sortField: SortField;
  sortDirection: SortDirection;
  filter: string;
}

type FavoritesViewAction =
  | { type: "SET_SORT"; field: SortField }
  | { type: "TOGGLE_DIRECTION" }
  | { type: "SET_FILTER"; value: string }
  | { type: "RESET" };

function favoritesViewReducer(
  state: FavoritesViewState,
  action: FavoritesViewAction
): FavoritesViewState {
  switch (action.type) {
    case "SET_SORT":
      return {
        ...state,
        sortField: action.field,
        sortDirection: state.sortField === action.field ? state.sortDirection : "asc",
      };
    case "TOGGLE_DIRECTION":
      return {
        ...state,
        sortDirection: state.sortDirection === "asc" ? "desc" : "asc",
      };
    case "SET_FILTER":
      return { ...state, filter: action.value };
    case "RESET":
      return {
        sortField: "dateAdded",
        sortDirection: "desc",
        filter: "",
      };
    default:
      const _exhaustive: never = action;
      return _exhaustive;
  }
}

interface FavoriteCityWithDate {
  name: string;
  createdAt: Date;
}

export function useFavoritesView() {
  const [state, dispatch] = useReducer(favoritesViewReducer, {
    sortField: "dateAdded",
    sortDirection: "desc",
    filter: "",
  });

  const setSortField = useCallback((field: SortField) => {
    dispatch({ type: "SET_SORT", field });
  }, []);

  const toggleDirection = useCallback(() => {
    dispatch({ type: "TOGGLE_DIRECTION" });
  }, []);

  const setFilter = useCallback((value: string) => {
    dispatch({ type: "SET_FILTER", value });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  const sortAndFilter = useCallback(
    (favorites: FavoriteCityWithDate[]) => {
      let result = [...favorites];

      if (state.filter) {
        const lowerFilter = state.filter.toLowerCase();
        result = result.filter((fav) => fav.name.toLowerCase().includes(lowerFilter));
      }

      result.sort((a, b) => {
        let compareValue = 0;

        if (state.sortField === "name") {
          compareValue = a.name.localeCompare(b.name);
        } else {
          compareValue = a.createdAt.getTime() - b.createdAt.getTime();
        }

        return state.sortDirection === "asc" ? compareValue : -compareValue;
      });

      return result;
    },
    [state.sortField, state.sortDirection, state.filter]
  );

  return {
    state,
    setSortField,
    toggleDirection,
    setFilter,
    reset,
    sortAndFilter,
  };
}
