// The hand-maintained part of the catalog: same-origin games and the featured
// entries. It is merged with the imported feeds by scripts/export-catalog.mjs
// into `catalog.json`, which the app fetches at runtime.
import type { GameItem } from "./gameItem";

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
    id: "tool-youtube-unblocked",
    name: "YouTube Unblocked",
    url: "/yt/index.html",
    description: "Search and watch videos without opening youtube.com. Still in the works, so it is not available yet.",
    tags: ["Tools", "Video", "Unblocked"],
    disabled: true
  },
  {
    id: "tool-videos",
    name: "Videos",
    url: "https://videos.mathclass.uk",
    description: "Watch videos on videos.mathclass.uk, part of the math_class network.",
    tags: ["Tools", "Video", "Unblocked"]
  },
  {
    id: "tool-chat",
    name: "Chat",
    url: "https://chat.mathclass.uk",
    description: "Chat with everyone else on chat.mathclass.uk, the network's own message board.",
    tags: ["Tools", "Chat", "Community"]
  },
  {
    id: "tool-ai",
    name: "AI",
    url: "https://ai.mathclass.uk",
    description: "Ask questions and study with the AI helper on ai.mathclass.uk.",
    tags: ["Tools", "AI", "Study"]
  },
  {
    id: "tool-yt",
    name: "YouTube",
    url: "https://yt.mathclass.uk",
    description: "Search and watch YouTube videos on yt.mathclass.uk without opening youtube.com.",
    tags: ["Tools", "Video", "Unblocked"]
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
    name: "Awesome Tanks",
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
  },
];
