// import { Server as socketIO } from "socket.io"
const { Server } = require("socket.io")

let io

// Initialize Socket.IO with the server instance
function initializeSocket(server) {
  io = new Server(server, {
    cors: {
      origin: true,
      optionsSuccessStatus: 200,
      methods: ["GET", "POST", "DELETE", "PUT"],
    },
  })

  io.on("connection", socket => {
    console.log("New client connected:", socket.id)

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id)
    })
  })

  io.on("checkSocket", () => {
    console.log("Check Connection")
  })
}

function getIO() {
  if (!io) {
    throw new Error("Socket.io not initialized")
  }
  return io
}

module.exports = { initializeSocket, getIO }
