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
import { AdsNudgeModal } from "./components/AdsNudgeModal";
import { FeatureTooltips } from "./components/FeatureTooltips";
import { HalftoneHorizon } from "./components/ui/halftone-horizon";
import { GlassReveal21st } from "./components/ui/liquid-glass-logo-reveal";
import { Compass, Send, Sparkles, Settings, Gamepad2, MessageCircle, Bug, Shield, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, X } from "lucide-react";
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
const FOOTER_EXPANDED_KEY = "polytrack_footer_expanded";
// The bug report has its own shareable address, so /bug can be sent to anyone.
const BUG_REPORT_PATH = "/bug";

function bugReportOpenFromUrl() {
  try {
    return (
      /\/bug\/?$/.test(window.location.pathname) ||
      new URLSearchParams(window.location.search).get("bug") === "1"
    );
  } catch {
    return false;
  }
}


export function App() {
  const [loadingRevealEnabled, setLoadingRevealEnabled] = React.useState(() => {
    try {
      return localStorage.getItem("polytrack_loading_reveal_enabled") !== "false";
    } catch {
      return true;
    }
  });
  // Skip the intro on fast loads or if disabled in Settings; if the page has actually been waiting, let it play through.
  const [showLoadReveal, setShowLoadReveal] = React.useState(() => {
    try {
      if (localStorage.getItem("polytrack_loading_reveal_enabled") === "false") {
        return false;
      }
    } catch {}
    return typeof performance !== "undefined" && performance.now() > 250;
  });
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [adsNudgeOpen, setAdsNudgeOpen] = React.useState(false);
  const visitCountedRef = React.useRef(false);
  const [bugModalOpen, setBugModalOpen] = React.useState(bugReportOpenFromUrl);
  // The page the report is about, captured before /bug takes over the address bar.
  const [bugReportSourcePath, setBugReportSourcePath] = React.useState("/");
  // The footer starts collapsed; an explicit show/hide choice is remembered.
  const [footerVisible, setFooterVisible] = React.useState(() => {
    try {
      return localStorage.getItem(FOOTER_EXPANDED_KEY) === "true";
    } catch {
      return false;
    }
  });
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
  // "Turn off ads" stops every slot (catalog and chat), not just the notification ads.
  const [adsBlocked, setAdsBlocked] = React.useState(areNotificationAdsBlocked);
  const adsVisible = adSpotEnabled && !adsBlocked;
  const [installNoticeVisible, setInstallNoticeVisible] = React.useState(() => {
    try {
      return localStorage.getItem(INSTALL_NOTICE_SEEN_KEY) !== "true";
    } catch {
      return false;
    }
  });
  const [adminModalOpen, setAdminModalOpen] = React.useState(false);
  // A new worker taking over means this tab is still running the previous
  // bundle; offer the reload instead of letting it sit on old features.
  const [updateReady, setUpdateReady] = React.useState(false);
  const [mobilePanel, setMobilePanel] = React.useState<"games" | "chat">("games");
  const [isUnlocked, setIsUnlocked] = React.useState(false);
  const [bgConfig, setBgConfig] = React.useState<BackgroundConfig>(loadBackgroundConfig);

  React.useEffect(() => {
    document.getElementById("boot-loader")?.remove();
  }, []);

  React.useEffect(() => {
    return onBackgroundConfigChange((newConfig) => {
      setBgConfig(newConfig);
    });
  }, []);

  React.useEffect(() => {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
    // A first visit has no controller to replace, so only a swap counts.
    const hadController = !!navigator.serviceWorker.controller;
    const handleControllerChange = () => {
      if (hadController) setUpdateReady(true);
    };
    navigator.serviceWorker.addEventListener("controllerchange", handleControllerChange);
    return () => navigator.serviceWorker.removeEventListener("controllerchange", handleControllerChange);
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
  const toggleFooter = React.useCallback(() => {
    setFooterVisible((visible) => {
      const next = !visible;
      try {
        localStorage.setItem(FOOTER_EXPANDED_KEY, next ? "true" : "false");
      } catch {}
      return next;
    });
  }, []);

  const bugReturnUrlRef = React.useRef("/");

  const openBugReport = React.useCallback(() => {
    setBugReportSourcePath(window.location.pathname || "/");
    if (!bugReportOpenFromUrl()) {
      bugReturnUrlRef.current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
      try {
        window.history.pushState({ bugReport: true }, "", BUG_REPORT_PATH);
      } catch {}
    }
    setBugModalOpen(true);
  }, []);

  const closeBugReport = React.useCallback(() => {
    setBugModalOpen(false);
    try {
      if (bugReportOpenFromUrl()) window.history.replaceState(null, "", bugReturnUrlRef.current || "/");
    } catch {}
  }, []);

  // Back and forward move in and out of the bug report like any other page.
  React.useEffect(() => {
    const syncWithUrl = () => setBugModalOpen(bugReportOpenFromUrl());
    window.addEventListener("popstate", syncWithUrl);
    return () => window.removeEventListener("popstate", syncWithUrl);
  }, []);

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
      {loadingRevealEnabled && showLoadReveal && <GlassReveal21st onComplete={() => setShowLoadReveal(false)} />}
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
            <a
              href="/"
              aria-label="math_games home"
              className={`order-1 ${navCollapsed ? "flex" : "hidden"} shrink-0 items-center gap-2 group sm:flex`}
            >
              <span
                style={{
                  borderRadius: 36,
                  background: "rgba(255, 255, 255, 0.06)",
                  boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.04), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)",
                }}
                className="whitespace-nowrap px-2 py-1 font-mono text-[10.5px] font-semibold tracking-tight text-zinc-100 transition-colors group-hover:text-white sm:px-3 sm:text-[11.5px]"
              >
                math_games
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
                inert={navCollapsed}
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
            <p className="text-xs leading-relaxed">Add math_games to your home screen to use it like an app and unlock the advanced features.</p>
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

        {updateReady && (
          <div className="fixed left-1/2 top-3 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-zinc-900/95 py-1.5 pl-3.5 pr-1.5 text-xs text-zinc-100 shadow-[0_16px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-300" role="status">
            <span className="whitespace-nowrap">New version is ready</span>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-full bg-white/10 px-3 py-1 font-medium text-zinc-100 transition-colors hover:bg-white/20"
            >
              Reload
            </button>
            <button
              type="button"
              aria-label="Dismiss update notice"
              onClick={() => setUpdateReady(false)}
              className="rounded-full p-1 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
            >
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
          <h1 className="sr-only">math_games — browser games for a study break</h1>
          <section
            id="games-panel"
            aria-label="Games"
            className={`${mobilePanel === "games" ? "flex" : "hidden"} md:flex flex-1 flex-col min-h-0 min-w-0`}
          >
            <div id="games" className="flex-1 flex flex-col min-h-0">
              <GameCatalog showAdSpot={adsVisible} />
            </div>
          </section>

          {sideChatEnabled && (
            <aside
              id="chat-panel"
              aria-label="Chat and visitor count"
              className={`${mobilePanel === "chat" ? "flex" : "hidden"} md:flex w-full md:w-80 lg:w-96 flex-1 md:flex-none flex-col gap-3 shrink-0 min-h-0 md:h-full md:max-h-full animate-in fade-in slide-in-from-right-2 duration-300`}
            >
              <div className="flex-1 min-h-0 flex flex-col">
                <LiveMessageBoard showAds={adsVisible} />
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

        {/* Bottom Footer with Bug Report and Admin Panel; collapsed until asked for. */}
        <footer className={`shrink-0 px-2.5 pt-1 flex flex-wrap items-center gap-x-3 gap-y-1 pb-[calc(3.5rem+env(safe-area-inset-bottom))] sm:px-4 sm:pb-[calc(3.75rem+env(safe-area-inset-bottom))] md:pb-1.5 ${footerIsLight ? "text-[10.5px] text-black/70" : "text-[10.5px] text-zinc-500"}`}>
          <button
            type="button"
            onClick={toggleFooter}
            aria-expanded={footerVisible}
            aria-label={footerVisible ? "Hide footer" : "Show footer"}
            title={footerVisible ? "Hide footer" : "Show footer, bug report and admin panel"}
            style={footerChipStyle}
            className={`inline-flex cursor-pointer items-center gap-1 px-2.5 py-1 text-[10.5px] font-medium transition-colors ${footerIsLight ? "text-black/70 hover:bg-black/[0.07] hover:text-black" : "text-zinc-400 hover:bg-white/[0.08] hover:text-white"}`}
          >
            {footerVisible ? (
              <ChevronDown aria-hidden="true" className="h-3 w-3" />
            ) : (
              <ChevronUp aria-hidden="true" className="h-3 w-3" />
            )}
            <span>Footer</span>
          </button>
          {footerVisible && (
          <div className="flex min-w-0 flex-1 flex-wrap items-center justify-between gap-x-3 gap-y-1">
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
                onClick={openBugReport}
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
          </div>
          )}
        </footer>
      </div>

      <SettingsModal
        isOpen={settingsOpen}
        loadingRevealEnabled={loadingRevealEnabled}
        onLoadingRevealChange={(enabled) => {
          try {
            localStorage.setItem("polytrack_loading_reveal_enabled", enabled ? "true" : "false");
          } catch {}
          setLoadingRevealEnabled(enabled);
          if (!enabled) setShowLoadReveal(false);
        }}
        onClose={() => setSettingsOpen(false)}
        onLockNow={() => setIsUnlocked(false)}
        onReportBug={() => {
          setSettingsOpen(false);
          openBugReport();
        }}
        onOpenAdmin={() => {
          setSettingsOpen(false);
          setAdminModalOpen(true);
        }}
        onConfigChange={handleConfigChange}
        tabCloakSettings={tabCloakSettings}
        onTabCloakChange={handleTabCloakChange}
        onOpenChangelog={() => {
          setSettingsOpen(false);
          setChangelogOpen(true);
        }}
        adSpotEnabled={adSpotEnabled}
        onAdSpotChange={handleAdSpotChange}
        onAdsBlockedChange={setAdsBlocked}
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
        sourcePath={bugReportSourcePath}
        onClose={closeBugReport}
      />

      <GameSubmitModal
        isOpen={submitModalOpen}
        onClose={() => setSubmitModalOpen(false)}
      />

      <AdminPanelModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
      />

      <AdsNudgeModal
        isOpen={adsNudgeOpen}
        onClose={() => setAdsNudgeOpen(false)}
        onTurnOffAds={() => {
          setNotificationAdsBlocked(true);
          setAdsBlocked(true);
          setAdsNudgeOpen(false);
          window.location.reload();
        }}
      />

      <FeatureTooltips />
    </BackgroundWrapper>
  );
}
