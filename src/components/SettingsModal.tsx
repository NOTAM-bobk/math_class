import { checkForUpdate, applyUpdate, type CheckUpdateResult } from "@/lib/updateChecker";
import * as React from "react";
import { X, ArrowLeft, ChevronRight, Lock, ShieldAlert, Check, Key, ShieldCheck, Eye, EyeOff, Bell, BellOff, History, Palette, Github, Globe, Download, Trash2, Clock, Bug, Shield, BarChart3, Timer, MousePointerClick, Gamepad2, Trophy, Search, Flame, CalendarDays, LayoutGrid, Megaphone, WifiOff, EyeOff as CloakIcon, Siren, Link2, Mail, ScrollText, UserRound, RotateCcw, Type, Gift, ExternalLink, Keyboard, RefreshCw, CheckCircle2, Share2 } from "lucide-react";
import { loadReferrals, type ReferralLink } from "@/lib/referrals";
import { GitHubActivityGrid } from "./GitHubActivityGrid";
import { getUpdateHistoryDays } from "@/lib/updateHistory";
import { SYSTEM_FONTS, getStoredSystemFont, applySystemFont } from "@/lib/systemFont";
import { CHANGELOG, SITE_VERSION } from "@/lib/changelog";
import { useDialogFocus } from "@/lib/dialogFocus";
import { testFrameLoad } from "@/lib/frameReachability";
import {
  BACKGROUND_PRESETS,
  loadBackgroundConfig,
  saveBackgroundConfig,
  type BackgroundConfig,
  type BackgroundType,
} from "@/lib/backgroundTheme";

import {
  isChatNotificationsEnabled,
  setChatNotificationsEnabled,
} from "@/lib/chatNotifications";
import {
  isNotificationsEnabled,
  notificationsSupported,
  notificationPermission,
  requestNotificationPermission,
  setNotificationsEnabled,
  showNewGameNotification,
} from "@/lib/gameNotifications";
import type { TabCloakSettings } from "@/lib/tabCloak";
import { formatLastUpdated, LAST_UPDATED_ISO } from "@/lib/lastUpdated";
import {
  loadCheckoutSession,
  signInCheckout,
  signOutCheckout,
  signUpCheckout,
  type CheckoutUser,
} from "@/lib/checkoutApi";
import {
  deleteOfflineCache,
  downloadOfflineSite,
  formatBytes,
  getOfflineStatus,
  loadOfflineSchedule,
  offlineSupported,
  saveOfflineSchedule,
  type OfflineProgress,
  type OfflineSchedule,
  type OfflineStatus,
} from "@/lib/offlineCache";
import {
  deleteAllGamePacks,
  deleteGamePack,
  downloadGamePack,
  formatPackSize,
  loadDownloadedPacks,
  loadGamePacks,
  onDownloadedPacksChange,
  type GamePack,
  type GamePackProgress,
} from "@/lib/gamePacks";
import {
  formatPlayTime,
  isPlayStatsEnabled,
  loadPlayStats,
  setPlayStatsEnabled,
  subscribePlayStats,
  type PlayStats,
} from "@/lib/playStats";
import { hardResetSite } from "@/lib/hardReset";
import {
  dayKey,
  loadStreak,
  recordVisit,
  subscribeStreak,
  currentStreakMilestone,
  nextStreakMilestone,
  STREAK_MILESTONES,
  type StreakData,
} from "@/lib/streak";
import { shareStreakCard } from "@/lib/streakCard";
import type { SiteMeta } from "@/lib/siteMeta";
import { canInstall, isInstalled, isIos, onInstallAvailabilityChange, promptInstall } from "@/lib/pwaInstall";
import { canHoverPointer } from "./SideNav";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLockNow: () => void;
  onReportBug: () => void;
  onOpenAdmin: () => void;
  onConfigChange?: (enabled: boolean, password: string) => void;
  tabCloakSettings: TabCloakSettings;
  onTabCloakChange: (settings: TabCloakSettings) => void;
  onOpenChangelog: () => void;
  sideChatEnabled: boolean;
  onSideChatChange: (enabled: boolean) => void;
  adSpotEnabled: boolean;
  // Footer credit lines, shown read-only in the Admin pane.
  siteMeta: SiteMeta;
  loadingRevealEnabled?: boolean;
  onLoadingRevealChange?: (enabled: boolean) => void;
  footerHidden?: boolean;
  onFooterHiddenChange?: (hidden: boolean) => void;
  /** Opens the dialog straight to a pane, e.g. from the top-bar streak chip. */
  initialSection?: DesktopTab | null;
  updateReady?: boolean;
  onUpdateReadyChange?: (ready: boolean) => void;
}

const PANIC_PRESETS = [
  { name: "Wikipedia", url: "https://www.wikipedia.org/" },
  { name: "Google Classroom", url: "https://classroom.google.com/" },
  { name: "Google Docs", url: "https://docs.google.com/" },
  { name: "Canvas", url: "https://canvas.instructure.com/" }
];

const SITE_MIRRORS = [
  { name: "games.mathclass.uk", url: "https://games.mathclass.uk/", timeoutMs: 10000 },
  { name: "poly2.benlaunches.icu", url: "https://poly2.benlaunches.icu/", timeoutMs: 10000 },
  { name: "polytrack.sawyerbobk563.deno.net", url: "https://polytrack.sawyerbobk563.deno.net/", timeoutMs: 10000 },
  { name: "polytrack.sawyerbobk563.workers.dev", url: "https://polytrack.sawyerbobk563.workers.dev/", timeoutMs: 10000 },
  // This one can take a minute to wake up.
  { name: "basket-random-1df0d.containers.snapdeploy.app", url: "https://basket-random-1df0d.containers.snapdeploy.app/", timeoutMs: 65000 },
];

type ProxyCheckStatus = "idle" | "checking" | "reachable" | "blocked";

type DesktopTab = "account" | "general" | "install" | "shortcuts" | "stats" | "streak" | "security" | "notifications" | "appearance" | "cloak" | "panic" | "ads" | "referrals" | "launched" | "support" | "offline" | "proxies" | "changelog" | "admin";

const DESKTOP_NAV: { heading: string; items: { id: DesktopTab; label: string; icon: React.ComponentType<{ className?: string }>; keywords: string }[] }[] = [
  { heading: "Account", items: [
    { id: "account", label: "Account", icon: UserRound, keywords: "account sign in sign out login logout create account email password ultra checkout" },
  ] },
  { heading: "General", items: [
    { id: "general", label: "Layout & startup", icon: LayoutGrid, keywords: "loading animation side chat visitor counter ad space layout startup updates version check for update update now" },
    { id: "install", label: "Install app", icon: Download, keywords: "install app pwa home screen desktop standalone add to home screen" },
    { id: "shortcuts", label: "Keyboard shortcuts", icon: Keyboard, keywords: "keyboard shortcuts hotkeys keys command palette ctrl k meta k search panic escape enter" },
    { id: "stats", label: "Your stats", icon: BarChart3, keywords: "play time clicks most played games stats" },
    { id: "streak", label: "Daily streak", icon: Flame, keywords: "streak fire flame daily visit days login keep going record" },
    { id: "security", label: "Site lock", icon: Lock, keywords: "password lock security site" },
    { id: "notifications", label: "Notifications", icon: Bell, keywords: "notifications new games chat alerts" },
  ] },
  { heading: "Appearance", items: [
    { id: "appearance", label: "Theme & Fonts", icon: Palette, keywords: "background theme color gradient image font system font typography text" },
    { id: "cloak", label: "Tab cloak", icon: CloakIcon, keywords: "tab cloak title icon disguise" },
    { id: "panic", label: "Panic button", icon: Siren, keywords: "panic key redirect escape" },
  ] },
  { heading: "Other", items: [
    { id: "offline", label: "Offline mode", icon: WifiOff, keywords: "offline download cache schedule" },
    { id: "proxies", label: "Proxies & source", icon: Link2, keywords: "source code github proxies mirrors" },
    { id: "changelog", label: "Change log", icon: ScrollText, keywords: "change log updates history check for update version update now" },
    { id: "ads", label: "Ad", icon: Megaphone, keywords: "ad ads notification ads block" },
    { id: "referrals", label: "Referrals", icon: Gift, keywords: "referral referrals reward rewards links partners support exclusive" },
    { id: "launched", label: "Launched on", icon: Trophy, keywords: "launched on launch streak launchstreak badge listed directory" },
    { id: "support", label: "Support", icon: Mail, keywords: "support contact email help games@mathclass.uk bug report message" },
  ] },
  { heading: "Admin", items: [
    { id: "admin", label: "Admin", icon: Shield, keywords: "admin built by ss last updated time footer credit" },
  ] },
];

const DESKTOP_LIGHT_CSS = `
@media (min-width: 768px) {
.sm-desk section{border-top:none!important;padding-top:0!important}
}
`;

// Offline packs are paged so the list stays quick to scroll and every game can
// still be reached by continuing to the bottom.
const PACK_PAGE_SIZE = 20;

const KEYBOARD_SHORTCUTS: { label: string; keys: string }[] = [
  { label: "Open the command palette", keys: "⌘ K / Ctrl K" },
  { label: "Jump to the game search", keys: "/" },
  { label: "Close a dialog or the palette", keys: "Esc" },
  { label: "Move through palette results", keys: "↑ / ↓" },
  { label: "Open the highlighted command", keys: "Enter" },
  { label: "Panic — leave the site instantly", keys: "]" },
];

const ICON_TILE: React.CSSProperties = {
  borderRadius: 8,
  background: "rgba(255, 255, 255, 0.06)",
};

const CHIP_STYLE: React.CSSProperties = {
  borderRadius: 8,
  background: "rgba(255, 255, 255, 0.05)",
  boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.07)",
};

function hostOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "the set page";
  }
}

