import type { GameItem } from "./gameItem";

// Games from the Gameflare distribution feed
// (https://distribution.gameflare.com/feed.json), imported on 2026-11-22 from
// the second page of its catalog (https://distribution.gameflare.com/2/). Each
// entry keeps the feed's embed URL, so the game runs on Gameflare's own host in
// a new tab and nothing is copied into this repo. Their thumbnails are served
// from ./covers, which keeps the cards working on networks that block the CDN.
export const GAMEFLARE_GAMES: GameItem[] = [
  {
    id: "gf-the-crossing-barriers-aid-deliverance",
    name: "The Crossing Barriers: Aid Deliverance",
    url: "https://distribution.gameflare.com/embed/the-crossing-barriers-aid-deliverance/",
    description: "Top-down arcade racer hauling aid across a war-torn country.",
    tags: ["Driving", "Racing", "3D", "Arcade"],
  },
  {
    id: "gf-rogue-sergeant-the-final-operation",
    name: "Rogue Sergeant: The Final Operation",
    url: "https://distribution.gameflare.com/embed/rogue-sergeant-the-final-operation/",
    description: "Story-driven first-person shooter: one sergeant against an army.",
    tags: ["Shooting", "Action", "FPS", "War"],
  },
  {
    id: "gf-marine-showdown-standoff-in-afghanistan",
    name: "Marine Showdown: Standoff in Afghanistan",
    url: "https://distribution.gameflare.com/embed/marine-showdown-standoff-in-afghanistan/",
    description: "Multiplayer-first FPS with tactical, squad-sized firefights.",
    tags: ["Shooting", "Multiplayer", "FPS", "War"],
  },
  {
    id: "gf-alone-in-the-evil-mansion",
    name: "Alone In The Evil Mansion",
    url: "https://distribution.gameflare.com/embed/alone-in-the-evil-mansion/",
    description: "Horror shooter set in a dark mansion full of things that want you gone.",
    tags: ["Horror", "Shooting", "Action", "3D"],
  },
  {
    id: "gf-missile-control-infiltration-strike",
    name: "Missile control: Infiltration Strike",
    url: "https://distribution.gameflare.com/embed/missile-control-infiltration-strike/",
    description: "Steer a missile deep behind enemy lines, dodging everything they fire back.",
    tags: ["Action", "Arcade", "Shooting"],
  },
  {
    id: "gf-baby-sniper-in-vietnam",
    name: "Baby Sniper In Vietnam",
    url: "https://distribution.gameflare.com/embed/baby-sniper-in-vietnam/",
    description: "Vietnam War sniper campaign, played down the scope.",
    tags: ["Shooting", "Sniper", "Action", "War"],
  },
  {
    id: "gf-lion-soldier-s-vengeance",
    name: "Lion Soldier's Vengeance",
    url: "https://distribution.gameflare.com/embed/lion-soldier-s-vengeance/",
    description: "Third-person shooter with arena fights and a lion soldier as the lead.",
    tags: ["Action", "Shooting", "Arena", "3D"],
  },
  {
    id: "gf-red-escape",
    name: "Red Escape",
    url: "https://distribution.gameflare.com/embed/red-escape/",
    description: "Escape-room puzzler built on logic: every room has its own lock to solve.",
    tags: ["Puzzle", "Escape", "Adventure"],
  },
  {
    id: "gf-soldier-of-ruins",
    name: "Soldier of Ruins",
    url: "https://distribution.gameflare.com/embed/soldier-of-ruins/",
    description: "Horror shooter set in a nightmarish temple; the scroll wheel swaps weapons.",
    tags: ["Horror", "Shooting", "FPS"],
  },
  {
    id: "gf-idle-medieval-tower-defense",
    name: "Idle Medieval: Tower Defense",
    url: "https://distribution.gameflare.com/embed/idle-medieval-tower-defense/",
    description: "Idle tower defense: hold one tower against endless waves and buy upgrades.",
    tags: ["Defense", "Upgrade", "Medieval"],
  },
  {
    id: "gf-axe-of-the-ancients-dwarven-fury",
    name: "Axe of the Ancients: Dwarven Fury",
    url: "https://distribution.gameflare.com/embed/axe-of-the-ancients-dwarven-fury/",
    description: "Hack-and-slash adventure in the style of Golden Axe and Warcraft.",
    tags: ["Action", "Fighting", "Adventure", "3D"],
  },
  {
    id: "gf-revenge-and-justice",
    name: "Revenge and Justice",
    url: "https://distribution.gameflare.com/embed/revenge-and-justice/",
    description: "Vengeance story in a post-apocalyptic world, played as a third-person shooter.",
    tags: ["Action", "Shooting", "War", "3D"],
  },
];
