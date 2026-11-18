export interface SystemFontOption {
  id: string;
  name: string;
  family: string;
  category: "Standard" | "Retro Gaming" | "Sci-Fi" | "Playful" | "School" | "Developer" | "Unique";
  description: string;
  sample: string;
  badge?: string;
}

export const SYSTEM_FONTS: SystemFontOption[] = [
  {
    id: "geist",
    name: "Geist Modern",
    family: "'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    category: "Standard",
    description: "Default sleek, clean, modern UI typeface designed for precision",
    sample: "2 + 2 = 4 · Sleek & Modern",
    badge: "Default",
  },
  {
    id: "press-start",
    name: "Press Start 2P",
    family: "'Press Start 2P', monospace",
    category: "Retro Gaming",
    description: "Authentic 8-bit arcade pixel font from vintage coin-op cabinets",
    sample: "INSERT COIN · HIGH SCORE: 99990",
    badge: "8-Bit Arcade",
  },
  {
    id: "vt323",
    name: "VT323 Terminal",
    family: "'VT323', monospace",
    category: "Retro Gaming",
    description: "Green-screen CRT monitor font with classic phosphor glow vibe",
    sample: "C:\\> RUN MATH_GAMES.EXE --UNBLOCKED",
    badge: "CRT Terminal",
  },
  {
    id: "orbitron",
    name: "Orbitron Cyber",
    family: "'Orbitron', sans-serif",
    category: "Sci-Fi",
    description: "Geometric futuristic display font built for racing, cyber and space",
    sample: "POLYTRACK SPEEDWAY 3000 MPH",
    badge: "Futuristic",
  },
  {
    id: "comic-neue",
    name: "Comic Neue",
    family: "'Comic Neue', cursive, sans-serif",
    category: "Playful",
    description: "Upgraded casual comic font with bouncy charm and great readability",
    sample: "Study break time! Let's play some games :D",
    badge: "Casual",
  },
  {
    id: "fredoka",
    name: "Fredoka Bubbly",
    family: "'Fredoka', sans-serif",
    category: "Playful",
    description: "Super soft, round and friendly bubble font for casual gaming",
    sample: "Super fun puzzle & racing games!",
    badge: "Bubbly",
  },
  {
    id: "caveat",
    name: "Caveat Chalkboard",
    family: "'Caveat', cursive",
    category: "School",
    description: "Handwritten classroom blackboard and math notebook doodle style",
    sample: "Calculus homework: Page 42, #1-15 (Play Polytrack first)",
    badge: "Classroom",
  },
  {
    id: "geist-mono",
    name: "Geist Mono",
    family: "'Geist Mono', 'Fira Code', 'JetBrains Mono', monospace",
    category: "Developer",
    description: "Strict fixed-width developer font for code hackers & terminal fans",
    sample: "const unblocked = games.filter(g => g.verified);",
    badge: "Code",
  },
  {
    id: "bungee",
    name: "Bungee Block",
    family: "'Bungee', cursive, sans-serif",
    category: "Unique",
    description: "Heavy blocky arcade sign typeface that packs huge visual punch",
    sample: "TURBO DRIFT RACING",
    badge: "Heavy",
  },
  {
    id: "creepster",
    name: "Creepster Horror",
    family: "'Creepster', cursive",
    category: "Unique",
    description: "Ghoulish dripping comic horror font for spooky game nights",
    sample: "Five Nights & Haunted Maze Run!",
    badge: "Spooky",
  },
];

export const FONT_STORAGE_KEY = "polytrack_system_font";
export const DEFAULT_FONT_ID = "geist";

export function getStoredSystemFont(): string {
  if (typeof window === "undefined") return DEFAULT_FONT_ID;
  return localStorage.getItem(FONT_STORAGE_KEY) || DEFAULT_FONT_ID;
}

export function applySystemFont(fontId: string): void {
  if (typeof window === "undefined") return;
  const font = SYSTEM_FONTS.find((f) => f.id === fontId) || SYSTEM_FONTS[0];
  document.documentElement.style.setProperty("--app-font", font.family);
  document.body.style.fontFamily = font.family;
  try {
    localStorage.setItem(FONT_STORAGE_KEY, font.id);
  } catch {
    // Ignore storage quota or disabled storage
  }
}

export function initSystemFont(): void {
  const fontId = getStoredSystemFont();
  applySystemFont(fontId);
}
