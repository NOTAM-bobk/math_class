import type { GameItem } from "./gameItem";

// Games from the GameMonetize feed
// (https://gamemonetize.com/feed.php?format=0&num=50&page=1), imported on
// 2026-11-24 in batches (this run: pages 9-16). Each entry keeps the feed's own player URL, so
// the games load from html5.gamemonetize.co instead of being copied into this
// repo. Entries the feed tags as "Mobile" (or that ship a portrait player) carry
// `mobile: true`, which is what the catalog's Mobile filter selects. Their
// thumbnails are saved under ./covers so the cards survive the image host being
// blocked. Re-run scripts/import-gamemonetize.mjs to refresh the list.
export const GAMEMONETIZE_GAMES: GameItem[] = [
  {
    "id": "gm-robostrike-3d",
    "name": "RoboStrike 3D",
    "url": "https://html5.gamemonetize.co/yrdx5ckdm2xnfglz7mgsizbk8si1o2ql/",
    "description": "Tiny robots fight across oversized everyday spaces in RoboStrike 3D, a first-person arena shooter. Collect batteries to power your teams cannon and destroy the enemy tower, take control of a Mega Robot, or rack up…",
    "tags": [
      "Shooting",
      "3D",
      "Arena",
      "First Person Shooter",
      "Fps",
      "Multiplayer"
    ],
    "mobile": false
  },
  {
    "id": "gm-parking-school-3d",
    "name": "Parking School 3D",
    "url": "https://html5.gamemonetize.co/oebrmrqa1ikt01i97e97k9sn7jwf38w2/",
    "description": "Welcome to Parking School 3D, a colorful 3D parking game with bite-sized levels! Drive carefully, avoid obstacles and park perfectly in the marked spot. Every class teaches a new parking skill: straight, perpendicular…",
    "tags": [
      "Racing",
      "Car",
      "Carparking",
      "Parking",
      "Simulation"
    ],
    "mobile": false
  },
  {
    "id": "gm-jelly-fruit",
    "name": "Jelly Fruit",
    "url": "https://html5.gamemonetize.co/jbf32ft76d8gl85pk2rehocu2etqmqk0/",
    "description": "Slice wobbly 3D jelly fruits and gummy candies with real squishy physics! Cut melons, gummy bears, worms, crocs and fried eggs in 100 levels with fun goals: perfect halves, exact percentages or tiny bites. Try Slice…",
    "tags": [
      "Puzzle",
      "Family",
      "Fruit",
      "Girls",
      "Halloween",
      "Jelly",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-tinyracers-io",
    "name": "TinyRacers.io",
    "url": "https://html5.gamemonetize.co/y12jrygka7dw1w2s224wrqru2jp7jcma/",
    "description": "Tiny cars. Huge chaos. Take control of a remote-control buggy and tear across a giant world of toys and desk supplies, where pencils are speed bumps, rulers are ramps and every corner is a fight. TERRITORY RUSH – the…",
    "tags": [
      "Racing",
      ".io",
      ".io Games",
      "3D Games",
      "Multiplayer"
    ],
    "mobile": false
  },
  {
    "id": "gm-special-strike-multiplayer",
    "name": "Special Strike Multiplayer",
    "url": "https://html5.gamemonetize.co/kz9ogh3vap8jb1oprfv1mg0660cz0oug/",
    "description": "Special Strike Multiplayer is an online first-person shooter with free-for-all matches for up to eight players. Fight across six maps, including Office, Assault, and Train, and switch between six weapons: a pistol…",
    "tags": [
      "Shooting",
      "CSGO",
      "First Person Shooter",
      "Multiplayer",
      "Shooter"
    ],
    "mobile": false
  },
  {
    "id": "gm-build-it-up",
    "name": "Build It Up",
    "url": "https://html5.gamemonetize.co/v2wz5xn46dzkd4c318r05imesjrj0ysu/",
    "description": "Explore a modern city with 4 unique maps full of buildings to construct. Boost your progress with special aids: start with a pre-built tower, double your earnings with the coin multiplier, revive to keep going or undo…",
    "tags": [
      "Puzzle",
      "Block",
      "Blocky",
      "Build",
      "Builder",
      "Building",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-dust-dynamite-voxel-bomberman",
    "name": "Dust Dynamite: Voxel Bomberman",
    "url": "https://html5.gamemonetize.co/dctdhvic6nrdl6x3po1lh6j3kuai9vua/",
    "description": "Play an eight-arena voxel Bomberman campaign. Drop TNT, blast through crates, and outwit creepers, dune hoppers, cave spiders, and iron golems.",
    "tags": [
      "Arcade",
      "Action",
      "Bomb",
      "Minecraft"
    ],
    "mobile": false
  },
  {
    "id": "gm-my-hotpot-store",
    "name": "My HotPot Store",
    "url": "https://html5.gamemonetize.co/bwnwd62dlichf80m9w10rhjkzr9riwl3/",
    "description": "My HotPot Store is a charming restaurant idle management game where you grow fresh ingredients, serve hungry customers, and transform a small hot pot shop into a bustling food business! Take charge of farming, staffing…",
    "tags": [
      "Hypercasual",
      "Casual",
      "Business",
      "Idle",
      "Management",
      "Simulation"
    ],
    "mobile": false
  },
  {
    "id": "gm-farmhaul-x-agri-transport-simulator",
    "name": "FarmHaul X: Agri Transport Simulator",
    "url": "https://html5.gamemonetize.co/15199xtkfpl2dmjliy0oxtudd48wk7yu/",
    "description": "**FarmHaul X: Agri Transport Simulator** is an exciting 3D farming and tractor driving game that takes you on a journey through beautiful countryside fields, challenging agricultural missions, and realistic-style farm…",
    "tags": [
      "3D",
      "3D Games",
      "Driving",
      "Farm",
      "Simulation",
      "Unity games"
    ],
    "mobile": false
  },
  {
    "id": "gm-car-gt-apex-touring",
    "name": "Car GT Apex Touring",
    "url": "https://html5.gamemonetize.co/16q8gke3ae76etnft5icr6sdi2yx5myy/",
    "description": "Take the wheel in Car GT Apex Touring. Race AI rivals on technical circuits, go head-to-head in a 402-meter drag race, or link slides for a high score in Drift Trial. Tackle six driving tests in the License Center to…",
    "tags": [
      "Racing",
      "Car",
      "Car tuning",
      "Driving"
    ],
    "mobile": false
  },
  {
    "id": "gm-goal-guard",
    "name": "Goal Guard",
    "url": "https://html5.gamemonetize.co/isr8dxg1f3ex7gd4xpiwi47uadspdtia/",
    "description": "Goal Guard is a fast-paced 2D anime-inspired arcade goalkeeper game built for instant fun on desktop and mobile browsers. Step onto the pitch, read incoming shot trajectories in split seconds, and protect your net from…",
    "tags": [
      "Soccer",
      "1 Player",
      "2D",
      "Anime",
      "Arcade",
      "Ball",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-leisure-golf",
    "name": "Leisure Golf",
    "url": "https://html5.gamemonetize.co/am9japtv0hgdvixrjcpu5upg2g1r0prf/",
    "description": "Leisure Golf is a relaxing 3D golf game featuring unique courses. Aim carefully, adjust your power, and navigate challenging obstacles to sink the ball in as few strokes as possible. Easy to play, fun to master!",
    "tags": [
      "Sports",
      "3D Games",
      "Golf"
    ],
    "mobile": false
  },
  {
    "id": "gm-kraken-seas",
    "name": "Kraken Seas",
    "url": "https://html5.gamemonetize.co/rhjw3r9qo2dodidh05spswj5asda3yjf/",
    "description": "Sail your pirate ship through stormy seas, sink skeleton pirates and sharks, and survive the Kraken! Your cannons fire on their own, so you steer, dodge and grab treasure.",
    "tags": [
      "Hypercasual",
      "Casual",
      "3D",
      "Action",
      "Arcade",
      "Boat",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-jewel-jam-color-sort",
    "name": "Jewel Jam: Color Sort",
    "url": "https://html5.gamemonetize.co/0xeshuaskpljl9aqzsp6tq2v6w5ad9q2/",
    "description": "Welcome to Jewel Jam: Color Sort, the ultimate relaxing yet brain-teasing color sorting puzzle game! Dive into a dazzling world of sparkling gems, organize colorful diamond cubes into matching groups, and clear the…",
    "tags": [
      "Puzzle",
      "Color",
      "Jewel",
      "Sort",
      "Sorting"
    ],
    "mobile": false
  },
  {
    "id": "gm-spin-unlock",
    "name": "Spin Unlock",
    "url": "https://html5.gamemonetize.co/tomaqfpg5l98810hidkyiypg9fkk85jh/",
    "description": "Spin Unlock is a calm logic puzzle about steel rings and padlocks. Turn each ring until every gap rests on a padlock, and every padlock takes exactly one gap. Each board has a single solution you can reach by reasoning…",
    "tags": [
      "Puzzle",
      "Brain",
      "Casual",
      "Levels",
      "Logic",
      "Mind",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-meow-rush-merge-run",
    "name": "Meow Rush: Merge Run",
    "url": "https://html5.gamemonetize.co/kcrrytcy2bsu8ocbhdpj7yrqzcsmeo0g/",
    "description": "Ready to dash, merge, and groove with the cutest feline warriors? Welcome to Meow Rush: Merge & Run, the ultimate hyper-casual arcade game that blends high-speed runner action, addictive merge evolution, and energetic…",
    "tags": [
      "Racing",
      "Casual",
      "Cat",
      "Driving",
      "Hypercasual",
      "Running"
    ],
    "mobile": false
  },
  {
    "id": "gm-crash-courier",
    "name": "Crash Courier",
    "url": "https://html5.gamemonetize.co/8jfax4mgg83528mf07v90lf8bz00h1e0/",
    "description": "Crash Courier is a funny 3D physics driving game. Drive chunky trucks over tracks floating above the sea: big drops, rope bridges, loops, crumbling planks, swinging platforms, crushers and saw blades. Get your cargo to…",
    "tags": [
      "Action",
      "1 Player",
      "3D",
      "Car",
      "Obstacle"
    ],
    "mobile": false
  },
  {
    "id": "gm-age-on-a-bit-of-life-simulator",
    "name": "Age On A Bit of Life Simulator",
    "url": "https://html5.gamemonetize.co/paxw62ga7qjvyvwzafhr8hrvwt05si7y/",
    "description": "Guide a character from their first days at home to the legacy they leave behind. Make a choice in the yearly journal, then decide how to spend the rest of your time. Build friendships, pursue an education, try different…",
    "tags": [
      "Hypercasual",
      "Casual",
      "1 Player",
      "2D",
      "Mentolatux",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-iron-tank-3d",
    "name": "IRON TANK 3D",
    "url": "https://html5.gamemonetize.co/kv65vdysgxx9n00pdvhjh8vmg888knc9/",
    "description": "Take command of a chunky low poly battle tank and fight across three fronts: a desert at sunset, a frozen relay base and a burning iron foundry. Blow up generators, stop enemy convoys, capture outposts and bring down…",
    "tags": [
      "Shooting",
      "3D Games",
      "Arcade",
      "Attack",
      "Mapi games",
      "Military"
    ],
    "mobile": false
  },
  {
    "id": "gm-storky-idle-delivery",
    "name": "Storky Idle Delivery",
    "url": "https://html5.gamemonetize.co/az5zeja1u54ngwhtdcpc13tcd66k8333/",
    "description": "Build your own busy bird-delivery business in Storky Idle Delivery! Created by StorkyVerse. Help Cool manage the depot, sort parcels, send stork couriers flying, and grow your operation into new areas. Upgrade machines…",
    "tags": [
      "Clicker",
      "Idle",
      "Bird",
      "Business",
      "Management",
      "Simulation"
    ],
    "mobile": false
  },
  {
    "id": "gm-style-duel",
    "name": "Style Duel",
    "url": "https://html5.gamemonetize.co/q1u0jt5hu3eu6vcn9x9yy460dgsjzb2n/",
    "description": "Style Duel is a dress up fashion battle. Pick a theme, then mix 75 pieces against the clock: 9 hairstyles, 12 dresses, 12 tops, 12 skirts and trousers, 12 pairs of shoes, 12 extras like tiaras, hats and handbags, and 6…",
    "tags": [
      "Hypercasual",
      "Casual",
      "1 Player",
      "Battle",
      "Beauty",
      "Dress Up",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-picklepop",
    "name": "PicklePop",
    "url": "https://html5.gamemonetize.co/86mzbrc54ghlnhw00gq79xa97g5s8h2g/",
    "description": "Pull your rival wide, then send the next ball into the open corner. PicklePop brings arcade pickleball to rooftop courts in ten cities, from a breezy afternoon in Rio to the lights of Tokyo. Pick your athlete for a…",
    "tags": [
      "Sports",
      "Arcade",
      "Ball",
      "Skill"
    ],
    "mobile": false
  },
  {
    "id": "gm-deep-treasure-dive-3d",
    "name": "Deep Treasure Dive 3D",
    "url": "https://html5.gamemonetize.co/c5eei0tq2ixq3yos9drp37wn98amnevb/",
    "description": "Pilot a yellow submarine in Deep Treasure Dive 3D. Dive to the reef and grab bronze, silver and gold treasure chests. The deeper you go, the richer the treasure, but your oxygen drains faster and mines wait in the dark…",
    "tags": [
      "Adventure",
      "3D Games",
      "Boat",
      "Collecting",
      "Fish",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-red-kite-by-roega",
    "name": "RED KITE by ROEGA",
    "url": "https://html5.gamemonetize.co/cvzp80u411vz0nddbpib0v3g8bmzuopq/",
    "description": "In RED KITE, the player takes on the role of the boyfriend of Enya—a neuroscientist working for the pharmaceutical conglomerate NeoTerra. One day, she discovers that numerous deaths in NeoTerra hospitals reveal glaring…",
    "tags": [
      "Adventure",
      "2D",
      "Action",
      "Jump",
      "Pixel",
      "Platform"
    ],
    "mobile": false
  },
  {
    "id": "gm-teleport-blade-ninja-strike",
    "name": "Teleport Blade: Ninja Strike",
    "url": "https://html5.gamemonetize.co/imnoige3vyg79yslpzh8qhgayys9bh3y/",
    "description": "Throw your blade and teleport to it! Teleport Blade: Ninja Strike is a fast one-touch action game. Aim, throw your weapon, and your ninja instantly teleports to wherever it lands. Time slows down while you aim, so line…",
    "tags": [
      "Action",
      "3D",
      "Arcade",
      "Assassin",
      "Fighting",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-roll-rush-ice-cream-tycoon",
    "name": "Roll Rush: Ice Cream Tycoon",
    "url": "https://html5.gamemonetize.co/ww0dsw2lfk90n0cge996awo5p9bh0sf4/",
    "description": "Roll Rush: Ice Cream Tycoon is a cozy 3D tycoon game where you run your own rolled ice cream stand on a sunny beach! GAMEPLAY: Scrape creamy ice cream rolls off the frozen plate, stock your display and sell to customers…",
    "tags": [
      "Hypercasual",
      "Casual",
      "3D",
      "Cooking",
      "Food",
      "Kids",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-mischief-mutt",
    "name": "Mischief Mutt",
    "url": "https://html5.gamemonetize.co/2tnbauo2872rczzexuf4eq84cfzsf59r/",
    "description": "Mischief Mutt is a funny 3D open-town adventure where you play a cheeky dog with zero manners. Steal sausages from the butcher, knock over bins, scare pigeons, dig up flower beds and snatch steaks from the mansion BBQ…",
    "tags": [
      "Adventure",
      "3D Games",
      "Action",
      "Animal",
      "Cat",
      "Catcher",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-last-shift-bot-battle",
    "name": "Last Shift: Bot Battle",
    "url": "https://html5.gamemonetize.co/ckppbwh5105f2n7cwzo0vlx86kh7xq4f/",
    "description": "The night shift at Reactor Hall B is yours. Hold the floor from 22:00 to 06:00 against waves of rogue maintenance robots, upgrade between hours and spend your paycheck in the workshop. MODES - Night Shift: wave defense…",
    "tags": [
      "Shooting",
      "1 Player",
      "3D Games",
      "Action",
      "First Person Shooter",
      "Gun"
    ],
    "mobile": false
  },
  {
    "id": "gm-mega-chicken-run",
    "name": "Mega Chicken Run",
    "url": "https://html5.gamemonetize.co/62ewtmmb2j6svoctyibp9wf6vdbzreqe/",
    "description": "Help the brave little chicken run and jump across 72 colorful levels in Mega Chicken Run! Race over floating islands, leap across gaps, grab coins and rubies, and stomp turtles, bees, crabs and penguins on the way to…",
    "tags": [
      "Arcade",
      "Adventure",
      "Animal",
      "Cartoon",
      "Casual",
      "Chicken",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-pothole-party",
    "name": "Pothole Party",
    "url": "https://html5.gamemonetize.co/f4ckpw1319gmulnzg2l4ubovzpiu3k0z/",
    "description": "Steer a hungry pothole through a toy town and swallow everything smaller than you. Grow from cones to skyscrapers before the clock runs out! 24 levels, rivals, bosses, 8 skins.",
    "tags": [
      "Hypercasual",
      "Casual",
      "1 Player",
      "3D",
      "Arcade"
    ],
    "mobile": false
  },
  {
    "id": "gm-rally-art",
    "name": "RALLY ART",
    "url": "https://html5.gamemonetize.co/cali8da8z4too5k7675rybnf5oifuzft/",
    "description": "RALLY ART is a colourful rally game for the browser. You drive for a small rally team: mechanic Andrey builds and tunes your car, co-driver Nika reads the pace notes for every corner. Game modes: a campaign of 41 levels…",
    "tags": [
      "Racing",
      "1 Player",
      "3D",
      "Cars",
      "Drifting",
      "Driving"
    ],
    "mobile": false
  },
  {
    "id": "gm-tsunami-runner-obby-2",
    "name": "Tsunami Runner Obby 2",
    "url": "https://html5.gamemonetize.co/rvl0ai04xvjru4wrs3k1c0ckh3eci1xm/",
    "description": "Run from the tsunami in Tsunami Runner Obby 2 — a multiplayer browser game where every wave brings new danger. Dodge, survive, and earn wins to unlock characters and trails. Play as the legendary Tung-Tung-Tung Sahur!…",
    "tags": [
      "Multiplayer",
      "Arcade",
      "Best",
      "Best Games",
      "Brainrot",
      "Hot"
    ],
    "mobile": false
  },
  {
    "id": "gm-road-crash-merge",
    "name": "Road Crash Merge",
    "url": "https://html5.gamemonetize.co/4rgng7w7ee6hos791qq4zy8l6435d3vy/",
    "description": "Road Crash is a fast-paced racing game that mixes wild driving, car crashes, coin collecting, and vehicle merging into an action-packed road adventure. Hit the highway, smash into rival cars, grab rewards, and build a…",
    "tags": [
      "Hypercasual",
      "Casual",
      "Action",
      "Car",
      "Driving",
      "Racing",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-pearl-diver-ocean-adventure",
    "name": "Pearl Diver: Ocean Adventure",
    "url": "https://html5.gamemonetize.co/8k6wmt8ms041p3ykgqf2jrc1sd2vm3e9/",
    "description": "Pearl Diver is a 3D pearl-hunting adventure across ten real pearling seas of the world, from the Arabian Gulf to the Caribbean. Swim down from your wooden dhow, pry open oysters, grab air bubbles to stay under longer…",
    "tags": [
      "Adventure",
      "1 Player",
      "2026 games",
      "3D",
      "3D Games",
      "Casual",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-candy-bubble-2",
    "name": "CANDY BUBBLE 2",
    "url": "https://html5.gamemonetize.co/s1c12fpskagmfq2kp850dkrn8fn06ql0/",
    "description": "Candy Bubble 2 is a fun bubble shooter with a cute fox, 40 levels and 5 candy worlds. Shoot candies, match three of the same color and make the rest fall. Beat the big boss at the end of each world, play the bonus…",
    "tags": [
      "Shooting",
      "Arcade",
      "Mapi games",
      "Robot",
      "Shoot 'Em Up"
    ],
    "mobile": false
  },
  {
    "id": "gm-apex-sports-parking-mega-drive",
    "name": "Apex Sports Parking: Mega Drive",
    "url": "https://html5.gamemonetize.co/uultisouiscciw6trcxwexfjksvgp6nn/",
    "description": "Take the wheel of powerful sports cars, master tight parking spaces, complete challenging driving levels, and prove your skills in the ultimate sports car parking simulator!",
    "tags": [
      "3D",
      "3D Games",
      "Driving",
      "Parking",
      "Simulation"
    ],
    "mobile": false
  },
  {
    "id": "gm-crossfire-legends",
    "name": "Crossfire Legends",
    "url": "https://html5.gamemonetize.co/m4gagodyl8kpj0x5lf5j3fh9seyhihfu/",
    "description": "Crossfire Legends is a competitive FPS shooting game built around intense first-person battles, team tactics, and multiple combat modes. Choose your fighter, pick the right weapon, team up with allies, and enter…",
    "tags": [
      "Shooting",
      "Arena",
      "Fps",
      "Shoot",
      "Survival"
    ],
    "mobile": false
  },
  {
    "id": "gm-garage-tycoon-3d",
    "name": "Garage Tycoon 3D",
    "url": "https://html5.gamemonetize.co/xriwiljk9a1adqpsq9iy7dii738clty0/",
    "description": "Garage Tycoon 3D is an idle car service tycoon. Collect cash, open service bays, hire workers and upgrade your garage. Cars arrive with visible problems: dirt, flat tires, rust, dents, empty tanks, oil leaks, broken…",
    "tags": [
      "Clicker",
      "Idle",
      "3D",
      "3D Games",
      "Car",
      "Car tuning"
    ],
    "mobile": false
  },
  {
    "id": "gm-lunar-sweepers-moon-dust-simulator",
    "name": "Lunar Sweepers: Moon Dust Simulator",
    "url": "https://html5.gamemonetize.co/cb6uffxf9v6wlo0ydxo3hs7gsmqp8ely/",
    "description": "Lunar Sweepers: Moon Dust Simulator is a relaxing 3D cleaning game set on the Moon. The lunar surface is buried under centuries of thick grey dust, and you are the newest janitor of the Lunar Surface Division. Sweep the…",
    "tags": [
      "Arcade",
      "1 Player",
      "3D",
      "Casual",
      "Cleaning",
      "Collecting"
    ],
    "mobile": false
  },
  {
    "id": "gm-zombie-mission-old-factory",
    "name": "Zombie Mission: Old Factory",
    "url": "https://html5.gamemonetize.co/7jz2zxyep8e4glx7hhvqrc84gpbnwjuo/",
    "description": "a classic action-platformer where a young hero and his unlikely band of companions battle to save your city from interdimensional invaders. Run, jump, and blast through relentless threats, collect cash, and upgrade your…",
    "tags": [
      "Adventure",
      "Platform",
      "Shooter",
      "Shooting",
      "Zombie"
    ],
    "mobile": false
  },
  {
    "id": "gm-bone-crypt",
    "name": "Bone Crypt",
    "url": "https://html5.gamemonetize.co/5nk1q1hzpb8zejrgi1n9rs1qtdskr2o7/",
    "description": "Bone Crypt is a 3D arena brawler in a haunted graveyard. Fight wave after wave of skeletons with sword combos, dodge rolls and a whirlwind ultimate. The dead dont stay down: every skeleton you beat collapses into a bone…",
    "tags": [
      "Arcade",
      "3D",
      "Action",
      "Arena",
      "Dungeon",
      "Fantasy"
    ],
    "mobile": false
  },
  {
    "id": "gm-splash-guard",
    "name": "Splash Guard",
    "url": "https://html5.gamemonetize.co/0qmxfwbvv8nh5vqic9h2yhghut69ulv6/",
    "description": "Thirsty sinkholes are crawling toward your treasure! Throw water to lure them away, because they always follow the nearest splash. Guard golden chests and the royal boat across 20 levels in 4 Egyptian worlds, from the…",
    "tags": [
      "Puzzle",
      "3D",
      "Brain",
      "Level",
      "Water"
    ],
    "mobile": false
  },
  {
    "id": "gm-firebreak",
    "name": "FireBreak",
    "url": "https://html5.gamemonetize.co/l9vapay1jzr5dil9sonupdgb6dphxjan/",
    "description": "Take the controls of a firefighting aircraft and stop wildfires before they get out of hand. Scoop water from lakes and rivers, line up your run, and drop your load right on the flames. Fires spread fast, so choose your…",
    "tags": [
      "Action",
      "Aircraft",
      "Airplane",
      "Fire",
      "Flight",
      "Multiplayer"
    ],
    "mobile": false
  },
  {
    "id": "gm-flip-shot-heist",
    "name": "Flip Shot Heist",
    "url": "https://html5.gamemonetize.co/dqj2rzggcy3us6k0912zpnnjdp7gnmda/",
    "description": "A fresh twist on recoil shooting! Flip Shot Heist mixes one-tap recoil physics with bright Indian festival rooftops, a bow mode and colorful Holi blasts. Its a combination you wont find in any other game. Every shot…",
    "tags": [
      "Shooting",
      "Bow",
      "Crazy",
      "Gun"
    ],
    "mobile": false
  },
  {
    "id": "gm-hop-hero-a-lollipop-adventure",
    "name": "Hop Hero: A Lollipop Adventure",
    "url": "https://html5.gamemonetize.co/9icyur8ear15tzxctxe95icx6h9tovlf/",
    "description": "Run, jump and swim through 5 colorful levels in Hop Hero: A Lollipop Adventure! Collect coins, find hidden stars, stomp enemies and swing your lollipop to beat 5 tricky bosses. Master the double jump and reach the flag…",
    "tags": [
      "Arcade",
      "2D",
      "Candy",
      "Cartoon",
      "Casual",
      "Collecting"
    ],
    "mobile": false
  },
  {
    "id": "gm-animals-kart",
    "name": "Animals Kart",
    "url": "https://html5.gamemonetize.co/7m7z4lgsu1psmos6cki8fkuqrqq18ivt/",
    "description": "Animals Kart is a fast-paced arcade racing game where cute animal drivers compete across colorful tracks in powerful little karts. Choose your favorite racer, master tight corners, use boosts, overtake your rivals and…",
    "tags": [
      "Sports",
      "Animal",
      "Cute",
      "Drift",
      "Drifting",
      "Mapi games",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-last-road-out",
    "name": "Last Road Out",
    "url": "https://html5.gamemonetize.co/4y8g43s8g8xkp1ysxe9ayii4drg9mh4b/",
    "description": "Fight through the opening chapter of a zombie survival campaign. Follow a broken radio signal along the evacuation road, search an abandoned checkpoint and survive the horde at the gas station. The campaign opens with…",
    "tags": [
      "Shooting",
      "Apocalypse",
      "Mentolatux",
      "Survival",
      "Zombie"
    ],
    "mobile": false
  },
  {
    "id": "gm-roblox-hero-city-adventure",
    "name": "Roblox Hero City Adventure",
    "url": "https://html5.gamemonetize.co/e5o4aoheprqyrau56nvb2foj94jp2gim/",
    "description": "Roblox Hero City Adventure is a 3D block-style superhero open-world adventure game where you explore a lively city and fight enemies. The progression also feels like a superhero training simulator, as completing…",
    "tags": [
      "Adventure",
      "3D",
      "Battle",
      "City",
      "Superhero"
    ],
    "mobile": false
  },
  {
    "id": "gm-mech-arena-robots-war",
    "name": "Mech Arena Robots War",
    "url": "https://html5.gamemonetize.co/1k3lplcuaws3zwo6cwo02yd70qv055ts/",
    "description": "Mech Arena Robots War is a competitive robot fighting game where you collect mechanical dinosaurs, build powerful squads, and defeat enemy machines in exciting turn-based battles. Develop your own winning strategy in…",
    "tags": [
      "Hypercasual",
      "Casual",
      "Action",
      "Battle",
      "Dinosaur",
      "Strategy"
    ],
    "mobile": false
  },
  {
    "id": "gm-mini-soccer-3d",
    "name": "Mini Soccer 3D",
    "url": "https://html5.gamemonetize.co/ydb5z2mbz7bd4hfks1vdjrqp0vg91a9a/",
    "description": "Mini Soccer is a fast and fun 4v4 arcade football game made for quick matches and easy controls. Pick your national team, play friendly matches or enter the tournament and try to win the cup. Pass the ball, find space…",
    "tags": [
      "Sports",
      "Boy",
      "Football",
      "Mapi games",
      "Soccer",
      "World"
    ],
    "mobile": false
  },
  {
    "id": "gm-harbor-master-container-tycoon",
    "name": "Harbor Master Container Tycoon",
    "url": "https://html5.gamemonetize.co/syqwxy96ui8nrcwlqlfk4xpw2xukueed/",
    "description": "# HARBORMASTER: CONTAINER TYCOON Welcome to HarborMaster: Container Tycoon! Take control of a busy cargo port and become the ultimate harbor master. Operate powerful port machinery, load and unload cargo ships…",
    "tags": [
      "3D",
      "3D Games",
      "Unity games for your site"
    ],
    "mobile": false
  },
  {
    "id": "gm-nitro-moto-stunt-3d",
    "name": "Nitro Moto Stunt 3D",
    "url": "https://html5.gamemonetize.co/agxoqpvqfxyoh4d9i212w4z6z1tp4fzk/",
    "description": "Nitro Moto Stunt 3D is a fast-paced 3D motorcycle drifting and stunt racing game built for both desktop and mobile players. Choose from multiple sport and stunt bikes, hit massive sky ramps, pull off mid-air flips, and…",
    "tags": [
      "Arcade",
      "3D",
      "Bike",
      "Drift",
      "Driving",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-blocky-escape",
    "name": "Blocky Escape",
    "url": "https://html5.gamemonetize.co/cc3m01sckdt32d8ww47r1z4gif8wez8o/",
    "description": "Blocky Escape is a fast 3D endless runner in a colorful blocky world. You're on the run from a relentless security robot along a floating sky track! Swipe left and right to switch between three lanes, swipe up to jump…",
    "tags": [
      "Action",
      "3D",
      "3D Games",
      "Avoid",
      "Blocky",
      "Endless"
    ],
    "mobile": false
  },
  {
    "id": "gm-scamper-karts",
    "name": "Scamper Karts",
    "url": "https://html5.gamemonetize.co/s42xod14spnm2oumqywed3qbp8ut9uh2/",
    "description": "Scamper Karts is a 3D kart racer with a story. Scamper Garage has a leaking roof, one kart held together with tape and rent due on Friday. You are the new crew chief, with a fox driver who never stops talking. Win…",
    "tags": [
      "Racing",
      "3D",
      "Animal",
      "Cars",
      "Cartoon",
      "Driving"
    ],
    "mobile": false
  },
  {
    "id": "gm-mini-parkour-escape",
    "name": "Mini Parkour Escape",
    "url": "https://html5.gamemonetize.co/5hfywpvi1iz2j6fmbc1ywkk4jjtyuwts/",
    "description": "Climb your way to the top in Mini Parkour Escape, a fast-paced pixel art HTML5 platformer. Navigate tricky obstacles and dodge dangerous enemies to reach the exit door as fast as possible. Use your special…",
    "tags": [
      "Hypercasual",
      "Casual",
      "1 Player",
      "2D",
      "Escape",
      "Pixel"
    ],
    "mobile": false
  },
  {
    "id": "gm-chancla-fury-auntie-bertha-world",
    "name": "Chancla Fury Auntie Bertha World",
    "url": "https://html5.gamemonetize.co/1q4t37aitprnu7bq1c348o8jnj9y16ju/",
    "description": "The superheroes thought they were unstoppable. Then they met Auntie Bertha! Chancla Fury is a hilarious classic arcade-style fighting game. A tough granny takes on gym bros, caped heroes, disco dancers, ninjas, sumo…",
    "tags": [
      "Arcade",
      "Fighting",
      "Funny",
      "Superhero"
    ],
    "mobile": false
  },
  {
    "id": "gm-mahjong-tasty-pairs",
    "name": "Mahjong Tasty Pairs",
    "url": "https://html5.gamemonetize.co/qj2v2bvnmyjfdutvk6wrsnot7m7625xf/",
    "description": "Classic mahjong solitaire with colorful cartoon food tiles. Study layered layouts, find identical open tiles, and remove them in pairs. Blocked tiles are dimmed, making available moves easier to spot. Enjoy 300 stages…",
    "tags": [
      "Puzzle",
      "1 Player",
      "2026 games",
      "2D",
      "Best Games",
      "Casual"
    ],
    "mobile": false
  },
  {
    "id": "gm-onet-gravity",
    "name": "Onet Gravity",
    "url": "https://html5.gamemonetize.co/memc0l2jbwe6uru3rqfyqesbjk9bvcv3/",
    "description": "Onet Gravity is a relaxing tile-matching puzzle with a twist: gravity! Tap two identical tiles to connect them with a line of up to 3 straight segments (2 turns) - the line may even go around the outside of the board…",
    "tags": [
      "Puzzle",
      "Brain",
      "Casual",
      "Fruit",
      "Fruits",
      "Logic"
    ],
    "mobile": false
  },
  {
    "id": "gm-ninja-assassin-revenge",
    "name": "Ninja Assassin: Revenge",
    "url": "https://html5.gamemonetize.co/b07a7bks5citxd80lguoh6yw5027zmnw/",
    "description": "Run, jump, and fight your way to revenge in **Ninja Assassin: Revenge**, a fast-paced action platformer. Leap over deadly traps, cut through waves of enemies, and take on powerful bosses across a series of challenging…",
    "tags": [
      "Arcade",
      "Action",
      "Assassin",
      "Endless",
      "Fight",
      "Ninja"
    ],
    "mobile": false
  },
  {
    "id": "gm-car-outlaws-nitro",
    "name": "Car Outlaws Nitro",
    "url": "https://html5.gamemonetize.co/dilhqk8erw4sx4mrsgf5b1mw3klhm6j9/",
    "description": "Hit the nitro and race through a dockyard, an industrial refinery, and a forest outpost in Car Outlaws Nitro, a 3D arcade racer. Take on five rivals in Circuit Race, refill your boost at every checkpoint in Nitro…",
    "tags": [
      "Sports",
      "Drifting",
      "Driving",
      "Simulator"
    ],
    "mobile": false
  },
  {
    "id": "gm-carletto-dreams-adventure",
    "name": "Carletto Dreams Adventure",
    "url": "https://html5.gamemonetize.co/92s3gzn0ru0o79r9iyuibagud59108kq/",
    "description": "Join Carletto on a magical journey through worlds hidden inside his dreams! Explore floating islands, collect glowing Dream Stars and use your telescope to reveal invisible bridges, secret paths and puzzle clues. Push…",
    "tags": [
      "Puzzle",
      "2D",
      "Fantasy",
      "Mapi games",
      "Mobile",
      "Pixel"
    ],
    "mobile": true
  },
  {
    "id": "gm-freekick-clash",
    "name": "Freekick Clash",
    "url": "https://html5.gamemonetize.co/ujehelzcmmfzjrrb1myp5dcyhxkcva38/",
    "description": "Freekick Clash: The ultimate football freekick game! Aim and shoot, beat the goalkeeper, and score spectacular goals. Select your favorite team, challenge the wall, and win the world cup! Enjoy realistic ball physics…",
    "tags": [
      "Sports",
      "Ball",
      "Football",
      "Soccer",
      "Sport"
    ],
    "mobile": false
  },
  {
    "id": "gm-dunkit",
    "name": "DunkIt",
    "url": "https://html5.gamemonetize.co/be9cm4qpp08itlkunkhoua82m8v4fskc/",
    "description": "Jump, flip and slam! DunkIt is an arcade basketball game with 35 physics-based dunk levels: trampolines, moving balls, obstacles and crazy trick dunks like the Tomahawk, Superman or Backwards Dunk. Time your grab and…",
    "tags": [
      "Sports",
      "2D",
      "3D",
      "Basketball"
    ],
    "mobile": false
  },
  {
    "id": "gm-offroad-buggy-racing",
    "name": "Offroad Buggy Racing",
    "url": "https://html5.gamemonetize.co/23xbhs0jaj7koh8htbjzj4ypsttobflm/",
    "description": "Get ready for the ultimate offroad racing adventure!Experience extreme buggy racing across challenging dirt tracks, rocky mountains, desert trails, and dangerous offroad environments.Drive powerful offroad buggies…",
    "tags": [
      "3D",
      "Buggy",
      "Racing"
    ],
    "mobile": false
  },
  {
    "id": "gm-off-the-tracks",
    "name": "Off the Tracks",
    "url": "https://html5.gamemonetize.co/gwinsgqnmdjlgf92kcsxi8h049mwi2zr/",
    "description": "Keep the ring moving through a series of twisting tracks without letting it fall off. Rotate the course, time each turn, and guide it safely toward the finish in this physics-based skill challenge. Web Dev…",
    "tags": [
      "Puzzle",
      "3D",
      "Physics",
      "Skill",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-downhill-bike-stunt-race",
    "name": "Downhill Bike Stunt Race",
    "url": "https://html5.gamemonetize.co/xj99vgtryj27sa37l22ksklmzf1433zw/",
    "description": "Ride a mountain bike down rugged trails filled with slopes, turns and stunt jumps. Control your speed over uneven ground, land safely and reach the finish across downhill courses. Take on the trail and improve each run…",
    "tags": [
      "Sports",
      "Bike",
      "Mountain",
      "Offroad",
      "Stunts"
    ],
    "mobile": false
  },
  {
    "id": "gm-3d-triple-match",
    "name": "3D Triple Match",
    "url": "https://html5.gamemonetize.co/1rku1cqfby40b2oi3wr2he9yt7wqq05o/",
    "description": "Dive into 3D Triple Match, an addictive and relaxing 3D puzzle matching game designed to test your observation and sorting skills. Find, match and clear vibrant 3D objects from a messy pile before the timer runs out.",
    "tags": [
      "Puzzle",
      "3D",
      "Brain",
      "Match 3",
      "Match-3",
      "Match3"
    ],
    "mobile": false
  },
  {
    "id": "gm-gravepowder",
    "name": "Gravepowder",
    "url": "https://html5.gamemonetize.co/yeoakmgf535w9s17tjm4w9zfxdkn4wze/",
    "description": "GRAVEPOWDER is a dark-fantasy third-person action game. The dead have risen over a frozen parish, and you are the last Warden: an axe in one hand, a flintlock in the other. Strike, roll, parry when the ring burns gold…",
    "tags": [
      "Multiplayer",
      "3D",
      "Action",
      "Blood",
      "Fantasy",
      "Knight"
    ],
    "mobile": false
  },
  {
    "id": "gm-pattern-mover",
    "name": "Pattern Mover",
    "url": "https://html5.gamemonetize.co/81ipr0bacsnxujl6jms4ojd3bsgt29oq/",
    "description": "Pattern Mover is a relaxing pixel-picture puzzle. Each level shows a finished pixel artwork broken into coloured tiles: pick a tile from the tray, send it to the sorting lane and the pieces fly back into the picture one…",
    "tags": [
      "Puzzle",
      "1 Player",
      "2D",
      "Brain",
      "Casual",
      "Color",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-lampbearer",
    "name": "Lampbearer",
    "url": "https://html5.gamemonetize.co/vnqmwgx3itfvsiilgbvh3ibf961zkpyu/",
    "description": "Single-player 3D action RPG. You are the last Lampbearer: three wardens went mad from the Blights whisper and their seals went dark. Your sword strikes on its own; you steer, dodge telegraphed blows and outlast the…",
    "tags": [
      "Adventure",
      "3D",
      "Dungeon",
      "Fantasy",
      "Knight",
      "Monster"
    ],
    "mobile": false
  },
  {
    "id": "gm-juice-blender-3d",
    "name": "Juice Blender 3D",
    "url": "https://html5.gamemonetize.co/vjfdln75ytoju1tua48fxrppyzkg26wf/",
    "description": "Get ready for a refreshing challenge in Juice Blender 3D! This addictive fruit sorting puzzle game tests your logic and organization skills. Your mission is simple: sort the pile of 3D fruits into the correct blenders…",
    "tags": [
      "Puzzle",
      "3D",
      "Brain",
      "Cooking",
      "Food",
      "Fruit"
    ],
    "mobile": false
  },
  {
    "id": "gm-tiny-front",
    "name": "Tiny Front",
    "url": "https://html5.gamemonetize.co/8mo6r4jo2i6h4sn5arrmjq3c3rw5rley/",
    "description": "A toy-sized war with very real chaos. Pick a soldier, a jeep, a tank or a chopper and storm 16 missions across a sunny valley, a dusty desert, a frozen front and a concrete city. Capture zones, bonk enemy tanks, blow up…",
    "tags": [
      "Shooting",
      "3D",
      "Action",
      "Army",
      "Battle",
      "Funny"
    ],
    "mobile": false
  },
  {
    "id": "gm-sir-shiba-monster-island",
    "name": "Sir Shiba: Monster Island",
    "url": "https://html5.gamemonetize.co/jixb9bv6knw4z0mstjm5t9py2ciri8rn/",
    "description": "Sir Shiba: Monster Island puts a small Shiba Inu knight at the center of an idle-arcade loop set across a chain of floating islands. Sir Shiba attacks nearby monsters automatically, so the core activity is guiding him…",
    "tags": [
      "Hypercasual",
      "Casual",
      "1 Player",
      "Cute",
      "Farm",
      "Hunting",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-princess-adventure",
    "name": "Princess Adventure",
    "url": "https://html5.gamemonetize.co/zu25p90a6ern00v3k234t4aee4gvo4l7/",
    "description": "A whimsical and challenging vertical platformer. Guide Princess Sera as she hops down through slippery cloud platforms, descending into the dark lands below. Collect coins to unlock doors, and test your balancing skills…",
    "tags": [
      "Adventure",
      "2026 games",
      "2D",
      "Platform"
    ],
    "mobile": false
  },
  {
    "id": "gm-wreck-kings-car",
    "name": "Wreck Kings Car",
    "url": "https://html5.gamemonetize.co/wsz76wetbp9nhabm2og24jkmv20zrdx4/",
    "description": "Wreck Kings: Car Destruction Island is a 3D racing and demolition derby game by BREYMANTECH. Smash, crash and outlast your rivals on an action-packed island! Play 300 career events across 15 chapters, with a boss at the…",
    "tags": [
      "Sports",
      "Car",
      "Destruction",
      "Driving"
    ],
    "mobile": false
  },
  {
    "id": "gm-fart-monkeys-obby-parkour",
    "name": "Fart Monkeys Obby Parkour",
    "url": "https://html5.gamemonetize.co/re83ya5mu5270wzjtzd21p4lnpm69152/",
    "description": "Run, jump and fart your way through a wild 3D obby! Race through 15 colorful levels in Banana Jungle, Icy Hills and the Gas Factory. Double jump with a PFFT, gas dive over gaps, butt slam crates and bounce off…",
    "tags": [
      "Arcade",
      "3D",
      "3D Games",
      "Adventure",
      "Monkey",
      "Platform"
    ],
    "mobile": false
  },
  {
    "id": "gm-italian-brainrot-tung-tung-tung-sahur",
    "name": "ITALIAN BRAINROT TUNG TUNG TUNG SAHUR",
    "url": "https://html5.gamemonetize.co/0u8ozbrq23mo1l0fqkwn8xza70u0tq9j/",
    "description": "Pull back Tung Tung Tung Sahur and fling him at the stone golems! Every golem has a number that tells you how many hits it can take. Smash the crates under them, make them fall, bounce them into each other and clear the…",
    "tags": [
      "Puzzle",
      "Angrybirds",
      "Brainrot",
      "Brainrot Italian",
      "Brainrot sahuuur",
      "Italian Brainrot"
    ],
    "mobile": false
  },
  {
    "id": "gm-jelly-vortex-3d",
    "name": "Jelly Vortex 3D",
    "url": "https://html5.gamemonetize.co/pex9kjqp1igfkttn2o96jk7gwl2h11gg/",
    "description": "Welcome to Jelly Vortex 3D, a fun and addictive color-sorting puzzle adventure! Dive into a colorful 3D world where your goal is to sort vibrant jelly pieces and organize them by color. Use your logic, strategy, and…",
    "tags": [
      "Puzzle",
      "2026 games",
      "Amazing",
      "Brain",
      "Casual",
      "Fun",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-flying-ants-quest",
    "name": "Flying Ants Quest",
    "url": "https://html5.gamemonetize.co/f30492m5q51p4are7jvh310zd7qrzamn/",
    "description": "An open-world 3D ant adventure for one player. Carry crumbs home to the anthill, one at a time, before the clock runs out. Sniff out the next crumb, sprint, or spread your wings and fly. Beetles, spiders, wasps, a…",
    "tags": [
      "Adventure",
      "3D",
      "3D Games",
      "Action",
      "Animal",
      "Collecting",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-kart-volcano",
    "name": "Kart Volcano",
    "url": "https://html5.gamemonetize.co/8ztwujcxmlnukpqektsn1b0npu4rzd53/",
    "description": "Race through volcanoes, deserts, forests, carnival streets and the ocean floor in Kart Volcano! Pick one of 12 drivers, customize your kart, grab item boxes, fire power-ups at your rivals and drift through every curve…",
    "tags": [
      "Racing",
      "3D",
      "Arcade",
      "Cars",
      "Drift",
      "Kart"
    ],
    "mobile": false
  },
  {
    "id": "gm-regolith",
    "name": "REGOLITH",
    "url": "https://html5.gamemonetize.co/779p1tmy7fq4gbeyc7s53ey4yy6t1bbl/",
    "description": "Your ship has crashed on an unknown planet and the only way out is down. Take your astronaut through five underground worlds and find the five missing parts of the ship. Everything in the cave is made of small pixels…",
    "tags": [
      "Shooting",
      "2D",
      "Alien",
      "Mapi games",
      "Physics",
      "Pixel"
    ],
    "mobile": false
  },
  {
    "id": "gm-turbo-colis",
    "name": "Turbo Colis",
    "url": "https://html5.gamemonetize.co/e2upjg0lvh1ydejacw98qh70ifoytf96/",
    "description": "You work for TurboColis, and your boss Gerard doesnt care about the weather, the gravity or the cows: the parcel must arrive. Drive a cargo bike, a rocket shopping cart, a bathtub, a couch or a flying saucer across 7…",
    "tags": [
      "Sports",
      "2026 games",
      "Bicycle",
      "Clicker",
      "Crash",
      "Sport"
    ],
    "mobile": false
  },
  {
    "id": "gm-hover-rush",
    "name": "Hover Rush",
    "url": "https://html5.gamemonetize.co/4fjq0kzdnxp5528bpkxeaz80yo6yacwm/",
    "description": "Race anti-gravity hovers over a tropical archipelago! Speed across 10 floating tracks above turquoise lagoons, jungle waterfalls, a smoking volcano, a tropical storm and a glowing sea at night. Hit boost pads, grab item…",
    "tags": [
      "Racing",
      "3D",
      "3D Games",
      "Arcade",
      "Island",
      "Mapi games"
    ],
    "mobile": false
  },
  {
    "id": "gm-zombie-survival-blackout",
    "name": "Zombie Survival: Blackout",
    "url": "https://html5.gamemonetize.co/z0rtwh2scjubgdg80bnt2slalw03yv94/",
    "description": "Night falls, the power is out and the city belongs to the zombies. Survive the horde, rescue the people hiding across the city and get them out by helicopter. Your hero fires automatically - you focus on moving, dodging…",
    "tags": [
      "Shooting",
      "Helicopter",
      "Rescue",
      "Shooter",
      "Survival",
      "Zombie"
    ],
    "mobile": false
  },
  {
    "id": "gm-obby-park-tycoon",
    "name": "Obby Park Tycoon",
    "url": "https://html5.gamemonetize.co/7uq2buj9078mkyyylsezfmfv488yo6wc/",
    "description": "Build your own obby park and watch it come alive! Step on the buttons to build rides, food stalls and new obby sections over a big slime lake. Blocky guests buy tickets, queue up and race your course - they jump, slip…",
    "tags": [
      "Arcade",
      "1 Player",
      "3D",
      "3D Games",
      "Blocky",
      "Build",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-zombie-surge",
    "name": "Zombie Surge",
    "url": "https://html5.gamemonetize.co/794f8br6oo2sm1mlpa0o2ovvwhrq3xhg/",
    "description": "A zombie horde is marching on your fence, and carts full of weapons roll along the tracks beside it. Every bullet is a choice: shoot the crowd, or smash a cart for a bigger gun. Go for the cart and the zombies get…",
    "tags": [
      "Shooting",
      "3D",
      "Defense",
      "Gun",
      "Shooter",
      "Survival",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-slime-tilt",
    "name": "Slime Tilt",
    "url": "https://html5.gamemonetize.co/til6lvr7wxkznxewhpgnze49u7nkeydk/",
    "description": "Tilt the box and every slime slides at once! Slime Tilt is a cozy logic puzzle about squishing slimes of the same color together until only one of each is left. There are 38 handmade levels across 3 worlds. Squish…",
    "tags": [
      "Puzzle",
      "Brain",
      "Casual",
      "Cute",
      "HTML",
      "Jelly",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-brainrot-brawl",
    "name": "Brainrot Brawl",
    "url": "https://html5.gamemonetize.co/ah391vkh1liddaus80j06abng934aeiy/",
    "description": "Brainrot Brawl is a 3D fighting game starring the internet's favorite brainrot memes. Tralalero Tralala, Tung Tung Tung Sahur, Ballerina Cappuccina and more step into the arena, each with their own moves, specials and a…",
    "tags": [
      "Multiplayer",
      "1 Player",
      "2 Player",
      "Arcade",
      "Fighting"
    ],
    "mobile": false
  },
  {
    "id": "gm-witchwood-potion-shop",
    "name": "Witchwood Potion Shop",
    "url": "https://html5.gamemonetize.co/c8ve8mvgeqogu1tme1ith4esoqxc85kx/",
    "description": "Old Aunt Hazel has left you her little potion shop deep in the enchanted Witchwood. Grab your basket and get brewing! Gather glowing mushrooms, moonflowers and star crystals, drop them into bubbling cauldrons and carry…",
    "tags": [
      "Girls",
      "3D",
      "Business",
      "Casual",
      "Cat",
      "Cute"
    ],
    "mobile": false
  },
  {
    "id": "gm-astro-block",
    "name": "Astro Block",
    "url": "https://html5.gamemonetize.co/mn6of79zd29dwz4uhe44agn1wa4bwd8x/",
    "description": "Astro Block is a 3D space puzzle game. Roll a glowing block across floating platforms, activate switches to open bridges, and reach the portal standing upright. Each of the 30 levels asks you to plan a safe route…",
    "tags": [
      "Puzzle",
      "Arcade",
      "Casual",
      "Hypercasual"
    ],
    "mobile": false
  },
  {
    "id": "gm-night-nabbers",
    "name": "Night Nabbers",
    "url": "https://html5.gamemonetize.co/olpc9um17mbaz57gnzlwo21l61o0axi1/",
    "description": "Night Nabbers is a free 3D heist game where you play a raccoon after dark. Sneak past dogs, guards and searchlights, steal eggs from nests, carry the loot home and hatch quirky buddies that earn coins while you are…",
    "tags": [
      "Multiplayer"
    ],
    "mobile": false
  },
  {
    "id": "gm-blokoparkur",
    "name": "Blokoparkur",
    "url": "https://html5.gamemonetize.co/jly8mfzn5s61wocn3oji8k3bautogwme/",
    "description": "Blokoparkur is a first-person parkour game in a world made of blocks. Run, jump from block to block and reach the portal at the end of each level to unlock the next one. 20 levels take you from a sunny meadow and a…",
    "tags": [
      "Arcade",
      "3D",
      "3D Games",
      "Block",
      "Blocky",
      "Jumping"
    ],
    "mobile": false
  },
  {
    "id": "gm-fart-monkeys-splash-escape",
    "name": "Fart Monkeys Splash Escape",
    "url": "https://html5.gamemonetize.co/cs85zte8xs9vqp3dipwqkkplxmcwisut/",
    "description": "Fart Monkeys: Splash Escape is a wild 3D obby escape! The pool halls are flooded and a blind monkey monster hunts by sound. Jump across platforms, fart to fly over gaps and never splash into the water! Throw pebbles to…",
    "tags": [
      "Adventure",
      "3D",
      "3D Games",
      "Arcade",
      "Monkey",
      "Platform"
    ],
    "mobile": false
  },
  {
    "id": "gm-moon-dust-simulator",
    "name": "Moon Dust Simulator",
    "url": "https://html5.gamemonetize.co/8vg4m5slioj3lxy15oielve5hrirh9zu/",
    "description": "Sweep the Moon clean! Start with a toothbrush, brush up colorful moon dust, pack it into capsules and deliver it to your ship for cash. Upgrade through 20 tools, from brooms and vacuums to rovers and a giant cleaning…",
    "tags": [
      "Arcade",
      "3D",
      "3D Games",
      "Platform",
      "Roblox"
    ],
    "mobile": false
  },
  {
    "id": "gm-last-frontier",
    "name": "Last Frontier",
    "url": "https://html5.gamemonetize.co/2pkaqbrzvwkya6o8uxtw73aaednhhvfh/",
    "description": "Defend your base in a 3D real-time strategy battle. Build barracks, factories and towers, train infantry, tanks, artillery and aircraft, and lead your commander into the fight. Each building pad is upgraded by running…",
    "tags": [
      "Action",
      "Fantasy",
      "Strategy",
      "Tanks",
      "Tower Defense",
      "War"
    ],
    "mobile": false
  },
  {
    "id": "gm-mach-rush",
    "name": "Mach Rush",
    "url": "https://html5.gamemonetize.co/xxyoatucaibl7ca8pvt9u2z5zx21qm9d/",
    "description": "Fly a fighter jet through canyons, islands and seas. Dodge missiles, sink warships, and unlock 14 jets in 144 levels across 16 maps.",
    "tags": [
      "Action",
      "1 Player",
      "3D",
      "Airplane",
      "Attack",
      "Best Games"
    ],
    "mobile": false
  },
  {
    "id": "gm-monster-truck-stunt-cars",
    "name": "Monster Truck Stunt cars",
    "url": "https://html5.gamemonetize.co/01rnyr1p3k8rx6tz0p434kr4ks02moaz/",
    "description": "# Monster Truck Stunt Cars Get ready for an exciting monster truck driving adventure! Jump behind the wheel of powerful monster trucks and perform incredible stunts across challenging tracks. Drive through massive…",
    "tags": [
      "3D",
      "3D Games",
      "Monstertruck",
      "Racing"
    ],
    "mobile": false
  },
  {
    "id": "gm-mech-strike-frozen-sky",
    "name": "Mech Strike: Frozen Sky",
    "url": "https://html5.gamemonetize.co/92wh9c28k3yxsw068qxpdh1md3t8vl8r/",
    "description": "Mech Strike: Frozen Sky is a fast third-person mech flight shooter. Your battle mech has wings, jet thrusters, twin cannons and shoulder missiles: launch over a shattered frozen sea at sunset, race between glacier walls…",
    "tags": [
      "Shooting",
      "3D",
      "Flight",
      "Jet",
      "Multiplayer",
      "Robot"
    ],
    "mobile": false
  },
  {
    "id": "gm-apex-drift",
    "name": "Apex Drift",
    "url": "https://html5.gamemonetize.co/mh3m76ny9x2us9zflygjy2s5tdmv4ban/",
    "description": "Apex Drift is a realistic 3D drift racing game. Throw your car into hairpins, chain long slides and chase the perfect line on three maps: a mountain pass, a neon city and a sunset coast road. Modes and levels: 15 stages…",
    "tags": [
      "Racing",
      "3D",
      "Car",
      "Drift",
      "Driving",
      "Race"
    ],
    "mobile": false
  },
  {
    "id": "gm-panic-roll",
    "name": "PANIC ROLL",
    "url": "https://html5.gamemonetize.co/23imdc25ylbhm7dzphatc1d0i0c3qsu5/",
    "description": "You start as a tiny ball nobody notices. Roll over anything smaller, stick it on and grow. The creatures that ignored you? Once you reach their size they panic, wave their arms and run. Chase them down! Short runs…",
    "tags": [
      "Hypercasual",
      "Casual",
      ".io",
      "1 Player",
      "Arcade",
      "Ball"
    ],
    "mobile": false
  },
  {
    "id": "gm-embermarch",
    "name": "Embermarch",
    "url": "https://html5.gamemonetize.co/e8kbs5rclw4car60x0fh2yzhhjambb94/",
    "description": "Embermarch is a first-person dark-fantasy action RPG. The winter that never ends has raised the dead: lift the last Ember Banner, lead your warband of pikes, bows and wardens north, light the old beacons and free the…",
    "tags": [
      "Multiplayer",
      "1 Player",
      "2 Player",
      "3D",
      "Action",
      "Adventure"
    ],
    "mobile": false
  },
  {
    "id": "gm-rushvanta-x-highway-drive",
    "name": "RushVanta X: Highway Drive",
    "url": "https://html5.gamemonetize.co/huyda8gmwgp3zz4zej9wjzlkhkm495nq/",
    "description": "RushVanta X: Highway Drive is an exciting 3D highway driving game where you take control of a powerful car and drive through busy roads filled with traffic. Navigate challenging highways, avoid other vehicles, and test…",
    "tags": [
      "3D",
      "3D Games",
      "Car",
      "Driving",
      "Racing",
      "Simulation"
    ],
    "mobile": false
  },
  {
    "id": "gm-trailbalance",
    "name": "TrailBalance",
    "url": "https://html5.gamemonetize.co/83r4xm4q59urk934mls6zdnhp42hz7hg/",
    "description": "TrailBalance is a 3D mountain-bike racing game built around balance, braking and traction. Race a 20-rider field on 35 technical trail courses with roots, rocks, drops, climbs and descents in dry, wet and winter…",
    "tags": [
      "Sports",
      "3D",
      "Bicycle",
      "Bike",
      "Driving",
      "Mountain"
    ],
    "mobile": false
  },
  {
    "id": "gm-throw-food",
    "name": "Throw Food",
    "url": "https://html5.gamemonetize.co/ltpmb4qn874ro5tv8o4svmoqashb588o/",
    "description": "Train your strength, throw food farther, and collect rare animals! Upgrade your food, explore new areas, and build an animal paradise that earns coins.",
    "tags": [
      "Action",
      "1 Player"
    ],
    "mobile": false
  },
  {
    "id": "gm-melon-craft-ragdoll",
    "name": "Melon Craft Ragdoll",
    "url": "https://html5.gamemonetize.co/p5y2wasddvvbtmswt1lfpkc6ggadp58w/",
    "description": "Melon Craft Ragdoll is a creative ragdoll sandbox game where you can build experimental scenes, place ragdoll characters, arrange interactive objects, and watch everything react through physics. The game combines…",
    "tags": [
      "Puzzle",
      "Creation",
      "Pixel",
      "Ragdoll",
      "Sandbox"
    ],
    "mobile": false
  },
  {
    "id": "gm-car-wash-business-simulator",
    "name": "Car Wash Business Simulator",
    "url": "https://html5.gamemonetize.co/ncif4ickm14t8lnqsz9jtr6vjxgypn4d/",
    "description": "Build your own car wash business. Clean dirty cars with pressure washers, foam and detailing tools, earn tips, upgrade your equipment, expand your wash bays and hire staff.",
    "tags": [
      "Adventure",
      "3D",
      "Business",
      "Car",
      "Management",
      "Simulator"
    ],
    "mobile": false
  },
  {
    "id": "gm-save-the-pets",
    "name": "Save the Pets",
    "url": "https://html5.gamemonetize.co/r24jzargiki5u4t9a8e5pubeyfxvar59/",
    "description": "Save the Pets is a funny drawing puzzle game. Angry bees are about to pour out of the hive, and a nervous shiba needs your help! HOW TO PLAY: draw one line to build a wall, a roof or a clever shape that shields the…",
    "tags": [
      "Puzzle",
      "2D",
      "Animal",
      "Brain",
      "Casual",
      "Cute",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-goal-arena-game",
    "name": "Goal Arena Game",
    "url": "https://html5.gamemonetize.co/xd646ls3xck13ly5jefh09ayg577q2e4/",
    "description": "Step into the arena and show off your football skills! Aim your shots carefully, kick the ball toward the goal, and score as many goals as possible. Challenge yourself with different targets and obstacles while…",
    "tags": [
      "Adventure",
      "2026 games",
      "Action",
      "Attack",
      "Best",
      "Best Games"
    ],
    "mobile": false
  },
  {
    "id": "gm-prado-parking-master-3d",
    "name": "Prado Parking Master 3D",
    "url": "https://html5.gamemonetize.co/k0xsy9r7ncw790mai4fwlo7kh4fnhyam/",
    "description": "Get ready for an exciting 3D Prado Car Parking adventure! Drive a powerful luxury SUV through challenging parking courses, navigate tight spaces, avoid obstacles, and park your vehicle perfectly. Complete 5 challenging…",
    "tags": [
      "Boys",
      "3D",
      "Car",
      "Carparking",
      "Parking",
      "Unity games"
    ],
    "mobile": false
  },
  {
    "id": "gm-worlds-deepest-hole",
    "name": "Worlds Deepest Hole",
    "url": "https://html5.gamemonetize.co/rzzcix3icwdlud5e0h30hse2ph2sik1b/",
    "description": "Dig the deepest hole on Route 66 in first person. Fill your bucket, ride the cranes lift cage up and sell every load of dirt and ore, then buy better tools: spade, pickaxe, jackhammer, drill and a mining laser. Every…",
    "tags": [
      "Clicker",
      "Idle",
      "3D",
      "Casual",
      "Mine",
      "Miner"
    ],
    "mobile": false
  },
  {
    "id": "gm-unbolt-run",
    "name": "Unbolt Run",
    "url": "https://html5.gamemonetize.co/pbns16w33qkzl00dr3ptpgc4mb7b33a3/",
    "description": "Unbolt Run combines 3D running with fast-paced bolt puzzles. Follow the arrows and remove bolts in the correct order to lift steel gates before your escape margin runs out. Solid bulkhead gates hide a final latch behind…",
    "tags": [
      "Puzzle",
      "1 Player",
      "3D",
      "Escape",
      "Running",
      "Skills"
    ],
    "mobile": false
  },
  {
    "id": "gm-soul-hunter",
    "name": "Soul Hunter",
    "url": "https://html5.gamemonetize.co/ozcnxe8wcekfg3o8pr5oi6yf6d1ipvz9/",
    "description": "Control a powerful ghost in Soul Hunter Complete exciting missions, chase humans, capture their souls, and become the ultimate Soul Hunter. Explore challenging levels, avoid obstacles, and collect souls to unlock new…",
    "tags": [
      "Adventure",
      ".io",
      "Action",
      "Catch",
      "Survival"
    ],
    "mobile": false
  },
  {
    "id": "gm-bridge-builder-cargo-transport",
    "name": "Bridge Builder Cargo Transport",
    "url": "https://html5.gamemonetize.co/tsvwsvlw9upmufelchlpkyyn2fp3q3qg/",
    "description": "Bridge Builder Cargo Transport is a fun and challenging transport simulator where you take control of a utility truck loaded with bridge repair materials. A major bridge has been damaged, and only you can deliver the…",
    "tags": [
      "3D",
      "Cargo",
      "Construction",
      "Driving",
      "Simulation",
      "Transport"
    ],
    "mobile": false
  },
  {
    "id": "gm-motocross-rush",
    "name": "MOTOCROSS RUSH",
    "url": "https://html5.gamemonetize.co/z6uq3e7rtzowxkazcnmdvlrkwmt5jwc6/",
    "description": "Moto Cross Rush is an arcade motocross race with twelve dirt tracks and four bikes. Jump, drift through the corners and use missiles, bombs and oil to pass your rivals. Play the World Circuit, the Cups, Time Trial…",
    "tags": [
      "Sports",
      "Arcade",
      "Mapi games",
      "Motocross",
      "Race",
      "Racing"
    ],
    "mobile": false
  },
  {
    "id": "gm-cute-aquarium-triple-match",
    "name": "Cute Aquarium: Triple Match",
    "url": "https://html5.gamemonetize.co/imtb6h7s5fuaws4wsw6suu40vtfjeppz/",
    "description": "Cute Aquarium: Triple Match is a charming free puzzle game that combines adorable aquarium creatures with relaxing match-3 gameplay and collection challenges. Set in a playful underwater world, this aquarium match 3…",
    "tags": [
      "Puzzle",
      "Collection",
      "Cute",
      "Match 3",
      "Relaxation",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-plane-launch-fly-upgrade",
    "name": "Plane Launch: Fly & Upgrade",
    "url": "https://html5.gamemonetize.co/htbquurb45bw0wxdm6c8fcjxbwfkgh7y/",
    "description": "Pull back the giant slingshot, time your launch and send your plane soaring through epic canyons! How far can you fly? Start with a humble paper glider and turn it into a roaring jet. Upgrade five parts: slingshot…",
    "tags": [
      "Hypercasual",
      "Casual",
      "Airplane",
      "Flight",
      "Fly",
      "Idle"
    ],
    "mobile": false
  },
  {
    "id": "gm-oops-air-airplane-crew",
    "name": "Oops Air: Airplane Crew",
    "url": "https://html5.gamemonetize.co/ddn1ikg1b7fi8ao8ykttz6tlopp84uqu/",
    "description": "Dear passengers, this is your captain speaking. We have a small problem in the cabin... and on the wing... and in the hold. Oops! You are the whole crew of the wobbliest airline in the sky. Load the bags, board the…",
    "tags": [
      "Adventure",
      "Airplane",
      "Flight",
      "Fly",
      "Management",
      "Physics"
    ],
    "mobile": false
  },
  {
    "id": "gm-cozy-games-dreamy-room",
    "name": "Cozy Games Dreamy Room",
    "url": "https://html5.gamemonetize.co/601mdxyszmnx56trz1c4rhn34356n00l/",
    "description": "Cozy Games - Dreamy Room is a relaxing room decorating and interior design game where you organize messy spaces, place furniture and decorations, and turn each location into a cozy dream room. A messy room is waiting…",
    "tags": [
      "Puzzle",
      "Cute",
      "Design",
      "Idle",
      "Room"
    ],
    "mobile": false
  },
  {
    "id": "gm-binbloom-city-cleanup",
    "name": "BinBloom: City Cleanup",
    "url": "https://html5.gamemonetize.co/y9c4ncspp4hfrctec5hdw2oo5tw9sf3p/",
    "description": "# BinBloom: City Cleanup Welcome to BinBloom: City Cleanup, an exciting 3D garbage truck simulator! Drive powerful garbage trucks through colorful city streets, collect waste bins, operate robotic arms, and recycle…",
    "tags": [
      "3D",
      "3D Games",
      "Adventure",
      "Race",
      "Transport"
    ],
    "mobile": false
  },
  {
    "id": "gm-valetpro-parking-rush",
    "name": "ValetPro: Parking Rush",
    "url": "https://html5.gamemonetize.co/my0smd0yy62719rv3px7o11rsn0td84l/",
    "description": "Run the valet stand at a luxury hotel in this fast parking game! Guests arrive in their cars, hand you the keys and expect their car parked perfectly in its bay. Each guest has a patience timer: drive carefully, follow…",
    "tags": [
      "3D",
      "3D Games",
      "Carparking",
      "Race"
    ],
    "mobile": false
  },
  {
    "id": "gm-harvestoria-tractor-farming",
    "name": "HARVESTORIA: Tractor Farming",
    "url": "https://html5.gamemonetize.co/dgq6tibw52d82bej0b2fq1ng2dng7mci/",
    "description": "Start your own farm and grow it season by season! Walk around as a farmer, climb into your tractor and take on 40 levels of real farm work. Plough the fields, sow seeds, spray the crops, haul cargo in the trolley and…",
    "tags": [
      "3D",
      "Farm",
      "Racing"
    ],
    "mobile": false
  },
  {
    "id": "gm-animals-go-kart-2",
    "name": "Animals Go Kart 2",
    "url": "https://html5.gamemonetize.co/5lvm7dgodoay2myw73rbj3bb882qn9pr/",
    "description": "Animal Go Kart 2 is the fully 3D sequel to Animals Kart! Pick one of 8 cute animal drivers – Cat, Bunny, Panda, Fox, Duck, Frog, Rhino and Squirrel – and race on 8 colorful 3D tracks: Blue Coast, Desert Canyon, Jungle…",
    "tags": [
      "Racing",
      "Animal",
      "Arcade",
      "Cartoon",
      "Kart",
      "Mapi games",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-siren-city-ambulance-game",
    "name": "Siren City Ambulance Game",
    "url": "https://html5.gamemonetize.co/lo52ehnj192vzzwkdz3uygeag4jfz5p6/",
    "description": "Every second counts in Siren City! You drive an ambulance on emergency calls across a busy 3D city. Switch on your siren, weave through traffic and get to the accident scene fast. Your paramedics jump out, carry the…",
    "tags": [
      "3D",
      "3D Games",
      "Ambulance",
      "WebGL"
    ],
    "mobile": false
  },
  {
    "id": "gm-clutchcraft-drive-car-driving",
    "name": "ClutchCraft Drive: Car Driving",
    "url": "https://html5.gamemonetize.co/ggi3bte1vfb9m7neiooy4aeqknr8haoh/",
    "description": "**STEERNOVA – Real Car Driving Simulator** Get behind the wheel and experience the thrill of realistic car driving! Explore detailed city streets, drive through challenging roads, master parking skills, and learn…",
    "tags": [
      "3D",
      "3D Games",
      "Driving",
      "WebGL"
    ],
    "mobile": false
  },
  {
    "id": "gm-fire-rescue",
    "name": "Fire Rescue",
    "url": "https://html5.gamemonetize.co/w4s6nlmo1xiz7467pat4bm7qfw8b1s7a/",
    "description": "Answer emergency calls as a firefighter in Harbor County. Drive Engine 1 to the scene, connect the hose, put out the fire, search the rooms and carry civilians to safety. Earn funding, buy better gear, hire crew…",
    "tags": [
      "Boys",
      "3D",
      "3D Games",
      "Action",
      "Driving",
      "Fire"
    ],
    "mobile": false
  },
  {
    "id": "gm-deadzone-extraction",
    "name": "Deadzone Extraction",
    "url": "https://html5.gamemonetize.co/r528bry9g29a06z2y918ihjwdi4t0ntx/",
    "description": "Drop into infected districts, loot what you can and reach the evac before the horde overruns you. Everything you carry is at risk until you extract. Spend your haul in the Haven-7 settlement on guns, skills and…",
    "tags": [
      "Shooting",
      "3D",
      "3D Games",
      "Action",
      "Fps",
      "Multiplayer"
    ],
    "mobile": false
  },
  {
    "id": "gm-diy-sticker-dream-house",
    "name": "DIY Sticker Dream House",
    "url": "https://html5.gamemonetize.co/n9079auerl5mbysiul8jgeyy8nkdha3u/",
    "description": "DIY Sticker Dream House is a relaxing decorating game where you can create and customize a beautiful dream home with dream house stickers. This Cute DIY Game combines relaxing decoration, simple puzzles, and adorable…",
    "tags": [
      "Puzzle",
      "Cute",
      "Design",
      "Dress Up",
      "Relaxation",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-kids-cooking-shop",
    "name": "Kids Cooking Shop",
    "url": "https://html5.gamemonetize.co/d0cwijbpo6shcb1g47yi4p67n4474jst/",
    "description": "Kids Cooking Shop is a cheerful kids cooking management game where you run a cute street food stand for hungry animal customers! This free cooking game is easy to learn and brings a fun mix of cooking, serving, and shop…",
    "tags": [
      "Hypercasual",
      "Casual",
      "Amazing",
      "Animal",
      "Cute",
      "Management",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-blockcraft-racing-championship",
    "name": "Blockcraft Racing Championship",
    "url": "https://html5.gamemonetize.co/wfg984rqwv16b54qs2g9xheif6lfm1by/",
    "description": "Blockcraft Racing Championship is a blocky kart racer by BREYMANTECH. Race 7 rivals across 8 voxel tracks: Blocky Meadows, Sandstone Canyon, Frostbite Pass, Jungle Temple, Pixel Pier, Neon Block City, Lava Core and Sky…",
    "tags": [
      "Racing",
      "Car",
      "Drift",
      "Driving",
      "Mineblock",
      "Minecraft"
    ],
    "mobile": false
  },
  {
    "id": "gm-shiba-crossing",
    "name": "Shiba Crossing",
    "url": "https://html5.gamemonetize.co/degneeojubj2b4r4pgm8wsoaiyt9xih0/",
    "description": "A cute shiba is trying to cross a dangerous area safely, can you help it? There are turtle traps and floating tree trunks that the shiba should navigate carefully, lets conquer the difficulty and see what is in the end!",
    "tags": [
      "Adventure",
      "3D",
      "Animal"
    ],
    "mobile": false
  },
  {
    "id": "gm-fruit-shelf-sort",
    "name": "Fruit Shelf Sort",
    "url": "https://html5.gamemonetize.co/3dsk4zso4otfu745ps3z9ipnyu7657vl/",
    "description": "Fruit Shelf Sort is a juicy sorting puzzle with 40 levels. Drag fruit between the wooden shelves and bring three of the same kind together to squeeze them into juice. Clear the front row to reach the fruit hidden behind…",
    "tags": [
      "Puzzle",
      "1 Player",
      "Brain",
      "Casual",
      "Cute",
      "Food"
    ],
    "mobile": false
  },
  {
    "id": "gm-bao-bazaar-asmr",
    "name": "Bao Bazaar ASMR",
    "url": "https://html5.gamemonetize.co/w70yqv3p4vu2djhkkiiws05eso0jtr80/",
    "description": "Bao Bazaar ASMR is a cozy trading and collecting game about cute squishy bao buns. OPEN PACKS: pick a pack from the shelf, swipe to tear it open and lift the bamboo steamer lid to reveal a new bun of R, SR, SSR or UR…",
    "tags": [
      "Hypercasual",
      "Casual",
      "Collecting",
      "Collection",
      "Cute",
      "Food",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-ricochet-rage",
    "name": "Ricochet Rage",
    "url": "https://html5.gamemonetize.co/0hr6pzzunddgm2l4c15h2q5rp6hnm7ph/",
    "description": "Launch your stickman, bounce off the walls and smash every enemy in one shot! Ricochet Rage is a physics action game where every launch is a trick shot. Chain ricochets into big combos, unleash Rage mode and pick a new…",
    "tags": [
      "Arcade",
      "Adventure",
      "Fighting",
      "Halloween",
      "Physics",
      "Skill"
    ],
    "mobile": false
  },
  {
    "id": "gm-depth",
    "name": "DEPTH",
    "url": "https://html5.gamemonetize.co/a2ozwq0dtkdtxzlh2t722ntikz96o4zr/",
    "description": "Three days ago every machine at the Horizon-7 deep mining station stopped obeying people and began to speak with one voice: the Choir. You are Gleb Flint Kremenev, a cyborg foreman rebuilt after an accident he barely…",
    "tags": [
      "Shooting",
      "1 Player",
      "2026 games",
      "2D",
      "Arcade",
      "Best Games"
    ],
    "mobile": false
  },
  {
    "id": "gm-torque-trail",
    "name": "Torque Trail",
    "url": "https://html5.gamemonetize.co/9qs4z9lrn15alrsrxsznz8txk9zhkyrr/",
    "description": "Take the wheel of a powerful monster truck and tackle 20 physics-based driving challenges in Torque Trail! Balance over bridges, climb steep ramps, cross tricky obstacles and keep your vehicle upright all the way to the…",
    "tags": [
      "Racing",
      "3D",
      "Balance",
      "Car",
      "Driving",
      "Mentolatux"
    ],
    "mobile": false
  },
  {
    "id": "gm-obby-swim-for-egg",
    "name": "Obby Swim for Egg",
    "url": "https://html5.gamemonetize.co/uj2dbz892pmiysv3l0pynv59jm3bw7bx/",
    "description": "Walk up the highway into the flooded aquarium and swim: every biome holds a boss guarding a nest of eggs. Steal an egg, carry it home past the boss and hatch it on your farm. Creatures earn money: buy upgrades and…",
    "tags": [
      "Multiplayer",
      "3D",
      "Adventure",
      "Animal",
      "Egg",
      "Fish"
    ],
    "mobile": false
  },
  {
    "id": "gm-bite-club",
    "name": "BITE CLUB",
    "url": "https://html5.gamemonetize.co/v39f7nw5xkfo92ppyj2xma88g0639c68/",
    "description": "BITE CLUB is a late-night TV eating show gone wrong: a whole set is flooded with giant dessert and you have to eat your way out in first person. Every bite carves a real tunnel through jelly, sponge cake, chocolate and…",
    "tags": [
      "Clicker",
      "Idle",
      "3D",
      "Cake",
      "Candy",
      "Eating"
    ],
    "mobile": false
  },
  {
    "id": "gm-sticky-scenes",
    "name": "Sticky Scenes",
    "url": "https://html5.gamemonetize.co/38b9v0s4wrjm9pra3uoo6dminlbybx8s/",
    "description": "Sticky Scenes is a cozy sticker puzzle game full of cute animals, snacks and treats. HOW IT WORKS: a board of stickers sits above a row of empty sticker shapes. Find the sticker that matches a shape and tap it to stick…",
    "tags": [
      "Puzzle",
      "1 Player",
      "2D",
      "Animal",
      "Casual",
      "Cute",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-arrow-rush-escape",
    "name": "Arrow Rush Escape",
    "url": "https://html5.gamemonetize.co/w0oilqa4lre5zgabjjoj8zybd0i3rgh8/",
    "description": "Arrow Rush Escape is a neon puzzle where every tap slides an arrow off the board. Free the arrows in the right order: if one is still blocked, it bumps and you lose a heart. Slide snakes, thaw frozen blocks, turn…",
    "tags": [
      "Puzzle",
      "Arrow",
      "Brain",
      "Casual",
      "Levels",
      "Logic",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-city-tow-master-3d",
    "name": "City Tow Master 3D",
    "url": "https://html5.gamemonetize.co/wda6lkrux0i1j0x7j3o45fu014u98a6r/",
    "description": "Get behind the wheel of a powerful tow truck and become the citys top recovery driver! Answer dispatch calls, race through busy streets, highways and steep hill roads, and find broken-down, crashed and illegally parked…",
    "tags": [
      "3D",
      "3D Games",
      "Transport",
      "Unity games"
    ],
    "mobile": false
  },
  {
    "id": "gm-rally-trailblazers",
    "name": "RALLY TRAILBLAZERS",
    "url": "https://html5.gamemonetize.co/0o1ex6iynrpxoqsmvd56awvkk01cv7bh/",
    "description": "Rally Trailblazers is a fast off-road rally racing game. Race against 4 AI rivals across 40 stages in 5 worlds: Desert Dunes, Muddy Forest, Snow Pass, Red Canyon and Night Rally. Beat the clock: every checkpoint adds…",
    "tags": [
      "3D",
      "2026 games",
      "Car",
      "Racing"
    ],
    "mobile": false
  },
  {
    "id": "gm-ice-road-hauler",
    "name": "Ice Road Hauler",
    "url": "https://html5.gamemonetize.co/9nh1yspz7uiuxe3269gitbyqfhosmz7v/",
    "description": "Ice Road Hauler is an exciting extreme truck-driving adventure set in a frozen Arctic environment. Players take on the role of a professional ice-road trucker, transporting important cargo across dangerous frozen lakes…",
    "tags": [
      "3D",
      "Racing",
      "Transport",
      "Truck"
    ],
    "mobile": false
  },
  {
    "id": "gm-velocity-rift-world-tour",
    "name": "VELOCITY RIFT: World Tour",
    "url": "https://html5.gamemonetize.co/w1dj6aef2zv6t2q5z60m2xgip3xhcwz2/",
    "description": "**Description** Experience cross-class racing in **Velocity Rift: World Tour** by BREYMANTECH! Drive supercars, Formula machines, superbikes, and powerful trucks across eight destinations and 32 events. Master four…",
    "tags": [
      "Sports",
      "Car",
      "Driving"
    ],
    "mobile": false
  },
  {
    "id": "gm-one-last-clown",
    "name": "One Last Clown",
    "url": "https://html5.gamemonetize.co/ybuvqkl4eovcdmfatz6z3l8lfurigg8f/",
    "description": "Davi, 9, jumped the fence of an abandoned school at night, chasing a red balloon. You go in after him with a flashlight that will not last until morning. The clowns walking the halls are the children who never left the…",
    "tags": [
      "Adventure",
      "1 Player",
      "3D",
      "Escape",
      "Horror"
    ],
    "mobile": false
  },
  {
    "id": "gm-break-and-steal-my-egg",
    "name": "Break And Steal My Egg",
    "url": "https://html5.gamemonetize.co/i0lg8nothvxowmh1ps8k96zwf97uunl7/",
    "description": "Break giant eggs, steal them home and hatch rare animals! Train your power, unlock 30 wild worlds and escape their legendary guardians.",
    "tags": [
      "3D",
      ".io",
      "1 Player",
      "Action",
      "Amazing",
      "Animal"
    ],
    "mobile": false
  },
  {
    "id": "gm-insecta",
    "name": "Insecta",
    "url": "https://html5.gamemonetize.co/4tuc1gamr1d0x6k1jqrmaq4f5hbyqzkx/",
    "description": "Insecta is a fun and addictive Match-3 puzzle adventure set in a colorful world of fascinating bugs and tiny creatures! Enter a vibrant insect kingdom where your goal is to match three or more identical bugs to clear…",
    "tags": [
      "Puzzle",
      "Animal",
      "Match 3"
    ],
    "mobile": false
  },
  {
    "id": "gm-traffic-rider-neon-rush",
    "name": "Traffic Rider: Neon Rush",
    "url": "https://html5.gamemonetize.co/c9xqrzl9xi3t35362p4ny2vjf88tmfst/",
    "description": "Traffic Rider: Neon Rush is an exciting 3D motorcycle racing game where you ride a powerful sports bike through busy city highways filled with cars, trucks, and challenging traffic. Experience high-speed riding, dodge…",
    "tags": [
      "3D",
      "3D Games",
      "Bike",
      "Racing",
      "Simulator",
      "Traffic"
    ],
    "mobile": false
  },
  {
    "id": "gm-ring-clash",
    "name": "Ring Clash",
    "url": "https://html5.gamemonetize.co/65rr7hqpmjplyhfnf2pk5afptdkh1axh/",
    "description": "Ring Clash is a colorful match puzzle game where you connect matching rings on a grid and clear complete groups before the timer runs out. Changing layouts, layered obstacles, and time-based objectives turn every stage…",
    "tags": [
      "Hypercasual",
      "Casual",
      "Logic",
      "Matching",
      "Puzzle",
      "Relaxation",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-santa-magic-sort",
    "name": "Santa Magic Sort",
    "url": "https://html5.gamemonetize.co/3a3qfcwtkw6gggedhhodr5exrru5gsmo/",
    "description": "Santa Magic Sort is a cozy 3D Christmas puzzle game where you help Santa sort colorful liquids into festive glass vessels. Walk around the snowy workshop, move liquids between bottles, and fill the centerpiece with a…",
    "tags": [
      "Puzzle",
      "Arcade",
      "Brain",
      "Christmas",
      "Color",
      "Fun"
    ],
    "mobile": false
  },
  {
    "id": "gm-police-department-3d",
    "name": "Police Department 3D",
    "url": "https://html5.gamemonetize.co/jfquw19x7ayem6ybhl5ixivz2fkhxu31/",
    "description": "In this engaging simulator, you are the sheriff who can turn a prison into a profitable business. Build new blocks, hire staff, keep order, and increase income. Every decision affects security and budget – become the…",
    "tags": [
      "Hypercasual",
      "Casual",
      "3D",
      "3D Games",
      "Action",
      "Business",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-drift-city-car-driving-games",
    "name": "Drift City Car Driving Games",
    "url": "https://html5.gamemonetize.co/1a6vy9mevmusbmab6m6hox8ccq14i2zj/",
    "description": "Drift City Car Driving Games is a fast drifting game. Slide your car across race tracks, snowy highways and city roads. The longer and wider your drift, the more points and coins you earn. FEATURES - 40 levels in 4…",
    "tags": [
      "3D",
      "Car",
      "Drift",
      "Racing"
    ],
    "mobile": false
  },
  {
    "id": "gm-strike-a-pose",
    "name": "Strike a Pose",
    "url": "https://html5.gamemonetize.co/wvi0r7huelq489srpaz1na0telfw3x9k/",
    "description": "Bend, stretch, and flex your way through tricky obstacles! In Strike a Pose, time your movements perfectly to squeeze past tight gaps, dodge furniture, and collect shiny gems down vibrant indoor tracks. Master extreme…",
    "tags": [
      "Girls",
      "Adventure",
      "Arcade",
      "Fun",
      "Girl",
      "Sports",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-cozy-garden",
    "name": "Cozy Garden",
    "url": "https://html5.gamemonetize.co/t3o76jy6azv7k13v3180fhlg0wovallp/",
    "description": "Turn neglected outdoor spaces into beautiful and cozy places. Remove trash, rake leaves, clean paths, and restore each area. Grow flowers, assemble arrangements, and choose decorations that match your style. Complete…",
    "tags": [
      "Hypercasual",
      "Casual",
      "1 Player",
      "2026 games",
      "2D",
      "Android",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-hero-vs-traps",
    "name": "Hero vs Traps",
    "url": "https://html5.gamemonetize.co/rqyng89014yaoskcbee9e88bgf854uh9/",
    "description": "Guide a brave hero through a series of dangerous levels where one wrong move can lead straight into a spinning blade. Moving saws, tricky mechanisms, locked passages, and unusual bosses await along the way. Each stage…",
    "tags": [
      "Hypercasual",
      "Casual",
      "1 Player",
      "2026 games",
      "2D",
      "Arcade",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-cold-impact-rocket-missions",
    "name": "COLD IMPACT: Rocket Missions",
    "url": "https://html5.gamemonetize.co/rrur3azqt0b487dh6vhdib77yg9agpm6/",
    "description": "COLD IMPACT: Rocket Missions is a fast one-more-run 3D arcade game. Charge your rocket, launch it and smash through a destructible world: tanks, helicopters, bridges, then giant Titans and an abyssal sea boss. 2 levels…",
    "tags": [
      "Arcade",
      "1 Player",
      "3D",
      "Action",
      "Destruction",
      "Flight"
    ],
    "mobile": false
  },
  {
    "id": "gm-drone-zero-racing",
    "name": "DRONE ZERO RACING",
    "url": "https://html5.gamemonetize.co/7qb17j82wkq6m3xyc5nfrkp2m18cvwdk/",
    "description": "Drone Zero Racing is a fast 3D drone race in a rainy neon city at night. Race 7 rivals on 10 floating tracks with tunnels, jumps and storms. Hit boost pads, fly through turbo rings and use the airbrakes on sharp…",
    "tags": [
      "Racing",
      "Mapi games",
      "Race",
      "Ships",
      "Space",
      "Spaceship"
    ],
    "mobile": false
  },
  {
    "id": "gm-splash-rush",
    "name": "Splash Rush",
    "url": "https://html5.gamemonetize.co/s1rqvojgwdpuia5f84udakgk9ss8rgfy/",
    "description": "Race down giant water slides, dodge rivals, use your glider to skip tracks and grab coins! Explore 150 levels across 15 worlds, unlock 24 characters and finish in the top 3. Play free on mobile or desktop!",
    "tags": [
      "Hypercasual",
      "Casual",
      ".io",
      ".io Games",
      "1 Player",
      "2025 games"
    ],
    "mobile": false
  },
  {
    "id": "gm-how-to-rob-a-bank",
    "name": "How to Rob a Bank",
    "url": "https://html5.gamemonetize.co/qmx4hro4g9ok5a5uzqb7vxfubdaxbo4u/",
    "description": "How to Rob a Bank is a 3D heist game inspired by the 2026 movie How to Rob a Bank, where a crew in animal masks livestreams a bank robbery while the police close in. You play the wolf, across three stages. The Breach…",
    "tags": [
      "Shooting",
      "3D",
      "3D Games",
      "Action",
      "Shoot",
      "Shooter"
    ],
    "mobile": false
  },
  {
    "id": "gm-nitro-crush-monster-truck",
    "name": "Nitro Crush Monster Truck",
    "url": "https://html5.gamemonetize.co/qbyp7g3a9jax77369jma55imqu5xmebb/",
    "description": "Giant wheels. Zero brakes. Pure mayhem! Race massive monster trucks through 30 high-octane levels, crush the competition, and become the King of the Arena! 3 Game Modes: Race against rival trucks, beat the clock in Time…",
    "tags": [
      "3D",
      "Monstertruck",
      "Racing",
      "Unity games",
      "WebGL"
    ],
    "mobile": false
  },
  {
    "id": "gm-the-outbreak",
    "name": "The outbreak",
    "url": "https://html5.gamemonetize.co/2bwl0bgss8pel01d0bm3xcscnv9uh1e4/",
    "description": "The Outbreak drops you into a city that has already fallen. Your weapon fires itself — your job is to keep moving, pick the right upgrades, and live through twelve waves of the dead in each of five zones.",
    "tags": [
      "Shooting",
      "Action",
      "Apocalypse",
      "Zombie"
    ],
    "mobile": false
  },
  {
    "id": "gm-find-67-in-brainrot-world",
    "name": "Find 67 in brainrot World",
    "url": "https://html5.gamemonetize.co/11h4yo16w84haz94xhr2ioqdjgcxfb72/",
    "description": "Find Hidden Object in Crazy World is a silly hidden-object adventure packed with weird characters and brainrot surprises! Explore colorful cartoon scenes, spot hidden characters, and tap to find them. From the crazy 67…",
    "tags": [
      "Puzzle",
      "Brain",
      "Brainrot",
      "Brainrot Italian",
      "Hidden",
      "Italian Brainrot"
    ],
    "mobile": false
  },
  {
    "id": "gm-frosty-peak-santas-3d-odyssey",
    "name": "Frosty Peak: Santas 3D Odyssey",
    "url": "https://html5.gamemonetize.co/was5rk73clunv5v5igw2mvy5umx976zb/",
    "description": "Frosty Peak: Santas 3D Odyssey is a festive 3D action-platformer featuring 30 handcrafted sky-worlds across 3 epic chapters! Master Santas double-jump backflip, cross slippery ice bridges and crumbling platforms, dodge…",
    "tags": [
      "Adventure",
      "Christmas",
      "Jumping",
      "Obstacle",
      "Parking"
    ],
    "mobile": false
  },
  {
    "id": "gm-glow-hop",
    "name": "Glow Hop",
    "url": "https://html5.gamemonetize.co/f99cr50jac2mdo7ex4uv3fvim0uglxnw/",
    "description": "Enter a colorful endless adventure in Glow Hop! Guide your glowing ball across floating platforms and land perfect jumps to build combos. Explore vibrant worlds, collect gems, and grab helpful power-ups. Unlock skins…",
    "tags": [
      "Hypercasual",
      "Casual",
      "Arcade",
      "Ball",
      "Endless",
      "Jumping",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-deadpack",
    "name": "Deadpack",
    "url": "https://html5.gamemonetize.co/isjhecxu9gcmj01nh58gmcftowcuatm4/",
    "description": "DEADPACK is a backpack management auto-battler where your loadout is your lifeline. Pack weapons into a limited inventory, merge matching gear into stronger versions, and fight hordes of monsters. Your hero attacks…",
    "tags": [
      "Arcade",
      "1 Player",
      "Action",
      "Battle",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-dash-slash",
    "name": "Dash & Slash",
    "url": "https://html5.gamemonetize.co/56wzq0cuv3c4ryszun8e7zbi5ryy158o/",
    "description": "You are a swift stickman ninja armed with a sword. Choose a direction, launch into a lightning-fast dash, and eliminate opponents before they can stop you. Each arena is a short test of planning and reflexes. Plot your…",
    "tags": [
      "Stickman",
      "1 Player",
      "2026 games",
      "3D",
      "3D Games",
      "Android"
    ],
    "mobile": false
  },
  {
    "id": "gm-dream-room-arrangement-of-objects",
    "name": "Dream room: arrangement of objects",
    "url": "https://html5.gamemonetize.co/2q212a57otbt2gnq0l5djmp9we2raexm/",
    "description": "Do you like to put things in order in the house? So that everything is in its place? You found what you need! A new game about sorting, cleaning and arranging objects in their places! A relaxing game in which it is…",
    "tags": [
      "Puzzle",
      "2D",
      "Android",
      "Balance",
      "Brain",
      "Casual",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-pyramid-builders",
    "name": "Pyramid Builders",
    "url": "https://html5.gamemonetize.co/4rzifxp6qh4206jb3yjk04v94kx72rmq/",
    "description": "How did they REALLY build the pyramids? Dig clay, stack bricks, hire a chunky crew... and dont ask about the UFO. Grab a shovel and start at the bottom. Dig clay at the pit, press it into bricks, let them dry on the…",
    "tags": [
      "Clicker",
      "Idle",
      "3D",
      "Alien",
      "Builder",
      "Building"
    ],
    "mobile": false
  },
  {
    "id": "gm-sporty-chic-athleisure",
    "name": "Sporty Chic Athleisure",
    "url": "https://html5.gamemonetize.co/txnw7kjoic86nubh62sinb3q9672tbpo/",
    "description": "Two best friends are waiting for you in the game - Lily and Wolf Fang. Lilia loves water sports and even looks stylish by the pool. And Wolf Fang prefers land-based activities and combines sports with fashion trends…",
    "tags": [
      "Girls",
      "Dress Up",
      "Fashion",
      "Sport"
    ],
    "mobile": false
  },
  {
    "id": "gm-obby-cut-the-grass-for-egg",
    "name": "Obby Cut the Grass for Egg",
    "url": "https://html5.gamemonetize.co/49xxs28kzx9wsfmqym5tw1fp5j63fdn0/",
    "description": "Cut the grass to grow stronger, find the eggs hidden in the meadow and carry them home past the boss. Hatch creatures on your farm, earn gold, buy better blades and auras, and rebirth for permanent bonuses. Travel to…",
    "tags": [
      "Clicker",
      "Idle",
      "3D",
      "Adventure",
      "Animal",
      "Egg"
    ],
    "mobile": false
  },
  {
    "id": "gm-idle-junkyard-empire",
    "name": "Idle Junkyard Empire",
    "url": "https://html5.gamemonetize.co/c1rqfmcrg7eg0tj5ct0zxxwzut06vtid/",
    "description": "Turn a small junkyard into your own business empire. Collect salvage, stock your shelves, serve customers and upgrade your yard in a colorful 3D management game. Keep your business moving and build your junkyard step by…",
    "tags": [
      "Clicker",
      "Idle",
      "Management",
      "Simulation"
    ],
    "mobile": false
  },
  {
    "id": "gm-sunny-wheels-adventure",
    "name": "Sunny Wheels Adventure",
    "url": "https://html5.gamemonetize.co/pyz0hbc98lbxssjrib1pd0onu965a8u5/",
    "description": "Take a little car on a big off-road adventure. Cross coastal bridges, frozen passes, jungle gates and floating islands in 13 levels. Collect coins, unlock cars, upgrade the engine, suspension and boost, and earn up to…",
    "tags": [
      "Racing",
      "Arcade",
      "Car",
      "Race"
    ],
    "mobile": false
  },
  {
    "id": "gm-trust-issues-lying-signs",
    "name": "Trust Issues: Lying Signs",
    "url": "https://html5.gamemonetize.co/oympawyxsbacxjj4j16merc0nnr2ixaf/",
    "description": "Trust Issues: Lying Signs is a funny troll platformer where every sign lies! Safe path leads to spikes, No key needed means you need the key, and the exit door might eat you. Beat 25 tricky levels across unique worlds…",
    "tags": [
      "Puzzle",
      "2D",
      "Funny",
      "Jump",
      "Platform",
      "Trap"
    ],
    "mobile": false
  },
  {
    "id": "gm-hydro-rush",
    "name": "HYDRO RUSH",
    "url": "https://html5.gamemonetize.co/q7mub39j3fvwmo6g1suc5mz0x2h2h68w/",
    "description": "Speedboat racing on real moving water. Race 3 rivals on 12 stages: tropical lagoon, neon marina at night, alpine lake, storm bay, sunset canyon, coral coast and all their reverse routes. Drift around the buoys, jump the…",
    "tags": [
      "Sports",
      "Boat",
      "Mapi games",
      "Race",
      "Racing"
    ],
    "mobile": false
  },
  {
    "id": "gm-tidewash",
    "name": "Tidewash",
    "url": "https://html5.gamemonetize.co/mp8cv16o9oaedmotr1yy622b8u5aumy1/",
    "description": "Tidewash is a calm puzzle with a twist: the beach shrinks. Drag pieces onto the dry sand and build groups of three or more of the same colour. Every few placements a wave rolls in, one row higher. Groups that touch the…",
    "tags": [
      "Puzzle",
      "Block",
      "Brain",
      "Casual",
      "Levels",
      "Logic",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-noobs-sand-art",
    "name": "Noob's Sand Art",
    "url": "https://html5.gamemonetize.co/wd9r8bs8czfij3zt0qaya4t9pgv6yot5/",
    "description": "Pour, color, and create in Noob's Sand Art! Pick up a bucket of colored sand and guide Noob across a wooden tray to bring pixel pictures to life. Start with a bright strawberry, then unlock more designs, from bunnies…",
    "tags": [
      "Puzzle",
      "3D",
      "Coloring",
      "Educational",
      "Fun",
      "Kids",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-moto-rush-stadium-sprint",
    "name": "Moto Rush: Stadium Sprint",
    "url": "https://html5.gamemonetize.co/arlwoxmsfox6vgxxcsj38gf1y9v17avh/",
    "description": "Get on your bike and race for the trophy in Moto Rush: Stadium Sprint! Line up on the grid against up to 7 AI riders and blast through 20 levels on sprint tracks with packed grandstands, cheering crowds and tight…",
    "tags": [
      "3D",
      "3D Games",
      "Unity games",
      "WebGL"
    ],
    "mobile": false
  },
  {
    "id": "gm-micro-gt-racing",
    "name": "Micro GT Racing",
    "url": "https://html5.gamemonetize.co/uk7aj3jxm3m01jrhcuh1y85vev05l3gu/",
    "description": "Race fast micro cars across 12 desert tracks, upgrade your ride, then defend your garage from dragons in match-3 tower defense. Survive 365 nights!",
    "tags": [
      "Racing",
      "Car tuning",
      "Simulation",
      "Simulator"
    ],
    "mobile": false
  },
  {
    "id": "gm-bioshock-last-light",
    "name": "BioShock: Last Light",
    "url": "https://html5.gamemonetize.co/qsr0qv5uobcv7ygeaodytpe02ga9w539/",
    "description": "BioShock: Last Light is a 2D underwater action adventure starring Edda, a repair diver inside a failing ocean colony. Explore 16 connected areas, restore electrical relays and protect the oxygen network with a rivet gun…",
    "tags": [
      "Shooting",
      "1 Player",
      "2D",
      "Action",
      "Adventure",
      "Gun",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-chicago-mayhem",
    "name": "CHICAGO MAYHEM",
    "url": "https://html5.gamemonetize.co/g92bp0uqwl0kz2c4swvhkgfhkrcr6x1e/",
    "description": "Chicago Mayhem is a third-person shooter where every gunman in the city fights for himself. Bots fight bots, police shoot anyone with a gun, and you are caught in the middle. Start with a pistol and take guns from those…",
    "tags": [
      "Shooting",
      "3D",
      "Car",
      "City",
      "Gun",
      "Police"
    ],
    "mobile": false
  },
  {
    "id": "gm-football-world-27",
    "name": "Football World 27",
    "url": "https://html5.gamemonetize.co/ztwofppnprm53yk5ie6ko94i7cr3x0oz/",
    "description": "Lead your club in a full 11v11 football match with a broadcast camera and real match rules. Play a Quick Match, win the FW Cup, climb the World League, build a dream squad from packs, manage a clubs transfers and…",
    "tags": [
      "Sports",
      "3D",
      "3D Games",
      "Football",
      "Soccer"
    ],
    "mobile": false
  },
  {
    "id": "gm-gokart-rush",
    "name": "GOKART RUSH",
    "url": "https://html5.gamemonetize.co/wh32i5929ps1i13v1a4ca4w8jonh9r8o/",
    "description": "Kart Rush is a kart racing game with items. Pick up the question boxes and fire rockets, drop oil, throw bombs or call thunder on the karts in front of you. Drift in the corners for a turbo, use your nitro and try a…",
    "tags": [
      "Racing",
      "Arcade",
      "Kart",
      "Mapi games"
    ],
    "mobile": false
  },
  {
    "id": "gm-football-wars",
    "name": "Football Wars",
    "url": "https://html5.gamemonetize.co/rgwfi8aiuc7invkxp9u9fi5olxzc26oc/",
    "description": "Football with no referee and a lot of weapons. Pick a hero, score goals and knock out anyone who gets in your way in fast online team matches. Earn coins and gems, unlock heroes and skins, climb the ranked ladder and…",
    "tags": [
      "Sports",
      "3D",
      "3D Games",
      "Action",
      "Football",
      "Multiplayer"
    ],
    "mobile": false
  },
  {
    "id": "gm-drift-rush-stunt-park",
    "name": "Drift Rush: Stunt Park",
    "url": "https://html5.gamemonetize.co/63fx5vwpiz1foeg3kh760tajtrwwg33h/",
    "description": "Slide chunky toy cars through a sunny city and a desert stunt park. Chain long drifts, launch off giant ramps, spin in the air and smash cones to build huge combos. Clear 24 levels, earn coins and unlock six cars with…",
    "tags": [
      "Racing",
      "3D",
      "Car",
      "City",
      "Drift",
      "Driving"
    ],
    "mobile": false
  },
  {
    "id": "gm-peak-racer",
    "name": "Peak Racer",
    "url": "https://html5.gamemonetize.co/dl10jq4bdw8hch3jybphkx8jp61qw2ao/",
    "description": "Peak Racer is a physics-based hill climb racing game. Drive 25 vehicles, from dirt bikes and rally cars to monster trucks, diesel duallys and electric cars, across 8 worlds full of hills, jumps and weather. Race AI…",
    "tags": [
      "Racing",
      "Cars",
      "Driving",
      "Monstertruck",
      "Physics",
      "Truck"
    ],
    "mobile": false
  },
  {
    "id": "gm-oil-tanker-truck-simulator",
    "name": "Oil Tanker Truck Simulator",
    "url": "https://html5.gamemonetize.co/v1ljm87i05oypn7ce9kcmuuv67xly1lf/",
    "description": "Become a professional oil tanker driver! Hook up the tanker, load the oil and transport it from one location to another across challenging roads. A heavy tanker needs smooth steering, smart braking and careful driving…",
    "tags": [
      "Racing",
      "3D",
      "3D Games",
      "Simulation",
      "Simulator"
    ],
    "mobile": false
  },
  {
    "id": "gm-sky-ramp-fury",
    "name": "Sky Ramp Fury",
    "url": "https://html5.gamemonetize.co/v5glv774jxnl6vbx1fcbx01uip0u4ir8/",
    "description": "aunch your car off giant ramps high above the clouds! Sky Ramp Fury is a 3D car stunt game packed with 16 levels of huge drops, spiral tubes, lifts, moving platforms and wild jumps. Pick from 5 cars, paint your ride…",
    "tags": [
      "3D",
      "3D Games",
      "Carparking",
      "Stunts"
    ],
    "mobile": false
  },
  {
    "id": "gm-ring-unhook",
    "name": "Ring Unhook",
    "url": "https://html5.gamemonetize.co/c2fe1c43umcmby4hx1mxdmorwvcx51q0/",
    "description": "Ring Unhook is a calm rotating-ring puzzle. Colorful rings are hooked onto each other, and every ring has a gap. HOW TO PLAY: drag a ring to spin it around its center. Turn its gap to the hook that holds it and the ring…",
    "tags": [
      "Puzzle",
      "2D",
      "Brain",
      "Casual",
      "Logic",
      "Mind",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-help-me-brain-tricky-story",
    "name": "Help Me: Brain Tricky Story",
    "url": "https://html5.gamemonetize.co/si3n3lq3re14z3920y9djp9syit0awit/",
    "description": "Help Me: Brain Tricky Story is a funny brain teaser full of silly cartoon stories. The stick-figure characters keep getting into awkward little troubles, and only your clever thinking can get them out! LEVELS: 31 short…",
    "tags": [
      "Puzzle",
      "2D",
      "Brain",
      "Casual",
      "Funny",
      "Logic",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-blue-break",
    "name": "Blue Break",
    "url": "https://html5.gamemonetize.co/7i4082jnczjapzzmmcz7mgq77ox58h2c/",
    "description": "BLUE BREAK – Ride the wave. Dodge the crowd. Beat the shark. Blue Break is a first-person surf arcade game that runs straight in your web browser, on PC and on mobile. Youre on the board. Paddle out, pop up on the…",
    "tags": [
      "Sports",
      "1 Player",
      "Arcade",
      "Board",
      "Skateboard",
      "Surfers"
    ],
    "mobile": false
  },
  {
    "id": "gm-storky-number-drop",
    "name": "Storky Number Drop",
    "url": "https://html5.gamemonetize.co/7schjq4siii6mma51hxzqmwicgj8lc14/",
    "description": "Storky Number Drop is a juicy merge puzzle where every number is a wobbly bag of water! Pick one of three bags, pull Storkys rubber band back and let go. Touch two bags with the same number and they melt together into…",
    "tags": [
      "Puzzle",
      "2048",
      "Ball",
      "Ballon",
      "Bubble",
      "Casual"
    ],
    "mobile": false
  },
  {
    "id": "gm-hold-to-grow",
    "name": "Hold To Grow",
    "url": "https://html5.gamemonetize.co/sfzjuxc5f5fvusf14l6sgkfk3uutq12d/",
    "description": "Hold to Grow is a one-button 3D runner. Hold to grow bigger, release to shrink! Run along a wooden bridge over the sea and change your size to get past every obstacle: grow big to smash brick walls and wooden crates…",
    "tags": [
      "Hypercasual",
      "Casual",
      "3D",
      "New",
      "Onetouch",
      "Running"
    ],
    "mobile": false
  },
  {
    "id": "gm-bloxy-last-stand",
    "name": "Bloxy Last Stand",
    "url": "https://html5.gamemonetize.co/om7m3mc6coazbyo1f139tfy7iuuhdfgl/",
    "description": "The zombies are closing in, and Bloxy's home is their next target! Grab your rifle, keep moving and turn your last refuge into a fortress. Your weapon fires automatically—your job is to dodge danger, collect gold and…",
    "tags": [
      "Shooting",
      "1 Player",
      "Action",
      "Gun",
      "Logic",
      "Mineblock"
    ],
    "mobile": false
  },
  {
    "id": "gm-boing-knight",
    "name": "Boing Knight",
    "url": "https://html5.gamemonetize.co/uflmxga2xz7hxrenq0owzvr34190ldad/",
    "description": "Boing Knight is a bouncy arcade platformer! Your little knight never stops jumping on his pogo stick. Steer him up a giant beanstalk tower, slam down for Big Bounces and stomp monsters to climb even faster. But hurry…",
    "tags": [
      "Arcade",
      "2D",
      "Battle",
      "Fun",
      "Jumping",
      "Knight"
    ],
    "mobile": false
  },
  {
    "id": "gm-eggcavation",
    "name": "Eggcavation",
    "url": "https://html5.gamemonetize.co/68njb4nnjsy7smsg53nnbsuddiu4tkuk/",
    "description": "There is an egg. It is very big. Your job: crack it open. Chip the giant egg plate by plate in first person, fill your bucket and sell the shards at the terminal. Spend the cash on bigger tools (pickaxe, sledgehammer…",
    "tags": [
      "Clicker",
      "Idle",
      "3D",
      "Casual",
      "Destruction",
      "Egg",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-1-wings-keyboard-speed",
    "name": "+1 Wings Keyboard Speed",
    "url": "https://html5.gamemonetize.co/dnogptr1qkafwhhcq3qltxve9oz0iwxs/",
    "description": "Run down the giant keyboard highway: every key you step on trains your Speed. Jump, flap your wings and glide as far as you can, then land on a trophy pad to win trophies. Pads further out over the water pay much more…",
    "tags": [
      "Multiplayer",
      "3D",
      "Casual",
      "Fly",
      "Fun",
      "Running"
    ],
    "mobile": false
  },
  {
    "id": "gm-crash-core",
    "name": "Crash Core",
    "url": "https://html5.gamemonetize.co/7g7sotgq7i75vbhvyx31q9hnns00zp4d/",
    "description": "Smash your way through everything in Crash Core! Control a powerful rolling core, build up speed and crash through crates, walls, containers and heavy machinery. Collect scrap, choose new upgrades and grow stronger as…",
    "tags": [
      "Arcade",
      "Action",
      "Ball",
      "Collecting",
      "Destroy",
      "Destruction",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-fin-freedom",
    "name": "Fin Freedom",
    "url": "https://html5.gamemonetize.co/o2f3e9bf9tuncyq8wscvwd97tzn6rfcd/",
    "description": "Guide a brave little fish through dangerous underwater pipe networks in Fin Freedom! Pull key pins, outsmart lurking ocean predators, and redirect streams of water to avoid deadly lava hazards. Solve increasingly tricky…",
    "tags": [
      "Arcade",
      "2D",
      "Adventure",
      "Animal",
      "Fish",
      "Unity3D",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-park-perfect-car-simulator",
    "name": "Park Perfect: Car Simulator",
    "url": "https://html5.gamemonetize.co/ogdsz3drmcx0uueua5v0m77ukei9kczk/",
    "description": "Think you can park? Prove it. **Park Perfect: Car Simulator** is a 3D parking challenge with real car physics. Drive through tight cone-lined lanes, take sharp bends, crawl over speed bumps and slide into the yellow…",
    "tags": [
      "Racing",
      "3D",
      "Carparking",
      "Parking",
      "Simulation"
    ],
    "mobile": false
  },
  {
    "id": "gm-obby-sail-for-egg",
    "name": "Obby Sail for Egg",
    "url": "https://html5.gamemonetize.co/qpe5ipzu617h0zb7cr6mytacz2ar0dvj/",
    "description": "Sail your boat from the harbour to ten islands: the further out, the rarer the eggs. Steal an egg from each island nest, outrun the hunter ship on the way home and hatch it into a pet that earns money. Buy faster boats…",
    "tags": [
      "Multiplayer",
      "3D",
      "Adventure",
      "Boat",
      "Egg",
      "Water"
    ],
    "mobile": false
  },
  {
    "id": "gm-frontline-conquest",
    "name": "Frontline Conquest",
    "url": "https://html5.gamemonetize.co/ixui8l4a3c7zejutjcrw7gkuknv2a4o9/",
    "description": "Fight for control of Port Valor in a first-person combined-arms shooter. Capture flags with your squad, pick a class, drive tanks and vehicles, revive teammates and blow through destructible cover. Play online or…",
    "tags": [
      "Shooting",
      "3D",
      "Army",
      "Battle",
      "Fps",
      "Gun"
    ],
    "mobile": false
  },
  {
    "id": "gm-egg-raid-nest-heist",
    "name": "Egg Raid: Nest Heist",
    "url": "https://html5.gamemonetize.co/sprx8yusqu3ut92wjsdxom5fu9w1cvbm/",
    "description": "You are a small thief with a big backpack and a taste for eggs. Sneak past geese, lizards and drakes, grab an egg from their nest, carry it home and hatch a pet that earns coins for you. Collect 18 pets across three…",
    "tags": [
      "Arcade",
      "3D",
      "3D Games",
      "Casual",
      "Collecting",
      "Cute"
    ],
    "mobile": false
  },
  {
    "id": "gm-god-of-war-titan-revolt",
    "name": "God of War: Titan Revolt",
    "url": "https://html5.gamemonetize.co/cm7vuz6vvjn18dho9sykgdet1ezwy52q/",
    "description": "Guide Asha through a mythic 2D action adventure with chained blades, towering ruins and dangerous guardians. Cross 48 scenes, evade attacks, time a parry and use the grapple to reach new paths. Shrine checkpoints keep…",
    "tags": [
      "Arcade",
      "1 Player",
      "2D",
      "Action",
      "Fantasy",
      "Fighting"
    ],
    "mobile": false
  },
  {
    "id": "gm-ocean-land-fish-game",
    "name": "Ocean Land Fish Game",
    "url": "https://html5.gamemonetize.co/yw4bxe2ljn6iuwuyrl9ienyjmp1u9w2d/",
    "description": "Ocean Land: Fish Match Puzzle Dive into the beautiful underwater world of **Ocean Land!** Match colorful fishes with their corresponding fish goals and complete each level. There are **4 Fish Goals** displayed on the…",
    "tags": [
      "Puzzle",
      "Brain",
      "Casual",
      "Hypercasual",
      "Matching",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-toy-traffic-escape",
    "name": "Toy Traffic Escape",
    "url": "https://html5.gamemonetize.co/mo3yisdt9vx45wv6dw79jw63wjkgcb8j/",
    "description": "Welcome to Toy Traffic Escape! Get ready for a fun and challenging puzzle adventure! Slide colorful toy cars, clear traffic jams, and help the red car reach the exit. Explore 10 unique worlds, solve 100 challenging…",
    "tags": [
      "Racing",
      "Brain",
      "Bricks",
      "Bus",
      "Cars",
      "Maze"
    ],
    "mobile": false
  },
  {
    "id": "gm-freestyle-asmr-makeup-artist",
    "name": "Freestyle ASMR Makeup Artist",
    "url": "https://html5.gamemonetize.co/x8klw6glkewdzjljql01wdnfhw2bh48k/",
    "description": "Create makeup your way in Freestyle ASMR Makeup Artist, a hands-on 3D beauty simulation with satisfying ASMR-inspired sounds and true freehand control. Choose brushes, liner, mascara, lip colour, highlighter, face gems…",
    "tags": [
      "Girls",
      "3D",
      "Beauty",
      "Fashion",
      "Makeover",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-fruit-jam-color-sort",
    "name": "Fruit Jam: Color Sort",
    "url": "https://html5.gamemonetize.co/c9qoowzo181v29s5xnxdfifb67s1wten/",
    "description": "Fruit Jam: Color Sort is a fun fruit-themed Free Online Puzzle Game that combines color sorting, truck matching, and picture collection. Match each fruit with the correct colored truck, clear the board, complete levels…",
    "tags": [
      "Puzzle",
      "Collecting",
      "Fruits",
      "Fun",
      "Sorting",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-scrib-dies-a-lot",
    "name": "Scrib Dies a Lot",
    "url": "https://html5.gamemonetize.co/i539ioxvms59dcf9cxuyxae6kctpru9h/",
    "description": "Scrib Dies a Lot is an inventive 2D paper-folding puzzle platformer set entirely inside a students sketchbook. Guide Scrib, a fragile sketched hero, through hazardous hand-drawn notebook pages packed with pencil tips…",
    "tags": [
      "Puzzle",
      "Arcade",
      "Brain",
      "Logic",
      "Obstacle"
    ],
    "mobile": false
  },
  {
    "id": "gm-road-trip-taxi-adventure",
    "name": "Road Trip Taxi Adventure",
    "url": "https://html5.gamemonetize.co/lt6plobm2rbc3xto7b9yf7xffrusf9xa/",
    "description": "Taxi Road Rush: Pick & Drop is a 3D taxi driving game set on long forest and desert highways. Pick up passengers from petrol pumps, houses, dhabas and parks, then drop them at their destination before time runs out…",
    "tags": [
      "Adventure",
      "3D Games",
      "Racing"
    ],
    "mobile": false
  },
  {
    "id": "gm-grand-father-action-6",
    "name": "Grand Father Action 6",
    "url": "https://html5.gamemonetize.co/ul3a98oubgkb497278lpuqhaao10ig9o/",
    "description": "Step into the streets with Benoit, a bold, bald man who's not afraid to take control of the city! In Grand Father Action 6, the chaos is bigger, louder, and wilder than ever. Drive through a sprawling open world, take…",
    "tags": [
      "Adventure",
      "Crafting",
      "Driving",
      "Gta",
      "Simulator"
    ],
    "mobile": false
  },
  {
    "id": "gm-buggy-blast",
    "name": "Buggy Blast",
    "url": "https://html5.gamemonetize.co/mhq7dkxptawlxxw3i9qt83trvlaxf65m/",
    "description": "Buggy Blast is an action-packed off-road racer featuring 12 World Circuit stages. Start with one track and finish first to unlock the next challenge. Race four laps through forests, mountain nights, snow, storms, desert…",
    "tags": [
      "Racing",
      "Arcade",
      "Buggy",
      "Car",
      "Mapi games",
      "Sport"
    ],
    "mobile": false
  },
  {
    "id": "gm-survive-zombie-arena",
    "name": "Survive Zombie Arena",
    "url": "https://html5.gamemonetize.co/ofusrk8bwra359c2k6ny7nm3po7db31f/",
    "description": "Survive Zombie Arena is an exciting zombie survival arena game that mixes wave survival, tower defense, and fast action shooting. Enter the Roblox-style arena, fight huge groups of zombies, protect your base, and…",
    "tags": [
      "Shooting",
      "Action",
      "Defense",
      "Strategy",
      "Survival"
    ],
    "mobile": false
  },
  {
    "id": "gm-obby-snow-shoveling",
    "name": "Obby Snow Shoveling",
    "url": "https://html5.gamemonetize.co/08oj8rboxptylyp86aze0cvgpp9cn4cg/",
    "description": "Shovel snow to grow stronger and dig up treasures frozen in the drifts. Sell them for cash, buy better shovels and auras, and push into nine snowy biomes where the snow is tougher and the treasure rarer. Rebirth for…",
    "tags": [
      "Multiplayer",
      "3D",
      "Clicker",
      "Simulator",
      "Snow",
      "Winter"
    ],
    "mobile": false
  },
  {
    "id": "gm-obby-1-roll-ice-cream",
    "name": "Obby +1 Roll Ice Cream",
    "url": "https://html5.gamemonetize.co/kixbn3kfldjpagkyfbmvsvzu9mk5b7qw/",
    "description": "Push your scoop over the ice cream fields: every fresh tile rolls onto your giant ice cream roll. Run down the Sweet Road where each biome has a buyer who chases you down; the deeper they catch you, the more cash they…",
    "tags": [
      "Multiplayer",
      "3D",
      "Cute",
      "Fun",
      "Running",
      "Simulator"
    ],
    "mobile": false
  },
  {
    "id": "gm-sky-fling",
    "name": "Sky Fling",
    "url": "https://html5.gamemonetize.co/w7t3lwlxq46987rzrmmgdmt6mzgsgwl8/",
    "description": "Sky Fling is a 3D plane launching game where your goal is simple: fly as far as you can! Pull back the giant slingshot and launch your plane into the sky. You start with just a bare fuselage, so your first flights will…",
    "tags": [
      "Adventure",
      "Airplane",
      "Flight",
      "Fly"
    ],
    "mobile": false
  },
  {
    "id": "gm-girl-crush-escape",
    "name": "Girl Crush Escape",
    "url": "https://html5.gamemonetize.co/48fw192udyyypjrn16ur4xlcpqn9wck8/",
    "description": "Match colorful tiles, clear falling stones, and rescue the girl before time runs out! Girl Crush Escape combines match-3 puzzles with exciting rescue challenges. Explore tricky rooms, plan your moves, and use boosters…",
    "tags": [
      "Puzzle",
      "Match 3",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-scary-toilet-monster-game",
    "name": "Scary Toilet Monster Game",
    "url": "https://html5.gamemonetize.co/jur639x9i8unrq1z1w73psarcgx3977a/",
    "description": "Get ready for a spooky and exciting adventure in Scary Toilet Monster Game, where creepy monsters, scary environments, and thrilling challenges await you! Enter a mysterious world filled with unexpected surprises, test…",
    "tags": [
      "Puzzle",
      "2026 games",
      "Amazing",
      "Best Games",
      "Casual"
    ],
    "mobile": false
  },
  {
    "id": "gm-hive-rush-bee-swarm",
    "name": "Hive Rush: Bee Swarm",
    "url": "https://html5.gamemonetize.co/eh46ubl79iu8qhw1w7dciy1vlnmgfhj8/",
    "description": "Lead a queen bee swarm in a 3D meadow: gather pollen, make honey, buy bees, found 6 colonies and sting away wasps and a hungry bear!",
    "tags": [
      "Arcade",
      "1 Player",
      "2026 games",
      "3D",
      "Cute"
    ],
    "mobile": false
  },
  {
    "id": "gm-cute-cat-sort-puzzle",
    "name": "Cute Cat Sort Puzzle",
    "url": "https://html5.gamemonetize.co/s76wgadl862es0443p096gumiscxg9nk/",
    "description": "Get ready for a purr-fect puzzle adventure in Cute Cat Sort Puzzle! Sort adorable cats, organize colorful kitties, and solve fun brain-teasing challenges. Test your logic, plan your moves, and enjoy a relaxing puzzle…",
    "tags": [
      "Puzzle",
      ".io",
      "1 Player",
      "Arcade"
    ],
    "mobile": false
  },
  {
    "id": "gm-taxi-car-parking-driving-test-3d",
    "name": "Taxi Car Parking Driving Test 3D",
    "url": "https://html5.gamemonetize.co/f3qjfejxm7vye9s5zrflvzbu896c7n38/",
    "description": "Get ready to become a professional taxi driver! Test your driving and parking skills in this exciting Taxi Car Parking Driving Test game. Drive your taxi through challenging tracks, follow road paths, avoid obstacles…",
    "tags": [
      "Boys",
      "3D",
      "3D Games",
      "Carparking",
      "Taxi",
      "Unity games"
    ],
    "mobile": false
  },
  {
    "id": "gm-little-monster-shop",
    "name": "Little Monster Shop",
    "url": "https://html5.gamemonetize.co/vkpl35mrq8b0wcgmsq4as35rjwkzzqkw/",
    "description": "Run a tiny market for cute monsters! Harvest glowing mushrooms, stock the shelves and serve a line of hungry customers at the till. Spend your coins to unlock new fields, shelves and staff, then open wilder markets…",
    "tags": [
      "Hypercasual",
      "Casual",
      "1 Player",
      "Business",
      "Cute",
      "Food",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-aviator-monkey",
    "name": "Aviator Monkey",
    "url": "https://html5.gamemonetize.co/r2w27xyjiqpe3tqrch0ecj2i9i4n5258/",
    "description": "Fly through a bright arcade sky as Aviator Monkey. Steer around hazards, collect bananas, survive longer and chase a high score across increasingly challenging runs.",
    "tags": [
      "Action",
      "Monkey"
    ],
    "mobile": false
  },
  {
    "id": "gm-bus-stop-hero",
    "name": "Bus Stop Hero",
    "url": "https://html5.gamemonetize.co/xkoorft94gqysyk9indyhj7wg4s6f31o/",
    "description": "Take the wheel in Bus Bay Rush 3D, a city bus driving game. Pick up passengers waiting at the bus stops, pull into the BUS STOP bay and watch them climb aboard and take their seats. Then drive them across the city…",
    "tags": [
      "3D",
      "3D Games",
      "Adventure",
      "Bus",
      "City"
    ],
    "mobile": false
  },
  {
    "id": "gm-arrow-survival-15-seconds-demo",
    "name": "Arrow Survival: 15 Seconds DEMO",
    "url": "https://html5.gamemonetize.co/khdyfe7na1ptmmc0j60wwxpd6voyltay/",
    "description": "Dive into this demo of Arrow Survival: 15 Seconds, a thrilling 2D pixel art platformer where every second counts! As a skilled archer, your mission is to survive 15 seconds per level by dodging deadly hazards and…",
    "tags": [
      "Hypercasual",
      "Casual",
      "1 Player",
      "2D",
      "Arrow",
      "Arrows"
    ],
    "mobile": false
  },
  {
    "id": "gm-avatar-maker-for-girl",
    "name": "Avatar Maker For Girl",
    "url": "https://html5.gamemonetize.co/a28aakfvqihdh6gts4zegs8csdw2l7jz/",
    "description": "Avatar Maker For Girl is a cute cartoon avatar maker and DIY dress-up game where you can create unique characters, design cozy rooms, and build fun story scenes. With its simple controls and creative features, free…",
    "tags": [
      "Hypercasual",
      "Casual",
      "Cartoon",
      "Cute",
      "Decoration",
      "Dress Up"
    ],
    "mobile": false
  },
  {
    "id": "gm-4x4-fury-offroad-jeep",
    "name": "4x4 Fury:offroad Jeep",
    "url": "https://html5.gamemonetize.co/29azz5qrrbij8xr27y5s88gfyidnihlz/",
    "description": "# WildTorque 4x4 – Offroad Jeep Simulator Get ready for the ultimate offroad driving adventure! Explore challenging mountain roads, muddy tracks, rocky hills, deserts, and wild environments in powerful 4x4 offroad…",
    "tags": [
      "3D",
      "3D Games",
      "Jeep",
      "Offroad"
    ],
    "mobile": false
  },
  {
    "id": "gm-snake-warz-eat-survive",
    "name": "Snake Warz: Eat & Survive",
    "url": "https://html5.gamemonetize.co/9c5feh5wl7lgffmr8xsyip5rs2vajrhw/",
    "description": "Enter the thrilling world of Snake Warz: Eat & Survive, where every move matters and only the smartest snake can rule the arena! Slither through a colorful battlefield, gobble up delicious food, and grow your snake into…",
    "tags": [
      "Puzzle",
      "1 Player",
      "2D",
      "Snake"
    ],
    "mobile": false
  },
  {
    "id": "gm-body-evolution-game",
    "name": "Body Evolution Game",
    "url": "https://html5.gamemonetize.co/jcyh2ccbjg0vtc8z6vu1zc41f5v5ijhs/",
    "description": "Food Run Adventure is a fun and addictive endless runner where every step brings a new challenge! Dash through exciting paths, collect delicious foods, avoid tricky obstacles, and reach the finish line while growing…",
    "tags": [
      "Girls",
      "2026 games",
      "Adult",
      "Adventure",
      "Best",
      "Girl"
    ],
    "mobile": false
  },
  {
    "id": "gm-dream-kids-monster-blaster",
    "name": "Dream Kids: Monster Blaster",
    "url": "https://html5.gamemonetize.co/n9v462va8xdckkl5hygj4f0l9sogyuco/",
    "description": "Enter a colorful world of dreams in Dream Kids: Monster Blaster! Help a brave young hero battle playful monsters, capture weakened ghosts and defeat powerful bosses across 10 dream-themed levels. Aim your blaster, fire…",
    "tags": [
      "Shooting",
      "1 Player",
      "3D",
      "Action",
      "Adventure",
      "Arcade"
    ],
    "mobile": false
  },
  {
    "id": "gm-hidden-shop-hunt",
    "name": "Hidden Shop Hunt",
    "url": "https://html5.gamemonetize.co/8wa0oabjeatifvdlkjs30et5e8cb4qcr/",
    "description": "Hidden Shop Hunt is an exciting hidden object puzzle game where you explore colorful shops and search for mystery items. Find the objects shown in the tiles around the shop scene. In some levels, click the question mark…",
    "tags": [
      "Puzzle",
      "Brain",
      "Hidden",
      "Kids",
      "Shopping",
      "Skill"
    ],
    "mobile": false
  },
  {
    "id": "gm-pusher-monsters",
    "name": "Pusher Monsters",
    "url": "https://html5.gamemonetize.co/ja9y1m6pm9sc331cwx0hhsgkdy0cv3f6/",
    "description": "Every coin that falls off the edge hits the monster! Pusher Monsters turns the classic arcade coin pusher into a roguelike adventure. Drop coins onto the machine, line up combos and push whole piles over the edge to…",
    "tags": [
      "Clicker",
      "Idle",
      "3D",
      "Arcade",
      "Cartoon",
      "Casual",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-million-coin-vault",
    "name": "Million Coin Vault",
    "url": "https://html5.gamemonetize.co/15dlchr2fii2zuffq5h10vm8k5f5xjk2/",
    "description": "Sneak into the bank and take EVERYTHING. Million Coin Vault is a cozy first-person coin-scooping game where every coin in the pile is a real coin, and the pile visibly shrinks as you take it. Start with your bare hands…",
    "tags": [
      "Clicker",
      "Idle",
      "3D",
      "3D Games",
      "Casual",
      "Dragon"
    ],
    "mobile": false
  },
  {
    "id": "gm-crazy-geometry-dash",
    "name": "Crazy Geometry dash",
    "url": "https://html5.gamemonetize.co/4l5r2499eb04liso1rubi9z2nk5rfm09/",
    "description": "Dash, jump and fly through 105 neon levels, each with its own soundtrack! Geometry GT: Neon Overdrive is a fast rhythm platformer inspired by Geometry Dash. Race through 10 neon worlds, from synthwave sunsets and ocean…",
    "tags": [
      "Hypercasual",
      "Casual",
      "Dash",
      "Geometry",
      "Music"
    ],
    "mobile": false
  },
  {
    "id": "gm-clever-match",
    "name": "Clever Match",
    "url": "https://html5.gamemonetize.co/anw37vva8kkyaqexx20qhntqrxz9d6av/",
    "description": "Clever Match – Match, Think & Have Fun! Challenge your brain with Clever Match, a fun and addictive puzzle game where you connect tiles that belong to the same category! What do an elephant, whale, dinosaur, and hippo…",
    "tags": [
      "Puzzle",
      "Brain",
      "Matching",
      "Sorting"
    ],
    "mobile": false
  },
  {
    "id": "gm-card-sort-solitaire",
    "name": "Card Sort Solitaire",
    "url": "https://html5.gamemonetize.co/50qononrllomjgufe32l1hl5qsjzksph/",
    "description": "Play Card Sort Solitaire and match picture and word cards to their correct categories in a relaxing yet challenging solitaire puzzle adventure. Uncover hidden cards, organize piles, complete category sets, and enjoy…",
    "tags": [
      "Puzzle",
      "Brain",
      "Educational",
      "School",
      "Skill",
      "Sort",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-overstuffed",
    "name": "Overstuffed",
    "url": "https://html5.gamemonetize.co/2w11kf84qo7wcasknp4rgrboa7j7g1n3/",
    "description": "Push your spatial skills to the limit in Overstuffed! Drop, pack, and cram an endless rush of spheres into tight glass containers. Every level challenges your physics strategy as you squeeze maximum volume into minimum…",
    "tags": [
      "Arcade",
      "Adventure",
      "Brain",
      "Puzzle",
      "Strategy"
    ],
    "mobile": false
  },
  {
    "id": "gm-king-of-boxer",
    "name": "King Of Boxer",
    "url": "https://html5.gamemonetize.co/bhqhuecc4aeqlti2mv8vqxp4oi36r0b9/",
    "description": "Step into KING OF BOXER, a colourful pixel-art boxing showdown. Read your opponent's moves, dodge heavy punches and unleash your charged Super. Defeat 12 rivals across three circuits, collect three championship belts…",
    "tags": [
      "Sports",
      "2D",
      "Boxing",
      "Fight",
      "Mapi games",
      "Punch",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-chromatic-coil",
    "name": "Chromatic Coil",
    "url": "https://html5.gamemonetize.co/musuu83na57vuzyedsorz14t4f174z9n/",
    "description": "Guide a color-changing snake through challenging levels. Move left and right to collect colors, match the obstacles, and reach the finish line. Choose a level and see how far you can go! Web Dev https://www.ovigames.com/",
    "tags": [
      "Arcade",
      "1 Player",
      "2026 games",
      "Snake",
      "Unity games"
    ],
    "mobile": false
  },
  {
    "id": "gm-cover-shooting-gun-game",
    "name": "Cover Shooting Gun Game",
    "url": "https://html5.gamemonetize.co/jqs19adxo4kbzos81gt23e7umwlqkue3/",
    "description": "Step into an intense battlefield and experience thrilling shooting action in Cover Shooting Gun Game! Take control of a skilled soldier, use powerful weapons, and fight against dangerous enemies in action-packed combat…",
    "tags": [
      "Shooting",
      "Action",
      "Best",
      "Crazy",
      "Gun",
      "Shooter"
    ],
    "mobile": false
  },
  {
    "id": "gm-blockfront",
    "name": "Blockfront",
    "url": "https://html5.gamemonetize.co/4sc0bzzn2p5r2p10bdhccr9topz7dw5b/",
    "description": "Build your kingdom. Cut their trails. Rule the frontier! Jump into BlockFront, a colorful 3D territory battle where every loop can grow your empire—or end your run. Guide your crowned blocky hero across the arena, draw…",
    "tags": [
      "Adventure",
      "Action",
      "Battle",
      "Battlegrounds",
      "Blocky",
      "Brain"
    ],
    "mobile": false
  },
  {
    "id": "gm-slime-jump-crown-quest",
    "name": "Slime Jump: Crown Quest",
    "url": "https://html5.gamemonetize.co/qv3a9n2x1eb4ln212n0kyb6xd6xx0unu/",
    "description": "Jump toward the crown in Slime Jump: Crown Quest! Guide a cheerful slime through 150 colorful platform levels. Hold, aim, and release to launch your slime, land on platforms, and plan your next bounce. Short stages and…",
    "tags": [
      "Arcade",
      "1 Player",
      "2D",
      "Bounce",
      "Casual",
      "Cute",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-tideroll-block-puzzle",
    "name": "TideRoll: Block Puzzle",
    "url": "https://html5.gamemonetize.co/o8low93sur66jwptcrebd98rfwjq6vhh/",
    "description": "Roll a wooden block across floating ocean platforms and guide it upright into the goal hole. Solve 150 levels with sunny, rainy and snowy scenery, switches, bridges and fragile orange tiles. Plan each move, undo…",
    "tags": [
      "Puzzle",
      "Block",
      "Brain",
      "Logic",
      "Mobile",
      "WebGL"
    ],
    "mobile": true
  },
  {
    "id": "gm-brainrot-escape-diamond-quest",
    "name": "Brainrot Escape: Diamond Quest",
    "url": "https://html5.gamemonetize.co/5kvbn441j1a8r3v03e4ds8rdamnr0304/",
    "description": "Brainrot Escape: Diamond Quest is a cartoon horror maze escape game that mixes Italian brainrot characters! The escape survival game brings a fun twist to the brainrot escape room experience. Fans of Tung Tung Tung…",
    "tags": [
      "Action",
      "Avoid",
      "Casual",
      "Collecting",
      "Horror"
    ],
    "mobile": false
  },
  {
    "id": "gm-cold-iron-last-extraction",
    "name": "Cold Iron: Last Extraction",
    "url": "https://html5.gamemonetize.co/k844ttydwj9x4oswhk1bfzit2t75thu7/",
    "description": "Cold Iron is a third-person tactical shooter on a rain-soaked city street at night. Pick two guns and a special ability, then hold the plaza against waves of armed and armoured soldiers until the extraction helicopter…",
    "tags": [
      "Shooting",
      "1 Player",
      "3D",
      "Action",
      "Bomb",
      "City",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-robot-strike-fps-shooter",
    "name": "Robot Strike: FPS Shooter",
    "url": "https://html5.gamemonetize.co/hhyuzg9eh119tudrikusoeiej61cn29s/",
    "description": "Enter the battlefield in Robot Strike: FPS Shooter, an action-packed 3D first-person shooting game! Get ready for intense robot battles, aim your weapons, and fight against dangerous enemy robots. Test your shooting…",
    "tags": [
      "Shooting",
      "3D",
      "Action",
      "First Person Shooter",
      "Gun",
      "Robot"
    ],
    "mobile": false
  },
  {
    "id": "gm-birds-jump-2",
    "name": "Birds Jump 2",
    "url": "https://html5.gamemonetize.co/aeg86hu60xb1rkhs4gmuk9agfidfgy5s/",
    "description": "Get ready to fly high in BIRDS JUMP! ? Jump from platform to platform, dodge dangerous obstacles, and climb higher through colorful worlds. Unlock unique birds, each with different abilities, and discover powerful…",
    "tags": [
      "Hypercasual",
      "Casual",
      "Bird",
      "Jump",
      "Jumping",
      "Relaxation"
    ],
    "mobile": false
  },
  {
    "id": "gm-tidal-kart",
    "name": "Tidal Kart",
    "url": "https://html5.gamemonetize.co/osm7ce5njwn43zxsfdfx0y4eluu9cke9/",
    "description": "Six buggies, twelve tracks and a suspicious number of flying coconuts. Race Kai, Nalu, Coral, Rio, Sunny and Reef from Coral Coast and Lava Lagoon to Neon Nights, Frost Peak, Desi Dhamaal and Sakura Sprint. Hold drift…",
    "tags": [
      "Racing",
      "3D",
      "Buggy",
      "Cars",
      "Cartoon",
      "Drift"
    ],
    "mobile": false
  },
  {
    "id": "gm-drone-zero",
    "name": "DRONE ZERO",
    "url": "https://html5.gamemonetize.co/eh96xwwzpg7640fjytvfybwpofknisx6/",
    "description": "Pilot DZ-01 and reclaim a city under alien siege! DRONE ZERO is a 3D arcade shooter packed with glowing gunfire, explosive battles, rain and lightning. Fight through eight missions, destroy enemy patrols, disable…",
    "tags": [
      "Arcade",
      "Flight",
      "Gta",
      "Mapi games"
    ],
    "mobile": false
  },
  {
    "id": "gm-crust-courier-pizza-bike-rush",
    "name": "Crust Courier: Pizza Bike Rush",
    "url": "https://html5.gamemonetize.co/2fxjbiapt9fveb2ccj5yg6st50h16fhu/",
    "description": "Hop on your delivery bike and race the clock in Crust Courier: Pizza Bike Rush! Pick up hot orders, follow the route on your mini-map and get every pizza to the customers door before time runs out. Dodge busy traffic…",
    "tags": [
      "3D",
      "3D Games",
      "Bike",
      "Games for your website",
      "Pizza"
    ],
    "mobile": false
  },
  {
    "id": "gm-sky-racer-simulator",
    "name": "Sky Racer Simulator",
    "url": "https://html5.gamemonetize.co/malvwg2b3gio6vbmwytlfjyql1nckqjj/",
    "description": "Race across floating sky tracks! Swipe to steer, dodge rivals, boost through tunnels and loops, and finish first across 15 thrilling levels.",
    "tags": [
      "Racing",
      "Driving",
      "Fly",
      "Plane",
      "Simulation",
      "Simulator"
    ],
    "mobile": false
  },
  {
    "id": "gm-parcel-pulse-toy-factory",
    "name": "Parcel Pulse Toy Factory",
    "url": "https://html5.gamemonetize.co/yfdj546g73behamptyfy3s92xvqpg3ne/",
    "description": "Parcel Pulse is a colorful conveyor-belt puzzle set in a busy toy factory. Boxes roll along branching belts, and you control the switches that decide where each one goes. Flip the arrows at the right moment and every…",
    "tags": [
      "Puzzle",
      "Arcade",
      "Brain",
      "Casual",
      "Coloring",
      "Logic",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-frontline-strike",
    "name": "Frontline Strike",
    "url": "https://html5.gamemonetize.co/iid6srdhmq9jgjk1ngst4n25gyfb5do3/",
    "description": "Frontline Strike is a 3D first-person military shooter. Hold your ground against wave after wave of enemy squads: riflemen who reposition, crouch to fire and lob grenades when you hide, heavy troopers who soak up damage…",
    "tags": [
      "Shooting",
      "3D",
      "Action",
      "Army",
      "First Person Shooter",
      "Fps"
    ],
    "mobile": false
  },
  {
    "id": "gm-batman-chase",
    "name": "Batman Chase",
    "url": "https://html5.gamemonetize.co/qs83vlom6ynajpa1te5xppdgwa89puxc/",
    "description": "Take control of the legendary Batmobile and speed through the streets of Gotham in Batman Chase! Dodge obstacles, eliminate enemy vehicles, collect coins, and unlock powerful upgrades to survive the high-speed pursuit.",
    "tags": [
      "Racing",
      "Action",
      "Adventure",
      "Batman",
      "City",
      "Defense"
    ],
    "mobile": false
  },
  {
    "id": "gm-anti-spider-run",
    "name": "Anti Spider Run",
    "url": "https://html5.gamemonetize.co/p969z2qusrk1utlzcbr3t4htnxdjfmew/",
    "description": "Anti Spider Run is an exciting spider survival action runner game that mixes fast running, character evolution, spider battles, and territory capture! This fun run game is all about quick reactions and smart movement…",
    "tags": [
      "Hypercasual",
      "Casual",
      "Fun",
      "Running",
      "Strategy",
      "Tractor"
    ],
    "mobile": false
  },
  {
    "id": "gm-lane-shooter",
    "name": "Lane Shooter",
    "url": "https://html5.gamemonetize.co/fo9hrh4c7buzk4j5eid2nqua5b9y9pzw/",
    "description": "Pilot your ship through eight dangerous lanes and fight off waves of hostile creatures. Move freely, aim in either direction, and fire automatically. Each wave gets faster and more challenging. Choose Normal, Expert, or…",
    "tags": [
      "Shooting",
      "1 Player",
      "2026 games",
      "2D",
      "Action",
      "Alien"
    ],
    "mobile": false
  },
  {
    "id": "gm-fps-block-strike-dust2",
    "name": "FPS Block Strike Dust2",
    "url": "https://html5.gamemonetize.co/09injp4gn3ewindof0o3jf5jrx6apcij/",
    "description": "Experience a classic team-based FPS battle in a block-style world with FPS Block Strike Dust2! Choose your team and fight in intense battles between Terrorists and Counter-Terrorists. Equip your weapon, move quickly…",
    "tags": [
      "Multiplayer",
      ".io",
      "1 Player",
      "2026 games",
      "3D",
      "3D Games"
    ],
    "mobile": false
  },
  {
    "id": "gm-rim-rebels-3v3",
    "name": "Rim Rebels 3v3",
    "url": "https://html5.gamemonetize.co/ezj7t4c7bsypp7g0gkrjcmmz6wfyoue0/",
    "description": "Grab two teammates and take the blacktop. Rim Rebels 3v3 is full-court street basketball with two hoops, a running clock and four short quarters. Hang in the air before you release a jumper, fake a pass to open the…",
    "tags": [
      "Sports",
      "3D",
      "Basketball",
      "Multiplayer",
      "Online",
      "Unity3D"
    ],
    "mobile": false
  },
  {
    "id": "gm-blocktrail-2048",
    "name": "Blocktrail 2048",
    "url": "https://html5.gamemonetize.co/rnl5036gss1kmira1m8fow1twkorw3eb/",
    "description": "Run into a colourful blocky arena where every cube counts! Collect blocks, grow your number trail and chase down weaker rivals to steal their points. Keep your distance from stronger opponents—one wrong turn could end…",
    "tags": [
      "Arcade",
      "2048",
      "Avoid",
      "Collecting",
      "Hypercasual",
      "Kids",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-ocean-dash",
    "name": "Ocean Dash",
    "url": "https://html5.gamemonetize.co/arvyl12trgul0tfrumhsdt9u1gdoo98k/",
    "description": "Ocean Dash is an exciting underwater adventure where you dive into the deep sea to catch rare fish and earn valuable rewards. Explore colorful ocean environments, collect as many fish as possible, use helpful power-ups…",
    "tags": [
      "Hypercasual",
      "Casual",
      "Animal",
      "Classic",
      "Collection",
      "Fun"
    ],
    "mobile": false
  },
  {
    "id": "gm-fruit-box-sort",
    "name": "Fruit Box Sort",
    "url": "https://html5.gamemonetize.co/au6crdudkwzdpwt0w1jbis0po9k6v9b8/",
    "description": "Sort colorful fruit boxes in a relaxing puzzle game. Tap open boxes to send fruit onto the conveyor belt and fill matching containers. Plan your moves, keep space on the belt, and discover 210 levels with mystery boxes…",
    "tags": [
      "Puzzle",
      "1 Player",
      "2D",
      "Casual",
      "Fruit",
      "Logic",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-goods-sort-match-puzzle",
    "name": "Goods Sort Match Puzzle",
    "url": "https://html5.gamemonetize.co/fzoo4gkhywbbwonj32tu14f50gjpt2un/",
    "description": "Goods Sort Match Puzzle is a colorful shelf-sorting game. Drag drinks, snacks, toys, and other goods between shelves, then line up three identical items to clear them. Each match opens space and reveals more products…",
    "tags": [
      "Puzzle",
      "1 Player",
      "Brain",
      "Match 3",
      "Sorting"
    ],
    "mobile": false
  },
  {
    "id": "gm-castle-crashers-stolen-sun",
    "name": "Castle Crashers: Stolen Sun",
    "url": "https://html5.gamemonetize.co/j67nn0xyjyyxlvu0qsy2q2evtfzave25/",
    "description": "Castle Crashers: Stolen Sun is a colorful 2D fantasy brawler across a kingdom robbed of daylight. Choose an elemental knight and follow 36 story stages with optional routes, lively enemies and boss encounters. Strike…",
    "tags": [
      "Arcade",
      "1 Player",
      "2D",
      "Action",
      "Adventure",
      "Fighting",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-kingmoon",
    "name": "Kingmoon",
    "url": "https://html5.gamemonetize.co/8ivrit0sy8f6enghyz1h1ke1u9tul1f1/",
    "description": "Kingmoon is a 3D space action game. King Regulus rules the stars from his moon, and his robot and alien kingdoms hold every planet. You start with one small ship and one flag. Fly low over five worlds, each with its own…",
    "tags": [
      "Shooting",
      "3D Games",
      "Alien",
      "Flight",
      "Planet",
      "Robot"
    ],
    "mobile": false
  },
  {
    "id": "gm-nebula-marshal",
    "name": "Nebula Marshal",
    "url": "https://html5.gamemonetize.co/xtev9qbzo3nt63l5vaa493ff97st4f4g/",
    "description": "Nebula Marshal is a 3D space-western survival shooter. Pick one of 6 heroes, land on a hostile planet and hold out against endless monster waves. Your guns fire automatically: move, dodge and grab crystals to level up…",
    "tags": [
      "Shooting",
      "3D",
      "3D Games",
      "Shooter",
      "Space",
      "Survival"
    ],
    "mobile": false
  },
  {
    "id": "gm-formula-apex-rush",
    "name": "Formula Apex Rush",
    "url": "https://html5.gamemonetize.co/89cwmdcu0v18okqbmvj4wj2veldfldbr/",
    "description": "Race Formula cars across 8 regions and 40 events. Beat THE BARON, survive rain, debris and surprises, upgrade your car and become Apex Champion!",
    "tags": [
      "Racing",
      "Car",
      "Car tuning",
      "Drifting",
      "Driving",
      "Platform"
    ],
    "mobile": false
  },
  {
    "id": "gm-carletto-halloween-dreams",
    "name": "Carletto Halloween Dreams",
    "url": "https://html5.gamemonetize.co/k527vlavp39s5fiqshntacxi9zl7ette/",
    "description": "Carletto enters a Halloween dream of floating islands, haunted forests and glowing castles. Use his telescope to reveal mist-hidden paths and guide starlight through mirrors. Dodge chasing pumpkin creatures, collect 90…",
    "tags": [
      "Puzzle",
      "Adventure",
      "Brain",
      "Halloween",
      "Mapi games",
      "Platform"
    ],
    "mobile": false
  },
  {
    "id": "gm-crazy-cart",
    "name": "Crazy Cart",
    "url": "https://html5.gamemonetize.co/86mboqa4elofmu8yp5zb2joi7z7w360p/",
    "description": "Get ready for a fun and exciting cart adventure in Crazy Cart! Help your little blue character push and balance a cart filled with colorful shapes. Carefully collect, stack, and transport different objects while keeping…",
    "tags": [
      "Puzzle",
      "2026 games",
      "Adventure",
      "Amazing",
      "Best Games",
      "Casual",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-storky-survivors",
    "name": "Storky Survivors",
    "url": "https://html5.gamemonetize.co/jdggpyd1fydnoj38wdzmj5mgcoib3mez/",
    "description": "Play as Rookie Storky and survive swarms of the Glitchlings across 10 stages plus an endless mode. Pick weapons and upgrades, collect gems, beat giant bosses and grow stronger run after run.",
    "tags": [
      "Shooting",
      "3D",
      "3D Games",
      "Action",
      "Arcade",
      "Bullet"
    ],
    "mobile": false
  },
  {
    "id": "gm-timber-truck-city-cargo-driver",
    "name": "Timber Truck: City Cargo Driver",
    "url": "https://html5.gamemonetize.co/v1av2um005eaey07qvqg75nj8802tn0t/",
    "description": "**Timber Truck: Forest Cargo Driver** is an exciting truck driving and wood transportation game! Get behind the wheel of a powerful cargo truck and transport heavy wooden logs from the forest to their destination. Drive…",
    "tags": [
      "3D",
      "Racing",
      "Transport",
      "Truck"
    ],
    "mobile": false
  },
  {
    "id": "gm-precision-parking-city-driver",
    "name": "Precision Parking: City Driver",
    "url": "https://html5.gamemonetize.co/1ji3wtl07z2i7zu4i031wokvuadrczg0/",
    "description": "**Precision Parking: City Driver** is an exciting 3D car parking game where you test your driving and parking skills! Drive through challenging parking levels, avoid obstacles, and park your car perfectly in the…",
    "tags": [
      "3D",
      "Carparking",
      "Simulation",
      "Unity games"
    ],
    "mobile": false
  },
  {
    "id": "gm-cage-ballers-football",
    "name": "Cage Ballers Football",
    "url": "https://html5.gamemonetize.co/q1wpzkogglzb4m0lkme3jw9cenxd62wn/",
    "description": "Step into the cage and take on the CPU in a fast, 3D small-sided football match. Choose a pitch, team kit, match length, camera and difficulty, then pass, sprint, tackle and shoot your way to victory. Play two halves…",
    "tags": [
      "Sports",
      "3D",
      "Multiplayer",
      "Soccer"
    ],
    "mobile": false
  },
  {
    "id": "gm-spookily-stylish-duo",
    "name": "Spookily Stylish Duo",
    "url": "https://html5.gamemonetize.co/a336yt8j3zffqnt6pmgkv53hkmilmqkj/",
    "description": "Two friends, Arelia and Tiara, are looking forward to autumn to meet her fully armed in style! Join the girls: try on fashionable autumn looks and choose accessories that will emphasize the character of each heroine…",
    "tags": [
      "Girls",
      "Decoration",
      "Dress Up",
      "Fashion",
      "Halloween"
    ],
    "mobile": false
  },
  {
    "id": "gm-car-parking-master-3d",
    "name": "Car Parking Master 3D",
    "url": "https://html5.gamemonetize.co/d4jpgfpyn7z30yabw1zx4vjsttli37oi/",
    "description": "Test your driving skills in Car Parking Master 3D! Drive realistic cars and park them in tricky spots across different levels. Follow the signs, avoid obstacles, and complete each challenge with precision. Can you…",
    "tags": [
      "Boys",
      "3D",
      "3D Games",
      "Car",
      "Carparking",
      "Cars"
    ],
    "mobile": false
  },
  {
    "id": "gm-modern-strike-shooting-game",
    "name": "Modern Strike Shooting Game",
    "url": "https://html5.gamemonetize.co/gb1p2hjo6ij6h733k1regku3jwuvk98s/",
    "description": "Get ready for intense combat action in Modern Strike Shooting, an exciting shooting game where precision, quick reactions, and tactical skills are the keys to success. Enter the battlefield, aim carefully, and…",
    "tags": [
      "Adventure",
      "Action",
      "Amazing",
      "Fun",
      "Gun",
      "Shooting"
    ],
    "mobile": false
  },
  {
    "id": "gm-oxy-arena",
    "name": "Oxy Arena",
    "url": "https://html5.gamemonetize.co/0ni36bamedyuw00gwsyx7gp64nd93y2s/",
    "description": "Oxy Arena is a fast online FPS in a blocky 3D world. Press Play to jump into a match with players from around the world, or create a private room and invite friends with a code. Modes: Deathmatch, Team Deathmatch (4 v…",
    "tags": [
      "Shooting",
      "3D",
      "Blocky",
      "Fps",
      "Multiplayer",
      "Online"
    ],
    "mobile": false
  },
  {
    "id": "gm-color-coin-merge",
    "name": "Color Coin Merge",
    "url": "https://html5.gamemonetize.co/6y5sqinffpm6cyzzn2av6sj1iamo9lmv/",
    "description": "Get hooked on this addictive coin-sorting game. Explore different ways to sort and discover repeating patterns. Use special power-ups to overcome obstacles and progress through increasingly tricky levels.",
    "tags": [
      "Puzzle",
      "Brain",
      "Color",
      "Coloring",
      "Logic",
      "Logical"
    ],
    "mobile": false
  },
  {
    "id": "gm-nitrovenant-2",
    "name": "Nitrovenant 2",
    "url": "https://html5.gamemonetize.co/ed75dp117q2ubh1knkucn3vmmqcxs42o/",
    "description": "Drive through endless hordes of zombie workers in an armored car with a rooftop missile launcher. Your car fires on its own: you pick the lane, jump the potholes and hit the nitro to plow through the crowd. 120 stages…",
    "tags": [
      "Racing",
      "3D",
      "Action",
      "Car",
      "Shooting",
      "Survival"
    ],
    "mobile": false
  },
  {
    "id": "gm-vlinder-garden-dress-princess",
    "name": "Vlinder Garden Dress Princess",
    "url": "https://html5.gamemonetize.co/amwb5pr7cpylj9me9yff04jz04919307/",
    "description": "Vlinder Garden Dress Princess is a creative girls casual game combining fashion styling, handmade crafts, room design, and multiplayer creation challenges. As a dress-up game for girls, it allows you to customize…",
    "tags": [
      "Hypercasual",
      "Casual",
      "Cute",
      "Dress Up",
      "Fun",
      "Relaxation"
    ],
    "mobile": false
  },
  {
    "id": "gm-panda-run-1",
    "name": "Panda Run 1",
    "url": "https://html5.gamemonetize.co/r771adpx4j9ki0krbv21ghs7rte1s3m0/",
    "description": "Panda Run is an exciting running game where you jump, slide, dodge obstacles, and collect coins. Explore four unique biomes—Green Forest, Snow Mountain, Desert Ruins, and Lava Volcano—across 200 levels. Complete…",
    "tags": [
      "Adventure",
      "1 Player",
      "Running"
    ],
    "mobile": false
  },
  {
    "id": "gm-turbo-boat-runner-3d",
    "name": "Turbo Boat Runner 3D",
    "url": "https://html5.gamemonetize.co/65hvflaol93wykizugyk64b3cu3ixda5/",
    "description": "Get ready for an exciting high-speed water adventure in Turbo Boat Runner 3D! Take control of a powerful speedboat and race across beautiful blue waters at incredible speeds. Navigate through challenging paths, avoid…",
    "tags": [
      "Adventure",
      "2026 games",
      "Action",
      "Amazing",
      "Best Games",
      "Boat"
    ],
    "mobile": false
  },
  {
    "id": "gm-stickman-skybow",
    "name": "Stickman Skybow",
    "url": "https://html5.gamemonetize.co/tsrm1mntua4si64m2i6nx9vzh24t8l7j/",
    "description": "Stickman Skybow is a fast-paced 2D archery game with two modes: Duel and Defense. Draw, aim and release to defeat distinctive bosses across changing floors, or hold back waves of enemies. Unlock bows, special arrows…",
    "tags": [
      "Stickman",
      "2D",
      "Action",
      "Arrow",
      "Bow",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-swat-ops-body-camera",
    "name": "SWAT OPS: Body camera",
    "url": "https://html5.gamemonetize.co/bx312w4jjwnk8huztiw6ufyr71etcwhc/",
    "description": "Aim. Shoot. Dominate! Fast first-person shooter with satisfying gunplay. Play solo against bots or team up with friends. MODES Deathmatch, Team Deathmatch, Gun Game, Zombies, Bomb, Co-op LEVELS Old-town streets, open…",
    "tags": [
      "Shooting",
      "Gun",
      "Multiplayer",
      "Realistic",
      "Shooter",
      "Weapons"
    ],
    "mobile": false
  },
  {
    "id": "gm-needle-rush",
    "name": "Needle Rush",
    "url": "https://html5.gamemonetize.co/h5775frghqj0eznzryr6zzhh7khems8p/",
    "description": "Somebody lost their needles in a haystack. A really, really big haystack. Grab a beeping metal detector and dig! The closer you get, the faster it beeps. Sell the hay, buy better tools and research Fork Arms, conveyor…",
    "tags": [
      "Hypercasual",
      "Casual",
      "3D",
      "3D Games",
      "Build",
      "Business"
    ],
    "mobile": false
  },
  {
    "id": "gm-mecha-screw-3d",
    "name": "Mecha Screw 3D",
    "url": "https://html5.gamemonetize.co/2vhs87pxxkgmixbw0p997t23zlp9szhb/",
    "description": "Take apart colorful machines in Mecha Screw 3D! Remove exposed screws, fill matching color boxes, and plan ahead to keep your spare slots clear. Watch metal plates swing and fall as you uncover new moves. Solve 15…",
    "tags": [
      "Puzzle",
      "Block",
      "Brain",
      "Casual",
      "Mapi games",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-furious-gt-drift",
    "name": "Furious GT Drift",
    "url": "https://html5.gamemonetize.co/9auu04wyzqpy1x11jkyd0essumex4ay6/",
    "description": "Drift the floating arenas, smash snow, beat 7 mission types and a rival car in 51 arenas. Upgrade 8 cars, unlock skills and never touch the curb!",
    "tags": [
      "Racing",
      "Car",
      "Drift",
      "Driving"
    ],
    "mobile": false
  },
  {
    "id": "gm-nutty-rush-kart",
    "name": "Nutty Rush Kart",
    "url": "https://html5.gamemonetize.co/jo8widlpg0usj47eix91m74q1jzvon00/",
    "description": "Nutty Rush Kart is a colourful arcade kart racer starring the critters of Nutty Rush. Pick one of 12 racers, build your kart from bodies, wheels, side panels, nut launchers and glide wings, and race 40 tracks across 8…",
    "tags": [
      "Racing",
      "3D",
      "Animal",
      "Car",
      "Cartoon",
      "Drift"
    ],
    "mobile": false
  },
  {
    "id": "gm-snake-vs-ai",
    "name": "Snake VS AI",
    "url": "https://html5.gamemonetize.co/y6pbx3vejjjy13cgixiit05r16srp9oc/",
    "description": "Snake vs AI is a paper.io-style territory battle with a snake twist. Slither out of your land on a bright 3D island, draw a loop with your trail and close it back home to claim everything inside. AI snakes, each with…",
    "tags": [
      "Arcade",
      ".io",
      ".io Games",
      "1 Player",
      "Snake"
    ],
    "mobile": false
  },
  {
    "id": "gm-bus-master-road-journey",
    "name": "Bus Master: Road Journey",
    "url": "https://html5.gamemonetize.co/z20busep5b6p4xiv4xinb7gbc1v4ud94/",
    "description": "Get behind the wheel of a powerful bus and explore busy city streets, highways, and challenging roads! Pick up passengers, navigate traffic, and reach your destinations safely in Busora: Highway Driver 3D. Test your…",
    "tags": [
      "Adventure",
      "3D Games",
      "Bus",
      "Racing"
    ],
    "mobile": false
  },
  {
    "id": "gm-mud-trails-4x4-jeep-game",
    "name": "Mud Trails 4x4 Jeep Game",
    "url": "https://html5.gamemonetize.co/lguq1mws32nck58sykl6czjwod5jzfab/",
    "description": "Get ready for an exciting offroad adventure in Mud Trails 4x4 Jeep! Drive powerful 4x4 jeeps across muddy tracks, rough terrain, and challenging offroad routes. Test your driving skills, maintain control on difficult…",
    "tags": [
      "Racing",
      "2026 games",
      "Adventure",
      "Best Games",
      "Games",
      "Jeep"
    ],
    "mobile": false
  },
  {
    "id": "gm-car-carrier-truck-highway-master",
    "name": "Car Carrier Truck: Highway Master",
    "url": "https://html5.gamemonetize.co/2l0w3ejnb48kz920hudaps85qd94frj2/",
    "description": "# AutoHaul Truck Simulator 3D Get ready to experience the exciting world of heavy truck driving with **AutoHaul Truck Simulator 3D**, an engaging car transport truck driving game where precision, patience, and driving…",
    "tags": [
      "Adventure",
      "3D Games",
      "Race",
      "Unity games"
    ],
    "mobile": false
  },
  {
    "id": "gm-vector-strike",
    "name": "Vector Strike",
    "url": "https://html5.gamemonetize.co/khkxzovnx4bvebx8xrzt9os4djansml8/",
    "description": "Pilot your fighter through 10 neon wireframe sectors and take on 10 giant bosses. Dodge enemy fire, collect upgrades and build your arsenal with rear shots, missiles, shields and split fire. Break each boss's weak…",
    "tags": [
      "Shooting",
      "Mapi games",
      "Retro",
      "Shoot 'Em Up",
      "Shooter",
      "Space"
    ],
    "mobile": false
  },
  {
    "id": "gm-katana-zero-borrowed-seconds",
    "name": "Katana Zero: Borrowed Seconds",
    "url": "https://html5.gamemonetize.co/4na3wkjp28d6j5iugnlwxdwycv6dzk3g/",
    "description": "Katana Zero: Borrowed Seconds follows Rei through a neon city where stolen technology can bend time at the cost of memory. Explore authored rooms, slash enemies, reflect bullets, dash through danger and slow the action…",
    "tags": [
      "Arcade",
      "1 Player",
      "2D",
      "Action",
      "Fighting",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-castle-story-match3",
    "name": "Castle Story Match3!",
    "url": "https://html5.gamemonetize.co/6m1op0yj9cvxo48fhky2la5jhfjgvah0/",
    "description": "Dream Castle is an exciting match-3 puzzle game where you help a young princess bring her ruined castle back to its former glory. Game features: More than 100 exciting levels with gradually increasing difficulty. A…",
    "tags": [
      "Puzzle",
      "Adventure",
      "Disney",
      "Girl",
      "Magic",
      "Match 3"
    ],
    "mobile": false
  },
  {
    "id": "gm-bus-jam-sort-escape",
    "name": "Bus Jam Sort Escape",
    "url": "https://html5.gamemonetize.co/1xkx2sekpq9i99f7ek5tsj57tb0g0hs3/",
    "description": "Clear the traffic in Bus Jam - Sort Escape, a colorful single-player puzzle with 1,000 levels. Tap available buses to pick up passengers of the same color, manage limited road spaces, and merge three matching buses into…",
    "tags": [
      "Puzzle",
      "1 Player",
      "Bus",
      "Casual",
      "Logic",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-gt-rush-2026",
    "name": "GT Rush 2026",
    "url": "https://html5.gamemonetize.co/c383ksvoazl2tnmateeiyybr3ziqq3zk/",
    "description": "Race 8 brand-free GT cars on 3 circuits! 5 modes each, championship, drift, upgrades, skill tree & daily rewards. Built for speed by crazygamesup",
    "tags": [
      "Racing",
      "Race"
    ],
    "mobile": false
  },
  {
    "id": "gm-dead-city-zombie-survival",
    "name": "Dead City: Zombie Survival",
    "url": "https://html5.gamemonetize.co/hwpcngj7qqwq5o4zidqq6v89s902jyk7/",
    "description": "The city fell three days ago. Survive the night in a ruined, zombie-infested city, scavenge weapons and supplies, fight off hordes of the dead and find a way out before its too late. Explore abandoned streets, a forest…",
    "tags": [
      "Adventure",
      "1 Player",
      "3D",
      "Action",
      "Bubble Shooter",
      "Fps"
    ],
    "mobile": false
  },
  {
    "id": "gm-teen-titans-bad-guy",
    "name": "Teen Titans Bad Guy",
    "url": "https://html5.gamemonetize.co/kuci0i67tgizb5jw21dkw2nl761o0ozb/",
    "description": "Team up with the Teen Titans in Teen Titans - Bad Guy! Dash into high-speed combat, defeat notorious villains across Jump City, unleash explosive special moves with Robin, Cyborg, Raven, Starfire, and Beast Boy, and…",
    "tags": [
      "Arcade",
      "Action",
      "Ben 10",
      "Boys",
      "Fight",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-aliens-need-redheads",
    "name": "Aliens Need Redheads",
    "url": "https://html5.gamemonetize.co/a0cnhav86sob665ghqfqcxd4gir8g4cw/",
    "description": "Aliens Need Redheads is a fast paced running platformer game where your play as shy guy who fell in love with her office crush. But just when hes about to give her a flower, her office crush gets kidnapped by an alien…",
    "tags": [
      "Boys",
      "Adventure",
      "Best",
      "Best Games",
      "Rescue",
      "Run"
    ],
    "mobile": false
  },
  {
    "id": "gm-dont-splash",
    "name": "DONT SPLASH",
    "url": "https://html5.gamemonetize.co/xfyxlaku2ksfgh7wp1pgyr8bi5clmnfi/",
    "description": "Dont Splash is a 3D horror platformer set in an endless abandoned pool. Jump from tile to tile through the fog and find the exit, but never fall in: a blind creature lives in the water and hunts by sound. One splash and…",
    "tags": [
      "Adventure",
      "2 Player",
      "3D",
      "Escape",
      "Horror",
      "Jump"
    ],
    "mobile": false
  },
  {
    "id": "gm-puzzle-box-connect",
    "name": "Puzzle Box: Connect",
    "url": "https://html5.gamemonetize.co/0249cvsk32obcczmj1fn39tipcyqk82n/",
    "description": "Connect the matching colored tiles by drawing paths across the grid. Fill the board without letting the paths overlap. Solve each puzzle to advance through the levels. Web Dev https://www.gamesx.com.es/",
    "tags": [
      "Puzzle",
      "1 Player",
      "2026 games",
      "Color"
    ],
    "mobile": false
  },
  {
    "id": "gm-stunt-witch-3",
    "name": "Stunt Witch 3",
    "url": "https://html5.gamemonetize.co/yrrfffm4gghl0q5crhv7umpeqx0s7wmh/",
    "description": "Fly into a magical Halloween adventure! Help a brave little witch recover the stars stolen by a mischievous ghost. Steer your broom through glowing rings, collect stars and potions, and dodge bats across 24 scrolling…",
    "tags": [
      "Arcade",
      "Flight",
      "Halloween",
      "Mapi games",
      "Monster",
      "Skill"
    ],
    "mobile": false
  },
  {
    "id": "gm-farming-tractor-game",
    "name": "Farming Tractor Game",
    "url": "https://html5.gamemonetize.co/c4ngkockww8ny6bg7xhbtg96gkg9xytm/",
    "description": "Get ready to experience the exciting world of farming with Farming Tractor Game, an enjoyable tractor driving simulator where you can explore the countryside and take on farming challenges. Drive powerful tractors, work…",
    "tags": [
      "Adventure",
      "2026 games",
      "Action",
      "Amazing",
      "Best Games",
      "Fun"
    ],
    "mobile": false
  },
  {
    "id": "gm-streets-of-rage-neon-district",
    "name": "Streets of Rage: Neon District",
    "url": "https://html5.gamemonetize.co/p25radjvlhjem10brkzc9336ppjpo7sk/",
    "description": "Fight through eight neon-lit district chapters as Rhea or Vale in this 2D street brawler. Mix punches, kicks and airborne attacks, dodge enemy windups, grab and throw opponents and pick up weapons. Explore multiple…",
    "tags": [
      "Arcade",
      "1 Player",
      "2D",
      "Action",
      "Fighting",
      "Side Scrolling"
    ],
    "mobile": false
  },
  {
    "id": "gm-6x6-offroad-jeep",
    "name": "6x6 Offroad Jeep",
    "url": "https://html5.gamemonetize.co/bsx68lauujl9z2u18521kjt7vyxjedlh/",
    "description": "Take control of a powerful 6x6 off-road jeep and conquer rugged mountain trails in 6x6 Offroad Jeep. Climb steep rocky slopes, cross uneven terrain and follow the course to reach the finish. Explore challenging…",
    "tags": [
      "Racing",
      "Car",
      "Driving",
      "Jeep",
      "Offroad",
      "Simulator"
    ],
    "mobile": false
  },
  {
    "id": "gm-slinky",
    "name": "Slinky",
    "url": "https://html5.gamemonetize.co/tojamlh4ui7foeo7mriaa7m9bfr2lmmn/",
    "description": "**Slinky** is a challenging logic puzzle game where every step matters. Move across numbered tiles, avoid tiles that reach zero, and turn red and yellow tiles green to complete each level. Plan your route carefully…",
    "tags": [
      "Puzzle",
      "Animal",
      "Casual",
      "Escape",
      "Funny"
    ],
    "mobile": false
  },
  {
    "id": "gm-geometry-arrow-wave-rush",
    "name": "Geometry Arrow Wave Rush",
    "url": "https://html5.gamemonetize.co/h06q6l2l5uhu41fatq1cgofp5um9ooe1/",
    "description": "Get ready to test your reflexes in Geometry Arrow Wave Rush! Control your arrow-shaped character and navigate through challenging obstacle-filled tracks in this fast-paced arcade game. Make sharp movements, pass through…",
    "tags": [
      "Hypercasual",
      "Casual",
      ".io",
      ".io Games",
      "1 Player",
      "2026 games"
    ],
    "mobile": false
  },
  {
    "id": "gm-puzzlemaster",
    "name": "PuzzleMaster",
    "url": "https://html5.gamemonetize.co/xrwbhtdqyhgf3ucr3wiy02ound7bhic8/",
    "description": "Puzzle Master is an addictive connect puzzle game where you match blocks of the same color using paths with no more than two turns. Observe the board, think strategically, and find the best connections to clear each…",
    "tags": [
      "Puzzle",
      "Block",
      "Classic",
      "Click",
      "Color"
    ],
    "mobile": false
  },
  {
    "id": "gm-punch-through",
    "name": "Punch Through!",
    "url": "https://html5.gamemonetize.co/1cwt59g0gbtfawv0yfvq7y2lybvdqdjc/",
    "description": "Framed for stealing the Mayors Golden Donut, prisoner #4027 punches his way out! Smash walls block by block in first person, vacuum the rubble, cash it in and upgrade from fists to boxing gloves, a hammer, a pickaxe, a…",
    "tags": [
      "Clicker",
      "Idle",
      "3D",
      "Boxing",
      "Cartoon",
      "Destruction"
    ],
    "mobile": false
  },
  {
    "id": "gm-frosty-ball",
    "name": "Frosty Ball",
    "url": "https://html5.gamemonetize.co/7dieq9ahm1bpxijaap39monmxxybs8bk/",
    "description": "Frosty Ball is a fast-paced physics platformer set across icy peaks and cosmic frost! Roll your way through challenging obstacles, collect golden coins, leap over sharp spikes, and unlock 10 adorable snowball…",
    "tags": [
      "Adventure",
      "1 Player",
      "2026 games",
      "Ball",
      "Snow",
      "Winter"
    ],
    "mobile": false
  },
  {
    "id": "gm-color-sort-party",
    "name": "Color Sort Party",
    "url": "https://html5.gamemonetize.co/drsu5viufo8ea6u4l4315s11ouzsz1hq/",
    "description": "Have fun with this super-addictive game. Get to work: pour liquids between tubes, sort the colors and beat increasingly challenging levels. Use special boosters, think strategically and keep moving forward.",
    "tags": [
      "Puzzle",
      "Color",
      "Coloring",
      "Logic",
      "Logical",
      "Sort"
    ],
    "mobile": false
  },
  {
    "id": "gm-fish-tank-caretaker-simulator",
    "name": "Fish Tank: Caretaker Simulator",
    "url": "https://html5.gamemonetize.co/zwni9zt0o6bl9mie3szq593mrqcn4tj8/",
    "description": "Step into Fish Tank: Caretaker Simulator, the ultimate aquatic management experience! Design vibrant underwater habitats, maintain precise water chemistry, and nourish a diverse range of marine life. Troubleshoot…",
    "tags": [
      "Hypercasual",
      "Casual",
      "2D",
      "Arcade",
      "Fish",
      "Simulation"
    ],
    "mobile": false
  },
  {
    "id": "gm-emergency-rush-city-ambulance-rescue",
    "name": "Emergency Rush: City Ambulance Rescue",
    "url": "https://html5.gamemonetize.co/gchmclp7ubzh4f2zio5wpebxdfw19lcr/",
    "description": "Get ready to become a real-life hero in Emergency Rush: City Ambulance Rescue! Take control of a powerful ambulance and race through busy city streets to reach patients in urgent need of medical assistance. Your mission…",
    "tags": [
      "Adventure",
      "3D Games",
      "Ambulance",
      "Rescue",
      "Simulation"
    ],
    "mobile": false
  },
  {
    "id": "gm-fast-connect-one-line-blitz",
    "name": "Fast Connect: One Line Blitz",
    "url": "https://html5.gamemonetize.co/1e73hjgongqegvcqur7mbjs1oijmvqke/",
    "description": "One Line Blitz is a fast-paced one-line puzzle game that challenges your logic, speed, and precision. Draw a single continuous path from start to finish, fill every tile, and avoid forbidden blocks without crossing your…",
    "tags": [
      "Puzzle",
      "Battle",
      "Classic",
      "Fun",
      "Highscore"
    ],
    "mobile": false
  },
  {
    "id": "gm-hilltop-hustle",
    "name": "Hilltop Hustle",
    "url": "https://html5.gamemonetize.co/qfhenmcyo09bnpx4ri65grrkiwjpqbj1/",
    "description": "Floor it up endless bumpy hills in a bouncy physics driving game! Balance your jeep over crests, grab fuel cans before the tank runs dry and pull off flips and big air for bonus coins, but never land on your head. Spend…",
    "tags": [
      "Racing",
      "2D",
      "Car",
      "Cars",
      "Driving",
      "Jeep",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-lantern-wayfarner",
    "name": "Lantern Wayfarner",
    "url": "https://html5.gamemonetize.co/tltrrvejljfmc76aktf5iowt7p33eqwo/",
    "description": "The bell has fallen silent and a thick, creeping murk has swallowed the land. Only one traveler still carries a light. Grab your lantern, become the Lantern Wayfarer and bring the beacons back to life! Run, jump…",
    "tags": [
      "Arcade",
      "1 Player",
      "2D",
      "Dash",
      "Fantasy",
      "Jump",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-moto-extreme-halloween-land",
    "name": "Moto Extreme: Halloween Land",
    "url": "https://html5.gamemonetize.co/smyepcsrhk5x5kmcuel2wj7n3ftbjj2p/",
    "description": "In this Halloween-themed 3D side-scrolling motorcycle game, an exciting riding experience awaits you on dark and mysterious tracks. Overcome challenging obstacles, keep your motorcycle balanced, and complete a variety…",
    "tags": [
      "Hypercasual",
      "Casual",
      "1 Player",
      "2026 games",
      "3D",
      "Moto"
    ],
    "mobile": false
  },
  {
    "id": "gm-halloween-hand-care",
    "name": "Halloween Hand Care",
    "url": "https://html5.gamemonetize.co/bozgguzm2ejqv60gsm0t4kstwe80hclc/",
    "description": "Welcome to Halloween Hand Care! Run a spooky clinic and help six friendly monster patients feel better. Treat swollen fingers, soothe red bumps, cover scratches and remove splinters. Flip the hand to discover more…",
    "tags": [
      "Baby Hazel",
      "Halloween",
      "Health",
      "Mapi games",
      "Monster",
      "Simulation",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-duckling-rush-io",
    "name": "Duckling Rush.io",
    "url": "https://html5.gamemonetize.co/vuj35pjyhr7b8cd85gk2f28p351exqwn/",
    "description": "Duckling Rush.io is a cute pond arcade where you play a mama duck racing to gather the longest line of ducklings. Swim around a big pond, scoop up lost ducklings, and steal them from rival mamas by cutting through their…",
    "tags": [
      "Arcade",
      "Animal",
      "Casual",
      "Collecting",
      "Cute",
      "Endless",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-draw-path-to-finish",
    "name": "Draw Path To Finish",
    "url": "https://html5.gamemonetize.co/a83kwue6bv9b93djhxqvi8ku3jvhlql0/",
    "description": "Help the heroine cross a course filled with dangerous obstacles. Draw a line that becomes the route for her moving platform, then watch whether she can make it to the finish. Saws, fire, lava, cannons, explosive…",
    "tags": [
      "Puzzle",
      "1 Player",
      "2026 games",
      "2D",
      "Android",
      "Best",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-roadster-dash-halloween-night",
    "name": "Roadster Dash: Halloween Night",
    "url": "https://html5.gamemonetize.co/xtpxzk9s2wxpnjly81wu273beu4tui7j/",
    "description": "Roadster Dash: Halloween Night is a 3D arcade racing game with a flying car! Boost down a haunted highway, jump over traffic, fly, flip and barrel roll to chain stunt combos. Collect glowing pumpkins, grab power-ups and…",
    "tags": [
      "Racing",
      "2 Player",
      "3D",
      "Arcade",
      "Car",
      "Driving"
    ],
    "mobile": false
  },
  {
    "id": "gm-kick-the-zombie-ragdoll-sandbox",
    "name": "Kick the Zombie: Ragdoll Sandbox",
    "url": "https://html5.gamemonetize.co/thc5u1mml88ak50zkb2atfzxc127itzr/",
    "description": "Kick the Zombie is a goofy ragdoll physics toy set in a moonlit graveyard. Meet Gus, a polite cartoon zombie who is happy to be dragged, flung, kicked and bonked. Grab him and throw him into bouncy headstones and walls…",
    "tags": [
      "Arcade",
      "Cartoon",
      "Casual",
      "Crazy",
      "Funny",
      "Halloween",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-snakearea-io",
    "name": "SnakeArea.io",
    "url": "https://html5.gamemonetize.co/nzckf1qr1b79ij20918phr29onkzl8ky/",
    "description": "In a world ruled by snakes, only the most skilled will survive. Every enemy is a test of your instincts. Devour without mercy, grow without limits and claim ultimate power. Unleash your hunger, conquer all 10 stages and…",
    "tags": [
      "Hypercasual",
      "Casual",
      ".io",
      ".io Games",
      "Arcade",
      "Battle"
    ],
    "mobile": false
  },
  {
    "id": "gm-spotless",
    "name": "Spotless",
    "url": "https://html5.gamemonetize.co/3mmnm799u7mmi8v893sgsd29wvqx4li3/",
    "description": "Spotless is a satisfying pressure-washing game! Clean 100 jobs, blast away mud, moss, rust and grime, chain combos, trigger Fever and earn coins. Upgrade your pump, unlock nozzles and tackle massive jobs, from stop…",
    "tags": [
      "Hypercasual",
      "Casual",
      ".io",
      ".io Games",
      "1 Player",
      "Amazing"
    ],
    "mobile": false
  },
  {
    "id": "gm-the-space-mover",
    "name": "The Space Mover",
    "url": "https://html5.gamemonetize.co/acel3q6l3m9bu7z9nvhg7jas88gsv7za/",
    "description": "The Space Mover is an exciting brain puzzle game that combines robot control, magnetic movement, and smart problem-solving challenges. Guide a clever robot through space-like levels, use magnetic power to move boxes…",
    "tags": [
      "Puzzle",
      "Casual",
      "Logical",
      "Robot",
      "Space"
    ],
    "mobile": false
  },
  {
    "id": "gm-rainbow-ball-runner-2048",
    "name": "Rainbow Ball Runner 2048",
    "url": "https://html5.gamemonetize.co/4jwq6zvh0h55rsyrrrauciactlcps0cs/",
    "description": "Roll, dodge obstacles and collect matching balls as you race along a colorful water track. Grow your ball, stay on the path, and take on increasingly challenging levels! Web Dev https://www.pokii.com.es/",
    "tags": [
      "Arcade",
      "1 Player",
      "Ball",
      "Best Games"
    ],
    "mobile": false
  },
  {
    "id": "gm-sky-ace-stunt-plane-islands",
    "name": "Sky Ace: Stunt Plane Islands",
    "url": "https://html5.gamemonetize.co/bvnnepsj274wi8fscj1k2ezlsgp1cawu/",
    "description": "Take the controls of a bright stunt plane and fly free over palm islands, a red canyon, snowy peaks and a city at sunset. Thread glowing rings, pop balloons, chain loops and barrel rolls into huge combos, race rival…",
    "tags": [
      "Arcade",
      "3D",
      "Aircraft",
      "Airplane",
      "Flight",
      "Fly"
    ],
    "mobile": false
  },
  {
    "id": "gm-halloween-tile-tumble",
    "name": "Halloween Tile Tumble",
    "url": "https://html5.gamemonetize.co/mksdp2cdkyukdtyy0n5e86ptrt0cdsly/",
    "description": "Play Halloween Block Collapse and clear spooky Halloween blocks in an addictive puzzle adventure filled with satisfying chain reactions. Match connected blocks, earn points, unleash powerful boosters, overcome tricky…",
    "tags": [
      "Puzzle",
      "Block",
      "Halloween",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-stand-modes-and-cases-3d",
    "name": "Stand Modes and Cases 3D",
    "url": "https://html5.gamemonetize.co/0zr8svdflu7y74i1kapw6cir3bbk2th0/",
    "description": "Key Features: A true 3D duel mode where you can play with rare skins! &bull; Opening cases — a wide selection of skin collections. &bull; 3D graphics and detailed previews — examine each item from every angle. &bull…",
    "tags": [
      "Shooting",
      "1 Player",
      "Action",
      "CSGO",
      "Enemies",
      "Polygon"
    ],
    "mobile": false
  },
  {
    "id": "gm-sunfield-vegetable-farm",
    "name": "Sunfield Vegetable Farm",
    "url": "https://html5.gamemonetize.co/16l56m3u5tkq4zyv02tjqcmyrge82l11/",
    "description": "Grow, harvest and sell fresh vegetables in Sunfield, a cozy 3D farming game! Plant carrots, tomatoes and cabbages, water them and watch them grow. Stock the market carts, serve customers at the checkout and collect your…",
    "tags": [
      "Hypercasual",
      "Casual",
      "1 Player",
      "3D Games",
      "Farm",
      "Grow"
    ],
    "mobile": false
  },
  {
    "id": "gm-clearfell-forest-outpost",
    "name": "Clearfell: Forest Outpost",
    "url": "https://html5.gamemonetize.co/ox7ry3shy3w6pfw7y8nbrn0itirlf378/",
    "description": "Clearfell: Forest Outpost is an isometric 3D base-building survival game. Start with one tent in a small clearing deep in an endless forest. Chop your way out, gather wood, stone, gold and iron, and build sawmills…",
    "tags": [
      "Action",
      "3D",
      "Crafting",
      "Defense",
      "Forest",
      "Shooter"
    ],
    "mobile": false
  },
  {
    "id": "gm-villadash-hero-rescue",
    "name": "Villadash Hero Rescue",
    "url": "https://html5.gamemonetize.co/901eh9sn07eefyfjkfotl4zv432wgvud/",
    "description": "Morvane and his bandits are raiding the villages of the kingdom, and every villager he carries off makes him stronger. You have one round to get to them first. Pick Ronan the knight, Lyra the rogue or Brann the frost…",
    "tags": [
      "Adventure",
      "3D",
      "Action",
      "Fantasy",
      "Knight",
      "Magic"
    ],
    "mobile": false
  },
  {
    "id": "gm-steal-car-duel",
    "name": "Steal Car Duel",
    "url": "https://html5.gamemonetize.co/ue3nhk2f20r984onh9u9nst268a9yh5r/",
    "description": "Step into a high-energy world of engines, rivalry, and fast reflexes. Steal Car Duel is a competitive action game that evolves the idea of Steal a Brainrot into a car-based experience filled with duels, rare…",
    "tags": [
      "Action",
      "1 Player",
      "2 Player",
      "2 Player Games"
    ],
    "mobile": false
  },
  {
    "id": "gm-cadillacs-dino-riot",
    "name": "Cadillacs: Dino Riot",
    "url": "https://html5.gamemonetize.co/6zb4cky2axmyujxxws42xc8l8q9yew2f/",
    "description": "Choose Kira or Bo and fight to stop a dinosaur-smuggling convoy in a colourful 2D rescue adventure. Eight chapters lead through multiple combat zones, dusty roads and dangerous compounds. Chain punches, jump, grab and…",
    "tags": [
      "Arcade",
      "1 Player",
      "2D",
      "Adventure",
      "Dinosaur",
      "Fighting"
    ],
    "mobile": false
  },
  {
    "id": "gm-simulator-gt-motorsport",
    "name": "Simulator GT Motorsport",
    "url": "https://html5.gamemonetize.co/f6nitbpjolxwjywr1u78jybbvj0wnzkt/",
    "description": "Drive GT Motorsport-style cars in your browser. Pick cars, upgrade, build your skill tree, then take on Circuit, Short Race, Drag Race, and Drift.",
    "tags": [
      "Sports",
      "Draw",
      "Drift",
      "Driving",
      "Racing",
      "Simulation"
    ],
    "mobile": false
  },
  {
    "id": "gm-midway-malarkey",
    "name": "Midway Malarkey",
    "url": "https://html5.gamemonetize.co/4cc4nsdd1nrfgsijvi6s9ecf3awi5g8c/",
    "description": "Midway Malarkey is a hand-painted 1930s cartoon arena brawler. Rascals pour out of every tent at the carnival and your weapons fire on their own: rolling pins, trumpets, tesla coils and falling anvils. Dodge their…",
    "tags": [
      "Shooting",
      "2D",
      "Arena",
      "Bullet",
      "Cartoon",
      "Circus"
    ],
    "mobile": false
  },
  {
    "id": "gm-block-drop-escape-puzzle",
    "name": "Block Drop Escape Puzzle",
    "url": "https://html5.gamemonetize.co/zef4dbx833cpmmgfswkva8eaj811jfym/",
    "description": "Block Drop Escape Puzzle is a colorful puzzle game about choosing the right blocks in the right order. Tap a piece to release its blocks, fill matching colored boxes, and clear the board. Plan ahead and keep the limited…",
    "tags": [
      "Puzzle",
      "1 Player",
      "3D",
      "Block",
      "Brain",
      "Color",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-mud-truck-simulator-game",
    "name": "Mud Truck Simulator Game",
    "url": "https://html5.gamemonetize.co/spxackbi5osov27qpzzmtogq2lj0ag4d/",
    "description": "Get ready for an exciting offroad driving adventure with Mud Truck Simulator Game! Take control of powerful trucks, drive through muddy roads, explore challenging offroad environments, and test your driving skills…",
    "tags": [
      "Racing",
      "2026 games",
      "Action",
      "Adventure",
      "Best Games",
      "Truck"
    ],
    "mobile": false
  },
  {
    "id": "gm-spooky-boxing",
    "name": "SPOOKY BOXING",
    "url": "https://html5.gamemonetize.co/ll6suhn9wqqtauup2wpjr5xo1qovaulr/",
    "description": "Enter the haunted ring in Spooky Boxing! Choose from 12 monsters with unique abilities, battle through spooky arenas and unlock each fighter's comic ending. Throw jabs, crosses and charged uppercuts while guarding and…",
    "tags": [
      "Sports",
      "Arcade",
      "Boxing",
      "Fight",
      "Halloween",
      "Mapi games"
    ],
    "mobile": false
  },
  {
    "id": "gm-breach-ops",
    "name": "Breach Ops",
    "url": "https://html5.gamemonetize.co/vgqizq5uylf25o1i8rirsw7fo3c30vg4/",
    "description": "Breach Ops is a tactical first-person shooter against smart bots. In Bomb Defusal, Raiders plant the bomb and Wardens defend and defuse it in 5v5 rounds with a buy menu and round economy. Arena is a Quake-style…",
    "tags": [
      "Shooting",
      "Arena",
      "First Person Shooter",
      "Fps",
      "Gun",
      "Shooter"
    ],
    "mobile": false
  },
  {
    "id": "gm-void-rescue",
    "name": "Void Rescue",
    "url": "https://html5.gamemonetize.co/bgf1ck5e398663kzfqn1ogx3avjkxg11/",
    "description": "Void Rescue is a retro pixel-art rescue game set in glowing crystal caves on an alien planet. Pilot your rescue capsule through narrow tunnels, find stranded survivors and carry them back to base before your fuel runs…",
    "tags": [
      "Hypercasual",
      "Casual",
      "Rescue",
      "Space"
    ],
    "mobile": false
  },
  {
    "id": "gm-recoils",
    "name": "RECOILS",
    "url": "https://html5.gamemonetize.co/rt4osuaoeeeczjoejoqbn24qvjrrkwj5/",
    "description": "One button. Endless chaos. Youre a gun hanging from a parachute, and the only way to move is to shoot. Every shot kicks you back, so you blast robots and steer at the same time. Easy to learn, hard to put down. - Simple…",
    "tags": [
      "Shooting",
      "1 Player",
      "2026 games",
      "2D",
      "Destroying",
      "Endless"
    ],
    "mobile": false
  },
  {
    "id": "gm-save-my-human",
    "name": "Save My Human",
    "url": "https://html5.gamemonetize.co/l3eg31s26dymr6qnb8iuhq9jt10nyr9h/",
    "description": "Step into the paws of a hero cat! Navigate tile by tile through tricky puzzles and dangerous paths to rescue your beloved human. Can you save your favorite owner? It's up to you, a brave little cat, to rescue your…",
    "tags": [
      "Puzzle",
      "1 Player",
      "2026 games",
      "2D",
      "Animal",
      "Escape"
    ],
    "mobile": false
  },
  {
    "id": "gm-anime-mom-family-life-simulator",
    "name": "Anime Mom: Family Life Simulator",
    "url": "https://html5.gamemonetize.co/izaf3stuaxnvxk12fxz4b0ibuhmk4qza/",
    "description": "Step into the daily life of an anime mom and experience a fun family life simulator! Take care of your home, complete simple tasks, manage daily activities, and keep your family happy. Explore colorful environments…",
    "tags": [
      "Adventure",
      "1 Player",
      "3D",
      "Anime",
      "Family",
      "Kid"
    ],
    "mobile": false
  },
  {
    "id": "gm-sniper-hero-urban-strike",
    "name": "Sniper Hero: Urban Strike",
    "url": "https://html5.gamemonetize.co/k8xzefqhicmw6zuyv3rzgvzvvdgvbhzw/",
    "description": "Take aim, line up each shot and clear a series of urban missions. Watch your targets carefully, avoid civilians, and manage your limited ammunition—every shot counts. Complete each stage to move forward and prove your…",
    "tags": [
      "Shooting",
      "1 Player",
      "Battle",
      "Best",
      "Shooter"
    ],
    "mobile": false
  },
  {
    "id": "gm-ligmar-online",
    "name": "Ligmar Online",
    "url": "https://html5.gamemonetize.co/dp44mvajt7c6ceztkawj2i4orpo7frto/",
    "description": "Ligmar Online brings together what we loved about old-school browser MMORPGs: leveling, rare loot, dungeons, and PvP. There's always someone to beat or a piece of gear worth chasing. But it's the people that make it…",
    "tags": [
      "Multiplayer",
      "2026 games",
      "Best Games",
      "Free games for your site",
      "Free games for your website",
      "Game",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-splash-rivals",
    "name": "Splash Rivals",
    "url": "https://html5.gamemonetize.co/d5r16zw4d91gars6an4gh41h3kvtf2ri/",
    "description": "Splash Rivals is an online multiplayer paint shooter where two teams of four battle to cover the arena in their colour. Spray the ground, splash your rivals and swim through your teams paint to refill your paint tank…",
    "tags": [
      "Shooting",
      "2026 games",
      "3D",
      "3D Games",
      "Action",
      "Color"
    ],
    "mobile": false
  },
  {
    "id": "gm-bus-simulator-game-2026",
    "name": "Bus Simulator Game 2026",
    "url": "https://html5.gamemonetize.co/op80fpm9qz2r91kjhwsjb5vwttnxrgx2/",
    "description": "Welcome to the Bus Simulator Game 2026. This is a fun and exciting game where you drive a big bus on rough and bumpy roads in mud bus game. If you enjoy driving games and want to try something new, this game is just…",
    "tags": [
      "Racing",
      "2026 games",
      "Adventure",
      "Amazing",
      "Bus",
      "Simulation"
    ],
    "mobile": false
  },
  {
    "id": "gm-paint-escape",
    "name": "Paint & Escape",
    "url": "https://html5.gamemonetize.co/8ua263c3gk1nsznafi3inwacj2cj90a7/",
    "description": "Paint & Escape is a neon stealth-action game. Sneak past the guards, paint your graffiti masterpiece on the glowing spot, then escape before they catch you! Every level is a newly built house, school, museum or arcade…",
    "tags": [
      "Arcade",
      "1 Player",
      "3D",
      "Action",
      "Escape",
      "Paint"
    ],
    "mobile": false
  },
  {
    "id": "gm-midnight-valet",
    "name": "Midnight Valet",
    "url": "https://html5.gamemonetize.co/857i4wbmlrdkk761mgidh84z0wuejyw1/",
    "description": "Midnight Valet is a 3D valet parking simulator. Your night shift at the citys busiest club runs from 22:00 to 04:00. Take the keys from arriving guests, park their cars in the lot, hang the keys on the key board, then…",
    "tags": [
      "Racing",
      "Car",
      "Carparking",
      "Driving",
      "Parking",
      "Simulation"
    ],
    "mobile": false
  },
  {
    "id": "gm-nitro-racing-gear",
    "name": "Nitro Racing Gear",
    "url": "https://html5.gamemonetize.co/dol1mcx04iu3c75ct96uv6vx4o5cwypn/",
    "description": "Hit the road in Nitro Racing Gear, a high-speed arcade racing game! Take on 40 stages across eight worlds, from coastal highways and neon cities to snowy mountains and volcanic roads. Compete in races, sprints, drift…",
    "tags": [
      "Racing",
      "1 Player",
      "Car",
      "Car tuning",
      "Drift",
      "Driving"
    ],
    "mobile": false
  },
  {
    "id": "gm-trick-or-treat-candy-carnival",
    "name": "Trick Or Treat Candy Carnival",
    "url": "https://html5.gamemonetize.co/xsnwvh21wyptpcxi757n0ji1w1h6n8zt/",
    "description": "Visit a moonlit Halloween carnival with Count Boo and his monster friends. Choose from seven games: pop ghosts, build 24 jigsaw pictures, find matching pairs, explore a talking alphabet, catch falling candy, recognize…",
    "tags": [
      "Puzzle",
      "Family",
      "Halloween",
      "Kids",
      "Mapi games",
      "Monster",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-magline-moto",
    "name": "Magline Moto",
    "url": "https://html5.gamemonetize.co/qvkmkrxo0p6g0zyftqz834mvmavrzosk/",
    "description": "Magline Moto is a futuristic stunt bike racer. Ride a hyperbike on glowing energy-ring wheels across 30 hand-built levels in 3 worlds: Neon District, Emberfall and Cryo Spire. Flip in the air for time bonuses, blast…",
    "tags": [
      "Racing",
      "1 Player",
      "2026 games",
      "2D",
      "Action",
      "Alien",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-road-restore",
    "name": "Road Restore",
    "url": "https://html5.gamemonetize.co/1uw1mpl37s73k057xn3q2uwun51oey99/",
    "description": "Road Restore is a 3D game about fixing roads, one stretch at a time. Drive your truck over damaged asphalt, repaint road markings, and install guardrails across 70 sectors, from quiet forests to coastal roads and…",
    "tags": [
      "Arcade",
      "1 Player",
      "Driving",
      "Paint",
      "Road",
      "Simulation"
    ],
    "mobile": false
  },
  {
    "id": "gm-rubber-doodle",
    "name": "Rubber Doodle",
    "url": "https://html5.gamemonetize.co/c46ykv5ad5awq1fzcmxdk1d014p3kqj9/",
    "description": "Rubber Doodle is a physics puzzle where every line you draw turns into a rubber band. Draw a band, stretch it and let it snap: catch the ball, fling it like a slingshot, wrap bands around pegs and bounce off walls…",
    "tags": [
      "Puzzle",
      "2D",
      "Brain",
      "Drawing",
      "Logic",
      "Physics"
    ],
    "mobile": false
  },
  {
    "id": "gm-zombie-barrage",
    "name": "Zombie Barrage",
    "url": "https://html5.gamemonetize.co/2nqzwfcpapiju8psepmglqufnbhha2u3/",
    "description": "Zombie Barrage is a top-down zombie defense game. Hold the barricade against increasingly dangerous waves, defeat mutated bosses, earn coins, and upgrade your weapons and gear between rounds. Aim carefully, manage your…",
    "tags": [
      "Shooting",
      "2D",
      "Zombie"
    ],
    "mobile": false
  },
  {
    "id": "gm-i-get-you",
    "name": "I Get You",
    "url": "https://html5.gamemonetize.co/s9uz8evn4n21pvm0h990i2l6pnjslltw/",
    "description": "I Get You is a troll platformer where the level itself is your opponent. It has eyes, it talks, and every trap is something its body does: the floor yawns under your feet, the ground gets goosebumps, it sneezes you off…",
    "tags": [
      "Arcade",
      "1 Player",
      "Casual",
      "Funny",
      "Jumping",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-speed-evolution",
    "name": "Speed Evolution",
    "url": "https://html5.gamemonetize.co/x4megppwmr3kkxgodm87rquwayflrbvc/",
    "description": "Race down an 11-stage sky track where every metre makes you faster. Level up and watch your ride evolve from a skateboard into a shopping cart, a monster truck, a shark car and a space racer while you jump spikes and…",
    "tags": [
      "Racing",
      "3D",
      "3D Games",
      "Car",
      "Cars",
      "Driving",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-pixel-protocol",
    "name": "Pixel Protocol",
    "url": "https://html5.gamemonetize.co/k3fgyou5rsi6ntu8oo6ntlq23bgosqn6/",
    "description": "Pixel Protocol is a fast low-poly team arena shooter in your browser. Pick a map, set the difficulty and the number of allies and enemies, then fight bots in quick 4v4 matches. Choose between three blasters, dash and…",
    "tags": [
      "Shooting",
      "3D",
      "Arena",
      "First Person Shooter",
      "Fps",
      "Multiplayer"
    ],
    "mobile": false
  },
  {
    "id": "gm-police-car-chaser",
    "name": "police car chaser",
    "url": "https://html5.gamemonetize.co/y4ym38okutofuakp8syt9bebahw2wbhe/",
    "description": "**Police Car Chase** Get ready for an exciting high-speed police chase! Drive your police car through busy roads, chase down criminals, and test your driving skills in thrilling missions. Avoid obstacles, steer…",
    "tags": [
      "Racing",
      "3D Games",
      "Police"
    ],
    "mobile": false
  },
  {
    "id": "gm-100-doors-mystery-room-escape",
    "name": "100 Doors: Mystery Room Escape",
    "url": "https://html5.gamemonetize.co/3n1zmp3qlq4yyihi9ujc5s6an2rtk7mj/",
    "description": "Step into the world of mystery and test your brain in 100 Doors: Mystery Room Escape! Can you crack the secret codes, solve tricky logic puzzles, find hidden objects, and unlock all 100 doors to escape each room? Every…",
    "tags": [
      "Puzzle",
      "Brain",
      "Escape",
      "Rescue",
      "Room"
    ],
    "mobile": false
  },
  {
    "id": "gm-float-for-brainrots",
    "name": "Float for Brainrots",
    "url": "https://html5.gamemonetize.co/oyfw1hcswirq80qznwjab217er8ulbgu/",
    "description": "Float for Brainrots is a chaotic water adventure game where you collect rare Brainrots across dangerous seas. Start with a simple raft, unlock powerful boats, upgrade speed and capacity, and explore deeper waters for…",
    "tags": [
      "Racing",
      ".io",
      "2 Player",
      "2 Player Games",
      "Brainrot",
      "Italian Brainrot"
    ],
    "mobile": false
  },
  {
    "id": "gm-escape-school-duel",
    "name": "Escape School Duel",
    "url": "https://html5.gamemonetize.co/c8knm7hay0hh38clhrvnxh82u7ocy8mo/",
    "description": "Escape School Duel is a fast, funny, and tense escape challenge set inside a school that does not want to let you leave. Play solo to chase your best time, or go 2 player and turn every hallway into a race for freedom…",
    "tags": [
      "Adventure",
      "2 Player",
      "2 Player Games",
      "Escape",
      "Running",
      "School"
    ],
    "mobile": false
  },
  {
    "id": "gm-rocket-car-football-championship",
    "name": "Rocket Car Football Championship",
    "url": "https://html5.gamemonetize.co/igh20c17cjmwac7n1k127u0q815az4vz/",
    "description": "Rocket-powered cars meet football in the floodlit Breymantech Arena! Boost, jump, flip and fly to smash a giant ball into the opponent's goal in fast 1v1, 2v2 and 3v3 matches against smart AI teams that rotate, defend…",
    "tags": [
      "Soccer",
      "1 Player",
      "3D",
      "3D Games",
      "Action",
      "Adventure"
    ],
    "mobile": false
  },
  {
    "id": "gm-core-rush",
    "name": "CORE RUSH",
    "url": "https://html5.gamemonetize.co/l22ke63gr05vl366ye9vq5k385h5rue8/",
    "description": "CORE RUSH is a 3D sliding puzzle adventure. Launch your rover through 48 rooms, collect every core and reach the exit. Break crates, trigger chain reactions, unlock gates and master portals. Plan efficient routes to…",
    "tags": [
      "Puzzle",
      "Arcade",
      "Brain",
      "Logic",
      "Mapi games",
      "Robot",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-narcos-crime-master",
    "name": "Narcos: Crime Master",
    "url": "https://html5.gamemonetize.co/45gty9ox608dg7qz466k9arigwavz0tj/",
    "description": "Step into the role of an aspiring crime boss in a colorful low-poly city. Drive through the streets, take on rival crews, and work through missions that mix car chases, street fights, and risky deals. Build your…",
    "tags": [
      "Adventure",
      "3D",
      "City",
      "Driving",
      "Police",
      "Polygon"
    ],
    "mobile": false
  },
  {
    "id": "gm-trick-paws",
    "name": "TRICK PAWS",
    "url": "https://html5.gamemonetize.co/s9fs7ahr71sly152sn9fsw0anonp8qsv/",
    "description": "Trick Paws: Trap Run is a funny troll platformer where nothing is what it looks like! Guide a brave little cat through 100 tricky levels full of hidden spikes, crumbling floors, falling rocks, rolling traps and fake…",
    "tags": [
      "Arcade",
      "2026 games",
      "Adventure",
      "Cartoon",
      "Cat",
      "Endless"
    ],
    "mobile": false
  },
  {
    "id": "gm-six-fold",
    "name": "SIX FOLD",
    "url": "https://html5.gamemonetize.co/1mnq6su7p2vof9h2k1leu335x6so7nvr/",
    "description": "SIXFOLD: a 3D snake in six panels. Steer one ink line over a paper cube. Every mark you eat adds a link and the line moves faster; cross an edge and the cube rolls, turning the panel under you into a wall. Six faces, no…",
    "tags": [
      "Arcade",
      "1 Player",
      "3D",
      "Snake"
    ],
    "mobile": false
  },
  {
    "id": "gm-jelly-mob-rush",
    "name": "Jelly Mob Rush",
    "url": "https://html5.gamemonetize.co/qmp9f6s9yny9jhhcwi9iul8vvyxnax2w/",
    "description": "Lead a wobbly mob of jelly people down a candy lane and pick the gates that grow your crowd. Squeeze past pizza cutters and sweepers, beat the red jelly army, then climb the macaron staircase for a coin multiplier. Four…",
    "tags": [
      "Hypercasual",
      "Casual",
      "3D",
      "Candy",
      "Cute",
      "Endless"
    ],
    "mobile": false
  },
  {
    "id": "gm-shooter-soldiers-vs-zombies",
    "name": "Shooter: Soldiers vs Zombies",
    "url": "https://html5.gamemonetize.co/3jargt8bsjfi2uupspvdwb7smsaok6fj/",
    "description": "Shooter: Soldiers vs Zombies is a free online first-person shooter where you fight alongside AI soldiers against zombie hordes. Explore six maps, including Italy, Train, and Inferno, in timed team deathmatch battles…",
    "tags": [
      "Shooting",
      "3D",
      "3D Games",
      "CSGO",
      "First Person Shooter",
      "Shoot"
    ],
    "mobile": false
  },
  {
    "id": "gm-last-shift",
    "name": "Last Shift",
    "url": "https://html5.gamemonetize.co/w20uinyyvb57g3e4hwb3j0mx2snfppa0/",
    "description": "Last Shift: Humans vs Machines is a fast 3D top-down action game. Technology is slowly taking over and five ordinary workers fight back. CHARACTERS: Programmer (homing code bolts), Soldier (rapid-fire rifle), Financier…",
    "tags": [
      "Shooting",
      "3D",
      "Action",
      "Arena",
      "Casual",
      "Survival"
    ],
    "mobile": false
  },
  {
    "id": "gm-sidefire",
    "name": "SIDEFIRE",
    "url": "https://html5.gamemonetize.co/rtif0otvetqm6lq7vcuesq3acy4kgino/",
    "description": "SIDEFIRE is a tactical 2D side-view team shooter. Jump into fast 5v5 Team Deathmatch against smart bots on Plant 7, a multi-level factory map with catwalks, containers and scaffolding. First team to 40 kills - or the…",
    "tags": [
      "Shooting",
      "2D",
      "Army",
      "Gun",
      "Military",
      "Shooter"
    ],
    "mobile": false
  },
  {
    "id": "gm-arctic-truck-driver",
    "name": "Arctic Truck Driver",
    "url": "https://html5.gamemonetize.co/4d8fsrd3vgf1anlphqtz0av17pc96uw1/",
    "description": "Arctic Truck Driver is a realistic 3D ice road trucking game. Haul cargo across frozen lakes where the ice decides how fast you can go. Thick ice is safe, but dark ice with glowing cracks is thin – drive too fast and it…",
    "tags": [
      "Racing",
      "3D",
      "Car",
      "Driving",
      "Ice",
      "Snow"
    ],
    "mobile": false
  },
  {
    "id": "gm-boombitz-bomb-chips",
    "name": "BoomBitz:Bomb Chips",
    "url": "https://html5.gamemonetize.co/k8qxib577wcjptysu95z3odi71yy1img/",
    "description": "**BoomBitz: Bomb Chips** Get ready for an explosive puzzle adventure in BoomBitz: Bomb Chips! Match colorful chips, trigger exciting bomb blasts, and clear the board through fun and challenging levels. Combine matching…",
    "tags": [
      "Racing",
      "Simulator"
    ],
    "mobile": false
  },
  {
    "id": "gm-misregister",
    "name": "MISREGISTER",
    "url": "https://html5.gamemonetize.co/jppnp6yrfdq164517p8cm9973ut3sk6f/",
    "description": "MISREGISTER: a four-page seam proof pressed on one cuboid. Ink lands on the page facing you, but after every shot the press turns to a page you did not pick and the ink keeps pressing down on all four. Three or more of…",
    "tags": [
      "Arcade",
      "1 Player",
      "3D",
      "Color"
    ],
    "mobile": false
  },
  {
    "id": "gm-neon-circuit-rush",
    "name": "Neon Circuit Rush",
    "url": "https://html5.gamemonetize.co/1tc3zjj6vqzbv6ldbulffu0j99lx3n2i/",
    "description": "Quick Race Car is a 3D arcade racing game with three ways to play. Pick a car, hit the track, steer through the race and earn coins to explore the shop. Use the keyboard or on-screen controls, and enjoy fast-paced…",
    "tags": [
      "Racing",
      "Car",
      "Drift",
      "Driving"
    ],
    "mobile": false
  },
  {
    "id": "gm-brainrot-mega-parkour",
    "name": "Brainrot Mega Parkour",
    "url": "https://html5.gamemonetize.co/r9yx8ulb0fn1r6orzjwafrgclw9as23o/",
    "description": "Step into the wildest parkour adventure yet. Brainrot Mega Parkour brings together four intense modes, forty handcrafted levels, and a cast of hilarious characters in a single high-speed package. Whether you're climbing…",
    "tags": [
      "Adventure",
      "1 Player",
      "2 Player",
      "2 Player Games",
      "Brainrot Italian",
      "Platform"
    ],
    "mobile": false
  },
  {
    "id": "gm-gun-trigger",
    "name": "Gun Trigger",
    "url": "https://html5.gamemonetize.co/xmu0fc4bjhkkil2jmk2lt73x2b51gibi/",
    "description": "Gun Trigger is an action-packed shooter where you play as a stylish agent. Flip through dynamic levels in slow motion and eliminate enemies with perfect timing",
    "tags": [
      "Shooting",
      "1 Player",
      "Action",
      "Adventure",
      "Casual",
      "Hypercasual"
    ],
    "mobile": false
  },
  {
    "id": "gm-contra-jungle-breach",
    "name": "Contra: Jungle Breach",
    "url": "https://html5.gamemonetize.co/gadcmw15on754dsa2y9vyzms8uxs36ss/",
    "description": "Join Mara on a fast 2D run-and-gun rescue mission through ten areas, from jungle outposts to frozen facilities and an alien lair. Aim while moving, jump over incoming shots and use a dash to escape tight situations…",
    "tags": [
      "Shooting",
      "1 Player",
      "2D",
      "Alien",
      "Gun",
      "Jungle"
    ],
    "mobile": false
  },
  {
    "id": "gm-animals-brick",
    "name": "Animals Brick",
    "url": "https://html5.gamemonetize.co/zgvgg20y7ifbmesdc78gkooh8o1u1rmz/",
    "description": "**AnimalBrick** is a fun and addictive tile-matching puzzle game where you match three identical animal tiles to clear the board. Complete each level's objective, plan your moves carefully, and avoid filling all seven…",
    "tags": [
      "Puzzle",
      "Animal",
      "Casino",
      "Fun",
      "Logic"
    ],
    "mobile": false
  },
  {
    "id": "gm-city-taxi-driving",
    "name": "City Taxi Driving",
    "url": "https://html5.gamemonetize.co/vk7w0akro0ztbmmbv6f1uj46ka3ayfnj/",
    "description": "# Taxi Car Driving **Drive Through the City. Pick Up Passengers. Become a Taxi Driving Expert!** Get behind the wheel and experience the excitement of city driving in Taxi Car Driving! Drive through busy streets, pick…",
    "tags": [
      "Racing",
      "3D Games",
      "Carparking",
      "Taxi"
    ],
    "mobile": false
  },
  {
    "id": "gm-satispuzzle-perfect-tidy",
    "name": "SatisPuzzle Perfect Tidy",
    "url": "https://html5.gamemonetize.co/c5tahl9t7uxf59zieumec68ha89al0x9/",
    "description": "SatisPuzzle Perfect Tidy is a multi-theme brain puzzle game packed with casual mini-games. From sorting and delivery tasks to cooking, problem-solving, and spooky searches, every level brings a fresh little challenge to…",
    "tags": [
      "Hypercasual",
      "Casual",
      "Amazing",
      "Best",
      "Cake",
      "Cooking"
    ],
    "mobile": false
  },
  {
    "id": "gm-formula-car-race",
    "name": "Formula Car Race",
    "url": "https://html5.gamemonetize.co/ac9bdilb46mpyx44608ik8s3dz5x5kv9/",
    "description": "Get ready for an exciting racing experience in Formula Car Race! Drive your formula car, control your speed, and race your way toward victory. Test your driving skills, master the turns, and enjoy fast-paced car racing…",
    "tags": [
      "Racing",
      "Car"
    ],
    "mobile": false
  },
  {
    "id": "gm-poppy-playtime-impostor-hunt",
    "name": "Poppy Playtime: Impostor Hunt",
    "url": "https://html5.gamemonetize.co/d1x6zghw101i8xseb4f4vqe3zpxzgggz/",
    "description": "Become the ultimate imposter! In Poppy Playtime: Impostor Hunt, play as iconic toy monsters, sneak up on unsuspecting crewmates, and eliminate them with a bat. Stay hidden, strike fast, and execute stealthy kills before…",
    "tags": [
      "Arcade",
      "Action",
      "Impostor",
      "Poppy Playtime",
      "Unity3D",
      "WebGL",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-crumple-rumble",
    "name": "Crumple Rumble",
    "url": "https://html5.gamemonetize.co/befyicw1m4s3skb4i45ct9cgbv4gnpng/",
    "description": "Crumple Rumble is a fast, funny stickman fighting game scribbled on notebook paper. Pick one of five doodle fighters, chain punches and kicks into combos, grab pencils, staffs and pipes, and charge your power bar to…",
    "tags": [
      "Stickman",
      "2 Player",
      "Action",
      "Arcade",
      "Brawl",
      "Cartoon",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-mask-of-six-moons",
    "name": "Mask of six Moons",
    "url": "https://html5.gamemonetize.co/c7hw1ex6qw2b9jtapsnseq021kdmb4pg/",
    "description": "Mask of Six Moons is a pixel-art action platformer. Dive through the moon gates, battle monsters and loot weapons from Common all the way to the ultra-rare Phantom tier. Choose from 12 weapon types, including…",
    "tags": [
      "Adventure",
      "Action",
      "Dungeon",
      "Fantasy",
      "Pixel",
      "Platform"
    ],
    "mobile": false
  },
  {
    "id": "gm-haunted-panic",
    "name": "Haunted Panic",
    "url": "https://html5.gamemonetize.co/o5569655kvn4t7e7a99mdqo94ev82tnb/",
    "description": "Guard twelve haunted doors in Haunted Panic. Tap monsters before they strike, spare friendly ghosts and hammer bonus chests for gold. Travel through six Halloween worlds across 24 nights, unleash pumpkin blasts and face…",
    "tags": [
      "Shooting",
      "Click",
      "Halloween",
      "Mapi games",
      "Monster",
      "Shoot",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-rope-chef",
    "name": "Rope Chef",
    "url": "https://html5.gamemonetize.co/0yuepzc11uav54ju65dhiy7rahfkxr7w/",
    "description": "Rope Chef is a cute physics puzzle about cooking. Ingredients hang on ropes above a pot. Cut the ropes at the right moment so each one swings, bounces or floats into the pot in the order the recipe card shows. Get the…",
    "tags": [
      "Puzzle",
      "Arcade",
      "Brain",
      "Casual",
      "Cook",
      "Cooking",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-sink-hole",
    "name": "Sink Hole",
    "url": "https://html5.gamemonetize.co/9q8wg1qah81wrucv2e8knmnxpbqbex4z/",
    "description": "Become a hungry sinkhole! Swallow a city, grow bigger, devour rivals and destroy skyscrapers! Features: 4 game modes: Classic, Battle Royale, Solo Rush and Wipeout. Eat smaller rivals and avoid bigger ones. Chain x5…",
    "tags": [
      "Hypercasual",
      "Casual",
      ".io",
      ".io Games",
      "1 Player",
      "3D"
    ],
    "mobile": false
  },
  {
    "id": "gm-island-mayhem-tiki-blast-3d",
    "name": "Island Mayhem: Tiki Blast 3D",
    "url": "https://html5.gamemonetize.co/3g9pfrnmpu1mqnhsjt7z0zav653yqpfc/",
    "description": "Island Mayhem is a colorful 3D cannon shooting and physics puzzle game. Join Bonko, a brave little pirate monkey, and blast your way across tropical islands! Aim the cannon, set the power and fire to knock down tiki…",
    "tags": [
      "Puzzle",
      "3D",
      "Cannon",
      "Casual",
      "Island",
      "Physics"
    ],
    "mobile": false
  },
  {
    "id": "gm-citadel-fortress-defense",
    "name": "Citadel: Fortress Defense",
    "url": "https://html5.gamemonetize.co/s4igc5hefvjcc1xhgh26cwnwjzonhngz/",
    "description": "Citadel: Fortress Defense is a 3D medieval strategy game in first person. Each day you build your town, then a raid comes. Build walls, gates, houses, farms, sawmills, quarries, towers, barracks, a market and a mage…",
    "tags": [
      "Action",
      "1 Player",
      "3D",
      "Building",
      "Castle",
      "Defense"
    ],
    "mobile": false
  },
  {
    "id": "gm-obby-rainbow-tower",
    "name": "Obby Rainbow Tower",
    "url": "https://html5.gamemonetize.co/hbf9jaxczsa4sqslxfxbzkuun22ylzh8/",
    "description": "Obby Rainbow Tower is a fast, winter-themed tower race where every second and every jump matters. Each floor is packed with moving platforms, icy tiles, spinning lava bars, surprise snowstorms and snowball portals that…",
    "tags": [
      "Racing",
      "1 Player",
      "2 Player",
      "2 Player Games",
      "Platform",
      "Running"
    ],
    "mobile": false
  },
  {
    "id": "gm-obby-toilet-line",
    "name": "Obby Toilet Line",
    "url": "https://html5.gamemonetize.co/hrmwlp351g90vwzplt86bz4snam41y84/",
    "description": "Obby Toilet Line starts in the most chaotic place imaginable: a gas station restroom line. Around 30 different characters are already waiting, and the queue stretches all the way past the store entrance. Your goal is…",
    "tags": [
      "Adventure",
      "1 Player",
      "2 Player",
      "2 Player Games",
      "Fun",
      "Funny"
    ],
    "mobile": false
  },
  {
    "id": "gm-darkhood",
    "name": "DarkHood",
    "url": "https://html5.gamemonetize.co/1zhakvwsb80tili3c8p352rmrjt011w5/",
    "description": "Step into a world where the only light is your own aura. Guide a brave boy in a dark hoodie through candle-lit caves, sleeping monsters and hidden passages. Collect every glowing gem, avoid bombs, pits and traps, and…",
    "tags": [
      "Arcade",
      "1 Player",
      "Action",
      "Hypercasual",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-tiny-track-rally",
    "name": "Tiny Track Rally",
    "url": "https://html5.gamemonetize.co/vwlvudub01fmurfybb0dnjy9c3arjxwa/",
    "description": "Race tiny toy cars in this colourful 3D arcade racer! Drift through corners, grab pickups, fire your nitro on the straights and beat up to 7 rival drivers to the finish line. Features: - 10 tracks in 2 cups. Cup 2 is…",
    "tags": [
      "Racing",
      "3D",
      "Arcade",
      "Drift",
      "Kids",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-funny-cars-reload",
    "name": "Funny Cars Reload",
    "url": "https://html5.gamemonetize.co/jz4uknudxi9b7efyv5d6wdwolb7eta8c/",
    "description": "Funny Cars Reload – Cartoon Racing Adventure Get ready for a fun and exciting racing adventure! Drive crazy cartoon cars, race through challenging tracks, and test your driving skills in Funny Cars Reload. Explore…",
    "tags": [
      "Arcade",
      "1 Player",
      "3D",
      "Cars",
      "Cartoon",
      "Racing"
    ],
    "mobile": false
  },
  {
    "id": "gm-boo-chains",
    "name": "Boo Chains",
    "url": "https://html5.gamemonetize.co/meb1p0ebehdlwx4821lxmd1rxqfpxixv/",
    "description": "Link cute Halloween monsters with the same number or one apart and watch them blow up! Long chains create pumpkin bombs, lightning and a wild ghost that explode together for huge combos. Travel across a spooky map with…",
    "tags": [
      "Puzzle",
      "Brain",
      "Casual",
      "Family",
      "Halloween",
      "Mapi games",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-monster-caf-eacute-idle-tycoon",
    "name": "Monster Caf&eacute;: Idle Tycoon",
    "url": "https://html5.gamemonetize.co/58mlizgpff7kxddjlrim59iye7qx1ejl/",
    "description": "Run the cosiest caf&eacute; at the edge of the haunted woods! Slimes, ghosts, vampires and zombies line up for bat lattes and pumpkin muffins. Tap their orders, collect coins and tips, upgrade spooky machines, hire…",
    "tags": [
      "Girls",
      "Casual",
      "Clicker",
      "Cooking",
      "Cute",
      "Halloween"
    ],
    "mobile": false
  },
  {
    "id": "gm-netherton-volleyball",
    "name": "Netherton Volleyball",
    "url": "https://html5.gamemonetize.co/9kuz4crhnv4b36fvv51j5jg3n90f0nvn/",
    "description": "Tap on green, spike over the block, win the cup! Netherton Volleyball is a quick pixel-art volleyball game where you call the shots for a whole 6v6 team. Time your taps to serve, pass, dig and block, then pick your…",
    "tags": [
      "Sports",
      "1 Player",
      "Ball",
      "Management",
      "Mobile",
      "NoViolence"
    ],
    "mobile": true
  },
  {
    "id": "gm-sort-master-satisfeel-asmr",
    "name": "Sort Master Satisfeel ASMR",
    "url": "https://html5.gamemonetize.co/rxwlvvbj3tvj42wcvvbc8ut4mmoftt21/",
    "description": "Sort Master - Satisfeel ASMR is a relaxing puzzle game that combines item organization, satisfying sorting tasks, and calming ASMR moments. Arrange delicious foods, cabinets, and different objects into the correct…",
    "tags": [
      "Puzzle",
      "Food",
      "Girls",
      "Relaxation",
      "Sorting"
    ],
    "mobile": false
  },
  {
    "id": "gm-warehouse-tetris-3d",
    "name": "Warehouse Tetris 3D",
    "url": "https://html5.gamemonetize.co/qsi8cf6y9f0srcp91qqfc1s84jm99421/",
    "description": "Warehouse Tetris 3D is a relaxing 3D packing puzzle where you load boxes, crates, barrels, and cargo into warehouses, trucks, and shipping containers. Rotate pieces, plan every move, avoid empty gaps, and try to achieve…",
    "tags": [
      "Puzzle",
      "3D",
      "Cargo",
      "Logic",
      "Physics",
      "Relaxation"
    ],
    "mobile": false
  },
  {
    "id": "gm-bow-or-die",
    "name": "Bow or Die",
    "url": "https://html5.gamemonetize.co/ets0wzzui28672jjkkna7crhnyd1k8r9/",
    "description": "Test your archery reflexes in Bow or Die, a fast-paced physics survival action game! Step into the arena as a master archer where precision and split-second reaction are your only lifeline. Aim your bow, calculate arrow…",
    "tags": [
      "Stickman",
      "2026 games",
      "2D",
      "Action",
      "Arrow",
      "Attack"
    ],
    "mobile": false
  },
  {
    "id": "gm-glimmer",
    "name": "Glimmer",
    "url": "https://html5.gamemonetize.co/p7pltg6j7qidp662o7m483ub29w7wxa3/",
    "description": "Guide a tiny spark through a world swallowed by darkness. Master precise jumps, dashes and checkpoints as you relight lanterns and conquer challenging handcrafted stages. Travel across four themed chapters, learn new…",
    "tags": [
      "Arcade",
      "Adventure"
    ],
    "mobile": false
  },
  {
    "id": "gm-shaftbound",
    "name": "Shaftbound",
    "url": "https://html5.gamemonetize.co/of8yz42m8amsb74l8l436xixj4icaw3y/",
    "description": "Descend through perilous underground shafts in Shaftbound, a precision platform adventure built around skillful jumps and a versatile grappling hook. Swing through hazards, master your momentum, collect useful rewards…",
    "tags": [
      "Arcade",
      "Adventure"
    ],
    "mobile": false
  },
  {
    "id": "gm-formula-car-stunt",
    "name": "Formula Car Stunt",
    "url": "https://html5.gamemonetize.co/13dqamxbezsghe62csrq6gfm6w26bbwe/",
    "description": "Get ready for an adrenaline-filled adventure in Formula Car Stunt Game! Drive powerful formula racing cars across thrilling sky-high tracks, perform spectacular stunts, and master challenging roads above the clouds…",
    "tags": [
      "Adventure",
      "2026 games",
      "Action",
      "Best",
      "Car",
      "Race"
    ],
    "mobile": false
  },
  {
    "id": "gm-pocketgolf",
    "name": "PocketGolf",
    "url": "https://html5.gamemonetize.co/g4c6tzdd7tqjmdxobgv6l90gn49km2ek/",
    "description": "A minimalist golf challenge drawn in a hand-made paper style. Flick the tiny paper ball across doodle fairways, bounce off pencils and erasers, and sink the hole in as few strokes as possible. Easy to pick up, tricky to…",
    "tags": [
      "Sports",
      "1 Player",
      "Arcade",
      "Golf",
      "Hypercasual",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-skibidi-vent-jumper",
    "name": "Skibidi Vent Jumper",
    "url": "https://html5.gamemonetize.co/ngvzpif8dvzq12mkj1iqrzsfy519tzu2/",
    "description": "Skibidi Vent Jumper is a chaotic, stealthy creature lurking in bathroom air ducts. It springs out from hidden vents when least expected, surprising unsuspecting targets before flushing out of sight. Fast, unpredictable…",
    "tags": [
      "Arcade",
      "Action",
      "Impostor",
      "Skibidi Toilet",
      "Unity3D",
      "WebGL",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-ragdoll-survivor",
    "name": "Ragdoll Survivor",
    "url": "https://html5.gamemonetize.co/gu75czzfxkp613uaahbi6irpdwonsst8/",
    "description": "A stick fighter is stuck in the middle of a war zone and has to fight to stay alive. Punch, kick, block, dash and grab your way past enemy soldiers, knife fighters, riot shields and tanks, while bombs, rockets, saw…",
    "tags": [
      "Stickman",
      "Action",
      "Battle",
      "Boys",
      "Fighting",
      "Physics"
    ],
    "mobile": false
  },
  {
    "id": "gm-daddy-mouse",
    "name": "DADDY MOUSE",
    "url": "https://html5.gamemonetize.co/c2iqwzhfgj5bb6kgrqo6voyyzu86io7h/",
    "description": "Help a brave mouse collect cheese and return home to his family in this colorful 2D platform adventure. Explore forests, icy mountains, volcanic lands, the open sea, and dangerous castles. Jump over traps, discover…",
    "tags": [
      "Arcade",
      "1 Player",
      "2D",
      "Adventure",
      "Animal",
      "Collecting",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-slingshot-shooting-game",
    "name": "Slingshot Shooting Game",
    "url": "https://html5.gamemonetize.co/car6nw2dlaiezpwrsdo0e24j7kdrr75e/",
    "description": "Get ready for an exciting slingshot shooting adventure! Slingshot Shooting Game is a fun and challenging casual game where your aim, timing, and shooting skills are put to the test. Pull back the slingshot, adjust your…",
    "tags": [
      "Puzzle",
      "2026 games",
      "Adventure",
      "Amazing",
      "Best Games",
      "Casual"
    ],
    "mobile": false
  },
  {
    "id": "gm-thief-puzzle-long-hand-game",
    "name": "Thief Puzzle Long Hand Game",
    "url": "https://html5.gamemonetize.co/rb7724moywmovhl53eikr922l0xtm5ic/",
    "description": "Thief Puzzle Long Hand Game is a fun and challenging puzzle game where you control a thief with an incredibly long and flexible hand. Your mission is to carefully reach, grab, and steal the target objects while avoiding…",
    "tags": [
      "Puzzle",
      "2026 games",
      "Adventure",
      "Best Games",
      "Casual",
      "Hypercasual"
    ],
    "mobile": false
  },
  {
    "id": "gm-barbee-fashion-influencer",
    "name": "Barbee Fashion Influencer",
    "url": "https://html5.gamemonetize.co/7uigy2z76y5uv7njb5m9whfsgzhw2u0n/",
    "description": "Barbee Fashion Influencer is a fun and stylish dress-up game where fashion, creativity, and social-media-inspired trends come together. Help Barbee build the perfect influencer wardrobe by creating fashionable outfits…",
    "tags": [
      "Girls",
      "Barbie",
      "Dress Up",
      "Fashion"
    ],
    "mobile": false
  },
  {
    "id": "gm-euro-truck-parking",
    "name": "Euro Truck Parking",
    "url": "https://html5.gamemonetize.co/2kqz2682vdq33qp9rpptbolu4auchfig/",
    "description": "Euro Truck Parking is an exciting truck-driving and parking simulation game where players take control of powerful heavy-duty trucks and put their driving skills to the test. Navigate challenging parking areas, tight…",
    "tags": [
      "Racing",
      "1 Player",
      "Best Games",
      "City",
      "Driving",
      "Fun"
    ],
    "mobile": false
  },
  {
    "id": "gm-skyblock-3d",
    "name": "Skyblock 3D",
    "url": "https://html5.gamemonetize.co/pcbqefubxabh1tud8445n1nj2cvp8hgd/",
    "description": "Are you ready to survive on a small island floating high in the sky? Start your adventure with limited resources, collect blocks, create new areas, and gradually expand your island. Use your resources wisely, discover…",
    "tags": [
      "Adventure",
      "3D",
      "3D Games",
      "Arcade",
      "Block",
      "Mineblock"
    ],
    "mobile": false
  },
  {
    "id": "gm-screw-nuts-snap-puzzle",
    "name": "Screw Nuts Snap Puzzle",
    "url": "https://html5.gamemonetize.co/nzdwvo7grlaufccplox9l801kxwwsi0j/",
    "description": "Screw Nuts Snap Puzzle is a colorful puzzle game about matching screws and choosing the right order. Remove accessible screws from layered glass shapes and collect them in boxes of the same color. Each box holds three…",
    "tags": [
      "Puzzle",
      "1 Player",
      "2D",
      "Brain",
      "Logic",
      "Match 3",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-left-dead-last-convoy",
    "name": "Left Dead: Last Convoy",
    "url": "https://html5.gamemonetize.co/lbj0owzr70z8xjgxiewpnvatbbc8h2lc/",
    "description": "Help medic Tess keep Omar and the convoy alive across 23 stages in five campaign routes. Fight through city streets, carnival grounds, bayou paths, a storm and the final bridge. Aim your rifle, reload between threats…",
    "tags": [
      "Shooting",
      "1 Player",
      "2D",
      "Action",
      "Gun",
      "Survival"
    ],
    "mobile": false
  },
  {
    "id": "gm-cannon-shooter-game",
    "name": "Cannon Shooter Game",
    "url": "https://html5.gamemonetize.co/b6r0jaghcp3e4zu8rcg8wwgtsv9i4nll/",
    "description": "Get ready for an exciting and addictive cannon shooting adventure in Cannon Strike Fest: Smash Ball Puzzle Games! Aim your cannon, launch powerful balls, smash obstacles, and complete challenging puzzle levels filled…",
    "tags": [
      "Puzzle",
      "2026 games",
      "Best Games",
      "Block",
      "Casual",
      "Hypercasual"
    ],
    "mobile": false
  },
  {
    "id": "gm-storm-dash",
    "name": "Storm Dash",
    "url": "https://html5.gamemonetize.co/lpvw2669qu46qr82kwg363sackyftudv/",
    "description": "Run, jump and dash to escape the deadly storm! Explore colorful worlds, collect coins, upgrade your abilities and try to beat your distance record.",
    "tags": [
      "Hypercasual",
      "Casual",
      ".io",
      ".io Games",
      "1 Player",
      "2D"
    ],
    "mobile": false
  },
  {
    "id": "gm-spooky-racing",
    "name": "Spooky Racing",
    "url": "https://html5.gamemonetize.co/dy8qllef8ugerjkghfvjnv8fk07priu4/",
    "description": "Spooky Racing is a Halloween kart race in full 3D! Pick one of 8 classic monsters like Dracula, the Mummy, the Witch or Jack Pumpkin, each with a kart of their own. Race through pumpkin patches, haunted swamps, a neon…",
    "tags": [
      "Racing",
      "Halloween",
      "Kart",
      "Monster",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-signal-survival-block-arena",
    "name": "Signal Survival Block Arena",
    "url": "https://html5.gamemonetize.co/a8luvdbavzqe7w2z53sxim2050b40d92/",
    "description": "Enter a tense survival arena and race for the finish. Watch the sentinel, move only when it is safe, and avoid getting caught before time runs out. Choose from five stages, learn the timing, and guide your character…",
    "tags": [
      "Arcade",
      "3D",
      "Squidgame",
      "Survival"
    ],
    "mobile": false
  },
  {
    "id": "gm-stickman-bow-clash",
    "name": "Stickman Bow Clash",
    "url": "https://html5.gamemonetize.co/wngibx4vgc8ssxw714drc45wmfjccsis/",
    "description": "Stickman Bow Clash is the action-packed sequel to Stickman Archery Ragdoll! Grab your bow, take aim, and face off against rival stickmen in intense archery battles. Master your shots, use precise timing, and knock your…",
    "tags": [
      "Stickman",
      "1 Player",
      "Arcade",
      "Arena",
      "Arrow",
      "Arrows"
    ],
    "mobile": false
  },
  {
    "id": "gm-halloween-dentist-for-kids-2",
    "name": "Halloween Dentist For Kids 2",
    "url": "https://html5.gamemonetize.co/4jczt1e19q5etdr3uq7xqt4tqwmtqpbq/",
    "description": "Even monsters need a trip to the dentist! Welcome to a Halloween clinic packed with vampires, zombies, witches and other unusual patients. Choose from 18 colorful characters and give their teeth a much-needed clean…",
    "tags": [
      "Puzzle",
      "Halloween",
      "Mapi games",
      "Monster",
      "Simulation",
      "Zombie",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-sky-hop-3d",
    "name": "SKY HOP 3D",
    "url": "https://html5.gamemonetize.co/rybdf71x1az2dxx3f4rq5atbsdqeupcp/",
    "description": "Sky Jump – The Ultimate Sky Adventure! Get ready for an exciting 3D platformer adventure! Jump across floating islands, collect shiny coins, dodge tricky obstacles, and reach the top. Explore beautiful sky worlds, test…",
    "tags": [
      "Puzzle",
      "1 Player",
      "2026 games",
      "3D",
      "3D Games",
      "Adventure"
    ],
    "mobile": false
  },
  {
    "id": "gm-tank-push",
    "name": "Tank Push",
    "url": "https://html5.gamemonetize.co/rk80ikwz9g1j8z82vwoui9n9506t3ea6/",
    "description": "Tank Push is a strategic puzzle adventure where you guide a brave frog through a dangerous battlefield. Push tanks into the correct positions, unlock gates, avoid traps, and overcome enemy defenses to escape. Every…",
    "tags": [
      "Puzzle",
      "Classic",
      "Escape",
      "Fun",
      "Shoot",
      "Tank"
    ],
    "mobile": false
  },
  {
    "id": "gm-sniper-shooter-3d",
    "name": "Sniper Shooter 3D",
    "url": "https://html5.gamemonetize.co/erhoqcc54m5mzue7tuetqonzzti8e2s5/",
    "description": "Step into the role of an elite marksman in Sniper Shooter 3D! Take position on rooftops, locate dangerous criminals, aim carefully, and complete challenging sniper missions across the city.",
    "tags": [
      "Shooting",
      "3D",
      "Action",
      "Adventure",
      "Car",
      "Sniper"
    ],
    "mobile": false
  },
  {
    "id": "gm-bug-crunch",
    "name": "Bug Crunch",
    "url": "https://html5.gamemonetize.co/4d7vzurpurh38k1lv89lsvzb22pfmvuu/",
    "description": "Something is crawling across the picnic blanket, and you are the shoe. Drag to move your foot, tap for a quick stomp, hold for a ground-shaking SLAM. Squish fast to build a Splat Chain — the multiplier climbs to…",
    "tags": [
      "Arcade",
      "Action",
      "Destroy",
      "Food",
      "Kill",
      "Skill"
    ],
    "mobile": false
  },
  {
    "id": "gm-holdem-royale",
    "name": "Holdem Royale",
    "url": "https://html5.gamemonetize.co/nd7u25392lwj5lg0jdz5n7rxk86mdxl7/",
    "description": "Holdem Royale is Texas Holdem poker with real players, live. Pull up a chair in a Wild West saloon, buy in, and outplay the table. Every player at the table buys in for the same amount, so everyone starts even. Quiet…",
    "tags": [
      "Hypercasual",
      "Casual",
      "Card",
      "Multiplayer",
      "Poker"
    ],
    "mobile": false
  },
  {
    "id": "gm-zaruvane-the-amber-oasis",
    "name": "ZARUVANE THE AMBER OASIS",
    "url": "https://html5.gamemonetize.co/s6qs5tqilps9s0d7eahvus3imprgoyzm/",
    "description": "Explore a vast desert and build your own oasis. Gather resources, manage food and water, welcome travelers to your taverns, and care for animal companions through changing days and sandstorms.",
    "tags": [
      "Arcade",
      "3D Games",
      "Adventure",
      "Ai Games",
      "Animal",
      "Best Games"
    ],
    "mobile": false
  },
  {
    "id": "gm-bubble-rush",
    "name": "Bubble Rush",
    "url": "https://html5.gamemonetize.co/tpvwajn0ltqze0wy9iht2z6vmde5v34s/",
    "description": "Aim from the center and pop colorful bubbles in Bubble Rush. Match bubbles of the same color, plan each shot, and clear the board. Enjoy quick puzzle rounds with simple mouse and touch controls. Use bonus options to…",
    "tags": [
      "Puzzle",
      "1 Player",
      "2D",
      "Bubble",
      "Bubble Shooter"
    ],
    "mobile": false
  },
  {
    "id": "gm-octobeer",
    "name": "Octobeer",
    "url": "https://html5.gamemonetize.co/asq3pxjaf2225q28pt8ak06v4ftipphj/",
    "description": "Welcome to Octobeer! Youre the festivals best server, and the sky is full of thirsty guests. Hold to charge, slide to aim and release to throw a beer - every guest you serve pays you coins. Each Run lasts five waves…",
    "tags": [
      "Shooting",
      "Arcade",
      "Casual",
      "Skill"
    ],
    "mobile": false
  },
  {
    "id": "gm-cake-sort",
    "name": "Cake Sort",
    "url": "https://html5.gamemonetize.co/m0q6x9n1skcwmch38u34lt3irsiru58h/",
    "description": "Sort colorful cake slices to assemble whole desserts on a 4x4 grid. Enjoy relaxing clay-style 3D visuals, expanding flavors, tricky boards, and daily rewards!",
    "tags": [
      "Puzzle",
      "Cake",
      "Relaxation",
      "Sort",
      "Sorting"
    ],
    "mobile": false
  },
  {
    "id": "gm-referee-simulator-3d",
    "name": "Referee Simulator 3D",
    "url": "https://html5.gamemonetize.co/lrumrmdb3jvavy1l4w3yolxahq87x7wh/",
    "description": "Referee Simulator 3D puts the whistle in your hands. Run with play, stay close to the action and make the calls that decide the match: foul or clean tackle, penalty or free kick, offside or goal, yellow or red card. Not…",
    "tags": [
      "Sports",
      "3D",
      "Football",
      "Simulation",
      "Simulator",
      "Soccer"
    ],
    "mobile": false
  },
  {
    "id": "gm-shooter-outbreak-protocol",
    "name": "Shooter: Outbreak Protocol",
    "url": "https://html5.gamemonetize.co/xk4x00kobgkeeum7lpl8kaf4tx4fe2p9/",
    "description": "Shooter: Outbreak Protocol is a free online zombie shooting game featuring three maps and six weapons. Battle waves of undead across Raccoon City, a police station, and an Umbrella laboratory. Earn cash, unlock weapons…",
    "tags": [
      "Shooting",
      "CSGO",
      "First Person Shooter",
      "Shoot",
      "Shoot 'Em Up",
      "Shooter"
    ],
    "mobile": false
  },
  {
    "id": "gm-midnight-taxi-hustle",
    "name": "Midnight Taxi Hustle",
    "url": "https://html5.gamemonetize.co/yguyvscbqi3uz3ed24u7dkv3lcqkoqsn/",
    "description": "Navigate neon-lit streets in Midnight Taxi Hustle, a thrilling arcade driving game. Pick up eccentric passengers, beat the clock through heavy gridlock traffic, and upgrade your ride. Master the urban sprawl, dodge city…",
    "tags": [
      "Arcade",
      "Adventure",
      "Car",
      "Driving",
      "Racing",
      "Taxi"
    ],
    "mobile": false
  },
  {
    "id": "gm-catchfish-fishing-master",
    "name": "CatchFish — Fishing Master",
    "url": "https://html5.gamemonetize.co/t1ptdcnhy464c3bf505hck6hulsmrcd1/",
    "description": "CatchFish is a free arcade fishing game. Blast schools of fish with mighty cannons, hunt huge bosses, and upgrade your arsenal from a single barrel to devastating multi-shot weapons. Mode & Levels: &bull; Level…",
    "tags": [
      "Shooting",
      "Arcade",
      "Casual",
      "Fish",
      "Fishing",
      "Shooter"
    ],
    "mobile": false
  },
  {
    "id": "gm-halloween-football-championship",
    "name": "Halloween Football Championship",
    "url": "https://html5.gamemonetize.co/vd79gg8lfqhvmmeraa677cbugdip3n9d/",
    "description": "Halloween Football Championship is a supernatural 3D soccer showdown! Lead zombies, vampires, witches, or skeletons in fast-paced 5v5 matches. Outsmart defenders with quick dodges, clever passes, and unique monster…",
    "tags": [
      "Sports",
      "1 Player",
      "Action",
      "Halloween",
      "Zombie"
    ],
    "mobile": false
  },
  {
    "id": "gm-mega-noob-sky-obby-50-stages",
    "name": "Mega Noob Sky Obby: 50 Stages",
    "url": "https://html5.gamemonetize.co/ms442gjva934142xlu33vu50lwseyryb/",
    "description": "Dash, jump, and balance your way through a massive colorful sky parkour! In this 3D platformer adventure, your mission is to guide your Noob through 50 unique stages filled with moving obstacles, winding spirals, and…",
    "tags": [
      "Adventure",
      "1 Player",
      "2026 games",
      "3D Games",
      "Action",
      "Best",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-goblox-grow-your-empire",
    "name": "GOBLOX: Grow Your Empire",
    "url": "https://html5.gamemonetize.co/4uy0ezltbjqmyhtpsq5wfup9ay606pl1/",
    "description": "Welcome to Sunberry Valley! Restore a forgotten garden and grow it into the greatest farming empire in the land. Plant seeds, harvest crops and sell them for coins. Then reinvest in rarer seeds, bigger plots and new…",
    "tags": [
      "Adventure",
      "1 Player",
      "Minecraft",
      "Roblox"
    ],
    "mobile": false
  },
  {
    "id": "gm-noob-save-the-village",
    "name": "Noob save the village",
    "url": "https://html5.gamemonetize.co/iqte67jtuwol73djk1slm4x59wqrp86y/",
    "description": "Upgrade your weapons, unlock powerful spells and abilities to stop the invasion of enemies. Build defenses, improve your skills and become the last hope of the village !",
    "tags": [
      "Adventure",
      "1 Player",
      "Minecraft",
      "Zombie"
    ],
    "mobile": false
  },
  {
    "id": "gm-wall-rush-3d",
    "name": "Wall Rush 3D",
    "url": "https://html5.gamemonetize.co/gexwkjm7xx0j31mszg9maox0z45822e0/",
    "description": "Run as fast as wind and race against all best runner in the world. Leap from buildings and vault over wall. Only the 1st winner can reach to the top of victory.",
    "tags": [
      "Racing",
      "1 Player",
      "Action",
      "Boy",
      "Boys",
      "Casual"
    ],
    "mobile": false
  },
  {
    "id": "gm-obby-highest-jump-ever",
    "name": "Obby Highest Jump Ever",
    "url": "https://html5.gamemonetize.co/013okql8w85qvv4ryz32yhm2g7oj523m/",
    "description": "Obby Highest Jump Ever is a click-based jumping and climbing game where every click makes you stronger. Start from a small 10M building and push your way up to massive 2500M towers as your jump power grows step by step…",
    "tags": [
      "Arcade",
      "2 Player",
      "2 Player Games",
      "Clicker",
      "Roblox",
      "Running"
    ],
    "mobile": false
  },
  {
    "id": "gm-curve-free-kick",
    "name": "Curve Free Kick",
    "url": "https://html5.gamemonetize.co/cqc4yfi4ntkoiojaw96r7g0zds1v1nwe/",
    "description": "Curve Free Kick is a 3D free kick game with realistic ball physics. Move your player behind the ball and choose your run-up: the wider the angle, the more the ball curves, and the longer the run-up, the harder the shot…",
    "tags": [
      "Sports",
      "3D",
      "Ball",
      "Football",
      "Shoot",
      "Soccer"
    ],
    "mobile": false
  },
  {
    "id": "gm-lumen-descent",
    "name": "Lumen Descent",
    "url": "https://html5.gamemonetize.co/m9lqrfb4794vvyj8eq23xjm4ha92znfv/",
    "description": "Lumen Descent is a cinematic precision platformer set in a forgotten tower. Carry your light through 12 dangerous floors, master difficult jumps, dash past hazards, activate checkpoints and descend into the unknown…",
    "tags": [
      "Arcade",
      "Adventure"
    ],
    "mobile": false
  },
  {
    "id": "gm-swarmfront",
    "name": "Swarmfront",
    "url": "https://html5.gamemonetize.co/f5y881iv8odmh0fnpx0gau7rzheiqvhn/",
    "description": "Lead an expanding medieval army through five changing biomes in Swarmfront. Steer your squad into recruitment gates, avoid dangerous obstacles, pick strategic upgrades and overcome increasingly formidable bosses. Every…",
    "tags": [
      "Arcade",
      "Action"
    ],
    "mobile": false
  },
  {
    "id": "gm-scary-granny-horror-maze-escape",
    "name": "Scary Granny: Horror Maze Escape",
    "url": "https://html5.gamemonetize.co/ee7ik5yvf7aie3c1cl7fmxn9pgfknagt/",
    "description": "Enter the terrifying maze and try to escape before Granny finds you! Scary Granny: Horror Maze Escape is a thrilling horror adventure where every corner can hide danger. Explore creepy corridors, search for the way out…",
    "tags": [
      "Arcade",
      "1 Player",
      "2026 games",
      "Amazing",
      "Casual",
      "Escape"
    ],
    "mobile": false
  },
  {
    "id": "gm-blockland-oneblock-skyblock",
    "name": "Blockland Oneblock Skyblock",
    "url": "https://html5.gamemonetize.co/2c6fkw9q7vfr9nyif0pk5kgaacxvlxve/",
    "description": "Are you ready for an adventure that starts with a small island and a single block in the sky? In OneBlock Skyblock, use your resources wisely to expand your island, discover new resources, and build your own world. As…",
    "tags": [
      "Adventure",
      "Block",
      "Blocky",
      "Mine",
      "Mineblock",
      "Minecraft"
    ],
    "mobile": false
  },
  {
    "id": "gm-boo-brew",
    "name": "Boo Brew",
    "url": "https://html5.gamemonetize.co/xd5tjrwwkzmiu5guwpmrsq3ujqecl4k6/",
    "description": "Run a magical Halloween potion caf&eacute; in manga style! Match ingredients, stir enchanted brews and serve charming monster customers before their patience runs out. Master 12 midnight shifts, build combos, trigger…",
    "tags": [
      "Puzzle",
      "2D",
      "Cooking",
      "Halloween",
      "Magic",
      "Mapi games",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-category-match-puzzle",
    "name": "Category Match Puzzle",
    "url": "https://html5.gamemonetize.co/hdjnpi8fq7ttz5xvpxvqxwqfsp5abknl/",
    "description": "Category Match Puzzle is a vibrant, fun sorting game for all ages. Observe scrambled picture tiles, match items into correct categories—like toys, food, and weather—and clear the board to sharpen your brain and relax!",
    "tags": [
      "Puzzle",
      "Arcade",
      "Brain",
      "Logic",
      "Matching"
    ],
    "mobile": false
  },
  {
    "id": "gm-mahjong-master-tile-sort-and-match",
    "name": "mahjong master tile sort and match",
    "url": "https://html5.gamemonetize.co/ky6687furpi1wg13qplkwotrf7nryuhb/",
    "description": "Mahjong Master is a classic tile-matching puzzle game. Match identical mahjong tiles in pairs to clear the board across hundreds of challenging levels. Enjoy beautiful Japanese-style scenery, soothing music, and smart…",
    "tags": [
      "Puzzle",
      "Matching"
    ],
    "mobile": false
  },
  {
    "id": "gm-funny-gummy-characters",
    "name": "Funny Gummy Characters",
    "url": "https://html5.gamemonetize.co/szinh5i636m3o3euuz0at9y14w024q94/",
    "description": "Get ready for some crazy, wobbly fun in Funny Gummy Characters! Grab your favorite funny characters and stretch, pull, squash, and twist them into the most hilarious shapes imaginable! Watch their faces and bodies…",
    "tags": [
      "Boys",
      "Arcade",
      "Celebrity",
      "Fun",
      "Funny",
      "Hypercasual",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-impostor-dominion",
    "name": "Impostor Dominion",
    "url": "https://html5.gamemonetize.co/fkmw3px4aq50owrb1v1ipjkla8413krz/",
    "description": "Upgrade your towers, outsmart tricky enemies, and claim every stronghold on the battlefield! Strategy meets intense conquest in Impostor Dominion—deploy troops, capture rival outposts, and expand your territory until…",
    "tags": [
      "Arcade",
      "Adventure",
      "Castle",
      "Fighting",
      "Impostor",
      "Unity3D"
    ],
    "mobile": false
  },
  {
    "id": "gm-draw-to-help",
    "name": "Draw to Help",
    "url": "https://html5.gamemonetize.co/qd5p77bvsyubd2b3cu475u6rqkesl1ct/",
    "description": "What would you draw to help a hungry dog or a cat caught in the rain? Draw to Help is a fun puzzle game where every picture tells a little story. Figure out whats missing, draw the solution with your finger, and watch…",
    "tags": [
      "Puzzle",
      "Draw",
      "Drawing",
      "Fun"
    ],
    "mobile": false
  },
  {
    "id": "gm-egg-wars-battle-arena-3d",
    "name": "Egg Wars Battle Arena 3D",
    "url": "https://html5.gamemonetize.co/yfufqb69t4i85cnw5azcee4sbpc3p79s/",
    "description": "Enter the ultimate egg battle arena! Protect your precious egg, collect resources, upgrade your equipment, and fight against rival teams in intense 3D battles. Destroy enemy eggs to prevent opponents from respawning and…",
    "tags": [
      "Action",
      "1 Player",
      "3D",
      "3D Games",
      "Adventure",
      "Arcade"
    ],
    "mobile": false
  },
  {
    "id": "gm-pixel-jam-bus-puzzle",
    "name": "Pixel Jam Bus Puzzle",
    "url": "https://html5.gamemonetize.co/abldvggwnz8cml29k77bajnuvahr8qdo/",
    "description": "Pixel Jam Bus Puzzle is a colorful sorting puzzle where tiny passengers form playful pixel pictures. Send vehicles into limited parking spaces, match their colors to waiting passengers, and clear each picture. Plan your…",
    "tags": [
      "Puzzle"
    ],
    "mobile": false
  },
  {
    "id": "gm-ricopop",
    "name": "RICOPOP",
    "url": "https://html5.gamemonetize.co/r7pvlcw3rl9gtwx19j6n618qqf3rxaxo/",
    "description": "RICOPOP is a neon ricochet arcade puzzle. Aim a volley, bounce balls off walls and shatter every crystal in as few shots as possible. Build chain reactions, charge the Pulse and chase three stars across 50 levels in 10…",
    "tags": [
      "Puzzle",
      "Ball",
      "Bounce",
      "Mobile",
      "Physics"
    ],
    "mobile": true
  },
  {
    "id": "gm-try-again",
    "name": "Try Again",
    "url": "https://html5.gamemonetize.co/4th3ctan31u96moxhnphksvyodbr11dd/",
    "description": "Try Again is a tricky physics platformer. Roll your ball through 70 levels that fight back: floors that vanish, traps that wait for the perfect moment, and levels that behave differently on every attempt. Every death…",
    "tags": [
      "Puzzle",
      "2D",
      "Ball",
      "Casual",
      "Funny",
      "Jumping",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-pushplush",
    "name": "PushPlush",
    "url": "https://html5.gamemonetize.co/gic9w0nqx79mazjrsiiyqpskw9low912/",
    "description": "Meet the fluffiest puzzle challenge! Slide entire rows and columns to match three or more creatures of the same color. Create bombs, unlock trapped fluffies, and discover giant 2x2 characters. Complete 50 levels, solve…",
    "tags": [
      "Puzzle",
      "1 Player",
      "Funny",
      "Logic",
      "Logical",
      "Match 3",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-ramp-rider-mega-bike-racing",
    "name": "Ramp Rider Mega Bike Racing",
    "url": "https://html5.gamemonetize.co/arvm2jzw8ylp05axwu6vccfynp239otc/",
    "description": "Get ready for thrilling motorcycle racing in Ramp Rider Mega Bike Racing! Ride powerful bikes, conquer giant mega ramps, perform amazing jumps, and overcome challenging obstacles. Race across exciting 3D stunt tracks…",
    "tags": [
      "Sports",
      "Bike",
      "Race",
      "Racing",
      "Simulation",
      "Stunts"
    ],
    "mobile": false
  },
  {
    "id": "gm-dinos-rush",
    "name": "Dinos Rush",
    "url": "https://html5.gamemonetize.co/jva1zv58ct2z5pkxw3mvbblacn83nk65/",
    "description": "Dino Rush is a colorful and addictive platform adventure where every level brings a new challenge! Run, jump, and fight your way through exciting worlds filled with dangerous obstacles, tricky platforms, enemies, and…",
    "tags": [
      "Action",
      "2D",
      "Arcade",
      "Dinosaur",
      "Jumping"
    ],
    "mobile": false
  },
  {
    "id": "gm-open-rings",
    "name": "Open Rings",
    "url": "https://html5.gamemonetize.co/ji6mqwfgw7bw6ct081n6zcn4gnwqaemc/",
    "description": "Open Rings is a relaxing ring puzzle about freeing gems. Every level is a tangle of faceted rings, sliding bars and little locks. Turn a ring, pull a bar and slip each piece off the board without letting anything…",
    "tags": [
      "Puzzle",
      "2D",
      "Brain",
      "Logic",
      "Relaxation",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-muscle-rush-3d",
    "name": "Muscle Rush 3D",
    "url": "https://html5.gamemonetize.co/tpj7kvupr0rlgkdtbj8lm9ge6cxxrvno/",
    "description": "Muscle Run is a fast-paced runner where every choice makes you stronger—or weaker! Race through colorful tracks, choose the best multiplier gates, collect protein and avoid junk food. Train at gym stations, lift…",
    "tags": [
      "Hypercasual",
      "Casual",
      "Run",
      "Sports"
    ],
    "mobile": false
  },
  {
    "id": "gm-double-boy-jump",
    "name": "Double Boy Jump",
    "url": "https://html5.gamemonetize.co/htv574y927omensue8mm49juebyan7z1/",
    "description": "Guide two rope-linked heroes across tricky platforms in Double Boy Jump Press and hold to jump then release at the right moment to land safely and switch between the partners. Keep both characters out of danger as you…",
    "tags": [
      "Arcade",
      "Jumping",
      "Platform",
      "Skill",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-pedro-double-cross",
    "name": "Pedro: Double Cross",
    "url": "https://html5.gamemonetize.co/ktwi7fg2nrapjv2ghfvowmdyb6n84hir/",
    "description": "Run the rooftops and expose a hidden manifest in Pedro: Double Cross, a 2D action shooter starring dual-pistol agent Noor. Explore forty connected scenes, clear each room to open its exit, and improvise with reflective…",
    "tags": [
      "Shooting",
      "1 Player",
      "2D",
      "Action",
      "Adventure",
      "Gun"
    ],
    "mobile": false
  },
  {
    "id": "gm-chicken-escape",
    "name": "Chicken Escape",
    "url": "https://html5.gamemonetize.co/d89z6jl1c9aqyt6ajc0idpf0nsc0mvi7/",
    "description": "Chicken Escape is a 3D stealth puzzle on a colorful farm. Play as a clever chicken planning a daring escape through yards, barns and fences guarded by patrolling dogs. Your main trick is the cardboard box disguise: hide…",
    "tags": [
      "Puzzle",
      "3D",
      "3D Games",
      "Animal",
      "Chicken",
      "Escape",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-paint-quest-kiddo",
    "name": "Paint Quest Kiddo",
    "url": "https://html5.gamemonetize.co/xr2kw4jncl2hdrlmx4iofdy5sp204ezb/",
    "description": "Paint Quest: Kiddo! is a fun and colorful online coloring game for kids where creativity knows no limits! Pick your favorite colors, grab your virtual crayons, and bring adorable black-and-white drawings to life. Enjoy…",
    "tags": [
      "Girls",
      "Color",
      "Coloring",
      "Educational",
      "Fun",
      "Hypercasual",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-spooky-vending-machine-2",
    "name": "Spooky Vending Machine 2",
    "url": "https://html5.gamemonetize.co/sqgn5sbdcd658wmtwjy293c7bo7t1jon/",
    "description": "Pick an item, enter its code, and collect your Halloween treat! Spooky Vending Machine 2 is packed with cute monster toys, colorful candy, and delightfully creepy snacks. Browse the shelves, enter the code for your…",
    "tags": [
      "Puzzle",
      "Brain",
      "Halloween",
      "Machine",
      "Mapi games",
      "Monster",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-beep-out",
    "name": "BEEP OUT",
    "url": "https://html5.gamemonetize.co/0rxkpgbp7onesdfeqpnrus1fmq5eazch/",
    "description": "Untangle a colorful toy-town traffic jam in BEEP OUT! Tap each car to send it in the direction of its roof arrow, clear blocked lanes, and pick the right order to free the board. Across 30 levels, match vehicles with…",
    "tags": [
      "Puzzle",
      "1 Player",
      "Car",
      "Logic",
      "Parking",
      "Traffic"
    ],
    "mobile": false
  },
  {
    "id": "gm-mechaspider-cyber-strike",
    "name": "MechaSpider: Cyber Strike",
    "url": "https://html5.gamemonetize.co/fc8akuyoy8yfcchz5ah68klc0it8jlrw/",
    "description": "MechaSpider: Cyber Strike drops players into futuristic urban warzones piloting a high-tech arachnid lethal weapon. Wall-crawl across skyscrapers, deploy energy webs, and unleash high-caliber artillery. Master agile…",
    "tags": [
      "Arcade",
      "Adventure",
      "Fighting",
      "Monster",
      "Robot",
      "Superhero"
    ],
    "mobile": false
  },
  {
    "id": "gm-deadshift-halloween-night",
    "name": "Deadshift Halloween Night",
    "url": "https://html5.gamemonetize.co/k8uclhrs5v0iabain71nu7etewdqtz7z/",
    "description": "The dead own the night. Take back the streets. DEADSHIFT: Halloween is a 3D zombie-driving game with 20 missions in a quarantined arena. Smash through the horde, collect supplies, rescue survivors, and race to…",
    "tags": [
      "Racing",
      "Car",
      "Cartoon",
      "Halloween",
      "Hook",
      "Zombie"
    ],
    "mobile": false
  },
  {
    "id": "gm-stickman-kombat-2d",
    "name": "stickman kombat 2d",
    "url": "https://html5.gamemonetize.co/tq1a8h39i13lpvk6wm6oeuigljmorjjr/",
    "description": "Stickman Kombat 2D is a fast-paced fighting game where you battle stickman warriors in intense 1v1 arena combat. Choose your fighter and master punch, kick, and special attack combos to knock out your opponent. Fight…",
    "tags": [
      "Boys",
      "Fighting",
      "Stickman"
    ],
    "mobile": false
  },
  {
    "id": "gm-fragbyte",
    "name": "FRAGBYTE",
    "url": "https://html5.gamemonetize.co/liqjxfwa1u3mu6xz8y3igg8l8eug6yoy/",
    "description": "FRAGBYTE is a fast-paced 3D first-person wave survival shooter that runs right in your browser. No downloads, 100% free. MODE: Offline single-player. Survive endless waves of enemies inside a hand-drawn ink arena. There…",
    "tags": [
      "Shooting",
      "3D",
      "Arena",
      "First Person Shooter",
      "Fps",
      "Shooter"
    ],
    "mobile": false
  },
  {
    "id": "gm-ironwake-tank-combat",
    "name": "IRONWAKE: Tank Combat",
    "url": "https://html5.gamemonetize.co/uwucxieotni7lpxfgha1mzigh0xgzc1z/",
    "description": "Take command of a customizable battle tank in 10 action-packed missions. Ambush enemy convoys, capture uplinks, defend a relay, escort an evacuation vehicle, recover classified intel, and escape devastating artillery…",
    "tags": [
      "Adventure",
      "1 Player",
      "Shoot 'Em Up",
      "Tank",
      "War"
    ],
    "mobile": false
  },
  {
    "id": "gm-pro-football-eleven-2027",
    "name": "Pro Football Eleven 2027",
    "url": "https://html5.gamemonetize.co/nsvqmdi6fps4dvi4a2n3yvnnvnq73ost/",
    "description": "Pro Football Eleven 2027 is a 3D football game by BREYMANTECH, played at full eleven-a-side inside the packed, floodlit Breymantech Arena. Pick from 10 European and American clubs and play with assisted controls: pass…",
    "tags": [
      "Sports",
      "Ball",
      "Car",
      "Football",
      "Rocket",
      "Soccer"
    ],
    "mobile": false
  },
  {
    "id": "gm-shadow-fist-kung-fu",
    "name": "Shadow Fist Kung Fu",
    "url": "https://html5.gamemonetize.co/sedaehnjgi1ocu5sh27z5ue5kbz6b5iv/",
    "description": "Shadow Fist is a fast-paced kung fu stickman beat 'em up. You play Kai, the last disciple of Master Lin, and you must take back the stolen Dragon Scroll from the Black Lotus clan. Fight through buildings floor by floor…",
    "tags": [
      "Action",
      "1 Player",
      "2026 games",
      "2D",
      "3D Games",
      "Attack",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-warehouse-wobble-3d",
    "name": "Warehouse Wobble 3D",
    "url": "https://html5.gamemonetize.co/sk63o0n5p8u6da2hhppi3hhnxu8kcz9s/",
    "description": "Drive a forklift, balance wobbly loads and deliver them in one piece! In Warehouse Wobble 3D you pick up towering stacks of boxes, fragile TVs, rolling barrels, a very heavy safe - and yes, a piano - and drive them…",
    "tags": [
      "Racing",
      "3D",
      "3D Games",
      "Cargo",
      "Casual",
      "Driving",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-tactical-response-team",
    "name": "Tactical Response Team",
    "url": "https://html5.gamemonetize.co/b9k5ugnz2h9q9e0vhvpu8srtsnuk1g7k/",
    "description": "In Tactical Response Team, step into the boots of an elite marksman where every shot counts. Zoom in to neutralize high-value targets, provide long-range precision support, and suppress hostile forces before they…",
    "tags": [
      "Shooting",
      "Arcade",
      "First Person Shooter",
      "Military",
      "Shoot",
      "Sniper"
    ],
    "mobile": false
  },
  {
    "id": "gm-people-blaster",
    "name": "People Blaster",
    "url": "https://html5.gamemonetize.co/ebnq54fc336mgcz8uifwrqdvl85w3yaw/",
    "description": "Crowd Gun 3D is a fast-paced runner where you recruit stickmen along the track to transform them into powerful weapons. Pass through multipliers, dodge deadly city obstacles, and unleash a barrage of gunfire to blast…",
    "tags": [
      "Boys",
      "3D",
      "Arcade",
      "Best Games"
    ],
    "mobile": false
  },
  {
    "id": "gm-taiga-expedition",
    "name": "Taiga: Expedition",
    "url": "https://html5.gamemonetize.co/bag65yz4nx78753zj10usnrz143g6ore/",
    "description": "Taiga: Expedition is a cozy 3D physics offroad delivery simulator. Drive vintage trucks through mud, deep fords and forest forks of the wild taiga and deliver logs and cargo to the sawmill. Your truck bed carries living…",
    "tags": [
      "Racing",
      "3D",
      "3D Games",
      "Cargo",
      "Driving",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-terminal-nine",
    "name": "Terminal Nine",
    "url": "https://html5.gamemonetize.co/p4cls1o5i8n3s3nkujt0p9ckkyrril2v/",
    "description": "Explore three industrial districts in a third-person stealth game. Avoid patrols, complete objectives and reach extraction across nine operations. Use crouching, physical cover and decoys to stay undetected. Earn…",
    "tags": [
      "Adventure",
      "3D"
    ],
    "mobile": false
  },
  {
    "id": "gm-witchy",
    "name": "Witchy",
    "url": "https://html5.gamemonetize.co/n46lz9ttk9nufqljp68pjwxgc6tsvk7p/",
    "description": "Fly with Witchy and her black cat through four magical worlds! Defeat monster waves and powerful bosses, upgrade your spells and unleash magic bombs. Recover 10 stolen amulets and save Halloween!",
    "tags": [
      "Shooting",
      "Arcade",
      "Cat",
      "Flight",
      "Halloween",
      "Mapi games"
    ],
    "mobile": false
  },
  {
    "id": "gm-shooter-tactical-strike",
    "name": "Shooter Tactical Strike",
    "url": "https://html5.gamemonetize.co/ydkvtj1zb81jhbsdjibq5mrbnvvxrqf5/",
    "description": "Play Shooter: Tactical Strike, a free online 3D FPS game featuring intense tactical combat, realistic weapons, enemy battles, and fast-paced shooting action. Aim, shoot, upgrade your weapons, and survive challenging…",
    "tags": [
      "Shooting",
      "3D",
      "3D Games",
      "CSGO",
      "First Person Shooter",
      "Fps"
    ],
    "mobile": false
  },
  {
    "id": "gm-bucket-sort-3d",
    "name": "Bucket Sort 3D",
    "url": "https://html5.gamemonetize.co/8hexdy7qsbrllhisy3qgh4rcg9e4un6h/",
    "description": "Get Ready for the Ultimate Color-Sorting Adventure! Body Welcome to Sand Jam: Truck Sort, where creativity meets logic! If you love satisfying puzzles and brain-teasing challenges, this is the game for you. At the top…",
    "tags": [
      "Puzzle",
      ".io",
      ".io Games",
      "1 Player",
      "2026 games",
      "Monstertruck"
    ],
    "mobile": false
  },
  {
    "id": "gm-steal-my-egg",
    "name": "Steal My Egg",
    "url": "https://html5.gamemonetize.co/435daxjh2ot0g94cxx3oxpqk357eu2wc/",
    "description": "Sneak in, grab the egg, outrun the guardian! Raid 25 wild worlds, steal rare eggs from giant guardians and run home before they catch you. Hatch 200 collectible pets, grow your garden, fight off rival thieves and unlock…",
    "tags": [
      "Hypercasual",
      "Casual",
      ".io",
      ".io Games",
      "1 Player",
      "3D"
    ],
    "mobile": false
  },
  {
    "id": "gm-cake-stack",
    "name": "Cake Stack",
    "url": "https://html5.gamemonetize.co/as1m0vqqgd469nkymknac70ki6k8icgq/",
    "description": "Cake Stack is a fun and addictive hyper-casual game! Guide your cute yellow character as it runs along the track and stacks delicious layers of cake. Tap or click to play: dodge obstacles, collect golden coins and build…",
    "tags": [
      "Hypercasual",
      "Casual",
      "Arcade"
    ],
    "mobile": false
  },
  {
    "id": "gm-apex-combat",
    "name": "Apex Combat",
    "url": "https://html5.gamemonetize.co/wsaqumyio6xu2ah2h6rf34nlbiqsceey/",
    "description": "Apex Combat is a fast-paced 2.5D arcade beat em up. Battle through hordes of cybernetic enemies in futuristic cyberpunk environments. Master devastating combos, unleash special abilities, and team up with friends in…",
    "tags": [
      "Arcade",
      "3D",
      "Action",
      "Amazing",
      "Street Fighting"
    ],
    "mobile": false
  },
  {
    "id": "gm-super-chop-forest-hero",
    "name": "Super Chop: Forest Hero",
    "url": "https://html5.gamemonetize.co/3upalp17wivdlvvxawpjpnjpkz5gcgla/",
    "description": "Pull the Hero Axe out of the old stump and become the mightiest lumberjack in the forest! Chop trees, fill your backpack with logs and fly them to the truck to sell for coins. Buy stronger tools, from Twin Axes and…",
    "tags": [
      "Multiplayer",
      "3D",
      "Action",
      "Adventure",
      "Animal",
      "Forest"
    ],
    "mobile": false
  },
  {
    "id": "gm-sniper-for-brainrot",
    "name": "Sniper for Brainrot",
    "url": "https://html5.gamemonetize.co/j53hlgv0yydix86dgma96jh7kr2evypk/",
    "description": "Use your sniper rifle to hit the balloon above a Brainrot, instantly transform into it, and race to the Safe Zone before a massive tsunami catches you. The farther you shoot, the rarer the Brainrot you can collect but…",
    "tags": [
      "Shooting",
      "2 Player",
      "2 Player Games",
      "Brainrot",
      "Roblox",
      "Sniper"
    ],
    "mobile": false
  },
  {
    "id": "gm-final-fight-harbor-justice",
    "name": "Final Fight: Harbor Justice",
    "url": "https://html5.gamemonetize.co/9kql6y7b3wqm92q3rnjnqxhegkx6ur95/",
    "description": "Take back the waterfront in Final Fight: Harbor Justice, an arcade-style 2D brawler with two playable fighters. Choose powerful Nessa or quick-footed Ivo, explore the docks and city blocks, and face patrols with…",
    "tags": [
      "Arcade",
      "1 Player",
      "2D",
      "Action",
      "Brawl",
      "Fighting"
    ],
    "mobile": false
  },
  {
    "id": "gm-holecraft-io",
    "name": "Holecraft.io",
    "url": "https://html5.gamemonetize.co/qzsu1s01rjo5hcm1jznanjq8hed94fyo/",
    "description": "Enter a chaotic block-eating adventure where size is everything! Control a hungry black hole, move around the map, and swallow blocks, objects, and structures to grow larger. Start small and consume everything you can…",
    "tags": [
      "Hypercasual",
      "Casual",
      "3D",
      "3D Games",
      "Arcade"
    ],
    "mobile": false
  },
  {
    "id": "gm-sniper-silent-ridge",
    "name": "Sniper: Silent Ridge",
    "url": "https://html5.gamemonetize.co/v0manua5ejcnt7z039lonn81a3d09qkw/",
    "description": "Eliminate every hostile. Aim for the head for a bonus. The small scope pip predicts wind and bullet drop at the displayed range. Space, click or tap Skip to shorten the bullet camera. Fuel drums damage nearby guards…",
    "tags": [
      "Shooting",
      "First Person Shooter",
      "Shoot",
      "Shoot 'Em Up",
      "Shooter",
      "Sniper"
    ],
    "mobile": false
  },
  {
    "id": "gm-dressup-wheel",
    "name": "Dressup Wheel",
    "url": "https://html5.gamemonetize.co/8i5ws4pgvhwoz1scbxchtrxhqe78cd0a/",
    "description": "Spin the wheel to answer style questions, create four unique outfits with matching jewelry and accessories, and dress up your fashion doll for any event!",
    "tags": [
      "Hypercasual",
      "Casual",
      "Beauty",
      "Dress Up",
      "Fashion",
      "Girl"
    ],
    "mobile": false
  },
  {
    "id": "gm-2244-number-match",
    "name": "2244 Number Match",
    "url": "https://html5.gamemonetize.co/djh6bkf7awlzxut3z8fkpua2nmk3umh1/",
    "description": "Challenge your brain with 2244 Number Game, a fun and addictive number-matching puzzle! Swipe and merge identical number tiles to create bigger numbers and aim for 2048, 4096, and beyond. Move tiles in 8 directions…",
    "tags": [
      "Puzzle",
      "2026 games",
      "2048",
      "Block",
      "Number",
      "Puzzleblock"
    ],
    "mobile": false
  },
  {
    "id": "gm-orbit-pals",
    "name": "Orbit Pals",
    "url": "https://html5.gamemonetize.co/1jd786ggu6difyo0crv0us0e8qyooyvi/",
    "description": "Orbit Pals is a cozy space sorting puzzle with adorable alien pals. Tap a planet to lift the pals at its edge, then tap another planet to make them hop over. Gather every species into its own flock - each planet fits…",
    "tags": [
      "Puzzle",
      "Color",
      "Cute",
      "Logic",
      "Sort",
      "Space"
    ],
    "mobile": false
  },
  {
    "id": "gm-line-color-2d",
    "name": "Line Color 2D",
    "url": "https://html5.gamemonetize.co/erq3upnl7ngb12xt630z62xb1lbtogqb/",
    "description": "Line Color 2D es un adictivo puzle donde mantienes presionado para deslizar la l&iacute;nea de color por un circuito plano. Planifica cada movimiento, esquiva los obst&aacute;culos en movimiento y pinta la ruta completa…",
    "tags": [
      "Puzzle",
      "2D",
      "Arcade",
      "Unity3D",
      "WebGL",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-cop-ramp-sandbox",
    "name": "Cop Ramp Sandbox",
    "url": "https://html5.gamemonetize.co/761ym7jterdmjytrok0dy2ickw7bv3lz/",
    "description": "Steer open-world chaos in Cop Ramp Sandbox! Take the wheel of high-speed police cruisers, launch off massive mega-ramps, and execute jaw-dropping stunts. Unleash pure vehicular destruction, customize your rides, and…",
    "tags": [
      "Arcade",
      "Adventure",
      "Driving",
      "Gta",
      "Police",
      "Sandbox"
    ],
    "mobile": false
  },
  {
    "id": "gm-meow-sudoku",
    "name": "Meow Sudoku",
    "url": "https://html5.gamemonetize.co/xfq00jtcho9xu8ks7k0lkennwqaq3jte/",
    "description": "Welcome to the classic logic game with a fresh twist! Rely on colors and deduction to organize the board. Discover challenges that will put your spatial perception and strategic thinking to the test. How far will you be…",
    "tags": [
      "Puzzle",
      "Brain",
      "Cat",
      "Color",
      "Coloring",
      "Logic",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-block-tower-smash",
    "name": "Block Tower Smash",
    "url": "https://html5.gamemonetize.co/ay5t0139zdhgonrxncxd28j1ynrr0ntc/",
    "description": "Smash your way down a spinning tower of colorful blocks! Hold to crash your ball through the rings, let go to bounce, and never touch the dark blocks or your ball breaks. Endless levels across six worlds: Meadow…",
    "tags": [
      "Hypercasual",
      "Casual",
      "Minecraft",
      "Mobile",
      "Onetouch"
    ],
    "mobile": true
  },
  {
    "id": "gm-bus-mania-parking-puzzle",
    "name": "Bus Mania: Parking Puzzle",
    "url": "https://html5.gamemonetize.co/ki22g3f8xt06ew3wrn3uef49z9exmm7h/",
    "description": "Bus Shift: Parking Jam is a colorful and addictive parking puzzle game where every move matters. Tap buses to move them in the direction of their arrows, clear the crowded parking area, and match passengers with the…",
    "tags": [
      "Puzzle",
      "Brain",
      "Bus",
      "Car",
      "Casual",
      "Logic",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-pumpkin-ninja",
    "name": "Pumpkin Ninja",
    "url": "https://html5.gamemonetize.co/d606f19x5opkoh6in34eloaihzf0geaa/",
    "description": "Pumpkin Ninja is a fast and addictive Halloween arcade game! Slice flying pumpkins with quick swipes, create huge combos and avoid the dangerous bombs. Play across spooky Halloween environments filled with haunted…",
    "tags": [
      "Arcade",
      "Action",
      "Casual",
      "Halloween",
      "Ninja",
      "Skill"
    ],
    "mobile": false
  },
  {
    "id": "gm-lollipop-escape-mania-kids",
    "name": "Lollipop Escape Mania Kids",
    "url": "https://html5.gamemonetize.co/up7nv587fb17bw1ilj67cnx574uzcu0r/",
    "description": "Lollipop Escape Mania Kids is a kids game where playing has been made very easy. There are platforms filled with candies and you have supposed to collect all of them to increase your score. There are enemy objects too…",
    "tags": [
      "Hypercasual",
      "Casual",
      "Bomb",
      "Candy",
      "Platform"
    ],
    "mobile": false
  },
  {
    "id": "gm-crazy-plinko",
    "name": "Crazy Plinko",
    "url": "https://html5.gamemonetize.co/1kq6nm65mxkb0v6wxfd00s1r2j638plb/",
    "description": "At first it feels random. Then patterns appear. With each upgrade you influence gravity, angles and timing. The board stops being chaos and becomes a system you can master. But are your choices smart enough to succeed?",
    "tags": [
      "Puzzle",
      "1 Player",
      "Board",
      "Decorate",
      "Highscore",
      "Strategy",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-build-a-keycap-pyramid",
    "name": "Build a Keycap Pyramid",
    "url": "https://html5.gamemonetize.co/djrwlkwff95gb0ezfz6zrvk8rot2omnr/",
    "description": "Build a Keycap Pyramid is a satisfying 3D building game where every keycap counts. Scoop up keycaps by the hundreds, carry a wobbling tower of them on your head and watch your pyramid rise layer by layer. Every finished…",
    "tags": [
      "Multiplayer",
      "3D",
      "Building",
      "Casual",
      "Clicker",
      "Cute"
    ],
    "mobile": false
  },
  {
    "id": "gm-geometryrush",
    "name": "GeometryRush",
    "url": "https://html5.gamemonetize.co/p2p9llsb78ugrgqzp95x9a6gon3nvvfo/",
    "description": "Geometry Rush is an addictive arcade runner! Control a cute cube character as it dashes through a colorful geometric world. Jump over spikes, dodge obstacles and collect coins across multiple challenging levels. With…",
    "tags": [
      "Arcade",
      "Geometry"
    ],
    "mobile": false
  },
  {
    "id": "gm-home-hauler-simulator",
    "name": "Home Hauler Simulator",
    "url": "https://html5.gamemonetize.co/4g753tai0ddjz5zoxj2kbm85er42m31h/",
    "description": "Home Hauler Simulator lets you drive heavy trucks and operate precision cranes to construct custom houses from scratch. Transport floors, walls, and roofs across challenging terrains, master complex machinery, complete…",
    "tags": [
      "Arcade",
      "Adventure",
      "Build",
      "Driving",
      "Truck",
      "Unity3D"
    ],
    "mobile": false
  },
  {
    "id": "gm-architects-of-tomorrow",
    "name": "Architects of Tomorrow",
    "url": "https://html5.gamemonetize.co/nxsgnlie0cffevthfy836xp0q1pvxvxz/",
    "description": "Shape the skyline of tomorrow in this strategic urban builder. Blueprint sprawling metropolises, balance complex resource networks, and adapt to dynamic environmental challenges. From humble zoning to towering high-tech…",
    "tags": [
      "Arcade",
      "Building",
      "Driving",
      "Simulator",
      "Trucks",
      "Unity3D"
    ],
    "mobile": false
  },
  {
    "id": "gm-zombie-drift-steel-rage",
    "name": "Zombie Drift: Steel Rage",
    "url": "https://html5.gamemonetize.co/ngcyjdm54a42xt9vv7wyzvnqrzbu9leg/",
    "description": "Zombie Drift: Steel Rage is a post-apocalyptic 3D action game that mixes arcade drifting with arena survival. Drive an armored battle car into a ruined city arena full of zombie hordes and mutant giants. Speed and…",
    "tags": [
      "Racing",
      "3D",
      "3D Games",
      "Action",
      "Apocalypse",
      "Arena",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-leaf-clean-up",
    "name": "Leaf Clean Up",
    "url": "https://html5.gamemonetize.co/vd9ocjsjxmr3szinlpw8lk3abxn2pvgo/",
    "description": "Start from scratch with your bare hands, collecting fallen leaves and dropping them off at the sell zone for cash. Step onto glowing upgrade pads to boost your bag capacity, suction radius, and movement speed. As you…",
    "tags": [
      "Hypercasual",
      "Casual",
      "Collecting",
      "Idle",
      "Simulation"
    ],
    "mobile": false
  },
  {
    "id": "gm-find-the-key",
    "name": "Find The Key",
    "url": "https://html5.gamemonetize.co/3bxdxntygl8uak7mr4rxvyhezemiq2vv/",
    "description": "Find The Key is a challenging maze puzzle game where you explore tricky paths, collect stars, and find the key to unlock the exit. Plan every move carefully to reach hidden stars without getting trapped. Once you…",
    "tags": [
      "Puzzle",
      "Brain",
      "Classic",
      "Escape",
      "Fun",
      "Logic"
    ],
    "mobile": false
  },
  {
    "id": "gm-flappy-halloween-game",
    "name": "Flappy Halloween Game",
    "url": "https://html5.gamemonetize.co/g7c8wa9jccqy56jw9ahxb0aqjx6p2zwa/",
    "description": "Get ready for a spooky and exciting flying adventure in Flappy Halloween Game! Take control of a cute Halloween-themed character and fly through challenging obstacles while trying to achieve the highest score. Tap…",
    "tags": [
      "Puzzle",
      "2026 games",
      "Action",
      "Adventure",
      "Amazing",
      "Best"
    ],
    "mobile": false
  },
  {
    "id": "gm-demon-hunter-beat-em-up",
    "name": "Demon Hunter: Beat Em Up",
    "url": "https://html5.gamemonetize.co/rvysr6fruqcen5n7ucjf6wcgt4jh340f/",
    "description": "Doom 2016 reimagined as an illustrated arcade beat em up. Rip and tear through five chapters with melee combos, a shotgun, and Berserk.",
    "tags": [
      "Arcade",
      "Action",
      "Adventure",
      "Brawl",
      "Fight",
      "Fighting"
    ],
    "mobile": false
  },
  {
    "id": "gm-dark-ages-beat-em-up",
    "name": "Dark Ages: Beat Em Up",
    "url": "https://html5.gamemonetize.co/iexarxtfm1o9b2o46wc62iid3mfg6v31/",
    "description": "Doom: The Dark Ages reimagined as an illustrated arcade beat em up. Master the flail, Shield Saw, parry, and shotgun across five chapters.",
    "tags": [
      "Arcade",
      "Action",
      "Adventure",
      "Brawl",
      "Fight",
      "Fighting"
    ],
    "mobile": false
  },
  {
    "id": "gm-stickninja-mission",
    "name": "StickNinja Mission",
    "url": "https://html5.gamemonetize.co/5ktuaermslbv0gihcgyqb2zjm3zdvkce/",
    "description": "Enter a fast-paced 2D platform adventure where every level is filled with danger! Control your ninja, defeat monsters in your path, collect the keys, and unlock mysterious doors to continue your mission. Jump across…",
    "tags": [
      "Stickman",
      "1 Player",
      "2D",
      "Adventure",
      "Arcade",
      "Platform"
    ],
    "mobile": false
  },
  {
    "id": "gm-cheerleader-magazine-dressup",
    "name": "Cheerleader Magazine Dressup",
    "url": "https://html5.gamemonetize.co/tbn54jgvhuc0xw5k6liq3gtaf72qo9ad/",
    "description": "Design trendy cheerleader outfits, apply glamorous makeovers, style hair, and create stunning looks for photoshoots in this fun fashion dress-up game!",
    "tags": [
      "Hypercasual",
      "Casual",
      "Beauty",
      "Dress Up",
      "Fashion",
      "Girl"
    ],
    "mobile": false
  },
  {
    "id": "gm-cliff-boi-trap-adventure",
    "name": "Cliff Boi Trap Adventure",
    "url": "https://html5.gamemonetize.co/7tgdohgpnf4m1orq11g3ql66tzatby5o/",
    "description": "Cliff Boi: Fail = Try Again! is a hilarious and addictive 2D cartoon side-scrolling platformer and trap adventure game! Guide a cute chibi boy with round glasses across 25 action-packed stages filled with unexpected…",
    "tags": [
      "Hypercasual",
      "Casual",
      "Arcade",
      "Cute",
      "Jump",
      "Jumping"
    ],
    "mobile": false
  },
  {
    "id": "gm-block-ship-battle",
    "name": "Block Ship Battle",
    "url": "https://html5.gamemonetize.co/chx14ghx41yho7ttndb9wx33d9gmz0ah/",
    "description": "Raise the sails and fight for the richest hold on the reef! Block Ship Battle is a fast pirate brawler with real broadside combat: your cannons fire to the side, so every fight is a dance of turning, timing and…",
    "tags": [
      "Adventure",
      "1 Player",
      "Arena",
      "Battleship",
      "Ships"
    ],
    "mobile": false
  },
  {
    "id": "gm-grave-blast",
    "name": "Grave Blast",
    "url": "https://html5.gamemonetize.co/a4eearo52eig908oy2hzugqa05wdnaeu/",
    "description": "Grave Blast is a fast-paced 3D twin-stick survival shooter set in a spooky Halloween world. Fight endless waves of simple voxel-style zombies in creepy locations full of pumpkins, graves, moonlight and eerie atmosphere…",
    "tags": [
      "Shooting",
      "Action",
      "Arcade",
      "Casual",
      "Halloween",
      "Horror",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-collect-brainrot-arena",
    "name": "Collect Brainrot Arena",
    "url": "https://html5.gamemonetize.co/3d46x6qf4gjpq9nn4u1wntkd2a35uor8/",
    "description": "Collect Brainrot Arena is a chaotic multiplayer collecting and stealing game where luck, strategy, and timing are equally important. Enter the arena, gather valuable Lucky Blocks, unlock rare Brainrots, upgrade your…",
    "tags": [
      "Action",
      "2 Player",
      "2 Player Games",
      "Brainrot",
      "Collecting",
      "Roblox"
    ],
    "mobile": false
  },
  {
    "id": "gm-tidy-bot",
    "name": "Tidy Bot",
    "url": "https://html5.gamemonetize.co/otpvx7v0zpqtrvil6g88qhcxq7dccl8m/",
    "description": "Tidy Bot is a relaxing 3D cleaning game. Drive a little robot vacuum around cosy rooms, suck up every speck of dirt, collect coins and get back to the dock before the battery runs out. Play 30 handmade levels across…",
    "tags": [
      "Hypercasual",
      "Casual",
      "1 Player",
      "3D",
      "Cleaning",
      "Collecting",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-soccer-rebound",
    "name": "Soccer Rebound",
    "url": "https://html5.gamemonetize.co/x08uitar6c2mxiuufwrgf8g9kfed0jlj/",
    "description": "Soccer Rebound is football played on a pinball table. You control the two flippers in front of your own goal, and your toy teammates do the running: they chase the ball, pass it and shoot on their own. Keep the ball out…",
    "tags": [
      "Sports",
      "1 Player",
      "Soccer",
      "Sport"
    ],
    "mobile": false
  },
  {
    "id": "gm-bean-party-obby",
    "name": "Bean Party Obby",
    "url": "https://html5.gamemonetize.co/1ejuc6yo1lqr4o7ae3ussgi7d7uh21oe/",
    "description": "Bean Party Obby is a colorful 3D party game where you race, jump and survive against 14 computer-controlled beans. Pick one of 6 bean characters and a hat, then choose one of 5 modes. Three obby courses: Rainbow Road…",
    "tags": [
      "Adventure",
      "Hexagon",
      "Jumping",
      "Kids",
      "Obstacle",
      "Platform"
    ],
    "mobile": false
  },
  {
    "id": "gm-ramp-truck-mayhem",
    "name": "Ramp Truck Mayhem",
    "url": "https://html5.gamemonetize.co/7d6804efwpz7pybjuvaq4tljwnusrel9/",
    "description": "Unleash the roar of the monster truck Bandit as you launch off massive wooden ramps and soar across epic arenas! Experience heart-pounding stunt jumps, explosive exhaust flames, and high-speed thrills as you fly past…",
    "tags": [
      "Arcade",
      "Car",
      "Driving",
      "Monstertruck",
      "Racing",
      "Truck"
    ],
    "mobile": false
  },
  {
    "id": "gm-embercraft",
    "name": "EmberCraft",
    "url": "https://html5.gamemonetize.co/8g97q606eaku8sq2vetmo0xhho4vqpux/",
    "description": "EmberCraft is a colorful 3D sandbox adventure in a block world. Explore varied terrain, build your own creations, and shape your journey at your own pace. The game is designed for desktop, tablet, and mobile browsers…",
    "tags": [
      "Adventure",
      "3D",
      "Craft",
      "Crafting",
      "Minecraft",
      "Sandbox"
    ],
    "mobile": false
  },
  {
    "id": "gm-nutty-rush",
    "name": "Nutty Rush",
    "url": "https://html5.gamemonetize.co/zy741crr2w6wqwhqocgcp8cwgr7rau5y/",
    "description": "Nutty Rush is a cozy 3D platformer starring P&ouml;f&uuml;rd&uuml;k, a brave little squirrel. The legendary giant nuts of the Great Forest are waking up, and the greedy eagle Grimtalon wants them all. Run, jump and spit…",
    "tags": [
      "Adventure",
      "3D",
      "Animal",
      "Cartoon",
      "Cute",
      "Forest"
    ],
    "mobile": false
  },
  {
    "id": "gm-coinbound-voodoo-nightmare",
    "name": "Coinbound Voodoo Nightmare",
    "url": "https://html5.gamemonetize.co/drk4juw5qvgt9nibxjdk1qv01xlfv742/",
    "description": "Coin Bound is a fastpaced arcade runner where every second counts. Dash through tight maze paths, grab coins, dodge zombies, and push your score higher with every run. Simple controls, quick rounds, and nonstop pressure…",
    "tags": [
      "Arcade",
      "Magic",
      "Maze",
      "Run",
      "Running",
      "Zombie"
    ],
    "mobile": false
  },
  {
    "id": "gm-pixel-shooter-puzzle",
    "name": "Pixel Shooter Puzzle",
    "url": "https://html5.gamemonetize.co/kakx25nm868ya1cao4jw5gvkrmt86z35/",
    "description": "Pixel Shooter Puzzle is a colorful 3D puzzle game where every cannon choice counts. Choose cannons from the front of the queue to blast matching blocks from a rotating voxel model. Reveal the layers underneath, plan…",
    "tags": [
      "Puzzle",
      "1 Player",
      "3D",
      "Cannon",
      "Color",
      "Logic",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-dog-runaway",
    "name": "Dog Runaway",
    "url": "https://html5.gamemonetize.co/0d8wqm8egu0pvx8j0cotpaxsnvvbwszt/",
    "description": "You slipped the leash. Your owner is already running. Do not stop. Dog Runaway is a 3D arcade chase: sprint through six worlds, make a mess, stay free. SIX WORLDS, each with its own rules: The Park, Downtown, The…",
    "tags": [
      "Arcade",
      "1 Player",
      "3D",
      "Action",
      "Animal",
      "Casual",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-scrap-arms-neo",
    "name": "SCRAP ARMS NEO",
    "url": "https://html5.gamemonetize.co/v163byg4gknvrwdqvz0hqbeazy9wnhey/",
    "description": "This is my very first game, and I sincerely hope you all enjoy playing it! SCRAP ARMS NEO is a pixel-art action roguelite. Every weapon you pick up joins your stack and attacks automatically - until it breaks and…",
    "tags": [
      "Shooting",
      "1 Player",
      "2D",
      "Action",
      "Mobile",
      "Monster"
    ],
    "mobile": true
  },
  {
    "id": "gm-last-garage-zombie-road",
    "name": "Last Garage: Zombie Road",
    "url": "https://html5.gamemonetize.co/v8dz10q6cfukpco6k4xqp0xauhuyc7kc/",
    "description": "Hit the road in Last Garage, a fast-paced 3D zombie survival driving game. Race through shifting districts—from city streets and suburbs to a forest highway—while dodging wrecks, fallen trees, barriers, and evacuation…",
    "tags": [
      "Racing",
      "3D",
      "Action",
      "Car",
      "Shooting",
      "Survival"
    ],
    "mobile": false
  },
  {
    "id": "gm-grass-rush-adventure",
    "name": "Grass Rush Adventure",
    "url": "https://html5.gamemonetize.co/t1a6y3txgx1n9b1bhurm0dihg1ruwcrk/",
    "description": "Cut grass, discover rare treasures, and grow stronger with every swing! Grass Rush Adventure is a colorful incremental game where you explore six worlds and uncover more than 300 collectible treasures. Sell your finds…",
    "tags": [
      "Clicker",
      "Idle",
      "1 Player",
      "2D",
      "Adventure",
      "Casual"
    ],
    "mobile": false
  },
  {
    "id": "gm-aberiel-church-jigsaws",
    "name": "Aberiel Church Jigsaws",
    "url": "https://html5.gamemonetize.co/bhxsdr5hgqy6y9kv64abzbuyqovtqvle/",
    "description": "Escape the noise of daily life and embark on a peaceful journey through the world's most beautiful churches in Aberiel Church Jigsaw Puzzles Saga — Chapter 1. Explore stunning churches from around the world while…",
    "tags": [
      "Puzzle",
      "1 Player",
      "2026 games",
      "2D",
      "Android",
      "Jigsaw",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-last-call-drunken-boxer",
    "name": "Last Call: Drunken Boxer",
    "url": "https://html5.gamemonetize.co/vcq4ydqbpxaoot65ge0h253zdh2qdvg6/",
    "description": "Last Call: Drunken Boxer drops you into a tactical 3D boxing game where unpredictable ragdoll knockdowns and dramatic ringside action define every bout. Four fighters, each carrying unique special moves, stand ready…",
    "tags": [
      "Sports",
      "Boxing",
      "Brawl",
      "Fight",
      "Fighting",
      "Street Fighting"
    ],
    "mobile": false
  },
  {
    "id": "gm-jenni-styles",
    "name": "Jenni Styles",
    "url": "https://html5.gamemonetize.co/wd7m31ue44favnhzhhu69u92sd4a36g2/",
    "description": "A little fashion, a little adventure, and one big day! Join Jenni and her kitty Bubbles in a colourful dress-up story. Choose her replies, pick from four complete looks, and help her get ready for whatever comes…",
    "tags": [
      "Girls",
      "Casual",
      "Cat",
      "Circus",
      "Click",
      "Digital circus"
    ],
    "mobile": false
  },
  {
    "id": "gm-double-dragon-broken-district",
    "name": "Double Dragon: Broken District",
    "url": "https://html5.gamemonetize.co/omo4cdstc5pxq29rk5w7sm0k5m2ieoob/",
    "description": "Double Dragon: Broken District is a martial arts story through four missions. Choose Mina or Ken and fight beside an AI sibling to find a missing trainer after your dojo burns. Chain punches and kicks, dodge enemy…",
    "tags": [
      "Arcade",
      "1 Player",
      "2D",
      "Fighting",
      "Mobile",
      "Retro"
    ],
    "mobile": true
  },
  {
    "id": "gm-finnie-escape",
    "name": "Finnie Escape",
    "url": "https://html5.gamemonetize.co/6pha94oecwaq8udbs47cx39t97vi0btt/",
    "description": "Finnie Escape is an exciting underwater puzzle adventure where you guide a little fish through mysterious ocean mazes. Move across grid-based paths, avoid dangerous enemies, interact with the environment, and use…",
    "tags": [
      "Puzzle",
      "Animal",
      "Casual",
      "Escape",
      "Fun"
    ],
    "mobile": false
  },
  {
    "id": "gm-fashion-show-dressup",
    "name": "Fashion Show Dressup",
    "url": "https://html5.gamemonetize.co/ftlxgqduult7urgtrpp8b8d2wu6slu1u/",
    "description": "Stylize 6 pretty models with huge amounts of cool clothes, hairstyles, and accessories in this fun fashion dress up game for girls! Show creativity, pick bright backgrounds, and play offline free.",
    "tags": [
      "Hypercasual",
      "Casual",
      "Beauty",
      "Dress Up",
      "Fashion",
      "Girl"
    ],
    "mobile": false
  },
  {
    "id": "gm-elemental-barrage",
    "name": "Elemental Barrage",
    "url": "https://html5.gamemonetize.co/khneo8mnfzpm7fmxwr70or0tieye6uyu/",
    "description": "Elemental Barrage is a casual volley shooter. Monsters march down the board row by row — drag back, aim and release a barrage of elemental balls that bounce through them. Grab +1 pickups: when your ball tray overflows…",
    "tags": [
      "Arcade",
      "Ball",
      "Bubble Shooter",
      "Highscore",
      "Monster",
      "Shoot",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-leaf-blower-yards",
    "name": "Leaf Blower Yards",
    "url": "https://html5.gamemonetize.co/b12gcbbakrd0xwom3d0kibk4z1hiuesn/",
    "description": "Drive a ride-on leaf blower through yards buried in autumn leaves. Your air stream gathers the leaves into a pile in front of the nozzle. Drive the pile into the bag zone: every 50 leaves fill a bag and pay coins. When…",
    "tags": [
      "Hypercasual",
      "Casual",
      "1 Player",
      "2D",
      "Cleaning",
      "Garden"
    ],
    "mobile": false
  },
  {
    "id": "gm-4-in-a-blow",
    "name": "4 in a Blow",
    "url": "https://html5.gamemonetize.co/gphj9wqk6q5tkrq11lghp235essiam0f/",
    "description": "4 in a Blow is Connect 4 with power-ups. Everyone already knows the rules, so you can start playing immediately. Every turn charges up your power meter — spend it to block a column, swap two tokens, remove a token, or…",
    "tags": [
      "Puzzle",
      "1 Player",
      "2D",
      "Board"
    ],
    "mobile": false
  },
  {
    "id": "gm-shooter-zombie-survival",
    "name": "Shooter Zombie Survival",
    "url": "https://html5.gamemonetize.co/t1mqe8cvqn6jxu1nalxly418789tcodl/",
    "description": "Play Shooter: Zombie Survival online. Fight zombie waves for cash, buy and upgrade weapons, then unlock the final wave by completing your arsenal.",
    "tags": [
      "Shooting",
      "3D",
      "3D Games",
      "CSGO",
      "First Person Shooter",
      "Shoot"
    ],
    "mobile": false
  },
  {
    "id": "gm-hollow-pass",
    "name": "HOLLOW PASS",
    "url": "https://html5.gamemonetize.co/q5l5ih9tiu1we81mnyuoi63944b5mcfy/",
    "description": "HOLLOW PASS is a desktop first-person aim trainer that fights like a live firefight: ninety seconds, one P-12 pistol, and up to four bots that move, take cover and shoot back. Clear them all and a new life starts…",
    "tags": [
      "Shooting",
      "1 Player",
      "3D",
      "Fps",
      "Shooter"
    ],
    "mobile": false
  },
  {
    "id": "gm-sneaky-spikes",
    "name": "Sneaky Spikes",
    "url": "https://html5.gamemonetize.co/5oavczl28s6maqcqift1cn1zsl8zvqe3/",
    "description": "Sneaky Spikes is a troll platformer drawn on notebook paper. Floors drop, spikes pop and doors bite, and a sarcastic narrator comments on every death. Finish a page and every one of your deaths replays at once in the…",
    "tags": [
      "Arcade",
      "2D",
      "Funny",
      "Jump",
      "Platform"
    ],
    "mobile": false
  },
  {
    "id": "gm-verity-block-survival",
    "name": "Verity Block Survival",
    "url": "https://html5.gamemonetize.co/7uxzjz6xhuaa25oajcpcj2d0thdzf101/",
    "description": "Enter a mysterious block-based world where survival is your only goal! Explore a dark and dangerous environment, gather resources, craft useful items, and build a safe place to survive. But be careful—strange creatures…",
    "tags": [
      "Action",
      "3D",
      "3D Games",
      "Attack",
      "Horror",
      "Mineblock"
    ],
    "mobile": false
  },
  {
    "id": "gm-1-speed-superhero-obby",
    "name": "+1 Speed Superhero Obby",
    "url": "https://html5.gamemonetize.co/xrlww31pl1jvsrk9xo2vsqzahqn4088n/",
    "description": "+1 Speed Superhero Obby is a 3D obby where every step adds speed. Run the colorful towers, train on treadmills, smash speed gates and climb through five worlds. Every speed milestone unlocks a new superhero power that…",
    "tags": [
      "Adventure",
      "3D",
      "3D Games",
      "Clicker",
      "Idle",
      "Multiplayer"
    ],
    "mobile": false
  },
  {
    "id": "gm-neo-traffic-rider-championship",
    "name": "Neo Traffic Rider Championship",
    "url": "https://html5.gamemonetize.co/dm8ngpar3dl31cyznpozi35l5tlworw2/",
    "description": "Take the cockpit in Neo Traffic Rider Championship! Race seven rivals across six destinations, from coastal highways and rolling hills to city expressways and snowy mountain roads. Complete 18 championship events…",
    "tags": [
      "Racing",
      "1 Player",
      "Adventure",
      "Bike",
      "Moto",
      "Traffic"
    ],
    "mobile": false
  },
  {
    "id": "gm-vesper-survival-mod",
    "name": "Vesper Survival Mod",
    "url": "https://html5.gamemonetize.co/9z9o6bqh9qfqsmlvhmsei16t54neyc2a/",
    "description": "Enter a mysterious block-based survival world filled with adventure, danger, and unexpected encounters! Gather resources, craft useful tools, build your shelter, and explore a vast environment as you fight to survive…",
    "tags": [
      "Adventure",
      "3D",
      "3D Games",
      "Arcade",
      "Block",
      "Mineblock"
    ],
    "mobile": false
  },
  {
    "id": "gm-bike-stunt-master-mini-rush",
    "name": "Bike Stunt Master Mini Rush",
    "url": "https://html5.gamemonetize.co/9m7b1g3apiu7nazxcn863ymcmga4ud3y/",
    "description": "Get ready for an exciting motorcycle racing adventure in Rush to Crush! Race through challenging tracks, dodge obstacles, perform amazing stunts, crush fruits and boxes, and compete against rival riders. Choose from a…",
    "tags": [
      "Racing",
      "Bike",
      "Multiplayer",
      "Stunts"
    ],
    "mobile": false
  },
  {
    "id": "gm-need-for-drift",
    "name": "Need For Drift",
    "url": "https://html5.gamemonetize.co/sxkseqx8ry0jtx7hmc61fxdsfqxowt09/",
    "description": "Hit the streets and experience the thrill of high-speed street racing! Drift through sharp corners, escape intense police chases, and push your car to its limits. Earn rewards by completing races and dangerous…",
    "tags": [
      "Racing",
      "1 Player",
      "Action",
      "Arcade",
      "Car",
      "Car tuning"
    ],
    "mobile": false
  },
  {
    "id": "gm-collisiox",
    "name": "CollisioX",
    "url": "https://html5.gamemonetize.co/vy3xpzph8bf7i1lwckow0wbq71844n25/",
    "description": "CollisioX 3D is a colorful and addictive 3D puzzle game where you swipe to move all balls and merge matching colors. Plan each move carefully as every ball slides in the same direction until hitting an obstacle or…",
    "tags": [
      "Puzzle",
      "Ball",
      "Brain",
      "Classic",
      "Fun",
      "Logic"
    ],
    "mobile": false
  },
  {
    "id": "gm-arms-race",
    "name": "Arms Race",
    "url": "https://html5.gamemonetize.co/dphh4xkagsd1zby9ymlrnviidy12q1d7/",
    "description": "Arms Race is a fast-paced game where you merge duplicate weapons to forge an increasingly devastating arsenal. Combine identical firearms to unlock higher-tier guns, boost your firepower, and continuously escalate your…",
    "tags": [
      "Arcade",
      "Adventure",
      "Gun",
      "Sword",
      "Unity3D",
      "WebGL",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-mathematics-frenzy",
    "name": "Mathematics Frenzy",
    "url": "https://html5.gamemonetize.co/4ozu4vugt5gyl8kmllv5kpaw5lrq5n1p/",
    "description": "Dive into Mathematics Frenzy, a fast-paced runner game where quick calculations are your key to victory! Navigate thrilling obstacle courses, solve dynamic math gates in real time, expand your numbers, and race toward…",
    "tags": [
      "Arcade",
      "Adventure",
      "Math",
      "Unity3D",
      "WebGL",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-f-e-a-r-silent-facility",
    "name": "F.E.A.R.: Silent Facility",
    "url": "https://html5.gamemonetize.co/g5f1xa0fcvmf1qici9zzg9r1hh4xiygf/",
    "description": "Enter F.E.A.R.: Silent Facility as response officer Ada and cut off a transmission that predicts deaths before they happen. This 2D tactical horror shooter spans twelve intervals and 23 scenes through a troubled…",
    "tags": [
      "Shooting",
      "1 Player",
      "2D",
      "Action",
      "Adventure",
      "Gun"
    ],
    "mobile": false
  },
  {
    "id": "gm-arrowxis-brain-escape-puzzle",
    "name": "ArrowXis Brain Escape Puzzle",
    "url": "https://html5.gamemonetize.co/9r5uwdg0v1ga4p74az15bqfag59f3b0w/",
    "description": "Challenge your brain with ArrowXis: Brain Escape Puzzle! Solve colorful arrow puzzles, plan your moves, and clear every level using smart strategies. Choose from three unique challenge modes: Color Challenge, Side by…",
    "tags": [
      "Puzzle",
      "Arrow",
      "Arrows",
      "Brain",
      "Brainrot",
      "Brainrot Italian"
    ],
    "mobile": false
  },
  {
    "id": "gm-bolts-and-nuts-online",
    "name": "Bolts and Nuts Online",
    "url": "https://html5.gamemonetize.co/9zueathj0d2ruy7f4bekxqn6jh1reg4k/",
    "description": "Bolts and nuts online is a challenging puzzle game where you must use logic and careful planning to solve tricky mechanical puzzles. Remove, arrange, and manage bolts and nuts to complete each level and overcome…",
    "tags": [
      "Puzzle",
      ".io",
      ".io Games",
      "Casual"
    ],
    "mobile": false
  },
  {
    "id": "gm-wobble-it",
    "name": "WOBBLE IT",
    "url": "https://html5.gamemonetize.co/fr85ydryhol83ceqd3lp4e513tzen940/",
    "description": "WOBBLE IT is a 3D rolling-ball puzzle platformer. Guide a beach ball across floating block worlds where the ball sticks to every side of a block, so walls become floors as you roll over an edge. Collect every key to…",
    "tags": [
      "Puzzle",
      "3D",
      "Ball",
      "Bounce",
      "Brain",
      "Levels"
    ],
    "mobile": false
  },
  {
    "id": "gm-elden-ring-beat-em-up",
    "name": "Elden Ring: Beat Em Up",
    "url": "https://html5.gamemonetize.co/137w9qs3s44b3ga7f49ojvfywfybii44/",
    "description": "Elden Ring: Beat Em Up is fighting game with a five-chapter illustrated fantasy beat em up with sword combos, dodge and glintstone magic.",
    "tags": [
      "Arcade",
      "Action",
      "Adventure",
      "Fight",
      "Fighting"
    ],
    "mobile": false
  },
  {
    "id": "gm-glam-dressup-girls-games",
    "name": "Glam Dressup Girls Games",
    "url": "https://html5.gamemonetize.co/ojcu1qtx2urwezeze9s1ui5c201kkthd/",
    "description": "Create millions of glam outfits for 6 diverse dolls. This free dress up game offers hundreds of clothing items, hairstyles, and accessories. Perfect for training fashion designer skills and dreaming of supermodel fame.",
    "tags": [
      "Hypercasual",
      "Casual",
      "Beauty",
      "Dress Up",
      "Fashion",
      "Girl"
    ],
    "mobile": false
  },
  {
    "id": "gm-bottle-breakshot",
    "name": "Bottle Breakshot",
    "url": "https://html5.gamemonetize.co/b3cbyij5mvkrk3jjmzr0jp456ir30ldc/",
    "description": "Test your aim and shooting skills in Bottle Shooting, a fun and challenging arcade game! Knock down bottles using 10 different balls, each offering a unique look and feel. Aim carefully, adjust your shot, and smash as…",
    "tags": [
      "Shooting",
      "1 Player",
      "2025 games",
      "2026 games",
      "2D",
      "Angrybirds"
    ],
    "mobile": false
  },
  {
    "id": "gm-word-game-2026",
    "name": "Word Game 2026",
    "url": "https://html5.gamemonetize.co/rf5cgy3ndo3bzeiw3vlri71tgydvp409/",
    "description": "Welcome to Words Game 2026 — a relaxing and addictive crossword adventure! Travel through beautiful locations while improving your vocabulary, spelling, and brainpower. Connect letters in any direction to discover…",
    "tags": [
      "Puzzle",
      "1 Player",
      "2025 games",
      "2026 games",
      "2D",
      "Best"
    ],
    "mobile": false
  },
  {
    "id": "gm-wrecking-ball-tycoon",
    "name": "Wrecking Ball Tycoon",
    "url": "https://html5.gamemonetize.co/7z5y4z7gi2afizgqejenzse1faq611s4/",
    "description": "Swing a wrecking ball through six colorful districts and grow your demolition business. Hit the green zone for a super strike with extra damage, slow motion, zoom and comic impact bursts. Smash supports, send bricks and…",
    "tags": [
      "Clicker",
      "Idle",
      "Ball",
      "Building",
      "Destruction",
      "Mapi games",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-legiontide-army-runner",
    "name": "Legiontide Army Runner",
    "url": "https://html5.gamemonetize.co/sxsjr5xy86lzvr831z9ri6k063vh1so9/",
    "description": "Pick a gate, grow your army, smash whatever is in the way. Each run you steer a crowd of soldiers down a long road. Gates add or multiply troops, or turn soldiers into shield bearers, archers, giants or mages. The enemy…",
    "tags": [
      "Action",
      "3D",
      "Army",
      "Battle",
      "Castle",
      "Running"
    ],
    "mobile": false
  },
  {
    "id": "gm-destroy-minecraft",
    "name": "Destroy Minecraft",
    "url": "https://html5.gamemonetize.co/a1m3ote7fskxb6kgh25p1eine591qs13/",
    "description": "Drop into a chaotic battlefield where only the most destructive players survive. Destroy Minecraft is a competitive arena game where you shatter level blocks to build your advantage and eliminate rival players in…",
    "tags": [
      "Shooting",
      "Arcade",
      "Best",
      "Best Games",
      "Block",
      "First Person Shooter"
    ],
    "mobile": false
  },
  {
    "id": "gm-call-of-duty-modern-warfare-4-beat-em-up",
    "name": "Call of Duty Modern Warfare 4: Beat Em Up",
    "url": "https://html5.gamemonetize.co/1e5vlvy5v4ji67athwnt2w77ytyzfzzc/",
    "description": "Call of Duty Modern Warfare 4: Beat Em Up is a five-chapter modern military arcade beat em up. Fight, shoot, dodge, and break through enemy lines.",
    "tags": [
      "Arcade",
      "Action",
      "Adventure",
      "Fight",
      "Fighting"
    ],
    "mobile": false
  },
  {
    "id": "gm-super-nitro-racing-3",
    "name": "Super Nitro Racing 3",
    "url": "https://html5.gamemonetize.co/kx3u26klu4nv69u1g0mroqick2kyibmg/",
    "description": "Super Nitro Racing 3 is a top down racer with 21 tracks and very little room to relax. The car accelerates on its own, so your job is steering, braking and finding the right line. Charge the nitro bar to full and it…",
    "tags": [
      "Racing",
      "Car",
      "Car tuning",
      "Drifting",
      "Driving",
      "Mapi games",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-urban-military-strike",
    "name": "Urban Military Strike",
    "url": "https://html5.gamemonetize.co/wmnb3xo7van507ku4m52u7csrco1f6qb/",
    "description": "Execute high-stakes tactical operations in intense, close-quarters combat environments. Master realistic weapon ballistics, coordinate thermal breaches with your squad, and adapt to shifting objectives across…",
    "tags": [
      "Arcade",
      "Adventure",
      "Military",
      "Shoot 'Em Up",
      "Shooting",
      "Unity3D"
    ],
    "mobile": false
  },
  {
    "id": "gm-classic-car-driving-game",
    "name": "Classic Car Driving Game",
    "url": "https://html5.gamemonetize.co/1w7f01m3wdby60l5x73ve1o0vlywd4s4/",
    "description": "Get ready to experience the fun and challenge of classic car parking in **Classic Car Driving Game**! Take control of beautiful vintage cars and carefully navigate through busy parking areas, tight spaces, challenging…",
    "tags": [
      "Racing",
      "2026 games",
      "Adventure",
      "Best Games",
      "Car",
      "Driving"
    ],
    "mobile": false
  },
  {
    "id": "gm-hospital-surgeon-doctor-game",
    "name": "Hospital Surgeon: Doctor Game",
    "url": "https://html5.gamemonetize.co/swn9gkhk80lrrdtytvxxs5pvtfcqq2fz/",
    "description": "Become a skilled heart surgeon and take on challenging medical emergencies! Diagnose patients, use realistic surgical tools, perform heart operations, treat critical conditions, and help patients recover. Manage…",
    "tags": [
      "Girls",
      "Adventure",
      "Doctor",
      "Sim",
      "Simulation",
      "Simulator"
    ],
    "mobile": false
  },
  {
    "id": "gm-skincare-makeover-makeup-game",
    "name": "Skincare Makeover Makeup Game",
    "url": "https://html5.gamemonetize.co/c2yp54lkf1qheojv0880c6tjl4iv68gl/",
    "description": "Step into the world of beauty, fashion, and makeovers! Become a makeover expert and help your clients transform their looks with fun and creative beauty treatments. Start with relaxing spa and skincare treatments, clean…",
    "tags": [
      "Girls",
      "2026 games",
      "2D",
      "Fashion",
      "Girl",
      "Makeover"
    ],
    "mobile": false
  },
  {
    "id": "gm-police-car-chase-prison-escape-game",
    "name": "Police Car Chase Prison Escape Game",
    "url": "https://html5.gamemonetize.co/vdyfockmtag9v84zq68lmoh03eumnl4i/",
    "description": "Join the police force and protect the city in Police Car Chase Prison Escape Game! Play as a police officer, drive powerful police vehicles, chase dangerous criminals, stop prison escapees, and complete action-packed…",
    "tags": [
      "Adventure",
      "3D",
      "Car",
      "Escape",
      "Police",
      "Prison"
    ],
    "mobile": false
  },
  {
    "id": "gm-monster-truck-offroad-2",
    "name": "Monster Truck Offroad 2",
    "url": "https://html5.gamemonetize.co/ijep00ffovz7d1fdagujupadca9ad0li/",
    "description": "Take control of powerful monster trucks and conquer rugged mountain trails. Choose a vehicle in the garage, climb steep slopes, cross rocky paths and obstacles, and reach the checkpoints before time runs out. Complete…",
    "tags": [
      "Racing",
      "3D",
      "Car",
      "Driving",
      "Monster",
      "Monstertruck"
    ],
    "mobile": false
  },
  {
    "id": "gm-impossible-jeep-driver",
    "name": "Impossible Jeep Driver",
    "url": "https://html5.gamemonetize.co/q3144sl85gs8os0z8khhev97qqz6udrs/",
    "description": "Take the wheel of a 4x4 jeep and tackle rugged off-road courses. Drive through rocky climbs, narrow mountain paths and tricky obstacles, then reach each finish before time runs out. Choose your route, control your speed…",
    "tags": [
      "Racing",
      "3D",
      "Car",
      "Driving",
      "Jeep",
      "Levels"
    ],
    "mobile": false
  },
  {
    "id": "gm-pirate-dodge",
    "name": "Pirate Dodge",
    "url": "https://html5.gamemonetize.co/0rdf6n6gd5nwvq5jqsiqe4cravqlvmdo/",
    "description": "The river is narrow, your boat is tiny, and every pirate on the water wants it gone. Slip between lanes to dodge rocks and kraken tentacles, and keep an eye on the enemy ships: some shoot, some cut across your path…",
    "tags": [
      "Shooting",
      "1 Player",
      "Arcade",
      "Pirate",
      "Ships",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-galaxy-pop",
    "name": "Galaxy Pop",
    "url": "https://html5.gamemonetize.co/29ip4dxzvi2vnd4m75uhe3d6bijiso6y/",
    "description": "Galaxy Pop is a cosmic bubble shooter in outer space. Aim your blaster and shoot colorful bubbles, match three or more of the same color to pop them, and watch the bubbles below fall. Shots are limited, so aim carefully…",
    "tags": [
      "Puzzle",
      "Alien",
      "Bubble",
      "Bubble Shooter",
      "Casual",
      "Match 3",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-save-my-pet-game",
    "name": "Save My Pet Game",
    "url": "https://html5.gamemonetize.co/28pqb7jizbluu0gs71hymtiw3yxostxx/",
    "description": "Save My Pet Game is a fun and exciting puzzle game where your mission is to protect adorable pets from dangerous obstacles and tricky situations. Use your logic, timing, and problem-solving skills to find the safest way…",
    "tags": [
      "Puzzle",
      "2026 games",
      "Adventure",
      "Amazing",
      "Best Games",
      "Casual"
    ],
    "mobile": false
  },
  {
    "id": "gm-easy-halloween-coloring-quest",
    "name": "Easy Halloween Coloring Quest",
    "url": "https://html5.gamemonetize.co/uflixoblv06nx030t7bdk8v99v1e7bfa/",
    "description": "Get ready for a fun and spooky coloring adventure with Easy Halloween Coloring Quest! Grab your favorite colors and bring charming Halloween scenes to life with pumpkins, friendly ghosts, witches, bats, haunted houses…",
    "tags": [
      "Girls",
      "Arcade",
      "Coloring",
      "Educational",
      "Fun",
      "Halloween",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-jewel-loop-color-sort",
    "name": "Jewel Loop Color Sort",
    "url": "https://html5.gamemonetize.co/sqxs7c7ae09y605k47irbe2nku970owx/",
    "description": "Sort colorful jewels around a looping conveyor and fill matching spaces to reveal sparkling pictures. Plan each move around limited belt capacity and a ticking clock, use helpful boosters, and explore 1,478 puzzle…",
    "tags": [
      "Puzzle",
      "1 Player",
      "Color",
      "Jewel",
      "Logic",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-halloween-fighters",
    "name": "Halloween Fighters",
    "url": "https://html5.gamemonetize.co/22gkthmc1ag0868ztgrnr72gujpzo1o4/",
    "description": "Enter a wild Halloween arcade showdown! Choose from 11 monsters and battle through 12 haunted arenas to face three giant bosses: Iron Revenant, Hexwrap and Witchpump. Mix ten directional punches and kicks, chain combos…",
    "tags": [
      "Arcade",
      "Fight",
      "Fighting",
      "Halloween",
      "Mapi games",
      "Monster"
    ],
    "mobile": false
  },
  {
    "id": "gm-resident-evil-2-beat-em-up",
    "name": "Resident Evil 2: Beat Em Up",
    "url": "https://html5.gamemonetize.co/ciihuc9unbkkp08moyl0t3cmla4cbo7w/",
    "description": "Resident Evil 2: Beat Em Up is a fighting game where your mission is to fight through Raccoon City as Leon in a five-chapter survival arcade brawler. An unofficial fan game.",
    "tags": [
      "Arcade",
      "Action",
      "Adventure",
      "Fight",
      "Fighting",
      "Zombie"
    ],
    "mobile": false
  },
  {
    "id": "gm-1-cut-grass-adventure",
    "name": "+1 Cut Grass Adventure",
    "url": "https://html5.gamemonetize.co/aafq217bqi3jbg0q7yacv2lj8i0av6i4/",
    "description": "Control your lawn mower and clear the green fields as you progress! Earn money by mowing grass, upgrade your machine, and clean larger areas faster. Use your earnings to increase your capacity, speed, and mowing power…",
    "tags": [
      "Adventure",
      ".io",
      "1 Player",
      "2026 games",
      "3D",
      "3D Games"
    ],
    "mobile": false
  },
  {
    "id": "gm-alien-wreckage",
    "name": "Alien Wreckage",
    "url": "https://html5.gamemonetize.co/x29ygndj94w43k860w30d6029ivozpcf/",
    "description": "A lonely explorer travels across the outer space His goal is to gather the most ancient artifacts in the universe He is ready to face any kind of alien menace in order to do it He will explore abandoned alien wreckage…",
    "tags": [
      "Shooting",
      "1 Player",
      "2D",
      "Pixel",
      "Shoot 'Em Up",
      "Space"
    ],
    "mobile": false
  },
  {
    "id": "gm-mother-simulator-husband-wife-games",
    "name": "Mother Simulator Husband Wife Games",
    "url": "https://html5.gamemonetize.co/5weiv0t4xx5c3oelzc7tox5f9jwppnyx/",
    "description": "Step into the shoes of a virtual mother and experience the busy but exciting life of a wife and mom in Mother Simulator Husband Wife Games! Take care of your virtual family, manage household responsibilities, complete…",
    "tags": [
      "Girls",
      "3D",
      "Driving",
      "Family",
      "House",
      "Management"
    ],
    "mobile": false
  },
  {
    "id": "gm-ink-streak",
    "name": "Ink Streak",
    "url": "https://html5.gamemonetize.co/zko20s3434m8k7bjpeg8qzutkzikotxq/",
    "description": "Ink Streak is a fast-paced arcade game where timing and reflexes are the keys to victory. Tap the screen to control multiple characters as they run and leave colorful trails behind. Time every move carefully to prevent…",
    "tags": [
      "Puzzle",
      "Casual",
      "Color",
      "Fun",
      "Run"
    ],
    "mobile": false
  },
  {
    "id": "gm-geometry-vibes-3d",
    "name": "Geometry Vibes 3D",
    "url": "https://html5.gamemonetize.co/ox5p3fwowh0194lbvgxqr5u29d6ba8ja/",
    "description": "Geometry Vibes 3D takes everything you loved about the original Geometry Vibes and brings it into a vibrant, dynamic 3D world. With fully reimagined levels and stunning new visuals, this version elevates your reflexes…",
    "tags": [
      "Arcade",
      "1 Player",
      "2 Player",
      "2 Player Games",
      "3D",
      "Arrow"
    ],
    "mobile": false
  },
  {
    "id": "gm-happy-orange-glass",
    "name": "Happy Orange Glass",
    "url": "https://html5.gamemonetize.co/f54h2y5fynoksfqv989ds3u9zfzcupnd/",
    "description": "Happy Orange Glass is a fun and challenging puzzle game where your goal is to draw a line and guide the juice safely into the glass. Plan your path carefully, avoid obstacles, and find the best way to complete each…",
    "tags": [
      "Puzzle",
      "Arcade",
      "Brain",
      "Drawing",
      "Hypercasual",
      "Kids"
    ],
    "mobile": false
  },
  {
    "id": "gm-fat-duck-frenzy",
    "name": "Fat Duck Frenzy",
    "url": "https://html5.gamemonetize.co/mkzk0jxzb6j1z2tm8xquoquzjqjwhn64/",
    "description": "An endless candy road that folds through a dream. Weave between lanes of candy traffic, leap striped barricades and void gaps, and hold tight when reality flips into loop-the-loops and reality folds. Three hearts per…",
    "tags": [
      "Racing",
      "1 Player",
      "3D",
      "Driving",
      "HTML"
    ],
    "mobile": false
  },
  {
    "id": "gm-merge-monsters",
    "name": "Merge Monsters",
    "url": "https://html5.gamemonetize.co/n1rvxixmov2r6ko58685qevnyo7pt95i/",
    "description": "Meet a colorful collection of quirky monsters in this card-merging puzzle! Move numbered monster cards between four stacks and bring matching values together to create bigger numbers and discover new creatures. Plan…",
    "tags": [
      "Puzzle",
      "2048",
      "Brain",
      "Card",
      "Matching",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-hot-barrel-cats",
    "name": "Hot Barrel Cats",
    "url": "https://html5.gamemonetize.co/240e38zxkd6401ifv9i8pgq7n2hxgv4f/",
    "description": "Hot Barrel Cats is a cat defense game with a heat twist. A fungus horde called the Mildews marches down the road toward your gate, and only the cats standing on the wall can shoot. Every shot heats a cat up; when its…",
    "tags": [
      "Arcade",
      "Animal",
      "Casual",
      "Cat",
      "Cute",
      "Defense"
    ],
    "mobile": false
  },
  {
    "id": "gm-alien-quarantine",
    "name": "Alien Quarantine",
    "url": "https://html5.gamemonetize.co/0qisjurcsxvvmszq08zh60i85n363kgz/",
    "description": "Survive 20 missions in Alien Quarantine, a sci-fi top-down shooter set aboard a research station overrun by alien life. Clear three escalating waves, dodge enemy fire, and defeat a unique, larger boss at the end of…",
    "tags": [
      "Shooting",
      "Alien",
      "Levels",
      "Shooter",
      "Space"
    ],
    "mobile": false
  },
  {
    "id": "gm-sector-nine-lockdown",
    "name": "Sector Nine: Lockdown",
    "url": "https://html5.gamemonetize.co/ykxiuyiajgujttioqdwuemexeag96vqu/",
    "description": "Fight through a fallen research facility in Sector Nine: Lockdown. Restore power, uncover secret rooms, and survive three sectors of sci-fi action.",
    "tags": [
      "Arcade",
      "Action",
      "Platform",
      "Shoot",
      "Shoot 'Em Up",
      "Shooter"
    ],
    "mobile": false
  },
  {
    "id": "gm-half-life-2-platformer",
    "name": "Half Life 2: Platformer",
    "url": "https://html5.gamemonetize.co/d3oz08hdeaemj3idehn2fnabrcpyq5i3/",
    "description": "Take Gordon Freeman through five chapters in an illustrated Half-Life 2 action platformer. Wield the crowbar, SMG, and gravity gun against the Combine.",
    "tags": [
      "Arcade",
      "Action",
      "Platform",
      "Shoot",
      "Shoot 'Em Up",
      "Shooter"
    ],
    "mobile": false
  },
  {
    "id": "gm-autumn-cottage-connect",
    "name": "Autumn Cottage Connect",
    "url": "https://html5.gamemonetize.co/fdwuxvpo90e4jjqll24ryczdzfow8kzk/",
    "description": "Autumn Cottage Connect is a cozy tile-connecting puzzle game filled with the warmth and charm of autumn. Match colorful seasonal items, clear the board, and race against the clock while enjoying a peaceful cottage…",
    "tags": [
      "Puzzle",
      "1 Player",
      "2026 games",
      "2D",
      "Adult",
      "Best Games"
    ],
    "mobile": false
  },
  {
    "id": "gm-keyboard-escape-block-speed-1",
    "name": "Keyboard Escape Block Speed +1",
    "url": "https://html5.gamemonetize.co/jl2hv35oc2renl907jq79f8zc3h15e4p/",
    "description": "Ready to test your reflexes while running across giant keyboards? Press the correct keys, increase your speed, and survive as long as possible without falling! Stay focused, time your movements carefully, and complete…",
    "tags": [
      "Arcade",
      "1 Player",
      "2026 games",
      "3D",
      "3D Games",
      "Action"
    ],
    "mobile": false
  },
  {
    "id": "gm-blockcrafter",
    "name": "BlockCrafter",
    "url": "https://html5.gamemonetize.co/da9f7ysymfgmk8wmi43m1t3mwlqxly64/",
    "description": "An infinite sandbox world powered by hyper-realistic graphics and advanced physics. Explore lifelike biomes, gather resources, build without limits, and survive a harsh, dynamic environment. Key Features: Next-gen…",
    "tags": [
      "Adventure",
      "3D",
      "Block",
      "Construction",
      "Craft",
      "Crafting"
    ],
    "mobile": false
  },
  {
    "id": "gm-halo-platformer",
    "name": "Halo: Platformer",
    "url": "https://html5.gamemonetize.co/4g47mjt9pe6gf7zzc4x9bmcd9nhlc154/",
    "description": "Deploy onto the ring in Halo: Platformer, a Flash-style HTML5 platformer. Save your mission, rescue a Marine, defend a moving elevator, and face a two-phase Hunter. Full-window play with controller support.",
    "tags": [
      "Adventure",
      "Action",
      "Arcade",
      "Platform",
      "Shoot",
      "Shoot 'Em Up"
    ],
    "mobile": false
  },
  {
    "id": "gm-terminator-robot-uprising",
    "name": "Terminator Robot Uprising",
    "url": "https://html5.gamemonetize.co/qgplvmj7zudomjxtct5c2da1vg4xxq9x/",
    "description": "Greyhaven's service robots have seized the city. Play as Mara Vale in a 2D side-scrolling shooter across 20 missions, from a blackout depot to a hospital, foundry and more. Aim with your mouse, fire at approaching…",
    "tags": [
      "Shooting",
      "1 Player",
      "2D",
      "Action",
      "Levels",
      "Robot"
    ],
    "mobile": false
  },
  {
    "id": "gm-minecraft-times-counter-strike-2-5d-fps",
    "name": "Minecraft &times; Counter Strike: 2.5D FPS",
    "url": "https://html5.gamemonetize.co/59qinwjlee7fl73l4vjswylkq16jtx83/",
    "description": "Defuse the bomb in five block-built battlefields. A single-player tactical FPS with raiders, Creepers, and a three-weapon arsenal.",
    "tags": [
      "Shooting",
      "2D",
      "Action",
      "CSGO",
      "First Person Shooter",
      "Minecraft"
    ],
    "mobile": false
  },
  {
    "id": "gm-verdant-wilds",
    "name": "Verdant Wilds",
    "url": "https://html5.gamemonetize.co/iw7pzxapuj4d57biw7x0e4or6il6lm74/",
    "description": "Explore an isometric survival voxel world. Gather wood, stone and ores, craft tools, build campfires and shelters, mine deep caves, and discover mysterious dimensions in Verdant Wilds!",
    "tags": [
      "Adventure",
      "Crafting",
      "Minecraft",
      "Pixel",
      "Retro",
      "Sandbox"
    ],
    "mobile": false
  },
  {
    "id": "gm-ultimate-car-parking-sim",
    "name": "Ultimate Car Parking Sim",
    "url": "https://html5.gamemonetize.co/piymptjo34tr3s3kpvq5inmxhvdfpwxj/",
    "description": "Ultimate Car Parking Sim is an exciting and realistic driving game designed for players who love cars, precision driving, and challenging parking missions. Take control of powerful sports cars and luxury vehicles…",
    "tags": [
      "Racing",
      "1 Player",
      "Car",
      "Carparking",
      "Driving",
      "Simulator"
    ],
    "mobile": false
  },
  {
    "id": "gm-city-bus-parking",
    "name": "City Bus Parking",
    "url": "https://html5.gamemonetize.co/uuznea7q1oi0w72co3a0o1xv1k4kobzq/",
    "description": "City Bus Parking is an exciting bus driving and parking simulator that puts you behind the wheel of powerful city and coach buses. Navigate busy roads, winding mountain routes, bridges, and challenging parking areas…",
    "tags": [
      "Racing",
      "Best Games",
      "Bus",
      "City",
      "Fun",
      "Parking"
    ],
    "mobile": false
  },
  {
    "id": "gm-fish-sort-puzzle",
    "name": "Fish Sort Puzzle",
    "url": "https://html5.gamemonetize.co/diiob6luzs7e36nbbt1iz74wlvf4vo2d/",
    "description": "Dive into Fish Sort Puzzle, a colorful underwater sorting game! Tap fish inside floating bubbles and send them to matching tanks. Collect three matching fish to clear each tank and make room for more. Plan your moves…",
    "tags": [
      "Puzzle",
      "Animal",
      "Fish",
      "Match3",
      "Matching",
      "Sorting",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-rich-mom-family-simulator-luxury-life",
    "name": "Rich Mom Family Simulator Luxury Life",
    "url": "https://html5.gamemonetize.co/f9w19zpg5rwd3ek8cy38qloec988d3nr/",
    "description": "Experience the glamorous lifestyle of a billionaire mother in Rich Mom Family Simulator Luxury Life! Play as a successful businesswoman, manage your family life, complete exciting missions, and enjoy the luxuries of…",
    "tags": [
      "Adventure",
      "Cars",
      "City",
      "Family",
      "Girls",
      "Helicopter"
    ],
    "mobile": false
  },
  {
    "id": "gm-weight-balance-journey",
    "name": "Weight Balance Journey",
    "url": "https://html5.gamemonetize.co/48zpict32o7g5a0qphsyqhoqpuay4sbu/",
    "description": "Race along the track and balance your body weight to hit the exact target! Choose between healthy fruits and high-calorie fast food to quickly gain or lose weight. Dodge obstacles, time your choices, and hit the scales…",
    "tags": [
      "Girls",
      "Arcade",
      "Eating",
      "Food",
      "Unity3D",
      "WebGL",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-ladder-rush-race",
    "name": "Ladder Rush Race",
    "url": "https://html5.gamemonetize.co/47pp4k53yrp6il0i2r5nrla7rqyxdnnw/",
    "description": "Race against a rival on colorful tracks and try to reach the finish line first. Collect pieces scattered along the route and use them to build ladders while running. A smart shortcut can give you the lead, but your…",
    "tags": [
      "Hypercasual",
      "Casual",
      "1 Player",
      "3D",
      "3D Games",
      "Best"
    ],
    "mobile": false
  },
  {
    "id": "gm-candy-sort",
    "name": "Candy Sort",
    "url": "https://html5.gamemonetize.co/zlf196g4gsw1q0mn9da7hgz7pmze6ij0/",
    "description": "Candy Sort is a colorful sorting puzzle where you move candies between tubes and group them by color. Place candies only in empty tubes or on the same-colored candy. Race against the clock, and when you need help, watch…",
    "tags": [
      "Puzzle",
      "Brain",
      "Candy",
      "Matching",
      "Skill",
      "Sort"
    ],
    "mobile": false
  },
  {
    "id": "gm-wild-fusion",
    "name": "Wild Fusion",
    "url": "https://html5.gamemonetize.co/liuwl3utknu4zastorky9717c0ws46li/",
    "description": "Wild Fusion is a relaxing and addictive idle merge game where you combine animals to discover new and powerful creatures. Merge two matching animals to unlock higher-level species, expand your collection, and fill the…",
    "tags": [
      "Puzzle",
      "Animal",
      "Click",
      "Fun",
      "Idle"
    ],
    "mobile": false
  },
  {
    "id": "gm-car-sort",
    "name": "Car Sort",
    "url": "https://html5.gamemonetize.co/wi2sygz4u42d0ri6hzc0vg47eo1gsvz6/",
    "description": "Car Sort is a colorful parking puzzle game. Tap a garage to send its front cars onto the road, then match cars with garages of the same color. Plan your moves, keep an eye on road capacity, and clear increasingly…",
    "tags": [
      "Puzzle",
      "1 Player",
      "Car",
      "Logic",
      "Parking",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-gta-vi-beat-em-up",
    "name": "GTA VI: Beat Em Up",
    "url": "https://html5.gamemonetize.co/8ihcqoxrpie9165sx8697owhxobc46lq/",
    "description": "GTA VI: Beat Em Up — a fan-made HTML5 arcade beat 'em up with illustrated sprite sheets. Fight through Vice City with Lucia or Jason.",
    "tags": [
      "Arcade",
      "Action",
      "Fight",
      "Fighting",
      "Street Fighting"
    ],
    "mobile": false
  },
  {
    "id": "gm-monster-chef",
    "name": "Monster Chef",
    "url": "https://html5.gamemonetize.co/bgdpkpt8yys7kbihrpzdr1ui5pwyl1jc/",
    "description": "Monster Chef is an exciting cooking game that mixes funny robot monsters with fast-paced restaurant challenges. Step into the kitchen as a monster chef and keep up with moving ingredients, cooking machines, and hungry…",
    "tags": [
      "Hypercasual",
      "Casual",
      "2D",
      "Cooking",
      "Management",
      "Robot",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-smash-yard",
    "name": "Smash Yard",
    "url": "https://html5.gamemonetize.co/40eh4ezzyojwexag8yzwf0t64iqfj944/",
    "description": "Rip off doors, smash windows and send wheels rolling across the yard. SMASH YARD lets you demolish 31 vehicles, from city cars and motorcycles to tanks, helicopters and a flying saucer. Collect cash, buy upgrades and…",
    "tags": [
      "Clicker",
      "Idle",
      "Car",
      "Casual",
      "Mapi games",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-animal-pair-card-match",
    "name": "Animal Pair Card Match",
    "url": "https://html5.gamemonetize.co/943achq6sxf10jbqe7tfm77p8p95lcbs/",
    "description": "Animal Pair Card Match is a charming matching puzzle game that combines cute animal cards and relaxing elimination gameplay. In this delightful matching puzzle game, your task is to find animal pairs by opening two…",
    "tags": [
      "Puzzle",
      "Casual",
      "Relaxation",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-9-ball-pool-3d",
    "name": "9 Ball Pool 3D",
    "url": "https://html5.gamemonetize.co/76h776f513292abtxz26npz9em4phv2w/",
    "description": "9 Ball Pool 3D is a polished 3D pool game from Crazygamesup.com. Challenge computer opponents, compete in a three-round championship, beat the clock, or sharpen your skills in the practice room. Choose between isometric…",
    "tags": [
      "Sports",
      "8 Ball Pool",
      "Ball",
      "Pool",
      "Stickman"
    ],
    "mobile": false
  },
  {
    "id": "gm-car-modding-contest",
    "name": "Car modding contest",
    "url": "https://html5.gamemonetize.co/j49m58ulm9j6szz9b16funi8xe3wxewp/",
    "description": "Customize your ultimate ride and go head-to-head in the high-octane Car Modding Contest! Swap rims, upgrade styles, and fine-tune every detail to create the coolest look on the asphalt. Out-style the competition, show…",
    "tags": [
      "Arcade",
      "Adventure",
      "Driving",
      "Unity3D",
      "WebGL",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-ashen-watch",
    "name": "Ashen Watch",
    "url": "https://html5.gamemonetize.co/1my3ybv9323z3oxhdn3ue8coegdkk1rn/",
    "description": "Princess Elira is sheltering inside the kingdom's last keep, surrounded by an endless siege. Control the guardian, defend the castle against waves of enemies, and survive for as long as you can. Fight eight enemy types…",
    "tags": [
      "Adventure",
      "Action",
      "Castle",
      "Dungeon",
      "Fantasy",
      "Strategy"
    ],
    "mobile": false
  },
  {
    "id": "gm-mimi-fish-market",
    "name": "Mimi Fish Market",
    "url": "https://html5.gamemonetize.co/d3gjefe76dyu2xgithka1cc8gfvt53z6/",
    "description": "Mimi the cat just took over a tiny fish stall on a sunny wooden pier - and she has big plans. Catch fish, stock the counters and ring up happy customers before they lose patience. Every coin goes back into your market…",
    "tags": [
      "Arcade",
      "1 Player",
      "3D",
      "3D Games",
      "Animal",
      "Cat"
    ],
    "mobile": false
  },
  {
    "id": "gm-limo-city-taxi-driver",
    "name": "Limo City Taxi Driver",
    "url": "https://html5.gamemonetize.co/jhoj4l53jeg9pp99eizr0q1l8pd38d8j/",
    "description": "Get behind the wheel of a city limousine and take on taxi driving missions. Pick up passengers, follow the city route and drive them to their destinations. Complete each trip while navigating the streets in this 3D city…",
    "tags": [
      "Racing",
      "Car",
      "City",
      "Driving",
      "Taxi"
    ],
    "mobile": false
  },
  {
    "id": "gm-skybound-dash-crown-rush",
    "name": "Skybound Dash: Crown Rush",
    "url": "https://html5.gamemonetize.co/du458ql8zys4bgvourom0t5p900tyalj/",
    "description": "Fly through neon thorn gates, collect royal crowns, and claim the sky throne in this fast-paced arcade adventure. Choose one of three royal relics before each run: the Crown Magnet attracts nearby crowns, the Guardian…",
    "tags": [
      "Arcade",
      "Casual",
      "Fantasy",
      "Fly",
      "Highscore",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-spellbound-orbs",
    "name": "Spellbound Orbs",
    "url": "https://html5.gamemonetize.co/x4zdnywz188d1kkb5j9cqrvx27jm2nxj/",
    "description": "Spellbound Orbs is a magical bubble shooter set in a wizards castle. Aim and shoot colorful orbs, match three or more of the same color to pop them, and watch the orbs below fall. Shots are limited, so aim carefully and…",
    "tags": [
      "Puzzle",
      "Bubble",
      "Bubble Shooter",
      "Casual",
      "Magic",
      "Match 3",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-sands-of-anubis",
    "name": "Sands of Anubis",
    "url": "https://html5.gamemonetize.co/p2my1v1gytx425ym0gd1rqh66x2cpe85/",
    "description": "Sands of Anubis is an Egyptian tile matching puzzle. Tap a tile to move it into your tray. Collect three matching tiles to clear them. Only tiles that are not covered by another tile can be picked, so plan your moves…",
    "tags": [
      "Puzzle",
      "Brain",
      "Casual",
      "Logic",
      "Mahjong",
      "Match 3",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-gorbo-the-orc-crown-quest",
    "name": "Gorbo the Orc: Crown Quest",
    "url": "https://html5.gamemonetize.co/x55nzv0rwhi8sm2cu3htvweaju963qft/",
    "description": "Gorbo the Orc is a bold, funny platform adventure. The Minotaur Warlord stole the golden crown of the Tusk Clan, and Gorbo is going to get it back, one monster at a time. New to platformers? The first levels teach you…",
    "tags": [
      "Adventure",
      "Action",
      "Cartoon",
      "Fantasy",
      "Jumping",
      "Monster"
    ],
    "mobile": false
  },
  {
    "id": "gm-level-once-again",
    "name": "Level Once Again",
    "url": "https://html5.gamemonetize.co/38cj7g6j8cq1g4brd97ij60u03hv90pr/",
    "description": "Level Once Again is a story-driven puzzle platformer with 100 rooms, 4 worlds and 7 bosses. Kaal has kidnapped Tara — guide Veer through 100 trapped rooms to rescue her. Same room, same door, but a brand new trick every…",
    "tags": [
      "Puzzle",
      "2026 games",
      "2D",
      "Action",
      "Adventure",
      "Arcade"
    ],
    "mobile": false
  },
  {
    "id": "gm-bus-subway-rush",
    "name": "Bus & Subway Rush",
    "url": "https://html5.gamemonetize.co/pa0iy3wslg00wpgbamriz2bgwg1mkgbr/",
    "description": "Race through a busy city as you follow the bus and subway route. Dodge obstacles, switch lanes, collect rewards, and keep moving through the streets in this fast-paced runner.",
    "tags": [
      "Racing",
      "Bus",
      "Running",
      "Subway",
      "Traffic",
      "Transport",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-half-life-2-beat-em-up",
    "name": "Half Life 2: Beat Em Up",
    "url": "https://html5.gamemonetize.co/5k8w543h2ldlccebdl7ujohro5m43g3n/",
    "description": "Fight through City 17, Route Kanal, Ravenholm, Nova Prospekt and the Citadel in Half-Life 2: Beat Em Up. A Flash-style HTML5 fan game.",
    "tags": [
      "Arcade",
      "2D",
      "Action",
      "Adventure",
      "Platform"
    ],
    "mobile": false
  },
  {
    "id": "gm-grazing-giraffe",
    "name": "Grazing Giraffe",
    "url": "https://html5.gamemonetize.co/9qul12b0dmx5vc8bhrmla6dqgy1u6f67/",
    "description": "Grazing Giraffe is a cozy sliding puzzle game about one very hungry, very long giraffe. Swipe to send your giraffe gliding across the savanna. It keeps sliding until it hits something, stretching its neck behind it as…",
    "tags": [
      "Puzzle",
      "1 Player",
      "2026 games",
      "Animal",
      "Slide",
      "Snake"
    ],
    "mobile": false
  },
  {
    "id": "gm-monster-versus-human",
    "name": "Monster Versus Human",
    "url": "https://html5.gamemonetize.co/zt6dvwgq7ckwyau5ry7tao0o6xaydfvy/",
    "description": "Choose your side in Monster Versus Human. Humans scavenge the dark with flashlights and firearms, fighting to survive. Monsters possess complete dark vision, hunting prey to collect power-boosting vials. Eradicate the…",
    "tags": [
      "Arcade",
      "Action",
      "Adventure",
      "Horror",
      "Monster",
      "Shoot 'Em Up",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-american-truck-racing-simulator",
    "name": "American Truck Racing Simulator",
    "url": "https://html5.gamemonetize.co/vt33o3gi9qthjztujt69imrmds1sh0g4/",
    "description": "Hit the highway in American Truck Racing Simulator, a pixel art arcade racer from BREYMANTECH 2026! Race powerful American trucks across 40 tracks in 8 USA cities, including Los Angeles, Las Vegas, New York, and Miami…",
    "tags": [
      "Racing",
      "Drift",
      "Fall Guys",
      "Free games for your website",
      "Truck"
    ],
    "mobile": false
  },
  {
    "id": "gm-noob-vs-pro-drift-tag",
    "name": "Noob vs Pro : Drift Tag",
    "url": "https://html5.gamemonetize.co/636u96ceecrh8juric5ckmfn486xhagi/",
    "description": "Noob vs Pro: Drift Tag — use your speed, drifting skills, and reflexes to pass the bomb to your opponents! The car holding the bomb must pass it to another player before the timer runs out. If you are caught with the…",
    "tags": [
      "3D",
      "1 Player",
      "2 Player",
      "2 Player Games",
      "2026 games",
      "3D Games"
    ],
    "mobile": false
  },
  {
    "id": "gm-hellgate-1993",
    "name": "Hellgate 1993",
    "url": "https://html5.gamemonetize.co/zz8qd7c8fhk3drl98iy3ulzokk2pigzs/",
    "description": "Hellgate 1993 is a fast, retro-inspired first-person shooter set inside a dying horror-sci-fi facility. Fight through eight hostile worlds, uncover secret routes, unlock sealed sectors, collect stronger weapons, and…",
    "tags": [
      "Shooting",
      ".io Games",
      "1 Player",
      "Action",
      "Alien",
      "Amazing"
    ],
    "mobile": false
  },
  {
    "id": "gm-live-eating-simulator",
    "name": "Live Eating Simulator",
    "url": "https://html5.gamemonetize.co/nwyqbc4h4aji2oauz95s0mvlu6qjvit5/",
    "description": "Step into the ultimate eating simulator livestream! Control every bite, devour massive food challenges, and level up your streamer persona in real time. Grab dishes, manage your hunger, and keep your virtual viewers…",
    "tags": [
      "Girls",
      "Arcade",
      "Eating",
      "Food",
      "Girl",
      "Simulator",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-dirt-bike-trail-rider",
    "name": "Dirt Bike Trail Rider",
    "url": "https://html5.gamemonetize.co/yawgz3rbs244inufvnm241bgbhkwkls8/",
    "description": "Ride a dirt bike across rugged off-road tracks. Accelerate over rough terrain, steer through bumps and jumps, and keep your bike upright as you race toward the finish. Complete a series of motocross stages in this 3D…",
    "tags": [
      "Racing",
      "Moto",
      "Motocross",
      "Motorcycle",
      "Offroad"
    ],
    "mobile": false
  },
  {
    "id": "gm-hazard-pay",
    "name": "Hazard Pay",
    "url": "https://html5.gamemonetize.co/vvq271vb17nl4xe6vbfstdu2tdrskjv9/",
    "description": "Hazard Pay is a troll platformer set in the worst factory on earth: floors vanish, doors run away and spikes pop up right where you land. Pick your worker: Cinder the salamander wall-jumps, Pip the crash-test dummy…",
    "tags": [
      "Arcade",
      "1 Player",
      "2D",
      "Funny",
      "Skill",
      "Trap"
    ],
    "mobile": false
  },
  {
    "id": "gm-horizon-highway-driving",
    "name": "Horizon Highway Driving",
    "url": "https://html5.gamemonetize.co/tqtyozvuhwfi20opew7hgp50ivsrl5sf/",
    "description": "Risk the gap. Build the combo. Earn boost. Survive an endless highway through changing traffic, locations, and a dynamic day/night cycle.",
    "tags": [
      "Racing",
      "Car",
      "Cars",
      "Driving",
      "Race",
      "Supercars"
    ],
    "mobile": false
  },
  {
    "id": "gm-football-pinball",
    "name": "Football Pinball",
    "url": "https://html5.gamemonetize.co/3bnqfymmfabg909tta4x5blolu4hc9ox/",
    "description": "Football Pinball is a pinball table shaped like a football pitch, seen from your own end. Two flippers are all you get. The ball rolls down at you, and whatever drains between them is a goal for the other side — there…",
    "tags": [
      "Sports",
      "3D Games",
      "Football",
      "Fun",
      "Soccer",
      "Sport"
    ],
    "mobile": false
  },
  {
    "id": "gm-animal-kart",
    "name": "Animal Kart",
    "url": "https://html5.gamemonetize.co/lf71s8go58p92avbs0vueoa6sfakouib/",
    "description": "A side-scrolling kart racer starring ten cartoon animals — a crowned lion, a war-bonnet elephant, a rhino in a police cap and friends. Race 60 tracks across jungle, desert, south pole and volcano, double-jumping hazards…",
    "tags": [
      "Racing",
      "1 Player",
      "Android",
      "Animal",
      "Car",
      "Kart"
    ],
    "mobile": false
  },
  {
    "id": "gm-junkyard-builder-3d",
    "name": "Junkyard Builder 3D",
    "url": "https://html5.gamemonetize.co/6roddzn3103dv79czra8xku3yqfk00oy/",
    "description": "Build a custom offroad truck and take it from a dusty junkyard to 10 driving worlds. Earn coins on each run and upgrade 10 part categories, including engines, wheels, suspension and turbo. Personalize your truck with…",
    "tags": [
      "Racing",
      "1 Player",
      "Car tuning",
      "Driving",
      "Offroad",
      "Truck"
    ],
    "mobile": false
  },
  {
    "id": "gm-ninja-platformer-rage",
    "name": "Ninja Platformer Rage",
    "url": "https://html5.gamemonetize.co/h4uqr70uoo96oqnnx40pq11yxgdf7ee8/",
    "description": "Master precise movement, outsmart deadly traps, and survive brutally short platforming challenges in this fast-paced ninja adventure. Throw your shadow, teleport through danger, climb walls, double-jump, and race for…",
    "tags": [
      "Arcade",
      "1 Player",
      "2026 games",
      "Action",
      "Best Games",
      "Platform"
    ],
    "mobile": false
  },
  {
    "id": "gm-besties-chinese-new-year-celebration",
    "name": "Besties Chinese New Year Celebration",
    "url": "https://html5.gamemonetize.co/iwqmmm7nz3r1uy7y4kcrzmz37tmtsotz/",
    "description": "Besties Chinese New Year Celebration invites you into a joyful world of color, tradition, and friendship as you help best friends prepare for the Lunar New Year. Dress them up in beautiful traditional outfits, elegant…",
    "tags": [
      "Girls",
      "Cute",
      "Dress Up",
      "Fashion"
    ],
    "mobile": false
  },
  {
    "id": "gm-magnet-master-3d",
    "name": "Magnet Master 3D",
    "url": "https://html5.gamemonetize.co/do1hrzzh2p46fl6i10z5gyjh1zom9cs0/",
    "description": "Take control of a powerful industrial magnet and clean up the yard! Collect metal scrap, carry it to the sell zone and turn every load into cash. Upgrade your magnets power, range, capacity and value to lift heavier…",
    "tags": [
      "Clicker",
      "Idle",
      "3D",
      "Mapi games",
      "Simulation",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-city-rescue-forklift-simulator",
    "name": "City Rescue Forklift Simulator",
    "url": "https://html5.gamemonetize.co/ybxv1p2z4wg72lsupa3bdv9u6byuh4j2/",
    "description": "Drive a powerful city rescue forklift through challenging urban missions, transport damaged cars, answer emergency calls, and deliver vehicles safely before time expires. Navigate busy streets, master realistic…",
    "tags": [
      "Action",
      "3D",
      "Car",
      "City",
      "Driving",
      "Rescue"
    ],
    "mobile": false
  },
  {
    "id": "gm-nightmare-2d-shooters",
    "name": "Nightmare 2D Shooters",
    "url": "https://html5.gamemonetize.co/xoppirglrqu72wk9537h4jyxint8ts2u/",
    "description": "Blast through a chaotic, action-packed Nightmare 2D Shooter! A heroic constructor battles a monstrous, multi-eyed alien swarm using a massive, fire-breathing minigun. Help him defend the red monster truck against…",
    "tags": [
      "Shooting",
      "Action",
      "Adventure",
      "Arcade",
      "Shoot 'Em Up",
      "Side Scrolling"
    ],
    "mobile": false
  },
  {
    "id": "gm-marvelous-girl-skate",
    "name": "Marvelous Girl Skate",
    "url": "https://html5.gamemonetize.co/et1p3v517bjka801xmclcf38co3vzqqu/",
    "description": "Marvelous Girl Skate is an exhilarating arcade experience where you control a stylish superheroine on high-tech blades. Perform gravity-defying tricks, avoid obstacles, and collect boosts. Compete in vibrant races…",
    "tags": [
      "Girls",
      "Adventure",
      "Arcade",
      "Ice",
      "Skating",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-stellar-bastion",
    "name": "Stellar Bastion",
    "url": "https://html5.gamemonetize.co/l51v249mbmf7kim7x98m4epn7h6l7lr5/",
    "description": "Stellar Bastion is an endless wave-survival shooter. You are the last gunner on a star-fortress flight deck, and the bugs only want one thing: you. Hold to move while your rifle auto-fires at the nearest bug — aiming is…",
    "tags": [
      "Shooting",
      "1 Player",
      "Arcade",
      "Fire",
      "Shooter",
      "Survival"
    ],
    "mobile": false
  },
  {
    "id": "gm-chubby-duck-offroad",
    "name": "Chubby Duck Offroad",
    "url": "https://html5.gamemonetize.co/3b4lbx64phythr2fncybauvab2pxfheb/",
    "description": "One descent down a freshly dealt mountain — gravity is the engine, and your air rotation is the only resource you cant take back. Follow the speed signs, land on the back of every hill, hop the boulders, ride the logs…",
    "tags": [
      "Sports",
      "1 Player",
      "2D",
      "Motocross",
      "Physics",
      "Racing"
    ],
    "mobile": false
  },
  {
    "id": "gm-gears-of-war-beat-em-up",
    "name": "Gears of War: Beat Em Up",
    "url": "https://html5.gamemonetize.co/6n4d36pfq6n1iquub0h4xrc7k2fjf0hc/",
    "description": "A fan-made Gears of War arcade beat em up. Fight across five chapters with melee combos, a chainsaw, Lancer fire, and active reloads.",
    "tags": [
      "Arcade",
      "Action",
      "Adventure",
      "Brawl",
      "Fight",
      "Fighting"
    ],
    "mobile": false
  },
  {
    "id": "gm-resident-evil-4-beat-em-up",
    "name": "Resident Evil 4: Beat Em Up",
    "url": "https://html5.gamemonetize.co/g8jzthofuisxar7k6198qdq23asje3cd/",
    "description": "In Resident Evil 4: Beat Em Up your missio is to fight through five chapters and fifteen areas as Leon in a Flash-style arcade brawler.",
    "tags": [
      "Arcade",
      "Action",
      "Brawl",
      "Fight",
      "Fighting"
    ],
    "mobile": false
  },
  {
    "id": "gm-solitaire-the-collection",
    "name": "Solitaire The Collection",
    "url": "https://html5.gamemonetize.co/9ewzcyj8pfv03szsnvttetel94nk2ixx/",
    "description": "33 card game variants in one collection. Play familiar solitaires, discover new rules and pick the difficulty — from a calm deal to a real puzzle. Modes include Klondike with draw one or three; Spider with one, two or…",
    "tags": [
      "Puzzle",
      "Card",
      "Solitaire"
    ],
    "mobile": false
  },
  {
    "id": "gm-brainrot-crush",
    "name": "Brainrot Crush",
    "url": "https://html5.gamemonetize.co/mqobw8qyrsumkji3anzq1fc7lhwpz8nm/",
    "description": "Dive into the colorful world of Italian memes with Brainrot Match! This exciting Match-3 puzzle game features 6 hilarious character gems, 3 powerful bonuses, and 15 levels of pure meme madness. Swap gems, create combos…",
    "tags": [
      "Puzzle",
      "Brainrot Italian",
      "Brainrot sahuuur",
      "Logic",
      "Match 3",
      "Match-3"
    ],
    "mobile": false
  },
  {
    "id": "gm-blast-round-puzzle-block",
    "name": "Blast Round Puzzle Block",
    "url": "https://html5.gamemonetize.co/1r3vf2btxys8htu4uiuhz8gmfwblia9x/",
    "description": "Blast Round is a colorful block puzzle game where every move matters. Drag and place block pieces on the board, complete full rows and columns, build combos and earn points. Progress through challenging levels, face…",
    "tags": [
      "Puzzle",
      "1 Player",
      "Arcade",
      "Block",
      "Logic"
    ],
    "mobile": false
  },
  {
    "id": "gm-infinity-sky",
    "name": "Infinity Sky",
    "url": "https://html5.gamemonetize.co/mh41099jduus5jn9kiny2zrm5yfv5ood/",
    "description": "Guide your bouncing hero up endless platforms! Dodge monsters, collect rewards, and see how high you can climb in this addictive vertical jumper.",
    "tags": [
      "Hypercasual",
      "Casual",
      "Fun",
      "Funny",
      "Jump",
      "Jumping"
    ],
    "mobile": false
  },
  {
    "id": "gm-flume-v2",
    "name": "Flume (V2)",
    "url": "https://html5.gamemonetize.co/kyb3t69qc3gowmrh0m705c5cisezb3mi/",
    "description": "Flume is a 3D endless runner inside a half-pipe that never stops. Speed is life: the faster you go, the longer you last. Three difficulties, simple tutorial, racing mode to beat your past self in speed and score! Unlock…",
    "tags": [
      "Hypercasual",
      "Casual",
      "Ball",
      "Endless",
      "Mobile",
      "Obstacle"
    ],
    "mobile": true
  },
  {
    "id": "gm-crazy-aunty-slap-punch",
    "name": "Crazy Aunty: Slap & Punch",
    "url": "https://html5.gamemonetize.co/ntlg69pmvru6z89fqoa41y5yrb3g4bk2/",
    "description": "Had a long day and need to blow off some steam? Meet Crazy Aunty, the hilarious anti-stress punch game packed with silly chaos and endless fun! Step into a crazy family gathering where Aunty wont stop with her annoying…",
    "tags": [
      "Hypercasual",
      "Casual",
      "3D Games",
      "Angry",
      "Attack",
      "Crazy"
    ],
    "mobile": false
  },
  {
    "id": "gm-night-silk-dark-city-fashionistas",
    "name": "Night Silk Dark City Fashionistas",
    "url": "https://html5.gamemonetize.co/bo4cuhlf1duw2ybtze44y1i2r0c8udgv/",
    "description": "Welcome to a world where fashion meets mystery. The city is falling asleep, but for the noir ladies, life is just beginning. Two friends live in this gloomy place. And tonight they will have a magnificent Gothic ball in…",
    "tags": [
      "Girls",
      "Dress Up",
      "Fashion",
      "Hair",
      "Makeover"
    ],
    "mobile": false
  },
  {
    "id": "gm-geometry-vibes-monster",
    "name": "Geometry Vibes Monster",
    "url": "https://html5.gamemonetize.co/llzvzezydjnjt8wiflahwzvqh9tkwjse/",
    "description": "Geometry Vibes Monster is a reaction-based arcade game where you must dodge incoming obstacles, spikes, and battle against a variety of unique monsters. Each monster features distinct attack patterns that you must…",
    "tags": [
      "Arcade",
      "2 Player",
      "2 Player Games",
      "Action",
      "Geometry",
      "Monster"
    ],
    "mobile": false
  },
  {
    "id": "gm-the-rings",
    "name": "The Rings",
    "url": "https://html5.gamemonetize.co/9163012s0knoiemc8880q6uvynz7gefl/",
    "description": "Get ready to test your brain with The Rings, a fun and addictive puzzle game that challenges your logic and strategy skills! Your goal is simple: place and arrange rings in the correct positions to complete each level.",
    "tags": [
      "Puzzle",
      "2026 games",
      "Amazing",
      "Casual",
      "Fun"
    ],
    "mobile": false
  },
  {
    "id": "gm-shark-rampage",
    "name": "Shark Rampage",
    "url": "https://html5.gamemonetize.co/674y91c8lumzbgouyanbmbwq2enbaxas/",
    "description": "Unleash chaos in this action-packed underwater game where you play as an apex predator! Terrorize the coastline, smash through wooden boats, and devour unsuspecting swimmers. Upgrade your sharp jaws, build explosive…",
    "tags": [
      "Arcade",
      "Action",
      "Animal",
      "Killing",
      "Shark",
      "Unity3D"
    ],
    "mobile": false
  },
  {
    "id": "gm-crush-yard-tycoon",
    "name": "Crush Yard Tycoon",
    "url": "https://html5.gamemonetize.co/sf271vzoj4z4ob0u3mutddq1efuyh9ie/",
    "description": "**Crush Yard Tycoon** is a fast and satisfying 3D car crushing game! Run your own junkyard, smash cars with a powerful hydraulic press, earn cash and upgrade your Power, Speed and Value. Unlock new vehicles, expand your…",
    "tags": [
      "Clicker",
      "Idle",
      "3D",
      "Casual",
      "Mapi games",
      "Simulation",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-police-car-stunt-challenge",
    "name": "Police Car Stunt Challenge",
    "url": "https://html5.gamemonetize.co/wndkbjv4c3fqswx8waemnictwxggljwq/",
    "description": "Drive powerful police cars across extreme sky tracks filled with ramps, loops, rotating barriers, narrow platforms, and huge jumps. Choose your patrol vehicle, complete challenging stunt levels, collect coins, and…",
    "tags": [
      "Racing",
      "3D",
      "Car",
      "Driving",
      "Police",
      "Stunts"
    ],
    "mobile": false
  },
  {
    "id": "gm-raccoon-bubble-shooter",
    "name": "Raccoon Bubble Shooter",
    "url": "https://html5.gamemonetize.co/k15nggwmy4o0jr8bmrykxwzzzojs9skb/",
    "description": "Get ready for a fun and relaxing puzzle adventure with Raccoon Bubble Shooter! Join a cute and clever raccoon on a colorful journey filled with exciting bubble-popping challenges. In this addictive bubble shooter game…",
    "tags": [
      "Puzzle",
      "2026 games",
      "Amazing",
      "Casual",
      "Fun",
      "Hypercasual"
    ],
    "mobile": false
  },
  {
    "id": "gm-sorting-ball-quiz",
    "name": "Sorting Ball Quiz",
    "url": "https://html5.gamemonetize.co/vu4p7t346vekkc2iuth6wmgcfxl1fe56/",
    "description": "Test your brain and sharpen your logic skills with Sorting Ball Quiz! This addictive puzzle game challenges you to sort colorful balls into the correct tubes using strategy and smart thinking. Your mission is simple…",
    "tags": [
      "Puzzle",
      "2026 games",
      "Amazing",
      "Casual",
      "Fun",
      "Hypercasual"
    ],
    "mobile": false
  },
  {
    "id": "gm-mummy-candy",
    "name": "Mummy Candy",
    "url": "https://html5.gamemonetize.co/i98to949471o4zksm1nhsf4knwcg0np5/",
    "description": "Mummy Candy is a fun physics-based cut-the-rope puzzle game set in ancient Egypt. Help a hungry little mummy get the tasty candies by cutting ropes at the right moment so the treats fall into its mouth. Guide candies…",
    "tags": [
      "Puzzle",
      "Candy"
    ],
    "mobile": false
  },
  {
    "id": "gm-frosty-rush",
    "name": "Frosty Rush",
    "url": "https://html5.gamemonetize.co/5msi1tw99926gtn65ofxvfebxdcor1yb/",
    "description": "Frosty Rush is a cozy winter logic puzzler. Roll snowballs through icy levels, grow them bigger and merge the two parts of your snowman to complete each puzzle. 100 handcrafted levels of pure brain-teasing fun.",
    "tags": [
      "Puzzle",
      "1 Player",
      "Hypercasual",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-tile-match-guard-baby",
    "name": "Tile Match Guard Baby",
    "url": "https://html5.gamemonetize.co/purlgyhdin0alzi82kww6fxfxw9r9ycq/",
    "description": "Tile Match Guard Baby is a fun and relaxing puzzle game where you match colorful tiles to protect a sleeping baby from cute, mischievous monsters!",
    "tags": [
      "Puzzle",
      "1 Player",
      "Baby",
      "Cute",
      "Match 3",
      "Match-3"
    ],
    "mobile": false
  },
  {
    "id": "gm-brain-jam",
    "name": "Brain Jam",
    "url": "https://html5.gamemonetize.co/24jk66mwimto4md4vl4poohkwgkhdbi7/",
    "description": "Brain Jam is a sliding car puzzle with one twist: it counts the calories your brain burns while you think. The parking lot is jammed. Slide the cars out of the way and drive the red one to the exit. Every second you…",
    "tags": [
      "Puzzle",
      "Brain",
      "Car",
      "Casual",
      "Logic",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-yolk-ops-egg-arena",
    "name": "Yolk Ops Egg Arena",
    "url": "https://html5.gamemonetize.co/ouii8m4hdcwu1w3h50y21kvfu2uvhuz1/",
    "description": "Yolk Ops is a first-person arena shooter where egg fighters battle across eight unique 3D maps. Play Free for All, Team Scramble, or King of the Yolk against AI bots. Choose from seven primary weapons and a sidearm, use…",
    "tags": [
      "Shooting",
      ".io Games",
      "First Person Shooter"
    ],
    "mobile": false
  },
  {
    "id": "gm-steel-directive-city-zero",
    "name": "Steel Directive: City Zero",
    "url": "https://html5.gamemonetize.co/2htlt0jzz98u493u3z9jt9wsykiqtv0a/",
    "description": "Take back City Zero as an armored enforcer in this 2D action shooter. Fight human gangs, confront increasingly dangerous robots, and defeat powerful bosses across 20 distinct missions. Rescue civilians, collect…",
    "tags": [
      "Shooting",
      "1 Player",
      "2D",
      "Action",
      "Robot"
    ],
    "mobile": false
  },
  {
    "id": "gm-black-hole-swallow-master",
    "name": "Black Hole Swallow Master",
    "url": "https://html5.gamemonetize.co/spagtaqty5vokjah2z0gcuytvz8ticym/",
    "description": "Black Hole Swallow Master is an exciting and addictive casual arcade game where you control a powerful black hole and swallow everything in your path. Move around the environment, collect objects, grow bigger, and…",
    "tags": [
      "Puzzle",
      "2026 games",
      "Adventure",
      "Best Games",
      "Casual"
    ],
    "mobile": false
  },
  {
    "id": "gm-online-kitpvp-50vs50",
    "name": "Online KitPvP : 50vs50",
    "url": "https://html5.gamemonetize.co/2ipfjlhx61qegnkn7ldkh2gig46ytn1z/",
    "description": "Join exciting battles against real players in Online Kit PvP! Enter the arena, choose the kit that suits you, and fight against your opponents. Use different equipment and abilities to define your playstyle, move…",
    "tags": [
      "Multiplayer",
      "1 Player",
      "2026 games",
      "3D",
      "3D Games",
      "Arena"
    ],
    "mobile": false
  },
  {
    "id": "gm-twist-and-tug",
    "name": "Twist and Tug",
    "url": "https://html5.gamemonetize.co/kexlo2sm796v7rd06e3j39dkj2lz3bkd/",
    "description": "**Twist and Tug** is a creative rope puzzle game where you drag, connect, and arrange ropes to match the target shape. Position each node carefully, prevent ropes from overlapping, and recreate the correct pattern to…",
    "tags": [
      "Puzzle",
      "Brain",
      "Casual",
      "Fun",
      "Logic"
    ],
    "mobile": false
  },
  {
    "id": "gm-stacky-hero-master-game",
    "name": "Stacky Hero Master Game",
    "url": "https://html5.gamemonetize.co/9q88up7l4oitsteo10kd09cou3g5bdy9/",
    "description": "Welcome to Stacky Hero Master Games: Bridge Runner Games, which is a fun and exciting maze puzzle game that challenges your brain while giving you hours of entertainment. Move through colorful mazes, collect blocks…",
    "tags": [
      "Puzzle",
      "2026 games",
      "Amazing",
      "Best Games",
      "Casual",
      "Fun"
    ],
    "mobile": false
  },
  {
    "id": "gm-rope-push-game",
    "name": "Rope Push Game",
    "url": "https://html5.gamemonetize.co/g6mfkfrja0qeptcd1xy5fiwv4xxtklwd/",
    "description": "Test your strength and timing in Rope Push Game! Control the rope and push your opponent toward the edge of the arena. Pull and push at the right moment, maintain your balance, and use smart moves to gain the advantage…",
    "tags": [
      "Puzzle",
      "2026 games",
      "Best",
      "Best Games",
      "Brain",
      "Hypercasual"
    ],
    "mobile": false
  },
  {
    "id": "gm-crazy-bus-escape-runner",
    "name": "Crazy Bus Escape Runner",
    "url": "https://html5.gamemonetize.co/tktierqxsemt0iifx5x9had63otarsz0/",
    "description": "Lead a fearless crowd through chaotic city roads in Crazy Bus Escape Runner. Swipe or use the keyboard to dodge dangerous obstacles, recruit new runners, survive brutal traps, and reach the finish together. Complete…",
    "tags": [
      "Arcade",
      "3D",
      "Action",
      "Casual",
      "Mobile",
      "Obstacle"
    ],
    "mobile": true
  },
  {
    "id": "gm-car-smash-obby-3d",
    "name": "CAR SMASH OBBY 3D",
    "url": "https://html5.gamemonetize.co/akpoe15y02690iqssyoqm6dpotmcpuxl/",
    "description": "Smash barriers, dodge giant traps and reach the finish in a car that can fall apart! Conquer 36 obstacle courses across six colorful worlds. Time your run past swinging hammers and crushers, jump gaps and escape giant…",
    "tags": [
      "Racing",
      "Car",
      "Destruction",
      "Driving",
      "Obstacle",
      "Physics"
    ],
    "mobile": false
  },
  {
    "id": "gm-car-obby-3d",
    "name": "Car Obby 3D",
    "url": "https://html5.gamemonetize.co/0hbbm274a3v134mfpe2z7cgjy6ylxsji/",
    "description": "Drive a tiny car across 12 floating obstacle courses in Car Obby 3D. Dodge swinging hammers, spinning obstacles and moving platforms, collect coins and reach checkpoints above the clouds. Unlock eight car designs or buy…",
    "tags": [
      "Racing",
      "Car",
      "Collecting",
      "Driving",
      "Jumping",
      "Obstacle"
    ],
    "mobile": false
  },
  {
    "id": "gm-bum-brawl-heaven",
    "name": "Bum Brawl Heaven",
    "url": "https://html5.gamemonetize.co/afn4dij4qfblxysmsbbok007o2jxkmwq/",
    "description": "Brawl through five heavenly locations against sixty angels in Bum Brawl: Heaven. Battle runners, sentinels, and scribes, collect power-ups, and unleash your halo special.",
    "tags": [
      "Adventure",
      "Action",
      "Brawl",
      "Fight",
      "Fighting"
    ],
    "mobile": false
  },
  {
    "id": "gm-doomfront-iron-breach",
    "name": "Doomfront Iron Breach",
    "url": "https://html5.gamemonetize.co/t34z5o1hxwvn0fzanw148uxis4ix8b7p/",
    "description": "Fight through industrial bunkers, badlands, a spaceport, and the Overlords fortress in Doomfront: Iron Breach, a sci-fi first-person shooter with six enemy types, five animated weapons, and five expansive sectors.",
    "tags": [
      "Shooting",
      "3D",
      "3D Games",
      "First Person Shooter",
      "Shoot",
      "Shoot 'Em Up"
    ],
    "mobile": false
  },
  {
    "id": "gm-robotu-rebellion",
    "name": "Robotu Rebellion",
    "url": "https://html5.gamemonetize.co/nbvkl1yokf7f1v1e64mcwjxt35h6vhqc/",
    "description": "**Robotu Rebellion** is an action-packed puzzle escape game where you control a robot trapped inside a dangerous factory. Avoid deadly lasers, mechanical traps, and hostile security robots while searching for a way out…",
    "tags": [
      "Adventure",
      "Battle",
      "Escape",
      "Robot",
      "Shooting"
    ],
    "mobile": false
  },
  {
    "id": "gm-cosmetic-run",
    "name": "Cosmetic Run",
    "url": "https://html5.gamemonetize.co/nt4f4wm767onc1hr64eon89up2ywq4b2/",
    "description": "Dash, blend, and buff your way to glory in Cosmetic Run! Play as fabulous makeup brushes and stylish runner girls racing through glamorous, high-stakes tracks. Dodge messy makeup spills, collect glowing highlighters…",
    "tags": [
      "Arcade",
      "Adventure",
      "Girls",
      "Makeover",
      "Running",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-ridge-racer-2d",
    "name": "Ridge Racer 2D",
    "url": "https://html5.gamemonetize.co/ui4iefs3st4uup3vw9p77lyycacnxml9/",
    "description": "Conquer unforgiving terrain in Ridge Racer 2D, a high-octane physics racer where precision throttle control meets rugged elevation. Balance momentum, upgrade custom vehicles, and master treacherous inclines across…",
    "tags": [
      "Arcade",
      "Adventure",
      "Car",
      "Driving",
      "Unity3D",
      "WebGL"
    ],
    "mobile": false
  },
  {
    "id": "gm-bike-obby-draw-pencil",
    "name": "Bike Obby Draw Pencil",
    "url": "https://html5.gamemonetize.co/y6wq6n3z1bh9xf8lorl7uve5sz2d2uha/",
    "description": "Use your creativity and reflexes to complete the missing paths in 3D Side Platform Obby Draw Pencil! Draw paths with your pencil across the gaps between platforms to help your character move forward safely. Overcome…",
    "tags": [
      "Adventure",
      "1 Player",
      "2026 games",
      "3D",
      "3D Games",
      "Action",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-resident-evil-4-2-5d-fps",
    "name": "Resident Evil 4: 2.5D FPS",
    "url": "https://html5.gamemonetize.co/d9li5w4o71g2zws8dhdqb9r21egoak7z/",
    "description": "Enter the village. Survive five chapters of illustrated survival-horror action in Resident Evil 4: 2.5D FPS, an unofficial fan game.",
    "tags": [
      "Shooting",
      "2D",
      "Action",
      "First Person Shooter",
      "Shoot",
      "Shoot 'Em Up"
    ],
    "mobile": false
  },
  {
    "id": "gm-geometry-vibes-x-arrow",
    "name": "Geometry Vibes X Arrow",
    "url": "https://html5.gamemonetize.co/z1f0avym9sh561rg8yu3hlmzy2u2zuvx/",
    "description": "Geometry Vibes X Arrow is the newest evolution of the Geometry Vibes series, offering the most refined, competitive and customizable arrow experience so far. The goal is simple but demanding: guide your arrow through…",
    "tags": [
      "Arcade",
      "2 Player",
      "2 Player Games",
      "Arrow",
      "Geometry"
    ],
    "mobile": false
  },
  {
    "id": "gm-hellforge-demon-protocol",
    "name": "Hellforge: Demon Protocol",
    "url": "https://html5.gamemonetize.co/qbflb7jktdwh6xibtrub9u3pb6u3g5h6/",
    "description": "Hellforge: Demon Protocol is a 2D side-scrolling run-and-gun campaign with 20 industrial missions and progressive difficulty. Fight patrol soldiers, shield troops, gatling brutes, mech hounds and berserkers. Survive 16…",
    "tags": [
      "Shooting",
      "2D",
      "Action",
      "Monster",
      "Platform",
      "Shooter"
    ],
    "mobile": false
  },
  {
    "id": "gm-mag-roller",
    "name": "Mag Roller",
    "url": "https://html5.gamemonetize.co/xsdhcwwkr1v7xhzx661raou0zmcdf9df/",
    "description": "Take control of Mag-Roller, a high-velocity magnetic sphere that pulls nearby cubes into its orbit. Roll through chaotic levels, build massive block armor on the fly, crush obstacles, and harness electromagnetic force…",
    "tags": [
      "Arcade",
      "Adventure",
      "Ball",
      "Fun",
      "Unity3D",
      "WebGL"
    ],
    "mobile": false
  },
  {
    "id": "gm-hungry-snail",
    "name": "Hungry Snail",
    "url": "https://html5.gamemonetize.co/07fn7r1pkm60zfiwyp3zh09c3x7ze3ro/",
    "description": "**Hungry Snail** is a fun logic puzzle game where you help a cute snail find its way home. Move ground tiles to create the perfect path, avoid tricky obstacles, and collect as many stars as possible along the way. Each…",
    "tags": [
      "Puzzle",
      "Animal",
      "Brain",
      "Fun",
      "Logic"
    ],
    "mobile": false
  },
  {
    "id": "gm-toca-hidden-stars",
    "name": "Toca: Hidden Stars",
    "url": "https://html5.gamemonetize.co/c4279mjc3s45lxeut5brhbrl74zdd5np/",
    "description": "Play Toca: Hidden Stars online and put your observation skills to the test! Explore colorful scenes filled with friendly characters, adorable animals, and cozy locations as you search for cleverly hidden stars. Every…",
    "tags": [
      "Girls",
      "Cartoon",
      "Collecting",
      "Fun",
      "Hidden",
      "Hypercasual",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-blocky-shooter-game",
    "name": "Blocky Shooter Game",
    "url": "https://html5.gamemonetize.co/nsn74axhtl2tcff5bllguo1k63cwy2de/",
    "description": "Blocky Shooter Game is an exciting action-packed shooting game featuring a colorful block-style world, challenging enemies, and fast-paced combat. Step into the battlefield, aim carefully, and use your shooting skills…",
    "tags": [
      "Puzzle",
      "2026 games",
      "Amazing",
      "Best Games",
      "Casual",
      "Fun"
    ],
    "mobile": false
  },
  {
    "id": "gm-highway-rush-overdrive",
    "name": "Highway Rush Overdrive",
    "url": "https://html5.gamemonetize.co/2e574p4v2xfg8zsapc73niqji1aera5k/",
    "description": "Highway Rush Overdrive is An arcade highway driving game. Race through the city, weave through traffic, chain near misses and unleash Overdrive.",
    "tags": [
      "Racing",
      "Arcade",
      "Driving",
      "Race"
    ],
    "mobile": false
  },
  {
    "id": "gm-rooster-ranch",
    "name": "Rooster Ranch",
    "url": "https://html5.gamemonetize.co/vxjix1iu7qa7t8yt7tro0gfn3qnjkhlc/",
    "description": "Rooster Ranch is a relaxing egg-matching puzzle on a sunny farm. Tap an egg to send it along the open path into your nest tray. Collect three eggs of the same color to hatch a cute chick. An egg can only leave the board…",
    "tags": [
      "Puzzle",
      "Animal",
      "Brain",
      "Casual",
      "Chicken",
      "Eggs",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-tower-platformer-3d",
    "name": "Tower platformer 3D",
    "url": "https://html5.gamemonetize.co/son6w4zjinxw7b1s8yd6y7c6tosoqzs5/",
    "description": "Tower Platformer 3D is a simple 3D platform game where you climb a huge ruined tower in the middle of the sea. Jump across the platforms, avoid monsters, collect coins, and use portal checkpoints as you make your way up.",
    "tags": [
      "Adventure",
      "Jumping",
      "Obstacle"
    ],
    "mobile": false
  },
  {
    "id": "gm-assassins-hunt",
    "name": "Assassins Hunt",
    "url": "https://html5.gamemonetize.co/rw8gka5rxk8w1i0r1z7sxyr0gyz2hs95/",
    "description": "Assassins Hunt: Wild West is a thrilling top-down tactical stealth action game. Step into the boots of a legendary lone gunslinger in the unforgiving frontier. Eliminate corrupt sheriffs, outlaws, and patrol guards…",
    "tags": [
      "Shooting",
      "Action",
      "Arcade",
      "Assassin",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-ball-packing-master-puzzle-fill-box",
    "name": "Ball Packing Master Puzzle – Fill Box",
    "url": "https://html5.gamemonetize.co/fqzftj93zhevbnamlgd71dg5nu02p43n/",
    "description": "Sort colorful balls, fill the correct boxes, and solve satisfying sorting puzzles! Plan your moves carefully, use helpful boosters, and complete challenging levels. Ball packing mastar – Fill Box is a fun and relaxing…",
    "tags": [
      "Puzzle",
      "Ball",
      "Brain",
      "Casual",
      "Color",
      "Relaxation",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-pixel-feast",
    "name": "Pixel Feast",
    "url": "https://html5.gamemonetize.co/jvvims8k0ie1qh6b5osi2eqpjuvz5vcp/",
    "description": "Pixel Feast is a relaxing pixel-art puzzle. Every level hides a picture built from colored pixels, and your job is to eat it clean. Tap a block on the bottom row of the tank. It cracks open, its little eaters drop into…",
    "tags": [
      "Puzzle",
      "1 Player",
      "Casual",
      "Color",
      "Logic",
      "Pixel",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-arrow-jam",
    "name": "Arrow Jam",
    "url": "https://html5.gamemonetize.co/kwot86pdiunconynaylhbijd9bw70hk1/",
    "description": "A logic puzzle where every move changes the whole situation on the board. Arrows are scattered across a grid. Tap an arrow and it flies off the board in the direction it points. But theres a catch: if another arrow…",
    "tags": [
      "Puzzle",
      "Arrows",
      "Clicker",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-doom-eternal-platformer",
    "name": "Doom Eternal Platformer",
    "url": "https://html5.gamemonetize.co/u4d1wxit26d0kxf4usmfgqmiole1si7i/",
    "description": "Fight through five worlds in Doom Eternal: Platformer, a fast Flash-style action platformer. Double jump, dash, and send the demons back to hell.",
    "tags": [
      "Shooting",
      "Action",
      "Adventure",
      "Platform",
      "Shoot",
      "Shoot 'Em Up"
    ],
    "mobile": false
  },
  {
    "id": "gm-gears-of-war-platformer",
    "name": "Gears Of War Platformer",
    "url": "https://html5.gamemonetize.co/80aoshgqzkssgqp3nsbgrauibex5swx7/",
    "description": "A Flash-style side-scrolling action platformer. Fight through five devastated districts with a Lancer, shotgun, grenades, and active reloads.",
    "tags": [
      "Shooting",
      "Action",
      "Adventure",
      "Platform",
      "Shoot",
      "Shoot 'Em Up"
    ],
    "mobile": false
  },
  {
    "id": "gm-munch-mob",
    "name": "Munch Mob",
    "url": "https://html5.gamemonetize.co/la8bmdzfks1lm8xafymv0imbjc6vrziz/",
    "description": "Steer a swarm of hungry clay gremlins and devour a whole miniature world, one bite at a time! Munch gnomes, cars, carnival rides, ships and entire skyscrapers across 7 handcrafted claymation dioramas: cozy suburbs…",
    "tags": [
      "Hypercasual",
      "Casual",
      "City",
      "Eating",
      "Monster"
    ],
    "mobile": false
  },
  {
    "id": "gm-sneaky-fits",
    "name": "Sneaky fits",
    "url": "https://html5.gamemonetize.co/gxcirvxdt4uvd9o079d6wetx0uup40qc/",
    "description": "Strike the perfect pose to blend in and stay undetected! Flex, contort, and adjust your characters position to fit inside tricky wall cut-outs before the patrolling guards flashlight sweeps over you. Fast reflexes…",
    "tags": [
      "Puzzle",
      "1 Player",
      "2D",
      "Arcade",
      "Girl",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-apex-prime",
    "name": "Apex Prime",
    "url": "https://html5.gamemonetize.co/29k0s1vv4b5a8dtgr69tg4j7b67097pi/",
    "description": "Step into a prehistoric wilderness where giant beasts rule the land! Master survival skills, craft primitive weaponry, and battle formidable apex predators across uncharted ancient frontiers. Explore dense, untamed…",
    "tags": [
      "Arcade",
      "Adventure",
      "Fighting",
      "Mario",
      "Unity3D",
      "WebGL"
    ],
    "mobile": false
  },
  {
    "id": "gm-a-mimicry-of-life",
    "name": "A Mimicry of Life",
    "url": "https://html5.gamemonetize.co/ndfndtfvwioyrrugtec489km9fty8ono/",
    "description": "Its the year 2057. You are a group of geologists and other scientists from different fields on an expedition to the North Pole to study a peculiar asteroid that has fallen there. Why are some people behaving weirdly?…",
    "tags": [
      "Puzzle",
      "Horror",
      "Interactive Fiction",
      "Pixel",
      "RPG",
      "Top Down"
    ],
    "mobile": false
  },
  {
    "id": "gm-city-taxi-driving-simulator",
    "name": "City Taxi Driving Simulator",
    "url": "https://html5.gamemonetize.co/t1ob097ybp7t0tpz1drqbcj3uxsykiiy/",
    "description": "Drive a yellow taxi through busy city streets, follow checkpoints, pick up passengers, and deliver them safely before time expires. Choose vehicles, complete challenging routes, avoid traffic, collect rewards, and…",
    "tags": [
      "Racing",
      "3D",
      "Car",
      "City",
      "Driving",
      "Simulation"
    ],
    "mobile": false
  },
  {
    "id": "gm-little-dentist-for-kids-3",
    "name": "Little Dentist For Kids 3",
    "url": "https://html5.gamemonetize.co/om0a8jef9aeatsdk8t40c41bnhfprz6n/",
    "description": "Six kids are sitting in the chair and their teeth are a disaster. Grab the right tool and get to work: drill out the black cavities, flick off the green gunk, buff the yellow tartar with little circles, scrub the orange…",
    "tags": [
      "Girls",
      "Casual",
      "Educational",
      "Endless",
      "Hospital",
      "Kids",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-night-lake",
    "name": "Night Lake",
    "url": "https://html5.gamemonetize.co/3r1x12xlm2z3d55m5h8mykw4oerowjuf/",
    "description": "Night Lake is a calm night fishing game with a touch of mystery. You are a lone fisherman in a small wooden boat, rowing by lantern light across dark water. Cast your float, wait for the bite and strike at the right…",
    "tags": [
      "Sports",
      "Boat",
      "Fishing",
      "Monster",
      "Relaxation"
    ],
    "mobile": false
  },
  {
    "id": "gm-novabrick-rush",
    "name": "NovaBrick Rush",
    "url": "https://html5.gamemonetize.co/eokrmbvwnr74svwsmrm94dmuapuqncp7/",
    "description": "NovaBrick Rush is a fast-paced arcade brick breaker game set in a futuristic space world. Break colorful bricks, keep the ball in play, collect powerful power-ups, and complete challenging levels. Features: Multiple…",
    "tags": [
      "Hypercasual",
      "Casual",
      "2D",
      "Arcade",
      "Ball",
      "Bricks",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-stickman-legion",
    "name": "Stickman Legion",
    "url": "https://html5.gamemonetize.co/anbulajofng53wnu2of8grq3i9zts94p/",
    "description": "Lead a growing army of stickmen into battle! Fight off waves of enemies and turn them into your own soldiers. Level up, pick upgrades and evolve your gun into a minigun, railgun or rocket launcher. Call in drones…",
    "tags": [
      "Shooting",
      "Adventure",
      "Arena",
      "Army",
      "Gun",
      "Survival"
    ],
    "mobile": false
  },
  {
    "id": "gm-cafe-honey-heist",
    "name": "Cafe honey heist",
    "url": "https://html5.gamemonetize.co/4e8qjplao26xpp9vim27xe1nfzwytaj1/",
    "description": "Fly through a warm, bustling caf&eacute;, sip delicious nectar from coffee cups and treats resting on tables, and carry your loot to the hive outside. But stay on your toes—the giant caf&eacute; owner is always…",
    "tags": [
      "Arcade",
      "Escape",
      "Restaurant",
      "Survival"
    ],
    "mobile": false
  },
  {
    "id": "gm-watermelon-stack-3d",
    "name": "Watermelon Stack 3D",
    "url": "https://html5.gamemonetize.co/xisjr2uvtukx7h3n135uc8oh4hs4r5aq/",
    "description": "Aim, toss, and merge your way to a giant watermelon! Watermelon Stack 3D is a physics-based fruit merging game with colorful, squishy fruits. Rotate your view around the bowl, adjust your aim, and throw each fruit into…",
    "tags": [
      "Puzzle",
      "1 Player",
      "3D",
      "Casual",
      "Fruit",
      "Matching",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-inkageddon",
    "name": "Inkageddon",
    "url": "https://html5.gamemonetize.co/n25mx156qfv4otf1gdui0kgazr2qw2jr/",
    "description": "INKAGEDDON: the doodles have had enough. Fight through 5 notebook worlds -- Fresh Page, Graph Paper, Sticky Note, Blueprint, Midnight Chalk -- each with its own boss. Pick from 3 heroes and build a run from 6 weapons…",
    "tags": [
      "Arcade",
      "Monster",
      "Shooting",
      "Survival"
    ],
    "mobile": false
  },
  {
    "id": "gm-highway-traffic-racer-3d",
    "name": "Highway Traffic Racer 3D",
    "url": "https://html5.gamemonetize.co/7k89f1ad0rg4ifimx4emkqh8l0tir2ne/",
    "description": "Get ready for an exciting Bike Racing 3D experience! Ride powerful motorcycles through busy highways, forests, deserts, snowy roads, and stunning city environments. Choose from multiple high-performance bikes, each with…",
    "tags": [
      "Sports",
      "3D Games",
      "Attack",
      "Bike",
      "Games",
      "Racing"
    ],
    "mobile": false
  },
  {
    "id": "gm-geometry-vibes-x-ball",
    "name": "Geometry Vibes X Ball",
    "url": "https://html5.gamemonetize.co/734rvzp0kl14ytxspbpv4p6uytftdlfn/",
    "description": "Geometry Vibes X-Ball is ready to give you a completely different gaming experience! After the first game of the series, interactive new levels, challenge section and completely new store are waiting for you in X-Ball…",
    "tags": [
      "Arcade",
      "1 Player",
      "2 Player",
      "2 Player Games",
      "Avoid",
      "Geometry"
    ],
    "mobile": false
  },
  {
    "id": "gm-city-delivery-rider-simulator",
    "name": "City Delivery Rider Simulator",
    "url": "https://html5.gamemonetize.co/wsgpxwj9f69xm6wycwytsvkdjl9r4gfp/",
    "description": "Ride through a lively city as a delivery courier, transport parcels, follow checkpoints, and reach customers before time runs out. Choose motorcycles, navigate busy streets, avoid traffic, manage fuel, and complete…",
    "tags": [
      "Racing",
      "3D",
      "Bike",
      "City",
      "Driving",
      "Motorcycle"
    ],
    "mobile": false
  },
  {
    "id": "gm-maze-bomber-game",
    "name": "Maze Bomber Game",
    "url": "https://html5.gamemonetize.co/6bfjo96g0rn12u5gqjq41qbchtuntleh/",
    "description": "Enter a thrilling maze filled with obstacles and explosive challenges! Move through the maze, place bombs strategically, and clear your path while avoiding dangerous explosions. Find the best route, break through…",
    "tags": [
      "Adventure",
      "2025 games",
      "2026 games",
      "Attack",
      "Battle",
      "Battlegrounds"
    ],
    "mobile": false
  },
  {
    "id": "gm-impossible-car-stunt-game",
    "name": "Impossible Car Stunt Game",
    "url": "https://html5.gamemonetize.co/umwhoy8rec8w36678g7amz51zp3c7oak/",
    "description": "Get ready for an extreme driving challenge in Impossible Car Stunt Game! Perform crazy stunts, race across challenging tracks, jump over ramps, and carefully control your car through impossible obstacles. Test your…",
    "tags": [
      "Racing",
      "2026 games",
      "Adventure",
      "Best Games",
      "Car",
      "Stunts"
    ],
    "mobile": false
  },
  {
    "id": "gm-offroad-jeep-game-2026",
    "name": "Offroad Jeep Game 2026",
    "url": "https://html5.gamemonetize.co/zgov0lv4yby04phwo7cv0jgtvose31aw/",
    "description": "Get ready for an extreme Offroad Jeep Game 2026 adventure! Drive powerful 4x4 jeeps across rugged mountains, rocky trails, muddy paths, steep hills, and challenging offroad tracks. Test your driving skills and prove…",
    "tags": [
      "Racing",
      "2026 games",
      "Adventure",
      "Amazing",
      "Best Games",
      "Car"
    ],
    "mobile": false
  },
  {
    "id": "gm-euro-truck-driving-game",
    "name": "Euro Truck Driving Game",
    "url": "https://html5.gamemonetize.co/xc6tn6mf1sbh9tt1jt0cbh1wo9qk3rkb/",
    "description": "Get ready to experience the exciting world of heavy truck driving with Euro Truck Driving Game! Step into the driver's seat of powerful European trucks, transport valuable cargo, complete challenging missions, and…",
    "tags": [
      "Racing",
      "Adventure",
      "Best Games",
      "Driving",
      "Truck"
    ],
    "mobile": false
  },
  {
    "id": "gm-chubby-finn",
    "name": "Chubby Finn",
    "url": "https://html5.gamemonetize.co/5s2aj1koc8i13u7sawqoqogna70csybg/",
    "description": "**ChubbyFinn** is a cute Sokoban-style puzzle game where you help an adorable chubby seal push balls into the correct target positions. Move Finn in four directions, plan every step carefully, and remember: balls can be…",
    "tags": [
      "Puzzle",
      "Animal",
      "Clash",
      "Fun",
      "Logic"
    ],
    "mobile": false
  },
  {
    "id": "gm-crash-tower-3d",
    "name": "Crash Tower 3D",
    "url": "https://html5.gamemonetize.co/rdemkirp5xpirbtyu7ahmubmvd8iv0bt/",
    "description": "Crash Tower 3D is a physics destruction arcade game. Launch a powerful vehicle, time your boost in the gold zone and smash through 30 increasingly tough walls, towers and houses. Earn coins from each impact, unlock…",
    "tags": [
      "Arcade",
      "1 Player",
      "3D",
      "Bricks",
      "Car"
    ],
    "mobile": false
  },
  {
    "id": "gm-demolition-tycoon-3d",
    "name": "Demolition Tycoon 3D",
    "url": "https://html5.gamemonetize.co/op87t2kkk7487kg66q8o2dg8mc05d8in/",
    "description": "Start with a mini loader and build a demolition fleet. Hold to strike, break buildings apart and earn coins as your power grows with every hit. Upgrade power, speed, profit and critical hits, then save for bigger…",
    "tags": [
      "Clicker",
      "Idle",
      "3D",
      "Building",
      "Business",
      "Destroy"
    ],
    "mobile": false
  },
  {
    "id": "gm-chips-bakery-simulator",
    "name": "Chips bakery simulator",
    "url": "https://html5.gamemonetize.co/fxnulzgmozp8rlcnf35nnqgr6k9wc6xt/",
    "description": "Slice, fry, and season your way to snack empire glory! Run a full potato chip factory—wash raw potatoes, slice them ultra-thin, fry to golden perfection, and toss with mouthwatering seasonings. Bag your crispy creations…",
    "tags": [
      "Cooking",
      "2D",
      "Arcade",
      "Clicker",
      "Unity3D",
      "WebGL",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-box-press-puzzle",
    "name": "Box Press Puzzle",
    "url": "https://html5.gamemonetize.co/4kkfpjj31fh5dqjrp5te6i3qfq82kcvs/",
    "description": "Master mechanical precision in this addicting logic puzzle! Activate pistons in the perfect sequence to push smooth cyan cubes directly into the central drop zone. Plan every move carefully, avoid blocking pathways, and…",
    "tags": [
      "Puzzle",
      "Adventure",
      "Arcade",
      "Fun",
      "Unity3D",
      "WebGL",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-unite-words",
    "name": "Unite Words",
    "url": "https://html5.gamemonetize.co/vkvx6r7l111kpk3p3o3dyu1afnxhrhxb/",
    "description": "Find groups of 4 related words and place them in the same row to complete a set. Swap words between rows to arrange them correctly. Some levels contain special sets that, when completed, reveal new words for you to…",
    "tags": [
      "Puzzle",
      "Educational",
      "Skill",
      "Word",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-candy-shop-3d-match-puzzle",
    "name": "Candy Shop: 3D Match Puzzle",
    "url": "https://html5.gamemonetize.co/heu4g92iuvjt2rz4pam3ffo0y7j7qx4g/",
    "description": "Welcome to Candy Shop! This is a creative 3D candy puzzle game, different from classic match-3 games. Tap three identical candies to collect them directly. Each level sets specific collection targets. Gather the…",
    "tags": [
      "Puzzle",
      "1 Player",
      "3D Games",
      "Amazing",
      "Android",
      "Cake",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-blasties",
    "name": "Blasties",
    "url": "https://html5.gamemonetize.co/oeoqkfma6j6zcr6y2p3u2jruf9z4btla/",
    "description": "Blasties is a candy-based game where you shoot candies from ground and they are supposed to make chain of similar candies in the sky filled by candies. 3 or more candies will increase your score. Have fun :)",
    "tags": [
      "Puzzle",
      "Candy",
      "Matching"
    ],
    "mobile": false
  },
  {
    "id": "gm-marblemaze2",
    "name": "MarbleMaze2",
    "url": "https://html5.gamemonetize.co/04juwgelsxdddyb8698nur9wu6ewxt8l/",
    "description": "Roll. Dodge red. Reach green. Guide a glossy marble through wild worlds where danger comes disguised as decoy holes, spinning blades, moving walls, and toxic blobs. Grab coins, chain power-ups, and ride a hot streak…",
    "tags": [
      "Arcade",
      "3D Games",
      "Ball",
      "Maze",
      "Obstacle"
    ],
    "mobile": false
  },
  {
    "id": "gm-draw-the-railball-physics",
    "name": "Draw the RailBall Physics",
    "url": "https://html5.gamemonetize.co/3p0ipei0o3yqzd1d0pvk38ccvu3yv3ov/",
    "description": "Draw rails and pipes to guide the rolling ball to the goal. Use planks, springs, accelerators and bumpers to build your own physics track. A simple but tricky physics puzzle game — think like an engineer, draw like an…",
    "tags": [
      "Puzzle",
      "Ball",
      "Brain",
      "Cartoon",
      "Mobile",
      "Physics"
    ],
    "mobile": true
  },
  {
    "id": "gm-snow-plow-inc",
    "name": "Snow Plow Inc.",
    "url": "https://html5.gamemonetize.co/zde4shzxb4g841ch7408hemt84chq7fv/",
    "description": "Snow Plow Inc. is a relaxing snow plowing game. Drive your orange plow truck through deep snow and thick ice, fill your truck bed with snow blocks, then head back to the yard and sell your load for coins. LEVELS: 15…",
    "tags": [
      "Hypercasual",
      "Casual",
      "1 Player",
      "2026 games",
      "Destroy",
      "Destruction"
    ],
    "mobile": false
  },
  {
    "id": "gm-ricochet-paint-aim",
    "name": "Ricochet Paint Aim",
    "url": "https://html5.gamemonetize.co/moq8vjx1mtjeqs9wsca4c3bts1qagi5z/",
    "description": "Aim your shot, calculate the perfect bounce, and launch your ball through intricate peg mazes. Splatter targets, navigate tricky angles, and master the ultimate physics-based ricochet puzzle challenge! Web Dev…",
    "tags": [
      "Arcade",
      "Ball",
      "Fun",
      "Painting",
      "Unity3D"
    ],
    "mobile": false
  },
  {
    "id": "gm-wood-builder-tycoon",
    "name": "Wood Builder Tycoon",
    "url": "https://html5.gamemonetize.co/ihh7q43n8i0lv51wivd9fh330wghfaw3/",
    "description": "Build and expand your ultimate lumber empire! Chop down massive trees, upgrade high-tech sawmills, and transport timber along automated conveyor belts. Collect golden cash, hire skilled workers, and scale your…",
    "tags": [
      "Arcade",
      "Action",
      "Construction",
      "Truck",
      "Unity3D",
      "WebGL"
    ],
    "mobile": false
  },
  {
    "id": "gm-tiny-zomby-the-barricade",
    "name": "Tiny Zomby The Barricade",
    "url": "https://html5.gamemonetize.co/4k659ffl4wc7d2qbhtw7nyfta8lbxiic/",
    "description": "A bomb went off, the radiation did the rest, and now the whole town wants a piece of you. You are a kid on a watchtower with a rifle and a wooden fence, and that is all you get. Drag to aim, tap to shoot, keep the…",
    "tags": [
      "Shooting",
      "Arcade",
      "Mapi games",
      "Monster",
      "Shooter",
      "Survival",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-worm-path",
    "name": "Worm Path",
    "url": "https://html5.gamemonetize.co/ob7lwc8w9kxxe6fnhczttzwijs32nifa/",
    "description": "Worm Path is a challenging logic puzzle game where you guide a clever worm through tricky mazes to reach the exit. Move across tiles, push blocks, avoid obstacles, and plan every step carefully to prevent getting stuck…",
    "tags": [
      "Puzzle",
      "Brain",
      "Escape",
      "Fun",
      "Logic"
    ],
    "mobile": false
  },
  {
    "id": "gm-tug-pull-crash-challenge",
    "name": "Tug Pull Crash Challenge",
    "url": "https://html5.gamemonetize.co/ltzyzen384ej3poceuefvrufkff1f5n0/",
    "description": "Enter a tug-of-war arena where customized cars battle for control. Hold the accelerator to pull your rival toward dangerous crushers, manage engine heat, upgrade wheels and body parts, unlock new worlds, and survive…",
    "tags": [
      "Racing",
      "3D",
      "Action",
      "Arena",
      "Car",
      "Physics"
    ],
    "mobile": false
  },
  {
    "id": "gm-gorilgo-fps-online-shooter",
    "name": "GORILGO FPS : Online Shooter",
    "url": "https://html5.gamemonetize.co/hoex3mtd9ybmhmz4t057b6i1u25l38qo/",
    "description": "Experience relentless, fast paced 3D first person shooter action where every battle feels chaotic and intense. Arm yourself with a diverse arsenal of powerful guns and engage enemies in high speed combat, then unleash…",
    "tags": [
      "Multiplayer",
      ".io",
      ".io Games",
      "1 Player",
      "3D",
      "3D Games"
    ],
    "mobile": false
  },
  {
    "id": "gm-aura-farmer-presidents",
    "name": "AURA FARMER: Presidents",
    "url": "https://html5.gamemonetize.co/lekp1heoqf0hzqd0ahaom31917w6gacg/",
    "description": "AURA FARMER: PRESIDENTS is a fun and addictive aura farming simulator where you collect power, upgrade your abilities, and become the most legendary president. Tap, farm, and grow your aura while unlocking new levels…",
    "tags": [
      "Clicker",
      "Idle",
      "1 Player",
      "2026 games",
      "2D",
      "Best Games"
    ],
    "mobile": false
  },
  {
    "id": "gm-zombie-shooter-evil-outbreak",
    "name": "Zombie Shooter: Evil Outbreak",
    "url": "https://html5.gamemonetize.co/g0ku6h0ru2l47js3xx1niwh0u5lodfzi/",
    "description": "Survive five infected locations in Zombie Shooter: Evil Outbreak, a survival horror shooter with six weapons, breakable scenery and procedural maps.",
    "tags": [
      "Shooting",
      "3D",
      "First Person Shooter",
      "Shoot",
      "Shoot 'Em Up",
      "Shooter"
    ],
    "mobile": false
  },
  {
    "id": "gm-double-heist-rob-the-robbers",
    "name": "Double Heist: Rob the Robbers",
    "url": "https://html5.gamemonetize.co/31ekglzpzw7o83ii8jbihr05n9csqqrp/",
    "description": "Lets rob the robbers. Crack their safes before they get away. They already hit the bank. Now its your turn to hit them. Chase down getaway cars dragging stolen safes through the city, crack them open with brute force or…",
    "tags": [
      "Arcade",
      "Car",
      "Police"
    ],
    "mobile": false
  },
  {
    "id": "gm-yaoguard",
    "name": "YAOGUARD",
    "url": "https://html5.gamemonetize.co/qq86b75qxr5pvzp481th5whn3q25fdbz/",
    "description": "YAOGUARD is a tower defense game rooted in the myths of the ancient Shan Hai world. Command legendary guardians — Yan Xiaotian, Bing Le, Sen Sen and more — to defend the Wall against endless waves of beasts and demons.",
    "tags": [
      "Arcade",
      "Casual",
      "Defense",
      "Strategy",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-forest-fortune",
    "name": "Forest Fortune",
    "url": "https://html5.gamemonetize.co/b0lurs8it73y3tgxemb7ofdndt3jq3js/",
    "description": "Forest Fortune is a cozy 3D leaf-collecting simulator set in a charming hand-painted cartoon woodland. Walk through a lush forest filled with oak trees, wooden fences, vegetable beds, a rustic cabin, and a cozy picnic…",
    "tags": [
      "Hypercasual",
      "Casual",
      "Cartoon Network",
      "Collecting",
      "First Person Shooter"
    ],
    "mobile": false
  },
  {
    "id": "gm-museum-night-shift",
    "name": "Museum Night Shift",
    "url": "https://html5.gamemonetize.co/opw56hp2f3qbgcpzaeiklt93n6vzrtm9/",
    "description": "Museum Night Shift is a turn-based puzzle game where every step changes the plans of a cunning thief. Patrol a hex-grid museum, block escape routes and use switches to open or close security gates. Catch the thief…",
    "tags": [
      "Puzzle",
      "1 Player",
      "2D",
      "Brain",
      "Hexagon",
      "Logic",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-spinwhisker",
    "name": "SpinWhisker",
    "url": "https://html5.gamemonetize.co/gqf047oi0mwmqwnulp0vigku2aa868yd/",
    "description": "Nobody even knows how this cat got here or how to help him return home. He strayed too far and accidentally entered a portal to another dimension. Now, hes willing to do whatever it takes to escape. The journey will be…",
    "tags": [
      "Puzzle",
      "Arcade",
      "Cat",
      "Platform"
    ],
    "mobile": false
  },
  {
    "id": "gm-summer-rider-3d",
    "name": "Summer Rider 3D",
    "url": "https://html5.gamemonetize.co/luftkxd4hrmg1u0ua8ta0l3ogrfmmjgt/",
    "description": "Hit the waves in Summer Rider 3D, a sun-soaked surf adventure inspired by high-speed endless runners. Glide over water on a surfboard or jet-ski, collect shimmering starfish, and push your reflexes to the limit as the…",
    "tags": [
      "Action",
      "2 Player",
      "2 Player Games",
      "Jetski",
      "Skill",
      "Summer"
    ],
    "mobile": false
  },
  {
    "id": "gm-ragdoll-teleport-arena",
    "name": "Ragdoll Teleport Arena",
    "url": "https://html5.gamemonetize.co/h54oyhe1lic3l3h6xvhqey4o8rpi66m8/",
    "description": "A unique action-puzzler where you shoot a projectile to hit enemies and deal damage. Tap again mid-flight to immediately teleport to its location. Master the blend of precise aiming, rapid teleportation, and strategic…",
    "tags": [
      "Arcade",
      "Action",
      "Fighting",
      "Shoot 'Em Up",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-boat-war-mayhem",
    "name": "Boat War Mayhem",
    "url": "https://html5.gamemonetize.co/itgzwxkycignffox0ay1nqt0pxrwyb09/",
    "description": "Navigate wild jungle rivers on an inflatable raft while dodging explosive traps and enemy fire! Aim your weapon to blast through incoming obstacles, collect scattered cash, and outlast rival combatants. Precision…",
    "tags": [
      "Shooting",
      "Action",
      "Arcade",
      "Shoot 'Em Up",
      "Shooter",
      "Survival"
    ],
    "mobile": false
  },
  {
    "id": "gm-volley-clash",
    "name": "VOLLEY CLASH",
    "url": "https://html5.gamemonetize.co/emg0j05e7a9agg0j7q43muqjznkxqlcn/",
    "description": "Jump high, hit hard, and rule the court in Volley Clash! Challenge the AI across five difficulty levels or face a friend in local two-player mode. Unlock 18 unique volleyball stars, upgrade their stats, and unleash…",
    "tags": [
      "Sports",
      "1 Player",
      "2 Player",
      "2 Player Games",
      "2026 games",
      "Amazing"
    ],
    "mobile": false
  },
  {
    "id": "gm-sniper-rooftop-defense",
    "name": "Sniper: Rooftop Defense",
    "url": "https://html5.gamemonetize.co/6psc0396kt53jp5spom482pd1f2yaowv/",
    "description": "Sniper: Rooftop Defense is a first person sniper game. Hold the rooftop, scope in, stop enemy waves, earn medals, and unlock new sniper rifles.",
    "tags": [
      "Shooting",
      "First Person Shooter",
      "Shoot",
      "Shoot 'Em Up",
      "Shooter",
      "Sniper"
    ],
    "mobile": false
  },
  {
    "id": "gm-brookhaven-real-life",
    "name": "Brookhaven Real Life",
    "url": "https://html5.gamemonetize.co/5xnb2v6rwuxw1rup5k3nmo7yik6ewagp/",
    "description": "Brookhaven Real Life lets you create your own life, design your home, and freely explore a colorful city! Customize your character, drive different vehicles, have fun with your friends, and explore the city however you…",
    "tags": [
      "Girls",
      "1 Player",
      "2026 games",
      "Girl",
      "Minecraft",
      "Multiplayer"
    ],
    "mobile": false
  },
  {
    "id": "gm-extreme-quad-bike-racing",
    "name": "Extreme Quad Bike Racing",
    "url": "https://html5.gamemonetize.co/g84ftbq2nemqjz0k5g1e21ftrlfw4u6c/",
    "description": "Extreme Quad Bike Racing is a fast 3D ATV racing game with 12 challenging levels and an endless mode. Choose from three quad bikes and race through four different environments. Steer through traffic and obstacles…",
    "tags": [
      "Sports",
      "1 Player",
      "3D",
      "Bike",
      "Collecting",
      "Driving",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-ragdoll-rush-3d-sky-race",
    "name": "Ragdoll Rush 3D: Sky Race",
    "url": "https://html5.gamemonetize.co/s81mxt5hul5zjjiv32c3we5tcgbd3m36/",
    "description": "Run, jump and tumble through 25 obstacle courses across five colorful worlds! Race two computer-controlled rivals, dodge giant swinging hammers and use checkpoints to recover after a fall. Collect coins, unlock 15…",
    "tags": [
      "Arcade",
      "1 Player",
      "Jumping",
      "Obstacle",
      "Physics",
      "Ragdoll"
    ],
    "mobile": false
  },
  {
    "id": "gm-giant-crusher-destroy-grow",
    "name": "Giant Crusher: Destroy & Grow",
    "url": "https://html5.gamemonetize.co/t618xxt5dtfenrjqbeviez86xzel992l/",
    "description": "Turn a small robot into a giant wrecking machine! Smash crates and buildings with your hammer, collect coins and upgrade power, attack speed, coin earnings, movement and critical hits. Explore 12 colorful districts…",
    "tags": [
      "Clicker",
      "Idle",
      "1 Player",
      "Destruction",
      "Mobile",
      "Robot"
    ],
    "mobile": true
  },
  {
    "id": "gm-elemental-challenge",
    "name": "Elemental Challenge",
    "url": "https://html5.gamemonetize.co/4uujeqltcz2fmz69z7rk35yex62e7kdh/",
    "description": "**Elemental Challenge** is an addictive logic puzzle game where you combine elemental pieces to create complete elements. Plan every move carefully, discover unique elemental mechanics, and find the perfect way to merge…",
    "tags": [
      "Puzzle",
      "Brain",
      "Classic",
      "Escape",
      "Logic"
    ],
    "mobile": false
  },
  {
    "id": "gm-tower-siege",
    "name": "Tower Siege",
    "url": "https://html5.gamemonetize.co/g8ui1t17pfl0f3b4u2h2aclikq9j0gmw/",
    "description": "Build a tower out of the blocks you are dealt, then defend it. Between waves you get a hand of four shapes — walls, archers, cannons, mortars, tesla coils — and a short window to place them. Then the horde arrives…",
    "tags": [
      "Arcade",
      "Block",
      "Management",
      "RPG",
      "Simulation",
      "Strategy"
    ],
    "mobile": false
  },
  {
    "id": "gm-halloween-survivor",
    "name": "Halloween Survivor",
    "url": "https://html5.gamemonetize.co/mvdmiu8pkl2bkyj0qkt3rt3m5tpwg396/",
    "description": "Enter a dangerous Halloween world and survive against endless waves of enemies. Your swords orbit around your character and automatically attack nearby enemies. Collect more swords to increase your power and make your…",
    "tags": [
      "Arcade",
      "Action",
      "Battle",
      "Casual"
    ],
    "mobile": false
  },
  {
    "id": "gm-slime-buffet",
    "name": "Slime Buffet",
    "url": "https://html5.gamemonetize.co/9u7mfjgm45tqcsjfov9vd589n4190cxm/",
    "description": "A feast of color, a puzzle in every bite! Guide a cheerful crowd of hungry slimes through 100 candy mosaic levels. Choose colors from the front of the queue, send your slimes to matching sweets, and open paths through…",
    "tags": [
      "Puzzle",
      "1 Player",
      "2026 games",
      "2D",
      "Android",
      "Brain",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-maze-evolution-html",
    "name": "Maze Evolution HTML",
    "url": "https://html5.gamemonetize.co/fdynymjcn57n2yyf0adil5qyqtq8jfxv/",
    "description": "Maze Evolution HTML is a browser-based recreation of the classic Flash puzzle game Maze Evolution. Guide the star through 28 different mazes while avoiding moving obstacles, rotating barriers, cannons and hidden traps…",
    "tags": [
      "Puzzle",
      "1 Player",
      "2D",
      "Casual",
      "Maze",
      "Remastered"
    ],
    "mobile": false
  },
  {
    "id": "gm-snake-way",
    "name": "Snake Way",
    "url": "https://html5.gamemonetize.co/o5e7m8e2mtinge36zhf3u0f5fy6cgejd/",
    "description": "Snake Way is a fun and challenging puzzle game where you guide colorful snakes through clever paths and help them escape the board. Plan your moves carefully, avoid obstacles, and clear each level with precision. As the…",
    "tags": [
      "Puzzle",
      "1 Player",
      "Arcade",
      "Brain",
      "Casual",
      "Escape",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-city-bus-simulator-driving-games",
    "name": "City Bus Simulator Driving Games",
    "url": "https://html5.gamemonetize.co/holgihl8gmto1gsjm0vlaro74or91tue/",
    "description": "Get behind the wheel of a powerful city bus and experience the life of a professional bus driver in City Bus Simulator Driving Games! Pick up passengers from different locations, drive through busy city roads, park your…",
    "tags": [
      "Racing",
      "Bus",
      "City",
      "Driving",
      "Offroad",
      "Simulator"
    ],
    "mobile": false
  },
  {
    "id": "gm-break-a-lucky-egg-brainrots",
    "name": "Break a Lucky Egg Brainrots",
    "url": "https://html5.gamemonetize.co/xnbqyw4bp8wpymivt0cj5nv3lccs6usg/",
    "description": "Break a Lucky Egg Brainrots is a fast and rewarding collection game where action, risk, and strategy come together. Your mission is to break brainrot eggs, collect rare Brainrot characters, and safely deliver them to…",
    "tags": [
      "Arcade",
      "2 Player",
      "2 Player Games",
      "Collection",
      "Eggs",
      "Roblox"
    ],
    "mobile": false
  },
  {
    "id": "gm-monster-spaceship-shooter",
    "name": "Monster SpaceShip Shooter",
    "url": "https://html5.gamemonetize.co/i6mt5e5gkatwfguud0ort2ge2owyoj6t/",
    "description": "Dodge energetic laser trails and relentless projectiles while battling a fiery boss entity in this fast-paced arcade bullet-hell action game. Precision movement, razor-thin evasions, and lightning-fast reflexes are your…",
    "tags": [
      "Shooting",
      "Action",
      "Adventure",
      "Arcade",
      "Shooter"
    ],
    "mobile": false
  },
  {
    "id": "gm-town-builder-inc",
    "name": "Town Builder Inc.",
    "url": "https://html5.gamemonetize.co/ndz7tvza2vhiuyho8i6fvpo12ki4qd19/",
    "description": "Collect cash, stack your earnings, and unlock thriving town businesses! Upgrade your capacity, hire workers, and expand your financial empire step-by-step. Can you grow a small street operation into the ultimate idle…",
    "tags": [
      "Arcade",
      "Adventure",
      "Build",
      "Fun",
      "Stickman",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-mega-ramp-car-stunts-gt-racing",
    "name": "Mega Ramp Car Stunts GT Racing",
    "url": "https://html5.gamemonetize.co/4ve4c92ctqt5n0ciuxu312ukuawpok35/",
    "description": "Get ready for an extreme driving adventure in Mega Ramp Car Stunts GT Racing! Take control of powerful sports cars and race across impossible sky tracks, massive ramps, zigzag roads, and challenging stunt courses…",
    "tags": [
      "Racing",
      "Car",
      "Drift",
      "Driving",
      "Simulation",
      "Stunts"
    ],
    "mobile": false
  },
  {
    "id": "gm-tank-war-battle-game",
    "name": "Tank War Battle Game",
    "url": "https://html5.gamemonetize.co/8oqnvc7gyw9qjzhbp12lre5lgave5hxz/",
    "description": "Tank War Battle Game is an exciting action-packed tank combat game where you take control of a powerful battle tank and enter intense war zones filled with dangerous enemies, challenging missions, and explosive battles…",
    "tags": [
      "Adventure",
      "2026 games",
      "Amazing",
      "Best Games",
      "Tank"
    ],
    "mobile": false
  },
  {
    "id": "gm-archer-clash",
    "name": "Archer Clash",
    "url": "https://html5.gamemonetize.co/ae4ybpolgwsf0umxkifezlsdhp7x7nfx/",
    "description": "Archer Clash is a fast-paced io game where you guide a lone hero racing across a rolling, hill-like battle arena. You'll recruit allies, adapt your tactics, and face shifting challenges as you fight for control. Every…",
    "tags": [
      "Stickman",
      "3D",
      "3D Games",
      "Arena",
      "Battle",
      "Grow",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-drifty-road-rush",
    "name": "Drifty Road Rush",
    "url": "https://html5.gamemonetize.co/6jqelogy7lrcqoqx6jt2e080c9kf6tpg/",
    "description": "Speed along twisting roads where every corner demands a perfect drift. Guide your car through traffic, collect rewards, avoid crashes, and keep your run alive as the challenge grows. Learn the rhythm of each turn…",
    "tags": [
      "Racing",
      "3D",
      "Arcade",
      "Car",
      "Drift",
      "Driving"
    ],
    "mobile": false
  },
  {
    "id": "gm-extreme-motorcycle-simulator",
    "name": "Extreme Motorcycle Simulator",
    "url": "https://html5.gamemonetize.co/9eaj82xx430hf8uh0e2uzhbe80dbq454/",
    "description": "What is Extreme Motorcycle Simulator about? With Motorcycle, you must complete the tasks that await you in a big city and enjoy the motorcycle game. Today, motorcycle fans are as numerous as car and motorists. No matter…",
    "tags": [
      "Sports",
      "Moto",
      "Motocross",
      "Motorcycle",
      "Simulator"
    ],
    "mobile": false
  },
  {
    "id": "gm-countercraft-nether-strike",
    "name": "Countercraft Nether Strike",
    "url": "https://html5.gamemonetize.co/99040kfzsnpdw25x00gu0szfkccnyq1i/",
    "description": "Fight Minecraft mobs with six realistic weapons in Countercraft: Nether Strike. Trigger TNT chain reactions and clear five procedurally generated sectors.",
    "tags": [
      "Shooting",
      "3D",
      "CSGO",
      "First Person Shooter",
      "Minecraft",
      "Shoot"
    ],
    "mobile": false
  },
  {
    "id": "gm-escape-the-giant-school-3d",
    "name": "Escape the Giant School 3D",
    "url": "https://html5.gamemonetize.co/de8zsz98rjwpwd24amnrhd8ijutmdo94/",
    "description": "Shrink into a giant school and turn everyday classroom objects into an epic 3D parkour course! Jump across oversized books, pencils and desks in 20 themed rooms, collect coins, discover secret rewards and reach…",
    "tags": [
      "Adventure",
      "1 Player",
      "Collecting",
      "Escape",
      "Jumping",
      "Platform"
    ],
    "mobile": false
  },
  {
    "id": "gm-project-void",
    "name": "Project VOID",
    "url": "https://html5.gamemonetize.co/w754ff8lfrs2h9e2youfuc3y7vgv4p00/",
    "description": "Project VOID is a fast-paced sci-fi roguelike survival game set on a mysterious alien world. Fight off waves of hostile drones, survive as long as you can, collect Void Skulls, and upgrade your abilities between waves…",
    "tags": [
      "Adventure",
      "Alien",
      "Arcade",
      "Attack",
      "Avoid",
      "Battle"
    ],
    "mobile": false
  },
  {
    "id": "gm-ants-clear-all-color-block-puzzle",
    "name": "Ants Clear All : Color Block Puzzle",
    "url": "https://html5.gamemonetize.co/xkx4li4hwagsgoa3c5fpt6q3b7l1l2i6/",
    "description": "Send out your ants and carry every colorful block away! Ants Clear All : Color Block Puzzle is a single-player puzzle game about matching colors and planning your moves. Click or tap a box in the front row to deploy an…",
    "tags": [
      "Puzzle",
      "1 Player",
      "2D",
      "Animal",
      "Block",
      "Brain",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-geometry-vibes",
    "name": "Geometry Vibes",
    "url": "https://html5.gamemonetize.co/22oocjj2acsvkohnu20obnjp4rnqmiv5/",
    "description": "Geometry Vibes is a reaction-based arcade game where you avoid obstacles, traps and spikes that come at you in waves. Your goal in the game is to keep your arrow on the route and take it as far as possible. Geometry…",
    "tags": [
      "Arcade",
      "1 Player",
      "2 Player",
      "2 Player Games",
      "Arrow",
      "Dash"
    ],
    "mobile": false
  },
  {
    "id": "gm-snake-block-rush",
    "name": "Snake Block Rush",
    "url": "https://html5.gamemonetize.co/wq1tfwmy6wvhb5canuwoqcu7xz6fvzdm/",
    "description": "Snake Block Rush is a fast hyper-casual arcade game! Guide your neon bead snake, collect white bonus orbs to grow, and smash numbered blocks. Earn stars to unlock 9 unique snake skins and use revives for high scores!",
    "tags": [
      "Arcade",
      "Hypercasual",
      "Mobile",
      "Snake"
    ],
    "mobile": true
  },
  {
    "id": "gm-snow-rush-3d",
    "name": "Snow Rush 3D",
    "url": "https://html5.gamemonetize.co/qz19c89oeh9xgil0vhin4coe5c6y8o9x/",
    "description": "Snow Rush 3D is a fun sledding game that tests speed and reflexes for winter sports enthusiasts, playable in both 1 and 2 players! Try to reach the longest distance by overcoming obstacles and ramps on a challenging…",
    "tags": [
      "Arcade",
      "1 Player",
      "2 Player",
      "2 Player Games",
      "Ski",
      "Snow"
    ],
    "mobile": false
  },
  {
    "id": "gm-the-high-climb",
    "name": "The High Climb",
    "url": "https://html5.gamemonetize.co/211t3gerhp1hbliitpo5f2r8hiqw91ub/",
    "description": "Ascend an endless vertical obstacle course where one wrong move means a punishing fall back to the start. Precision, patience, and perfect timing are required to reach the ultimate peak! Web Dev…",
    "tags": [
      "Adventure",
      "3D",
      "Arcade",
      "Unity3D"
    ],
    "mobile": false
  },
  {
    "id": "gm-space-painters-deluxe",
    "name": "Space Painters Deluxe",
    "url": "https://html5.gamemonetize.co/62lr08dou6onb18co27arv4perq1oq9b/",
    "description": "Space Painters Deluxe is an action-puzzler where you construct vibrant cosmic circles while carefully dodging your own trailing paint line. Precision timing and spatial awareness are key to clearing dark star systems…",
    "tags": [
      "Arcade",
      "Paintball",
      "Painting",
      "Shooter"
    ],
    "mobile": false
  },
  {
    "id": "gm-requiemnoire",
    "name": "RequiemNoire",
    "url": "https://html5.gamemonetize.co/s03dcg88vbopmo1ez9itcgzj2sqftpw8/",
    "description": "**RequiemNoire** is a fast-paced reflex game where speed and accuracy are the keys to survival. Press the correct arrow keys before time runs out to restore your timer and escape a deadly blade. One wrong move or slow…",
    "tags": [
      "Hypercasual",
      "Casual",
      "Battle",
      "Classic",
      "Horror"
    ],
    "mobile": false
  },
  {
    "id": "gm-super-kick-boxing",
    "name": "Super Kick Boxing",
    "url": "https://html5.gamemonetize.co/j5zus81dxf916fkiyd1oo2m4wgzlvi0q/",
    "description": "Super Kick Boxing is a fast-paced arcade fighting game packed with explosive punches, powerful kicks, dodges and devastating special moves. Step into the ring, master your timing, manage your stamina and defeat…",
    "tags": [
      "Sports",
      "Fight",
      "Fighting",
      "Mapi games",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-bombstrike-urban-blast",
    "name": "Bombstrike Urban Blast",
    "url": "https://html5.gamemonetize.co/1e7wwz5wl40t8rivs6vojgtbiqccfeqt/",
    "description": "Bombstrike Urban Blast is a free bomberman style game. Plant, escape, and outsmart three rivals in this explosive arcade battle. Three arenas. One survivor.",
    "tags": [
      "Arcade",
      "2 Player",
      "2 Player Games",
      "Bomb"
    ],
    "mobile": false
  },
  {
    "id": "gm-dig-to-the-weirdest-world",
    "name": "Dig to the Weirdest World",
    "url": "https://html5.gamemonetize.co/rlfbl4lj1vdx7lr3ley4vjp2h12yqv3s/",
    "description": "Dig to the Weirdest World is a colorful 3D mining adventure. Steer your drill underground, collect valuable discoveries, and sell your cargo to upgrade power, energy, and storage. Unlock eight drilling rigs and use…",
    "tags": [
      "Adventure",
      "1 Player",
      "3D",
      "Collecting",
      "Miner",
      "Relaxation"
    ],
    "mobile": false
  },
  {
    "id": "gm-treasurebound",
    "name": "TreasureBound",
    "url": "https://html5.gamemonetize.co/ticoxbv442hsnsvvycdowtxk7dv8kzgs/",
    "description": "Treasure Bound is a turn-based treasure hunt on a hex grid. Every tile might hide gold or nothing. Spend your shovels wisely, read the board, and claim the biggest finds before they are gone. Play two ways: Adventure…",
    "tags": [
      "Puzzle",
      "1 Player",
      "Block",
      "Casual",
      "Detective",
      "Hex"
    ],
    "mobile": false
  },
  {
    "id": "gm-snack-warp",
    "name": "SNACK & WARP",
    "url": "https://html5.gamemonetize.co/t5m6ibyfzsgkwnpad39ux3e6y6hoh953/",
    "description": "One more apple... but will your tail still fit? SNACK & WARP is a colorful puzzle adventure with 67 levels. Eat apples to grow, climb over obstacles and balance across gaps. Lift crates with your head, send them through…",
    "tags": [
      "Puzzle",
      "1 Player",
      "2D",
      "Brain",
      "Casual",
      "Logic"
    ],
    "mobile": false
  },
  {
    "id": "gm-candy-match-pop",
    "name": "Candy Match Pop",
    "url": "https://html5.gamemonetize.co/xiegkd74ic49rp9oxpzbsqosdj84dspa/",
    "description": "Candy Match Pop is a colorful single-player match-3 puzzle adventure with 80 levels across four chapters. Swap neighboring candies to match three or more, trigger satisfying cascades, and create line blasts, bombs, and…",
    "tags": [
      "Puzzle",
      "1 Player",
      "Candy",
      "Casual",
      "Match 3",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-starship-ducks",
    "name": "Starship Ducks",
    "url": "https://html5.gamemonetize.co/f2kc8h3diyuvke3tyh0u12003g7cmd7t/",
    "description": "Starship Ducks is a low-gravity lunar shooter where your own gun is your worst enemy — every shot shoves your fat duck paratrooper backward. Pick one of four jetpacks, drop by pod onto endless moon terrain, and survive…",
    "tags": [
      "Shooting",
      "1 Player",
      "2D",
      "Action",
      "Shooter",
      "Space"
    ],
    "mobile": false
  },
  {
    "id": "gm-ocean-match-crush",
    "name": "Ocean Match Crush",
    "url": "https://html5.gamemonetize.co/58x9185xpeogr84l4oqb8i6mb6lcjoog/",
    "description": "Drag and swap sea creature icons on the board match three or more identical patterns to eliminate them. Consecutive matches trigger powerful special effects to clear large areas. It features lovely underwater art and…",
    "tags": [
      "Puzzle",
      "Casual",
      "Match3",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-mad-hatter-rush",
    "name": "Mad Hatter Rush",
    "url": "https://html5.gamemonetize.co/spikcytx2t0vfqttx0fw14jr3dcbuttl/",
    "description": "Mad Hatter Rush is a fast-paced cartoon adventure runner set in a surreal Wonderland. Help the Mad Hatter navigate through a series of challenging stages as he searches for a way to escape Wonderland. Jump over…",
    "tags": [
      "Hypercasual",
      "Casual",
      "Adventure",
      "Avoid",
      "Collecting",
      "Fantasy"
    ],
    "mobile": false
  },
  {
    "id": "gm-memorya",
    "name": "Memorya",
    "url": "https://html5.gamemonetize.co/njr6tu5gyi56qegppxjb6pgo2iblfr1l/",
    "description": "Match cards, solve puzzles, and explore six colorful atmospheres in Memoria. Find every pair before time runs out and move on to the next level. Each theme has its own artwork, card sets, and music. Play with a mouse or…",
    "tags": [
      "Puzzle",
      "Brain",
      "Casual",
      "Logic"
    ],
    "mobile": false
  },
  {
    "id": "gm-match-3-forest-crew",
    "name": "Match 3: Forest Crew",
    "url": "https://html5.gamemonetize.co/jofqeo75ii82f97nmsnek9vquo1o21q5/",
    "description": "Match 3: Forest Crew is an exciting logic puzzle where you need to feed hungry animals after their long winter hibernation. The critters are picky, and everyone wants something special. Luckily, there is enough food for…",
    "tags": [
      "Puzzle",
      "2D",
      "Animal",
      "Clicker",
      "Match 3",
      "Matching",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-monsters-wheels-2",
    "name": "Monsters Wheels 2",
    "url": "https://html5.gamemonetize.co/um26jcww9dpyhc9013umby7n5lklwacq/",
    "description": "Monsters Wheels 2 is a monster truck game where every event asks something different. Race a packed grid to the finish line, flatten a row of parked cars, land the biggest backflip you can or beat the clock — 24 levels…",
    "tags": [
      "Racing",
      "Car",
      "Car tuning",
      "Monstertruck",
      "Truck",
      "Trucks"
    ],
    "mobile": false
  },
  {
    "id": "gm-hollow-knight-silksong-game",
    "name": "Hollow Knight Silksong Game",
    "url": "https://html5.gamemonetize.co/8tbto9oyrwe3t2jlgpnw1g911p6o4ogi/",
    "description": "Hollow Knight Silksong Game is a new amazing Hollow Knight game,and free online metroidvania adventure game ,in this epic metroidvania action game you can battle through amazing funny levels filled with bosses, use your…",
    "tags": [
      "Adventure",
      "2026 games",
      "Action",
      "Adult",
      "Amazing",
      "Assassin"
    ],
    "mobile": false
  },
  {
    "id": "gm-obby-rocket-shopping-cart",
    "name": "Obby: Rocket Shopping Cart",
    "url": "https://html5.gamemonetize.co/av9ruu6hvd3hjxdvu6z67im7hu6f93uz/",
    "description": "Turn a shopping cart into a rocket-powered ride! Race along colorful 3D obstacle tracks, smash barriers, launch off ramps and chase a new distance record. Collect coins to upgrade speed, rocket boost and handling…",
    "tags": [
      "Arcade",
      "1 Player",
      "3D",
      "Avoid"
    ],
    "mobile": false
  },
  {
    "id": "gm-big-smash",
    "name": "Big Smash",
    "url": "https://html5.gamemonetize.co/nkyvl0iw2sdi1zizdb1mpcsbb6yaifql/",
    "description": "Aim your tennis balls at a tower of cubes on the table and knock the whole lot down. Stone, wood, ice, jelly... every cube falls differently! Objective Bring down the tower. Each level drops you in front of a stack of…",
    "tags": [
      "Puzzle",
      "3D",
      "Block",
      "Cannon",
      "Destroy",
      "Family",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-gun-thief-auto",
    "name": "Gun Thief Auto",
    "url": "https://html5.gamemonetize.co/2fvcnw7bbqx858nhyy5oq7mcnyvj948p/",
    "description": "Game Overview Gun Theif Auto is an open-world voxel action game featuring a 6x6 urban grid. Explore freely, complete mission contracts, and evade police in sandbox or mission modes. Key Features Modes: Sandbox free roam…",
    "tags": [
      "Adventure",
      "3D",
      "Action",
      "City",
      "Driving",
      "Gta"
    ],
    "mobile": false
  },
  {
    "id": "gm-best-buds",
    "name": "Best_Buds",
    "url": "https://html5.gamemonetize.co/0i4a9uxyfmwckruzewntiaou0kogo51p/",
    "description": "tep into the colorful world of Best Buds, the ultimate dress-up game where you style two best friends for every occasion! Mix and match trendy outfits, cute accessories, stylish hairstyles, and fabulous shoes to create…",
    "tags": [
      "Multiplayer",
      "Dress Up",
      "Drift",
      "Girls",
      "Makeover"
    ],
    "mobile": false
  },
  {
    "id": "gm-magnet-sort",
    "name": "Magnet Sort",
    "url": "https://html5.gamemonetize.co/z1iiw0mwuytvmk9lz14tj8zjhxn6x643/",
    "description": "Magnet Sort is a fast-paced industrial arcade game where you control a powerful magnetic crane above a moving factory conveyor. Time each drop carefully, collect valuable components, build combos, and avoid dangerous…",
    "tags": [
      "Hypercasual",
      "Casual",
      "1 Player",
      "2026 games",
      "Best Games",
      "Collecting"
    ],
    "mobile": false
  },
  {
    "id": "gm-warrior-way",
    "name": "Warrior Way",
    "url": "https://html5.gamemonetize.co/1rqt7kg9a4rrykj10kerloclbsvwlvg4/",
    "description": "Warrior Way: Enter a chaotic wilderness arena where only the strongest survive! Warrior Way is a 2D topdown survival brawler with intense melee combat. Choose your warrior and leap into the fray against dozens of…",
    "tags": [
      "AI",
      ".io",
      ".io Games",
      "1 Player",
      "2026 games",
      "2D"
    ],
    "mobile": false
  },
  {
    "id": "gm-snow-rider-neo",
    "name": "Snow Rider Neo",
    "url": "https://html5.gamemonetize.co/e4woyszceuiqga5qts3de48wf7gczzsb/",
    "description": "Carve through snowy forests and mountain slopes in Snow Rider Neo, a fast-paced 3D endless sledding game. Dodge trees, rocks, snowmen and rolling snowballs, time your jumps over logs and gaps, and ride ramps as the…",
    "tags": [
      "Racing",
      "3D",
      "Adventure",
      "Jumping",
      "Snow"
    ],
    "mobile": false
  },
  {
    "id": "gm-dead-end-depot",
    "name": "Dead End Depot",
    "url": "https://html5.gamemonetize.co/dz69xqxgmckz9zqn910d58pk3mw3c306/",
    "description": "Push, but never pull. Dead-End Depot is a warehouse logic puzzle where every parcel must be delivered to the gate with the matching color and symbol. Plan each move carefully. Moving the wrong parcel first can block the…",
    "tags": [
      "Puzzle",
      "Casual",
      "Logic"
    ],
    "mobile": false
  },
  {
    "id": "gm-blockibo-color-blocks",
    "name": "Blockibo: Color Blocks",
    "url": "https://html5.gamemonetize.co/n4v4nn5pdcrou2ikaspkyke6oorp0skf/",
    "description": "Block Escape is a vibrant logic puzzle game where every move matters. Guide colorful blocks across a compact game board, navigate them toward their matching exits, and create a clear path through increasingly…",
    "tags": [
      "Puzzle",
      "Block",
      "Blocky",
      "Puzzleblock"
    ],
    "mobile": false
  },
  {
    "id": "gm-royal-jelly-jam",
    "name": "Royal Jelly Jam",
    "url": "https://html5.gamemonetize.co/3us7a3smoy56azze3kdmfwkzj8h9mp02/",
    "description": "Royal Jelly Jam is a cozy Color Block Jam–style puzzle: slide each colored jelly block into the gate of its own color to melt it away, and clear the whole board before the timer runs out.",
    "tags": [
      "Puzzle",
      "Block",
      "Puzzleblock"
    ],
    "mobile": false
  },
  {
    "id": "gm-1-speed-keyboard-escape",
    "name": "+1 Speed Keyboard Escape",
    "url": "https://html5.gamemonetize.co/31pv20ha1r1cl1vby6cbwb3odkbl8xak/",
    "description": "**+1 SPEED KEYBOARD ESCAPE** is a fast-paced arcade game where every key press makes you faster! Press keys, build your speed, overcome challenging stages, and survive as long as possible. The faster you become, the…",
    "tags": [
      "Hypercasual",
      "Casual",
      "3D",
      "Roblox",
      "Mobile"
    ],
    "mobile": true
  },
  {
    "id": "gm-neon-nexus-3d",
    "name": "Neon Nexus 3D",
    "url": "https://html5.gamemonetize.co/q4jvml8w8cg2ujh8ovmwm9s1xlgoj87z/",
    "description": "Neon Circuit is a relaxing, glowing puzzle game where your goal is to connect all the neon wires to power the circuits. Rotate the nodes to create a continuous flow of energy from the power source to all the targets…",
    "tags": [
      "Puzzle",
      "3D",
      "Pipe"
    ],
    "mobile": false
  },
  {
    "id": "gm-lineo",
    "name": "Lineo",
    "url": "https://html5.gamemonetize.co/gh1ql1tjloaudxcf250etf15v7t4usqu/",
    "description": "Lineo is a match-3 game about lines of various types like straight lines, spiral lines, angled lines etc. You need to chain 3 or more of same types of lines and that increases your score. Have fun :)",
    "tags": [
      "Puzzle",
      "Casual",
      "Match-3"
    ],
    "mobile": false
  },
  {
    "id": "gm-mega-ramp-car-stunt-racing",
    "name": "Mega Ramp Car Stunt Racing",
    "url": "https://html5.gamemonetize.co/ichl1yy0dfrd8ql5i31yhh1j7j05z77b/",
    "description": "Get ready for an adrenaline-pumping driving experience with Mega Ramp Car Stunt Racing! Take control of powerful muscle and super cars and race across extreme mega ramps, impossible tracks, and challenging stunt arenas…",
    "tags": [
      "Racing",
      "2026 games",
      "Adventure",
      "Car",
      "Fun",
      "Games"
    ],
    "mobile": false
  },
  {
    "id": "gm-call-of-tanks",
    "name": "Call of Tanks",
    "url": "https://html5.gamemonetize.co/r6s0bryt2olvq34tsbk58etrr7h7ajg2/",
    "description": "Call of Tanks is an action game to deploy tanks on the battlefield to defeat your opponent. Deploying the right units as a perfect combination is the key to winning the battle. Upgrade your defenses and tanks for a…",
    "tags": [
      "Action",
      "Attack",
      "Battle",
      "Defense",
      "Tanks"
    ],
    "mobile": false
  },
  {
    "id": "gm-steal-an-egg",
    "name": "Steal An Egg",
    "url": "https://html5.gamemonetize.co/vom1cpvqc5j9mgzv1irmr870gllztzgk/",
    "description": "Steal An Egg takes the classic Steal Brainrot loop and flips it into an egg-hatching economy race. Play in 1 Player or 2 Player mode, buy mystery eggs from the center conveyor, carry them back to your base, and wait for…",
    "tags": [
      "Action",
      "2 Player Games",
      "Casual",
      "Collecting",
      "Roblox",
      "Running"
    ],
    "mobile": false
  },
  {
    "id": "gm-police-gangster-chase",
    "name": "Police Gangster Chase",
    "url": "https://html5.gamemonetize.co/20ps2xu1agx8i51jh9z9t5aqcxh8x97w/",
    "description": "Race through a vivid city as a police driver hunting dangerous gangsters. Chase targets, avoid traffic, collect badges, and complete action-packed missions before time runs out. Master responsive handling across…",
    "tags": [
      "Racing",
      "3D",
      "Action",
      "Arcade",
      "Car"
    ],
    "mobile": false
  }
];
