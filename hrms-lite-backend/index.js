const express = require("express");
const cors = require("cors");
const { connectDB } = require("./db");
const { EmployeeRouter } = require("./routes/employeeRoutes");
const { AttendanceRouter } = require("./routes/attendanceRoutes");
const { DashboardRouter } = require("./routes/dashboardRoutes");
const { AuthRouter } = require("./routes/authRoutes");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.status(200).json({ success: true, msg: "HRMS Lite API is running" });
});

// Routes
app.use("/api/auth", AuthRouter);
app.use("/api/dashboard", DashboardRouter);
app.use("/api/employees", EmployeeRouter);
app.use("/api/attendance", AttendanceRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, msg: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, msg: "Internal server error" });
});

// Connect DB and start server
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`HRMS Lite server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("DB connection error:", error.message);
    process.exit(1);
  });

// Export for Vercel serverless
module.exports = app;