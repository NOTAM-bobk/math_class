import * as React from "react";
import { GameCatalog, initialCategory, initialSearchQuery, type CategoryId } from "./components/GameCatalog";
import { SideNav, SideNavDrawer, type SideNavSection } from "./components/SideNav";
import { PanicButton } from "./components/PanicButton";
import { LiveMessageBoard } from "./components/LiveMessageBoard";
import { VisitorCounter } from "./components/VisitorCounter";
import { ShareButton } from "./components/ShareButton";
import { SiteLock } from "./components/SiteLock";
import { BugReportModal } from "./components/BugReportModal";
import { GameSubmitModal } from "./components/GameSubmitModal";
import { AdsNudgeModal } from "./components/AdsNudgeModal";
import { Tour, useTour } from "./components/Tour";
import { BotChallengeGate } from "./components/BotChallengeGate";
import { HalftoneHorizon } from "./components/ui/halftone-horizon";
import { GlassReveal21st } from "./components/ui/liquid-glass-logo-reveal";
import {
  Bug,
  Car,
  CheckCircle2,
  Compass,
  Flame,
  Gamepad2,
  Ghost,
  Heart,
  History,
  Home,
  Infinity as InfinityIcon,
  Menu,
  MessageCircle,
  Puzzle,
  Search,
  Send,
  Settings,
  Shield,
  Sparkles,
  Star,
  Trophy,
  X,
  Zap,
} from "lucide-react";
import { applyTabCloak, loadTabCloakSettings, saveTabCloakSettings, type TabCloakSettings } from "./lib/tabCloak";
import {
  backgroundIsLight,
  loadBackgroundConfig,
  onBackgroundConfigChange,
  type BackgroundConfig,
} from "./lib/backgroundTheme";
import { LAST_UPDATED_ISO } from "./lib/lastUpdated";
import { loadSiteMeta, type SiteMeta } from "./lib/siteMeta";
import { maybeNotifyNewGames } from "./lib/gameNotifications";
import { initOfflineMode } from "./lib/offlineCache";
import { finalizePlaySession, startPlayStatsClock } from "./lib/playStats";
import { areNotificationAdsBlocked } from "./lib/adNotifications";
import { hasPassedBotChallenge, startStartupBotCheck } from "./lib/botDetection";
import { loadCatalog } from "./lib/catalog";
import {
  CHAT_COMPOSER_TARGET,
  getOnboardingSteps,
  ONBOARDING_STORAGE_KEY,
} from "./lib/onboardingSteps";

// The settings, admin and change log dialogs are large and most visits never
// open them, so each one is a separate chunk loaded on first use.
const SettingsModal = React.lazy(() =>
  import("./components/SettingsModal").then((module) => ({ default: module.SettingsModal }))
);
const AdminPanelModal = React.lazy(() =>
  import("./components/AdminPanelModal").then((module) => ({ default: module.AdminPanelModal }))
);
const ChangelogModal = React.lazy(() =>
  import("./components/ChangelogModal").then((module) => ({ default: module.ChangelogModal }))
);

const CHIP_STYLE: React.CSSProperties = {
  borderRadius: 36,
  background: "rgba(255, 255, 255, 0.04)",
  boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.02), inset 0 1px 0 0 rgba(255, 255, 255, 0.04)",
};

