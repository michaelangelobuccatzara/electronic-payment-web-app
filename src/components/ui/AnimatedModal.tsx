import type { ReactNode } from "react";
import { useEscapeKey } from "../../hooks/useEscapeKey";

// Defaults match the Students dialogs. Other screens can override them.
const DEFAULT_OVERLAY = "backdrop-blur-[2px] p-space-md duration-200";
const DEFAULT_BOX = "rounded-2xl shadow-2xl p-space-xl gap-space-md duration-200";

interface AnimatedModalProps {
  isOpen: boolean;
  onEscape: () => void;
  labelledBy: string;
  describedBy?: string;
  role?: "dialog" | "alertdialog";
  /** Tailwind max-width class for the dialog box, e.g. "max-w-md". */
  maxWidthClassName: string;
  overlayClassName?: string;
  boxClassName?: string;
  children: ReactNode;
}

/**
 * Stays mounted so the fade/scale transition can run in both directions.
 * `inert` keeps the hidden dialog out of the tab order and the accessibility tree.
 */
export function AnimatedModal({
  isOpen,
  onEscape,
  labelledBy,
  describedBy,
  role = "dialog",
  maxWidthClassName,
  overlayClassName = DEFAULT_OVERLAY,
  boxClassName = DEFAULT_BOX,
  children,
}: AnimatedModalProps) {
  useEscapeKey(isOpen, onEscape);

  return (
    <div
      inert={!isOpen}
      className={`fixed inset-0 bg-inverse-surface/40 z-50 flex items-center justify-center transition-opacity ${overlayClassName} ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        role={role}
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        className={`bg-surface-container-lowest w-full flex flex-col transition-transform ${boxClassName} ${maxWidthClassName} ${
          isOpen ? "scale-100" : "scale-95"
        }`}
      >
        {children}
      </div>
    </div>
  );
}