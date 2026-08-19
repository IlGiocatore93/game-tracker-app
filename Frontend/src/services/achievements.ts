import { apiRequest } from "./api";
import type { Achievement, UserAchievement } from "../types";

export async function getAllAchievements(): Promise<Achievement[]> {
  return apiRequest<Achievement[]>("/achievements/");
}

export async function getMyAchievements(): Promise<UserAchievement[]> {
  return apiRequest<UserAchievement[]>("/achievements/me");
}