const ICON_BUTTON_STYLE: React.CSSProperties = {
  borderRadius: 999,
  background: "rgba(255, 255, 255, 0.06)",
  boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.05), inset 0 1px 0 0 rgba(255, 255, 255, 0.06)",
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
  // A game the reporter was playing; the form fills this in for them.
  const [bugReportGame, setBugReportGame] = React.useState("");
  const [submitModalOpen, setSubmitModalOpen] = React.useState(false);
  const [changelogOpen, setChangelogOpen] = React.useState(false);
  // Ads are always on now: removing them is an Ultra feature, not a setting.
  const adSpotEnabled = true;
  const [sideChatEnabled, setSideChatEnabled] = React.useState(() => localStorage.getItem("polytrack_side_chat_enabled") !== "false");
  // The footer starts hidden; Settings > Show footer turns it back on.
  const [footerHidden, setFooterHidden] = React.useState(() => {
    try {
      return localStorage.getItem("polytrack_footer_hidden") !== "false";
    } catch {
      return true;
    }
  });
  const adsVisible = adSpotEnabled;
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
  // Search and the active filter live here so the top nav and side nav can
  // drive the catalog without passing refs around.
  const [searchQuery, setSearchQuery] = React.useState(initialSearchQuery);
  const [selectedCategory, setSelectedCategory] = React.useState<CategoryId>(initialCategory);
  const [sideNavExpanded, setSideNavExpanded] = React.useState(() => {
    try {
      return localStorage.getItem("polytrack_side_nav_expanded") === "true";
    } catch {
      return false;
    }
  });
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);
  const searchRef = React.useRef<HTMLInputElement>(null);

  // First-visit walkthrough; the storage flag keeps it to one showing.
  const onboarding = useTour(ONBOARDING_STORAGE_KEY);
  const {
    open: onboardingOpen,
    setOpen: setOnboardingOpen,
    index: onboardingIndex,
    setIndex: setOnboardingIndex,
  } = onboarding;
  // The side rail is desktop-only, so phones get the same tour without it.
  const isPhoneViewport = React.useMemo(
    () => window.matchMedia("(max-width: 767px)").matches,
    []
  );
  const tourSteps = React.useMemo(() => getOnboardingSteps(isPhoneViewport), [isPhoneViewport]);

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
    const handleControllerChange = () => {
      setUpdateReady(true);
    };
    navigator.serviceWorker.addEventListener("controllerchange", handleControllerChange);

    const handleFocus = () => {
      navigator.serviceWorker.getRegistrations().then((regs) => {
        regs.forEach((r) => r.update().catch(() => {}));
      }).catch(() => {});
    };
    window.addEventListener("focus", handleFocus);

    return () => {
      navigator.serviceWorker.removeEventListener("controllerchange", handleControllerChange);
      window.removeEventListener("focus", handleFocus);
    };
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
    loadCatalog()
      .then((games) => maybeNotifyNewGames(games))
      .catch(() => {});
  }, []);

  // Re-send the offline schedule after a reload, when this device has an offline copy.
  React.useEffect(() => {
    initOfflineMode();
  }, []);

  // Games open in a new tab, so finish timing the last one when the hub is
  // visible again (return, back navigation or a restored page).
  React.useEffect(() => {
    // The stats clock counts every second the hub or a game is open.
    const stopClock = startPlayStatsClock();
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
      stopClock();
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
  // Footer credit lines from the build stamp.
  const [siteMeta] = React.useState<SiteMeta>(loadSiteMeta);
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

  // The on-device bot check starts while the glass reveal plays; a suspicious
  // result waits behind the reveal and raises the Cloudflare check only after
  // the loading screen is gone.
  const [botChallengePending, setBotChallengePending] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    startStartupBotCheck().then((result) => {
      if (!cancelled && result.suspected && !hasPassedBotChallenge()) {
        setBotChallengePending(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

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

  // On phones the chat lives in its own panel, so switch to it while the tour
  // is on that step and go back to the games panel when the tour closes.
  const handleTourIndexChange = React.useCallback(
    (nextIndex: number) => {
      setOnboardingIndex(nextIndex);
      if (isPhoneViewport) {
        setMobilePanel(tourSteps[nextIndex]?.target === CHAT_COMPOSER_TARGET ? "chat" : "games");
      }
    },
    [isPhoneViewport, setOnboardingIndex, tourSteps]
  );

  const handleTourOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      setOnboardingOpen(nextOpen);
      if (!nextOpen && isPhoneViewport) setMobilePanel("games");
    },
    [isPhoneViewport, setOnboardingOpen]
  );

  // Show the walkthrough once, after the intro reveal and any gate has cleared.
  React.useEffect(() => {
    if (isLocked || showLoadReveal || botChallengePending || onboarding.seen()) return;
    const timer = window.setTimeout(() => {
      // Expand the side rail so its labels are readable while it is highlighted.
      setSideNavExpanded(true);
      onboarding.start();
    }, 1600);
    return () => window.clearTimeout(timer);
  }, [isLocked, showLoadReveal, botChallengePending, onboarding.seen, onboarding.start]);

  // Remember whether the nav options are open or closed between visits.
  const bugReturnUrlRef = React.useRef("/");

  const openBugReport = React.useCallback((gameName?: string) => {
    setBugReportSourcePath(window.location.pathname || "/");
    setBugReportGame(gameName?.trim() || "");
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
    setBugReportGame("");
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

  // "/" jumps to search from anywhere on the page, the usual shortcut in game libraries.
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
      ) {
        return;
      }
      if (document.querySelector('[role="dialog"]')) return;
      event.preventDefault();
      searchRef.current?.focus();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleSideNav = React.useCallback(() => {
    setSideNavExpanded((expanded) => {
      const next = !expanded;
      try {
        localStorage.setItem("polytrack_side_nav_expanded", next ? "true" : "false");
      } catch {}
      return next;
    });
  }, []);

  const selectCategory = React.useCallback((category: CategoryId) => {
    setSelectedCategory(category);
    setMobileNavOpen(false);
  }, []);

  // The side navigation mirrors the catalog's filters plus the hub's actions,
  // grouped the same way in both the rail and the phone drawer.
  const sideNavSections: SideNavSection[] = React.useMemo(() => {
    const category = (id: CategoryId, label: string, icon: SideNavSection["items"][number]["icon"]) => ({
      id,
      label,
      icon,
      active: selectedCategory === id,
      onSelect: () => selectCategory(id),
    });

    return [
      {
        items: [
          category("all", "Home", Home),
          category("recent", "Recently played", History),
          category("favorites", "Favorites", Heart),
          category("trending", "Trending", Flame),
        ],
      },
      {
        items: [
          category("action", "Action", Zap),
          category("driving", "Driving", Car),
          category("sports", "Sports", Trophy),
          category("arcade", "Arcade", Gamepad2),
          category("puzzle", "Puzzle", Puzzle),
          category("casual", "Casual", InfinityIcon),
          category("flash", "Flash", Ghost),
        ],
      },
      {
        items: [
          category("editors", "Editor’s picks", Star),
          category("verified", "Verified", CheckCircle2),
        ],
      },
      {
        items: [
          ...(sideChatEnabled
            ? [
                {
                  id: "chat",
                  label: "Community chat",
                  icon: MessageCircle,
                  onSelect: () => {
                    setMobileNavOpen(false);
                    setMobilePanel("chat");
                    document.getElementById("chat-panel")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
                  },
                },
              ]
            : []),
          {
            id: "ai",
            label: "Unblocked AIs",
            icon: Sparkles,
            onSelect: () => {
              setMobileNavOpen(false);
              window.open("/ai/", "_blank", "noopener,noreferrer");
            },
          },
          {
            id: "outside",
            label: "Outside games",
            icon: Compass,
            onSelect: () => {
              setMobileNavOpen(false);
              window.open("/outside/", "_blank", "noopener,noreferrer");
            },
          },
          {
            id: "submit",
            label: "Submit a game",
            icon: Send,
            onSelect: () => {
              setMobileNavOpen(false);
              setSubmitModalOpen(true);
            },
          },
          {
            id: "report",
            label: "Report a bug",
            icon: Bug,
            onSelect: () => {
              setMobileNavOpen(false);
              openBugReport();
            },
          },
        ],
      },
    ];
  }, [selectedCategory, selectCategory, sideChatEnabled, openBugReport]);

  // Animate the collapse over the links' real width: transitioning a fixed max-width
  // leaves dead time before the links start to shrink, which reads as a snap.
  return (
    <BackgroundWrapper config={bgConfig}>
      {loadingRevealEnabled && showLoadReveal && <GlassReveal21st onComplete={() => setShowLoadReveal(false)} />}
      {isLocked && <SiteLock onUnlock={() => setIsUnlocked(true)} />}
      {botChallengePending && !showLoadReveal && (
        <BotChallengeGate onVerified={() => setBotChallengePending(false)} />
      )}

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
            className="solid-3d-panel relative flex w-full flex-wrap items-center gap-x-2 gap-y-1.5 px-2.5 py-1.5 sm:gap-x-3 sm:px-4 sm:py-2 lg:min-h-[3.5rem]"
            style={{
              background: "#1d1d1d",
              borderRadius: 20,
              boxShadow:
                "inset 0 0 0 1px rgba(44,47,54,0.52), inset 0 0 50px 0 rgba(255,255,255,0.02), 0 10px 24px -6px rgba(0,0,0,0.5), 0 2px 6px rgba(0,0,0,0.3)",
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open navigation"
              aria-haspopup="dialog"
              aria-expanded={mobileNavOpen}
              title="Browse games"
              style={CHIP_STYLE}
              className="order-1 inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full p-0 text-zinc-300 transition-colors hover:bg-white/[0.08] hover:text-white active:scale-[0.98] md:hidden"
            >
              <Menu aria-hidden="true" className="h-4 w-4" />
            </button>

            <a
              href="/"
              aria-label="math_games home"
              className="order-1 flex shrink-0 items-center gap-2 group"
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

            {/* Dead centre from lg up; on phones it takes its own row. */}
            <div className="order-3 w-full min-w-0 lg:absolute lg:left-1/2 lg:top-1/2 lg:order-none lg:w-[26rem] lg:max-w-[42vw] lg:-translate-x-1/2 lg:-translate-y-1/2">
              <div className="relative w-full">
                <label htmlFor="game-search" className="sr-only">
                  Search games
                </label>
                <Search
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
                />
                <input
                  id="game-search"
                  ref={searchRef}
                  type="search"
                  name="q"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Escape" && searchQuery) {
                      event.preventDefault();
                      setSearchQuery("");
                    }
                  }}
                  placeholder="Search games…"
                  autoComplete="off"
                  spellCheck={false}
                  style={{
                    ...CHIP_STYLE,
                    borderRadius: 14,
                    background: "rgba(255, 255, 255, 0.03)",
                  }}
                  className="h-10 w-full appearance-none pl-9 pr-16 text-[13px] text-zinc-100 transition-colors placeholder:text-zinc-500 focus:outline-none [&::-webkit-search-cancel-button]:appearance-none"
                />
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      searchRef.current?.focus();
                    }}
                    aria-label="Clear search"
                    className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-white/[0.08] hover:text-zinc-100"
                  >
                    <X className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                ) : (
                  <kbd
                    aria-hidden="true"
                    className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 font-mono text-[10px] leading-none text-zinc-500 sm:block"
                  >
                    /
                  </kbd>
                )}
              </div>
            </div>

            <div className="relative z-10 order-2 ml-auto flex shrink-0 items-center gap-1 sm:order-4 sm:gap-2">
              <ShareButton compact />
              <button
                type="button"
                data-tour-target="settings"
                onClick={() => setSettingsOpen(true)}
                title="Settings & Site Lock"
                aria-label="Settings"
                aria-haspopup="dialog"
                aria-expanded={settingsOpen}
                style={ICON_BUTTON_STYLE}
                className="inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full p-0 text-zinc-300 transition-colors hover:bg-white/[0.12] hover:text-white active:scale-[0.98]"
              >
                <Settings aria-hidden="true" className="h-4 w-4" />
              </button>
              <PanicButton />
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

          <SideNav
            sections={sideNavSections}
            expanded={sideNavExpanded}
            onToggleExpanded={toggleSideNav}
          />

          <section
            id="games-panel"
            aria-label="Games"
            className={`${mobilePanel === "games" ? "flex" : "hidden"} md:flex flex-1 flex-col min-h-0 min-w-0`}
          >
            <div id="games" className="flex-1 flex flex-col min-h-0">
              <GameCatalog
                showAdSpot={adsVisible}
                onReportBug={openBugReport}
                bugReportOpen={bugModalOpen}
                searchQuery={searchQuery}
                onSearchQueryChange={setSearchQuery}
                selectedCategory={selectedCategory}
                onSelectCategory={selectCategory}
              />
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

        <SideNavDrawer
          open={mobileNavOpen}
          sections={sideNavSections}
          onClose={() => setMobileNavOpen(false)}
        />

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

        {/* Bottom Footer with Bug Report and Admin Panel; hidden until Settings shows it. */}
        {!footerHidden && <footer className={`shrink-0 px-2.5 pt-1 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 pb-[calc(3.5rem+env(safe-area-inset-bottom))] sm:px-4 sm:pb-[calc(3.75rem+env(safe-area-inset-bottom))] md:pb-1.5 ${footerIsLight ? "text-[10.5px] text-black/70" : "text-[10.5px] text-zinc-500"}`}>
          <div className="flex min-w-0 flex-wrap items-center gap-2 sm:gap-2.5">
            <span className={`hidden font-medium sm:inline ${footerIsLight ? "text-black/85" : "text-zinc-400"}`}>
              Built by {siteMeta.builtBy}
            </span>
            <span
              className={`hidden sm:inline ${footerIsLight ? "text-black/60" : "text-zinc-500"}`}
              title={`Build ${LAST_UPDATED_ISO}`}
            >
              Updated {siteMeta.updatedAt}
            </span>
            <div className="hidden items-center gap-1.5 sm:flex">
              <button
                type="button"
                data-hint-target="bug-report"
                onClick={() => openBugReport()}
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
        </footer>}
      </div>

      {settingsOpen && (
        <React.Suspense fallback={null}>
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
        siteMeta={siteMeta}
        sideChatEnabled={sideChatEnabled}
        footerHidden={footerHidden}
        onFooterHiddenChange={(hidden) => {
          localStorage.setItem("polytrack_footer_hidden", hidden ? "true" : "false");
          setFooterHidden(hidden);
        }}
        onSideChatChange={(enabled) => {
          localStorage.setItem("polytrack_side_chat_enabled", enabled ? "true" : "false");
          setSideChatEnabled(enabled);
          if (!enabled) setMobilePanel("games");
        }}
      />
        </React.Suspense>
      )}

      {changelogOpen && (
        <React.Suspense fallback={null}>
          <ChangelogModal isOpen={changelogOpen} onClose={() => setChangelogOpen(false)} />
        </React.Suspense>
      )}

      <BugReportModal
        isOpen={bugModalOpen}
        sourcePath={bugReportSourcePath}
        initialGame={bugReportGame}
        onClose={closeBugReport}
      />

      <GameSubmitModal
        isOpen={submitModalOpen}
        onClose={() => setSubmitModalOpen(false)}
      />

      {adminModalOpen && (
        <React.Suspense fallback={null}>
          <AdminPanelModal
            isOpen={adminModalOpen}
            onClose={() => setAdminModalOpen(false)}
          />
        </React.Suspense>
      )}

      <AdsNudgeModal
        isOpen={adsNudgeOpen}
        onClose={() => setAdsNudgeOpen(false)}
      />

      <Tour
        steps={tourSteps}
        open={onboardingOpen}
        onOpenChange={handleTourOpenChange}
        index={onboardingIndex}
        onIndexChange={handleTourIndexChange}
        onFinish={onboarding.markSeen}
        onSkip={onboarding.markSeen}
        showProgress
        dark
      />
    </BackgroundWrapper>
  );
}
