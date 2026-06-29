"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { getQueryClient } from "@/lib/get-query-client";
import { TemperatureUnitProvider } from "@/context/temperature-unit-context";

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <TemperatureUnitProvider>
        {children}
        <Toaster />
      </TemperatureUnitProvider>
    </QueryClientProvider>
  );
}
