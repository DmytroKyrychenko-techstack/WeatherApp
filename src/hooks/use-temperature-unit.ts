"use client";

import { useReducer } from "react";
import type { TemperatureUnit } from "@/lib/temperature";

interface TemperatureUnitState {
  unit: TemperatureUnit;
}

type TemperatureUnitAction =
  | { type: "SET_UNIT"; unit: TemperatureUnit }
  | { type: "TOGGLE" };

function temperatureReducer(
  state: TemperatureUnitState,
  action: TemperatureUnitAction
): TemperatureUnitState {
  switch (action.type) {
    case "SET_UNIT":
      return { unit: action.unit };
    case "TOGGLE":
      return { unit: state.unit === "celsius" ? "fahrenheit" : "celsius" };
    default:
      const _exhaustive: never = action;
      return _exhaustive;
  }
}

export function useTemperatureUnit(): TemperatureUnitState & {
  setUnit: (unit: TemperatureUnit) => void;
  toggle: () => void;
} {
  const [state, dispatch] = useReducer(temperatureReducer, { unit: "celsius" });

  return {
    unit: state.unit,
    setUnit: (unit: TemperatureUnit) => dispatch({ type: "SET_UNIT", unit }),
    toggle: () => dispatch({ type: "TOGGLE" }),
  };
}
