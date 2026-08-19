import { apiRequest, setToken, removeToken } from "./api";
import type { AuthResponse, User } from "../types";

export async function register(email: string, username: string, password: string): Promise<User> {
  return apiRequest<User>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, username, password }),
  });
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const data = await apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  setToken(data.access_token);
  return data;
}

export function logout(): void {
  removeToken();
}

export async function getCurrentUser(): Promise<User> {
  return apiRequest<User>("/auth/me");
}