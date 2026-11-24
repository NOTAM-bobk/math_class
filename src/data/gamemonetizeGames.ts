import type { GameItem } from "./gameItem";

// Games from the GameMonetize feed
// (https://gamemonetize.com/feed.php?format=0&num=50&page=1), imported on
// 2026-11-24 from pages 1-3. Each entry keeps the feed's own player URL, so
// the games load from html5.gamemonetize.co instead of being copied into this
// repo. Entries the feed tags as "Mobile" (or that ship a portrait player) carry
// `mobile: true`, which is what the catalog's Mobile filter selects. Their
// thumbnails are saved under ./covers so the cards survive the image host being
// blocked. Re-run scripts/import-gamemonetize.mjs to refresh the list.
export const GAMEMONETIZE_GAMES: GameItem[] = [
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
  }
];
