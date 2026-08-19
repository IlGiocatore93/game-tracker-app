export interface User {
  id: number;
  email: string;
  username: string;
}

export interface Game {
  id: number;
  igdb_id: number;
  title: string;
  cover_image: string | null;
  genre: string | null;
  platform: string | null;
}

export interface UserGame {
  id: number;
  status: string;
  hours_played: number;
  personal_rating: number | null;
  added_at: string;
  game: Game;
}

export interface Achievement {
  id: number;
  name: string;
  description: string;
  tier: string;
  condition_type: string;
  condition_value: number;
}

export interface UserAchievement {
  id: number;
  unlocked_at: string;
  achievement: Achievement;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}