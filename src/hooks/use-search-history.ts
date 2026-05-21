"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchApi } from "@/lib/fetch-api";
import { getQueryClient } from "@/lib/get-query-client";
import type { SearchHistoryRecord } from "@/types/api";

export function useSearchHistory(isAuthenticated: boolean) {
  const queryClient = getQueryClient();

  const { data: history = [] } = useQuery({
    queryKey: ["search-history"],
    queryFn: () => fetchApi<SearchHistoryRecord[]>("/api/history"),
    retry: false,
    enabled: isAuthenticated,
  });

  const addMutation = useMutation({
    mutationFn: (searchTerm: string) =>
      fetchApi("/api/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ searchTerm }),
      }),
    onMutate: async (searchTerm) => {
      await queryClient.cancelQueries({ queryKey: ["search-history"] });
      const previous = queryClient.getQueryData<SearchHistoryRecord[]>(["search-history"]);
      queryClient.setQueryData<SearchHistoryRecord[]>(["search-history"], (old) => {
        const filtered = (old ?? []).filter(
          (r) => r.searchTerm !== searchTerm
        );
        const newEntry: SearchHistoryRecord = {
          id: "optimistic-" + Date.now(),
          searchTerm,
          userId: "",
          timestamp: new Date().toISOString(),
        };
        return [newEntry, ...filtered].slice(0, 5);
      });
      return { previous };
    },
    onError: (_err, _term, context) => {
      queryClient.setQueryData(["search-history"], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["search-history"] });
    },
  });

  return {
    history,
    addToHistory: (searchTerm: string) => addMutation.mutate(searchTerm),
  };
}
