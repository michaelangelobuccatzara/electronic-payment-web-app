import { useCallback, useEffect, useState } from "react";
import { getErrorMessage } from "../api/getErrorMessage";

type Fetcher<T> = (signal: AbortSignal) => Promise<T>;

interface Settled<T> {
  fetcher: Fetcher<T>;
  reloadKey: number;
  data: T | undefined;
  error: string | null;
}

/**
 * `fetcher` must be referentially stable (module-level function or useCallback);
 * a new identity means "new request". Previous data is kept while the next
 * request is in flight, so tables don't flash empty when paging or searching.
 */
export function useApiQuery<T>(fetcher: Fetcher<T>) {
  const [reloadKey, setReloadKey] = useState(0);
  const [settled, setSettled] = useState<Settled<T> | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetcher(controller.signal).then(
      (data) => {
        if (controller.signal.aborted) return;
        setSettled({ fetcher, reloadKey, data, error: null });
      },
      (error: unknown) => {
        if (controller.signal.aborted) return;
        setSettled((previous) => ({
          fetcher,
          reloadKey,
          data: previous?.data,
          error: getErrorMessage(error),
        }));
      },
    );

    return () => controller.abort();
  }, [fetcher, reloadKey]);

  // Derived during render: "loading" simply means the latest result isn't for the current request.
  const isCurrent =
    settled !== null && settled.fetcher === fetcher && settled.reloadKey === reloadKey;

  const reload = useCallback(() => setReloadKey((key) => key + 1), []);

  return {
    data: settled?.data,
    error: isCurrent ? settled.error : null,
    isLoading: !isCurrent,
    reload,
  };
}