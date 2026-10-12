import type { AuthUser } from "../types/auth.types";

export function parseJwt(token: string): AuthUser {
  const payload = JSON.parse(atob(token.split('.')[1]));
  return {
    sub: payload.sub,
    email: payload.email,
    name: payload.name,
    roles: payload.realm_access?.roles ?? [],
  };
}