const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const questionController = require("./controllers/Question");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // React app URL
    methods: ["GET", "POST"],
  },
});

const corsOptions = {
  origin: ["http://localhost:1029"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
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

io.on("connection", (socket) => {
  questionController.handleSocket(socket); // Use Socket.IO handler from QuestionController
});

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`Server is running on port ${port}`));
