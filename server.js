require("dotenv").config();

const express = require("express");
const cors = require("cors");

const searchRoutes = require("./routes/searchRoutes");

const app = express();

const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

app.use("/api/search", searchRoutes);

// Test route
app.get("/", (req, res) => {
    res.json({
        message: "MUSICOLOGIST Backend is running successfully!"
    });
});

// Health check
app.get("/api/health", (req, res) => {
    res.json({
        ok: true,
        service: "MUSICOLOGIST API",
        status: "Backend is working"
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`MUSICOLOGIST Backend running on http://localhost:${PORT}`);
});