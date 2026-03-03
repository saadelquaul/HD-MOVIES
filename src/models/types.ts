export type VideoType = 'FILM' | 'SERIE' | 'DOCUMENTAIRE';

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
}

export interface Video {
  id: number;
  title: string;
  description: string;
  thumbnailUrl: string;
  trailerUrl: string;
  duration: number;
  releaseYear: number;
  type: VideoType;
  category: string;
  rating: number;
  director: string;
  cast: string[];
  popularity: number;
}

export interface Category {
  id: number;
  name: string;
}

export interface WatchlistItem {
  id: string;
  userId: string;
  videoId: number;
  addedAt: string;
}

export interface WatchHistoryItem {
  id: string;
  userId: string;
  videoId: number;
  watchedAt: string;
  progressTime: number;
  completed: boolean;
}

export interface UserRating {
  userId: string;
  videoId: number;
  rating: number;
}
