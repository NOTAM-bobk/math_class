import * as React from "react";

// Bidvertiser widget tag (account 2108105). The tag rewrites the id of the
// element it finds, so every placement gets its own host id — otherwise the
// second widget would attach to the first one and only one ad would render.
const WIDGET_BASE_ID = "ntv_2108105";
const OWNER_ID = 2108105;
const SCRIPT_PATH = "/bidvertiser/tags/active/bdvws.js";

let instanceCount = 0;

export function BidvertiserAd({
  slot,
  className = "",
}: {
  slot: string;
  className?: string;
}) {
  const hostRef = React.useRef<HTMLDivElement>(null);
  const loadedRef = React.useRef(false);
  const [closed, setClosed] = React.useState(false);
  const [widgetId] = React.useState(() => {
    instanceCount += 1;
    return `${WIDGET_BASE_ID}_${slot}_${instanceCount}`;
  });

  React.useEffect(() => {
    const host = hostRef.current;
    // One loader per slot: a re-render must not stack a second ad.
    if (!host || loadedRef.current) return;
    loadedRef.current = true;

    const params: Record<string, string | number> = {
      bvwidgetid: widgetId,
      bvlinksownid: OWNER_ID,
      rows: 1,
      cols: 1,
      textpos: "below",
      imagewidth: 120,
      mobilecols: 1,
      cb: Date.now(),
    };
    const query = Object.keys(params)
      .map((key) => `${key}=${encodeURIComponent(String(params[key]))}`)
      .join("&");

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    // Same-origin path: vercel.json rewrites it to the ad CDN so restricted networks still load it.
    script.src = `${SCRIPT_PATH}?${query}`;
    host.appendChild(script);
  }, [widgetId]);

  if (closed) return null;

  return (
    <div className="relative inline-flex max-w-full">
      <div ref={hostRef} id={widgetId} data-ad-slot={slot} className={className} />
      <button
        type="button"
        onClick={() => setClosed(true)}
        aria-label="Close ad"
        title="Close ad"
        className="absolute -right-1.5 -top-1.5 z-10 flex h-4 w-4 cursor-pointer items-center justify-center rounded-full bg-zinc-800 text-[10px] leading-none text-zinc-300 shadow ring-1 ring-white/15 transition-colors hover:bg-zinc-700 hover:text-white"
      >
        ×
      </button>
    </div>
  );
}
