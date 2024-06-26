const { Server } = require("socket.io");
const http = require("http");
const express = require("express");
const app = express();
// const cors = require('cors')
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173","https://chat-app886.netlify.app"],
    credentials: true,
    methods: ["GET", "POST"],
  },
});

const userSocketMap = {};

const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};
console.log("userSocketMap",userSocketMap)

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  const userId = socket.handshake.query.userId;
  console.log("userIdmy",userId)
  if (userId != "undefined") {
    userSocketMap[userId] = socket.id;
  }
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

module.exports = { app, io, server, getReceiverSocketId };
