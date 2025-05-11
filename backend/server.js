const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const leaderboardRoutes = require("./routes/leaderboardRoutes");
const bloodRoutes = require("./routes/bloodRoutes");
const donationCampRoutes = require("./routes/donationCampRoutes");
const userRoutes = require("./routes/userRoutes");
const donorRoutes = require("./routes/donorRoutes");
const { setupSocket } = require("./socket");
const errorHandler = require("./middlewares/errorHandler");

dotenv.config();
connectDB();

const app = express();

// ✅ Body Parser and JSON Handling
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

// ✅ CORS Setup (Restrict to specific origins)
const allowedOrigins = [process.env.CLIENT_URL];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Helmet (Set Security Headers)
app.use(helmet());

// ✅ Compression (Optimize Response Size)
app.use(compression());

// ✅ Cookie Parser (Enable Secure Cookie Handling)
app.use(cookieParser());

// ✅ CSRF Protection (Prevent Cross-Site Request Forgery)
// const csrfProtection = csrf({ cookie: true });
// app.use(csrfProtection);

// ✅ Rate Limiting (Prevent API Abuse)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max 100 requests per IP
  message: "Too many requests, please try again later.",
});
app.use("/api", limiter);

// ✅ Logging (Enhanced Request Logging)
app.use(morgan("dev"));

// ✅ Health Check Route (For Monitoring)
app.get("/health", (req, res) => res.status(200).json({ status: "OK" }));

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/blood", bloodRoutes);
app.use("/api/camps", donationCampRoutes);
app.use("/api/donors", donorRoutes);
app.use("/api/organ-donors", require("./routes/organDonorRoutes"));

// ✅ CSRF Token Route (For Frontend Use)
app.get("/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// ✅ Not Found Route
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// ✅ Centralized Error Handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () =>
  console.log(`✅ Server running on port ${PORT}`)
);

// ✅ Setup Socket.IO for real-time communication
setupSocket(server);

// ✅ Graceful Shutdown (Clean Up Connections)
const shutdown = () => {
  console.log("🔻 Shutting down server...");
  server.close(() => {
    console.log("✅ Server closed");
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
