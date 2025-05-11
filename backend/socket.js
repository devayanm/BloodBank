const socketIo = require("socket.io");

let io;

const setupSocket = (server) => {
  io = socketIo(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
};

module.exports = { setupSocket, io };
