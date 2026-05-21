export interface FavoriteRecord {
  id: string;
  cityName: string;
  userId: string;
  createdAt: string;
}

export interface SearchHistoryRecord {
  id: string;
  searchTerm: string;
  userId: string;
  timestamp: string;
}

export interface MeResponse {
  id: string;
  email: string;
  createdAt: string;
}