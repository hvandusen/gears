const fs = require('fs');
const path = require('path');
const http = require('http');
const express = require('express');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 3000;
const DATA_FILE = process.env.DATA_FILE || path.join(__dirname, 'data', 'rooms.json');

// rooms[name] = { paths: [[[x, y], ...], ...], img: "data:image/png;base64,..." }
let rooms = {};
try {
  rooms = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  console.log(`loaded ${Object.keys(rooms).length} rooms from ${DATA_FILE}`);
} catch (err) {
  if (err.code !== 'ENOENT') console.error('could not read rooms file:', err.message);
}

// Write at most once a second, so a burst of drawing doesn't hammer the disk.
let saveTimer = null;
function save() {
  if (saveTimer) return;
  saveTimer = setTimeout(() => {
    saveTimer = null;
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    const tmp = DATA_FILE + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify(rooms));
    fs.renameSync(tmp, DATA_FILE);
  }, 1000);
}

function getRoom(name) {
  if (!rooms[name]) rooms[name] = { paths: [], img: null };
  return rooms[name];
}

const app = express();
const server = http.createServer(app);
// Canvas snapshots can be a few MB on big screens.
const io = new Server(server, { maxHttpBufferSize: 10e6 });

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  const names = Object.keys(rooms);
  const imgs = Object.fromEntries(names.map((n) => [n, rooms[n].img]));
  res.render('mainView', { rooms: names, imgs });
});

app.get('/:room/delete', (req, res) => {
  delete rooms[req.params.room];
  save();
  res.redirect('/');
});

app.get('/:room', (req, res) => {
  res.render('room', { room: req.params.room });
});

io.on('connection', (socket) => {
  let room = null;

  socket.on('roomname', (name) => {
    if (typeof name !== 'string' || !name) return;
    room = name;
    socket.join(room);
    socket.emit('project', { paths: getRoom(room).paths });
  });

  socket.on('newPath', (data) => {
    if (!room || !data || !Array.isArray(data.newPath)) return;
    const r = getRoom(room);
    r.paths.push(data.newPath);
    if (typeof data.img === 'string' && data.img.startsWith('data:image/')) r.img = data.img;
    save();
    io.to(room).emit('update', { paths: r.paths });
  });

  socket.on('giveup', () => {
    if (!room) return;
    getRoom(room).paths = [];
    save();
    io.to(room).emit('erase');
  });
});

server.listen(PORT, () => console.log(`gears listening on http://localhost:${PORT}`));
