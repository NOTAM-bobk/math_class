import * as React from "react";
import { X, Lock, ShieldAlert, Check, Key, ShieldCheck, Eye, EyeOff, Bell, BellOff, History, Palette, Sparkles, Pipette, Github, Globe, Download, Trash2, Clock, Bug, Shield, BarChart3, Timer, MousePointerClick, Gamepad2, Trophy, Search, LayoutGrid, Megaphone, WifiOff, EyeOff as CloakIcon, Siren, Link2, ScrollText, UserRound, RotateCcw } from "lucide-react";
import { useDialogFocus } from "@/lib/dialogFocus";
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
  formatPlayTime,
  isPlayStatsEnabled,
  loadPlayStats,
  setPlayStatsEnabled,
  subscribePlayStats,
  type PlayStats,
} from "@/lib/playStats";
import {
  GAME_CARD_LAYOUTS,
  loadGameCardLayout,
  onGameCardLayoutChange,
  saveGameCardLayout,
  type GameCardLayout,
} from "@/lib/gameCardLayout";
import { hardResetSite } from "@/lib/hardReset";
import { DEFAULT_BUILT_BY, type SiteMeta } from "@/lib/siteMeta";

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
  // Footer credit lines, editable from the Admin pane.
  siteMeta: SiteMeta;
  onSiteMetaChange: (meta: SiteMeta) => void;
  onSiteMetaReset: () => void;
  loadingRevealEnabled?: boolean;
  onLoadingRevealChange?: (enabled: boolean) => void;
  footerHidden?: boolean;
  onFooterHiddenChange?: (hidden: boolean) => void;
}

const PANIC_PRESETS = [
  { name: "Wikipedia", url: "https://www.wikipedia.org/" },
  { name: "Google Classroom", url: "https://classroom.google.com/" },
  { name: "Google Docs", url: "https://docs.google.com/" },
  { name: "Canvas", url: "https://canvas.instructure.com/" }
];

const SITE_MIRRORS = [
  { name: "poly2.benlaunches.icu", url: "https://poly2.benlaunches.icu/", timeoutMs: 10000 },
  { name: "polytrack.sawyerbobk563.deno.net", url: "https://polytrack.sawyerbobk563.deno.net/", timeoutMs: 10000 },
  { name: "polytrack.sawyerbobk563.workers.dev", url: "https://polytrack.sawyerbobk563.workers.dev/", timeoutMs: 10000 },
  // This one can take a minute to wake up.
  { name: "basket-random-1df0d.containers.snapdeploy.app", url: "https://basket-random-1df0d.containers.snapdeploy.app/", timeoutMs: 65000 },
];

type ProxyCheckStatus = "idle" | "checking" | "reachable" | "blocked";

/** Loads a proxy in an invisible frame; a load error or timeout means it did not load. */
function testMirrorFrame(
  url: string,
  timeoutMs = 9000,
  signal?: AbortSignal,
): Promise<"reachable" | "blocked"> {
  return new Promise((resolve) => {
    const iframe = document.createElement("iframe");
    iframe.setAttribute("aria-hidden", "true");
    iframe.tabIndex = -1;
    iframe.title = `Connectivity check for ${url}`;
    Object.assign(iframe.style, {
      position: "fixed",
      left: "-10000px",
      top: "0",
      width: "1px",
      height: "1px",
      opacity: "0",
      pointerEvents: "none",
      border: "0",
    });

    let settled = false;
    const finish = (result: "reachable" | "blocked") => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      iframe.remove();
      resolve(result);
    };
    const timer = window.setTimeout(() => finish("blocked"), timeoutMs);
    const abort = () => finish("blocked");
    if (signal?.aborted) {
      finish("blocked");
      return;
    }
    signal?.addEventListener("abort", abort, { once: true });
    iframe.addEventListener("load", () => finish("reachable"), { once: true });
    iframe.addEventListener("error", () => finish("blocked"), { once: true });
    iframe.src = url;
    document.body.appendChild(iframe);
  });
}

type DesktopTab = "account" | "general" | "stats" | "security" | "notifications" | "appearance" | "cloak" | "panic" | "ads" | "offline" | "proxies" | "changelog" | "admin";

