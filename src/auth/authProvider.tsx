import React, { useCallback, useEffect, useRef, useState } from "react";
import type { AuthState } from "../types/auth.types";
import { AuthContext } from "./authContext";
import { tokenStore } from "./tokenStore";
import { authService } from "./authService";
import { apiClient } from "../api/axiosInstrance";
import { setupInterceptors } from "../api/interceptors";
import type { LoginCredentials } from "../types/types";

const INITIAL_STATE: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true, // true until silent refresh attempt completes
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(INITIAL_STATE);
  const interceptorsSetup = useRef(false);

  const forceLogout = useCallback(() => {
    tokenStore.clear();
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  useEffect(() => {
    if (!interceptorsSetup.current) {
      setupInterceptors(apiClient, forceLogout);
      interceptorsSetup.current = true;
    }
  }, [forceLogout]);

  useEffect(() => {
    let cancelled = false;

    // Runs on every page, /login included. Otherwise a reload on /login can't tell the
    // user is already signed in. With no session it fails quickly and the form shows.
    async function silentRefresh() {
      try {
        const token = await authService.refresh();
        if (cancelled) return;

        tokenStore.set(token);
        const user = await authService.Me();
        if (cancelled) return;

        setState({ user, token, isAuthenticated: true, isLoading: false });
      } catch {
        if (!cancelled) {
          setState((s) => ({ ...s, isLoading: false }));
        }
      }
    }

    silentRefresh();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(
    async ({ username, password }: LoginCredentials) => {
      const token = await authService.login({ username, password });
      tokenStore.set(token);

      const user = await authService.Me();

      setState({ user, token: token, isAuthenticated: true, isLoading: false });
    },
    [],
  );

  const logout = useCallback(async () => {
    await authService.logout().catch(() => {});
    forceLogout();
  }, [forceLogout]);

  const refreshTokens = useCallback(async (): Promise<string | null> => {
    try {
      const token = await authService.refresh();
      tokenStore.set(token);
      const user = await authService.Me();
      setState((s) => ({ ...s, user, token: token }));
      return token;
    } catch {
      forceLogout();
      return null;
    }
  }, [forceLogout]);

  return (
    <AuthContext.Provider value={{ ...state, login, logout, refreshTokens }}>
      {children}
    </AuthContext.Provider>
  );
}
