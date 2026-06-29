"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchApi } from "@/lib/fetch-api";
import { getQueryClient } from "@/lib/get-query-client";
import type { FavoriteRecord } from "@/types/api";

export function useFavorites() {
  const queryClient = getQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["favorites"],
    queryFn: () => fetchApi<FavoriteRecord[]>("/api/favorites"),
    retry: false,
  });

  const favorites = data?.map((r) => r.cityName) ?? [];

  const addMutation = useMutation({
    mutationFn: (cityName: string) =>
      fetchApi("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cityName }),
      }),
    onMutate: async (cityName) => {
      await queryClient.cancelQueries({ queryKey: ["favorites"] });
      const previous = queryClient.getQueryData<FavoriteRecord[]>(["favorites"]);
      queryClient.setQueryData<FavoriteRecord[]>(["favorites"], (old) => [
        ...(old ?? []),
        { cityName, createdAt: new Date().toISOString() } as FavoriteRecord,
      ]);
      return { previous };
    },
    onError: (_err, _cityName, context) => {
      queryClient.setQueryData(["favorites"], context?.previous);
      toast.error("Failed to add favorite");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (cityName: string) =>
      fetchApi("/api/favorites", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cityName }),
      }),
    onMutate: async (cityName) => {
      await queryClient.cancelQueries({ queryKey: ["favorites"] });
      const previous = queryClient.getQueryData<FavoriteRecord[]>(["favorites"]);
      queryClient.setQueryData<FavoriteRecord[]>(["favorites"], (old) =>
        (old ?? []).filter((r) => r.cityName !== cityName)
      );
      return { previous };
    },
    onError: (_err, _cityName, context) => {
      queryClient.setQueryData(["favorites"], context?.previous);
      toast.error("Failed to remove favorite");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  return {
    favorites,
    favoriteRecords: data ?? [],
    isLoading,
    isFavorite: (cityName: string) => favorites.includes(cityName),
    addFavorite: (cityName: string) => addMutation.mutate(cityName),
    removeFavorite: (cityName: string) => removeMutation.mutate(cityName),
  };
}
