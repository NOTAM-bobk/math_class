import * as React from "react";

// One focus contract for every dialog in the hub: move focus in, keep Tab (and
// Shift+Tab) inside, close on Escape, and hand focus back to the trigger. The
// five modals used to carry their own copy of this, which drifted apart and
// re-ran whenever a parent re-rendered and handed over a new onClose callback.
const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  'iframe:not([tabindex="-1"])',
  '[tabindex]:not([tabindex="-1"])',
].join(",");

export function visibleFocusable(panel: HTMLElement): HTMLElement[] {
  return Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (element) => element.tabIndex >= 0 && element.getClientRects().length > 0
  );
}

export interface DialogFocusOptions<T extends HTMLElement> {
  /** Whether the dialog is on screen. */
  active: boolean;
  onClose: () => void;
  panelRef: React.RefObject<T | null>;
  /** First control to focus; defaults to the dialog panel itself. */
  initialFocusRef?: React.RefObject<HTMLElement | null>;
}

export function useDialogFocus<T extends HTMLElement>({
  active,
  onClose,
  panelRef,
  initialFocusRef,
}: DialogFocusOptions<T>) {
  // Read onClose through a ref so a new callback identity never moves focus
  // while the visitor is typing in the dialog.
  const onCloseRef = React.useRef(onClose);
  onCloseRef.current = onClose;

  React.useEffect(() => {
    if (!active) return;
    const panel = panelRef.current;
    if (!panel) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    (initialFocusRef?.current ?? panel).focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab") return;

      const items = visibleFocusable(panel);
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];
      const current = document.activeElement;

      // Focus can land outside the panel (a removed submit button, or a click
      // on the backdrop); bring it back instead of letting Tab escape.
      if (!current || !panel.contains(current)) {
        event.preventDefault();
        first.focus();
        return;
      }

      if (event.shiftKey && (current === first || current === panel)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && current === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown, true);
    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
      previouslyFocused?.focus?.();
    };
  }, [active, panelRef, initialFocusRef]);
}
