import * as React from "react";
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

function NavButton({
  item,
  expanded,
}: {
  item: SideNavItem;
  expanded: boolean;
}) {
  const Icon = item.icon;
  return (
    <button
      type="button"
      onClick={item.onSelect}
      aria-current={item.active ? "page" : undefined}
      aria-label={item.label}
      title={expanded ? undefined : item.label}
      className={`group flex h-9 w-full shrink-0 items-center gap-2.5 rounded-xl text-left text-[12.5px] transition-colors ${
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
  );
}

function NavList({
  sections,
  expanded,
}: {
  sections: SideNavSection[];
  expanded: boolean;
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
              <NavButton key={item.id} item={item} expanded={expanded} />
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

/** The desktop rail. Collapsed it is a strip of icons; expanded it shows labels. */
export function SideNav({
  sections,
  expanded,
  onToggleExpanded,
}: {
  sections: SideNavSection[];
  expanded: boolean;
  onToggleExpanded: () => void;
}) {
  return (
    <nav
      aria-label="Game navigation"
      className={`hidden shrink-0 flex-col overflow-hidden transition-[width] duration-200 ease-out md:flex ${
        expanded ? "w-[13rem]" : "w-14"
      }`}
      style={PANEL_STYLE}
    >
      <NavList sections={sections} expanded={expanded} />
      <div className="shrink-0 border-t border-white/[0.07] p-2">
        <button
          type="button"
          onClick={onToggleExpanded}
          aria-expanded={expanded}
          aria-label={expanded ? "Collapse navigation" : "Expand navigation"}
          title={expanded ? "Collapse navigation" : "Expand navigation"}
          className={`flex h-9 w-full items-center gap-2.5 rounded-xl text-[12.5px] font-medium text-zinc-400 transition-colors hover:bg-white/[0.06] hover:text-zinc-100 ${
            expanded ? "px-2.5" : "justify-center px-0"
          }`}
        >
          <PanelLeft aria-hidden="true" className="h-4 w-4 shrink-0" />
          {expanded && <span>Collapse</span>}
        </button>
      </div>
    </nav>
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
        <NavList sections={sections} expanded />
      </div>
    </div>
  );
}
