import type { LoginCredentials } from "./types";

export interface AuthUser {
  sub: string;
  email: string;
  roles: string[];
  name?: string;
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextValue extends AuthState {
  login: (credential: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshTokens: () => Promise<string | null>;
}