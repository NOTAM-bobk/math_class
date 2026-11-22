import type { TourStep } from "../components/Tour";

export const ONBOARDING_STORAGE_KEY = "polytrack_onboarding_tour_seen";
export const CHAT_COMPOSER_TARGET = '[data-tour-target="chat-composer"]';

// One short walkthrough of the hub's main features, shown on the first visit.
// The side rail only exists from md up; phones get the same tour without that
// step. Targets point at elements that are on screen when the tour starts.
// Every stop answers "what is this and when would I use it", with the keyboard
// shortcut attached where one exists.
export function getOnboardingSteps(isPhone: boolean): TourStep[] {
  const steps: TourStep[] = [
    {
      title: "A game hub that hides in a school tab",
      content:
        "Hundreds of browser games, no install and no account. This tour covers the classroom parts first: the disguise, the password and the panic key.",
      placement: "center",
      hint: "Esc skips it. You can switch the loading animation off in Settings.",
    },
    {
      target: '[data-tour-target="settings"]',
      title: "Look busy in one click",
      content:
        "Settings is the classroom kit: disguise this tab as Google Classroom or Docs, set a Site Lock password, pick a background, and manage offline games.",
      placement: "bottom",
      hint: "Site Lock asks for your password the next time this tab opens.",
    },
  ];

  if (!isPhone) {
    steps.push({
      target: 'nav[aria-label="Game navigation"]',
      title: "Everything is a rail away",
      content:
        "Genres, your favorites, Unblocked AIs and outside games all live in the rail. It folds down to icons when you want the screen back.",
      placement: "right",
      padding: 10,
      hint: "Your favorites and play history stay on this device, not on a server.",
    });
  }

  steps.push(
    {
      target: "#game-search",
      title: "Search beats scrolling",
      content:
        "Type a name, a tag or a mood: “parkour”, “puzzle”, “2 player”. Results narrow as you type, so there is no list to scroll through.",
      placement: "bottom",
      shortcut: "/",
      hint: "Press it anywhere on the page to land in the box.",
    },
    {
      target: '[data-tour-target="game-categories"]',
      title: "Trim the shelf",
      content:
        "The count tells you how many games match. Sort by most played, newest or A–Z, and filter to editors’ picks, multiplayer or verified games.",
      placement: "bottom",
      hint: "Verified means a moderator has opened the game and seen it run.",
    },
    {
      target: "#catalog-play-heading",
      title: "Play it or keep it",
      content:
        "Click a card to start a game. The heart files it under Favorites, and the bug icon reports one that will not load — that report is what gets it fixed.",
      placement: "bottom",
      hint: "Games open in a new tab, so the hub stays where you left it.",
    },
    {
      target: CHAT_COMPOSER_TARGET,
      title: "Someone is usually here",
      content:
        "The board shows who is online and what they are playing. Say something, drop a reaction, or share a game you just found.",
      placement: "top",
      hint: "Phones get chat in its own panel; Settings can hide it entirely.",
    },
    {
      target: '[data-tour-target="panic"]',
      title: "The escape hatch",
      content:
        "Panic covers the hub and opens Wikipedia in this tab, so the next glance at your screen shows an article. You can point it somewhere else in Settings.",
      placement: "bottom",
      shortcut: "]",
      hint: "Works from any page, without hunting for the button.",
    }
  );

  return steps;
}
