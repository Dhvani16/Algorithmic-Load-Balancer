const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 4000;

/**
 * List of backend servers
 * (Hardcoded for now)
 */
const servers = [
  "http://localhost:3001",
  "http://localhost:3002",
  "http://localhost:3003"
];

/**
 * Temporary routing logic:
 * Always forward to Server A
 */
app.get("/route", async (req, res) => {
  try {
    const targetServer = servers[0]; // Always Server A for now

    const response = await axios.get(targetServer);

    res.json({
      routedTo: targetServer,
      data: response.data
    });
  } catch (error) {
    res.status(500).json({
      error: "Backend server unreachable"
    });
  }
});

app.listen(PORT, () => {
  console.log(`Load Balancer running on port ${PORT}`);
});