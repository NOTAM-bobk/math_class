import * as React from "react";

// Display units from bauval.org / abscloud.org. These are the networks' own
// snippets: the banner loaders read window.atOptions when they run, so banners
// are appended one at a time and each one stays loaded once it has been placed.

export type PartnerBannerSize = "leaderboard" | "banner";

const BANNERS: Record<PartnerBannerSize, { key: string; width: number; height: number }> = {
  leaderboard: { key: "36650ca67c0f875332259f2843faef35", width: 728, height: 90 },
  banner: { key: "70f87b96329f0e065438e8f7c7c895e5", width: 468, height: 60 },
};

const NATIVE_KEY = "2d77983aabb415ae213d259a2ea27431";
const NATIVE_CONTAINER_ID = `container-${NATIVE_KEY}`;

// One banner at a time: both loaders read the shared window.atOptions global.
let bannerQueue: Promise<void> = Promise.resolve();

function appendBanner(size: PartnerBannerSize, host: HTMLElement): Promise<void> {
  const { key, width, height } = BANNERS[size];

  bannerQueue = bannerQueue.then(
    () =>
      new Promise<void>((resolve) => {
        if (!host.isConnected) {
          resolve();
          return;
        }

        (window as unknown as { atOptions?: Record<string, unknown> }).atOptions = {
          key,
          format: "iframe",
          height,
          width,
          params: {},
        };

        const script = document.createElement("script");
        // The loader reads the global above and its own script element, so keep
        // this request in order instead of firing it off unsequenced.
        script.async = false;
        script.src = `https://bauval.org/22/${key}`;
        script.onload = () => resolve();
        script.onerror = () => resolve();
        host.appendChild(script);
      }),
  );

  return bannerQueue;
}

/** The catalog has room for one fixed-size banner; pick it once, at mount. */
export function pickPartnerBannerSize(): PartnerBannerSize | null {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return null;
  if (window.matchMedia("(min-width: 1280px)").matches) return "leaderboard";
  if (window.matchMedia("(min-width: 1024px)").matches) return "banner";
  return null;
}

export function PartnerBanner({
  size,
  className = "",
}: {
  size: PartnerBannerSize;
  className?: string;
}) {
  const hostRef = React.useRef<HTMLDivElement>(null);
  const requestedRef = React.useRef(false);
  const { width, height } = BANNERS[size];

  React.useEffect(() => {
    const host = hostRef.current;
    if (!host || requestedRef.current) return;
    requestedRef.current = true;
    void appendBanner(size, host);
  }, [size]);

  return (
    <div
      ref={hostRef}
      aria-label="Advertisement"
      className={`flex w-full items-center justify-center overflow-hidden ${className}`}
      style={{ maxWidth: width, minHeight: height }}
    />
  );
}

export function PartnerNativeAd({ className = "" }: { className?: string }) {
  const hostRef = React.useRef<HTMLDivElement>(null);
  const requestedRef = React.useRef(false);

  React.useEffect(() => {
    const host = hostRef.current;
    if (!host || requestedRef.current) return;
    requestedRef.current = true;

    // This loader waits for #container-<key> to appear and fills it in place.
    const script = document.createElement("script");
    script.async = true;
    script.dataset.cfasync = "false";
    script.src = `https://bauval.org/21/${NATIVE_KEY}`;
    host.appendChild(script);
  }, []);

  return (
    <div ref={hostRef} aria-label="Advertisement" className={`flex w-full justify-center ${className}`}>
      <div id={NATIVE_CONTAINER_ID} className="w-full" />
    </div>
  );
}
