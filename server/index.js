const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { Socket } = require("net");
const { text } = require("stream/consumers");
const { timeStamp } = require("console");

const app = express();
const server = http.createServer(app);

// Allow requests from the Vite dev server on port 5173
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(cors());

// Track online users per room -- {roomName: Set of usernames}
const roomUsers = {};

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // --- Join Room ---
  socket.on("join_room", ({ room, username }) => {
    // Leave any previously joined rooms first
    // socket.rooms always contains the socket's own id as first entry
    const prevRooms = [...socket.rooms].filter((r) => r !== socket.id);
    prevRooms.forEach((r) => {
      socket.leave(r);

      // Remove user from previous room's online list
      if (roomUsers[r]) {
        rooomUsers[r].delete(username);
        io.to(r).emit("room_users", [...roomUsers[r]]);
      }

      // Notify previous room that user left
      io.to(r).emit("system_message", {
        text: `${username} left the room`,
        timeStamp: new Date().toISOString(),
      });
    });

    socket.join(room);
    socket.data.username = username;
    socket.data.room = room;

    // Add user to room's online list
    if (!roomUsers[room]) roomUsers[room] = new Set();
    roomUsers[room].add(username);

    // Broadcast updated user list to everyone in the room
    io.to(room).emit("room_users", [...roomUsers[room]]);

    // Notify room that user joined
    io.to(room).emit("system_message", {
      text: `${username} joined the room`,
      timeStamp: new Date().toISOString(),
    });
  });

  // --- Send Message ---
  socket.on("send_message", ({ room, message }) => {
    // Broadcase to everyone in the room including sender
    io.to(room).emit("receive_message", {
      id: crypto.randomUUID(),
      text: message,
      sender: socket.data.username,
      timeStamp: new Date().toISOString(),
    });
  });

  // --- Typing Indicators ---
  socket.on("typing", ({ room }) => {
    // Broadcast to everyone EXCEPT the sender
    socket
      .to(room)
      .emit("user_stop_typing", { username: socket.data.username });
  });
  socket.on("stop_typing", ({ room }) => {
    socket
      .to(room)
      .emit("user_stop_typing", { username: socket.data.username });
  });

  // --- Disconnect ---
  socket.on("disconnect", () => {
    const { username, room } = socket.data;

    if (room && roomUsers[room]) {
      roomUsers[room].delete(username);
      io.to(room).emit("room_users", [...roomUsers[room]]);
      io.to(room).emit("system_message", {
        text: `${username} disconnected`,
        timeStamp: new Date().toISOString(),
      });
    }
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = 3001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
