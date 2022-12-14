const ACTIONS = require("./src/Actions");
const express = require("express");
const { Server } = require("socket.io");

const app = express();
const http = require("http");
const path = require("path");
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;
const io = new Server(server);
const userSocketMap = {};

app.use(express.static('build'));
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/', (req, res) => {
  return res.status(200).send('Hello from service!');
});

const getAllConnectedClients = (roomId) => {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        userName: userSocketMap[socketId],
      };
    }
  );
};

io.on("connection", (socket) => {
  socket.on(ACTIONS.JOIN, ({ roomId, userName }) => {
    // console.log(roomId, userName);
    userSocketMap[socket.id] = userName;
    socket.join(roomId);
    const clients = getAllConnectedClients(roomId);
    // console.log(clients);
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        userName,
        socketId: socket.id,
      });
    });
  });

  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        userName: userSocketMap[socket.id],
      });
    });
    delete userSocketMap[socket.id];
    socket.leave();
  });

  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, {
      code
    });
  });

  socket.on(ACTIONS.SYNC_CODE, ({ socketId, code}) => {
    io.to(socketId).emit(ACTIONS.CODE_CHANGE, {
      code
    });
  });
});

server.listen(PORT, () => {
  console.log("Listening on PORT: ", PORT);
});
