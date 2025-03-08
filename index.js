const express = require("express")
const http = require("http")
const { Server } = require("socket.io")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()
const questionController = require("./controllers/Question")
const carbonSocket = require("./controllers/carbonSocket")

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: [
      "http://10.40.1.25",
      "http://10.40.1.25:3000",
      "http://10.40.0.119:1029",
      "http://10.40.0.143:1029",
      "http://10.40.110.0:1029",
      "http://localhost:1029",
      "https://pcarbon.vercel.app",
      "https://carbon-foot-print-dashboard.vercel.app",
      "http://10.40.3.206:1029",
      "http://172.20.10.2:1029",
      "http://192.168.182.13:1029",
      "http://192.168.182.13:4312",
    ], // React app URL
    methods: ["GET", "POST", "DELETE", "PUT"],
  },
})

const corsOptions = {
  origin: [
    "http://10.40.1.25",
    "http://10.40.1.25:3000",
    "http://localhost:3000",
    "http://localhost:1029",
    "http://10.40.110.0:1029",
    "http://10.40.0.143:1029",
    "https://pcarbon.vercel.app",
    "https://project-carbon-footprint-website.vercel.app",
    "https://project-carbon-footprint-website.vercel.app/pledge",
    "http://10.40.3.206:1029",
    "http://172.20.10.2:1029",
    "http://192.168.182.13:1029",
    "http://192.168.182.13:4312",
    "https://carbon-foot-print-dashboard.vercel.app",
  ],
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "x-auth"],
}

// allow access only specific origin
app.use(cors(corsOptions))

// Middle ware to parse json
app.use(express.json())

// MongoDB connection logic with retry functionality
const connectWithRetry = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log("✅ Connected to MongoDB successfully")
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error.message)
    console.log("🔄 Retrying in 5 seconds...")
    setTimeout(connectWithRetry, 5000) // Retry after 5 seconds
  }
}

// Initial MongoDB connection attempt
connectWithRetry()

// MongoDB event handlers for disconnection and error handling
mongoose.connection.on("disconnected", () => {
  console.log("⚠️ MongoDB disconnected! Retrying...")
  connectWithRetry()
})

mongoose.connection.on("error", err => {
  console.error("❌ MongoDB connection error:", err.message)
})

// Test route
app.get("/", (req, res) => {
  res.send("We are in the home page")
})

app.use("/api/v1/user", require("./routes/userRoutes"))
app.use("/api/v1/carbonFootPrint", require("./routes/carbonFootPrint"))
app.use("/api/v1/question", require("./routes/Question"))
app.use("/api/v1/endUser", require("./routes/endUser"))
app.use("/api/v1/pledge", require("./routes/pledge"))
app.use("/api/v1/questionAttempts", require("./routes/questionAttempt"))
app.use("/api/v1/languages", require("./routes/language"))
app.use("/api/v1/questionCatagories", require("./routes/questionCategory"))

// for all reports
app.use("/api/v1/reports/overview", require("./reports/overview.routes"))
app.use(
  "/api/v1/reports/carbonFootprint",
  require("./reports/carbonFootprint.routes")
)
app.use("/api/v1/reports/pledge", require("./reports/pledge.routes"))

io.on("connection", socket => {
  carbonSocket.carbonSocket(socket)
  questionController.handleSocket(socket)
})

const port = process.env.PORT || 5000
server.listen(port, () =>
  console.log(`Server is running on  http://localhost:${port}`)
)
