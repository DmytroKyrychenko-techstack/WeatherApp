// WeatherAPI.com
export const WEATHER_API_BASE_URL = "https://api.weatherapi.com/v1";

// Server-side cache TTL
export const CACHE_TTL_S = 10 * 60;          // 10 minutes in seconds
export const CACHE_TTL_MS = CACHE_TTL_S * 1000; // 10 minutes in milliseconds

// Client-side TanStack Query cache
export const QUERY_STALE_MS = 5 * 60 * 1000; // 5 minutes in milliseconds
export const QUERY_GC_TIME_MS = 30 * 60 * 1000; // 30 minutes in milliseconds


// Search debounce (ms)
export const SEARCH_DEBOUNCE_MS = 300;

// Forecast days
export const FORECAST_DAYS = 3;

// Local storage keys
export const USER_ID_KEY = "weatherapp_user_id";

// Recommendations values
// Temperature thresholds (Celsius)
export const TEMP_COLD = 10;
export const TEMP_HOT = 25;
export const TEMP_EXTREME_HEAT = 35;

// Wind threshold (km/h)
export const WIND_STRONG = 40;

// UV index threshold
export const UV_HIGH = 6;