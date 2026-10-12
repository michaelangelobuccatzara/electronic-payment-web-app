import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { tokenStore } from "../auth/tokenStore";
import { refreshQueue } from "../auth/refreshQueue";
import { authService } from "../auth/authService";
import { PUBLIC_ROUTES } from "../utils/publicRoutes";

interface RetryableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export function setupInterceptors(
  client: AxiosInstance,
  onForceLogout: () => void,
): void {
  client.interceptors.request.use((config) => {
    const token = tokenStore.get();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalConfig = error.config as RetryableConfig;

      const AUTH_ENDPOINTS = ["/users/authenticate", "/users/tokens/refresh"];
      if (
        error.response?.status !== 401 ||
        originalConfig._retry ||
        AUTH_ENDPOINTS.some((url) => originalConfig.url?.includes(url)) ||
        PUBLIC_ROUTES.some((path) =>
          window.location.pathname.startsWith(path),
        )
      ) {
        return Promise.reject(error);
      }

      originalConfig._retry = true;

      try {
        const newAccessToken = refreshQueue.isRefreshing
          ? await refreshQueue.enqueue()
          : await refreshQueue.getOrCreate(async () => {
              const token = await authService.refresh();
              tokenStore.set(token);
              return token;
            });

        if (!newAccessToken) throw new Error("Refresh returned empty token");

        originalConfig.headers.Authorization = `Bearer ${newAccessToken}`;
        return client(originalConfig);
      } catch {
        tokenStore.clear();
        onForceLogout();
        return Promise.reject(error);
      }
    },
  );
}