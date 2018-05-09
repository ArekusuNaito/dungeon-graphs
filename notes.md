# Dungeon Notes

In video games, dungeons have layouts that let the player explorer in certain way.

- Is the dungeon linear?
  - Does the player goes room to room without going to other rooms to unlock other rooms?
- Is backtracking needed to complete other rooms?
- Are there any optional rooms in the dungeon?
  - Allowing sense of exploration / decision making.

---
Regarding the Dungeon graph, this graph describes the minimum sequence of actions needed to complete the dungeon. Meaning that optional objectives are not placed on this dungeon, this graph then, will allow the dungeon designer to place the optional objectives in particular places.
For example, a dungeon might have 8 keys inside, but you only require 3 of them to reach the end of it. This other 5 keys makes the player feel like they are on a bigger dungeon, giving that sense of exploration, that sense of decision making.

---

## Analyzing the dungeon elements

- How do we know what room connects to another in the `.json` file?
- Input : A set of rooms (a dungeon)
- Output: The minimum required sequence to complete the dungeon.

Then we ask ourselves.
- What kind of things are inside a room?
  - There can be `switches`.
  - We can find `keys`.
  - And, just as you thought, both keys and switches allows us to unlock other rooms, both are `triggers`.

- Switch 🔘
  - A switch is an automatic trigger. That is, once you interact with this, it will be triggered.
- Key 🔑
  - A key is a manual trigger. That is, it will only be triggered once used on the required lock.
- Lock
  - A blocking element that needs to be unlocked with a trigger.
  - Sometimes you will require multiple triggers to unlock a lock. E.g Activating Switch `A` and `B` will do the job

---
