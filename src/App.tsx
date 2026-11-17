import * as React from "react";
import { DEFAULT_GAMES, GameCatalog } from "./components/GameCatalog";
import { PanicButton } from "./components/PanicButton";
import { LiveMessageBoard } from "./components/LiveMessageBoard";
import { VisitorCounter } from "./components/VisitorCounter";
import { ShareButton } from "./components/ShareButton";
import { SettingsModal } from "./components/SettingsModal";
import { SiteLock } from "./components/SiteLock";
import { BugReportModal } from "./components/BugReportModal";
import { GameSubmitModal } from "./components/GameSubmitModal";
import { AdminPanelModal } from "./components/AdminPanelModal";
import { ChangelogModal } from "./components/ChangelogModal";
import { FeatureTooltips } from "./components/FeatureTooltips";
import { HalftoneHorizon } from "./components/ui/halftone-horizon";
import { BidvertiserAd } from "./components/BidvertiserAd";
import { Compass, Send, Sparkles, Settings, Gamepad2, MessageCircle, Bug, Shield, ChevronLeft, ChevronRight, X, BellOff } from "lucide-react";
import { applyTabCloak, loadTabCloakSettings, saveTabCloakSettings, type TabCloakSettings } from "./lib/tabCloak";
import {
  backgroundIsLight,
  loadBackgroundConfig,
  onBackgroundConfigChange,
  type BackgroundConfig,
} from "./lib/backgroundTheme";
import { formatLastUpdated, LAST_UPDATED_ISO } from "./lib/lastUpdated";
import { maybeNotifyNewGames } from "./lib/gameNotifications";
import { initOfflineMode } from "./lib/offlineCache";
import { finalizePlaySession } from "./lib/playStats";
import { areNotificationAdsBlocked, setNotificationAdsBlocked } from "./lib/adNotifications";

const CHIP_STYLE: React.CSSProperties = {
  borderRadius: 36,
  background: "rgba(255, 255, 255, 0.04)",
  boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.02), inset 0 1px 0 0 rgba(255, 255, 255, 0.04)",
};

function BackgroundWrapper({
  config,
  children,
}: {
  config: BackgroundConfig;
  children: React.ReactNode;
}) {
  if (config.type === "shader") {
    return (
      <HalftoneHorizon
        speed={0.25}
        grain={0.02}
        interactive={false}
        className="h-[100dvh] w-full font-sans text-zinc-100"
      >
        {children}
      </HalftoneHorizon>
    );
  }

  return (
    <div
      className="relative h-[100dvh] w-full font-sans text-zinc-100 overflow-hidden"
      style={{
        background: config.value,
        transition: "background 300ms ease",
      }}
    >
      {children}
    </div>
  );
}

const INSTALL_NOTICE_SEEN_KEY = "polytrack_install_notice_seen";
const SITE_VISITS_KEY = "polytrack_site_visits";
const ADS_NUDGE_SEEN_KEY = "polytrack_ads_nudge_seen";

