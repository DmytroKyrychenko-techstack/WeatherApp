"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/lib/fetch-api";
import type { MeResponse } from "@/types/api";

export function useAuth() {
  const { data, isLoading } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => fetchApi<MeResponse>("/api/auth/me"),
    retry: false,
    staleTime: Infinity,
  });

  return {
    user: data ?? null,
    isLoading,
    isAuthenticated: !!data,
  };
}
