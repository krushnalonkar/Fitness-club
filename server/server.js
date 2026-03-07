require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

app.use("/api/testimonials", require("./routes/testimonialRoutes"));
app.use("/api/chat", require("./routes/chatRoutes"));
app.use("/api/plans", require("./routes/planRoutes"));
app.use('/api/trainers', require('./routes/trainerRoutes'));
app.use('/api/contacts', require('./routes/contactRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));

// Local MongoDB Connection
const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/GymPortal";

mongoose.connect(mongoURI)
  .then(() => console.log("Local MongoDB Connected ✅"))
  .catch((err) => {
    console.error("MongoDB Connection Error ❌");
    console.error(err);
  });

app.get("/", (req, res) => {
  res.send("API is running locally... 🚀");
});

// Diagnostic Ping for Frontend Proxy Test
app.get("/api/ping", (req, res) => res.json({ message: "BACKEND-OK", time: new Date() }));

// 🛡️ Global 404 JSON Handler (CRITICAL for debugging)
app.use((req, res) => {
  console.warn(`[404-NOT-FOUND] ${req.method} ${req.url}`);
  res.status(404).json({
    message: `The endpoint ${req.method} ${req.url} does not exist on this server. Check your routes!`,
    suggestion: "If this route SHOULD exist, restart your backend server."
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 [SERVER-LATEST-STABLE] Running on port ${PORT} 🔥`);
});