import type { TourStep } from "../components/Tour";

export const ONBOARDING_STORAGE_KEY = "polytrack_onboarding_tour_seen";

// One short walkthrough of the hub's main features, shown on the first visit.
// Targets point at elements that are on screen by default; the nav is expanded
// for the tour so its shortcut chips can be highlighted too.
export const onboardingSteps: TourStep[] = [
  {
    title: "Welcome to math_games",
    content: "A quick tour of the main stuff. Use Next and Back to move around, or press Esc to skip.",
    placement: "center",
  },
  {
    target: '[data-tour-target="settings"]',
    title: "Settings & site lock",
    content:
      "Disguise this tab as Google Classroom or Docs, set a classroom password, change the background, and manage offline games.",
    placement: "bottom",
  },
  {
    target: "#site-nav-links",
    title: "Handy shortcuts",
    content:
      "Submit a game, open unblocked AI tools, browse outside games, or share the hub — all from this bar.",
    placement: "bottom",
    padding: 10,
  },
  {
    target: "#game-search",
    title: "Find a game fast",
    content:
      "Search by name or tag. Press / anywhere on the page to jump straight into the search box.",
    placement: "bottom",
  },
  {
    target: '[data-tour-target="game-categories"]',
    title: "Filter the catalog",
    content:
      "Browse trending, new, favorites, verified and more. Star any game to keep it in Favorites.",
    placement: "bottom",
  },
  {
    target: "#catalog-play-heading",
    title: "Pick something to play",
    content:
      "Click a card to launch a game. The star saves it to favorites, and the bug icon reports a broken game.",
    placement: "bottom",
  },
  {
    target: '[data-tour-target="chat-composer"]',
    title: "Hang out in chat",
    content:
      "Chat with other players, drop quick reactions, and see who else is around the hub.",
    placement: "top",
  },
  {
    target: '[data-tour-target="panic"]',
    title: "Leaving in a hurry?",
    content:
      "Panic closes the hub and opens Wikipedia instantly. You can also press ] anywhere as a shortcut.",
    placement: "bottom",
  },
];
