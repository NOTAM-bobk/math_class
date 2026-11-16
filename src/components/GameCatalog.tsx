import * as React from "react";
import { Search, Play, Gamepad2, Clock3, RotateCcw, X, Flame, Sparkles, SlidersHorizontal, Check, Star, Bug, CheckCircle2, Smartphone } from "lucide-react";
import { loadBuggyGameIds, onBuggyGamesChange, saveBuggyGameIds } from "@/lib/buggyGames";
import { loadVerifiedGameIds, onVerifiedGamesChange, saveVerifiedGameIds } from "@/lib/verifiedGames";
import { loadNotMobileGameIds, onNotMobileGamesChange, saveNotMobileGameIds } from "@/lib/notMobileGames";
import { loadBlockedGameIds, onBlockedGamesChange, saveBlockedGameIds, getRandomBlockedEmoji } from "@/lib/blockedGames";
import { loadGameStats, recordGameClick, loadGameFlags } from "@/lib/hubApi";

const RECENT_GAMES_KEY = "polytrack_recent_games";
const RECENT_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;
const MAX_RECENT_GAMES = 6;
const SEARCH_PARAM = "q";
const CATEGORY_PARAM = "c";

const CHIP_STYLE: React.CSSProperties = {
  borderRadius: 36,
  background: "rgba(255, 255, 255, 0.04)",
  boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.02), inset 0 1px 0 0 rgba(255, 255, 255, 0.04)",
};

const FAVORITES_GAMES_KEY = "polytrack_favorite_games";

