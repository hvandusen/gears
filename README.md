# gears

Collaborative drawing rooms. Drag to draw a line; a ball rides along it, then loops back to the start. Everyone in the same room sees the same drawing.

- `/` — lobby with every room and a snapshot of it
- `/<name>` — open (or create) a room
- `/<name>/delete` — delete a room

Rooms are saved to `data/rooms.json`.

## Run

```sh
npm install
cp .env.example .env   # set PORT
npm start
```
