import { useCallback, useState } from "react";
import { getErrorMessage } from "../api/getErrorMessage";

type ActionState =
  | { status: "idle" }
  | { status: "pending" }
  | { status: "error"; message: string };

export function useAsyncAction<Args extends unknown[]>(
  action: (...args: Args) => Promise<void>,
) {
  const [state, setState] = useState<ActionState>({ status: "idle" });

  /** Resolves `true` on success, `false` on failure (the message is in `error`). */
  const run = useCallback(
    async (...args: Args): Promise<boolean> => {
      setState({ status: "pending" });
      try {
        await action(...args);
        setState({ status: "idle" });
        return true;
      } catch (error) {
        setState({ status: "error", message: getErrorMessage(error) });
        return false;
      }
    },
    [action],
  );

  const reset = useCallback(() => setState({ status: "idle" }), []);

  return {
    run,
    reset,
    isPending: state.status === "pending",
    error: state.status === "error" ? state.message : null,
  };
}