import * as React from "react";
import { X, Send, AlertCircle, CheckCircle2, Loader2, Gamepad2 } from "lucide-react";
import { useDialogFocus } from "@/lib/dialogFocus";
import { submitGameRequest } from "@/lib/hubApi";
import { CATEGORY_FILTERS } from "./GameCatalog";

interface GameSubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CHIP_STYLE: React.CSSProperties = {
  borderRadius: 36,
  background: "rgba(255, 255, 255, 0.04)",
  boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.02), inset 0 1px 0 0 rgba(255, 255, 255, 0.04)",
};

const FIELD_STYLE: React.CSSProperties = {
  borderRadius: 10,
  background: "rgba(255, 255, 255, 0.04)",
  boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.06)",
};

const SUBMISSION_CATEGORIES = CATEGORY_FILTERS.filter(
  (category) => !["all", "favorites", "editors", "trending", "buggy", "blocked"].includes(category.id)
);

export function GameSubmitModal({ isOpen, onClose }: GameSubmitModalProps) {
  const [name, setName] = React.useState("");
  const [url, setUrl] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [submittedBy, setSubmittedBy] = React.useState("");
  const [website, setWebsite] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [success, setSuccess] = React.useState(false);

  const panelRef = React.useRef<HTMLDivElement>(null);
  useDialogFocus({ active: isOpen, onClose, panelRef });

  // Submitting replaces the form with a confirmation, so move focus there
  // instead of leaving it on the button that just disappeared.
  const successRef = React.useRef<HTMLHeadingElement>(null);
  React.useEffect(() => {
    if (success) successRef.current?.focus();
  }, [success]);

  if (!isOpen) return null;

  const resetForm = () => {
    setName("");
    setUrl("");
    setCategory("");
    setDescription("");
    setSubmittedBy("");
    setWebsite("");
    setErrorMessage("");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (submitting) return;

    if (name.trim().length < 2) {
      setErrorMessage("Enter the name of the game.");
      return;
    }
    if (!url.trim()) {
      setErrorMessage("Add a link to the game.");
      return;
    }

    setSubmitting(true);
    setErrorMessage("");

    try {
      await submitGameRequest({
        name: name.trim(),
        url: url.trim(),
        category,
        description: description.trim(),
        submittedBy: submittedBy.trim(),
        website,
        pageUrl: window.location.pathname || "/",
      });
      setSuccess(true);
      resetForm();
    } catch (error) {
      setErrorMessage(
        error instanceof Error && error.message
          ? error.message
          : "Could not send the game request. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overscroll-contain bg-black/80 p-3 backdrop-blur-sm sm:p-4"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="submit-game-title"
        tabIndex={-1}
        className="relative my-auto flex w-full max-w-lg flex-col gap-4 p-5 text-zinc-100 focus:outline-none sm:p-6"
        style={{
          background: "#1d1d1d",
          borderRadius: 20,
          border: "none",
          boxShadow:
            "inset 0 0 0 1px rgba(44, 47, 54, 0.65), inset 0 0 50px 0 rgba(255, 255, 255, 0.02), 0 24px 60px -12px rgba(0, 0, 0, 0.9), 0 6px 16px rgba(0, 0, 0, 0.6)",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <div className="flex items-center gap-2">
            <div
              style={{
                borderRadius: 36,
                background: "rgba(6, 182, 212, 0.12)",
                boxShadow: "inset 0 0 0 1px rgba(6, 182, 212, 0.2)",
              }}
              className="p-1.5 text-cyan-400"
            >
              <Gamepad2 aria-hidden="true" className="w-4 h-4" />
            </div>
            <div>
              <h2 id="submit-game-title" className="text-base font-semibold tracking-tight text-zinc-100">
                Submit a game
              </h2>
              <p className="text-[11px] text-zinc-500">Requests go straight to the admin panel.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg p-1 text-zinc-400 transition-colors hover:bg-white/[0.08] hover:text-white"
            aria-label="Close submit game modal"
          >
            <X aria-hidden="true" className="w-4 h-4" />
          </button>
        </div>

        {success ? (
          <div className="flex flex-col items-center py-6 text-center">
            <div className="mb-3 rounded-full bg-emerald-500/10 p-3 text-emerald-400">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 ref={successRef} tabIndex={-1} className="text-base font-semibold text-zinc-100 focus:outline-none">Game request sent!</h3>
            <p className="mt-1.5 max-w-sm text-xs text-zinc-400">
              Thanks — an admin will review the game and add it to the catalog if it fits.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setSuccess(false)}
                style={CHIP_STYLE}
                className="cursor-pointer px-4 py-2 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/[0.08] hover:text-white"
              >
                Submit another game
              </button>
              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer rounded-lg bg-white px-4 py-2 text-xs font-semibold text-zinc-950 transition-colors hover:bg-zinc-100"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="submit-game-name" className="text-[11px] font-medium text-zinc-400">
                  Game name <span className="text-cyan-400">*</span>
                </label>
                <input
                  id="submit-game-name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                    if (errorMessage) setErrorMessage("");
                  }}
                  placeholder="e.g. Bloons Tower Defense 5"
                  maxLength={120}
                  autoComplete="off"
                  style={FIELD_STYLE}
                  className="w-full px-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="submit-game-category" className="text-[11px] font-medium text-zinc-400">
                  Category
                </label>
                <select
                  id="submit-game-category"
                  name="category"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  style={FIELD_STYLE}
                  className="w-full cursor-pointer px-3 py-2 text-xs text-zinc-100 focus:outline-none"
                >
                  <option value="" className="bg-[#1d1d1d]">No category</option>
                  {SUBMISSION_CATEGORIES.map((option) => (
                    <option key={option.id} value={option.label} className="bg-[#1d1d1d]">
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="submit-game-url" className="text-[11px] font-medium text-zinc-400">
                Game link <span className="text-cyan-400">*</span>
              </label>
              <input
                id="submit-game-url"
                name="url"
                type="text"
                required
                inputMode="url"
                value={url}
                onChange={(event) => {
                  setUrl(event.target.value);
                  if (errorMessage) setErrorMessage("");
                }}
                placeholder="https://example.com/game or /games/my-game.html"
                maxLength={500}
                autoComplete="off"
                spellCheck={false}
                style={FIELD_STYLE}
                className="w-full px-3 py-2 font-mono text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="submit-game-notes" className="text-[11px] font-medium text-zinc-400">
                  Notes for the admin
                </label>
                <span className="text-[10px] text-zinc-500">{description.length}/1000</span>
              </div>
              <textarea
                id="submit-game-notes"
                name="description"
                rows={3}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Why should this be added? Is it unblocked, Flash, multiplayer…?"
                maxLength={1000}
                style={FIELD_STYLE}
                className="w-full resize-none px-3 py-2 text-xs leading-relaxed text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="submit-game-author" className="text-[11px] font-medium text-zinc-400">
                Your name <span className="text-zinc-500">(optional)</span>
              </label>
              <input
                id="submit-game-author"
                name="submittedBy"
                type="text"
                value={submittedBy}
                onChange={(event) => setSubmittedBy(event.target.value)}
                placeholder="So the admin knows who to thank"
                maxLength={60}
                autoComplete="off"
                style={FIELD_STYLE}
                className="w-full px-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
              />
            </div>

            {/* Honeypot: hidden from people, filled by bots. */}
            <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden opacity-0">
              <label htmlFor="submit-game-website">Website</label>
              <input
                id="submit-game-website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(event) => setWebsite(event.target.value)}
              />
            </div>

            {errorMessage && (
              <div
                role="alert"
                className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-2.5 text-xs text-red-400"
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span className="flex-1">{errorMessage}</span>
              </div>
            )}

            <div className="flex items-center justify-between gap-2 border-t border-white/[0.08] pt-3">
              <span className="text-[10px] text-zinc-500">Rate limited: 5 / 10 min</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  style={CHIP_STYLE}
                  className="cursor-pointer px-3.5 py-2 text-xs font-medium text-zinc-400 transition-colors hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-xs font-semibold text-zinc-950 transition-colors hover:bg-zinc-100 active:scale-95 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Sending…</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5" />
                      <span>Send request</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