export function App() {
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [adsNudgeOpen, setAdsNudgeOpen] = React.useState(false);
  const visitCountedRef = React.useRef(false);
  const [bugModalOpen, setBugModalOpen] = React.useState(false);
  const [submitModalOpen, setSubmitModalOpen] = React.useState(false);
  const [changelogOpen, setChangelogOpen] = React.useState(false);
  // The nav starts closed; an explicit open/close choice is remembered.
  const [navCollapsed, setNavCollapsed] = React.useState(
    () => localStorage.getItem("polytrack_nav_collapsed") !== "false"
  );
  const [adSpotEnabled, setAdSpotEnabled] = React.useState(
    () => localStorage.getItem("polytrack_ad_spot_enabled") !== "false"
  );
  const [sideChatEnabled, setSideChatEnabled] = React.useState(() => localStorage.getItem("polytrack_side_chat_enabled") !== "false");
  const [installNoticeVisible, setInstallNoticeVisible] = React.useState(() => {
    try {
      return localStorage.getItem(INSTALL_NOTICE_SEEN_KEY) !== "true";
    } catch {
      return false;
    }
  });
  const [adminModalOpen, setAdminModalOpen] = React.useState(false);
  const [mobilePanel, setMobilePanel] = React.useState<"games" | "chat">("games");
  const [isUnlocked, setIsUnlocked] = React.useState(false);
  const [bgConfig, setBgConfig] = React.useState<BackgroundConfig>(loadBackgroundConfig);

  React.useEffect(() => {
    return onBackgroundConfigChange((newConfig) => {
      setBgConfig(newConfig);
    });
  }, []);

  React.useEffect(() => {
    if (visitCountedRef.current) return;
    visitCountedRef.current = true;

    try {
      const previousVisits = Number.parseInt(localStorage.getItem(SITE_VISITS_KEY) || "0", 10);
      const visits = Number.isFinite(previousVisits) && previousVisits > 0 ? previousVisits + 1 : 1;
      localStorage.setItem(SITE_VISITS_KEY, String(visits));

      if (
        visits === 4 &&
        !areNotificationAdsBlocked() &&
        localStorage.getItem(ADS_NUDGE_SEEN_KEY) !== "true"
      ) {
        localStorage.setItem(ADS_NUDGE_SEEN_KEY, "true");
        setAdsNudgeOpen(true);
      }
    } catch {
      // The visit prompt is optional when browser storage is unavailable.
    }
  }, []);

  React.useEffect(() => {
    if (!installNoticeVisible) return;
    try {
      localStorage.setItem(INSTALL_NOTICE_SEEN_KEY, "true");
    } catch {}
    const timer = window.setTimeout(() => setInstallNoticeVisible(false), 5000);
    return () => window.clearTimeout(timer);
  }, [installNoticeVisible]);

  // Visitors who allowed notifications hear about games that were actually added.
  React.useEffect(() => {
    void maybeNotifyNewGames(DEFAULT_GAMES);
  }, []);

  // Re-send the offline schedule after a reload, when this device has an offline copy.
  React.useEffect(() => {
    initOfflineMode();
  }, []);

  // Games open in a new tab, so finish timing the last one when the hub is
  // visible again (return, back navigation or a restored page).
  React.useEffect(() => {
    // An in-page game keeps the hub visible while it runs, so only finish the
    // session once the launcher is gone and the hub is actually back.
    const hubIsActive = () => document.documentElement.dataset.gameLauncher !== "open";
    finalizePlaySession();
    const handleVisibility = () => {
      if (document.visibilityState === "visible" && hubIsActive()) finalizePlaySession();
    };
    const handlePageShow = () => {
      if (hubIsActive()) finalizePlaySession();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("pageshow", handlePageShow);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, []);

  React.useEffect(() => {
    if (bgConfig.type === "solid" || bgConfig.type === "gradient") {
      document.body.style.background = bgConfig.value;
    } else {
      document.body.style.background = "#09090b";
    }
  }, [bgConfig]);

  // The footer sits on the theme background, so its ink flips to whichever of
  // black or white stays readable against that particular backdrop.
  const footerIsLight = React.useMemo(() => backgroundIsLight(bgConfig), [bgConfig]);
  const lastUpdatedLabel = React.useMemo(() => formatLastUpdated(), []);
  const footerChipStyle: React.CSSProperties = footerIsLight
    ? {
        borderRadius: 36,
        background: "rgba(0, 0, 0, 0.06)",
        boxShadow: "inset 0 0 0 1px rgba(0, 0, 0, 0.08)",
      }
    : CHIP_STYLE;

  const [tabCloakSettings, setTabCloakSettings] = React.useState<TabCloakSettings>(loadTabCloakSettings);

  React.useEffect(() => {
    applyTabCloak(tabCloakSettings);
  }, [tabCloakSettings]);

  const handleTabCloakChange = (settings: TabCloakSettings) => {
    saveTabCloakSettings(settings);
    setTabCloakSettings(settings);
  };

  const [siteLockEnabled, setSiteLockEnabled] = React.useState(() => {
    return localStorage.getItem("polytrack_site_lock_enabled") === "true";
  });
  const [siteLockPassword, setSiteLockPassword] = React.useState(() => {
    return localStorage.getItem("polytrack_site_lock_password") || "";
  });

  const handleConfigChange = (enabled: boolean, pwd: string) => {
    setSiteLockEnabled(enabled);
    setSiteLockPassword(pwd);
  };

  const isLocked = siteLockEnabled && siteLockPassword.trim().length > 0 && !isUnlocked;

  // Remember whether the nav options are open or closed between visits.
  const toggleNav = () => {
    setNavCollapsed((collapsed) => {
      const next = !collapsed;
      try {
        localStorage.setItem("polytrack_nav_collapsed", next ? "true" : "false");
      } catch {}
      return next;
    });
  };

  const handleAdSpotChange = (enabled: boolean) => {
    try {
      localStorage.setItem("polytrack_ad_spot_enabled", enabled ? "true" : "false");
    } catch {}
    setAdSpotEnabled(enabled);
  };

  // Animate the collapse over the links' real width: transitioning a fixed max-width
  // leaves dead time before the links start to shrink, which reads as a snap.
  const navLinksRef = React.useRef<HTMLDivElement>(null);
  const [navLinksWidth, setNavLinksWidth] = React.useState(0);

  React.useEffect(() => {
    const element = navLinksRef.current;
    if (!element) return;
    const measure = () => setNavLinksWidth(Math.ceil(element.scrollWidth) + 1);
    measure();
    window.addEventListener("resize", measure);
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    observer?.observe(element);
    return () => {
      window.removeEventListener("resize", measure);
      observer?.disconnect();
    };
  }, []);

  // Same toggle button in three spots: beside the logo once collapsed, and in line with
  // the chips otherwise (inside the scrolling nav on desktop, pinned right on mobile).
  const renderNavToggle = (placement: string) => (
    <button
      type="button"
      onClick={toggleNav}
      aria-expanded={!navCollapsed}
      aria-label={navCollapsed ? "Expand navigation" : "Collapse navigation"}
      title={
        navCollapsed ? "Show Unblocked AIs, Outside games and Share" : "Hide Unblocked AIs, Outside games and Share"
      }
      style={CHIP_STYLE}
      className={`inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full p-0 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/[0.08] hover:text-white active:scale-[0.98] sm:h-auto sm:w-auto sm:gap-1.5 sm:px-3 sm:py-1 ${placement}`}
    >
      {navCollapsed ? (
        <ChevronRight aria-hidden="true" className="h-4 w-4 text-zinc-400 sm:h-3.5 sm:w-3.5" />
      ) : (
        <ChevronLeft aria-hidden="true" className="h-4 w-4 text-zinc-400 sm:h-3.5 sm:w-3.5" />
      )}
      <span className="sr-only">{navCollapsed ? "Expand navigation" : "Collapse navigation"}</span>
    </button>
  );

  return (
    <BackgroundWrapper config={bgConfig}>
      {isLocked && <SiteLock onUnlock={() => setIsUnlocked(true)} />}

      <div className="flex h-full min-h-0 w-full flex-col overflow-hidden">
        <a
          href="#main"
          className="sr-only rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-zinc-950 focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50"
        >
          Skip to games
        </a>

        {/* 3D Top Navigation Bar */}
        <header className="px-2 pt-2 sm:px-4 sm:pt-3 shrink-0 z-20">
          <div
            className="solid-3d-panel flex w-full flex-nowrap items-center justify-end gap-1.5 px-2.5 py-1 sm:justify-start sm:gap-4 sm:px-4 sm:py-2"
            style={{
              background: "#1d1d1d",
              borderRadius: 20,
              boxShadow:
                "inset 0 0 0 1px rgba(44,47,54,0.52), inset 0 0 50px 0 rgba(255,255,255,0.02), 0 10px 24px -6px rgba(0,0,0,0.5), 0 2px 6px rgba(0,0,0,0.3)",
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            <a href="/" className="order-1 hidden shrink-0 items-center gap-2 group sm:flex">
              <span
                style={{
                  borderRadius: 36,
                  background: "rgba(255, 255, 255, 0.06)",
                  boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.04), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)",
                }}
                className="px-3 py-1 text-xs font-semibold tracking-tight text-zinc-100 transition-colors group-hover:text-white whitespace-nowrap"
              >
                "Education" Games
              </span>
            </a>

            <nav
              aria-label="Site"
              className="order-1 flex min-w-0 flex-1 items-center justify-end gap-1 py-0.5 sm:order-2 sm:justify-start sm:gap-1.5"
            >
              <div
                id="site-nav-links"
                ref={navLinksRef}
                aria-hidden={navCollapsed}
                className="flex min-w-0 items-center gap-1 overflow-hidden transition-[max-width,opacity,transform] duration-300 ease-in-out sm:gap-1.5"
                style={{
                  maxWidth: navCollapsed ? 0 : navLinksWidth > 0 ? `${navLinksWidth}px` : "1000px",
                  opacity: navCollapsed ? 0 : 1,
                  transform: navCollapsed ? "translateX(-8px)" : "translateX(0)",
                }}
              >
                <button
                  type="button"
                  data-hint-target="submit-game"
                  aria-label="Submit a game"
                  aria-haspopup="dialog"
                  aria-expanded={submitModalOpen}
                  tabIndex={navCollapsed ? -1 : 0}
                  onClick={() => setSubmitModalOpen(true)}
                  style={CHIP_STYLE}
                  title="Submit a game"
                  className="inline-flex h-8 shrink-0 cursor-pointer items-center justify-center rounded-full px-2.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/[0.08] hover:text-white active:scale-[0.98] sm:h-auto sm:gap-1.5 sm:px-3 sm:py-1"
                >
                  <Send aria-hidden="true" className="h-4 w-4 text-zinc-400 sm:h-3.5 sm:w-3.5" />
                  <span className="hidden sm:inline">Submit a game</span>
                </button>
                <a href="/ai/" target="_blank" rel="noopener noreferrer" title="Open Unblocked AIs in a new tab" aria-label="Unblocked AIs (opens in a new tab)" style={CHIP_STYLE} className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full p-0 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/[0.08] hover:text-white active:scale-[0.98] sm:h-auto sm:w-auto sm:gap-1.5 sm:px-3 sm:py-1">
                  <Sparkles aria-hidden="true" className="h-4 w-4 text-zinc-400 sm:h-3.5 sm:w-3.5" /><span className="hidden sm:inline">Unblocked AIs</span>
                </a>
                <a href="/outside/" target="_blank" rel="noopener noreferrer" title="Open outside games in a new tab" aria-label="Outside games (opens in a new tab)" style={CHIP_STYLE} className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full p-0 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/[0.08] hover:text-white active:scale-[0.98] sm:h-auto sm:w-auto sm:gap-1.5 sm:px-3 sm:py-1">
                  <Compass aria-hidden="true" className="h-4 w-4 text-zinc-400 sm:h-3.5 sm:w-3.5" /><span className="hidden sm:inline">Outside games</span>
                </a>
                <ShareButton compact />
              </div>
              {renderNavToggle("inline-flex")}
            </nav>

            <div className="order-2 ml-0 flex shrink-0 items-center gap-1 sm:ml-auto sm:gap-2">
              <button
                type="button"
                data-hint-target="settings"
                onClick={() => setSettingsOpen(true)}
                title="Settings & Site Lock"
                aria-label="Settings"
                aria-haspopup="dialog"
                aria-expanded={settingsOpen}
                style={CHIP_STYLE}
                className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full p-0 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/[0.08] hover:text-white active:scale-[0.98] sm:h-auto sm:w-auto sm:gap-1.5 sm:rounded-none sm:px-3 sm:py-1"
              >
                <Settings aria-hidden="true" className="h-4 w-4 text-zinc-400 sm:h-3.5 sm:w-3.5" />
                <span className="hidden md:inline">Settings</span>
              </button>
              <PanicButton compact />
            </div>
          </div>
        </header>

        {installNoticeVisible && (
          <div className="fixed right-3 top-3 z-50 flex max-w-[min(24rem,calc(100vw-1.5rem))] items-start gap-3 rounded-2xl border border-white/10 bg-zinc-900/95 p-3.5 pr-2.5 text-zinc-100 shadow-[0_16px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-300" role="status">
            <p className="text-xs leading-relaxed">Add to home for this site to act like app, and get more advanced features!</p>
            <button type="button" aria-label="Close install notice" onClick={() => {
              setInstallNoticeVisible(false);
              try {
                localStorage.setItem(INSTALL_NOTICE_SEEN_KEY, "true");
              } catch {}
            }} className="shrink-0 rounded-full p-1 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white">
              <X aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Main Content Area */}
        <main
          id="main"
          tabIndex={-1}
          className="flex-1 flex flex-col md:flex-row min-h-0 p-2 gap-2 overflow-hidden focus:outline-none sm:p-3 sm:gap-3 md:p-4 md:pb-3"
        >
          <h1 className="sr-only">“Education” Games — browser games for a study break</h1>
          <section
            id="games-panel"
            aria-label="Games"
            className={`${mobilePanel === "games" ? "flex" : "hidden"} md:flex flex-1 flex-col min-h-0 min-w-0`}
          >
            <div id="games" className="flex-1 flex flex-col min-h-0">
              <GameCatalog showAdSpot={adSpotEnabled} />
            </div>
          </section>

          {sideChatEnabled && (
            <aside
              id="chat-panel"
              aria-label="Chat and visitor count"
              className={`${mobilePanel === "chat" ? "flex" : "hidden"} md:flex w-full md:w-80 lg:w-96 flex-1 md:flex-none flex-col gap-3 shrink-0 min-h-0 md:h-full md:max-h-full animate-in fade-in slide-in-from-right-2 duration-300`}
            >
              <div className="flex-1 min-h-0 flex flex-col">
                <LiveMessageBoard showAds={adSpotEnabled} />
              </div>
              <div className="shrink-0">
                <VisitorCounter />
              </div>
            </aside>
          )}
        </main>

        <nav
          aria-label="Mobile navigation"
          className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-center bg-gradient-to-t from-zinc-950/95 via-zinc-950/70 to-transparent px-3 pt-3 pb-[calc(0.4rem+env(safe-area-inset-bottom))] md:hidden"
        >
          <div className="flex w-full max-w-sm items-center gap-1 rounded-2xl border border-white/[0.06] bg-[#171717]/90 p-1 shadow-[0_8px_28px_rgba(0,0,0,0.38)] backdrop-blur-xl">
            <button
              type="button"
              onClick={() => setMobilePanel("games")}
              aria-controls="games-panel"
              aria-pressed={mobilePanel === "games"}
              className={`flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl px-4 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                mobilePanel === "games"
                  ? "bg-white/[0.09] text-zinc-100 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
                  : "text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-100"
              }`}
            >
              <Gamepad2 aria-hidden="true" className="h-4 w-4" />
              <span>Games</span>
            </button>
            {sideChatEnabled && (
              <button
                type="button"
                onClick={() => setMobilePanel("chat")}
                aria-controls="chat-panel"
                aria-pressed={mobilePanel === "chat"}
                className={`flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl px-4 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                  mobilePanel === "chat"
                    ? "bg-white/[0.09] text-zinc-100 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
                    : "text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-100"
                }`}
              >
                <MessageCircle aria-hidden="true" className="h-4 w-4" />
                <span>Chat</span>
              </button>
            )}
          </div>
        </nav>

        {/* Site-wide sponsor slot, above the footer */}
        {adSpotEnabled && (
          <div className="hidden shrink-0 justify-center px-3 sm:flex" aria-label="Advertisement">
            <div
              className="flex max-h-48 w-full max-w-md items-center justify-center overflow-hidden px-3 py-1.5"
              style={{
                borderRadius: 16,
                background: "rgba(255, 255, 255, 0.02)",
                boxShadow:
                  "inset 0 0 0 1px rgba(255, 255, 255, 0.04), inset 0 1px 0 0 rgba(255, 255, 255, 0.03)",
              }}
            >
              <BidvertiserAd slot="site" className="flex items-center justify-center" />
            </div>
          </div>
        )}

        {/* Bottom Footer with Bug Report and Admin Panel */}
        <footer className={`shrink-0 px-2.5 pt-1 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 pb-[calc(3.5rem+env(safe-area-inset-bottom))] sm:px-4 sm:pb-[calc(3.75rem+env(safe-area-inset-bottom))] md:pb-1.5 ${footerIsLight ? "text-[10.5px] text-black/70" : "text-[10.5px] text-zinc-500"}`}>
          <div className="flex min-w-0 flex-wrap items-center gap-2 sm:gap-2.5">
            <span className={`hidden font-medium sm:inline ${footerIsLight ? "text-black/85" : "text-zinc-400"}`}>Built by SS</span>
            <span
              className={`hidden sm:inline ${footerIsLight ? "text-black/60" : "text-zinc-500"}`}
              title={`Build ${LAST_UPDATED_ISO}`}
            >
              Updated {lastUpdatedLabel}
            </span>
            <div className="hidden items-center gap-1.5 sm:flex">
              <button
                type="button"
                data-hint-target="bug-report"
                onClick={() => setBugModalOpen(true)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium transition-colors cursor-pointer ${
                  footerIsLight ? "text-black/80 hover:text-black hover:bg-black/[0.07]" : "text-zinc-300 hover:text-white hover:bg-white/[0.08]"
                }`}
                style={footerChipStyle}
                title="Report a broken game or bug"
              >
                <Bug aria-hidden="true" className="w-3.5 h-3.5 text-amber-400" />
                <span>Report Bug</span>
              </button>
              <button
                type="button"
                onClick={() => setAdminModalOpen(true)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium transition-colors cursor-pointer ${
                  footerIsLight ? "text-black/80 hover:text-black hover:bg-black/[0.07]" : "text-zinc-300 hover:text-white hover:bg-white/[0.08]"
                }`}
                style={footerChipStyle}
                title="Admin panel (protected by Vercel ADMIN_PASSWORD)"
              >
                <Shield aria-hidden="true" className="w-3.5 h-3.5 text-blue-400" />
                <span>Admin</span>
              </button>
            </div>
          </div>
          <nav aria-label="Footer" className="hidden sm:flex flex-wrap items-center gap-x-4 gap-y-1">
            <a href="mailto:hello@base31.org" className={`transition-colors ${footerIsLight ? "text-black/70 hover:text-black" : "hover:text-zinc-200"}`}>
              hello@base31.org
            </a>
            <a href="/terms" className={`transition-colors ${footerIsLight ? "text-black/70 hover:text-black" : "hover:text-zinc-200"}`}>
              Terms of Service
            </a>
            <button
              type="button"
              onClick={() => setSubmitModalOpen(true)}
              className={`transition-colors cursor-pointer ${footerIsLight ? "text-black/70 hover:text-black" : "hover:text-zinc-200"}`}
            >
              Submit a game
            </button>
          </nav>
        </footer>
      </div>

      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onLockNow={() => setIsUnlocked(false)}
        onReportBug={() => setBugModalOpen(true)}
        onOpenAdmin={() => setAdminModalOpen(true)}
        onConfigChange={handleConfigChange}
        tabCloakSettings={tabCloakSettings}
        onTabCloakChange={handleTabCloakChange}
        onOpenChangelog={() => setChangelogOpen(true)}
        adSpotEnabled={adSpotEnabled}
        onAdSpotChange={handleAdSpotChange}
        sideChatEnabled={sideChatEnabled}
        onSideChatChange={(enabled) => {
          localStorage.setItem("polytrack_side_chat_enabled", enabled ? "true" : "false");
          setSideChatEnabled(enabled);
          if (!enabled) setMobilePanel("games");
        }}
      />

      <ChangelogModal isOpen={changelogOpen} onClose={() => setChangelogOpen(false)} />

      <BugReportModal
        isOpen={bugModalOpen}
        onClose={() => setBugModalOpen(false)}
      />

      <GameSubmitModal
        isOpen={submitModalOpen}
        onClose={() => setSubmitModalOpen(false)}
      />

      <AdminPanelModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
      />

      {adsNudgeOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={(event) => {
            if (event.target === event.currentTarget) setAdsNudgeOpen(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="ads-nudge-title"
            className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#1d1d1d] p-5 text-zinc-100 shadow-[0_24px_60px_rgba(0,0,0,0.7)]"
          >
            <div className="flex items-start gap-3">
              <span className="rounded-full bg-amber-500/10 p-2 text-amber-300">
                <BellOff aria-hidden="true" className="h-5 w-5" />
              </span>
              <div>
                <h2 id="ads-nudge-title" className="text-base font-semibold">
                  Dont like the ads??? turn them off
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                  You can turn off notification ads for this browser anytime in Settings.
                </p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => setAdsNudgeOpen(false)}
                className="rounded-lg px-3 py-2 text-xs font-medium text-zinc-400 transition-colors hover:bg-white/[0.06] hover:text-zinc-100"
              >
                Maybe later
              </button>
              <button
                type="button"
                onClick={() => {
                  setNotificationAdsBlocked(true);
                  setAdsNudgeOpen(false);
                  window.location.reload();
                }}
                className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-zinc-950 transition-colors hover:bg-zinc-100"
              >
                Turn off ads
              </button>
            </div>
          </section>
        </div>
      )}

      <FeatureTooltips />
    </BackgroundWrapper>
  );
}
