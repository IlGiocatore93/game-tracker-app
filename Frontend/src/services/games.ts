import { apiRequest } from "./api";
import type { UserGame } from "../types";

export interface IgdbGame {
  id: number;
  name: string;
  cover?: { url: string };
  genres?: { name: string }[];
  platforms?: { name: string }[];
}

export async function searchGames(query: string): Promise<IgdbGame[]> {
  return apiRequest<IgdbGame[]>(`/games/search?query=${encodeURIComponent(query)}`);
}

export async function getLibrary(): Promise<UserGame[]> {
  return apiRequest<UserGame[]>("/games/library");
}

export async function addToLibrary(gameData: {
  igdb_id: number;
  title: string;
  cover_image?: string;
  genre?: string;
  platform?: string;
  status?: string;
}): Promise<UserGame> {
  return apiRequest<UserGame>("/games/library", {
    method: "POST",
    body: JSON.stringify(gameData),
  });
}

export async function updateLibraryEntry(
  userGameId: number,
  updateData: { status?: string; hours_played?: number; personal_rating?: number }
): Promise<UserGame> {
  return apiRequest<UserGame>(`/games/library/${userGameId}`, {
    method: "PUT",
    body: JSON.stringify(updateData),
  });
}

export async function deleteFromLibrary(userGameId: number): Promise<void> {
  return apiRequest<void>(`/games/library/${userGameId}`, {
    method: "DELETE",
  });
}