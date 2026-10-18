import { useState, type KeyboardEvent } from "react";
import { createBurstDetector } from "../../utils/burstDetector";
import { CONTROL_CLASS } from "./StudentFormControls";

// Tune these to your reader. Readers usually send a key every 5–30 ms.
const MAX_KEY_INTERVAL_MS = 50;
const MIN_CODE_LENGTH = 8;

interface RfidScanInputProps {
  id: string;
  /** The last accepted scan. It is display only: the field can't be edited by hand. */
  value: string;
  describedBy?: string;
  onScan: (code: string) => void;
  /** Enter was pressed after input that didn't look like a reader (e.g. manual typing). */
  onReject: () => void;
}

export function RfidScanInput({ id, value, describedBy, onScan, onReject }: RfidScanInputProps) {
  // Created once per mount; its buffer is not render state, so it doesn't belong in useState.
  const [detector] = useState(() =>
    createBurstDetector({ maxIntervalMs: MAX_KEY_INTERVAL_MS, minLength: MIN_CODE_LENGTH }),
  );

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    // Scripted events aren't hardware. Ignore them and drop anything collected so far.
    if (!event.nativeEvent.isTrusted) {
      detector.reset();
      return;
    }
    // Shortcuts (Ctrl+C, etc.) keep working.
    if (event.ctrlKey || event.metaKey || event.altKey) return;

    if (event.key === "Enter") {
      event.preventDefault(); // never let Enter submit the surrounding form
      const result = detector.finish(event.nativeEvent.timeStamp);
      if (result.status === "scan") onScan(result.code);
      else if (result.status === "rejected") onReject();
      return;
    }

    // Tab, Escape, arrows, Shift... have key names longer than 1 character: leave them alone
    // so keyboard users can still leave the field.
    if (event.key.length !== 1) return;

    event.preventDefault();
    // A held-down key auto-repeats at a fast, steady rate that would look like a burst.
    if (event.repeat) {
      detector.reset();
      return;
    }
    detector.push(event.key, event.nativeEvent.timeStamp);
  };

  return (
    <input
      id={id}
      type="text"
      value={value}
      // readOnly already blocks typing, pasting and drag-and-drop into the field.
      readOnly
      required
      autoComplete="off"
      inputMode="none" // no on-screen keyboard on touch devices
      aria-describedby={describedBy}
      onKeyDown={handleKeyDown}
      placeholder="Click here, then tap the card"
      className={`${CONTROL_CLASS} w-full cursor-default pl-10 focus:ring-2 focus:ring-primary`}
    />
  );
}