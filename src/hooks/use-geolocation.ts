"use client";

import { useState, useEffect, useCallback } from "react";

type GeoStatus = "idle" | "loading" | "granted" | "denied" | "unavailable";

interface GeoCoords {
  lat: number;
  lon: number;
}

interface GeoState {
  status: GeoStatus;
  coords: GeoCoords | null;
}

const geoOptions: PositionOptions = {
  enableHighAccuracy: false,
  timeout: 10_000,
  maximumAge: 600_000,
};

export function useGeolocation() {
  const [state, setState] = useState<GeoState>({
    status: "idle",
    coords: null,
  });

  const handleSuccess = useCallback((position: GeolocationPosition) => {
    setState({
      status: "granted",
      coords: {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      },
    });
  }, []);

  const handleError = useCallback((error: GeolocationPositionError) => {
    setState({
      status: error.code === error.PERMISSION_DENIED ? "denied" : "unavailable",
      coords: null,
    });
  }, []);

  const requestPermission = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setState({ status: "unavailable", coords: null });
      return;
    }

    setState((prev) => ({ ...prev, status: "loading" }));
    navigator.geolocation.getCurrentPosition(
      handleSuccess,
      handleError,
      geoOptions
    );
  }, [handleSuccess, handleError]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    requestPermission();
  }, [requestPermission]);

  return {
    status: state.status,
    coords: state.coords,
    requestPermission,
  };
}
