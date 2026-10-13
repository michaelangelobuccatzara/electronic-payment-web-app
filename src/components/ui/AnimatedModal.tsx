import type { ReactNode } from "react";
import { useEscapeKey } from "../../hooks/useEscapeKey";

interface AnimatedModalProps {
  isOpen: boolean;
  onEscape: () => void;
  labelledBy: string;
  describedBy?: string;
  role?: "dialog" | "alertdialog";
  /** Tailwind max-width class for the dialog box, e.g. "max-w-md". */
  maxWidthClassName: string;
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
  children,
}: AnimatedModalProps) {
  useEscapeKey(isOpen, onEscape);

  return (
    <div
      inert={!isOpen}
      className={`fixed inset-0 bg-inverse-surface/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-space-md transition-opacity duration-200 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        role={role}
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        className={`bg-surface-container-lowest w-full rounded-2xl shadow-2xl p-space-xl flex flex-col gap-space-md transition-transform duration-200 ${maxWidthClassName} ${
          isOpen ? "scale-100" : "scale-95"
        }`}
      >
        {children}
      </div>
    </div>
  );
}