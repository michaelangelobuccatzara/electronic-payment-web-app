type Resolver = (accessToken: string) => void;
type Rejecter = (reason?: unknown) => void;

let isRefreshing = false;
let queue: Array<{ resolve: Resolver; reject: Rejecter }> = [];
let activePromise: Promise<string | null> | null = null;

export const refreshQueue = {
  getOrCreate(doRefresh: () => Promise<string | null>): Promise<string | null> {
    if (!isRefreshing) {
      isRefreshing = true;

      activePromise = doRefresh()
        .then((token) => {
          queue.forEach(({ resolve }) => resolve(token ?? ''));
          return token;
        })
        .catch((err) => {
          queue.forEach(({ reject }) => reject(err));
          return null;
        })
        .finally(() => {
          isRefreshing = false;
          queue = [];
          activePromise = null;
        });
    }

    return activePromise!;
  },

  enqueue(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      queue.push({ resolve, reject });
    });
  },

  get isRefreshing() {
    return isRefreshing;
  },
};