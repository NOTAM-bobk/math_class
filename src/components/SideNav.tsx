import * as React from "react";
import { createPortal } from "react-dom";
import { PanelLeft, X } from "lucide-react";

export interface SideNavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active?: boolean;
  onSelect: () => void;
}

export interface SideNavSection {
  items: SideNavItem[];
}

const PANEL_STYLE: React.CSSProperties = {
  background: "#1d1d1d",
  borderRadius: 20,
  boxShadow:
    "inset 0 0 0 1px rgba(44, 47, 54, 0.52), inset 0 0 50px 0 rgba(255, 255, 255, 0.02), 0 10px 24px -6px rgba(0, 0, 0, 0.5), 0 2px 6px rgba(0, 0, 0, 0.3)",
  fontFamily: "system-ui, -apple-system, sans-serif",
};

/** A small label bubble shown while a rail button is held down. */
function HoldTooltip({ label, button }: { label: string; button: React.RefObject<HTMLButtonElement | null> }) {
  const [pos, setPos] = React.useState<{ x: number; y: number } | null>(null);
  const timer = React.useRef<number | null>(null);

  const clear = React.useCallback(() => {
    if (timer.current !== null) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  React.useEffect(() => clear, [clear]);

  const start = () => {
    clear();
    timer.current = window.setTimeout(() => {
      const rect = button.current?.getBoundingClientRect();
      if (rect) setPos({ x: rect.right + 10, y: rect.top + rect.height / 2 });
    }, 380);
  };

  const stop = () => {
    clear();
    setPos(null);
  };

  return {
    tooltip: pos
      ? createPortal(
          <span
            role="tooltip"
            style={{ left: pos.x, top: pos.y }}
            className="pointer-events-none fixed z-[120] -translate-y-1/2 whitespace-nowrap rounded-md bg-black/90 px-2 py-1 text-[11px] font-medium text-zinc-100 shadow-[0_6px_20px_rgba(0,0,0,0.5)] ring-1 ring-white/10 animate-in fade-in duration-100"
          >
            {label}
          </span>,
          document.body
        )
      : null,
    handlers: {
      onPointerDown: start,
      onPointerUp: stop,
      onPointerLeave: stop,
      onPointerCancel: stop,
    },
  };
}

function NavButton({
  item,
  expanded,
  withHoldTooltip,
}: {
  item: SideNavItem;
  expanded: boolean;
  withHoldTooltip: boolean;
}) {
  const Icon = item.icon;
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const hold = HoldTooltip({ label: item.label, button: buttonRef });
  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={item.onSelect}
        aria-current={item.active ? "page" : undefined}
        aria-label={item.label}
        {...(withHoldTooltip ? hold.handlers : {})}
        className={`group flex h-9 w-full shrink-0 select-none items-center gap-2.5 rounded-xl text-left text-[12.5px] transition-colors [-webkit-touch-callout:none] ${
          expanded ? "px-2.5" : "justify-center px-0"
        } ${
          item.active
            ? "bg-white font-semibold text-zinc-950 shadow-[0_2px_8px_rgba(0,0,0,0.35)]"
            : "font-medium text-zinc-400 hover:bg-white/[0.06] hover:text-zinc-100"
        }`}
      >
        <Icon
          className={`h-4 w-4 shrink-0 ${
            item.active ? "text-zinc-900" : "text-zinc-400 group-hover:text-zinc-200"
          }`}
        />
        {expanded && <span className="min-w-0 truncate">{item.label}</span>}
      </button>
      {hold.tooltip}
    </>
  );
}

function NavList({
  sections,
  expanded,
  withHoldTooltips,
}: {
  sections: SideNavSection[];
  expanded: boolean;
  withHoldTooltips: boolean;
}) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [edges, setEdges] = React.useState({ top: false, bottom: false });

  const updateEdges = React.useCallback(() => {
    const element = scrollRef.current;
    if (!element) return;
    const remaining = element.scrollHeight - element.clientHeight - element.scrollTop;
    const top = element.scrollTop > 2;
    const bottom = remaining > 2;
    setEdges((previous) =>
      previous.top === top && previous.bottom === bottom ? previous : { top, bottom }
    );
  }, []);

  React.useEffect(() => {
    updateEdges();
    const element = scrollRef.current;
    if (!element) return;
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(updateEdges) : null;
    observer?.observe(element);
    return () => observer?.disconnect();
  }, [updateEdges, sections, expanded]);

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div
        ref={scrollRef}
        onScroll={updateEdges}
        className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto p-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {sections.map((section, index) => (
          <div key={section.items[0]?.id ?? index} className="flex flex-col gap-1">
            {index > 0 && <div aria-hidden="true" className="mx-1 my-0.5 h-px shrink-0 bg-white/[0.08]" />}
            {section.items.map((item) => (
              <NavButton
                key={item.id}
                item={item}
                expanded={expanded}
                withHoldTooltip={withHoldTooltips}
              />
            ))}
          </div>
        ))}
      </div>
      {/* Soft blur over the clipped edges, shown only while there is more to scroll. */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 top-0 z-10 h-6 bg-gradient-to-b from-[#1d1d1d] via-[#1d1d1d]/70 to-transparent backdrop-blur-[2px] transition-opacity duration-200 [mask-image:linear-gradient(to_bottom,black,transparent)] [-webkit-mask-image:linear-gradient(to_bottom,black,transparent)] ${
          edges.top ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 bottom-0 z-10 h-6 bg-gradient-to-t from-[#1d1d1d] via-[#1d1d1d]/70 to-transparent backdrop-blur-[2px] transition-opacity duration-200 [mask-image:linear-gradient(to_top,black,transparent)] [-webkit-mask-image:linear-gradient(to_top,black,transparent)] ${
          edges.bottom ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}

/**
 * The desktop rail. It lives as a 56px strip in the layout and floats open over
 * the games when hovered or focused, so the grid never shifts under the pointer.
 */
export function SideNav({
  sections,
  expanded,
  onToggleExpanded,
}: {
  sections: SideNavSection[];
  expanded: boolean;
  onToggleExpanded: () => void;
}) {
  const [hovered, setHovered] = React.useState(false);
  const open = expanded || hovered;

  return (
    <div className="relative hidden w-14 shrink-0 md:block">
      <nav
        aria-label="Game navigation"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocusCapture={() => setHovered(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setHovered(false);
        }}
        className={`absolute inset-y-0 left-0 z-30 flex flex-col overflow-hidden transition-[width] duration-200 ease-out ${
          open ? "w-[13rem]" : "w-14"
        }`}
        style={PANEL_STYLE}
      >
        <NavList sections={sections} expanded={open} withHoldTooltips />
        <div className="shrink-0 border-t border-white/[0.07] p-2">
          <button
            type="button"
            onClick={onToggleExpanded}
            aria-expanded={expanded}
            aria-label={expanded ? "Collapse navigation" : "Keep navigation open"}
            title={expanded ? "Collapse navigation" : "Keep navigation open"}
            className={`flex h-9 w-full items-center gap-2.5 rounded-xl text-[12.5px] font-medium text-zinc-400 transition-colors hover:bg-white/[0.06] hover:text-zinc-100 ${
              open ? "px-2.5" : "justify-center px-0"
            }`}
          >
            <PanelLeft aria-hidden="true" className="h-4 w-4 shrink-0" />
            {open && <span>{expanded ? "Collapse" : "Keep open"}</span>}
          </button>
        </div>
      </nav>
    </div>
  );
}

/** The same navigation on a phone, where the rail would take the whole width. */
export function SideNavDrawer({
  open,
  sections,
  onClose,
}: {
  open: boolean;
  sections: SideNavSection[];
  onClose: () => void;
}) {
  React.useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] md:hidden">
      <div
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Game navigation"
        className="absolute inset-y-0 left-0 flex w-[15rem] max-w-[85vw] flex-col overflow-hidden shadow-[24px_0_60px_-12px_rgba(0,0,0,0.9)] animate-in slide-in-from-left duration-200"
        style={{ background: "#1d1d1d", borderTopRightRadius: 20, borderBottomRightRadius: 20 }}
      >
        <div className="flex shrink-0 items-center justify-between px-3 pb-1 pt-3">
          <span className="font-mono text-[11px] font-semibold tracking-tight text-zinc-300">math_games</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="rounded-full p-1 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
        <NavList sections={sections} expanded withHoldTooltips={false} />
      </div>
    </div>
  );
}
