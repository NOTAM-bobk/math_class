import { checkForUpdate, applyUpdate } from "./lib/updateChecker";
import * as React from "react";
import { createPortal } from "react-dom";
import { GameCatalog, initialCategory, initialSearchQuery, type CategoryId } from "./components/GameCatalog";
import { SideNav, SideNavDrawer, canHoverPointer, type SideNavSection } from "./components/SideNav";
import { PanicButton } from "./components/PanicButton";
import { LiveMessageBoard } from "./components/LiveMessageBoard";
import { VisitorCounter } from "./components/VisitorCounter";
import { usePresenceHeartbeat } from "./lib/presence";
import { ShareButton } from "./components/ShareButton";
import { RANDOM_GAME_EVENT } from "./components/RandomGameButton";
import { NotificationsButton } from "./components/NotificationsButton";
import { CommandPalette, type CommandPaletteItem } from "./components/CommandPalette";
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
  Crosshair,
  Download,
  Flame,
  Gamepad2,
  Ghost,
  Heart,
  History,
  Footprints,
  Boxes,
  Map as MapIcon,
  Moon,
  Home,
  Hourglass,
  Infinity as InfinityIcon,
  Link2,
  Menu,
  MessageCircle,
  MoreHorizontal,
  Puzzle,
  ScrollText,
  Search,
  Send,
  Settings,
  Shield,
  Shuffle,
  Sparkles,
  Star,
  Swords,
  Trophy,
  Users,
  Wrench,
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
import { canInstall, isInstalled, onInstallAvailabilityChange, promptInstall } from "./lib/pwaInstall";
import { finalizePlaySession, startPlayStatsClock } from "./lib/playStats";
import { loadStreak, recordVisit, subscribeStreak, type StreakData } from "./lib/streak";
import { areNotificationAdsBlocked } from "./lib/adNotifications";
import { hasPassedBotChallenge, startStartupBotCheck } from "./lib/botDetection";
import { loadCatalog } from "./lib/catalog";
import { useDialogFocus } from "./lib/dialogFocus";
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
// Warm the settings chunk once the page is idle, so opening settings doesn't wait on a download.
if (typeof window !== "undefined") {
  const warm = () => void import("./components/SettingsModal").catch(() => {});
  const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
  if (ric) ric(warm, { timeout: 6000 });
  else window.setTimeout(warm, 4000);
}
const AdminPanelModal = React.lazy(() =>
  import("./components/AdminPanelModal").then((module) => ({ default: module.AdminPanelModal }))
);
const ChangelogModal = React.lazy(() =>
  import("./components/ChangelogModal").then((module) => ({ default: module.ChangelogModal }))
);

const HAIRLINE = "1px solid rgba(255, 255, 255, 0.07)";

const CHIP_STYLE: React.CSSProperties = {
  borderRadius: 999,
  background: "transparent",
  border: HAIRLINE,
};

