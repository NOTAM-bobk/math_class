import * as React from "react";
import { createPortal } from "react-dom";
import { CornerDownLeft, Search, type LucideIcon } from "lucide-react";
import { useDialogFocus } from "@/lib/dialogFocus";

export interface CommandPaletteItem {
  id: string;
  label: string;
  group: string;
  hint?: string;
  icon?: LucideIcon;
  run: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  commands: CommandPaletteItem[];
  /** Shown in the footer, e.g. "⌘K". */
  shortcutLabel?: string;
}

const PANEL_STYLE: React.CSSProperties = {
  background: "#1d1d1d",
  borderRadius: 16,
  boxShadow:
    "0 24px 60px -12px rgba(0,0,0,0.7), 0 4px 12px rgba(0,0,0,0.4)",
};

export function CommandPalette({ isOpen, onClose, commands, shortcutLabel = "⌘K" }: CommandPaletteProps) {
  const panelRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);
  const [query, setQuery] = React.useState("");
  const [activeIndex, setActiveIndex] = React.useState(0);

  useDialogFocus({ active: isOpen, onClose, panelRef, initialFocusRef: inputRef });

  React.useEffect(() => {
    if (!isOpen) return;
    setQuery("");
    setActiveIndex(0);
  }, [isOpen]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((command) =>
      `${command.label} ${command.group} ${command.hint ?? ""}`.toLowerCase().includes(q)
    );
  }, [commands, query]);

  React.useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const active = Math.min(activeIndex, Math.max(filtered.length - 1, 0));

  // Keep the highlighted row in view when the arrow keys move past the fold.
  React.useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>('[role="option"][aria-selected="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [active, filtered.length]);

  if (!isOpen) return null;

  const runCommand = (command: CommandPaletteItem) => {
    onClose();
    command.run();
  };

  const groups: { group: string; items: { command: CommandPaletteItem; index: number }[] }[] = [];
  filtered.forEach((command, index) => {
    const last = groups[groups.length - 1];
    if (last && last.group === command.group) last.items.push({ command, index });
    else groups.push({ group: command.group, items: [{ command, index }] });
  });

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/70 p-3 pt-[10vh] backdrop-blur-sm sm:p-4 sm:pt-[12vh]"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        tabIndex={-1}
        style={PANEL_STYLE}
        className="flex max-h-[70vh] w-full max-w-xl flex-col overflow-hidden text-zinc-100 focus:outline-none"
      >
        <div className="flex items-center gap-2.5 border-b border-white/[0.07] px-4 py-3">
          <Search aria-hidden="true" className="h-4 w-4 shrink-0 text-zinc-500" />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls="command-palette-results"
            aria-autocomplete="list"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown") {
                event.preventDefault();
                setActiveIndex((index) => Math.min(index + 1, filtered.length - 1));
              } else if (event.key === "ArrowUp") {
                event.preventDefault();
                setActiveIndex((index) => Math.max(index - 1, 0));
              } else if (event.key === "Enter") {
                event.preventDefault();
                const command = filtered[active];
                if (command) runCommand(command);
              }
            }}
            placeholder="Search games, pages and actions…"
            autoComplete="off"
            spellCheck={false}
            className="w-full bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
            style={{ border: "none", padding: 0 }}
          />
          <kbd className="shrink-0 rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 font-mono text-[11px] leading-none text-zinc-500">
            Esc
          </kbd>
        </div>

        <div ref={listRef} id="command-palette-results" role="listbox" aria-label="Commands" className="overflow-y-auto p-2">
          {groups.map(({ group, items }) => (
            <div key={group} className="mb-1 last:mb-0">
              <div className="px-2.5 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                {group}
              </div>
              {items.map(({ command, index }) => {
                const Icon = command.icon;
                const selected = index === active;
                return (
                  <button
                    key={command.id}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onMouseMove={() => setActiveIndex(index)}
                    onClick={() => runCommand(command)}
                    className={`flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs transition-colors ${
                      selected ? "bg-white/[0.08] text-white" : "text-zinc-300 hover:bg-white/[0.05]"
                    }`}
                  >
                    {Icon ? (
                      <Icon aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
                    ) : (
                      <span aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                    )}
                    <span className="min-w-0 flex-1 truncate font-medium">{command.label}</span>
                    {command.hint && (
                      <span className="shrink-0 text-[11px] text-zinc-500">{command.hint}</span>
                    )}
                    {selected && (
                      <CornerDownLeft aria-hidden="true" className="h-3 w-3 shrink-0 text-zinc-500" />
                    )}
                  </button>
                );
              })}
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="px-3 py-10 text-center text-xs text-zinc-500">
              Nothing matches “{query.trim()}”.
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-white/[0.07] px-4 py-2 text-[11px] text-zinc-500">
          <span className="flex items-center gap-1.5">
            <kbd className="rounded border border-white/10 bg-white/[0.04] px-1 py-0.5 font-mono">↑</kbd>
            <kbd className="rounded border border-white/10 bg-white/[0.04] px-1 py-0.5 font-mono">↓</kbd>
            to move
            <kbd className="ml-1 rounded border border-white/10 bg-white/[0.04] px-1 py-0.5 font-mono">↵</kbd>
            to open
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 font-mono">{shortcutLabel}</kbd>
            to toggle
          </span>
        </div>
      </div>
    </div>,
    document.body
  );
}