function loadFavorites(): string[] {
  try {
    const raw = localStorage.getItem(FAVORITES_GAMES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : [];
  } catch {
    return [];
  }
}

export const CATEGORY_FILTERS = [
  { id: "all", label: "All Games" },
  { id: "favorites", label: "⭐ Favorites" },
  { id: "editors", label: "✨ Editor’s Pick" },
  { id: "trending", label: "🔥 Trending" },
  { id: "flash", label: "⚡ Flash" },
  { id: "action", label: "⚔️ Action" },
  { id: "driving", label: "🏎️ Driving" },
  { id: "sports", label: "🏈 Sports" },
  { id: "arcade", label: "🕹️ Arcade" },
  { id: "puzzle", label: "🧩 Puzzle" },
  { id: "casual", label: "🎮 Casual" },
] as const;

export type SpecialFilterId = "buggy" | "blocked";
export type CategoryId = (typeof CATEGORY_FILTERS)[number]["id"] | SpecialFilterId;

type SortOption = "popular" | "featured" | "recent" | "az" | "default";

const DEFAULT_SORT: SortOption = "popular";

const SORT_OPTIONS: { id: SortOption; label: string }[] = [
  { id: "popular", label: "Most played" },
  { id: "featured", label: "Featured first" },
  { id: "recent", label: "Recently played" },
  { id: "az", label: "Name: A to Z" },
  { id: "default", label: "Default order" },
];

function initialSortOption(): SortOption {
  try {
    const sort = new URLSearchParams(window.location.search).get("sort");
    if (sort && SORT_OPTIONS.some((option) => option.id === sort)) {
      return sort as SortOption;
    }
  } catch {}
  return DEFAULT_SORT;
}

type RecentGame = { id: string; playedAt: number };

function loadRecentGames(): RecentGame[] {
  try {
    const raw = localStorage.getItem(RECENT_GAMES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const cutoff = Date.now() - RECENT_WINDOW_MS;
    return parsed
      .filter(
        (entry): entry is RecentGame =>
          !!entry &&
          typeof entry.id === "string" &&
          typeof entry.playedAt === "number" &&
          entry.playedAt > cutoff
      )
      .slice(0, MAX_RECENT_GAMES);
  } catch {
    return [];
  }
}

function initialSearchQuery() {
  try {
    return new URLSearchParams(window.location.search).get(SEARCH_PARAM) ?? "";
  } catch {
    return "";
  }
}

function initialCategory(): CategoryId {
  try {
    const param = new URLSearchParams(window.location.search).get(CATEGORY_PARAM);
    if (param && (CATEGORY_FILTERS.some((c) => c.id === param) || param === "buggy" || param === "blocked")) {
      return param as CategoryId;
    }
  } catch {}
  return "all";
}

export interface GameItem {
  id: string;
  name: string;
  url: string;
  description: string;
  tags: string[];
  featured?: boolean;
  version?: string;
  disabled?: boolean;
  badge?: string;
  badgeColor?: string;
  clicks?: number;
  editorsPick?: boolean;
  errorBug?: boolean;
  verified?: boolean;
}

function nameKey(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function urlKey(url: string) {
  return url.trim().toLowerCase().replace(/\/+$/, "");
}

function isSubdomainUrl(url: string) {
  try {
    return new URL(url, "https://benlaunches.icu").hostname.endsWith(".benlaunches.icu");
  } catch {
    return false;
  }
}

function sameGame(a: GameItem, b: GameItem) {
  if (a.id === b.id) return true;
  if (urlKey(a.url) === urlKey(b.url)) return true;
  const x = nameKey(a.name);
  const y = nameKey(b.name);
  if (!x || !y) return false;

  // Keep numbered sequels (e.g. Monster Tracks 2) distinct from the original title.
  const sequelNumber = (name: string) => name.match(/[0-9]+$/)?.[0] ?? "";
  if (sequelNumber(x) !== sequelNumber(y)) return false;

  return x === y || x.startsWith(y) || y.startsWith(x) || x.includes(y) || y.includes(x);
}

function preferredUrl(current: string, incoming: string) {
  if (!incoming || incoming === "#") return current;
  if (isSubdomainUrl(current) && !isSubdomainUrl(incoming)) return current;
  return incoming;
}

export function mergeCatalog(defaults: GameItem[], loaded: GameItem[]): GameItem[] {
  const remaining = [...loaded];
  const merged: GameItem[] = [];

  for (const item of defaults) {
    const index = remaining.findIndex((entry) => sameGame(item, entry));
    if (index === -1) {
      merged.push(item);
      continue;
    }
    const [match] = remaining.splice(index, 1);
    merged.push({
      ...item,
      url: preferredUrl(item.url, match.url),
      description:
        match.description && !match.description.includes("from games catalog")
          ? match.description
          : item.description,
      disabled: match.disabled ?? item.disabled,
      editorsPick: match.editorsPick ?? item.editorsPick,
      errorBug: match.errorBug ?? item.errorBug,
      verified: match.verified ?? item.verified
    });
  }

  for (const item of remaining) {
    if (!merged.some((entry) => sameGame(entry, item))) merged.push(item);
  }

  return merged;
}

export const DEFAULT_GAMES: GameItem[] = [
  {
    id: "polytrack-050",
    name: "PolyTrack v0.5.0",
    url: "/0.5.0/index.html",
    description: "Latest release with new tracks, realistic physics, and custom liveries.",
    tags: ["Latest", "3D Physics", "Tracks", "Driving", "Customization"],
    featured: true,
    version: "v0.5.0",
    badge: "FLAGSHIP",
    badgeColor: "amber"
  },
  {
    id: "game-retro-bowl",
    name: "Retro Bowl",
    url: "/games/retro-bowl.html",
    description: "Manage your NFL team, draft players, call the plays on offense, and win the championship in this retro football sim.",
    tags: ["Sports", "Football", "Retro", "Arcade", "Management"],
    editorsPick: true
  },
  {
    id: "game-drive-mad",
    name: "Drive Mad",
    url: "/games/drive-mad.html",
    description: "Navigate wild 3D obstacle courses balancing throttle, stunts, jumps, and vehicle physics.",
    tags: ["Driving", "3D Physics", "Stunts", "Obstacles"],
    editorsPick: true
  },
  {
    id: "game-moto-x3m",
    name: "Moto X3M",
    url: "/games/moto-x3m.html",
    description: "Race your motorbike through hazardous stunt tracks, loops, saw blades, and explosive obstacles.",
    tags: ["Driving", "Stunts", "Racing", "Arcade"]
  },
  {
    id: "game-slope",
    name: "Slope",
    url: "https://slope.benlaunches.icu/",
    description: "Guide a ball down a fast, winding 3D slope and dodge obstacles for as long as you can.",
    tags: ["Arcade", "3D", "Skill", "Reflex"]
  },
  {
    id: "game-drift-boss",
    name: "Drift Boss",
    url: "/games/drift-boss.html",
    description: "Time one-touch drifts around hairpin corners along narrow sky-high roadways without falling off.",
    tags: ["Driving", "Drift", "Racing", "Skill"]
  },
  {
    id: "game-tunnel-rush",
    name: "Tunnel Rush",
    url: "/games/tunnel-rush.html",
    description: "Blaze down spinning 3D neon tunnels dodging high-speed barriers in this intense reflex test.",
    tags: ["Action", "3D", "Reflex", "Arcade"]
  },
  {
    id: "game-ovo",
    name: "OvO",
    url: "/games/ovo.html",
    description: "Fast-paced parkour speedrunning platformer: slide, dive, and wall-jump through puzzle stages.",
    tags: ["Arcade", "Parkour", "Platformer", "Speedrun"]
  },
  {
    id: "game-stickman-hook",
    name: "Stickman Hook",
    url: "/games/stickman-hook.html",
    description: "Grapple, swing, and bounce across acrobatic levels with physics-based momentum.",
    tags: ["Arcade", "Physics", "Skill", "Stickman"]
  },
  {
    id: "game-doodle-jump",
    name: "Doodle Jump",
    url: "/games/doodle-jump.html",
    description: "Jump up floating platforms, dodge monsters, and aim for high scores in the legendary classic.",
    tags: ["Arcade", "Classic", "Retro", "Jumper"]
  },
  {
    id: "game-flappy-bird",
    name: "Flappy Bird",
    url: "/games/flappy-bird.html",
    description: "Tap to flap and guide your bird through green pipes in the notoriously challenging arcade hit.",
    tags: ["Arcade", "Retro", "Skill", "Classic"]
  },
  {
    id: "game-crossy-road",
    name: "Crossy Road",
    url: "/games/crossy-road.html",
    description: "Hop across busy highways, train tracks, and roaring rivers without getting squashed.",
    tags: ["Arcade", "Casual", "Endless", "Classic"]
  },
  {
    id: "game-tiny-fishing",
    name: "Tiny Fishing",
    url: "/games/tiny-fishing.html",
    description: "Cast your hook deep into the lake, catch rare fish, and upgrade your gear for bigger catches.",
    tags: ["Casual", "Fishing", "Upgrade", "Idle"]
  },
  {
    id: "game-cookie-clicker",
    name: "Cookie Clicker",
    url: "/games/cookie-clicker.html",
    description: "Bake cookies, hire grandmas, build factories, and construct an astronomical cookie empire.",
    tags: ["Casual", "Idle", "Clicker", "Management"],
    editorsPick: true
  },
  {
    id: "game-2048",
    name: "2048 Puzzle",
    url: "/games/2048.html",
    description: "Slide and combine matching numbered tiles on a 4x4 grid to reach the 2048 tile.",
    tags: ["Puzzle", "Logic", "Math", "Quick Play"]
  },
  {
    id: "game-bitlife",
    name: "BitLife Simulator",
    url: "/games/bitlife.html",
    description: "A branching text-based life simulator with hundreds of career, relationship, and crime paths.",
    tags: ["Casual", "Simulation", "RPG", "Choice"]
  },
  {
    id: "game-impossible-quiz",
    name: "Impossible Quiz",
    url: "/games/the-impossible-quiz.html",
    description: "110 devious questions with traps, trick answers, and wild logic puzzles.",
    tags: ["Puzzle", "Quiz", "Trivia", "Challenge"]
  },
  {
    id: "game-run3",
    name: "Run 3",
    url: "/games/clrun3.html",
    description: "Jump around space tunnels, rotate gravity, and unlock alien runners across cosmic pathways.",
    tags: ["Arcade", "Runner", "Platformer", "Space", "Physics"]
  },
  {
    id: "game-awsome-tanks",
    name: "Awsome Tanks",
    url: "/games/awsome-tanks.html",
    description: "Command a tank, blast enemy strongholds, and buy heavy cannon and armor upgrades.",
    tags: ["Action", "Tanks", "Shooter", "Upgrades"]
  },
  {
    id: "game-brawl-sim-3d",
    name: "Brawl Simulator 3D",
    url: "/games/clbrawlsimulator3d.html",
    description: "3D arena combat with custom fighters, combo attacks, and dynamic brawling action.",
    tags: ["Action", "3D Combat", "Arena", "Brawler"]
  },
  {
    id: "game-super-smash-flash",
    name: "Super Smash Flash",
    url: "/games/super-smash-flash.html",
    description: "Brawl as legendary fighters like Mario, Sonic, Goku, Link, and Mega Man in this iconic crossover.",
    tags: ["Flash", "Action", "Fighting", "Crossover"]
  },
  {
    id: "game-super-mario-63",
    name: "Super Mario 63",
    url: "/games/super-mario-63.html",
    description: "Masterpiece Flash adventure inspired by Super Mario 64 and Sunshine with the FLUDD water pack.",
    tags: ["Flash", "Adventure", "Mario", "Platformer"]
  },
  {
    id: "game-fancy-pants-adventures",
    name: "Fancy Pants Adventures",
    url: "/games/fancy-pants-adventures.html",
    description: "Sprint, slide, and flip through hand-drawn world stages with smooth parkour momentum.",
    tags: ["Flash", "Adventure", "Parkour", "Platformer"]
  },
  {
    id: "game-dad-n-me",
    name: "Dad 'n Me",
    url: "/games/dad-n-me.html",
    description: "Classic beat-'em-up brawler by Dan Paladin and Tom Fulp across the playground neighborhood.",
    tags: ["Flash", "Action", "Brawler", "Fighting"]
  },
  {
    id: "game-portal-flash",
    name: "Portal: The Flash Version",
    url: "/games/portal-flash.html",
    description: "40 mind-bending test chambers with aperture physics, lasers, and dual portal guns.",
    tags: ["Flash", "Puzzle", "Logic", "Sci-Fi"]
  },
  {
    id: "game-henry-stickmin-prison",
    name: "Henry Stickmin: Escaping the Prison",
    url: "/games/henry-stickmin-escaping-the-prison.html",
    description: "Help Henry bust out of prison with crazy gadgets, stealth, and hilarious fail scenes.",
    tags: ["Flash", "Adventure", "Stickman", "Funny"]
  },
  {
    id: "game-henry-stickmin",
    name: "Henry Stickmin: Breaking the Bank",
    url: "/games/henry-stickmin-breaking-the-bank.html",
    description: "Choose wild and hilarious methods to break into the desert bank vault with Henry.",
    tags: ["Flash", "Adventure", "Stickman", "Funny"]
  },
  {
    id: "game-stick-rpg",
    name: "Stick RPG",
    url: "/games/stick-rpg.html",
    description: "Live a stickman's life: work corporate jobs, study, skateboard, and build wealth in Stick City.",
    tags: ["Flash", "Casual", "Life Sim", "RPG", "Stickman"]
  },
  {
    id: "game-bloons-td4",
    name: "Bloons Tower Defense 4",
    url: "/games/bloons-td4.html",
    description: "Place dart monkeys, tack shooters, and super monkeys to pop incoming bloon waves.",
    tags: ["Flash", "Puzzle", "Tower Defense", "Strategy", "Monkeys"]
  },
  {
    id: "game-bloons-super-monkey",
    name: "Bloons Super Monkey",
    url: "/games/bloons-super-monkey.html",
    description: "Take to the skies as Super Monkey and blast thousands of bloons with laser and plasma beams.",
    tags: ["Flash", "Action", "Shooter", "Arcade"]
  },
  {
    id: "game-worlds-hardest-game",
    name: "The World's Hardest Game",
    url: "/games/the-worlds-hardest-game.html",
    description: "Guide your red square through 30 treacherous levels. Avoid the blue balls at all costs.",
    tags: ["Flash", "Arcade", "Skill", "Hard", "Classic"]
  },
  {
    id: "game-learn-to-fly",
    name: "Learn to Fly",
    url: "/games/learn-to-fly.html",
    description: "Upgrade your glider, rockets, and ramp to help a determined penguin soar over Antarctica.",
    tags: ["Flash", "Casual", "Upgrade", "Launcher"],
    editorsPick: true
  },
  {
    id: "game-papas-pizzeria",
    name: "Papa's Pizzeria",
    url: "/games/papas-pizzeria.html",
    description: "Run Papa Louie's pizzeria: take orders, top pizzas, bake to perfection, and cut slices.",
    tags: ["Flash", "Casual", "Cooking", "Management"]
  },
  {
    id: "game-bloxorz",
    name: "Bloxorz",
    url: "/games/bloxorz.html",
    description: "Roll the 3D rectangular block across challenging puzzle stages and into the square hole.",
    tags: ["Flash", "Puzzle", "3D Puzzle", "Logic", "Brain"]
  },
  {
    id: "game-age-of-war",
    name: "Age of War",
    url: "/games/age-of-war.html",
    description: "Wage war across five ages of evolution from primitive cavemen to futuristic cyborgs.",
    tags: ["Flash", "Puzzle", "Strategy", "Defense", "Evolution"]
  },
  {
    id: "game-duck-life",
    name: "Duck Life",
    url: "/games/duck-life.html",
    description: "Train your duck in running, swimming, and flying to win races and save the farm.",
    tags: ["Flash", "Casual", "Training", "Racing", "Pets"]
  },
  {
    id: "game-duck-life-2",
    name: "Duck Life 2: World Champion",
    url: "/games/duck-life-2.html",
    description: "Train your champion duck in running, flying, swimming, and climbing to win world trophies.",
    tags: ["Flash", "Casual", "Training", "Racing", "Pets"]
  },
  {
    id: "game-riddle-school",
    name: "Riddle School",
    url: "/games/riddle-school.html",
    description: "Help Phil escape from a boring school day in this classic point-and-click puzzle adventure.",
    tags: ["Flash", "Puzzle", "Escape", "School"]
  },
  {
    id: "game-riddle-school-3",
    name: "Riddle School 3",
    url: "/games/riddle-school-3.html",
    description: "Phil's third school escape with fun puzzles, clever inventory combinations, and snappy humor.",
    tags: ["Flash", "Puzzle", "Escape", "School"]
  },
  {
    id: "site-unblocked-movies",
    name: "Unblocked Movies",
    url: "https://nxsha.space/",
    description: "Watch movies and shows in your browser.",
    tags: ["Casual", "Movies", "Streaming", "Media"]
  },
  {
    id: "game-monster-track",
    name: "Monster Track",
    url: "https://monster.benlaunches.icu/",
    description: "Take a monster truck through off-road courses.",
    tags: ["Driving", "4x4", "Offroad", "Physics"]
  },
  {
    id: "game-monster-tracks-2",
    name: "Monster Tracks 2",
    url: "https://awesometank2.benlaunches.icu/",
    description: "Drive monster trucks through off-road courses and obstacles.",
    tags: ["Driving", "Monster Truck", "Offroad", "Physics"]
  },
  {
    id: "game-hexgl",
    name: "HexGL",
    url: "https://hexgl.poly2.benlaunches.icu",
    description: "High-speed futuristic 3D sci-fi racing craft built with WebGL. Master tight turns and boost pads.",
    tags: ["Driving", "Racing", "Sci-Fi", "3D", "Speed"]
  },
  {
    id: "game-cut-the-rope",
    name: "Cut the Rope",
    url: "https://cutthe.benlaunches.icu",
    description: "Cut ropes, pop bubbles, and collect golden stars to feed delicious candy to Om Nom.",
    tags: ["Puzzle", "Physics", "Classic", "Logic"]
  },
  {
    id: "game-geometry-dash",
    name: "Geometry Dash",
    url: "/games/geometry-dash.html",
    description: "Jump, fly, and flip your way through dangerous geometric passages and spiky obstacles to the beat.",
    tags: ["Arcade", "Rhythm", "Platformer", "Skill", "Hard"],
    editorsPick: true
  },
  {
    id: "game-basket-random",
    name: "Basket Random",
    url: "/games/basket-random.html",
    description: "Hilarious one-button ragdoll 2-player basketball with bouncy balls, changing courts, and wild physics.",
    tags: ["Sports", "Basketball", "Physics", "2 Player", "Funny"]
  },
  {
    id: "game-basketball-stars",
    name: "Basketball Stars",
    url: "/games/basketball-stars.html",
    description: "Dribble, shoot 3-pointers, perform rim-rattling dunks, and steal the ball in 1-on-1 basketball matchups.",
    tags: ["Sports", "Basketball", "2 Player", "Skill", "Tournament"]
  },
  {
    id: "game-getaway-shootout",
    name: "Getaway Shootout",
    url: "/games/getaway-shootout.html",
    description: "Race three opponents to the getaway vehicle using physics-based jumping and an arsenal of wacky weapons.",
    tags: ["Action", "Physics", "2 Player", "Shooter", "Multiplayer"]
  },
  {
    id: "game-bad-ice-cream",
    name: "Bad Ice-Cream",
    url: "/games/bad-ice-cream.html",
    description: "Nitrome's frosty classic: build and break ice block walls, collect delicious fruit, and avoid roaming enemies.",
    tags: ["Arcade", "Retro", "Puzzle", "Classic", "2 Player"]
  },
  {
    id: "game-iron-snout",
    name: "Iron Snout",
    url: "/games/iron-snout.html",
    description: "Fast and furious martial arts action as a pig fighting off hordes of axe-wielding wolves with kicks and punches.",
    tags: ["Action", "Combat", "Fighting", "Arcade", "Reflex"]
  },
  {
    id: "game-we-become-what-we-behold",
    name: "We Become What We Behold",
    url: "/games/we-become-what-we-behold.html",
    description: "A thought-provoking 5-minute game by Nicky Case about media cycles, viral cameras, and how stories amplify differences.",
    tags: ["Casual", "Indie", "Story", "Short", "Simulation"]
  },
  {
    id: "game-happy-wheels",
    name: "Happy Wheels",
    url: "/games/happy-wheels.html",
    description: "Jim Bonacci's legendary physics ragdoll obstacle course: navigate lethal traps, mines, and spikes across dangerous tracks.",
    tags: ["Action", "Physics", "Obstacles", "Classic", "Funny"]
  },
  {
    id: "game-duck-life-3",
    name: "Duck Life 3: Evolution",
    url: "/games/duck-life-3.html",
    description: "Choose your duck's genetic breed, train racing attributes, and evolve into a flying, running champion.",
    tags: ["Casual", "Training", "Racing", "Pets", "Upgrade"]
  },
  {
    id: "game-vex-4",
    name: "Vex 4",
    url: "/games/vex-4.html",
    description: "Guide your agile stickman through deadly obstacle courses, lasers, buzzsaws, and high-speed parkour challenges.",
    tags: ["Arcade", "Parkour", "Platformer", "Skill", "Stickman"]
  },
  {
    id: "game-ducklings",

    name: "Ducklings.io",
    url: "https://ducklings.io/",
    description: "Rescue ducklings and grow your nest.",
    tags: ["Casual", "Multiplayer"],
    disabled: true
  },
  {
    id: "game-snake",
    name: "Retro Snake",
    url: "https://snakegame.org/",
    description: "The classic snake arcade game.",
    tags: ["Arcade", "Retro", "Classic"],
    disabled: true
  },
  {
    id: "game-block-blast",
    name: "Block Blast",
    url: "/games/block-blast.html",
    description: "Clear rows and columns in this block puzzle.",
    tags: ["Puzzle", "Blocks", "Casual"],
    disabled: true
  },
  {
    id: "game-eaglercraft",
    name: "Eaglercraft",
    url: "https://eaglercraft.com/",
    description: "Browser-based Minecraft with survival and multiplayer.",
    tags: ["Casual", "Sandbox", "Minecraft", "Multiplayer"],
    disabled: true
  }
];

function matchesCategory(game: GameItem, categoryId: CategoryId): boolean {
  if (categoryId === "all") return true;
  const tagsLower = game.tags.map((t) => t.toLowerCase());
  const nameLower = game.name.toLowerCase();

  switch (categoryId) {
    case "flash":
      return (
        tagsLower.includes("flash") ||
        game.url.toLowerCase().includes("flash") ||
        game.url.toLowerCase().includes("swf")
      );
    case "action":
      return (
        tagsLower.some((t) =>
          [
            "action",
            "combat",
            "3d combat",
            "arena",
            "brawler",
            "shooter",
            "tanks",
            "fighting",
            "crossover"
          ].includes(t)
        ) ||
        nameLower.includes("smash") ||
        nameLower.includes("brawl") ||
        nameLower.includes("tank") ||
        nameLower.includes("shootout") ||
        nameLower.includes("snout") ||
        nameLower.includes("happy wheels")
      );
    case "driving":
      return (
        tagsLower.some((t) =>
          [
            "driving",
            "racing",
            "tracks",
            "stunts",
            "drift",
            "4x4",
            "offroad",
            "cars",
            "sci-fi"
          ].includes(t)
        ) ||
        nameLower.includes("drive") ||
        nameLower.includes("moto") ||
        nameLower.includes("drift") ||
        nameLower.includes("hexgl") ||
        nameLower.includes("polytrack")
      );
    case "sports":
      return (
        tagsLower.some((t) => ["sports", "football", "basketball", "soccer"].includes(t)) ||
        nameLower.includes("bowl") ||
        nameLower.includes("basket")
      );
    case "arcade":
      return (
        tagsLower.some((t) =>
          [
            "arcade",
            "retro",
            "classic",
            "runner",
            "platformer",
            "skill",
            "speedrun",
            "parkour",
            "jumper",
            "rhythm"
          ].includes(t)
        ) ||
        nameLower.includes("jump") ||
        nameLower.includes("bird") ||
        nameLower.includes("run") ||
        nameLower.includes("ovo") ||
        nameLower.includes("hook") ||
        nameLower.includes("geometry") ||
        nameLower.includes("ice-cream") ||
        nameLower.includes("vex")
      );
    case "puzzle":
      return (
        tagsLower.some((t) =>
          [
            "puzzle",
            "logic",
            "quiz",
            "trivia",
            "brain",
            "challenge",
            "escape",
            "strategy",
            "tower defense",
            "math"
          ].includes(t)
        ) ||
        nameLower.includes("quiz") ||
        nameLower.includes("portal") ||
        nameLower.includes("school") ||
        nameLower.includes("bloxorz") ||
        nameLower.includes("2048") ||
        nameLower.includes("bloons") ||
        nameLower.includes("rope") ||
        nameLower.includes("cut the rope")
      );
    case "casual":
      return (
        tagsLower.some((t) =>
          [
            "casual",
            "idle",
            "clicker",
            "simulation",
            "cooking",
            "rpg",
            "pets",
            "training",
            "management",
            "fishing"
          ].includes(t)
        ) ||
        nameLower.includes("cookie") ||
        nameLower.includes("fishing") ||
        nameLower.includes("papa") ||
        nameLower.includes("duck") ||
        nameLower.includes("bitlife") ||
        nameLower.includes("behold")
      );
    default:
      return true;
  }
}

function escapeRegExp(value: string) {
  const meta = new Set([".", "*", "+", "?", "^", "$", "{", "}", "(", ")", "|", "[", "]", "\\"]);
  return [...value].map((character) => (meta.has(character) ? `\\${character}` : character)).join("");
}

function HighlightText({ text, query }: { text: string; query: string }) {
  const terms = query.trim().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return <>{text}</>;

  const termSet = new Set(terms.map((term) => term.toLocaleLowerCase()));
  const matcher = new RegExp(
    `(${[...terms].sort((a, b) => b.length - a.length).map(escapeRegExp).join("|")})`,
    "gi"
  );

  return (
    <>
      {text.split(matcher).map((part, index) =>
        termSet.has(part.toLocaleLowerCase()) ? (
          <mark
            key={`${index}-${part}`}
            className="rounded-sm bg-amber-300 px-0.5 text-zinc-950"
          >
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}

function VerifiedBadge() {
  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const closeOnOutside = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  const canHover = () =>
    typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  return (
    <span ref={rootRef} className="relative inline-flex shrink-0 items-center">
      <button
        type="button"
        aria-label="Verified game — what does this mean?"
        aria-expanded={open}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setOpen((value) => !value);
        }}
        onMouseEnter={() => {
          if (canHover()) setOpen(true);
        }}
        onMouseLeave={() => {
          if (canHover()) setOpen(false);
        }}
        className="inline-flex cursor-help items-center justify-center text-emerald-400"
      >
        <CheckCircle2
          aria-hidden="true"
          className="h-3.5 w-3.5 fill-emerald-500/20 text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.35)]"
        />
      </button>
      {open && (
        <span
          role="tooltip"
          className="absolute left-1/2 top-full z-30 mt-1.5 w-40 -translate-x-1/2 rounded-lg border border-white/10 bg-[#1c1c1e] px-2 py-1.5 text-[10.5px] font-normal leading-snug text-zinc-300 shadow-[0_8px_24px_rgba(0,0,0,0.6)] sm:w-44"
        >
          Checked by an admin — this game loads and plays.
        </span>
      )}
    </span>
  );
}

function GameCard({
  game,
  isRecent,
  isPopular,
  isFavorite,
  isBuggy,
  isVerified,
  isNotMobile,
  isBlocked,
  blockedEmoji,
  searchQuery,
  onPlay,
  onToggleFavorite
}: {
  game: GameItem;
  isRecent: boolean;
  isPopular: boolean;
  isFavorite: boolean;
  isBuggy: boolean;
  isVerified: boolean;
  isNotMobile: boolean;
  isBlocked: boolean;
  blockedEmoji: string;
  searchQuery: string;
  onPlay: (game: GameItem) => void;
  onToggleFavorite: (id: string, event?: React.MouseEvent) => void;
}) {
  return (
    <article
      key={game.id}
      className={`game-card group relative flex w-full flex-col overflow-hidden ${
        game.disabled ? "opacity-80" : ""
      }`}
    >
      <div className="flex flex-1 flex-col p-3 sm:p-5">
        <div className="mb-1.5 flex items-start justify-between gap-2 sm:mb-2">
          <h4 className="flex min-w-0 flex-wrap items-center gap-2 text-base font-semibold text-zinc-100">
            {game.disabled ? (
              <span className="truncate">
                <HighlightText text={game.name} query={searchQuery} />
              </span>
            ) : (
              <a
                href={game.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => onPlay(game)}
                className="game-card-link min-w-0 truncate transition-colors group-hover:text-white"
              >
                <HighlightText text={game.name} query={searchQuery} />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            )}
            {isVerified && <VerifiedBadge />}
            {game.editorsPick && (
              <span
                title="Editor's Pick"
                style={CHIP_STYLE}
                className="shrink-0 px-2 py-0.5 text-[11px] font-medium text-amber-300"
              >
                Editor's Pick
              </span>
            )}
            {isBuggy && (
              <span
                title="Known bug or issue reported for this game"
                style={{
                  ...CHIP_STYLE,
                  background: "linear-gradient(135deg, rgba(239, 68, 68, 0.22), rgba(185, 28, 28, 0.16))",
                  border: "1px solid rgba(239, 68, 68, 0.45)",
                  color: "#fca5a5"
                }}
                className="inline-flex shrink-0 items-center gap-1 px-2 py-0.5 text-[10.5px] font-semibold tracking-wide font-mono"
              >
                <Bug aria-hidden="true" className="h-3 w-3 text-red-400 shrink-0" />
                <span>error:bug</span>
              </span>
            )}
            {isNotMobile && (
              <span
                title="Not optimized for mobile — best played on desktop"
                style={{
                  ...CHIP_STYLE,
                  background: "linear-gradient(135deg, rgba(245, 158, 11, 0.22), rgba(180, 83, 9, 0.16))",
                  border: "1px solid rgba(245, 158, 11, 0.4)",
                  color: "#fcd34d"
                }}
                className="inline-flex shrink-0 items-center gap-1 px-2 py-0.5 text-[10.5px] font-semibold tracking-wide font-mono"
              >
                <Smartphone aria-hidden="true" className="h-3 w-3 text-amber-400 shrink-0" />
                <span>no mobile</span>
              </span>
            )}
            {isBlocked && (
              <span
                title="Blocked site or game"
                style={{
                  ...CHIP_STYLE,
                  background: "linear-gradient(135deg, rgba(168, 85, 247, 0.22), rgba(126, 34, 206, 0.16))",
                  border: "1px solid rgba(168, 85, 247, 0.45)",
                  color: "#e9d5ff"
                }}
                className="inline-flex shrink-0 items-center gap-1 px-2 py-0.5 text-[10.5px] font-semibold tracking-wide font-mono"
              >
                <span>Blocked:{blockedEmoji}</span>
              </span>
            )}
            {isRecent && (
              <span
                title="You played this in the last week"
                style={CHIP_STYLE}
                className="shrink-0 px-2 py-0.5 text-[11px] font-medium text-amber-300"
              >
                Recent
              </span>
            )}
            {isPopular && (
              <span className="shrink-0" title="Most played">
                <Flame
                  aria-hidden="true"
                  className="h-3.5 w-3.5 fill-orange-400/20 text-orange-400"
                />
                <span className="sr-only">Most played</span>
              </span>
            )}
          </h4>
          <div className="relative z-20 flex shrink-0 items-center gap-1.5">
            {game.version && (
              <span
                style={CHIP_STYLE}
                className="shrink-0 px-2.5 py-0.5 font-mono text-[11px] text-[#caccd2]"
              >
                {game.version}
              </span>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleFavorite(game.id, e);
              }}
              onMouseDown={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              aria-label={isFavorite ? `Remove ${game.name} from favorites` : `Add ${game.name} to favorites`}
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
              className="relative z-20 group/fav inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-zinc-400 transition-all hover:bg-white/[0.12] hover:text-amber-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400 active:scale-90"
            >
              <Star
                aria-hidden="true"
                className={`h-4 w-4 pointer-events-none transition-colors ${
                  isFavorite
                    ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]"
                    : "stroke-[1.75] text-zinc-400 group-hover/fav:text-amber-300"
                }`}
              />
            </button>
          </div>
        </div>

        <p className="mb-2.5 line-clamp-2 flex-1 text-[12.5px] leading-[17px] text-[#8B9099] sm:mb-4 sm:text-[13px] sm:leading-[18px]">
          <HighlightText text={game.description} query={searchQuery} />
        </p>

        <div className="mt-auto flex items-center justify-between gap-2 border-t border-white/[0.06] pt-2.5 sm:gap-3 sm:pt-3">
          <div className="flex min-w-0 flex-nowrap items-center gap-1.5 overflow-hidden sm:flex-wrap">
            {game.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                style={CHIP_STYLE}
                className="inline-flex h-5 shrink-0 items-center px-2 text-[10.5px] leading-[13px] text-[#caccd2] sm:h-6 sm:px-2.5 sm:text-[11px] sm:leading-[14px]"
              >
                <HighlightText text={tag} query={searchQuery} />
              </span>
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {!game.disabled && (game.clicks || 0) > 0 && (
              <span
                className="text-[10px] font-mono tabular-nums text-zinc-500"
                title={`${game.clicks} ${game.clicks === 1 ? "play" : "plays"}`}
              >
                {game.clicks} {game.clicks === 1 ? "play" : "plays"}
              </span>
            )}
            {game.disabled ? (
              <span
                style={CHIP_STYLE}
                className="inline-flex h-7 items-center justify-center gap-1.5 px-3 text-xs font-medium text-zinc-400"
              >
                <Clock3 className="h-3 w-3" aria-hidden="true" />
                <span>Coming soon</span>
              </span>
            ) : (
              <span
                aria-hidden="true"
                className="inline-flex h-7 items-center justify-center gap-1.5 rounded-full bg-white px-3.5 text-xs font-semibold text-zinc-950 shadow-sm transition-colors group-hover:bg-zinc-100"
              >
                <Play className="h-3 w-3 fill-current" />
                <span>Play</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export function GameCatalog({ showAdSpot = true }: { showAdSpot?: boolean }) {
  const [games, setGames] = React.useState<GameItem[]>(DEFAULT_GAMES);
  const [searchQuery, setSearchQuery] = React.useState(initialSearchQuery);
  const [selectedCategory, setSelectedCategory] = React.useState<CategoryId>(initialCategory);
  const [sortOption, setSortOption] = React.useState<SortOption>(initialSortOption);
  const [filterOpen, setFilterOpen] = React.useState(false);
  const filterRef = React.useRef<HTMLDivElement>(null);
  const [popularGameId, setPopularGameId] = React.useState<string | null>(null);
  const [recentIds, setRecentIds] = React.useState<Set<string>>(
    () => new Set(loadRecentGames().map((entry) => entry.id))
  );
  const [favoriteIds, setFavoriteIds] = React.useState<Set<string>>(() => new Set(loadFavorites()));
  const [buggyIds, setBuggyIds] = React.useState<Set<string>>(loadBuggyGameIds);

  React.useEffect(() => {
    return onBuggyGamesChange((updated) => setBuggyIds(updated));
  }, []);

  const [verifiedIds, setVerifiedIds] = React.useState<Set<string>>(loadVerifiedGameIds);

  React.useEffect(() => {
    return onVerifiedGamesChange((updated) => setVerifiedIds(updated));
  }, []);

  const [notMobileIds, setNotMobileIds] = React.useState<Set<string>>(loadNotMobileGameIds);

  React.useEffect(() => {
    return onNotMobileGamesChange((updated) => setNotMobileIds(updated));
  }, []);

  const [blockedIds, setBlockedIds] = React.useState<Set<string>>(loadBlockedGameIds);
  const [blockedEmoji] = React.useState<string>(() => getRandomBlockedEmoji());

  React.useEffect(() => {
    return onBlockedGamesChange((updated) => setBlockedIds(updated));
  }, []);

  // Fetch flags from Cloudflare backend so verified, bug & mobile tags show up on all devices
  React.useEffect(() => {
    let active = true;
    loadGameFlags()
      .then((flags) => {
        if (!active) return;
        saveVerifiedGameIds(flags.verified);
        saveBuggyGameIds(flags.buggy);
        saveNotMobileGameIds(flags.notMobile);
        saveBlockedGameIds(flags.blocked);
        setVerifiedIds(new Set(flags.verified));
        setBuggyIds(new Set(flags.buggy));
        setNotMobileIds(new Set(flags.notMobile));
        setBlockedIds(new Set(flags.blocked));
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const toggleFavorite = React.useCallback((id: string, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      try {
        localStorage.setItem(FAVORITES_GAMES_KEY, JSON.stringify(Array.from(next)));
      } catch {}
      return next;
    });
  }, []);
  const searchRef = React.useRef<HTMLInputElement>(null);

  const markGamePlayed = React.useCallback((id: string) => {
    const next = [
      { id, playedAt: Date.now() },
      ...loadRecentGames().filter((entry) => entry.id !== id)
    ].slice(0, MAX_RECENT_GAMES);
    setRecentIds(new Set(next.map((entry) => entry.id)));
    try {
      localStorage.setItem(RECENT_GAMES_KEY, JSON.stringify(next));
    } catch {
      // Storage can be unavailable in private mode; the game link still works.
    }
  }, []);

  React.useEffect(() => {
    fetch("/games/config.json", { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error("Config not found");
        return res.json();
      })
      .then((data) => {
        if (data && Array.isArray(data.games)) {
          const loaded: GameItem[] = data.games.map((g: any, idx: number) => ({
            id: `cfg-${g.subdomain || idx}`,
            name: g.name || "Game",
            url: g.url || "#",
            description: g.description || `${g.name} game from games catalog.`,
            tags: g.category ? [g.category.toUpperCase(), "Web"] : ["Catalog", "Web"],
            disabled: !!g.disabled,
            editorsPick: !!g.editorsPick,
            errorBug: !!g.errorBug || !!g.buggy,
            verified: !!g.verified
          }));

          setGames((prev) => mergeCatalog(prev, loaded));
        }
      })
      .catch(() => {});
  }, []);

  React.useEffect(() => {
    loadGameStats()
      .then((stats) => {
        if (!stats.length) return;
        const byId = new Map(stats.map((item) => [item.id, item]));
        const byUrl = new Map(stats.filter((item) => item.url).map((item) => [urlKey(item.url), item]));
        const byName = new Map(stats.map((item) => [nameKey(item.name), item]));
        setGames((current) =>
          current.map((game) => {
            const stat =
              byId.get(game.id) ||
              (game.url ? byUrl.get(urlKey(game.url)) : undefined) ||
              byName.get(nameKey(game.name));
            return stat ? { ...game, clicks: stat.clicks } : game;
          })
        );
        setPopularGameId(stats[0].id);
      })
      .catch(() => {});
  }, []);

  const handleGameClick = (game: GameItem) => {
    markGamePlayed(game.id);
    setGames((current) =>
      current.map((item) =>
        item.id === game.id ? { ...item, clicks: (item.clicks || 0) + 1 } : item
      )
    );
    setPopularGameId(game.id);
    recordGameClick({ id: game.id, name: game.name, url: game.url })
      .then((updated) => {
        if (!updated) return;
        setGames((current) =>
          current.map((item) =>
            item.id === game.id ? { ...item, clicks: updated.clicks } : item
          )
        );
        loadGameStats()
          .then((stats) => setPopularGameId(stats[0]?.id || null))
          .catch(() => {});
      })
      .catch(() => {});
  };

  // Keep search and category filter in the URL so filtered views can be shared or bookmarked.
  React.useEffect(() => {
    const url = new URL(window.location.href);
    if (searchQuery.trim()) url.searchParams.set(SEARCH_PARAM, searchQuery);
    else url.searchParams.delete(SEARCH_PARAM);

    if (selectedCategory && selectedCategory !== "all") {
      url.searchParams.set(CATEGORY_PARAM, selectedCategory);
    } else {
      url.searchParams.delete(CATEGORY_PARAM);
    }

    if (sortOption !== DEFAULT_SORT) url.searchParams.set("sort", sortOption);
    else url.searchParams.delete("sort");

    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  }, [searchQuery, selectedCategory, sortOption]);

  React.useEffect(() => {
    if (!filterOpen) return;
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setFilterOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setFilterOpen(false);
      }
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [filterOpen]);

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
      if (!searchRef.current) return;
      event.preventDefault();
      searchRef.current.focus();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Search runs on the server so the browser does not filter the whole catalog;
  // a failed request falls back to the local filter below.
  const [serverMatches, setServerMatches] = React.useState<GameItem[] | null>(null);
  const [serverSearching, setServerSearching] = React.useState(false);

  React.useEffect(() => {
    const query = searchQuery.trim();
    if (query.length < 2) {
      setServerMatches(null);
      setServerSearching(false);
      return;
    }

    const controller = new AbortController();
    setServerSearching(true);
    const timer = window.setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(query)}`, {
        signal: controller.signal,
        headers: { Accept: "application/json" },
      })
        .then((response) => (response.ok ? response.json() : Promise.reject(new Error("Search unavailable"))))
        .then((data) => {
          const remote: GameItem[] = Array.isArray(data.games) ? data.games : [];
          const localById = new Map(games.map((game) => [game.id, game]));
          setServerMatches(remote.map((game) => localById.get(game.id) ?? game));
        })
        .catch(() => {
          if (!controller.signal.aborted) setServerMatches(null);
        })
        .finally(() => {
          if (!controller.signal.aborted) setServerSearching(false);
        });
    }, 220);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [searchQuery, games]);

  const filteredGames = React.useMemo(() => {
    const trimmedQuery = searchQuery.trim();
    const usingServer = trimmedQuery.length >= 2 && serverMatches !== null;
    let list = usingServer ? serverMatches : games;
    if (selectedCategory === "favorites") {
      list = list.filter((game) => favoriteIds.has(game.id));
    } else if (selectedCategory === "editors") {
      list = list.filter((game) => !!game.editorsPick);
    } else if (selectedCategory === "trending") {
      list = list.filter((game) => popularGameId === game.id);
    } else if (selectedCategory === "buggy") {
      list = list.filter((game) => buggyIds.has(game.id) || !!game.errorBug);
    } else if (selectedCategory === "blocked") {
      list = list.filter((game) => blockedIds.has(game.id));
    } else if (selectedCategory !== "all") {
      list = list.filter((game) => matchesCategory(game, selectedCategory));
    }
    if (usingServer || !trimmedQuery) return list;
    const terms = trimmedQuery.toLowerCase().split(/\s+/).filter(Boolean);
    return list.filter((game) => {
      const searchableText = [game.name, game.description, ...game.tags]
        .join(" ")
        .toLowerCase();
      return terms.every((term) => searchableText.includes(term));
    });
  }, [games, selectedCategory, favoriteIds, buggyIds, blockedIds, popularGameId, searchQuery, serverMatches]);

  const playableGames = React.useMemo(
    () => filteredGames.filter((game) => !game.disabled),
    [filteredGames]
  );
  const sortGames = React.useCallback((items: GameItem[]) => {
    const sorted = [...items];
    switch (sortOption) {
      case "popular":
        return sorted.sort((a, b) => {
          const diff = (b.clicks || 0) - (a.clicks || 0);
          if (diff !== 0) return diff;
          if (!!b.editorsPick !== !!a.editorsPick) return Number(!!b.editorsPick) - Number(!!a.editorsPick);
          return Number(!!b.featured) - Number(!!a.featured);
        });
      case "az":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case "recent": {
        const playedAt = new Map(loadRecentGames().map((entry) => [entry.id, entry.playedAt]));
        return sorted.sort((a, b) => (playedAt.get(b.id) || 0) - (playedAt.get(a.id) || 0));
      }
      case "featured":
        return sorted.sort((a, b) => {
          if (!!b.editorsPick !== !!a.editorsPick) return Number(!!b.editorsPick) - Number(!!a.editorsPick);
          return Number(!!b.featured) - Number(!!a.featured);
        });
      default:
        return sorted;
    }
  }, [sortOption]);

  const sortedPlayableGames = React.useMemo(
    () => sortGames(playableGames),
    [playableGames, sortGames]
  );
  const comingSoonGames = React.useMemo(
    () => sortGames(filteredGames.filter((game) => game.disabled)),
    [filteredGames, sortGames]
  );

  const clearSearch = React.useCallback(() => {
    setSearchQuery("");
    searchRef.current?.focus();
  }, []);

  const resetAllFilters = React.useCallback(() => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSortOption(DEFAULT_SORT);
    searchRef.current?.focus();
  }, []);

  const recentGameItems = React.useMemo(() => {
    const byId = new Map(games.map((game) => [game.id, game]));
    return loadRecentGames()
      .map((entry) => byId.get(entry.id))
      .filter((game): game is GameItem => !!game && !game.disabled);
  }, [games, recentIds]);

  const searching = searchQuery.trim().length > 0;
  const isFiltered = searching || selectedCategory !== "all";

  return (
    <div className="solid-3d-panel flex min-h-0 flex-1 flex-col overflow-hidden">
      {/* Catalog top controls with search and category filters */}
      <div className="flex shrink-0 flex-col gap-2 border-b border-white/[0.06] p-2.5 sm:gap-2.5 sm:p-4">
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
          <div className="flex min-w-0 items-center gap-2">
            <h2 className="text-sm font-semibold tracking-tight text-zinc-100">Games</h2>
            <span
              role="status"
              aria-live="polite"
              style={CHIP_STYLE}
              className="shrink-0 px-2.5 py-0.5 text-[11px] tabular-nums text-[#caccd2]"
            >
              {serverSearching ? "Searching…" : `${filteredGames.length} ${filteredGames.length === 1 ? "game" : "games"}`}
            </span>
          </div>

          <div className="relative w-full sm:w-[15rem]">
            <label htmlFor="game-search" className="sr-only">
              Search games
            </label>
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400"
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
              className="w-full appearance-none py-1.5 pl-8 pr-12 text-xs text-zinc-100 transition-colors placeholder:text-zinc-500 focus:outline-none [&::-webkit-search-cancel-button]:appearance-none"
            />
            {searching ? (
              <button
                type="button"
                onClick={clearSearch}
                aria-label="Clear search"
                className="absolute right-1.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-white/[0.08] hover:text-zinc-100"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            ) : (
              <kbd
                aria-hidden="true"
                className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 font-mono text-[10px] leading-none text-zinc-500 sm:block"
              >
                /
              </kbd>
            )}
          </div>
        </div>

        {/* Category Filter Chips Bar near search */}
        <div className="flex min-w-0 items-center gap-1.5">
          <div className="flex min-w-0 flex-1 items-center gap-1.5">
            <div
              role="tablist"
              aria-label="Filter games by category"
              className="flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto pt-0.5 pb-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
              {CATEGORY_FILTERS.map((cat) => {
                const active = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setSelectedCategory(cat.id)}
                    style={{
                      ...CHIP_STYLE,
                      borderRadius: 20,
                      background: active ? "#ffffff" : "rgba(255, 255, 255, 0.04)",
                      color: active ? "#09090b" : cat.id === "favorites" && favoriteIds.size > 0 ? "#fbbf24" : "#d4d4d8",
                      fontWeight: active ? 600 : 500,
                      boxShadow: active
                        ? "0 2px 8px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.4)"
                        : "inset 0 0 0 1px rgba(255, 255, 255, 0.03), inset 0 1px 0 0 rgba(255, 255, 255, 0.04)",
                    }}
                    className="inline-flex shrink-0 items-center gap-1 px-3 py-1 text-[11px] transition-all hover:text-white active:scale-95"
                  >
                    <span>{cat.label}</span>
                    {cat.id === "favorites" && favoriteIds.size > 0 && (
                      <span className={`ml-0.5 rounded-full px-1.5 py-0.2 text-[10px] font-mono leading-tight ${active ? "bg-zinc-900/10 text-zinc-900 font-bold" : "bg-amber-400/20 text-amber-300"}`}>
                        {favoriteIds.size}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="relative shrink-0" ref={filterRef}>
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={filterOpen}
                aria-label={`Sort & filter games: ${
                  selectedCategory === "buggy"
                    ? "Error: bug"
                    : selectedCategory === "blocked"
                    ? "Blocked"
                    : SORT_OPTIONS.find((option) => option.id === sortOption)?.label || "Most played"
                }`}
                onClick={() => setFilterOpen((open) => !open)}
                style={CHIP_STYLE}
                className={`inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-[11px] font-medium transition-colors ${
                  sortOption !== DEFAULT_SORT || selectedCategory === "buggy" || selectedCategory === "blocked"
                    ? "bg-white/[0.12] text-white"
                    : "text-zinc-300 hover:bg-white/[0.08] hover:text-white"
                }`}
              >
                <SlidersHorizontal aria-hidden="true" className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">
                  {selectedCategory === "buggy"
                    ? "Error: bug"
                    : selectedCategory === "blocked"
                    ? "Blocked"
                    : SORT_OPTIONS.find((option) => option.id === sortOption)?.label || "Most played"}
                </span>
              </button>
              {filterOpen && (
                <div
                  role="menu"
                  aria-label="Sort and filter games"
                  className="absolute right-0 top-full z-30 mt-2 min-w-48 overflow-hidden rounded-xl border border-white/[0.08] bg-[#1d1d1d] p-1.5 shadow-2xl"
                >
                  <div className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                    Sort by
                  </div>
                  {SORT_OPTIONS.map((option) => {
                    const active = sortOption === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        role="menuitemradio"
                        aria-checked={active}
                        onClick={() => {
                          setSortOption(option.id);
                          setFilterOpen(false);
                        }}
                        className="flex w-full items-center justify-between gap-3 rounded-lg px-2.5 py-1.5 text-left text-xs text-zinc-200 transition-colors hover:bg-white/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                      >
                        <span>{option.label}</span>
                        {active && <Check aria-hidden="true" className="h-3.5 w-3.5 text-amber-300" />}
                      </button>
                    );
                  })}

                  <div className="my-1 border-t border-white/[0.08]" />

                  <div className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                    Tag filters
                  </div>
                  <button
                    type="button"
                    role="menuitemcheckbox"
                    aria-checked={selectedCategory === "buggy"}
                    onClick={() => {
                      setSelectedCategory((current) => (current === "buggy" ? "all" : "buggy"));
                      setFilterOpen(false);
                    }}
                    className={`flex w-full items-center justify-between gap-3 rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors hover:bg-white/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white ${
                      selectedCategory === "buggy" ? "text-amber-300 font-medium" : "text-zinc-200"
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <span>🐛</span>
                      <span>Error: bug</span>
                      {buggyIds.size > 0 && (
                        <span className="rounded-full bg-white/[0.08] px-1.5 py-0.2 text-[10px] font-mono text-zinc-400">
                          {buggyIds.size}
                        </span>
                      )}
                    </span>
                    {selectedCategory === "buggy" && <Check aria-hidden="true" className="h-3.5 w-3.5 text-amber-300" />}
                  </button>

                  <button
                    type="button"
                    role="menuitemcheckbox"
                    aria-checked={selectedCategory === "blocked"}
                    onClick={() => {
                      setSelectedCategory((current) => (current === "blocked" ? "all" : "blocked"));
                      setFilterOpen(false);
                    }}
                    className={`flex w-full items-center justify-between gap-3 rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors hover:bg-white/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white ${
                      selectedCategory === "blocked" ? "text-amber-300 font-medium" : "text-zinc-200"
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <span>{blockedEmoji || "😿"}</span>
                      <span>Blocked</span>
                      {blockedIds.size > 0 && (
                        <span className="rounded-full bg-white/[0.08] px-1.5 py-0.2 text-[10px] font-mono text-zinc-400">
                          {blockedIds.size}
                        </span>
                      )}
                    </span>
                    {selectedCategory === "blocked" && <Check aria-hidden="true" className="h-3.5 w-3.5 text-amber-300" />}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Game list */}
      <div
        className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-4"
        style={{
          background: "rgba(0, 0, 0, 0.18)",
          boxShadow: "inset 0 1px 4px rgba(0, 0, 0, 0.3)",
        }}
      >
        <div className="flex flex-col gap-4">
          {showAdSpot && (
            <div
              aria-label="Advertisement"
              style={{
                borderRadius: 16,
                background: "rgba(255, 255, 255, 0.02)",
                boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.04), inset 0 1px 0 0 rgba(255, 255, 255, 0.03)",
              }}
              className="flex items-center justify-between gap-3 px-3.5 py-2.5"
            >
              <div className="min-w-0">
                <div className="text-[9px] font-medium uppercase tracking-[0.18em] text-zinc-500">Ad space</div>
                <div className="flex flex-wrap items-center gap-x-1 text-xs text-zinc-400">
                  <span>Reach students and gamers here</span>
                  <span aria-hidden="true">·</span>
                  <a
                    href="https://uplcm.com/4/12241749"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-300 underline decoration-white/20 underline-offset-2 transition-colors hover:text-white"
                  >
                    Support this site
                  </a>
                </div>
              </div>
              <a
                href="mailto:hello@base31.org?subject=Ad%20space%20on%20Education%20Games"
                style={CHIP_STYLE}
                className="inline-flex shrink-0 items-center px-3 py-1 text-[11px] font-medium text-zinc-300 transition-colors hover:text-white"
              >
                Advertise
              </a>
            </div>
          )}

          {!isFiltered && recentGameItems.length > 0 && (
            <section aria-labelledby="catalog-recent-heading" className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2">
                <h3 id="catalog-recent-heading" className="text-[11px] font-medium text-zinc-400">Recently played</h3>
                <span aria-hidden="true" className="h-px flex-1 bg-white/[0.07]" />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:thin]">
                {recentGameItems.map((game) => (
                  <a key={game.id} href={game.url} target="_blank" rel="noopener noreferrer" onClick={() => handleGameClick(game)} className="group flex w-44 shrink-0 items-center gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.035] p-2.5 text-left transition hover:border-white/[0.16] hover:bg-white/[0.07]">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.07] text-zinc-200"><Gamepad2 className="h-4 w-4" /></span>
                    <span className="min-w-0 flex-1"><span className="block truncate text-xs font-medium text-zinc-100">{game.name}</span><span className="mt-0.5 block text-[10px] text-zinc-500">Play again</span></span>
                    <Play className="h-3.5 w-3.5 shrink-0 text-zinc-500 transition group-hover:text-zinc-200" />
                  </a>
                ))}
              </div>
            </section>
          )}

          {playableGames.length > 0 && (
            <section aria-labelledby="catalog-play-heading" className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <h3 id="catalog-play-heading" className="text-[11px] font-medium text-zinc-400">
                  {isFiltered ? "Filtered matches" : "Play now"}
                </h3>
                <span aria-hidden="true" className="h-px flex-1 bg-white/[0.07]" />
                <span className="text-[11px] tabular-nums text-zinc-500">{playableGames.length}</span>
              </div>
              {sortedPlayableGames.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  isRecent={recentIds.has(game.id)}
                  isPopular={popularGameId === game.id}
                  isFavorite={favoriteIds.has(game.id)}
                  isBuggy={buggyIds.has(game.id) || !!game.errorBug}
                  isVerified={verifiedIds.has(game.id) || !!game.verified}
                  isNotMobile={notMobileIds.has(game.id)}
                  isBlocked={blockedIds.has(game.id)}
                  blockedEmoji={blockedEmoji}
                  searchQuery={searchQuery}
                  onPlay={handleGameClick}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </section>
          )}

          {comingSoonGames.length > 0 && (
            <section aria-labelledby="catalog-soon-heading" className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <h3 id="catalog-soon-heading" className="text-[11px] font-medium text-zinc-400">
                  Coming soon
                </h3>
                <span aria-hidden="true" className="h-px flex-1 bg-white/[0.07]" />
                <span className="text-[11px] tabular-nums text-zinc-500">{comingSoonGames.length}</span>
              </div>
              {comingSoonGames.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  isRecent={recentIds.has(game.id)}
                  isPopular={popularGameId === game.id}
                  isFavorite={favoriteIds.has(game.id)}
                  isBuggy={buggyIds.has(game.id) || !!game.errorBug}
                  isVerified={verifiedIds.has(game.id) || !!game.verified}
                  isNotMobile={notMobileIds.has(game.id)}
                  isBlocked={blockedIds.has(game.id)}
                  blockedEmoji={blockedEmoji}
                  searchQuery={searchQuery}
                  onPlay={handleGameClick}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </section>
          )}

          {filteredGames.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-12 text-center">
              {selectedCategory === "favorites" ? (
                <>
                  <Star className="h-8 w-8 text-amber-400/50" aria-hidden="true" />
                  <p className="text-sm font-medium text-zinc-300">
                    No favorite games yet
                  </p>
                  <p className="max-w-[18rem] text-xs leading-relaxed text-zinc-500">
                    Click the star on any game card to bookmark your favorites for quick access!
                  </p>
                </>
              ) : (
                <>
                  <Gamepad2 className="h-8 w-8 text-zinc-600" aria-hidden="true" />
                  <p className="text-sm font-medium text-zinc-300">
                    No games match your filters
                  </p>
                  <p className="max-w-[16rem] text-xs leading-relaxed text-zinc-500">
                    {searchQuery
                      ? `No games found for "${searchQuery}" in ${selectedCategory}.`
                      : "No games found in this category."}
                  </p>
                </>
              )}
              <button
                type="button"
                onClick={resetAllFilters}
                className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-zinc-950 transition-colors hover:bg-zinc-100"
              >
                <RotateCcw className="h-3 w-3" aria-hidden="true" />
                Reset filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