const ICON_BUTTON_STYLE: React.CSSProperties = {
  borderRadius: 999,
  background: "transparent",
  border: HAIRLINE,
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

const SETTINGS_PATH = "/settings";

function settingsOpenFromUrl() {
  try {
    return /\/settings\/?$/.test(window.location.pathname);
  } catch {
    return false;
  }
}


export function App() {
  // Every visitor counts as online while the page is open, chat shown or not.
  usePresenceHeartbeat();
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
  const [settingsOpen, setSettingsOpen] = React.useState(settingsOpenFromUrl);
  const [commandPaletteOpen, setCommandPaletteOpen] = React.useState(false);
  const [installAvailable, setInstallAvailable] = React.useState(canInstall);
  const [installed, setInstalled] = React.useState(isInstalled);
  // The flame opens Settings straight on the streak pane; the gear opens General.
  const [settingsSection, setSettingsSection] = React.useState<"streak" | null>(null);
  const [streak, setStreak] = React.useState<StreakData>(loadStreak);
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
      const saved = localStorage.getItem("polytrack_side_nav_expanded");
      if (saved !== null) return saved === "true";
    } catch {}
    // A 1280px-wide window has room for the rail's labels, so it starts open
    // there and stays an icon strip on narrower screens.
    return typeof window !== "undefined" && window.matchMedia("(min-width: 1280px)").matches;
  });
  // A window widened past 1280px gets the labels too, unless the visitor has
  // already collapsed the rail themselves (that choice is persisted).
  React.useEffect(() => {
    const wide = window.matchMedia("(min-width: 1280px)");
    const onChange = () => {
      let saved: string | null = null;
      try {
        saved = localStorage.getItem("polytrack_side_nav_expanded");
      } catch {}
      if (saved === null && wide.matches) setSideNavExpanded(true);
    };
    wide.addEventListener("change", onChange);
    return () => wide.removeEventListener("change", onChange);
  }, []);
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);
  // The header keeps four actions; everything else lives behind this menu.
  const [headerMenuOpen, setHeaderMenuOpen] = React.useState(false);
  const headerMenuRef = React.useRef<HTMLDivElement>(null);
  // Chat opened from the side navigation takes over the middle of the screen,
  // instead of living in its usual narrow column.
  const [chatFocusOpen, setChatFocusOpen] = React.useState(false);
  const chatDialogRef = React.useRef<HTMLDivElement>(null);
  const searchRef = React.useRef<HTMLInputElement>(null);

  useDialogFocus({
    active: chatFocusOpen,
    onClose: () => setChatFocusOpen(false),
    panelRef: chatDialogRef,
  });

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
    let isMounted = true;

    const runCheck = async () => {
      try {
        const res = await checkForUpdate();
        if (isMounted && res.hasUpdate) {
          setUpdateReady(true);
        }
      } catch {}
    };

    // Check shortly after boot once the catalog and UI are responsive
    const initTimer = window.setTimeout(runCheck, 2500);
    // Periodically poll for updates every 3 minutes
    const intervalTimer = window.setInterval(runCheck, 180000);

    const handleFocus = () => {
      runCheck();
      if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
        navigator.serviceWorker.getRegistrations().then((regs) => {
          regs.forEach((r) => r.update().catch(() => {}));
        }).catch(() => {});
      }
    };
    window.addEventListener("focus", handleFocus);

    let handleControllerChange: (() => void) | undefined;
    // Losing a controller and gaining a new one is the first install taking
    // over, not an update. Only a swap is worth the banner.
    const hadController =
      typeof navigator !== "undefined" &&
      "serviceWorker" in navigator &&
      !!navigator.serviceWorker.controller;
    if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
      handleControllerChange = () => {
        if (isMounted && hadController) setUpdateReady(true);
      };
      navigator.serviceWorker.addEventListener("controllerchange", handleControllerChange);
    }

    return () => {
      isMounted = false;
      window.clearTimeout(initTimer);
      window.clearInterval(intervalTimer);
      window.removeEventListener("focus", handleFocus);
      if (handleControllerChange && typeof navigator !== "undefined" && "serviceWorker" in navigator) {
        navigator.serviceWorker.removeEventListener("controllerchange", handleControllerChange);
      }
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

  // One streak day per local calendar day: a fresh load counts, and so does
  // coming back to a tab that was left open across midnight.
  React.useEffect(() => {
    setStreak(recordVisit());
    const stopListening = subscribeStreak(setStreak);
    const sync = () => {
      if (document.visibilityState === "visible") setStreak(recordVisit());
    };
    document.addEventListener("visibilitychange", sync);
    window.addEventListener("focus", sync);
    return () => {
      stopListening();
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("focus", sync);
    };
  }, []);

  React.useEffect(() => {
    if (!installNoticeVisible) return;
    try {
      localStorage.setItem(INSTALL_NOTICE_SEEN_KEY, "true");
    } catch {}
    const timer = window.setTimeout(() => setInstallNoticeVisible(false), 5000);
    return () => window.clearTimeout(timer);
  }, [installNoticeVisible]);

  // The browser can hand over its install prompt at any time; the notice and
  // the command palette both follow its availability.
  React.useEffect(
    () =>
      onInstallAvailabilityChange(() => {
        setInstallAvailable(canInstall());
        setInstalled(isInstalled());
      }),
    []
  );

  const handleInstallApp = React.useCallback(async () => {
    const outcome = await promptInstall();
    if (outcome === "accepted") {
      setInstallNoticeVisible(false);
      try {
        localStorage.setItem(INSTALL_NOTICE_SEEN_KEY, "true");
      } catch {}
    }
  }, []);

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
        borderRadius: 999,
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
    if (isLocked || showLoadReveal || botChallengePending || settingsOpen || onboarding.seen()) return;
    const timer = window.setTimeout(() => {
      // Expand the side rail so its labels are readable while it is highlighted.
      // Phones have no rail step and touch screens must not be left open, so
      // only a desktop pointer expands it.
      if (!isPhoneViewport && canHoverPointer()) setSideNavExpanded(true);
      onboarding.start();
    }, 1600);
    return () => window.clearTimeout(timer);
  }, [isLocked, showLoadReveal, botChallengePending, settingsOpen, onboarding.seen, onboarding.start, isPhoneViewport]);

  // Remember whether the nav options are open or closed between visits.
  const bugReturnUrlRef = React.useRef("/");
  const settingsReturnUrlRef = React.useRef("/");

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

  // Settings has its own address, so a phone can open it directly or a link can
  // be shared. The path follows the dialog open and closed.
  const openSettings = React.useCallback((section: "streak" | null = null) => {
    setSettingsSection(section);
    setSettingsOpen(true);
    try {
      if (!settingsOpenFromUrl()) {
        settingsReturnUrlRef.current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
        window.history.pushState({ settings: true }, "", SETTINGS_PATH);
      }
    } catch {}
  }, []);

  const closeSettings = React.useCallback(() => {
    setSettingsOpen(false);
    setSettingsSection(null);
    try {
      if (settingsOpenFromUrl()) {
        window.history.replaceState(null, "", settingsReturnUrlRef.current || "/");
      }
    } catch {}
  }, []);

  // A message notification opens the conversation, turning the chat panel back
  // on if it had been hidden in Settings.
  const openChatFromNotification = React.useCallback(() => {
    setMobilePanel("chat");
    setChatFocusOpen(true);
    setSideChatEnabled((enabled) => {
      if (enabled) return enabled;
      try {
        localStorage.setItem("polytrack_side_chat_enabled", "true");
      } catch {}
      return true;
    });
  }, []);

  // Back and forward move in and out of the bug report like any other page.
  React.useEffect(() => {
    const syncWithUrl = () => setBugModalOpen(bugReportOpenFromUrl());
    window.addEventListener("popstate", syncWithUrl);
    return () => window.removeEventListener("popstate", syncWithUrl);
  }, []);

  // Back and forward open and close Settings with its address too.
  React.useEffect(() => {
    const syncSettingsWithUrl = () => {
      const open = settingsOpenFromUrl();
      setSettingsOpen(open);
      if (!open) setSettingsSection(null);
    };
    window.addEventListener("popstate", syncSettingsWithUrl);
    return () => window.removeEventListener("popstate", syncSettingsWithUrl);
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

  // ⌘K / Ctrl+K is the command palette everywhere except inside another dialog.
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey) || event.altKey || event.shiftKey) return;
      if (event.key.toLowerCase() !== "k") return;
      event.preventDefault();
      setCommandPaletteOpen((open) => {
        if (open) return false;
        if (document.querySelector('[role="dialog"]')) return false;
        return true;
      });
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // The header's overflow menu closes on a click elsewhere or Escape.
  React.useEffect(() => {
    if (!headerMenuOpen) return;
    const closeOnOutside = (event: PointerEvent) => {
      if (headerMenuRef.current && !headerMenuRef.current.contains(event.target as Node)) {
        setHeaderMenuOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setHeaderMenuOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [headerMenuOpen]);

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
    setChatFocusOpen(false);
    setMobilePanel("games");
  }, []);

  const commandPaletteCommands = React.useMemo<CommandPaletteItem[]>(() => {
    const categoryCommand = (
      id: CategoryId,
      label: string,
      icon: CommandPaletteItem["icon"]
    ): CommandPaletteItem => ({
      id: `category-${id}`,
      label,
      group: "Browse games",
      icon,
      run: () => selectCategory(id),
    });

    const commands: CommandPaletteItem[] = [
      {
        id: "search",
        label: "Search games",
        hint: "/",
        group: "Play",
        icon: Search,
        run: () => window.setTimeout(() => searchRef.current?.focus(), 80),
      },
      {
        id: "random",
        label: "Play a random game",
        hint: "Shuffle",
        group: "Play",
        icon: Shuffle,
        run: () => window.dispatchEvent(new CustomEvent(RANDOM_GAME_EVENT)),
      },
      categoryCommand("all", "Home", Home),
      categoryCommand("recent", "Recently played", History),
      categoryCommand("favorites", "Favorites", Heart),
      categoryCommand("trending", "Trending", Flame),
      categoryCommand("action", "Action", Zap),
      categoryCommand("driving", "Driving", Car),
      categoryCommand("sports", "Sports", Trophy),
      categoryCommand("arcade", "Arcade", Gamepad2),
      categoryCommand("puzzle", "Puzzle", Puzzle),
      categoryCommand("casual", "Casual", InfinityIcon),
      categoryCommand("multiplayer", "Multiplayer", Users),
      categoryCommand("shooting", "Shooting", Crosshair),
      categoryCommand("strategy", "Strategy", Swords),
      categoryCommand("idle", "Idle", Hourglass),
      categoryCommand("flash", "Flash", Ghost),
      categoryCommand("tools", "Tools", Wrench),
      {
        id: "settings",
        label: "Open settings",
        group: "Site",
        icon: Settings,
        run: () => openSettings(null),
      },
      {
        id: "changelog",
        label: "What's new",
        group: "Site",
        icon: ScrollText,
        run: () => setChangelogOpen(true),
      },
      {
        id: "bug",
        label: "Report a bug",
        group: "Site",
        icon: Bug,
        run: () => openBugReport(),
      },
      {
        id: "copy-link",
        label: "Copy link to this page",
        group: "Site",
        icon: Link2,
        run: () => {
          void navigator.clipboard?.writeText(window.location.href).catch(() => {});
        },
      },
    ];

    if (installAvailable) {
      commands.push({
        id: "install",
        label: "Install math_games as an app",
        group: "Site",
        icon: Download,
        run: () => void handleInstallApp(),
      });
    }

    return commands;
  }, [selectCategory, installAvailable, handleInstallApp]);

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
          category("platformer", "Platformer", Footprints),
          category("adventure", "Adventure", MapIcon),
          category("puzzle", "Puzzle", Puzzle),
          category("casual", "Casual", InfinityIcon),
          category("sandbox", "Sandbox", Boxes),
          category("multiplayer", "Multiplayer", Users),
          category("shooting", "Shooting", Crosshair),
          category("strategy", "Strategy", Swords),
          category("idle", "Idle", Hourglass),
          category("horror", "Horror", Moon),
          category("flash", "Flash", Ghost),
          category("tools", "Tools", Wrench),
        ],
      },
      {
        items: [
          category("editors", "Editor's picks", Star),
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
                  active: chatFocusOpen,
                  onSelect: () => {
                    setMobileNavOpen(false);
                    setChatFocusOpen(true);
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
              window.location.assign("/ai/");
            },
          },
          {
            id: "outside",
            label: "Outside games",
            icon: Compass,
            onSelect: () => {
              setMobileNavOpen(false);
              window.location.assign("/outside/");
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
  }, [selectedCategory, selectCategory, sideChatEnabled, chatFocusOpen, openBugReport]);

  // Animate the collapse over the links' real width: transitioning a fixed max-width
  // leaves dead time before the links start to shrink, which reads as a snap.
  return (
    <BackgroundWrapper config={bgConfig}>
      {loadingRevealEnabled && showLoadReveal && <GlassReveal21st onComplete={() => setShowLoadReveal(false)} />}
      {isLocked && <SiteLock onUnlock={() => setIsUnlocked(true)} />}
      {botChallengePending && !showLoadReveal && (
        <BotChallengeGate onVerified={() => setBotChallengePending(false)} />
      )}

      <div
        className="flex h-full min-h-0 w-full flex-col overflow-hidden"
        style={{ backgroundColor: "#161616" }}
      >
        <a
          href="#main"
          className="sr-only rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-zinc-950 focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50"
        >
          Skip to games
        </a>

        {/* 3D Top Navigation Bar */}
        <header className="px-2 pt-1.5 sm:px-4 sm:pt-3 shrink-0 z-20">
          <div
            className="solid-3d-panel relative grid w-full grid-cols-[auto_1fr_auto] items-center gap-x-1.5 gap-y-1.5 px-2 py-1.5 sm:flex sm:flex-wrap sm:gap-x-3 sm:gap-y-1 sm:px-4 sm:py-2 lg:min-h-[3.5rem]"
            style={{
              background: "#1d1d1d",
              borderRadius: 16,
              border: HAIRLINE,
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
              className="order-1 col-start-1 row-start-1 inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full p-0 text-zinc-300 transition-colors hover:bg-white/[0.08] hover:text-white active:scale-[0.98] md:hidden"
            >
              <Menu aria-hidden="true" className="h-4 w-4" />
            </button>

            <a
              href="/"
              aria-label="math_games home"
              className="order-1 col-start-2 row-start-1 flex min-w-0 shrink-0 items-center gap-2 justify-self-start group"
            >
              <span
                style={{
                  borderRadius: 999,
                  background: "rgba(255, 255, 255, 0.06)",
                  boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.04), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)",
                }}
                className="whitespace-nowrap px-2 py-1 font-mono text-[11px] font-semibold tracking-tight text-zinc-100 transition-colors group-hover:text-white sm:px-3 sm:text-xs"
              >
                math_games
              </span>
            </a>

            {/* Dead centre from lg up; on phones it takes its own row. */}
            <div
              className={`order-3 col-span-3 row-start-2 w-full min-w-0 sm:col-auto sm:row-auto lg:absolute lg:left-1/2 lg:top-1/2 lg:order-none lg:w-[26rem] lg:max-w-[42vw] lg:-translate-x-1/2 lg:-translate-y-1/2 ${
                mobilePanel === "chat" ? "hidden md:block" : ""
              }`}
            >
              <div className="relative w-full">
                <label htmlFor="game-search" className="sr-only">
                  Search games
                </label>
                <Search
                  aria-hidden="true"
                  className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400 sm:left-3 sm:h-4 sm:w-4"
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
                  placeholder="Search 700+ games"
                  autoComplete="off"
                  spellCheck={false}
                  style={{
                    ...CHIP_STYLE,
                    borderRadius: 8,
                    background: "rgba(255, 255, 255, 0.03)",
                  }}
                  className="h-8 w-full appearance-none pl-8 pr-11 text-xs text-zinc-100 transition-colors placeholder:text-zinc-500 focus:outline-none sm:h-10 sm:pl-9 sm:pr-16 sm:text-sm [&::-webkit-search-cancel-button]:appearance-none"
                />
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      searchRef.current?.focus();
                    }}
                    aria-label="Clear search"
                    className="absolute right-1.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-white/[0.08] hover:text-zinc-100 sm:right-2 sm:h-7 sm:w-7"
                  >
                    <X className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                ) : (
                  <kbd
                    aria-hidden="true"
                    className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 font-mono text-[11px] leading-none text-zinc-500 sm:block"
                  >
                    /
                  </kbd>
                )}
              </div>
            </div>

            <div className="relative z-10 order-2 col-start-3 row-start-1 ml-auto flex shrink-0 items-center gap-1 justify-self-end sm:col-auto sm:row-auto sm:gap-2">
              {/* Wide headers have room for the streak itself; narrower ones keep
                  it in the More menu. */}
              {streak.current > 0 && (
                <button
                  type="button"
                  onClick={() => openSettings("streak")}
                  title="Open your daily streak"
                  aria-label={`${streak.current}-day streak, open streak details`}
                  aria-haspopup="dialog"
                  style={ICON_BUTTON_STYLE}
                  className="hidden h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-2.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/[0.08] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-300 active:scale-[0.98] xl:inline-flex"
                >
                  <Flame aria-hidden="true" className="h-3.5 w-3.5 text-amber-300" />
                  <span className="whitespace-nowrap tabular-nums">{streak.current}-day streak</span>
                </button>
              )}
              <NotificationsButton
                onOpenChangelog={() => setChangelogOpen(true)}
                onOpenChat={openChatFromNotification}
              />
              <ShareButton />
              <button
                type="button"
                data-tour-target="settings"
                onClick={() => openSettings(null)}
                title="Settings & Site Lock"
                aria-label="Settings"
                aria-haspopup="dialog"
                aria-expanded={settingsOpen}
                style={ICON_BUTTON_STYLE}
                className="inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full p-0 text-zinc-300 transition-colors hover:bg-white/[0.12] hover:text-white active:scale-[0.98] sm:h-9 sm:w-9"
              >
                <Settings aria-hidden="true" className="h-4 w-4" />
              </button>
              <PanicButton />
              <div ref={headerMenuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setHeaderMenuOpen((open) => !open)}
                  title="More"
                  aria-label="More actions"
                  aria-haspopup="menu"
                  aria-expanded={headerMenuOpen}
                  style={ICON_BUTTON_STYLE}
                  className="inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full p-0 text-zinc-300 transition-colors hover:bg-white/[0.08] hover:text-white active:scale-[0.98] sm:h-9 sm:w-9"
                >
                  <MoreHorizontal aria-hidden="true" className="h-4 w-4" />
                </button>
                {headerMenuOpen && (
                  <div
                    role="menu"
                    aria-label="More actions"
                    className="absolute right-0 top-[calc(100%+0.5rem)] z-40 w-56 overflow-hidden rounded-xl border border-white/[0.07] bg-[#1d1d1d] p-1 text-left"
                  >
                    {streak.current > 0 && (
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setHeaderMenuOpen(false);
                          openSettings("streak");
                        }}
                        className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-xs text-zinc-200 transition-colors hover:bg-white/[0.06] xl:hidden"
                      >
                        <Flame aria-hidden="true" className="h-3.5 w-3.5 text-amber-300" />
                        <span className="tabular-nums">{streak.current}-day streak</span>
                      </button>
                    )}
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setHeaderMenuOpen(false);
                        window.dispatchEvent(new CustomEvent(RANDOM_GAME_EVENT));
                      }}
                      className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-xs text-zinc-200 transition-colors hover:bg-white/[0.06]"
                    >
                      <Shuffle aria-hidden="true" className="h-3.5 w-3.5 text-zinc-400" />
                      Random game
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setHeaderMenuOpen(false);
                        setSubmitModalOpen(true);
                      }}
                      className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-xs text-zinc-200 transition-colors hover:bg-white/[0.06]"
                    >
                      <Send aria-hidden="true" className="h-3.5 w-3.5 text-zinc-400" />
                      Submit a game
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setHeaderMenuOpen(false);
                        openBugReport();
                      }}
                      className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-xs text-zinc-200 transition-colors hover:bg-white/[0.06]"
                    >
                      <Bug aria-hidden="true" className="h-3.5 w-3.5 text-zinc-400" />
                      Report a bug
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {installNoticeVisible && !installed && (
          <div className="fixed right-3 top-3 z-50 flex max-w-[min(24rem,calc(100vw-1.5rem))] items-start gap-3 rounded-2xl border border-white/10 bg-zinc-900/95 p-3.5 pr-2.5 text-zinc-100 shadow-[0_16px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl animate-enter" role="status">
            <div className="min-w-0 flex-1">
              <p className="text-xs leading-relaxed">Install math_games to use it like an app: its own window, home-screen icon and faster launches.</p>
              {installAvailable && (
                <button
                  type="button"
                  onClick={() => void handleInstallApp()}
                  className="mt-2 inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-zinc-950 transition-colors hover:bg-zinc-200 active:scale-[0.98]"
                >
                  <Download aria-hidden="true" className="h-3 w-3" />
                  Install app
                </button>
              )}
            </div>
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
          <div className="fixed left-1/2 top-3 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-zinc-900/95 py-1.5 pl-3.5 pr-1.5 text-xs text-zinc-100 shadow-[0_16px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl animate-enter" role="status">
            <span className="whitespace-nowrap">New version is ready</span>
            <button
              type="button"
              onClick={() => {
                applyUpdate().catch(() => window.location.reload());
              }}
              className="rounded-full bg-amber-400/20 px-3 py-1 font-medium text-amber-300 transition-colors hover:bg-amber-400/30"
            >
              Update now
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
              className={`${mobilePanel === "chat" ? "flex" : "hidden"} md:flex w-full md:w-72 lg:w-[22rem] flex-1 md:flex-none flex-col gap-3 shrink-0 min-h-0 md:h-full md:max-h-full`}
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

        {/* The community chat on its own, centred and much wider than its column. */}
        {chatFocusOpen && sideChatEnabled &&
          createPortal(
            <div className="fixed inset-0 z-[80] flex items-center justify-center p-2 sm:p-6">
              <div
                aria-hidden="true"
                onClick={() => setChatFocusOpen(false)}
                className="absolute inset-0 bg-black/75 backdrop-blur-sm animate-enter"
              />
              <div
                ref={chatDialogRef}
                role="dialog"
                aria-modal="true"
                aria-label="Community chat"
                tabIndex={-1}
                className="relative flex h-[min(46rem,calc(100dvh-1rem))] w-full max-w-5xl flex-col overflow-hidden outline-none animate-enter sm:h-[min(46rem,calc(100dvh-3rem))]"
              >
                <LiveMessageBoard
                  showAds={adsVisible}
                  title="Community chat"
                  onClose={() => setChatFocusOpen(false)}
                />
              </div>
            </div>,
            document.body
          )}

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
        {!footerHidden && <footer className={`shrink-0 px-2.5 pt-1 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 pb-[calc(3.5rem+env(safe-area-inset-bottom))] sm:px-4 sm:pb-[calc(3.75rem+env(safe-area-inset-bottom))] md:pb-1.5 ${footerIsLight ? "text-[11px] text-black/70" : "text-[11px] text-zinc-500"}`}>
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
                <Shield aria-hidden="true" className="w-3.5 h-3.5 text-amber-300" />
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
        initialSection={settingsSection}
        updateReady={updateReady}
        onUpdateReadyChange={setUpdateReady}
        loadingRevealEnabled={loadingRevealEnabled}
        onLoadingRevealChange={(enabled) => {
          try {
            localStorage.setItem("polytrack_loading_reveal_enabled", enabled ? "true" : "false");
          } catch {}
          setLoadingRevealEnabled(enabled);
          if (!enabled) setShowLoadReveal(false);
        }}
        onClose={closeSettings}
        onLockNow={() => setIsUnlocked(false)}
        onReportBug={() => {
          closeSettings();
          openBugReport();
        }}
        onOpenAdmin={() => {
          closeSettings();
          setAdminModalOpen(true);
        }}
        onConfigChange={handleConfigChange}
        tabCloakSettings={tabCloakSettings}
        onTabCloakChange={handleTabCloakChange}
        onOpenChangelog={() => {
          closeSettings();
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
          if (!enabled) {
            setMobilePanel("games");
            setChatFocusOpen(false);
          }
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

      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        commands={commandPaletteCommands}
        shortcutLabel={typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform) ? "⌘K" : "Ctrl K"}
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
