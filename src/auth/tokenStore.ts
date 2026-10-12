let _token: string | null = null;

export const tokenStore = {
  set(token: string): void {
    _token = token;
  },

  get(): string | null {
    return _token;
  },

  clear(): void {
    _token = null;
  }
};