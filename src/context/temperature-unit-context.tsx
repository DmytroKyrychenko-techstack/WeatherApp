"use client";

import React, { createContext, useContext } from "react";
import type { TemperatureUnit } from "@/lib/temperature";
import { useTemperatureUnit } from "@/hooks/use-temperature-unit";

interface TemperatureUnitContextType {
  unit: TemperatureUnit;
  setUnit: (unit: TemperatureUnit) => void;
  toggle: () => void;
}

const TemperatureUnitContext = createContext<TemperatureUnitContextType | undefined>(
  undefined
);

export function TemperatureUnitProvider({ children }: { children: React.ReactNode }) {
  const temperatureUnit = useTemperatureUnit();

  return (
    <TemperatureUnitContext.Provider value={temperatureUnit}>
      {children}
    </TemperatureUnitContext.Provider>
  );
}

export function useTemperatureUnitContext(): TemperatureUnitContextType {
  const context = useContext(TemperatureUnitContext);
  if (!context) {
    throw new Error(
      "useTemperatureUnitContext must be used within TemperatureUnitProvider"
    );
  }
  return context;
}
