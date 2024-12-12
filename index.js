const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

const corsOptions = {
  origin: ["http://localhost:4302"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  credentials: true,
  allowedHeaders: ["Content-Type", "x-auth"], // add any other headers your client sends
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

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