const DESKTOP_NAV: { heading: string; items: { id: DesktopTab; label: string; icon: React.ComponentType<{ className?: string }>; keywords: string }[] }[] = [
  { heading: "Account", items: [
    { id: "account", label: "Account", icon: UserRound, keywords: "account sign in login sync save settings game data" },
  ] },
  { heading: "General", items: [
    { id: "general", label: "Layout & startup", icon: LayoutGrid, keywords: "loading animation side chat visitor counter ad space layout startup" },
    { id: "stats", label: "Your stats", icon: BarChart3, keywords: "play time clicks most played games stats" },
    { id: "security", label: "Site lock", icon: Lock, keywords: "password lock security site" },
    { id: "notifications", label: "Notifications", icon: Bell, keywords: "notifications new games chat alerts" },
  ] },
  { heading: "Appearance", items: [
    { id: "appearance", label: "Background", icon: Palette, keywords: "background theme color gradient image" },
    { id: "cloak", label: "Tab cloak", icon: CloakIcon, keywords: "tab cloak title icon disguise" },
    { id: "panic", label: "Panic button", icon: Siren, keywords: "panic key redirect escape" },
  ] },
  { heading: "Other", items: [
    { id: "offline", label: "Offline mode", icon: WifiOff, keywords: "offline download cache schedule" },
    { id: "proxies", label: "Proxies & source", icon: Link2, keywords: "source code github proxies mirrors" },
    { id: "changelog", label: "Change log", icon: ScrollText, keywords: "change log updates history" },
    { id: "ads", label: "Ad", icon: Megaphone, keywords: "ad ads notification ads block" },
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

const CHIP_STYLE: React.CSSProperties = {
  borderRadius: 36,
  background: "rgba(255, 255, 255, 0.04)",
  boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.02), inset 0 1px 0 0 rgba(255, 255, 255, 0.04)",
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
  onSiteMetaChange,
  onSiteMetaReset,
  loadingRevealEnabled = true,
  onLoadingRevealChange,
  footerHidden = false,
  onFooterHiddenChange
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
  const [settingsSearch, setSettingsSearch] = React.useState("");
  const paneStyle = (tab: DesktopTab): React.CSSProperties => ({ display: isDesktop && desktopTab !== tab ? "none" : "contents" });

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

  // Footer credit drafts, saved into this browser from the Admin pane.
  const [metaUpdatedDraft, setMetaUpdatedDraft] = React.useState(siteMeta.updatedAt);
  const [metaBuiltByDraft, setMetaBuiltByDraft] = React.useState(siteMeta.builtBy);
  const [metaNotice, setMetaNotice] = React.useState("");

  React.useEffect(() => {
    if (!isOpen) return;
    setMetaUpdatedDraft(siteMeta.updatedAt);
    setMetaBuiltByDraft(siteMeta.builtBy);
    setMetaNotice("");
    // Only a fresh open resets the drafts; saving keeps its confirmation visible.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  React.useEffect(() => {
    setMetaUpdatedDraft(siteMeta.updatedAt);
    setMetaBuiltByDraft(siteMeta.builtBy);
  }, [siteMeta]);

  // Local play statistics; the pane updates live while counting runs.
  const [playStats, setPlayStats] = React.useState<PlayStats>(loadPlayStats);
  const [statsEnabled, setStatsEnabled] = React.useState(isPlayStatsEnabled);

  // Game card layout, shared with the catalog through localStorage.
  const [cardLayout, setCardLayout] = React.useState<GameCardLayout>(loadGameCardLayout);
  React.useEffect(() => onGameCardLayoutChange(setCardLayout), []);

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

  // Chat notifications
  const [chatNotificationsOn, setChatNotificationsOn] = React.useState(isChatNotificationsEnabled);

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
        void testMirrorFrame(mirror.url, mirror.timeoutMs, controller.signal).then((result) => {
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
      className={`fixed inset-0 z-50 flex items-start justify-center overflow-y-auto overscroll-contain bg-black/80 p-2 pt-[4.5rem] backdrop-blur-sm sm:items-center sm:p-4 ${closing ? "settings-backdrop-exit pointer-events-none" : "settings-backdrop-enter"}`}
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
          background: "#1d1d1d",
          borderRadius: 20,
          border: "none",
          boxShadow:
            "inset 0 0 0 1px rgba(44, 47, 54, 0.65), inset 0 0 50px 0 rgba(255, 255, 255, 0.02), 0 24px 60px -12px rgba(0, 0, 0, 0.9), 0 6px 16px rgba(0, 0, 0, 0.6)",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-2 h-1 w-10 -translate-x-1/2 rounded-full bg-white/20 sm:hidden"
        />

        <style>{DESKTOP_LIGHT_CSS}</style>
        {isDesktop && (
          <aside className="flex w-72 shrink-0 flex-col gap-1 overflow-y-auto border-r p-4" style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.18)", boxShadow: "inset -1px 0 0 rgba(255,255,255,0.02)" }} aria-label="Settings sections">
            <label className="mb-4 flex items-center gap-2 rounded-xl px-3 py-2.5" style={{ background: "rgba(0, 0, 0, 0.3)", boxShadow: "inset 0 1px 2px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.06)" }}>
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
            {DESKTOP_NAV.map((group) => {
              const q = settingsSearch.trim().toLowerCase();
              const items = group.items.filter((item) => !q || item.label.toLowerCase().includes(q) || item.keywords.includes(q));
              if (!items.length) return null;
              return (
                <div key={group.heading} className="mb-3 flex flex-col gap-0.5">
                  <div className="px-3 pb-1.5 text-xs text-zinc-500">{group.heading}</div>
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
                        style={active ? { ...CHIP_STYLE, borderRadius: 10, background: "rgba(255, 255, 255, 0.07)", color: "#f4f4f5", fontWeight: 500, boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.05), inset 0 1px 0 0 rgba(255,255,255,0.08), 0 2px 6px rgba(0,0,0,0.35)" } : { color: "#a1a1aa" }}
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </aside>
        )}
        <div className={isDesktop ? "relative flex min-w-0 flex-1 flex-col gap-5 overflow-y-auto px-12 py-10" : "contents"}>
        {isDesktop && (
          <>
            <button type="button" onClick={onClose} aria-label="Close settings" className="absolute right-5 top-5 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-zinc-400 transition-colors hover:text-white" style={CHIP_STYLE}>
              <X aria-hidden="true" className="h-4 w-4" />
            </button>
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-100">
              {DESKTOP_NAV.flatMap((g) => g.items).find((i) => i.id === desktopTab)?.label}
            </h2>
          </>
        )}
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3" style={isDesktop ? { display: "none" } : undefined}>
          <div className="flex items-center gap-2">
            <h2 id="settings-title" className="text-base font-semibold tracking-tight text-zinc-100">
              Settings
            </h2>
            <span
              style={CHIP_STYLE}
              className="px-2.5 py-0.5 font-mono text-[11px] text-[#caccd2]"
            >
              Preferences
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg p-1 text-zinc-400 transition-colors hover:bg-white/[0.08] hover:text-white"
            aria-label="Close settings"
          >
            <X aria-hidden="true" className="w-4 h-4" />
          </button>
        </div>

        <div style={paneStyle("general")}>
        <section className="flex flex-col gap-3 border-t border-white/[0.08] pt-3" aria-labelledby="layout-controls-title">
          <div>
            <h3 id="layout-controls-title" className="text-sm font-semibold text-zinc-100">Layout & Startup</h3>
            <p className="mt-0.5 text-xs text-zinc-400">Configure the startup loading animation, side chat, visitor counter and ad space.</p>
          </div>
          <div className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] p-3">
            <div>
              <div className="text-sm font-medium text-zinc-200">Startup loading animation</div>
              <div className="text-xs text-zinc-500">Play the 3D glass logo reveal when loading the site</div>
            </div>
            <button
              type="button"
              onClick={() => onLoadingRevealChange?.(!loadingRevealEnabled)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${loadingRevealEnabled ? "bg-emerald-600" : "bg-zinc-700"}`}
              role="switch"
              aria-checked={loadingRevealEnabled}
              aria-label="Startup loading animation"
            >
              <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ${loadingRevealEnabled ? "translate-x-5" : "translate-x-0"}`} />
            </button>
          </div>
          <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-medium text-zinc-200">Game card layout</div>
                <div className="text-xs text-zinc-500">Choose how games are drawn in the catalog</div>
              </div>
              <LayoutGrid aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500" />
            </div>
            <div role="radiogroup" aria-label="Game card layout" className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {GAME_CARD_LAYOUTS.map((option) => {
                const active = cardLayout === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => {
                      saveGameCardLayout(option.id);
                      setCardLayout(option.id);
                    }}
                    className={`cursor-pointer rounded-lg p-2.5 text-left ring-1 ring-inset transition-colors ${
                      active
                        ? "bg-white/[0.08] text-white ring-white/25"
                        : "bg-black/20 text-zinc-300 ring-white/[0.06] hover:bg-white/[0.05]"
                    }`}
                  >
                    <span aria-hidden="true" className="mb-2 block overflow-hidden rounded-md bg-black/40 p-1.5">
                      {option.id === "mosaic" ? (
                        <span className="grid h-12 grid-cols-4 grid-rows-2 gap-1">
                          <span className="col-span-2 row-span-2 rounded-sm bg-white/25" />
                          <span className="rounded-sm bg-white/15" />
                          <span className="rounded-sm bg-white/15" />
                          <span className="rounded-sm bg-white/15" />
                          <span className="rounded-sm bg-white/15" />
                        </span>
                      ) : (
                        <span className="flex h-12 flex-col gap-1">
                          <span className="h-[22px] rounded-sm bg-white/20" />
                          <span className="h-[22px] rounded-sm bg-white/10" />
                        </span>
                      )}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-semibold">
                      {option.name}
                      {active && <Check aria-hidden="true" className="h-3 w-3 text-emerald-400" />}
                    </span>
                    <span className="mt-0.5 block text-[10.5px] leading-snug text-zinc-500">
                      {option.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] p-3">
            <div>
              <div className="text-sm font-medium text-zinc-200">Side chat and visitor counter</div>
              <div className="text-xs text-zinc-500">Keep the chat panel visible beside the game catalog</div>
            </div>
            <button type="button" onClick={() => onSideChatChange(!sideChatEnabled)} className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${sideChatEnabled ? "bg-emerald-600" : "bg-zinc-700"}`} role="switch" aria-checked={sideChatEnabled} aria-label="Side chat and visitor counter">
              <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ${sideChatEnabled ? "translate-x-5" : "translate-x-0"}`} />
            </button>
          </div>
          <div className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] p-3">
            <div>
              <div className="text-sm font-medium text-zinc-200">Show footer</div>
              <div className="text-xs text-zinc-500">Show the footer links and report button at the bottom of the page</div>
            </div>
            <button type="button" onClick={() => onFooterHiddenChange?.(!footerHidden)} className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${!footerHidden ? "bg-emerald-600" : "bg-zinc-700"}`} role="switch" aria-checked={!footerHidden} aria-label="Show footer">
              <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ${!footerHidden ? "translate-x-5" : "translate-x-0"}`} />
            </button>
          </div>
          <div className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] p-3 opacity-60">
            <div>
              <div className="text-sm font-medium text-zinc-200">Ad space</div>
              <div className="text-xs text-zinc-500">
                Always on. Upgrade to Ultra for $1 to get no ads and more features.
              </div>
            </div>
            <button
              type="button"
              disabled
              aria-disabled="true"
              aria-checked={adSpotEnabled}
              role="switch"
              aria-label="Ad space (always on)"
              title="Upgrade to Ultra for $1 to remove ads"
              className="relative inline-flex h-6 w-11 shrink-0 cursor-not-allowed rounded-full border-2 border-transparent bg-emerald-600/70"
            >
              <span className="pointer-events-none inline-block h-5 w-5 translate-x-5 transform rounded-full bg-white shadow" />
            </button>
          </div>
          <div
            style={{
              borderRadius: 12,
              background: "rgba(239, 68, 68, 0.06)",
              boxShadow: "inset 0 0 0 1px rgba(239, 68, 68, 0.18)",
            }}
            className="flex flex-col gap-2.5 p-3"
          >
            <div className="flex items-start gap-2">
              <RotateCcw aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
              <div className="min-w-0">
                <div className="text-sm font-medium text-zinc-200">Hard reset</div>
                <div className="text-xs text-zinc-500">
                  Delete this site’s cache, local storage, cookies and offline copy, then reload so the newest
                  updates load. Saved settings, favorites and progress on this device are erased.
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleHardReset}
              disabled={resetting}
              className={`inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors active:scale-[0.99] disabled:cursor-wait ${
                resetConfirming
                  ? "bg-red-500 text-white hover:bg-red-400"
                  : "border border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20"
              }`}
            >
              <Trash2 aria-hidden="true" className="h-3.5 w-3.5" />
              <span>{resetting ? "Resetting…" : resetConfirming ? "Click again to erase everything" : "Hard reset and reload"}</span>
            </button>
            <p role="status" className="text-[11px] leading-relaxed text-zinc-500">
              {resetConfirming
                ? "This cannot be undone. Click the button again within a few seconds to continue."
                : "Use this when an update seems stuck on an old version of the site."}
            </p>
          </div>
        </section>
        </div>

        {/* Account: sign-in is not available yet, so the whole block is disabled. */}
        <div style={paneStyle("account")}>
        <section aria-labelledby="account-title" className="flex flex-col gap-3 border-t border-white/[0.08] pt-3">
          <div className="flex items-start gap-2">
            <div
              style={{
                borderRadius: 36,
                background: "rgba(255, 255, 255, 0.04)",
                boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.04)",
              }}
              className="p-1.5 text-zinc-400"
            >
              <UserRound aria-hidden="true" className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-zinc-100">
                <span id="account-title">Account</span>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] font-medium text-zinc-400">
                  Coming soon
                </span>
              </div>
              <div className="text-xs text-zinc-400">
                Your settings and game data are saved on this device only
              </div>
            </div>
          </div>

          <div
            aria-disabled="true"
            className="pointer-events-none select-none rounded-xl border border-dashed border-white/[0.12] bg-white/[0.015] p-4 opacity-50 grayscale"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/[0.1] bg-white/[0.04] text-zinc-400">
                <UserRound aria-hidden="true" className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-medium text-zinc-300">Sign in</div>
                <p className="mt-0.5 text-[11.5px] leading-relaxed text-zinc-500">
                  Sign in to save your settings and game data to your account, then pick them up on any device.
                </p>
              </div>
            </div>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                disabled
                aria-disabled="true"
                tabIndex={-1}
                className="inline-flex h-9 flex-1 cursor-not-allowed items-center justify-center gap-2 rounded-lg border border-white/[0.1] bg-white/[0.05] text-xs font-semibold text-zinc-400"
              >
                Sign in
              </button>
              <button
                type="button"
                disabled
                aria-disabled="true"
                tabIndex={-1}
                className="inline-flex h-9 flex-1 cursor-not-allowed items-center justify-center gap-2 rounded-lg border border-white/[0.1] bg-white/[0.02] text-xs font-medium text-zinc-400"
              >
                Create account
              </button>
            </div>
          </div>

          <p className="text-[11px] leading-relaxed text-zinc-500">
            Sign-in isn’t available yet. Everything stays saved in this browser until it is — a hard reset in
            Layout &amp; startup clears it.
          </p>
        </section>
        </div>

        {/* Local play statistics */}
        <div style={paneStyle("stats")}>
        <section className="flex flex-col gap-3 border-t border-white/[0.08] pt-3" aria-labelledby="stats-title">
          <div className="flex items-start gap-2">
            <div
              style={{
                borderRadius: 36,
                background: "rgba(56, 189, 248, 0.12)",
                boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.04)",
              }}
              className="p-1.5 text-sky-400"
            >
              <BarChart3 aria-hidden="true" className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-zinc-100">
                <span id="stats-title">Your statistics</span>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] font-medium text-zinc-400">
                  On this device
                </span>
              </div>
              <div className="text-xs text-zinc-400">Play time, clicks and your most played games</div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] p-3">
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-zinc-200">
                Always count
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    statsEnabled
                      ? "border border-emerald-500/30 bg-emerald-500/20 text-emerald-300"
                      : "border border-white/10 bg-white/[0.04] text-zinc-400"
                  }`}
                >
                  {statsEnabled ? "Live" : "Paused"}
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
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${statsEnabled ? "bg-emerald-600" : "bg-zinc-700"}`}
              role="switch"
              aria-checked={statsEnabled}
              aria-label="Always count statistics"
            >
              <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ${statsEnabled ? "translate-x-5" : "translate-x-0"}`} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              { label: "Time on site", value: formatPlayTime(playStats.totalPlayMs), icon: Timer, tone: "text-sky-400" },
              { label: "Game clicks", value: playStats.totalClicks.toLocaleString(), icon: MousePointerClick, tone: "text-emerald-400" },
              { label: "Games played", value: playStats.games.length.toLocaleString(), icon: Gamepad2, tone: "text-amber-400" },
              { label: "Sessions", value: playStats.totalSessions.toLocaleString(), icon: Trophy, tone: "text-purple-400" },
            ].map((tile) => {
              const Icon = tile.icon;
              return (
                <div
                  key={tile.label}
                  style={{
                    borderRadius: 12,
                    background: "rgba(0, 0, 0, 0.3)",
                    boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.04)",
                  }}
                  className="p-2.5"
                >
                  <div className="flex items-center gap-1 text-[10.5px] font-medium text-zinc-500">
                    <Icon aria-hidden="true" className={`h-3 w-3 ${tile.tone}`} />
                    {tile.label}
                  </div>
                  <div className="mt-1 font-mono text-lg font-semibold tracking-tight text-zinc-100">
                    {tile.value}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col gap-2 rounded-xl bg-black/25 p-3 ring-1 ring-inset ring-white/[0.05]">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-200">
                <Trophy aria-hidden="true" className="h-3.5 w-3.5 text-amber-400" />
                Most played
              </div>
              {playStats.lastPlayedAt ? (
                <span className="text-[10.5px] text-zinc-500">
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
                          <span className="mr-1 font-mono text-[10px] text-zinc-500">{index + 1}.</span>
                          {game.name}
                        </span>
                        <span className="shrink-0 text-[10.5px] text-zinc-500">
                          {game.playMs > 0 ? `${formatPlayTime(game.playMs)} · ` : ""}
                          {game.clicks} click{game.clicks === 1 ? "" : "s"}
                        </span>
                      </div>
                      <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-white/[0.06]">
                        <div className="h-full rounded-full bg-sky-500/80" style={{ width: `${percent}%` }} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-[11px] text-zinc-500">Play a game and your top games will show up here.</p>
            )}

            <p className="text-[10px] leading-relaxed text-zinc-500">
              Time counts every second while the hub is open or a game is running, and stops when Always count is off.
              Statistics stay on this device.
            </p>
          </div>
        </section>
        </div>

        {/* Mobile-only shortcuts, moved out of the footer on phones */}
        <section className="flex flex-col gap-2 border-t border-white/[0.08] pt-3 sm:hidden" aria-labelledby="classroom-tools-title">
          <h3 id="classroom-tools-title" className="text-sm font-semibold text-zinc-100">
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
              className="inline-flex cursor-pointer items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/[0.08] hover:text-white active:scale-[0.98]"
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
              className="inline-flex cursor-pointer items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/[0.08] hover:text-white active:scale-[0.98]"
            >
              <Shield aria-hidden="true" className="h-3.5 w-3.5 text-blue-400" />
              <span>Admin</span>
            </button>
          </div>
        </section>

        {/* Security: Site Lock */}
        <div style={paneStyle("security")}>
        <section
          aria-labelledby="site-lock-title"
          className="flex flex-col gap-3 border-t border-white/[0.08] pt-3"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div
                style={{
                  borderRadius: 36,
                  background: siteLockEnabled ? "rgba(34, 197, 94, 0.12)" : "rgba(255, 255, 255, 0.05)",
                  boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.04)",
                }}
                className="p-1.5 text-zinc-300"
              >
                <Lock
                  aria-hidden="true"
                  className={`w-4 h-4 ${siteLockEnabled ? "text-emerald-400" : "text-zinc-400"}`}
                />
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-zinc-100">
                  <span id="site-lock-title">Site Lock (Classroom Mode)</span>
                  {siteLockEnabled && (
                    <span className="rounded-full border border-emerald-500/30 bg-emerald-500/20 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                      Active
                    </span>
                  )}
                </div>
                <div className="text-xs text-zinc-400">
                  Require a password on refresh to access the site
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleToggleLock}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                siteLockEnabled ? "bg-emerald-600" : "bg-zinc-700"
              }`}
              role="switch"
              aria-checked={siteLockEnabled}
              aria-label="Site Lock"
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-transform duration-200 ease-in-out ${
                  siteLockEnabled ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div
            style={{
              borderRadius: 14,
              background: "rgba(0, 0, 0, 0.3)",
              boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.04)",
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
                      borderRadius: 10,
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
                    className="inline-flex cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-zinc-950 shadow-sm transition-colors hover:bg-zinc-100 active:scale-95"
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
                      className="inline-flex cursor-pointer items-center justify-center gap-1 whitespace-nowrap px-3 py-1.5 text-xs font-medium text-amber-300 transition-colors hover:bg-white/[0.08] hover:text-white active:scale-95"
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
                style={{
                  borderRadius: 36,
                  background: "rgba(168, 85, 247, 0.12)",
                  boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.04)",
                }}
                className="p-1.5 text-purple-400"
              >
                <Palette aria-hidden="true" className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-zinc-100">
                  <span id="background-controls-title">Background Style</span>
                  {bgNotice && (
                    <span className="rounded-full border border-emerald-500/30 bg-emerald-500/20 px-2 py-0.5 text-[10px] font-medium text-emerald-300 animate-fade-in">
                      {bgNotice}
                    </span>
                  )}
                </div>
                <div className="text-xs text-zinc-400">
                  Change site background to animated shader, solid colors, or deep gradients
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              borderRadius: 14,
              background: "rgba(0, 0, 0, 0.3)",
              boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.04)",
              padding: "12px",
            }}
            className="flex flex-col gap-3"
          >
            {/* Background Category Tabs */}
            <div className="flex items-center gap-1.5 rounded-xl bg-black/40 p-1 ring-1 ring-inset ring-white/[0.06]">
              <button
                type="button"
                onClick={() => setBgTab("shader")}
                className={`flex-1 rounded-lg py-1.5 text-xs font-medium transition cursor-pointer ${
                  bgTab === "shader"
                    ? "bg-white/[0.12] text-white shadow-sm ring-1 ring-inset ring-white/10"
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
                    ? "bg-white/[0.12] text-white shadow-sm ring-1 ring-inset ring-white/10"
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
                    ? "bg-white/[0.12] text-white shadow-sm ring-1 ring-inset ring-white/10"
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
                          ? "bg-white/[0.09] ring-2 ring-emerald-400/80 shadow-[0_4px_16px_rgba(0,0,0,0.5)]"
                          : "bg-white/[0.03] ring-1 ring-white/[0.06] hover:bg-white/[0.06]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          style={{
                            background: preset.preview,
                            borderRadius: 10,
                            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.2), 0 2px 6px rgba(0,0,0,0.4)",
                          }}
                          className="h-10 w-10 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-100">
                            <span>{preset.name}</span>
                            <Sparkles className="w-3 h-3 text-amber-400" />
                          </div>
                          <div className="text-[11px] text-zinc-400">{preset.description}</div>
                        </div>
                      </div>
                      {isSelected ? (
                        <div className="flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-medium text-emerald-300 border border-emerald-500/30">
                          <Check className="w-3 h-3" />
                          <span>Active</span>
                        </div>
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
                            ? "bg-white/[0.1] ring-2 ring-emerald-400/80 shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
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
                          {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400 drop-shadow" />}
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
                    className="cursor-pointer rounded-lg bg-white px-3 py-1 text-xs font-semibold text-zinc-950 transition-colors hover:bg-zinc-100 active:scale-95"
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
                          <span className="rounded-full bg-black/60 backdrop-blur-sm p-1 text-emerald-400 shadow">
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                      <div className="truncate text-xs font-medium text-zinc-200">{preset.name}</div>
                      <div className="truncate text-[10px] text-zinc-500">{preset.description}</div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </section>
        </div>

        {/* Notifications: chat messages and new games */}
        <div style={paneStyle("notifications")}>
        <section className="flex flex-col gap-3 border-t border-white/[0.08] pt-3" aria-labelledby="notifications-title">
          <div className="flex items-center gap-2">
            <div
              style={{
                borderRadius: 36,
                background: notificationsOn || chatNotificationsOn ? "rgba(34, 197, 94, 0.12)" : "rgba(255, 255, 255, 0.05)",
                boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.04)",
              }}
              className="p-1.5 text-zinc-300"
            >
              <Bell
                aria-hidden="true"
                className={`w-4 h-4 ${notificationsOn || chatNotificationsOn ? "text-emerald-400" : "text-zinc-400"}`}
              />
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-zinc-100">
                <span id="notifications-title">Notification settings</span>
              </div>
              <div className="text-xs text-zinc-400">
                Manage alerts for live chat and game updates
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-xs font-medium text-amber-200">
            Must be “Add to home” for notification to work
          </div>

          {/* Option: Notfiy me when new chat message */}
          <div className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.04] bg-white/[0.02] p-2.5">
            <div>
              <div className="text-sm font-medium text-zinc-200">Notfiy me when new chat message</div>
              <div className="text-xs text-zinc-400">Get browser notifications when other racers post in live chat</div>
            </div>
            <button
              type="button"
              onClick={handleToggleChatNotifications}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                chatNotificationsOn ? "bg-emerald-600" : "bg-zinc-700"
              }`}
              role="switch"
              aria-checked={chatNotificationsOn}
              aria-label="Notfiy me when new chat message"
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-transform duration-200 ease-in-out ${
                  chatNotificationsOn ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Option: New game notifications */}
          <div className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.04] bg-white/[0.02] p-2.5">
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-zinc-200">
                <span>New game notifications</span>
                <span
                  className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${
                    notificationsOn
                      ? "border-emerald-500/30 bg-emerald-500/20 text-emerald-300"
                      : permission === "denied"
                        ? "border-red-500/30 bg-red-500/15 text-red-300"
                        : "border-white/10 bg-white/[0.06] text-zinc-400"
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
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                notificationsOn ? "bg-emerald-600" : "bg-zinc-700"
              }`}
              role="switch"
              aria-checked={notificationsOn}
              aria-label="New game notifications"
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-transform duration-200 ease-in-out ${
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
              style={{
                borderRadius: 36,
                background: offlineStatus?.cachedFiles ? "rgba(34, 197, 94, 0.12)" : "rgba(56, 189, 248, 0.12)",
                boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.04)",
              }}
              className="p-1.5"
            >
              <Download
                aria-hidden="true"
                className={`w-4 h-4 ${offlineStatus?.cachedFiles ? "text-emerald-400" : "text-sky-400"}`}
              />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-zinc-100">
                <span id="offline-title">Offline copy</span>
                {offlineStatus?.cachedFiles ? (
                  <span className="rounded-full border border-emerald-500/30 bg-emerald-500/20 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                    Downloaded
                  </span>
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
              <div className="flex flex-col gap-3 rounded-xl bg-black/25 p-3 ring-1 ring-inset ring-white/[0.05]">
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
                      <span className="text-[10.5px] text-zinc-500">
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
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-zinc-950 transition-colors hover:bg-zinc-100 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
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
                    className="inline-flex cursor-pointer items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-300 transition-colors hover:bg-white/[0.08] hover:text-red-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Trash2 aria-hidden="true" className="h-3.5 w-3.5" />
                    <span>Delete cache</span>
                  </button>
                </div>

                <p className="text-[10.5px] leading-relaxed text-zinc-500">
                  Keep this page open while the download runs. The site has to be reachable once to download it; after
                  that, cached pages open without a connection.
                </p>
              </div>

              <div className="flex flex-col gap-2 rounded-xl bg-black/25 p-3 ring-1 ring-inset ring-white/[0.05]">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 text-sm font-medium text-zinc-200">
                      <Clock aria-hidden="true" className="h-3.5 w-3.5 text-sky-400" />
                      <span>Auto-use cached backup</span>
                      <span className="rounded-full border border-sky-500/30 bg-sky-500/10 px-2 py-0.5 text-[10px] font-medium text-sky-300">
                        Advanced
                      </span>
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
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${offlineSchedule.scheduleEnabled ? "bg-emerald-600" : "bg-zinc-700"}`}
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

                <p className="text-[10.5px] leading-relaxed text-zinc-500">
                  Overnight windows work too, for example 22:00 to 07:00. The schedule only applies after the offline
                  copy has been downloaded.
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
              <h3 id="tab-cloak-title" className="text-sm font-semibold text-zinc-100">
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
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${tabCloakEnabled ? "bg-emerald-600" : "bg-zinc-700"}`}
            >
              <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${tabCloakEnabled ? "translate-x-5" : "translate-x-0"}`} />
            </button>
          </div>

          <form onSubmit={handleSaveTabCloak} className="flex flex-col gap-3 rounded-xl bg-black/25 p-3 ring-1 ring-inset ring-white/[0.05]">
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
                    <p className="text-[10px] leading-relaxed text-amber-200/80">Add an icon URL or select Default icon.</p>
                  )}
                </div>
              )}
            </fieldset>

            {tabCloakError && <p role="alert" className="text-xs font-medium text-red-400">{tabCloakError}</p>}
            <div className="flex items-center justify-between gap-3 border-t border-white/[0.06] pt-2">
              <p className="text-[10px] leading-relaxed text-zinc-500">Applies to this browser only.</p>
              <button type="submit" className="shrink-0 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-zinc-950 transition-colors hover:bg-zinc-100">
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
              style={{
                borderRadius: 36,
                background: "rgba(239, 68, 68, 0.12)",
                boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.04)",
              }}
              className="p-1.5 text-red-400"
            >
              <ShieldAlert aria-hidden="true" className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-zinc-100">
                <span id="panic-title">Emergency Panic Redirect</span>
                <kbd className="rounded border border-zinc-700 bg-zinc-800 px-1.5 py-0.5 font-mono text-[10px] text-zinc-300">
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
              borderRadius: 14,
              background: "rgba(0, 0, 0, 0.3)",
              boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.04)",
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
                        ? "bg-white/[0.12] font-semibold text-white"
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
                  borderRadius: 10,
                  background: "rgba(255, 255, 255, 0.04)",
                  boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.06)",
                }}
                className="min-w-0 flex-1 px-3 py-1.5 font-mono text-xs text-zinc-100 transition-colors placeholder:text-zinc-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => handleSavePanicUrl(customPanicInput)}
                className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-zinc-950 transition-colors hover:bg-zinc-100 active:scale-95"
              >
                {panicSaved ? "Saved" : "Set Custom URL"}
              </button>
            </div>
          </div>
        </section>
        </div>

        {/* About: change log */}
        <div style={paneStyle("changelog")}>
        <section aria-label="Change log" className="flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.08] pt-3">
          <p className="text-[10.5px] leading-relaxed text-zinc-500">
            See what changed in each site update.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onReportBug();
              }}
              style={CHIP_STYLE}
              className="inline-flex cursor-pointer items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/[0.08] hover:text-white active:scale-[0.98]"
              aria-haspopup="dialog"
            >
              <Bug aria-hidden="true" className="h-3.5 w-3.5 text-amber-400" />
              <span>Report a bug</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenChangelog();
              }}
              style={CHIP_STYLE}
              className="inline-flex cursor-pointer items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/[0.08] hover:text-white active:scale-[0.98]"
              aria-haspopup="dialog"
            >
              <History aria-hidden="true" className="h-3.5 w-3.5 text-sky-400" />
              <span>View change log</span>
            </button>
          </div>
        </section>
        </div>

        {/* About: source code and proxy links */}
        <div style={paneStyle("proxies")}>
        <section aria-label="Source code and proxies" className="flex flex-col gap-3 border-t border-white/[0.08] pt-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="text-sm font-semibold text-zinc-100">Source code</div>
              <p className="mt-0.5 text-[10.5px] leading-relaxed text-zinc-500">
                Read the code that runs this site.
              </p>
            </div>
            <a
              href="https://github.com/NOTAM-bobk/polytrack"
              target="_blank"
              rel="noopener noreferrer"
              style={CHIP_STYLE}
              className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/[0.08] hover:text-white active:scale-[0.98]"
            >
              <Github aria-hidden="true" className="h-3.5 w-3.5 text-zinc-400" />
              <span>View source code</span>
            </a>
          </div>

          <div
            style={{
              borderRadius: 14,
              background: "rgba(0, 0, 0, 0.3)",
              boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.04)",
              padding: "12px",
            }}
            className="flex flex-col gap-1.5"
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-zinc-100">
              <Globe aria-hidden="true" className="h-3.5 w-3.5 text-sky-400" />
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
                      className="inline-flex cursor-pointer items-center gap-1.5 px-2.5 py-1 text-[10.5px] font-medium text-zinc-300 transition-colors hover:bg-white/[0.08] hover:text-white active:scale-[0.98]"
                    >
                      <Globe aria-hidden="true" className="h-3 w-3 shrink-0 text-sky-400" />
                      <span className="truncate">{mirror.name}</span>
                      <span
                        aria-hidden="true"
                        className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                          status === "checking"
                            ? "animate-pulse bg-amber-400"
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

              <p role="status" className="text-[10.5px] leading-relaxed text-zinc-500">
                {Object.values(proxyStatus).some((status) => status === "checking")
                  ? "Checking which proxies load from this network…"
                  : Object.values(proxyStatus).length > 0
                    ? `${SITE_MIRRORS.filter((mirror) => proxyStatus[mirror.url] === "reachable").length} reachable · ${SITE_MIRRORS.filter((mirror) => proxyStatus[mirror.url] === "blocked").length} blocked`
                    : "Scroll here to check the proxies from this network."}
              </p>
              <p className="text-[10px] leading-relaxed text-zinc-500">
                The check loads each proxy in a hidden frame. “Blocked” means the frame did not load, so a filter can
                also be the cause.
              </p>
            </div>
          </div>

          <p className="text-[10.5px] text-zinc-500" title={`Build ${LAST_UPDATED_ISO}`}>
            Last updated {formatLastUpdated()}
          </p>
                </section>
        </div>

        {/* Admin: footer credit lines, kept above the Ad pane */}
        <div style={paneStyle("admin")}>
        <section aria-labelledby="admin-title" className="flex flex-col gap-3 border-t border-white/[0.08] pt-3">
          <div className="flex items-start gap-2">
            <div
              style={{
                borderRadius: 36,
                background: "rgba(59, 130, 246, 0.12)",
                boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.04)",
              }}
              className="p-1.5 text-blue-400"
            >
              <Shield aria-hidden="true" className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-zinc-100">
                <span id="admin-title">Admin</span>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] font-medium text-zinc-400">
                  This browser
                </span>
              </div>
              <div className="text-xs text-zinc-400">
                Set the “Updated …” time and “Built by …” line shown in the footer
              </div>
            </div>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-medium text-zinc-400">Last updated</span>
            <input
              type="text"
              value={metaUpdatedDraft}
              onChange={(event) => {
                setMetaUpdatedDraft(event.target.value);
                if (metaNotice) setMetaNotice("");
              }}
              maxLength={80}
              placeholder={formatLastUpdated()}
              style={{
                borderRadius: 10,
                background: "rgba(255, 255, 255, 0.04)",
                boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.06)",
              }}
              className="w-full px-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-medium text-zinc-400">Built by</span>
            <input
              type="text"
              value={metaBuiltByDraft}
              onChange={(event) => {
                setMetaBuiltByDraft(event.target.value);
                if (metaNotice) setMetaNotice("");
              }}
              maxLength={40}
              placeholder={DEFAULT_BUILT_BY}
              style={{
                borderRadius: 10,
                background: "rgba(255, 255, 255, 0.04)",
                boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.06)",
              }}
              className="w-full px-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
            />
          </label>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                onSiteMetaChange({
                  updatedAt: metaUpdatedDraft.trim() || formatLastUpdated(),
                  builtBy: metaBuiltByDraft.trim() || DEFAULT_BUILT_BY,
                });
                setMetaNotice("Saved. The footer now shows these values.");
              }}
              className="cursor-pointer rounded-lg bg-white px-3 py-2 text-xs font-semibold text-zinc-950 transition-colors hover:bg-zinc-100 active:scale-[0.98]"
            >
              Save changes
            </button>
            <button
              type="button"
              onClick={() => {
                onSiteMetaReset();
                setMetaNotice("Restored the built-in build stamp.");
              }}
              style={CHIP_STYLE}
              className="cursor-pointer px-3 py-2 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/[0.08] hover:text-white active:scale-[0.98]"
            >
              Reset to build stamp
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenAdmin();
              }}
              style={CHIP_STYLE}
              className="inline-flex cursor-pointer items-center gap-1.5 px-3 py-2 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/[0.08] hover:text-white active:scale-[0.98]"
            >
              <Shield aria-hidden="true" className="h-3.5 w-3.5 text-blue-400" />
              Open admin panel
            </button>
          </div>

          <p role="status" className="text-[10.5px] leading-relaxed text-zinc-500">
            {metaNotice || `Build stamp: ${formatLastUpdated()}`}
          </p>
        </section>
        </div>

        {/* Ad: kept last in the settings pages */}
        <div style={paneStyle("ads")}>
        <section
          aria-labelledby="ads-title"
          className="flex flex-col gap-3 border-t border-white/[0.08] pt-3"
        >
          <div className="flex items-center gap-2 text-sm font-semibold text-zinc-100">
            <Megaphone aria-hidden="true" className="h-4 w-4 text-zinc-400" />
            <h3 id="ads-title">Ad</h3>
          </div>
          <div className="flex items-center justify-between gap-3 opacity-60">
            <div className="flex items-center gap-2">
              <div
                style={{
                  borderRadius: 36,
                  background: "rgba(255, 255, 255, 0.05)",
                  boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.04)",
                }}
                className="p-1.5 text-zinc-400"
              >
                <BellOff aria-hidden="true" className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-zinc-100">
                  <span>Turn off ads</span>
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] font-medium text-zinc-400">
                    Ultra only
                  </span>
                </div>
                <div className="text-xs text-zinc-400">
                  Ads can’t be turned off separately any more. Upgrade to Ultra to remove them.
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
              className="relative inline-flex h-6 w-11 shrink-0 cursor-not-allowed rounded-full border-2 border-transparent bg-zinc-700"
            >
              <span className="pointer-events-none inline-block h-5 w-5 translate-x-0 transform rounded-full bg-white/70 shadow" />
            </button>
          </div>

          <div
            style={{
              borderRadius: 12,
              background: "rgba(251, 191, 36, 0.07)",
              boxShadow: "inset 0 0 0 1px rgba(251, 191, 36, 0.2)",
            }}
            className="flex flex-col gap-3 p-3"
          >
            <div className="flex items-start gap-2">
              <Sparkles aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-zinc-100">
                  <span>math_games Ultra</span>
                  <span className="rounded-full border border-amber-400/30 bg-amber-400/15 px-2 py-0.5 text-[10px] font-semibold text-amber-200">
                    $1
                  </span>
                </div>
                <div className="text-xs text-zinc-400">
                  No ads, plus more features as they ship.
                </div>
              </div>
            </div>
            <button
              type="button"
              disabled
              aria-disabled="true"
              title="Checkout is not open yet"
              className="inline-flex cursor-not-allowed items-center justify-center gap-1.5 rounded-lg bg-amber-400/25 px-3 py-2 text-xs font-semibold text-amber-100/70"
            >
              Pay $1 — coming soon
            </button>
            <p className="text-[10.5px] leading-relaxed text-zinc-500">
              Checkout isn’t open yet. The button unlocks when Ultra launches.
            </p>
          </div>
        </section>
        </div>
        </div>
      </div>
    </div>
  );
}
