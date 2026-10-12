import { apiClient } from "../api/axiosInstrance";
import type { AuthUser } from "../types/auth.types";

export const authService = {
  async login(
    username: string,
    password: string,
  ): Promise<{ token: string; user: AuthUser }> {
    const res = await apiClient.post("/users/authenticate", {
      email: username,
      password: password,
    });
    if (res.status !== 200) throw new Error("Login failed");

    return res.data;
  },

  async refresh(): Promise<string> {
    const res = await apiClient.post("/users/tokens/refresh");

    if (res.status !== 200) throw new Error("Token refresh failed");
    return res.data;
  },

  async logout(): Promise<void> {
    await apiClient.post(`/users/logout`);
  },
};