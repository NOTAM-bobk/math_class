import type { TourStep } from "../components/Tour";

export const ONBOARDING_STORAGE_KEY = "polytrack_onboarding_tour_seen";
export const CHAT_COMPOSER_TARGET = '[data-tour-target="chat-composer"]';

// One short walkthrough of the hub's main features, shown on the first visit.
// The side rail only exists from md up; phones get the same tour without that
// step. Targets point at elements that are on screen when the tour starts.
export function getOnboardingSteps(isPhone: boolean): TourStep[] {
  const steps: TourStep[] = [
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
  ];

  if (!isPhone) {
    steps.push({
      target: 'nav[aria-label="Game navigation"]',
      title: "Browse from the side rail",
      content:
        "Jump between genres and favorites here, or open Unblocked AIs, outside games, submit a game and report a bug.",
      placement: "right",
      padding: 10,
    });
  }

  steps.push(
    {
      target: "#game-search",
      title: "Find a game fast",
      content:
        "Search by name or tag. Press / anywhere on the page to jump straight into the search box.",
      placement: "bottom",
    },
    {
      target: '[data-tour-target="game-categories"]',
      title: "Browse by category",
      content:
        "Pick a genre from the side rail and the catalog says how many games are in it. Tap the heart on any game to keep it in Favorites.",
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
      target: CHAT_COMPOSER_TARGET,
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
    }
  );

  return steps;
}
