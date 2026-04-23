# Andromeda Trail

Basic Concept: Oregon Trail re-imagined in a sci fi setting. Similar structure, but with different minigames and more control over your outcomes.

## Key Features of Oregon Trail that we want to change for our version

**Passengers**
* Pros: Wide variety of ailments/deaths based on rng and a number of factors, custom names give a custom feel
* Cons: No counterplay to most ailments/deaths which is unfun, passengers lack any real interaction beyond “talking” which doesn’t even include the custom name

**No point to later shops**
* Cons: There is no reason not to spend all your money (except for ferry passage) at the beginning of the game and then get by on trading when there is no natural way to make money and later shops have the exact same items at worse prices, no reason NOT to take shortcuts and avoid extra shops

**Trading**
* Cons: Easily exploitable in an unfun way, encounters are random and can be spammed infinitely until you get a favorable trade

**Overall Gameplay**
* Cons: Reliant on rng for the most part which makes gameplay uninteresting, most actions there is a simple “correct thing to do” which means there isn’t much difference between two player’s experiences other than the minigames, minigames are overall a very minor part of the game

## Structure of Andromeda Trail’s campaign

**Start: Pick a ship**
*	Variables for player to consider are cost of the ship, storage space, speed, and armor 

**Name characters**
*	Names are saved and will show up with dialogue and events that concern the passengers

**Stop by first station**

* Actions
    * Shop
      * Different “special items” depending on location in the game (e.g. Rocket boots which allow player to jump for longer/go higher before falling)
      * Fuel (Consumed steadily based on pace), Food (Consumed steadily), Oxygen (Our version of bullets), Shield Battery (Repairs armor level by 1)
    * Rest
    * Medical Facility (Money + Time to cure a passenger, offers counterplay to ailments)
    * Fix Ship
    * Keep going

**Hunt at “any time” (when you are near a planet)**
* Brings player into platformer minigame
* Oxygen (timer) ticking down until player leaves
* Player is able to punch plants for space fruit and punch fauna (moves randomly) to kill it, both add to Food
* Unreachable platforms have alien fauna that fight back, need special item to access (Rocket boots), better food and chance of supplies at risk of player ailment or death
* If oxygen runs out, player dies

**Random encounters**
* Random alien and human ships
* Some hostile some not
* Hostile ships will open fire if you flee, equivalent of hitting an obstacle 50% of the time
* Platformer minigame if you “surrender” to hostile ship (they board you)
    * Offers risk of player ailments/death in exchange for chance at gaining random items, value scaled with difficulty of enemies
* Friendly ships will talk to you and open a trade menu if you choose to trade (same as shop but prices are in multiple forms including items)
* Planets offer opportunity to hunt or rest with higher effectiveness than in space
* Wormholes offer shortcuts but avoid stations

**Game End**
*	Reach final station in andromeda galaxy
*	Score based on state of surviving passengers, value of possessions, and money

## Authors

Varun Wescott - Project Manager

Ajay Rajasekaran - User Interface

Ilya Vaschillo - Testing

Kinner Parikh - Lead Dev

## Mobile PWA (landscape)

A mobile-first Progressive Web App shell is included in `/pwa`.

### Run locally

```bash
cd pwa
python3 -m http.server 8080
```

Open `http://localhost:8080` on a phone, then install to home screen.

### What's included

- Web app manifest with `orientation: "landscape"`.
- Service worker for offline caching.
- Landscape-oriented game viewport (`16:9`) with portrait rotation prompt.
- Runtime attempt to lock orientation via `screen.orientation.lock('landscape')` when supported.

### Next integration step

Replace the placeholder canvas setup in `pwa/src/main.js` with the actual browser game loop/rendering layer.
