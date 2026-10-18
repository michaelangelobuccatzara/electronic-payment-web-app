export type BurstResult =
  | { status: "empty" }                  // Enter pressed with nothing typed
  | { status: "scan"; code: string }     // looks like a card reader
  | { status: "rejected" };              // typed too slowly or too short: not a reader

interface BurstDetectorOptions {
  /** Longest allowed pause between two characters of the same scan. */
  maxIntervalMs: number;
  /** Shortest code that is accepted as a scan. */
  minLength: number;
}

export function createBurstDetector({ maxIntervalMs, minLength }: BurstDetectorOptions) {
  let buffer = "";
  let lastKeyTime = 0;

  return {
    push(char: string, time: number): void {
      // A pause this long means a person is typing (or a new scan is starting): start over.
      if (buffer !== "" && time - lastKeyTime > maxIntervalMs) buffer = "";
      buffer += char;
      lastKeyTime = time;
    },

    finish(time: number): BurstResult {
      const code = buffer;
      const gap = time - lastKeyTime;
      buffer = "";

      if (code === "") return { status: "empty" };
      const isBurst = code.length >= minLength && gap <= maxIntervalMs;
      return isBurst ? { status: "scan", code } : { status: "rejected" };
    },

    reset(): void {
      buffer = "";
    },
  };
}