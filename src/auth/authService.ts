import { apiClient } from "../api/axiosInstrance";
import type { AuthUser } from "../types/auth.types";
import type { LoginCredentials } from "../types/types";

export const authService = {
  async login({
    username,
    password,
  }: LoginCredentials): Promise<string> {
    const res = await apiClient.post("/auth", {
      username: username,
      password: password,
    });
    if (res.status !== 200) throw new Error("Login failed");

    return res.data;
  },

  async refresh(): Promise<string> {
    const res = await apiClient.post("/auth/refresh-token");

    if (res.status !== 200) throw new Error("Token refresh failed");
    return res.data;
  },

  async Me(): Promise<AuthUser | null> {
    const { data } = await apiClient.get<AuthUser>("/users/me");

    if (!data) return null;

    return data;
  },

  async logout(): Promise<void> {
    await apiClient.post(`/auth/logout`);
  },
};
