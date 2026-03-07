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

// Database Connection
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI)
  .then(() => console.log("MongoDB Connected (Cloud/Live) ✅"))
  .catch((err) => {
    console.error("MongoDB Connection Error ❌");
    console.error(err);
  });

app.get("/", (req, res) => {
  res.send("Gym Portal API is running... 🚀");
});

// Diagnostic Ping for Frontend Proxy Test
app.get("/api/ping", (req, res) => res.json({ message: "BACKEND-OK", time: new Date() }));

// 🛡️ Global 404 JSON Handler
app.use((req, res) => {
  console.warn(`[404-NOT-FOUND] ${req.method} ${req.url}`);
  res.status(404).json({
    message: `The endpoint ${req.method} ${req.url} does not exist on this server.`,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} 🔥`);
});