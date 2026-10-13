import { useEffect, useState } from "react";

const MS_PER_MINUTE = 60_000;

/**
 * Returns the current time, updating at the start of every minute.
 * Minute resolution is enough for displays without seconds, and avoids a re-render per second.
 */
export function useCurrentTime(): Date {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    let timeoutId: number;

    const scheduleNextTick = () => {
      const current = new Date();
      const msIntoMinute = current.getSeconds() * 1000 + current.getMilliseconds();
      timeoutId = window.setTimeout(() => {
        setNow(new Date());
        scheduleNextTick();
      }, MS_PER_MINUTE - msIntoMinute);
    };

    // Browsers throttle timers in hidden tabs, so catch up when the tab is shown again.
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") setNow(new Date());
    };

    scheduleNextTick();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearTimeout(timeoutId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return now;
}