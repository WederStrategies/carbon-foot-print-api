const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const questionController = require("./controllers/Question");

const app = express();
const server = http.createServer(app);

// Socket.io
// const { initializeSocket } = require("./utility/socket")

// Socket Main
// const { mainSocket } = require("./controllers/socket")

const io = new Server(server, {
  cors: {
    origin: "http://10.40.0.119:1029", // React app URL
    methods: ["GET", "POST", "DELETE", "PUT"],
  },
});

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://project-carbon-footprint-website.vercel.app",
    "https://project-carbon-footprint-website.vercel.app/pledge",
  ],
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "x-auth"],
};

// allow access only specific origin
app.use(cors(corsOptions));

// Middle ware to parse json
app.use(express.json());

// Database Connection
mongoose
  .connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

// initializeSocket(server)
// mainSocket()

// Test route
app.get("/", (req, res) => {
  res.send("We are in the home page");
});

app.use("/api/v1/user", require("./routes/userRoutes"));
app.use("/api/v1/carbonFootPrint", require("./routes/carbonFootPrint"));
app.use("/api/v1/question", require("./routes/Question"));
app.use("/api/v1/endUser", require("./routes/endUser"));
app.use("/api/v1/pledge", require("./routes/pledge"));
app.use("/api/v1/questionAttempts", require("./routes/questionAttempt"));
app.use("/api/v1/languages", require("./routes/language"));
app.use("/api/v1/questionCatagories", require("./routes/questionCategory"));

// for all reports
app.use("/api/v1/reports/overview", require("./reports/overview.routes"));

app.use(
  "/api/v1/reports/carbonFootprint",
  require("./reports/carbonFootprint.routes")
);
app.use("/api/v1/reports/pledge", require("./reports/pledge.routes"));

// io.on("connection", (socket) => {
//   questionController.handleSocket(socket); // Use Socket.IO handler from QuestionController
// });

var defaultRoomName = "room-123";

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.emit("checkSocketC", "Hello Nigga");

  socket.on("checkSocket", (data) => {
    socket.emit("connectionWorks");
  });

  socket.on("page_mode", (data) => {
    const dataJSON = JSON.parse(data);

    socket.join(dataJSON.unique_code);

    // const clients = io.sockets.adapter.rooms.get(dataJSON.unique_code)
    // if (!clients) {
    //   socket.join(dataJSON.unique_code)
    // } else {
    //   socket.emit("room-already-in-use")
    // }

    console.log(dataJSON);
  });

  socket.on("join-room", (data) => {
    console.log("Room Joined");
    socket.join(defaultRoomName);
  });

  socket.on("get-rooms", (data) => {
    const clients = io.sockets.adapter.rooms.get(dataJSON.unique_code);
    console.log(clients);
  });

  socket.on("language-change-option-server", (data) => {
    const dataJSON = JSON.parse(data);

    console.log(dataJSON);

    socket.to(defaultRoomName).emit("language-change-option-client", data);
  });

  // Change Page
  socket.on("change-page-server-1", (data) => {
    socket.to(defaultRoomName).emit("change-page-client-1", data);
  });

  // Change Name State
  socket.on("name-change-server-1", (data) => {
    console.log("Name Change");
    socket.to(defaultRoomName).emit("name-change-client-1", data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

io.on("checkSocket", (socket) => {
  console.log("Check Connection");
});

const port = process.env.PORT || 5000;
server.listen(port, () =>
  console.log(`Server is running on  http://localhost:${port}`)
);