export function SettingsModal({
  isOpen,
  onClose,
  onLockNow,
  onReportBug,
  onOpenAdmin,
  onConfigChange,
  tabCloakSettings,
  onTabCloakChange,
  onOpenChangelog,
  sideChatEnabled,
  onSideChatChange,
  adSpotEnabled,
  siteMeta,
  loadingRevealEnabled = false,
  onLoadingRevealChange,
  footerHidden = false,
  onFooterHiddenChange,
  initialSection = null,
  updateReady = false,
  onUpdateReadyChange
}: SettingsModalProps) {
  const [isDesktop, setIsDesktop] = React.useState(() => typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches);
  React.useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  const [desktopTab, setDesktopTab] = React.useState<DesktopTab>("general");
  // Touch-only devices have no keyboard, so the shortcut reference would list
  // keys the visitor cannot press.
  const [hasKeyboard, setHasKeyboard] = React.useState(canHoverPointer);
  React.useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setHasKeyboard(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  const [installAvailable, setInstallAvailable] = React.useState(canInstall);
  const [installed, setInstalled] = React.useState(isInstalled);
  const [installing, setInstalling] = React.useState(false);
  const [installMessage, setInstallMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    const sync = () => {
      setInstallAvailable(canInstall());
      setInstalled(isInstalled());
    };
    sync();
    return onInstallAvailabilityChange(sync);
  }, []);

  const handleInstall = async () => {
    setInstalling(true);
    setInstallMessage(null);
    const outcome = await promptInstall();
    setInstalling(false);
    setInstallAvailable(canInstall());
    setInstalled(isInstalled());
    if (outcome === "accepted") {
      setInstallMessage("Installed. math_games will open in its own window from now on.");
    } else if (outcome === "dismissed") {
      setInstallMessage("Install dismissed. You can try again whenever you like.");
    } else {
      setInstallMessage("This browser has not offered its install prompt. Use the browser menu instead.");
    }
  };
  // Phones get a menu of settings sections instead of one long scroll.
  const [mobileSection, setMobileSection] = React.useState<DesktopTab | null>(null);
  const [settingsSearch, setSettingsSearch] = React.useState("");

  // Installed visitors have no use for the install pane, and devices without a
  // keyboard have no use for the shortcut list.
  const navGroups = React.useMemo(
    () =>
      DESKTOP_NAV.map((group) => ({
        ...group,
        items: group.items.filter(
          (item) => (item.id !== "shortcuts" || hasKeyboard) && (item.id !== "install" || !installed)
        ),
      })).filter((group) => group.items.length > 0),
    [hasKeyboard, installed]
  );

  React.useEffect(() => {
    if (desktopTab === "shortcuts" && !hasKeyboard) setDesktopTab("general");
    if (desktopTab === "install" && installed) setDesktopTab("general");
    if (mobileSection === "shortcuts" && !hasKeyboard) setMobileSection(null);
    if (mobileSection === "install" && installed) setMobileSection(null);
  }, [hasKeyboard, installed, desktopTab, mobileSection]);

  const [checkingUpdate, setCheckingUpdate] = React.useState(false);
  const [updateCheckResult, setUpdateCheckResult] = React.useState<CheckUpdateResult | null>(null);
  const [updatingNow, setUpdatingNow] = React.useState(false);

  const hasUpdate = Boolean(updateReady || updateCheckResult?.hasUpdate);

  const handleCheckForUpdates = async () => {
    if (checkingUpdate) return;
    setCheckingUpdate(true);
    try {
      const result = await checkForUpdate();
      setUpdateCheckResult(result);
      if (result.hasUpdate) {
        onUpdateReadyChange?.(true);
      }
    } catch (err) {
      console.warn("Update check failed:", err);
    } finally {
      setCheckingUpdate(false);
    }
  };

  const handleUpdateNow = async () => {
    if (updatingNow) return;
    setUpdatingNow(true);
    try {
      await applyUpdate();
    } catch {
      window.location.reload();
    }
  };

  const activeTab: DesktopTab | null = isDesktop ? desktopTab : mobileSection;
  const paneStyle = (tab: DesktopTab): React.CSSProperties => ({
    display: activeTab === tab ? "contents" : "none",
  });
  const settingsQuery = settingsSearch.trim().toLowerCase();
  const matchesSettings = (item: { label: string; keywords: string }) =>
    !settingsQuery || item.label.toLowerCase().includes(settingsQuery) || item.keywords.includes(settingsQuery);
  const visibleSettingsCount = navGroups.reduce(
    (count, group) => count + group.items.filter(matchesSettings).length,
    0
  );
  React.useEffect(() => {
    if (!isOpen) return;
    // A requested pane (the streak chip) wins; otherwise start at General.
    setDesktopTab(initialSection ?? "general");
    setMobileSection(initialSection ?? null);
  }, [isOpen, initialSection]);

  // Referral cards come from referrals.json; load them the first time the dialog
  // opens instead of on every page load.
  const [referrals, setReferrals] = React.useState<ReferralLink[]>([]);
  const [referralsLoaded, setReferralsLoaded] = React.useState(false);
  React.useEffect(() => {
    if (!isOpen || referralsLoaded) return;
    let cancelled = false;
    void loadReferrals().then((links) => {
      if (cancelled) return;
      setReferrals(links);
      setReferralsLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, [isOpen, referralsLoaded]);

  // Site Lock states
  const [siteLockEnabled, setSiteLockEnabled] = React.useState(() => {
    return localStorage.getItem("polytrack_site_lock_enabled") === "true";
  });
  const [passwordInput, setPasswordInput] = React.useState(() => {
    return localStorage.getItem("polytrack_site_lock_password") || "";
  });
  const [showPassword, setShowPassword] = React.useState(false);
  const [lockSaved, setLockSaved] = React.useState(false);
  const [lockError, setLockError] = React.useState("");

  // Background & Theme states
  const [bgConfig, setBgConfig] = React.useState<BackgroundConfig>(loadBackgroundConfig);
  const [bgTab, setBgTab] = React.useState<BackgroundType>(() => loadBackgroundConfig().type);
  const [customSolidHex, setCustomSolidHex] = React.useState(() => {
    const current = loadBackgroundConfig();
    return current.type === "solid" && current.id === "custom-solid" ? current.value : "#09090b";
  });
  const [bgNotice, setBgNotice] = React.useState<string | null>(null);

  // System font state
  const [currentFontId, setCurrentFontId] = React.useState<string>(getStoredSystemFont);
  const [fontFilter, setFontFilter] = React.useState<string>("all");
  const [fontNotice, setFontNotice] = React.useState<string | null>(null);

  const handleSelectFont = (fontId: string) => {
    setCurrentFontId(fontId);
    applySystemFont(fontId);
    const chosen = SYSTEM_FONTS.find((f) => f.id === fontId);
    setFontNotice("Applied " + (chosen?.name || fontId));
    setTimeout(() => setFontNotice(null), 2500);
  };

  // 371-day activity history for changelog pane
  const activityDays = React.useMemo(() => getUpdateHistoryDays(), []);

  // Local play statistics; the pane updates live while counting runs.
  const [playStats, setPlayStats] = React.useState<PlayStats>(loadPlayStats);
  const [statsEnabled, setStatsEnabled] = React.useState(isPlayStatsEnabled);

  // Hard reset asks once before wiping everything this browser kept for the site.
  const [resetConfirming, setResetConfirming] = React.useState(false);
  const [resetting, setResetting] = React.useState(false);
  const resetConfirmTimer = React.useRef<number | null>(null);

  React.useEffect(() => {
    return () => {
      if (resetConfirmTimer.current) window.clearTimeout(resetConfirmTimer.current);
    };
  }, []);

  // Proxy reachability, checked only once the mirrors scroll into view
  const [proxyStatus, setProxyStatus] = React.useState<Record<string, ProxyCheckStatus>>({});
  const proxySectionRef = React.useRef<HTMLDivElement>(null);

  // Offline copy and its scheduled cache-first window
  const [offlineSchedule, setOfflineSchedule] = React.useState<OfflineSchedule>(loadOfflineSchedule);
  const [offlineStatus, setOfflineStatus] = React.useState<OfflineStatus | null>(null);
  const [offlineBusy, setOfflineBusy] = React.useState(false);
  const [offlineProgress, setOfflineProgress] = React.useState<OfflineProgress | null>(null);
  const [offlineNotice, setOfflineNotice] = React.useState("");
  const [offlineError, setOfflineError] = React.useState("");

  // Per-game offline packs: searchable list, one download at a time.
  const [gamePacks, setGamePacks] = React.useState<GamePack[]>([]);
  const [downloadedPacks, setDownloadedPacks] = React.useState(loadDownloadedPacks);
  const [packQuery, setPackQuery] = React.useState("");
  const [packBusyId, setPackBusyId] = React.useState<string | null>(null);
  const [packProgress, setPackProgress] = React.useState<GamePackProgress | null>(null);
  const [packNotice, setPackNotice] = React.useState("");
  const [packError, setPackError] = React.useState("");

  // Chat notifications
  const [chatNotificationsOn, setChatNotificationsOn] = React.useState(isChatNotificationsEnabled);

  // Account: the same checkout account that owns Ultra orders. The session is
  // a bearer token in localStorage, so it is restored on every open.
  const [accountUser, setAccountUser] = React.useState<CheckoutUser | null>(null);
  const [accountChecking, setAccountChecking] = React.useState(true);
  const [accountMode, setAccountMode] = React.useState<"signin" | "signup">("signin");
  const [accountName, setAccountName] = React.useState("");
  const [accountEmail, setAccountEmail] = React.useState("");
  const [accountPassword, setAccountPassword] = React.useState("");
  const [accountBusy, setAccountBusy] = React.useState(false);
  const [accountError, setAccountError] = React.useState("");
  const [accountNotice, setAccountNotice] = React.useState("");

  React.useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    setAccountChecking(true);
    void loadCheckoutSession().then((user) => {
      if (cancelled) return;
      setAccountUser(user);
      setAccountChecking(false);
    });
    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  const accountInitials = React.useMemo(() => {
    const name = (accountUser?.name || accountUser?.email || "").trim();
    if (!name) return "?";
    return (
      name
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join("") || "?"
    );
  }, [accountUser]);

  const handleAccountSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (accountBusy) return;
    setAccountError("");
    setAccountNotice("");
    setAccountBusy(true);
    try {
      const user =
        accountMode === "signup"
          ? await signUpCheckout({
              name: accountName.trim(),
              email: accountEmail.trim(),
              password: accountPassword,
            })
          : await signInCheckout({ email: accountEmail.trim(), password: accountPassword });
      setAccountUser(user);
      setAccountPassword("");
      setAccountNotice(accountMode === "signup" ? "Account created. You are signed in." : "Signed in.");
    } catch (error) {
      setAccountError(error instanceof Error ? error.message : "Could not sign in.");
    } finally {
      setAccountBusy(false);
    }
  };

  const handleAccountSignOut = async () => {
    if (accountBusy) return;
    setAccountBusy(true);
    setAccountError("");
    setAccountNotice("");
    try {
      await signOutCheckout();
      setAccountUser(null);
      setAccountNotice("Signed out of this browser.");
    } finally {
      setAccountBusy(false);
    }
  };

  // New game notifications
  const [notificationsOn, setNotificationsOn] = React.useState(isNotificationsEnabled);
  const [notificationNotice, setNotificationNotice] = React.useState("");
  const [notificationError, setNotificationError] = React.useState("");
  const [permission, setPermission] = React.useState(notificationPermission);

  // Panic redirect states
  const [panicUrl, setPanicUrl] = React.useState(() => {
    return localStorage.getItem("polytrack_panic_url") || "https://www.wikipedia.org/";
  });
  const [customPanicInput, setCustomPanicInput] = React.useState(panicUrl);
  const [panicSaved, setPanicSaved] = React.useState(false);
  const [tabCloakEnabled, setTabCloakEnabled] = React.useState(tabCloakSettings.enabled);
  const [tabTitle, setTabTitle] = React.useState(tabCloakSettings.title);
  const [tabIconUrl, setTabIconUrl] = React.useState(tabCloakSettings.iconUrl);
  const [customTabIcon, setCustomTabIcon] = React.useState(tabCloakSettings.customIcon);
  const [tabCloakSaved, setTabCloakSaved] = React.useState(false);
  const [tabCloakError, setTabCloakError] = React.useState("");

  React.useEffect(() => {
    setTabCloakEnabled(tabCloakSettings.enabled);
    setTabTitle(tabCloakSettings.title);
    setTabIconUrl(tabCloakSettings.iconUrl);
    setCustomTabIcon(tabCloakSettings.customIcon);
  }, [tabCloakSettings]);

  const panelRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!isOpen) return;
    setPlayStats(loadPlayStats());
    setStatsEnabled(isPlayStatsEnabled());
    return subscribePlayStats(setPlayStats);
  }, [isOpen]);

  // Daily streak, refreshed every time the dialog opens.
  const [streak, setStreak] = React.useState<StreakData>(loadStreak);
  React.useEffect(() => {
    if (!isOpen) return;
    setStreak(recordVisit());
    return subscribeStreak(setStreak);
  }, [isOpen]);

  const streakDays = React.useMemo(() => {
    const visited = new Set(streak.history);
    const days: { key: string; label: string; visited: boolean; today: boolean }[] = [];
    const now = new Date();
    for (let offset = 29; offset >= 0; offset -= 1) {
      const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - offset);
      const key = dayKey(date);
      days.push({
        key,
        label: date.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
        visited: visited.has(key),
        today: offset === 0,
      });
    }
    return days;
  }, [streak]);
  const streakDaysVisited = streakDays.filter((day) => day.visited).length;
  const streakMilestone = currentStreakMilestone(streak.current);
  const nextMilestone = nextStreakMilestone(streak.current);
  const [sharingStreak, setSharingStreak] = React.useState(false);
  const [streakShareNote, setStreakShareNote] = React.useState("");

  const handleShareStreak = React.useCallback(async () => {
    if (sharingStreak) return;
    setSharingStreak(true);
    setStreakShareNote("");
    try {
      const result = await shareStreakCard(streak);
      setStreakShareNote(
        result === "shared"
          ? "Streak card shared."
          : result === "downloaded"
            ? "Streak card saved to your downloads."
            : "Share cancelled."
      );
    } catch {
      setStreakShareNote("Couldn't build the streak card. Try again.");
    } finally {
      setSharingStreak(false);
    }
  }, [sharingStreak, streak]);

  React.useEffect(() => {
    if (!isOpen) return;
    const section = proxySectionRef.current;
    if (!section) return;

    let cancelled = false;
    let started = false;
    const controller = new AbortController();
    setProxyStatus({});

    const runChecks = () => {
      if (started) return;
      started = true;
      setProxyStatus(
        Object.fromEntries(SITE_MIRRORS.map((mirror) => [mirror.url, "checking" as ProxyCheckStatus]))
      );
      for (const mirror of SITE_MIRRORS) {
        void testFrameLoad(mirror.url, mirror.timeoutMs, controller.signal).then((result) => {
          if (cancelled) return;
          setProxyStatus((current) => ({ ...current, [mirror.url]: result }));
        });
      }
    };

    if (typeof IntersectionObserver === "undefined") {
      runChecks();
      return () => {
        cancelled = true;
        controller.abort();
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          runChecks();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(section);

    return () => {
      cancelled = true;
      controller.abort();
      observer.disconnect();
    };
  }, [isOpen]);

  React.useEffect(() => {
    if (!isOpen) return;
    let active = true;
    setDownloadedPacks(loadDownloadedPacks());
    loadGamePacks()
      .then((packs) => {
        if (active) setGamePacks(packs);
      })
      .catch(() => {
        if (active) setPackError("The list of downloadable games could not be loaded.");
      });
    const stop = onDownloadedPacksChange(() => setDownloadedPacks(loadDownloadedPacks()));
    return () => {
      active = false;
      stop();
    };
  }, [isOpen]);

  React.useEffect(() => {
    if (!isOpen || !offlineSupported()) return;
    let cancelled = false;
    getOfflineStatus()
      .then((status) => {
        if (!cancelled) setOfflineStatus(status);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  useDialogFocus({ active: isOpen, onClose, panelRef });

  // Keep the modal mounted briefly after `isOpen` turns false so the close animation can play.
  const [mounted, setMounted] = React.useState(isOpen);
  const [closing, setClosing] = React.useState(false);
  React.useEffect(() => {
    if (isOpen) {
      setMounted(true);
      setClosing(false);
      return;
    }
    if (!mounted) return;
    setClosing(true);
    const timer = window.setTimeout(() => {
      setMounted(false);
      setClosing(false);
    }, 180);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen && !mounted) return null;

  const handleSaveLock = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (siteLockEnabled && !passwordInput.trim()) {
      setLockError("Enter a password before turning on Site Lock.");
      return;
    }
    setLockError("");
    localStorage.setItem("polytrack_site_lock_enabled", siteLockEnabled ? "true" : "false");
    localStorage.setItem("polytrack_site_lock_password", passwordInput.trim());
    if (onConfigChange) {
      onConfigChange(siteLockEnabled, passwordInput.trim());
    }
    setLockSaved(true);
    setTimeout(() => setLockSaved(false), 2200);
  };

  const handleToggleLock = () => {
    const next = !siteLockEnabled;
    setSiteLockEnabled(next);
    localStorage.setItem("polytrack_site_lock_enabled", next ? "true" : "false");
    if (next && !passwordInput.trim()) {
      setLockError("Set a password below to activate Site Lock.");
    } else {
      setLockError("");
    }
    if (onConfigChange) {
      onConfigChange(next, passwordInput.trim());
    }
    setLockSaved(true);
    setTimeout(() => setLockSaved(false), 2200);
  };

  const handleSelectPreset = (preset: (typeof BACKGROUND_PRESETS)[number]) => {
    const next: BackgroundConfig = {
      type: preset.type,
      id: preset.id,
      value: preset.value,
    };
    setBgConfig(next);
    saveBackgroundConfig(next);
    setBgNotice("Applied " + preset.name);
    setTimeout(() => setBgNotice(null), 2000);
  };

  const handleApplyCustomSolid = (hex: string) => {
    let cleanHex = hex.trim();
    if (!cleanHex.startsWith("#")) cleanHex = "#" + cleanHex;
    if (!/^#[0-9A-Fa-f]{6}$/.test(cleanHex) && !/^#[0-9A-Fa-f]{3}$/.test(cleanHex)) {
      return;
    }
    const next: BackgroundConfig = {
      type: "solid",
      id: "custom-solid",
      value: cleanHex,
    };
    setBgConfig(next);
    setCustomSolidHex(cleanHex);
    saveBackgroundConfig(next);
    setBgNotice("Applied custom background");
    setTimeout(() => setBgNotice(null), 2000);
  };

  const handleToggleChatNotifications = async () => {
    if (chatNotificationsOn) {
      setChatNotificationsEnabled(false);
      setChatNotificationsOn(false);
      setNotificationError("");
      setNotificationNotice("Chat message alerts turned off.");
      return;
    }

    if (!notificationsSupported()) {
      setNotificationError("This browser does not support notifications.");
      return;
    }

    const result = await requestNotificationPermission();
    setPermission(notificationPermission());

    if (result === "granted") {
      setChatNotificationsEnabled(true);
      setChatNotificationsOn(true);
      setNotificationError("");
      setNotificationNotice("Chat notifications turned on!");
    } else {
      setChatNotificationsOn(false);
      setNotificationNotice("");
      setNotificationError(
        result === "denied"
          ? "Notifications are blocked for this site. Allow them in your browser's site settings, then try again."
          : "Notifications were not allowed."
      );
    }
  };

  const handleToggleNotifications = async () => {
    if (notificationsOn) {
      setNotificationsEnabled(false);
      setNotificationsOn(false);
      setNotificationError("");
      setNotificationNotice("New game alerts turned off for this browser.");
      return;
    }

    if (!notificationsSupported()) {
      setNotificationError("This browser does not support notifications.");
      return;
    }

    // Called straight from the click so the browser shows its permission prompt.
    const result = await requestNotificationPermission();
    setPermission(notificationPermission());

    if (result === "granted") {
      setNotificationsEnabled(true);
      setNotificationsOn(true);
      setNotificationError("");
      const sent = await showNewGameNotification();
      setNotificationNotice(
        sent ? "Enabled — check for your new game alert." : "Enabled. Alerts are on for this browser."
      );
      return;
    }

    setNotificationsOn(false);
    setNotificationNotice("");
    setNotificationError(
      result === "denied"
        ? "Notifications are blocked for this site. Allow them in your browser's site settings, then try again."
        : "The permission prompt was dismissed. Turn this on again to retry."
    );
  };

  const mostPlayed = [...playStats.games]
    .sort((a, b) => b.playMs - a.playMs || b.clicks - a.clicks || b.lastPlayedAt - a.lastPlayedAt)
    .slice(0, 5);
  const maxPlayedWeight = mostPlayed.reduce(
    (max, game) => Math.max(max, game.playMs > 0 ? game.playMs : game.clicks),
    0
  );

  const [sharingStats, setSharingStats] = React.useState(false);
  const [statsShareNote, setStatsShareNote] = React.useState("");

  const handleShareStats = React.useCallback(async () => {
    if (sharingStats) return;
    setSharingStats(true);
    setStatsShareNote("");
    const lines = [
      "My math_games stats",
      `${formatPlayTime(playStats.totalPlayMs)} on site`,
      `${playStats.totalClicks.toLocaleString("en-US")} game clicks`,
      `${playStats.games.length.toLocaleString("en-US")} games played`,
      mostPlayed[0] ? `Top game: ${mostPlayed[0].name}` : "",
    ].filter(Boolean);
    const text = lines.join("\n");
    const url = window.location.origin;
    const copy = async () => {
      const payload = `${text}\n${url}`;
      try {
        await navigator.clipboard.writeText(payload);
        return true;
      } catch {}
      // Older browsers and pages without clipboard permission still get a copy
      // through a hidden textarea, as long as this runs from the click.
      try {
        const area = document.createElement("textarea");
        area.value = payload;
        area.setAttribute("readonly", "");
        area.style.position = "fixed";
        area.style.opacity = "0";
        document.body.appendChild(area);
        area.select();
        const copied = document.execCommand("copy");
        document.body.removeChild(area);
        return copied;
      } catch {
        return false;
      }
    };
    try {
      if (typeof navigator.share === "function") {
        await navigator.share({ title: "My math_games stats", text, url });
        setStatsShareNote("Stats shared.");
      } else {
        setStatsShareNote((await copy()) ? "Stats copied to your clipboard." : "Couldn't copy your stats.");
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        setStatsShareNote("Share cancelled.");
      } else {
        setStatsShareNote((await copy()) ? "Stats copied to your clipboard." : "Couldn't share your stats.");
      }
    } finally {
      setSharingStats(false);
    }
  }, [mostPlayed, playStats, sharingStats]);

  const downloadedPackIds = React.useMemo(
    () => new Set(downloadedPacks.map((pack) => pack.gameId)),
    [downloadedPacks]
  );
  const matchingGamePacks = React.useMemo(() => {
    const query = packQuery.trim().toLowerCase();
    return query ? gamePacks.filter((pack) => pack.name.toLowerCase().includes(query)) : gamePacks;
  }, [gamePacks, packQuery]);
  const [packVisibleCount, setPackVisibleCount] = React.useState(PACK_PAGE_SIZE);
  React.useEffect(() => {
    setPackVisibleCount(PACK_PAGE_SIZE);
  }, [packQuery, gamePacks]);
  const filteredGamePacks = matchingGamePacks.slice(0, packVisibleCount);
  const showMoreGamePacks = filteredGamePacks.length < matchingGamePacks.length;
  const loadMoreGamePacks = () =>
    setPackVisibleCount((count) => Math.min(matchingGamePacks.length, count + PACK_PAGE_SIZE));
  const handlePackListScroll = (event: React.UIEvent<HTMLDivElement>) => {
    if (!showMoreGamePacks) return;
    const list = event.currentTarget;
    if (list.scrollHeight - list.scrollTop - list.clientHeight > 48) return;
    loadMoreGamePacks();
  };

  const offlinePercent = offlineProgress
    ? offlineProgress.total > 0
      ? Math.min(100, Math.round((offlineProgress.done / offlineProgress.total) * 100))
      : offlineProgress.totalBytes > 0
        ? Math.min(100, Math.round((offlineProgress.bytes / offlineProgress.totalBytes) * 100))
        : 0
    : 0;

  const notificationStatusLabel = !notificationsSupported()
    ? "Unsupported"
    : permission === "denied"
      ? "Blocked"
      : notificationsOn
        ? "On"
        : "Off";

  const handleDownloadOffline = async () => {
    if (!offlineSupported()) {
      setOfflineError("This browser cannot store an offline copy.");
      return;
    }
    setOfflineBusy(true);
    setOfflineError("");
    setOfflineNotice("");
    setOfflineProgress({ done: 0, total: 0, bytes: 0, totalBytes: 0, failed: 0 });
    try {
      const status = await downloadOfflineSite((progress) => setOfflineProgress(progress));
      setOfflineStatus(status);
      setOfflineSchedule(loadOfflineSchedule());
      setOfflineNotice(
        status.failed > 0
          ? `Offline copy saved: ${status.cachedFiles} files (${formatBytes(status.bytes)}). ${status.failed} file${status.failed === 1 ? "" : "s"} could not be saved.`
          : `Offline copy ready: ${status.cachedFiles} files (${formatBytes(status.bytes)}).`
      );
    } catch (error) {
      setOfflineError(error instanceof Error ? error.message : "The offline download failed.");
    } finally {
      setOfflineBusy(false);
      setOfflineProgress(null);
    }
  };

  const handleDeleteOffline = async () => {
    if (!window.confirm("Delete the downloaded offline copy from this browser?")) return;
    setOfflineBusy(true);
    setOfflineError("");
    setOfflineNotice("");
    try {
      await deleteOfflineCache();
      setOfflineStatus({ cachedFiles: 0, bytes: 0, cachedAt: null, failed: 0 });
      setOfflineSchedule(saveOfflineSchedule({ requested: false }));
      setOfflineNotice("Offline copy deleted from this browser.");
    } catch (error) {
      setOfflineError("The offline copy could not be deleted.");
    } finally {
      setOfflineBusy(false);
    }
  };

  const handleToggleOfflineSchedule = () => {
    const next = saveOfflineSchedule({ scheduleEnabled: !offlineSchedule.scheduleEnabled });
    setOfflineSchedule(next);
    setOfflineNotice(next.scheduleEnabled ? "Auto-backup window turned on." : "Auto-backup window turned off.");
    window.setTimeout(() => setOfflineNotice(""), 2400);
  };

  const handleOfflineTimeChange = (field: "startTime" | "endTime", value: string) => {
    setOfflineSchedule(saveOfflineSchedule({ [field]: value }));
  };

  const handleDownloadPack = async (pack: GamePack) => {
    if (packBusyId) return;
    setPackBusyId(pack.gameId);
    setPackError("");
    setPackNotice("");
    setPackProgress({ done: 0, total: pack.files.length, bytes: 0, failed: 0, name: pack.name });
    try {
      const result = await downloadGamePack(pack, setPackProgress);
      setDownloadedPacks(loadDownloadedPacks());
      setPackNotice(
        result.failed > 0
          ? `${pack.name} saved (${formatPackSize(result.bytes)}); ${result.failed} file${result.failed === 1 ? "" : "s"} could not be downloaded.`
          : `${pack.name} is ready offline (${formatPackSize(result.bytes)}).`
      );
    } catch (error) {
      setPackError(error instanceof Error ? error.message : `Could not download ${pack.name}.`);
    } finally {
      setPackBusyId(null);
      setPackProgress(null);
    }
  };

  const handleDeletePack = async (pack: GamePack) => {
    setPackBusyId(pack.gameId);
    setPackError("");
    try {
      await deleteGamePack(pack.gameId);
      setDownloadedPacks(loadDownloadedPacks());
      setPackNotice(`${pack.name} was removed from offline storage.`);
    } catch {
      setPackError(`Could not remove ${pack.name}.`);
    } finally {
      setPackBusyId(null);
    }
  };

  const handleDeleteAllPacks = async () => {
    if (!window.confirm("Remove every downloaded game pack from this browser?")) return;
    setPackBusyId("all");
    setPackError("");
    try {
      await deleteAllGamePacks();
      setDownloadedPacks([]);
      setPackNotice("All downloaded game packs were removed.");
    } catch {
      setPackError("The game packs could not be removed.");
    } finally {
      setPackBusyId(null);
    }
  };

  const handleSaveTabCloak = (event: React.FormEvent) => {
    event.preventDefault();
    const cleanTitle = tabTitle.trim();
    const cleanIconUrl = tabIconUrl.trim();
    if (tabCloakEnabled && !cleanTitle) {
      setTabCloakError("Enter a tab name before enabling custom tab cloaking.");
      return;
    }
    if (tabCloakEnabled && customTabIcon && !cleanIconUrl) {
      setTabCloakError("Enter an icon URL or select Default icon.");
      return;
    }
    if (cleanIconUrl) {
      try {
        const parsed = new URL(cleanIconUrl, window.location.href);
        if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
          throw new Error("unsupported protocol");
        }
      } catch {
        setTabCloakError("Enter a valid http or https icon URL.");
        return;
      }
    }
    setTabCloakError("");
    const settings = { enabled: tabCloakEnabled, title: cleanTitle, iconUrl: cleanIconUrl, customIcon: customTabIcon };
    onTabCloakChange(settings);
    setTabCloakSaved(true);
    window.setTimeout(() => setTabCloakSaved(false), 2200);
  };

  const handleSavePanicUrl = (url: string) => {
    let finalUrl = url.trim();
    if (!finalUrl.startsWith("http://") && !finalUrl.startsWith("https://")) {
      finalUrl = "https://" + finalUrl;
    }
    setPanicUrl(finalUrl);
    setCustomPanicInput(finalUrl);
    localStorage.setItem("polytrack_panic_url", finalUrl);
    setPanicSaved(true);
    setTimeout(() => setPanicSaved(false), 2200);
  };

  const handleHardReset = () => {
    if (resetting) return;
    if (!resetConfirming) {
      setResetConfirming(true);
      if (resetConfirmTimer.current) window.clearTimeout(resetConfirmTimer.current);
      resetConfirmTimer.current = window.setTimeout(() => setResetConfirming(false), 6000);
      return;
    }
    if (resetConfirmTimer.current) window.clearTimeout(resetConfirmTimer.current);
    setResetConfirming(false);
    setResetting(true);
    void hardResetSite();
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-start justify-center overflow-y-auto overscroll-contain bg-black/70 p-2 pt-[4.5rem] sm:items-center sm:p-4 ${closing ? "settings-backdrop-exit pointer-events-none" : "settings-backdrop-enter"}`}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
        tabIndex={-1}
        className={`${isDesktop ? "sm-desk relative flex h-[85vh] w-full max-w-5xl flex-row overflow-hidden p-0 focus:outline-none" : "relative flex max-h-[calc(100dvh-5.25rem)] w-full max-w-lg flex-col gap-5 overflow-y-auto p-5 pt-6 text-zinc-100 focus:outline-none sm:my-auto sm:max-w-2xl sm:p-6 md:max-h-[88vh]"} ${closing ? "settings-panel-exit" : "settings-panel-enter"}`}
        style={{
          background: "#1c1c1c",
          borderRadius: 16,
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "0 32px 64px -32px rgba(0, 0, 0, 0.9)",
        }}
      >
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-2 h-1 w-10 -translate-x-1/2 rounded-full bg-white/20 sm:hidden"
        />

        <style>{DESKTOP_LIGHT_CSS}</style>
        {isDesktop && (
          <aside className="flex w-72 shrink-0 flex-col gap-1 overflow-y-auto border-r p-4" style={{ borderColor: "rgba(255, 255, 255, 0.07)", background: "#171717" }} aria-label="Settings sections">
            <label className="mb-4 flex items-center gap-2 rounded-lg px-3 py-2" style={{ background: "#141414", boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.07)" }}>
              <Search aria-hidden="true" className="h-4 w-4 text-zinc-500" />
              <input
                value={settingsSearch}
                onChange={(e) => setSettingsSearch(e.target.value)}
                placeholder="Search settings"
                aria-label="Search settings"
                className="w-full bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
                style={{ border: "none", padding: 0, background: "transparent" }}
              />
            </label>
            {navGroups.map((group) => {
              const q = settingsSearch.trim().toLowerCase();
              const items = group.items.filter((item) => !q || item.label.toLowerCase().includes(q) || item.keywords.includes(q));
              if (!items.length) return null;
              return (
                <div key={group.heading} className="mb-4 flex flex-col gap-0.5">
                  <div className="px-3 pb-1.5 text-[11px] font-medium text-zinc-500">{group.heading}</div>
                  {items.map((item) => {
                    const active = desktopTab === item.id;
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setDesktopTab(item.id)}
                        aria-current={active ? "page" : undefined}
                        className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors"
                        style={active ? { background: "rgba(255, 255, 255, 0.07)", color: "#fafafa", boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.06)" } : { color: "#a1a1aa" }}
                      >
                        <Icon className={`h-4 w-4 shrink-0 ${active ? "text-zinc-200" : "text-zinc-500"}`} aria-hidden="true" />
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </aside>
        )}
        <div className={isDesktop ? "relative flex min-w-0 flex-1 flex-col gap-5 overflow-y-auto px-10 py-8" : "contents"}>
        {isDesktop && (
          <>
            <button type="button" onClick={onClose} aria-label="Close settings" className="absolute right-4 top-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-white/[0.06] hover:text-white">
              <X aria-hidden="true" className="h-4 w-4" />
            </button>
            <h2 id="settings-title" className="sr-only">
              Settings
            </h2>
          </>
        )}
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3" style={isDesktop ? { display: "none" } : undefined}>
          {mobileSection ? (
            <div className="flex min-w-0 items-center gap-2">
              <button
                type="button"
                onClick={() => setMobileSection(null)}
                aria-label="Back to settings sections"
                style={CHIP_STYLE}
                className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-white/[0.08] hover:text-white"
              >
                <ArrowLeft aria-hidden="true" className="h-4 w-4" />
              </button>
              <h2 id="settings-title" className="truncate text-base font-medium  text-zinc-100">
                {navGroups.flatMap((g) => g.items).find((i) => i.id === mobileSection)?.label ?? "Settings"}
              </h2>
            </div>
          ) : (
                          <div className="flex items-center gap-2">
              <h2 id="settings-title" className="text-base font-medium text-zinc-100">
                Settings
              </h2>
            </div>
          )}
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg p-1 text-zinc-400 transition-colors hover:bg-white/[0.08] hover:text-white"
            aria-label="Close settings"
          >
            <X aria-hidden="true" className="w-4 h-4" />
          </button>
        </div>

        {/* Phone settings menu: search plus grouped sections. */}
        {!isDesktop && !mobileSection && (
          <nav aria-label="Settings sections" className="flex flex-col gap-3">
            <label
              className="flex items-center gap-2 rounded-lg px-3 py-2"
              style={{
                background: "#141414",
                boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.07)",
              }}
            >
              <Search aria-hidden="true" className="h-4 w-4 shrink-0 text-zinc-500" />
              <input
                value={settingsSearch}
                onChange={(e) => setSettingsSearch(e.target.value)}
                placeholder="Search settings"
                aria-label="Search settings"
                className="w-full bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
                style={{ border: "none", padding: 0, background: "transparent" }}
              />
              {settingsSearch && (
                <button
                  type="button"
                  onClick={() => setSettingsSearch("")}
                  aria-label="Clear settings search"
                  className="shrink-0 rounded-full p-1 text-zinc-500 transition-colors hover:bg-white/[0.08] hover:text-zinc-200"
                >
                  <X aria-hidden="true" className="h-3.5 w-3.5" />
                </button>
              )}
            </label>

            {navGroups.map((group) => {
              const items = group.items.filter(matchesSettings);
              if (!items.length) return null;
              return (
                <section key={group.heading} aria-label={`${group.heading} settings`}>
                  <h3 className="mb-1.5 px-1 text-[11px] font-medium text-zinc-500">
                    {group.heading}
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setMobileSection(item.id);
                            setSettingsSearch("");
                          }}
                          style={{ ...CHIP_STYLE, borderRadius: 12 }}
                          className="flex min-h-14 cursor-pointer items-center gap-2 px-3 py-2.5 text-left text-xs font-medium text-zinc-200 transition-colors hover:bg-white/[0.08] hover:text-white"
                        >
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white/[0.06]">
                            <Icon className="h-3.5 w-3.5 text-zinc-400" aria-hidden="true" />
                          </span>
                          <span className="min-w-0 flex-1">{item.label}</span>
                          <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-zinc-600" />
                        </button>
                      );
                    })}
                  </div>
                </section>
              );
            })}

            {visibleSettingsCount === 0 && (
              <p className="rounded-xl border border-dashed border-white/[0.12] bg-white/[0.015] px-3 py-3 text-xs text-zinc-500">
                No settings match “{settingsSearch.trim()}”.
              </p>
            )}
          </nav>
        )}

        <div style={paneStyle("general")}>
        <section className="flex flex-col gap-3 border-t border-white/[0.08] pt-3" aria-labelledby="layout-controls-title">
          <div>
            <h3 id="layout-controls-title" className="hidden text-base font-medium text-zinc-100 md:block">Layout & startup</h3>
            <p className="mt-0.5 text-xs text-zinc-400">The loading animation, side chat, footer and ad space.</p>
          </div>
          <div className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <div>
              <div className="text-sm font-medium text-zinc-200">Startup loading animation</div>
              <div className="text-xs text-zinc-500">Play the 3D glass logo reveal when loading the site</div>
            </div>
            <button
              type="button"
              onClick={() => onLoadingRevealChange?.(!loadingRevealEnabled)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-150 ease-out ${loadingRevealEnabled ? "bg-emerald-600" : "bg-zinc-700"}`}
              role="switch"
              aria-checked={loadingRevealEnabled}
              aria-label="Startup loading animation"
            >
              <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-150 ease-out ${loadingRevealEnabled ? "translate-x-5" : "translate-x-0"}`} />
            </button>
          </div>
          <div className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <div>
              <div className="text-sm font-medium text-zinc-200">Side chat and visitor counter</div>
              <div className="text-xs text-zinc-500">Keep the chat panel visible beside the game catalog</div>
            </div>
            <button type="button" onClick={() => onSideChatChange(!sideChatEnabled)} className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-150 ease-out ${sideChatEnabled ? "bg-emerald-600" : "bg-zinc-700"}`} role="switch" aria-checked={sideChatEnabled} aria-label="Side chat and visitor counter">
              <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-150 ease-out ${sideChatEnabled ? "translate-x-5" : "translate-x-0"}`} />
            </button>
          </div>
          <div className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <div>
              <div className="text-sm font-medium text-zinc-200">Show footer</div>
              <div className="text-xs text-zinc-500">Show the footer links and report button at the bottom of the page</div>
            </div>
            <button type="button" onClick={() => onFooterHiddenChange?.(!footerHidden)} className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-150 ease-out ${!footerHidden ? "bg-emerald-600" : "bg-zinc-700"}`} role="switch" aria-checked={!footerHidden} aria-label="Show footer">
              <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-150 ease-out ${!footerHidden ? "translate-x-5" : "translate-x-0"}`} />
            </button>
          </div>
          <div className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 opacity-70">
            <div>
              <div className="text-sm font-medium text-zinc-200">Ad space</div>
              <div className="text-xs text-zinc-500">
                On in this build. Ultra removes ads.
              </div>
            </div>
            <button
              type="button"
              disabled
              aria-disabled="true"
              aria-checked={adSpotEnabled}
              role="switch"
              aria-label="Ad space (always on)"
              title="Ultra removes ads"
              className="relative inline-flex h-6 w-11 shrink-0 cursor-not-allowed rounded-full bg-zinc-700/70"
            >
              <span className="pointer-events-none inline-block h-5 w-5 translate-x-5 transform rounded-full bg-white/60" />
            </button>
          </div>
          {/* Check for updates card */}
          <div
            style={{
              borderRadius: 12,
              background: "rgba(255, 255, 255, 0.025)",
              boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.07)",
            }}
            className="flex flex-col gap-2.5 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <div
                  style={{ borderRadius: 8, background: "rgba(255, 255, 255, 0.06)" }}
                  className="mt-0.5 shrink-0 p-1.5 text-zinc-300"
                >
                  <RefreshCw aria-hidden="true" className={`h-4 w-4 ${checkingUpdate ? "animate-spin" : ""}`} />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-zinc-100">Updates</span>
                    <span style={CHIP_STYLE} className="px-2 py-0.5 font-mono text-[11px] text-zinc-400">
                      v{SITE_VERSION}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-zinc-400">
                    See whether a newer build exists.
                  </p>
                </div>
              </div>
            </div>

            {hasUpdate ? (
              <div className="flex items-start gap-2.5 rounded-lg border border-white/[0.08] bg-white/[0.03] p-3 text-xs">
                <Download aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" />
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-zinc-100">
                    Update available {updateCheckResult?.latestVersion ? `(v${updateCheckResult.latestVersion})` : ""}
                  </div>
                  <div className="mt-0.5 text-[11px] text-zinc-400">
                    Reloads the page. Saves and progress stay.
                  </div>
                </div>
              </div>
            ) : updateCheckResult ? (
              <div className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-xs text-zinc-400">
                <CheckCircle2 aria-hidden="true" className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>Latest version, v{SITE_VERSION}.</span>
              </div>
            ) : null}

            {updateCheckResult?.error && (
              <p className="text-[11px] text-red-300">{updateCheckResult.error}</p>
            )}

            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              <button
                type="button"
                onClick={handleCheckForUpdates}
                disabled={checkingUpdate || updatingNow}
                style={CHIP_STYLE}
                className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-zinc-200 transition-colors hover:bg-white/[0.08] hover:text-white disabled:opacity-60"
              >
                <RefreshCw aria-hidden="true" className={`h-3.5 w-3.5 ${checkingUpdate ? "animate-spin text-zinc-300" : "text-zinc-400"}`} />
                <span>{checkingUpdate ? "Checking…" : updateCheckResult ? "Check again" : "Check for updates"}</span>
              </button>

              {hasUpdate && (
                <button
                  type="button"
                  onClick={handleUpdateNow}
                  disabled={updatingNow}
                  className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-white px-3.5 py-2 text-xs font-medium text-zinc-950 transition-colors hover:bg-zinc-200 disabled:cursor-wait"
                >
                  <Download aria-hidden="true" className="h-3.5 w-3.5" />
                  <span>{updatingNow ? "Updating…" : "Update now"}</span>
                </button>
              )}
            </div>
          </div>

          <div
            style={{
              borderRadius: 12,
              background: "rgba(255, 255, 255, 0.02)",
              boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.06)",
            }}
            className="flex flex-col gap-2.5 p-4"
          >
            <div className="flex items-start gap-2">
              <RotateCcw aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500" />
              <div className="min-w-0">
                <div className="text-sm font-medium text-zinc-200">Hard reset</div>
                <div className="text-xs text-zinc-500">
                  Clears this site’s cache, local storage, cookies and offline copy, then reloads. Saved settings,
                  favourites and progress on this device are erased.
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleHardReset}
              disabled={resetting}
              className={`inline-flex cursor-pointer items-center justify-center gap-1.5 self-start rounded-lg border px-3 py-2 text-xs font-medium transition-colors disabled:cursor-wait ${
                resetConfirming
                  ? "border-red-500/60 bg-red-500/20 text-red-100"
                  : "border-white/[0.08] text-red-300 hover:bg-red-500/10"
              }`}
            >
              <Trash2 aria-hidden="true" className="h-3.5 w-3.5" />
              <span>{resetting ? "Resetting…" : resetConfirming ? "Click again to erase everything" : "Hard reset and reload"}</span>
            </button>
            <p role="status" className="text-[11px] leading-relaxed text-zinc-500">
              {resetConfirming
                ? "This cannot be undone. Click again within a few seconds."
                : "Use this when an update seems stuck on an old version."}
            </p>
          </div>
        </section>
        </div>

        {/* Install as an app: the button uses the browser's own PWA prompt. */}
        <div style={paneStyle("install")}>
        <section aria-labelledby="install-app-title" className="flex flex-col gap-3 border-t border-white/[0.08] pt-3">
          <div>
            <h3 id="install-app-title" className="hidden text-base font-medium text-zinc-100 md:block">Install math_games</h3>
            <p className="mt-0.5 text-xs text-zinc-400">
              Add it to your device for its own window, a home-screen or desktop icon, and a faster start.
            </p>
          </div>

          <div className="flex flex-col gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-sm font-medium text-zinc-200">
                  {installed ? "Installed" : installAvailable ? "Ready to install" : "Install from your browser"}
                </div>
                <div className="mt-0.5 text-xs text-zinc-500">
                  {installed
                    ? "math_games is running as an installed app on this device."
                    : installAvailable
                      ? "The browser will ask you to confirm before anything is added."
                      : "This browser is not currently offering an automatic install prompt."
                  }
                </div>
              </div>
              <Download aria-hidden="true" className={`mt-0.5 h-4 w-4 shrink-0 ${installed ? "text-emerald-400" : "text-zinc-500"}`} />
            </div>

            {!installed && (
              <button
                type="button"
                onClick={() => void handleInstall()}
                disabled={installing || !installAvailable}
                className={`inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors disabled:cursor-default ${
                  installAvailable
                    ? "bg-white text-zinc-950 hover:bg-zinc-200"
                    : "bg-white/[0.05] text-zinc-500"
                }`}
              >
                <Download aria-hidden="true" className="h-3.5 w-3.5" />
                <span>
                  {installing ? "Opening install prompt…" : installAvailable ? "Install app" : "Install prompt unavailable"}
                </span>
              </button>
            )}

            {installed && (
              <p className="text-[11px] leading-relaxed text-emerald-300">
                You are already using the installed app. Nothing else to do.
              </p>
            )}
            {installMessage && (
              <p role="status" className="text-[11px] leading-relaxed text-zinc-400">{installMessage}</p>
            )}
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-[11px] leading-relaxed text-zinc-400">
            <div className="mb-1 text-xs font-medium text-zinc-300">If no prompt appears</div>
            <ul className="list-disc space-y-1 pl-4">
              {isIos() ? (
                <li>On iPhone or iPad, open the Share menu in Safari and choose “Add to Home Screen”.</li>
              ) : (
                <li>Open your browser menu and choose “Install app” or “Add to Home screen”. Chrome and Edge also show an install icon in the address bar.</li>
              )}
              <li>Installing needs HTTPS and a supported browser; private windows usually cannot install.</li>
            </ul>
          </div>
        </section>
        </div>

        {/* Keyboard shortcuts, including the command palette. */}
        <div style={paneStyle("shortcuts")}>
        <section aria-labelledby="shortcuts-title" className="flex flex-col gap-3 border-t border-white/[0.08] pt-3">
          <div>
            <h3 id="shortcuts-title" className="hidden text-base font-medium text-zinc-100 md:block">Keyboard shortcuts</h3>
            <p className="mt-0.5 text-xs text-zinc-400">These work anywhere in the hub. The search and panic keys pause while you are typing in a field.</p>
          </div>

          <div className="overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.025]">
            {KEYBOARD_SHORTCUTS.map((shortcut, index) => (
              <div
                key={shortcut.label}
                className={`flex items-center justify-between gap-3 px-3 py-2.5 ${index > 0 ? "border-t border-white/[0.06]" : ""}`}
              >
                <span className="text-xs text-zinc-300">{shortcut.label}</span>
                <kbd className="shrink-0 rounded-md border border-white/10 bg-white/[0.05] px-2 py-1 font-mono text-[11px] leading-none text-zinc-200">
                  {shortcut.keys}
                </kbd>
              </div>
            ))}
          </div>

          <p className="text-[11px] leading-relaxed text-zinc-500">
            The command palette searches games and runs hub actions, including random play, settings, the change log and copying
            this page’s link. On macOS, ⌘ K opens it; elsewhere use Ctrl K.
          </p>
        </section>
        </div>

        {/* Account: the same account that owns Ultra checkout orders. */}
        <div style={paneStyle("account")}>
        <section aria-labelledby="account-title" className="flex flex-col gap-3 border-t border-white/[0.08] pt-3">
          <div className="flex items-start gap-2">
            <div
              style={ICON_TILE}
              className="p-1.5 text-zinc-300"
            >
              <UserRound aria-hidden="true" className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-base font-medium text-zinc-100">
                <span id="account-title">Account</span>
                <span className={`font-mono text-[11px] ${accountUser ? "text-emerald-400" : "text-zinc-500"}`}>
                  {accountUser ? "signed in" : "signed out"}
                </span>
              </div>
              <div className="text-xs text-zinc-400">
                Sign in with the account that owns your Ultra orders
              </div>
            </div>
          </div>

          {accountChecking ? (
            <p className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-xs text-zinc-400">
              Checking for a saved account…
            </p>
          ) : accountUser ? (
            <div
              style={{
                borderRadius: 12,
                background: "rgba(255, 255, 255, 0.02)",
                boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.06)",
                padding: "12px",
              }}
              className="flex flex-col gap-3"
            >
              <div className="flex items-center gap-3">
                <div
                  aria-hidden="true"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/[0.1] bg-white/[0.06] text-sm font-semibold text-zinc-200"
                >
                  {accountInitials}
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-zinc-100">{accountUser.name}</div>
                  <div className="truncate text-xs text-zinc-500">{accountUser.email}</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <a
                  href="/checkout"
                  style={CHIP_STYLE}
                  className="inline-flex cursor-pointer items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/[0.08] hover:text-white"
                >
                  <ExternalLink aria-hidden="true" className="h-3 w-3" />
                  Ultra checkout
                </a>
                <button
                  type="button"
                  onClick={handleAccountSignOut}
                  disabled={accountBusy}
                  style={CHIP_STYLE}
                  className="inline-flex cursor-pointer items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {accountBusy ? "Signing out…" : "Sign out"}
                </button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleAccountSubmit}
              style={{
                borderRadius: 12,
                background: "rgba(255, 255, 255, 0.02)",
                boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.06)",
                padding: "12px",
              }}
              className="flex flex-col gap-3"
            >
              <div className="flex flex-col gap-2">
                {accountMode === "signup" && (
                  <label htmlFor="account-name" className="flex flex-col gap-1 text-[11px] font-medium text-zinc-400">
                    Name
                    <input
                      id="account-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      maxLength={60}
                      value={accountName}
                      onChange={(event) => setAccountName(event.target.value)}
                      placeholder="Your name"
                      required
                      style={{
                        borderRadius: 8,
                        background: "rgba(255, 255, 255, 0.04)",
                        boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.06)",
                      }}
                      className="w-full px-3 py-1.5 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
                    />
                  </label>
                )}
                <label htmlFor="account-email" className="flex flex-col gap-1 text-[11px] font-medium text-zinc-400">
                  Email
                  <input
                    id="account-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    maxLength={200}
                    value={accountEmail}
                    onChange={(event) => setAccountEmail(event.target.value)}
                    placeholder="you@school.edu"
                    required
                    style={{
                      borderRadius: 8,
                      background: "rgba(255, 255, 255, 0.04)",
                      boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.06)",
                    }}
                    className="w-full px-3 py-1.5 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
                  />
                </label>
                <label htmlFor="account-password" className="flex flex-col gap-1 text-[11px] font-medium text-zinc-400">
                  Password
                  <input
                    id="account-password"
                    name="password"
                    type="password"
                    autoComplete={accountMode === "signup" ? "new-password" : "current-password"}
                    maxLength={200}
                    minLength={accountMode === "signup" ? 8 : undefined}
                    value={accountPassword}
                    onChange={(event) => setAccountPassword(event.target.value)}
                    placeholder={accountMode === "signup" ? "At least 8 characters" : "Your password"}
                    required
                    style={{
                      borderRadius: 8,
                      background: "rgba(255, 255, 255, 0.04)",
                      boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.06)",
                    }}
                    className="w-full px-3 py-1.5 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
                  />
                </label>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="submit"
                  disabled={accountBusy}
                  className="inline-flex cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-zinc-950 transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {accountBusy
                    ? accountMode === "signup"
                      ? "Creating account…"
                      : "Signing in…"
                    : accountMode === "signup"
                      ? "Create account"
                      : "Sign in"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAccountMode((current) => (current === "signin" ? "signup" : "signin"));
                    setAccountError("");
                  }}
                  className="cursor-pointer text-[11px] font-medium text-zinc-400 underline underline-offset-2 transition-colors hover:text-white"
                >
                  {accountMode === "signin" ? "Create an account" : "I already have an account"}
                </button>
              </div>
            </form>
          )}

          {accountError && (
            <p
              role="alert"
              className="rounded-lg border border-red-500/25 bg-red-500/10 px-3 py-2 text-xs leading-relaxed text-red-300"
            >
              {accountError}
            </p>
          )}

          {accountNotice && (
            <p className="flex items-center gap-1.5 text-xs font-medium text-emerald-400">
              <Check aria-hidden="true" className="h-3.5 w-3.5" />
              {accountNotice}
            </p>
          )}

          <p className="text-[11px] leading-relaxed text-zinc-500">
            This is the account your Ultra orders are tied to. Settings and game data still live in this
            browser only — a hard reset in Layout &amp; startup clears them.
          </p>
        </section>
        </div>

        {/* Local play statistics */}
        <div style={paneStyle("stats")}>
        <section className="flex flex-col gap-3 border-t border-white/[0.08] pt-3" aria-labelledby="stats-title">
          <div className="flex items-start gap-2">
            <div
              style={ICON_TILE}
              className="p-1.5 text-zinc-300"
            >
              <BarChart3 aria-hidden="true" className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-base font-medium text-zinc-100">
                <span id="stats-title">Your statistics</span>
                <span className="font-mono text-[11px] text-zinc-500">this device</span>
              </div>
              <div className="text-xs text-zinc-400">Play time, clicks and your most played games</div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-zinc-200">
                Always count
                <span className={`font-mono text-[11px] ${statsEnabled ? "text-emerald-400" : "text-zinc-500"}`}>
                  {statsEnabled ? "on" : "paused"}
                </span>
              </div>
              <div className="text-xs text-zinc-500">
                Counts every second on the hub and in games until you turn it off
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                const next = !statsEnabled;
                setPlayStatsEnabled(next);
                setStatsEnabled(next);
              }}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-150 ease-out ${statsEnabled ? "bg-emerald-600" : "bg-zinc-700"}`}
              role="switch"
              aria-checked={statsEnabled}
              aria-label="Always count statistics"
            >
              <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-150 ease-out ${statsEnabled ? "translate-x-5" : "translate-x-0"}`} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              { label: "Time on site", value: formatPlayTime(playStats.totalPlayMs), icon: Timer, tone: "text-zinc-500" },
              { label: "Game clicks", value: playStats.totalClicks.toLocaleString("en-US"), icon: MousePointerClick, tone: "text-zinc-500" },
              { label: "Games played", value: playStats.games.length.toLocaleString("en-US"), icon: Gamepad2, tone: "text-zinc-500" },
              { label: "Sessions", value: playStats.totalSessions.toLocaleString("en-US"), icon: Trophy, tone: "text-zinc-500" },
            ].map((tile) => {
              const Icon = tile.icon;
              return (
                <div
                  key={tile.label}
                  style={{
                    borderRadius: 12,
                    background: "rgba(255, 255, 255, 0.02)",
                    boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.06)",
                  }}
                  className="p-2.5"
                >
                  <div className="flex items-center gap-1 text-[11px] font-medium text-zinc-500">
                    <Icon aria-hidden="true" className={`h-3 w-3 ${tile.tone}`} />
                    {tile.label}
                  </div>
                  <div className="mt-1 font-mono text-lg font-medium  text-zinc-100">
                    {tile.value}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => void handleShareStats()}
              disabled={sharingStats}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/[0.06] hover:text-white disabled:cursor-wait disabled:opacity-60"
            >
              <Share2 aria-hidden="true" className="h-3.5 w-3.5" />
              <span>{sharingStats ? "Preparing…" : "Share my stats"}</span>
            </button>
            {statsShareNote && (
              <span role="status" aria-live="polite" className="text-[11px] text-zinc-400">
                {statsShareNote}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2 rounded-xl bg-white/[0.02] p-3 ring-1 ring-inset ring-white/[0.06]">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-200">
                <Trophy aria-hidden="true" className="h-3.5 w-3.5 text-zinc-500" />
                Most played
              </div>
              {playStats.lastPlayedAt ? (
                <span className="text-[11px] text-zinc-500">
                  Last played {new Date(playStats.lastPlayedAt).toLocaleDateString()}
                </span>
              ) : null}
            </div>

            {mostPlayed.length > 0 ? (
              <ul className="flex flex-col gap-2">
                {mostPlayed.map((game, index) => {
                  const weight = game.playMs > 0 ? game.playMs : game.clicks;
                  const percent = maxPlayedWeight > 0 ? Math.max(8, Math.round((weight / maxPlayedWeight) * 100)) : 0;
                  return (
                    <li key={game.id} className="min-w-0">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="truncate text-xs text-zinc-200">
                          <span className="mr-1 font-mono text-[11px] text-zinc-500">{index + 1}.</span>
                          {game.name}
                        </span>
                        <span className="shrink-0 text-[11px] text-zinc-500">
                          {game.playMs > 0 ? `${formatPlayTime(game.playMs)} · ` : ""}
                          {game.clicks} click{game.clicks === 1 ? "" : "s"}
                        </span>
                      </div>
                      <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-white/[0.06]">
                        <div className="h-full rounded-full bg-emerald-500/70" style={{ width: `${percent}%` }} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-[11px] text-zinc-500">Play a game and your top games will show up here.</p>
            )}

            <p className="text-[11px] leading-relaxed text-zinc-500">
              Time counts every second while the hub is open or a game is running, and stops when Always count is off.
              Statistics stay on this device.
            </p>
          </div>
        </section>
        </div>

        {/* Daily streak */}
        <div style={paneStyle("streak")}>
        <section className="flex flex-col gap-3 border-t border-white/[0.08] pt-3" aria-labelledby="streak-title">
          <div className="flex items-start gap-2">
            <div
              style={ICON_TILE}
              className="p-1.5 text-amber-300"
            >
              <Flame aria-hidden="true" className="h-4 w-4 fill-amber-400/30" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-base font-medium text-zinc-100">
                <span id="streak-title">Daily streak</span>
                <span className="font-mono text-[11px] text-zinc-500">this device</span>
              </div>
              <div className="text-xs text-zinc-400">
                Every day you open math_games adds one day to your streak
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <span className="font-mono text-3xl font-medium leading-none tabular-nums text-amber-300">
              {streak.current}
            </span>
            <div className="min-w-0">
              <div className="text-sm font-medium text-zinc-100">
                {streak.current === 1 ? "day" : "days"} in a row
              </div>
              <div className="text-[11px] text-zinc-400">
                {streak.lastVisit === dayKey()
                  ? "Today is counted — come back tomorrow to keep it going."
                  : "Open the site today to add a day."}
              </div>
            </div>
            <Flame
              aria-hidden="true"
              className="ml-auto h-7 w-7 shrink-0 fill-amber-400/20 text-amber-300"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => void handleShareStreak()}
              disabled={sharingStreak}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/[0.06] hover:text-white disabled:cursor-wait disabled:opacity-60"
            >
              <Download aria-hidden="true" className="h-3.5 w-3.5" />
              <span>{sharingStreak ? "Building card…" : "Share streak card"}</span>
            </button>
            {streakMilestone && (
              <span className="font-mono text-[11px] text-amber-300/80">
                {streakMilestone.name} unlocked
              </span>
            )}
          </div>
          {streakShareNote && (
            <p role="status" aria-live="polite" className="text-[11px] leading-relaxed text-zinc-400">
              {streakShareNote}
            </p>
          )}

          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-white/[0.02] p-3 ring-1 ring-inset ring-white/[0.06]">
              <div className="flex items-center gap-1 text-[11px] font-medium text-zinc-500">
                <Trophy aria-hidden="true" className="h-3 w-3 text-zinc-500" />
                Longest streak
              </div>
              <div className="mt-1 font-mono text-lg font-medium  text-zinc-100">
                {streak.longest.toLocaleString("en-US")}
                <span className="ml-1 text-xs font-normal text-zinc-500">
                  {streak.longest === 1 ? "day" : "days"}
                </span>
              </div>
            </div>
            <div className="rounded-xl bg-white/[0.02] p-3 ring-1 ring-inset ring-white/[0.06]">
              <div className="flex items-center gap-1 text-[11px] font-medium text-zinc-500">
                <CalendarDays aria-hidden="true" className="h-3 w-3 text-zinc-500" />
                Total days
              </div>
              <div className="mt-1 font-mono text-lg font-medium  text-zinc-100">
                {streak.totalDays.toLocaleString("en-US")}
                <span className="ml-1 text-xs font-normal text-zinc-500">visited</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white/[0.02] p-3 ring-1 ring-inset ring-white/[0.06]">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-medium text-zinc-200">Milestones</span>
              <span className="text-[11px] text-zinc-500">
                {nextMilestone
                  ? `${nextMilestone.days - streak.current} more ${nextMilestone.days - streak.current === 1 ? "day" : "days"} to ${nextMilestone.name}`
                  : "Every milestone unlocked"}
              </span>
            </div>
            <div className="mt-2 grid grid-cols-4 gap-1.5">
              {STREAK_MILESTONES.map((milestone) => {
                const reached = streak.current >= milestone.days;
                const upcoming = nextMilestone?.days === milestone.days;
                return (
                  <div
                    key={milestone.days}
                    title={milestone.blurb}
                    aria-label={`${milestone.days}-day milestone: ${milestone.name}${reached ? ", unlocked" : ""}`}
                    className={`flex flex-col items-center gap-0.5 rounded-lg px-1 py-1.5 text-center ring-1 ring-inset ${
                      reached
                        ? "bg-amber-400/[0.07] ring-amber-400/20"
                        : upcoming
                          ? "bg-white/[0.04] ring-white/15"
                          : "bg-white/[0.02] ring-white/[0.06]"
                    }`}
                  >
                    <Flame
                      aria-hidden="true"
                      className={`h-3.5 w-3.5 ${reached ? "fill-amber-400/30 text-amber-300" : "text-zinc-600"}`}
                    />
                    <span
                      className={`font-mono text-xs font-medium tabular-nums ${
                        reached ? "text-amber-200" : "text-zinc-400"
                      }`}
                    >
                      {milestone.days}
                    </span>
                    <span
                      className={`w-full truncate text-[11px] ${
                        reached ? "text-amber-200/80" : "text-zinc-500"
                      }`}
                    >
                      {milestone.name}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-zinc-500">
              Milestones belong to the current run, so a missed day starts them over from 1.
            </p>
          </div>

          <div className="rounded-xl bg-white/[0.02] p-3 ring-1 ring-inset ring-white/[0.06]">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-medium text-zinc-200">Last 30 days</span>
              <span className="text-[11px] text-zinc-500">{streakDaysVisited} visited</span>
            </div>
            <div
              role="img"
              aria-label={`${streakDaysVisited} of the last 30 days visited`}
              className="mt-2 grid grid-cols-10 gap-1"
            >
              {streakDays.map((day) => (
                <span
                  key={day.key}
                  aria-hidden="true"
                  title={`${day.label} — ${day.visited ? "visited" : "missed"}${
                    day.today ? " (today)" : ""
                  }`}
                  className={`h-4 rounded-[4px] ${day.visited ? "bg-amber-400/80" : "bg-white/[0.05]"} ${
                    day.today ? "ring-1 ring-inset ring-white/70" : ""
                  }`}
                />
              ))}
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-zinc-500">
              {streak.lastVisit
                ? `Last visit ${new Date(`${streak.lastVisit}T00:00:00`).toLocaleDateString()}. `
                : "No visit recorded yet. "}
              Streaks stay in this browser; a hard reset clears them.
            </p>
          </div>
        </section>
        </div>

        {/* Mobile-only shortcuts live on the settings menu, not inside a pane. */}
        {!isDesktop && !mobileSection && (
        <section className="flex flex-col gap-2 border-t border-white/[0.08] pt-3 sm:hidden" aria-labelledby="classroom-tools-title">
          <h3 id="classroom-tools-title" className="text-base font-medium text-zinc-100">
            Classroom tools
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onReportBug();
              }}
              style={CHIP_STYLE}
              className="inline-flex cursor-pointer items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/[0.08] hover:text-white"
            >
              <Bug aria-hidden="true" className="h-3.5 w-3.5 text-amber-400" />
              <span>Report Bug</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenAdmin();
              }}
              style={CHIP_STYLE}
              className="inline-flex cursor-pointer items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/[0.08] hover:text-white"
            >
              <Shield aria-hidden="true" className="h-3.5 w-3.5 text-zinc-500" />
              <span>Admin</span>
            </button>
            <a
              href="mailto:games@mathclass.uk?subject=math_games%20support"
              style={CHIP_STYLE}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/[0.08] hover:text-white"
            >
              <Mail aria-hidden="true" className="h-3.5 w-3.5 text-amber-400" />
              <span>Email support</span>
            </a>
          </div>
        </section>
        )}

        {/* Security: Site Lock */}
        <div style={paneStyle("security")}>
        <section
          aria-labelledby="site-lock-title"
          className="flex flex-col gap-3 border-t border-white/[0.08] pt-3"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div
                style={ICON_TILE}
                className="p-1.5 text-zinc-300"
              >
                <Lock
                  aria-hidden="true"
                  className={`w-4 h-4 ${siteLockEnabled ? "text-emerald-400" : "text-zinc-400"}`}
                />
              </div>
              <div>
                <div className="flex items-center gap-2 text-base font-medium text-zinc-100">
                  <span id="site-lock-title">Site lock (classroom mode)</span>
                  <span className={`font-mono text-[11px] ${siteLockEnabled ? "text-emerald-400" : "text-zinc-500"}`}>
                    {siteLockEnabled ? "on" : "off"}
                  </span>
                </div>
                <div className="text-xs text-zinc-400">
                  Require a password on refresh to access the site
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleToggleLock}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-150 ease-out ease-out ${
                siteLockEnabled ? "bg-emerald-600" : "bg-zinc-700"
              }`}
              role="switch"
              aria-checked={siteLockEnabled}
              aria-label="Site Lock"
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-transform duration-150 ease-out ease-out ${
                  siteLockEnabled ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div
            style={{
              borderRadius: 12,
              background: "rgba(255, 255, 255, 0.02)",
              boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.06)",
              padding: "12px",
            }}
            className="flex flex-col gap-3"
          >
            <form onSubmit={handleSaveLock} className="flex flex-col gap-2">
              <label
                htmlFor="site-lock-password"
                className="text-[11px] font-medium text-zinc-400"
              >
                Classroom password
              </label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative flex-1">
                  <Key
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500"
                  />
                  <input
                    id="site-lock-password"
                    name="classroomPassword"
                    type={showPassword ? "text" : "password"}
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      if (lockError) setLockError("");
                    }}
                    placeholder="Set classroom password…"
                    autoComplete="new-password"
                    spellCheck={false}
                    aria-invalid={lockError ? true : undefined}
                    aria-describedby="site-lock-hint"
                    style={{
                      borderRadius: 8,
                      background: "rgba(255, 255, 255, 0.04)",
                      boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.06)",
                    }}
                    className="w-full py-1.5 pl-9 pr-9 font-mono text-xs text-zinc-100 transition-colors placeholder:text-zinc-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer rounded p-0.5 text-zinc-500 transition-colors hover:text-zinc-300"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff aria-hidden="true" className="w-3.5 h-3.5" />
                    ) : (
                      <Eye aria-hidden="true" className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="inline-flex cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-zinc-950 transition-colors hover:bg-zinc-100"
                  >
                    {lockSaved ? (
                      <Check aria-hidden="true" className="w-3.5 h-3.5 text-emerald-700" />
                    ) : (
                      <ShieldCheck aria-hidden="true" className="w-3.5 h-3.5 text-zinc-900" />
                    )}
                    <span>{lockSaved ? "Saved" : "Save Password"}</span>
                  </button>

                  {siteLockEnabled && passwordInput.trim() && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onLockNow();
                      }}
                      style={CHIP_STYLE}
                      className="inline-flex cursor-pointer items-center justify-center gap-1 whitespace-nowrap px-3 py-1.5 text-xs font-medium text-zinc-400 transition-colors hover:bg-white/[0.08] hover:text-white"
                      title="Lock the site now to test the password screen"
                    >
                      <Lock aria-hidden="true" className="w-3 h-3" />
                      <span>Lock Now</span>
                    </button>
                  )}
                </div>
              </div>

              {lockError && (
                <p role="alert" className="text-xs font-medium text-red-400">
                  {lockError}
                </p>
              )}

              <p id="site-lock-hint" className="text-[11px] leading-normal text-zinc-500">
                When enabled, opening or refreshing the site shows a class password screen first.
              </p>
            </form>
          </div>
        </section>
        </div>

        {/* Appearance: Background style */}
        <div style={paneStyle("appearance")}>
        <section className="flex flex-col gap-3 border-t border-white/[0.08] pt-3" aria-labelledby="background-controls-title">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div
                style={ICON_TILE}
                className="p-1.5 text-zinc-300"
              >
                <Palette aria-hidden="true" className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2 text-base font-medium text-zinc-100">
                  <span id="background-controls-title">Background style</span>
                  {bgNotice && (
                    <span className="font-mono text-[11px] text-emerald-400 animate-enter">{bgNotice}</span>
                  )}
                </div>
                <div className="text-xs text-zinc-400">
                  What sits behind the hub.
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              borderRadius: 12,
              background: "rgba(255, 255, 255, 0.02)",
              boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.06)",
              padding: "12px",
            }}
            className="flex flex-col gap-3"
          >
            {/* Background Category Tabs */}
            <div className="flex items-center gap-1.5 rounded-xl bg-white/[0.03] p-1 ring-1 ring-inset ring-white/[0.06]">
              <button
                type="button"
                onClick={() => setBgTab("shader")}
                className={`flex-1 rounded-lg py-1.5 text-xs font-medium transition cursor-pointer ${
                  bgTab === "shader"
                    ? "bg-white/[0.12] text-white ring-1 ring-inset ring-white/10"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
                }`}
              >
                Halftone Shader
              </button>
              <button
                type="button"
                onClick={() => setBgTab("solid")}
                className={`flex-1 rounded-lg py-1.5 text-xs font-medium transition cursor-pointer ${
                  bgTab === "solid"
                    ? "bg-white/[0.12] text-white ring-1 ring-inset ring-white/10"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
                }`}
              >
                Solid Colors
              </button>
              <button
                type="button"
                onClick={() => setBgTab("gradient")}
                className={`flex-1 rounded-lg py-1.5 text-xs font-medium transition cursor-pointer ${
                  bgTab === "gradient"
                    ? "bg-white/[0.12] text-white ring-1 ring-inset ring-white/10"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
                }`}
              >
                Gradients
              </button>
            </div>

            {/* TAB 1: Shader */}
            {bgTab === "shader" && (
              <div className="flex flex-col gap-2">
                {BACKGROUND_PRESETS.filter((p) => p.type === "shader").map((preset) => {
                  const isSelected = bgConfig.type === "shader" && bgConfig.id === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      className={`flex items-center justify-between gap-3 rounded-xl p-2.5 text-left transition cursor-pointer ${
                        isSelected
                          ? "bg-white/[0.07] ring-1 ring-emerald-400/60"
                          : "bg-white/[0.03] ring-1 ring-white/[0.06] hover:bg-white/[0.06]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          style={{
                            background: preset.preview,
                            borderRadius: 8,
                            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.2), 0 2px 6px rgba(0,0,0,0.4)",
                          }}
                          className="h-10 w-10 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2 text-xs font-medium text-zinc-100">
                            <span>{preset.name}</span>
                          </div>
                          <div className="text-[11px] text-zinc-400">{preset.description}</div>
                        </div>
                      </div>
                      {isSelected ? (
                        <span className="inline-flex items-center gap-1 font-mono text-[11px] text-emerald-400">
                          <Check className="w-3 h-3" />
                          active
                        </span>
                      ) : (
                        <span className="text-[11px] text-zinc-500 hover:text-zinc-300">Select</span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* TAB 2: Solid Colors */}
            {bgTab === "solid" && (
              <div className="flex flex-col gap-2.5">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {BACKGROUND_PRESETS.filter((p) => p.type === "solid").map((preset) => {
                    const isSelected = bgConfig.type === "solid" && bgConfig.id === preset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleSelectPreset(preset)}
                        className={`flex items-center gap-2.5 rounded-xl p-2 text-left transition cursor-pointer ${
                          isSelected
                            ? "bg-white/[0.07] ring-1 ring-emerald-400/60"
                            : "bg-white/[0.03] ring-1 ring-white/[0.06] hover:bg-white/[0.06]"
                        }`}
                      >
                        <div
                          style={{
                            background: preset.preview,
                            borderRadius: 8,
                            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.15), 0 2px 4px rgba(0,0,0,0.4)",
                          }}
                          className="h-6 w-6 shrink-0 relative flex items-center justify-center"
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-xs font-medium text-zinc-200">{preset.name}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Custom Color Input */}
                <div className="flex items-center gap-2 border-t border-white/[0.06] pt-2">
                  <div className="relative flex items-center gap-1.5 flex-1 min-w-0">
                    <input
                      type="color"
                      value={customSolidHex}
                      onChange={(e) => {
                        setCustomSolidHex(e.target.value);
                        handleApplyCustomSolid(e.target.value);
                      }}
                      className="h-7 w-7 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                      title="Pick custom color"
                    />
                    <input
                      type="text"
                      value={customSolidHex}
                      onChange={(e) => setCustomSolidHex(e.target.value)}
                      placeholder="#09090b"
                      maxLength={7}
                      className="flex-1 rounded-lg bg-white/[0.04] px-2.5 py-1 font-mono text-xs text-zinc-100 ring-1 ring-inset ring-white/[0.08] focus:outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleApplyCustomSolid(customSolidHex)}
                    className="cursor-pointer rounded-lg bg-white px-3 py-1 text-xs font-medium text-zinc-950 transition-colors hover:bg-zinc-100"
                  >
                    Set Color
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: Gradients */}
            {bgTab === "gradient" && (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {BACKGROUND_PRESETS.filter((p) => p.type === "gradient").map((preset) => {
                  const isSelected = bgConfig.type === "gradient" && bgConfig.id === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      className={`flex flex-col gap-1.5 rounded-xl p-2 text-left transition cursor-pointer ${
                        isSelected
                          ? "bg-white/[0.1] ring-2 ring-emerald-400/80 shadow-[0_4px_16px_rgba(0,0,0,0.5)]"
                          : "bg-white/[0.03] ring-1 ring-white/[0.06] hover:bg-white/[0.06]"
                      }`}
                    >
                      <div
                        style={{
                          background: preset.preview,
                          borderRadius: 8,
                          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.15), 0 2px 6px rgba(0,0,0,0.5)",
                        }}
                        className="h-10 w-full relative flex items-center justify-center overflow-hidden"
                      >
                        {isSelected && (
                          <span className="rounded-md bg-black/60 p-1 text-emerald-400">
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                      <div className="truncate text-xs font-medium text-zinc-200">{preset.name}</div>
                      <div className="truncate text-[11px] text-zinc-500">{preset.description}</div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          {/* System font (Typography) */}
          <div className="flex flex-col gap-3 border-t border-white/[0.08] pt-4 mt-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div
                  style={ICON_TILE}
                  className="p-1.5 text-zinc-300"
                >
                  <Type aria-hidden="true" className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2 text-base font-medium text-zinc-100">
                    <span>System font</span>
                    {fontNotice && (
                      <span className="font-mono text-[11px] text-emerald-400 animate-enter">{fontNotice}</span>
                    )}
                  </div>
                  <div className="text-xs text-zinc-400">
                    Pick a typeface for the whole hub.
                  </div>
                </div>
              </div>

              {currentFontId !== "geist" && (
                <button
                  type="button"
                  onClick={() => handleSelectFont("geist")}
                  style={CHIP_STYLE}
                  className="inline-flex cursor-pointer items-center gap-1 px-2.5 py-1 text-xs text-zinc-400 transition hover:bg-white/[0.08] hover:text-white"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Reset to default</span>
                </button>
              )}
            </div>

            <div
              style={{
                borderRadius: 12,
                background: "rgba(255, 255, 255, 0.02)",
                boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.06)",
                padding: "12px",
              }}
              className="flex flex-col gap-3"
            >
              {/* Active Font Preview Card */}
              <div
                style={{
                  borderRadius: 8,
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.07)",
                  padding: "12px 14px",
                  fontFamily: SYSTEM_FONTS.find((f) => f.id === currentFontId)?.family,
                }}
                className="flex flex-col gap-1 transition-colors duration-150"
              >
                <div className="flex items-center justify-between text-[11px] font-sans text-zinc-500">
                  <span>Live preview</span>
                  <span className="font-mono text-zinc-400">
                    {SYSTEM_FONTS.find((f) => f.id === currentFontId)?.name}
                  </span>
                </div>
                <div className="text-sm font-medium text-zinc-100 sm:text-base">
                  The quick brown fox jumps over 1337 unblocked math games.
                </div>
                <div className="text-xs text-zinc-400">
                  0 1 2 3 4 5 6 7 8 9 · High Scores · Polytrack Speedway · Level Complete
                </div>
              </div>

              {/* Category Filter Chips */}
              <div className="flex flex-wrap items-center gap-1.5">
                {["all", "Standard", "Retro Gaming", "Sci-Fi", "Playful", "School", "Developer", "Unique"].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFontFilter(cat)}
                    className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition cursor-pointer ${
                      fontFilter === cat
                        ? "bg-white/[0.12] text-white ring-1 ring-inset ring-white/10"
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
                    }`}
                  >
                    {cat === "all" ? "All Styles" : cat}
                  </button>
                ))}
              </div>

              {/* Font Options Grid */}
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {SYSTEM_FONTS.filter((f) => fontFilter === "all" || f.category === fontFilter).map((font) => {
                  const isSelected = currentFontId === font.id;
                  return (
                    <button
                      key={font.id}
                      type="button"
                      onClick={() => handleSelectFont(font.id)}
                      className={`flex flex-col gap-1.5 rounded-xl p-3 text-left transition cursor-pointer ${
                        isSelected
                          ? "bg-white/[0.07] ring-1 ring-emerald-400/60"
                          : "bg-white/[0.03] ring-1 ring-white/[0.06] hover:bg-white/[0.06]"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="truncate text-xs font-medium text-zinc-100">{font.name}</span>
                          {font.badge && (
                            <span className="shrink-0 font-mono text-[11px] text-zinc-500">{font.badge}</span>
                          )}
                        </div>
                        {isSelected ? (
                          <span className="shrink-0 rounded bg-emerald-500/15 p-0.5 text-emerald-400">
                            <Check className="h-3 w-3" />
                          </span>
                        ) : (
                          <span className="shrink-0 text-[11px] text-zinc-500">{font.category}</span>
                        )}
                      </div>
                      <div
                        style={{ fontFamily: font.family }}
                        className="rounded-lg bg-white/[0.03] px-2 py-1.5 text-xs text-zinc-200 truncate"
                      >
                        {font.sample}
                      </div>
                      <div className="text-[11px] text-zinc-400 line-clamp-1">{font.description}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
        </div>

        {/* Notifications: chat messages and new games */}
        <div style={paneStyle("notifications")}>
        <section className="flex flex-col gap-3 border-t border-white/[0.08] pt-3" aria-labelledby="notifications-title">
          <div className="flex items-center gap-2">
            <div
              style={ICON_TILE}
              className="p-1.5 text-zinc-300"
            >
              <Bell
                aria-hidden="true"
                className={`w-4 h-4 ${notificationsOn || chatNotificationsOn ? "text-emerald-400" : "text-zinc-400"}`}
              />
            </div>
            <div>
              <div className="flex items-center gap-2 text-base font-medium text-zinc-100">
                <span id="notifications-title">Notification settings</span>
              </div>
              <div className="text-xs text-zinc-400">
                Alerts for live chat and new games.
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-xs text-zinc-400">
            <ShieldAlert aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-zinc-500" />
            Install the app first. Notifications need it.
          </div>

          {/* Option: Notify me when new chat message */}
          <div className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
            <div>
              <div className="text-sm font-medium text-zinc-200">Notify me when new chat message</div>
              <div className="text-xs text-zinc-400">Get browser notifications when other racers post in live chat</div>
            </div>
            <button
              type="button"
              onClick={handleToggleChatNotifications}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-150 ease-out ease-out ${
                chatNotificationsOn ? "bg-emerald-600" : "bg-zinc-700"
              }`}
              role="switch"
              aria-checked={chatNotificationsOn}
              aria-label="Notify me when new chat message"
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-transform duration-150 ease-out ease-out ${
                  chatNotificationsOn ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Option: New game notifications */}
          <div className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-zinc-200">
                <span>New game notifications</span>
                <span
                  className={`font-mono text-[11px] ${
                    notificationsOn
                      ? "text-emerald-400"
                      : permission === "denied"
                        ? "text-red-300"
                        : "text-zinc-500"
                  }`}
                >
                  {notificationStatusLabel}
                </span>
              </div>
              <div className="text-xs text-zinc-400">
                Get an alert when a new game drops
              </div>
            </div>

            <button
              type="button"
              onClick={handleToggleNotifications}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-150 ease-out ease-out ${
                notificationsOn ? "bg-emerald-600" : "bg-zinc-700"
              }`}
              role="switch"
              aria-checked={notificationsOn}
              aria-label="New game notifications"
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-transform duration-150 ease-out ease-out ${
                  notificationsOn ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {notificationError && (
            <p role="alert" className="text-xs font-medium text-red-400">
              {notificationError}
            </p>
          )}

          {!notificationError && notificationNotice && (
            <p role="status" className="text-xs font-medium text-emerald-400">
              {notificationNotice}
            </p>
          )}

          <p className="text-[11px] leading-normal text-zinc-500">
            {permission === "denied"
              ? "Your browser is blocking notifications for this site. Re-allow them in the site settings next to the address bar."
              : "Alerts are sent once per new version of the site. Settings are stored on this device only."}
          </p>
        </section>
        </div>

        {/* Offline access: downloaded copy and schedule */}
        <div style={paneStyle("offline")}>
        <section className="flex flex-col gap-3 border-t border-white/[0.08] pt-3" aria-labelledby="offline-title">
          <div className="flex items-start gap-2">
            <div
              style={ICON_TILE}
              className="p-1.5"
            >
              <Download
                aria-hidden="true"
                className={`w-4 h-4 ${offlineStatus?.cachedFiles ? "text-emerald-400" : "text-zinc-400"}`}
              />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-base font-medium text-zinc-100">
                <span id="offline-title">Offline copy</span>
                {offlineStatus?.cachedFiles ? (
                  <span className="font-mono text-[11px] text-emerald-400">downloaded</span>
                ) : null}
              </div>
              <div className="text-xs text-zinc-400">
                Download the hub and its games so they open without a connection
              </div>
            </div>
          </div>

          {!offlineSupported() ? (
            <p role="alert" className="text-xs font-medium text-red-400">
              This browser cannot store an offline copy. Try Chrome, Edge, Firefox or Safari over HTTPS.
            </p>
          ) : (
            <>
              <div className="flex flex-col gap-3 rounded-xl bg-white/[0.02] p-3 ring-1 ring-inset ring-white/[0.06]">
                <div className="flex flex-col gap-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-xs font-medium text-zinc-200">
                      {offlineBusy && offlineProgress
                        ? `Caching ${offlineProgress.done} of ${offlineProgress.total || "…"} files…`
                        : offlineStatus?.cachedFiles
                          ? `${offlineStatus.cachedFiles} files · ${formatBytes(offlineStatus.bytes)}`
                          : "No offline copy on this device."}
                    </span>
                    {offlineStatus?.cachedAt && !offlineBusy ? (
                      <span className="text-[11px] text-zinc-500">
                        Downloaded {new Date(offlineStatus.cachedAt).toLocaleString()}
                      </span>
                    ) : null}
                  </div>

                  {offlineBusy && offlineProgress && (
                    <div
                      role="progressbar"
                      aria-label="Offline download progress"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={offlinePercent}
                      className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.08]"
                    >
                      <div
                        className="h-full rounded-full bg-emerald-500 transition-[width] duration-200"
                        style={{ width: `${offlinePercent}%` }}
                      />
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleDownloadOffline}
                    disabled={offlineBusy}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-zinc-950 transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Download aria-hidden="true" className="h-3.5 w-3.5" />
                    <span>
                      {offlineBusy
                        ? "Downloading…"
                        : offlineStatus?.cachedFiles
                          ? "Update offline copy"
                          : "Download for offline"}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteOffline}
                    disabled={offlineBusy || (!offlineStatus?.cachedFiles && !offlineSchedule.requested)}
                    style={CHIP_STYLE}
                    className="inline-flex cursor-pointer items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-300 transition-colors hover:bg-white/[0.08] hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Trash2 aria-hidden="true" className="h-3.5 w-3.5" />
                    <span>Delete cache</span>
                  </button>
                </div>

                <p className="text-[11px] leading-relaxed text-zinc-500">
                  Keep this page open while the download runs. The site has to be reachable once to download it; after
                  that, cached pages open without a connection.
                </p>
              </div>

              <div className="flex flex-col gap-2 rounded-xl bg-white/[0.02] p-3 ring-1 ring-inset ring-white/[0.06]">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 text-sm font-medium text-zinc-200">
                      <Clock aria-hidden="true" className="h-3.5 w-3.5 text-zinc-500" />
                      <span>Auto-use cached backup</span>
                      <span className="font-mono text-[11px] text-zinc-500">advanced</span>
                    </div>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-zinc-500">
                      Use the downloaded copy first between these times, even when the current network blocks a page.
                    </p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-label="Auto-use cached backup"
                    aria-checked={offlineSchedule.scheduleEnabled}
                    onClick={handleToggleOfflineSchedule}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors ${offlineSchedule.scheduleEnabled ? "bg-emerald-600" : "bg-zinc-700"}`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${offlineSchedule.scheduleEnabled ? "translate-x-5" : "translate-x-0"}`}
                    />
                  </button>
                </div>

                <div className="flex items-end gap-2">
                  <label className="flex min-w-0 flex-1 flex-col gap-1.5 text-[11px] font-medium text-zinc-400">
                    From
                    <input
                      type="time"
                      value={offlineSchedule.startTime}
                      onChange={(event) => handleOfflineTimeChange("startTime", event.target.value)}
                      className="w-full rounded-lg bg-white/[0.04] px-2.5 py-1.5 font-mono text-xs text-zinc-100 ring-1 ring-inset ring-white/[0.08] focus:outline-none"
                    />
                  </label>
                  <span className="pb-2 text-xs text-zinc-500">to</span>
                  <label className="flex min-w-0 flex-1 flex-col gap-1.5 text-[11px] font-medium text-zinc-400">
                    To
                    <input
                      type="time"
                      value={offlineSchedule.endTime}
                      onChange={(event) => handleOfflineTimeChange("endTime", event.target.value)}
                      className="w-full rounded-lg bg-white/[0.04] px-2.5 py-1.5 font-mono text-xs text-zinc-100 ring-1 ring-inset ring-white/[0.08] focus:outline-none"
                    />
                  </label>
                </div>

                <p className="text-[11px] leading-relaxed text-zinc-500">
                  Overnight windows work too, for example 22:00 to 07:00. The schedule only applies after the offline
                  copy has been downloaded.
                </p>
              </div>

              <div className="flex flex-col gap-2 rounded-xl bg-white/[0.02] p-3 ring-1 ring-inset ring-white/[0.06]">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 text-sm font-medium text-zinc-200">
                      <Gamepad2 aria-hidden="true" className="h-3.5 w-3.5 text-zinc-500" />
                      <span>Per-game offline packs</span>
                    </div>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-zinc-500">
                      Download only the games you want. They appear in the catalog&rsquo;s Offline filter when you have
                      no connection.
                    </p>
                  </div>
                  {downloadedPacks.length > 0 && (
                    <button
                      type="button"
                      onClick={handleDeleteAllPacks}
                      disabled={packBusyId !== null}
                      className="shrink-0 cursor-pointer rounded-lg px-2.5 py-1 text-[11px] font-medium text-red-300 transition-colors hover:bg-white/[0.06] hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Remove all
                    </button>
                  )}
                </div>

                <div className="relative">
                  <label htmlFor="offline-pack-search" className="sr-only">
                    Search games you can download
                  </label>
                  <Search
                    aria-hidden="true"
                    className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500"
                  />
                  <input
                    id="offline-pack-search"
                    type="search"
                    value={packQuery}
                    onChange={(event) => setPackQuery(event.target.value)}
                    placeholder="Search games to download…"
                    autoComplete="off"
                    spellCheck={false}
                    className="w-full rounded-lg bg-white/[0.04] py-1.5 pl-8 pr-3 text-xs text-zinc-100 ring-1 ring-inset ring-white/[0.08] placeholder:text-zinc-500 focus:outline-none"
                  />
                </div>

                {packProgress && (
                  <div role="status" className="flex flex-col gap-1">
                    <span className="text-[11px] text-zinc-400">
                      Saving {packProgress.name}: {packProgress.done}/{packProgress.total} files ·{" "}
                      {formatPackSize(packProgress.bytes)}
                    </span>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.08]">
                      <div
                        className="h-full rounded-full bg-emerald-500 transition-[width] duration-200"
                        style={{
                          width: `${packProgress.total ? Math.round((packProgress.done / packProgress.total) * 100) : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {packError && (
                  <p role="alert" className="text-[11px] font-medium text-red-400">
                    {packError}
                  </p>
                )}
                {packNotice && (
                  <p role="status" className="text-[11px] text-emerald-300">
                    {packNotice}
                  </p>
                )}

                <div
                  onScroll={handlePackListScroll}
                  className="flex max-h-64 flex-col divide-y divide-white/[0.05] overflow-y-auto"
                >
                  {filteredGamePacks.length === 0 ? (
                    <p className="py-2 text-[11px] text-zinc-500">
                      {gamePacks.length ? "No game matches that search." : "No downloadable games are listed yet."}
                    </p>
                  ) : (
                    filteredGamePacks.map((pack) => {
                      const installed = downloadedPackIds.has(pack.gameId);
                      const busy = packBusyId === pack.gameId;
                      return (
                        <div key={pack.gameId} className="flex items-center gap-2 py-1.5">
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-xs text-zinc-200">{pack.name}</span>
                            <span className="block text-[11px] text-zinc-500">
                              {formatPackSize(pack.bytes)} · {pack.files.length}{" "}
                              {pack.files.length === 1 ? "file" : "files"}
                              {installed ? " · saved" : ""}
                            </span>
                          </span>
                          {installed ? (
                            <button
                              type="button"
                              onClick={() => handleDeletePack(pack)}
                              disabled={busy}
                              className="inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-medium text-red-300 transition-colors hover:bg-white/[0.06] hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <Trash2 aria-hidden="true" className="h-3 w-3" />
                              <span>{busy ? "Removing…" : "Remove"}</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleDownloadPack(pack)}
                              disabled={packBusyId !== null}
                              className="inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium text-zinc-400 transition-colors hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <Download aria-hidden="true" className="h-3 w-3" />
                              <span>{busy ? "Saving…" : "Download"}</span>
                            </button>
                          )}
                        </div>
                      );
                    })
                  )}
                  {showMoreGamePacks && (
                    <button
                      type="button"
                      onClick={loadMoreGamePacks}
                      className="mt-1 shrink-0 cursor-pointer rounded-lg px-2.5 py-1.5 text-[11px] font-medium text-zinc-300 transition-colors hover:bg-white/[0.06] hover:text-white"
                    >
                      Load more games ({matchingGamePacks.length - filteredGamePacks.length} left)
                    </button>
                  )}
                </div>

                <p className="text-[11px] leading-relaxed text-zinc-500">
                  {downloadedPacks.length} game{downloadedPacks.length === 1 ? "" : "s"} saved for offline play on
                  this device. Removing a pack only deletes its files, not your progress in the game.
                </p>
              </div>
            </>
          )}

          {offlineError && (
            <p role="alert" className="text-xs font-medium text-red-400">
              {offlineError}
            </p>
          )}
          {!offlineError && offlineNotice && (
            <p role="status" className="text-xs font-medium text-emerald-400">
              {offlineNotice}
            </p>
          )}
        </section>
        </div>

        {/* Appearance: browser tab */}
        <div style={paneStyle("cloak")}>
        <section className="flex flex-col gap-3 border-t border-white/[0.08] pt-3" aria-labelledby="tab-cloak-title">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 id="tab-cloak-title" className="hidden text-base font-medium text-zinc-100 md:block">
                Custom tab cloaking
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                Change the name and icon shown in this browser tab.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-label="Enable custom tab cloaking"
              aria-checked={tabCloakEnabled}
              onClick={() => setTabCloakEnabled((enabled) => !enabled)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors ${tabCloakEnabled ? "bg-emerald-600" : "bg-zinc-700"}`}
            >
              <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${tabCloakEnabled ? "translate-x-5" : "translate-x-0"}`} />
            </button>
          </div>

          <form onSubmit={handleSaveTabCloak} className="flex flex-col gap-3 rounded-xl bg-white/[0.02] p-3 ring-1 ring-inset ring-white/[0.06]">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="tab-cloak-title-input" className="text-[11px] font-medium text-zinc-400">
                Tab name
              </label>
              <input
                id="tab-cloak-title-input"
                type="text"
                value={tabTitle}
                onChange={(event) => setTabTitle(event.target.value)}
                placeholder="For example, Google Classroom…"
                maxLength={80}
                autoComplete="off"
                spellCheck={false}
                className="w-full rounded-lg bg-white/[0.04] px-3 py-2 text-xs text-zinc-100 ring-1 ring-inset ring-white/[0.08] placeholder:text-zinc-500 focus:outline-none"
              />
            </div>

            <fieldset className="flex flex-col gap-1.5">
              <legend className="text-[11px] font-medium text-zinc-400">Tab icon</legend>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  aria-pressed={!customTabIcon}
                  onClick={() => {
                    setCustomTabIcon(false);
                    setTabCloakError("");
                  }}
                  className={`rounded-lg px-3 py-2 text-left text-xs ring-1 ring-inset transition-colors ${!customTabIcon ? "bg-white/[0.1] text-white ring-white/20" : "bg-white/[0.03] text-zinc-400 ring-white/[0.06] hover:text-white"}`}
                >
                  Default icon
                </button>
                <button
                  type="button"
                  aria-pressed={customTabIcon}
                  onClick={() => setCustomTabIcon(true)}
                  className={`rounded-lg px-3 py-2 text-left text-xs ring-1 ring-inset transition-colors ${customTabIcon ? "bg-white/[0.1] text-white ring-white/20" : "bg-white/[0.03] text-zinc-400 ring-white/[0.06] hover:text-white"}`}
                >
                  Custom icon URL
                </button>
              </div>
              {customTabIcon && (
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="tab-cloak-icon-url" className="sr-only">Custom tab icon URL</label>
                  <input
                    id="tab-cloak-icon-url"
                    type="url"
                    inputMode="url"
                    value={tabIconUrl}
                    onChange={(event) => setTabIconUrl(event.target.value)}
                    placeholder="https://example.com/favicon.ico…"
                    autoComplete="off"
                    spellCheck={false}
                    className="w-full rounded-lg bg-white/[0.04] px-3 py-2 font-mono text-xs text-zinc-100 ring-1 ring-inset ring-white/[0.08] placeholder:text-zinc-500 focus:outline-none"
                  />
                  {!tabIconUrl.trim() && tabCloakEnabled && (
                    <p className="text-[11px] leading-relaxed text-amber-200/80">Add an icon URL or select Default icon.</p>
                  )}
                </div>
              )}
            </fieldset>

            {tabCloakError && <p role="alert" className="text-xs font-medium text-red-400">{tabCloakError}</p>}
            <div className="flex items-center justify-between gap-3 border-t border-white/[0.06] pt-2">
              <p className="text-[11px] leading-relaxed text-zinc-500">Applies to this browser only.</p>
              <button type="submit" className="shrink-0 rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-zinc-950 transition-colors hover:bg-zinc-100">
                {tabCloakSaved ? "Saved" : "Save tab"}
              </button>
            </div>
          </form>
        </section>
        </div>

        {/* Safety: emergency redirect */}
        <div style={paneStyle("panic")}>
        <section
          aria-labelledby="panic-title"
          className="flex flex-col gap-3 border-t border-white/[0.08] pt-3"
        >
          <div className="flex items-center gap-2">
            <div
              style={ICON_TILE}
              className="p-1.5 text-zinc-300"
            >
              <ShieldAlert aria-hidden="true" className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-base font-medium text-zinc-100">
                <span id="panic-title">Panic redirect</span>
                <kbd className="rounded border border-zinc-700 bg-zinc-800 px-1.5 py-0.5 font-mono text-[11px] text-zinc-300">
                  ]
                </kbd>
              </div>
              <div className="truncate text-xs text-zinc-400">
                Press <span className="text-zinc-300">]</span> anywhere to leave this site
              </div>
            </div>
          </div>

          <div
            style={{
              borderRadius: 12,
              background: "rgba(255, 255, 255, 0.02)",
              boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.06)",
              padding: "12px",
            }}
            className="flex flex-col gap-2.5"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="text-[11px] font-medium text-zinc-400">Redirect presets</div>
              <div className="truncate text-[11px] text-zinc-500" title={panicUrl}>
                Panic opens {hostOf(panicUrl)}
              </div>
            </div>

            <div role="group" aria-label="Redirect presets" className="grid grid-cols-2 gap-1.5">
              {PANIC_PRESETS.map((preset) => {
                const selected = panicUrl === preset.url;
                return (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handleSavePanicUrl(preset.url)}
                    aria-pressed={selected}
                    style={CHIP_STYLE}
                    className={`flex cursor-pointer items-center justify-between px-3 py-1.5 text-xs transition-colors ${
                      selected
                        ? "bg-white/[0.12] font-medium text-white"
                        : "text-zinc-400 hover:bg-white/[0.06] hover:text-zinc-200"
                    }`}
                  >
                    <span className="truncate">{preset.name}</span>
                    {selected && (
                      <Check aria-hidden="true" className="ml-1 w-3 h-3 shrink-0 text-emerald-400" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2 border-t border-white/[0.06] pt-2">
              <label htmlFor="panic-url" className="sr-only">
                Custom redirect URL
              </label>
              <input
                id="panic-url"
                type="url"
                inputMode="url"
                value={customPanicInput}
                onChange={(e) => setCustomPanicInput(e.target.value)}
                placeholder="https://classroom.google.com…"
                autoComplete="off"
                spellCheck={false}
                style={{
                  borderRadius: 8,
                  background: "rgba(255, 255, 255, 0.04)",
                  boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.06)",
                }}
                className="min-w-0 flex-1 px-3 py-1.5 font-mono text-xs text-zinc-100 transition-colors placeholder:text-zinc-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => handleSavePanicUrl(customPanicInput)}
                className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-zinc-950 transition-colors hover:bg-zinc-100"
              >
                {panicSaved ? "Saved" : "Set Custom URL"}
              </button>
            </div>
          </div>
        </section>
        </div>

        {/* About: change log & update history */}
        <div style={paneStyle("changelog")}>
          <section aria-label="Change log & Update History" className="flex flex-col gap-4 border-t border-white/[0.08] pt-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div
                  style={ICON_TILE}
                  className="p-1.5 text-zinc-300"
                >
                  <History aria-hidden="true" className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2 text-base font-medium text-zinc-100">
                    <span>Update history</span>
                    <span style={CHIP_STYLE} className="px-2 py-0.5 font-mono text-[11px] text-[#caccd2]">
                      v{SITE_VERSION}
                    </span>
                  </div>
                  <div className="text-xs text-zinc-400">
                    Interactive activity grid tracking commits, engine updates, and releases
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onReportBug();
                  }}
                  style={CHIP_STYLE}
                  className="inline-flex cursor-pointer items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/[0.08] hover:text-white"
                >
                  <Bug aria-hidden="true" className="h-3.5 w-3.5 text-zinc-500" />
                  <span>Report bug</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenChangelog();
                  }}
                  style={CHIP_STYLE}
                  className="inline-flex cursor-pointer items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/[0.08] hover:text-white"
                >
                  <ScrollText aria-hidden="true" className="h-3.5 w-3.5 text-zinc-500" />
                  <span>Full dialog</span>
                </button>
              </div>
            </div>

          {/* Check for updates card */}
          <div
            style={{
              borderRadius: 12,
              background: "rgba(255, 255, 255, 0.025)",
              boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.07)",
            }}
            className="flex flex-col gap-2.5 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <div
                  style={{ borderRadius: 8, background: "rgba(255, 255, 255, 0.06)" }}
                  className="mt-0.5 shrink-0 p-1.5 text-zinc-300"
                >
                  <RefreshCw aria-hidden="true" className={`h-4 w-4 ${checkingUpdate ? "animate-spin" : ""}`} />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-zinc-100">Updates</span>
                    <span style={CHIP_STYLE} className="px-2 py-0.5 font-mono text-[11px] text-zinc-400">
                      v{SITE_VERSION}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-zinc-400">
                    See whether a newer build exists.
                  </p>
                </div>
              </div>
            </div>

            {hasUpdate ? (
              <div className="flex items-start gap-2.5 rounded-lg border border-white/[0.08] bg-white/[0.03] p-3 text-xs">
                <Download aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" />
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-zinc-100">
                    Update available {updateCheckResult?.latestVersion ? `(v${updateCheckResult.latestVersion})` : ""}
                  </div>
                  <div className="mt-0.5 text-[11px] text-zinc-400">
                    Reloads the page. Saves and progress stay.
                  </div>
                </div>
              </div>
            ) : updateCheckResult ? (
              <div className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-xs text-zinc-400">
                <CheckCircle2 aria-hidden="true" className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>Latest version, v{SITE_VERSION}.</span>
              </div>
            ) : null}

            {updateCheckResult?.error && (
              <p className="text-[11px] text-red-300">{updateCheckResult.error}</p>
            )}

            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              <button
                type="button"
                onClick={handleCheckForUpdates}
                disabled={checkingUpdate || updatingNow}
                style={CHIP_STYLE}
                className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-zinc-200 transition-colors hover:bg-white/[0.08] hover:text-white disabled:opacity-60"
              >
                <RefreshCw aria-hidden="true" className={`h-3.5 w-3.5 ${checkingUpdate ? "animate-spin text-zinc-300" : "text-zinc-400"}`} />
                <span>{checkingUpdate ? "Checking…" : updateCheckResult ? "Check again" : "Check for updates"}</span>
              </button>

              {hasUpdate && (
                <button
                  type="button"
                  onClick={handleUpdateNow}
                  disabled={updatingNow}
                  className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-white px-3.5 py-2 text-xs font-medium text-zinc-950 transition-colors hover:bg-zinc-200 disabled:cursor-wait"
                >
                  <Download aria-hidden="true" className="h-3.5 w-3.5" />
                  <span>{updatingNow ? "Updating…" : "Update now"}</span>
                </button>
              )}
            </div>
          </div>

            {/* GitHub Activity Grid Component following attached UI */}
            <GitHubActivityGrid
              days={activityDays}
              subtitle="commits & updates in the last year"
            />

            {/* Quick summary stats */}
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <div
                style={{
                  borderRadius: 12,
                  background: "rgba(255, 255, 255, 0.015)",
                  boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.06)",
                  padding: "10px 12px",
                }}
              >
                <div className="text-[11px]  text-zinc-500">Total Updates</div>
                <div className="mt-0.5 font-mono text-base font-medium text-zinc-100">
                  {activityDays.reduce((acc, d) => acc + d.count, 0)}
                </div>
              </div>
              <div
                style={{
                  borderRadius: 12,
                  background: "rgba(255, 255, 255, 0.015)",
                  boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.06)",
                  padding: "10px 12px",
                }}
              >
                <div className="text-[11px]  text-zinc-500">Active Days</div>
                <div className="mt-0.5 font-mono text-base font-medium text-zinc-200">
                  {activityDays.filter((d) => d.count > 0).length} days
                </div>
              </div>
              <div
                style={{
                  borderRadius: 12,
                  background: "rgba(255, 255, 255, 0.015)",
                  boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.06)",
                  padding: "10px 12px",
                }}
              >
                <div className="text-[11px]  text-zinc-500">Current Release</div>
                <div className="mt-0.5 font-mono text-base font-medium text-zinc-100">
                  v{SITE_VERSION}
                </div>
              </div>
              <div
                style={{
                  borderRadius: 12,
                  background: "rgba(255, 255, 255, 0.015)",
                  boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.06)",
                  padding: "10px 12px",
                }}
              >
                <div className="text-[11px]  text-zinc-500">Releases</div>
                <div className="mt-0.5 font-mono text-base font-medium text-zinc-100">
                  {CHANGELOG.length} versions
                </div>
              </div>
            </div>

            {/* Releases list */}
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between text-xs font-medium text-zinc-200">
                <span>Release notes</span>
                <span className="text-[11px] font-normal text-zinc-500">Latest changes</span>
              </div>
              <div className="flex max-h-72 flex-col gap-2.5 overflow-y-auto pr-1">
                {CHANGELOG.map((entry, index) => (
                  <div
                    key={entry.version}
                    style={{
                      borderRadius: 12,
                      background: "rgba(255, 255, 255, 0.015)",
                      boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.06)",
                      padding: "12px",
                    }}
                    className="flex flex-col gap-1.5"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-medium text-zinc-100">
                        v{entry.version}
                      </span>
                      {index === 0 && (
                        <span className="font-mono text-[11px] text-emerald-400">latest</span>
                      )}
                      <span className="text-[11px] text-zinc-500">{entry.date}</span>
                    </div>
                    <div className="text-xs font-medium text-zinc-300">{entry.title}</div>
                    <ul className="mt-0.5 flex flex-col gap-1">
                      {entry.changes.map((c) => (
                        <li key={c} className="flex gap-2 text-[11px] leading-relaxed text-[#9BA1AA]">
                          <span aria-hidden="true" className="mt-[6px] h-1 w-1 shrink-0 rounded-full bg-zinc-600" />
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* About: source code and proxy links */}
        <div style={paneStyle("proxies")}>
        <section aria-label="Source code and proxies" className="flex flex-col gap-3 border-t border-white/[0.08] pt-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="text-sm font-medium text-zinc-100">Source code</div>
              <p className="mt-0.5 text-[11px] leading-relaxed text-zinc-500">
                Read the code that runs this site.
              </p>
            </div>
            <a
              href="https://github.com/NOTAM-bobk/polytrack"
              target="_blank"
              rel="noopener noreferrer"
              style={CHIP_STYLE}
              className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/[0.08] hover:text-white"
            >
              <Github aria-hidden="true" className="h-3.5 w-3.5 text-zinc-400" />
              <span>View source code</span>
            </a>
          </div>

          <div
            style={{
              borderRadius: 12,
              background: "rgba(255, 255, 255, 0.02)",
              boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.06)",
              padding: "12px",
            }}
            className="flex flex-col gap-1.5"
          >
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-100">
              <Globe aria-hidden="true" className="h-3.5 w-3.5 text-zinc-500" />
              <span>More proxies of this site</span>
            </div>
            <p className="text-[11px] leading-relaxed text-zinc-400">
              Mirror and backup locations for this site.
            </p>
            <div ref={proxySectionRef} className="mt-1 flex flex-col gap-2">
              <div className="flex flex-wrap gap-1.5">
                {SITE_MIRRORS.map((mirror) => {
                  const status = proxyStatus[mirror.url] || "idle";
                  const statusLabel =
                    status === "checking"
                      ? "Checking…"
                      : status === "reachable"
                        ? "Reachable"
                        : status === "blocked"
                          ? "Blocked"
                          : "Not checked";
                  return (
                    <a
                      key={mirror.url}
                      href={mirror.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`${mirror.url} — ${statusLabel}`}
                      style={CHIP_STYLE}
                      className="inline-flex cursor-pointer items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-zinc-300 transition-colors hover:bg-white/[0.08] hover:text-white"
                    >
                      <Globe aria-hidden="true" className="h-3 w-3 shrink-0 text-zinc-500" />
                      <span className="truncate">{mirror.name}</span>
                      <span
                        aria-hidden="true"
                        className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                          status === "checking"
                            ? "bg-amber-400"
                            : status === "reachable"
                              ? "bg-emerald-400"
                              : status === "blocked"
                                ? "bg-red-400"
                                : "bg-zinc-600"
                        }`}
                      />
                      <span className="sr-only">{statusLabel}</span>
                    </a>
                  );
                })}
              </div>

              <p role="status" className="text-[11px] leading-relaxed text-zinc-500">
                {Object.values(proxyStatus).some((status) => status === "checking")
                  ? "Checking which proxies load from this network…"
                  : Object.values(proxyStatus).length > 0
                    ? `${SITE_MIRRORS.filter((mirror) => proxyStatus[mirror.url] === "reachable").length} reachable · ${SITE_MIRRORS.filter((mirror) => proxyStatus[mirror.url] === "blocked").length} blocked`
                    : "Scroll here to check the proxies from this network."}
              </p>
              <p className="text-[11px] leading-relaxed text-zinc-500">
                The check loads each proxy in a hidden frame. “Blocked” means the frame did not load, so a filter can
                also be the cause.
              </p>
            </div>
          </div>

          <p className="text-[11px] text-zinc-500" title={`Build ${LAST_UPDATED_ISO}`}>
            Last updated {formatLastUpdated()}
          </p>
                </section>
        </div>

        {/* Support: the address visitors should write to for help. */}
        <div style={paneStyle("support")}>
        <section aria-labelledby="support-title" className="flex flex-col gap-3 border-t border-white/[0.08] pt-3">
          <div className="flex items-start gap-2">
            <div
              style={ICON_TILE}
              className="p-1.5 text-zinc-300"
            >
              <Mail aria-hidden="true" className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 id="support-title" className="text-base font-medium text-zinc-100">
                Support
              </h3>
              <p className="text-xs leading-relaxed text-zinc-400">
                Questions, a broken game, account help or anything else — email us and we will get back to you.
              </p>
            </div>
          </div>

          <div
            style={{
              borderRadius: 12,
              background: "rgba(255, 255, 255, 0.02)",
              boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.06)",
            }}
            className="flex flex-col gap-1.5 p-3"
          >
            <span className="text-[11px] font-medium text-zinc-400">Email</span>
            <a
              href="mailto:games@mathclass.uk?subject=math_games%20support"
              className="break-all text-sm font-medium text-amber-300 underline decoration-amber-300/30 underline-offset-2 transition-colors hover:text-amber-200"
            >
              games@mathclass.uk
            </a>
            <p className="text-[11px] leading-relaxed text-zinc-500">
              Include the game or page name and what happened so we can help faster.
            </p>
          </div>

          <a
            href="mailto:games@mathclass.uk?subject=math_games%20support"
            style={CHIP_STYLE}
            className="inline-flex self-start items-center gap-1.5 px-3 py-2 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/[0.08] hover:text-white"
          >
            <Mail aria-hidden="true" className="h-3.5 w-3.5 text-zinc-500" />
            Email support
          </a>
        </section>
        </div>

        {/* Admin: footer credit lines, kept above the Ad pane */}
        <div style={paneStyle("admin")}>
        <section aria-labelledby="admin-title" className="flex flex-col gap-3 border-t border-white/[0.08] pt-3">
          <div className="flex items-start gap-2">
            <div
              style={ICON_TILE}
              className="p-1.5 text-zinc-300"
            >
              <Shield aria-hidden="true" className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-base font-medium text-zinc-100">
                <span id="admin-title">Admin</span>
                <span className="font-mono text-[11px] text-zinc-500">read-only</span>
              </div>
              <div className="text-xs text-zinc-400">
                The credit lines shown in the footer
              </div>
            </div>
          </div>

          <dl className="flex flex-col gap-2">
            <div
              style={{
                borderRadius: 12,
                background: "rgba(255, 255, 255, 0.02)",
                boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.06)",
              }}
              className="flex items-baseline justify-between gap-3 px-3 py-2.5"
            >
              <dt className="text-[11px] font-medium text-zinc-400">Last updated</dt>
              <dd className="text-right text-xs font-medium text-zinc-100">{siteMeta.updatedAt}</dd>
            </div>
            <div
              style={{
                borderRadius: 12,
                background: "rgba(255, 255, 255, 0.02)",
                boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.06)",
              }}
              className="flex items-baseline justify-between gap-3 px-3 py-2.5"
            >
              <dt className="text-[11px] font-medium text-zinc-400">Built by</dt>
              <dd className="text-right text-xs font-medium text-zinc-100">{siteMeta.builtBy}</dd>
            </div>
          </dl>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenAdmin();
              }}
              style={CHIP_STYLE}
              className="inline-flex cursor-pointer items-center gap-1.5 px-3 py-2 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/[0.08] hover:text-white"
            >
              <Shield aria-hidden="true" className="h-3.5 w-3.5 text-zinc-500" />
              Open admin panel
            </button>
          </div>

          <p className="text-[11px] leading-relaxed text-zinc-500">
            These values are read-only and match the lines in the footer.
          </p>
        </section>
        </div>

        {/* Ad: kept last in the settings pages */}
        <div style={paneStyle("ads")}>
        <section
          aria-labelledby="ads-title"
          className="flex flex-col gap-3 border-t border-white/[0.08] pt-3"
        >
          <div className="flex items-center gap-2 text-base font-medium text-zinc-100">
            <Megaphone aria-hidden="true" className="h-4 w-4 text-zinc-400" />
            <h3 id="ads-title">Ad</h3>
          </div>
          <div className="flex items-center justify-between gap-3 opacity-60">
            <div className="flex items-center gap-2">
              <div
                style={ICON_TILE}
                className="p-1.5 text-zinc-400"
              >
                <BellOff aria-hidden="true" className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-zinc-100">
                  <span>Turn off ads</span>
                  <span className="font-mono text-[11px] text-zinc-500">ultra</span>
                </div>
                <div className="text-xs text-zinc-400">
                  Ads can’t be turned off on their own. Ultra removes them.
                </div>
              </div>
            </div>

            <button
              type="button"
              disabled
              aria-disabled="true"
              aria-checked={false}
              role="switch"
              aria-label="Turn off ads (Ultra only)"
              title="Upgrade to Ultra for $1 to get no ads and more features"
              className="relative inline-flex h-6 w-11 shrink-0 cursor-not-allowed rounded-full bg-zinc-700"
            >
              <span className="pointer-events-none inline-block h-5 w-5 translate-x-0 transform rounded-full bg-white/70 shadow" />
            </button>
          </div>

          <div
            style={{
              borderRadius: 12,
              background: "rgba(255, 255, 255, 0.02)",
              boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.06)",
            }}
            className="flex flex-col gap-3 p-3"
          >
            <div className="flex items-start gap-2">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-base font-medium text-zinc-100">
                  <span>math_games Ultra</span>
                  <span className="font-mono text-[11px] text-zinc-400">$1 one-time</span>
                </div>
                <div className="text-xs text-zinc-400">
                  Removes the ads across the hub.
                </div>
              </div>
            </div>
            <a
              href="/checkout"
              className="inline-flex items-center justify-center gap-1.5 self-start rounded-lg bg-emerald-500 px-3 py-2 text-xs font-medium text-emerald-950 transition-colors duration-150 ease-out hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
            >
              Pay $1
            </a>
            <p className="text-[11px] leading-relaxed text-zinc-500">
              One-time payment. Sign in or create an account at checkout.
            </p>
          </div>
        </section>
        </div>

        {/* Where the hub is listed. The badge links out to the Launch Streak listing. */}
        <div style={paneStyle("launched")}>
        <section
          aria-labelledby="launched-title"
          className="flex flex-col gap-3 border-t border-white/[0.08] pt-3"
        >
          <div className="flex items-center gap-2 text-base font-medium text-zinc-100">
            <Trophy aria-hidden="true" className="h-4 w-4 text-zinc-400" />
            <h3 id="launched-title">Launched on</h3>
          </div>
          <p className="text-xs leading-relaxed text-zinc-400">
            math_games is listed on Launch Streak. Visit the listing to see it alongside other games.
          </p>

          <div className="flex flex-col items-start gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <a
              href="https://launchstreak.dev/games/math-games"
              target="_blank"
              rel="noopener"
              className="inline-block rounded-lg transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              <img
                src="https://launchstreak.dev/badge/launch-streak-badge-light.svg"
                alt="Launched on Launch Streak"
                width={248}
                height={68}
                loading="lazy"
                className="h-[68px] w-[248px] max-w-full"
              />
            </a>
            <a
              href="https://startupbenchmarks.com/product/poly2-benlaunches"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-lg transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              <img
                src="https://startupbenchmarks.com/assets/images/badge-dark.png"
                alt="Startup Benchmarks"
                height={54}
                loading="lazy"
                className="h-[54px] w-auto max-w-full"
              />
            </a>
            <a
              href="https://launchstreak.dev/games/math-games"
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-1 text-[11px] font-medium text-zinc-300 transition-colors hover:text-white"
            >
              <span>View the listing</span>
              <ExternalLink aria-hidden="true" className="h-3 w-3" />
            </a>
          </div>
        </section>
        </div>

        {/* Referrals: add or edit links in referrals.json; this pane reads that file. */}
        <div style={paneStyle("referrals")}>
        <section
          aria-labelledby="referrals-title"
          className="flex flex-col gap-3 border-t border-white/[0.08] pt-3"
        >
          <div className="flex items-center gap-2 text-base font-medium text-zinc-100">
            <Gift aria-hidden="true" className="h-4 w-4 text-zinc-400" />
            <h3 id="referrals-title">Referrals</h3>
          </div>
          <p className="text-xs leading-relaxed text-zinc-400">
            Hand-picked links that can earn you a reward and help keep math_games free.
          </p>

          {!referralsLoaded && (
            <p role="status" className="rounded-xl border border-white/[0.07] bg-white/[0.02] px-3 py-2 text-[11px] text-zinc-500">
              Loading links…
            </p>
          )}

          {referralsLoaded && referrals.length === 0 && (
            <p className="rounded-xl border border-dashed border-white/[0.12] bg-white/[0.015] px-3 py-2.5 text-[11px] leading-relaxed text-zinc-500">
              No referral links yet. Add them to referrals.json and they will appear here.
            </p>
          )}

          {referrals.length > 0 && (
            <ul className="flex flex-col gap-2">
              {referrals.map((referral) => (
                <li key={referral.id}>
                  <a
                    href={referral.url}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="group flex items-start justify-between gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-colors hover:border-white/[0.16] hover:bg-white/[0.05]"
                  >
                    <span className="min-w-0">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-medium text-zinc-100">{referral.title}</span>
                        {referral.badge && (
                          <span className="font-mono text-[11px] text-zinc-500">{referral.badge}</span>
                        )}
                      </span>
                      {referral.description && (
                        <span className="mt-1 block text-xs leading-relaxed text-zinc-400">
                          {referral.description}
                        </span>
                      )}
                    </span>
                    <span className="inline-flex shrink-0 items-center gap-1 text-[11px] font-medium text-zinc-500 transition-colors group-hover:text-white">
                      {referral.cta || "Open"}
                      <ExternalLink aria-hidden="true" className="h-3 w-3" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          )}

          <p className="text-[11px] leading-relaxed text-zinc-500">
            Some links are referrals: using them may earn math_games a reward at no extra cost to you.
          </p>
        </section>
        </div>
        </div>
      </div>
    </div>
  );
}
