import { QueryClient } from "@tanstack/react-query";
import { QUERY_STALE_MS, QUERY_GC_TIME_MS } from "@/lib/constants";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: QUERY_STALE_MS,
        gcTime: QUERY_GC_TIME_MS,
        refetchOnWindowFocus: false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}