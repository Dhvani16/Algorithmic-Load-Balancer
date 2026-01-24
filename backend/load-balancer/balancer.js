const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 4000;

/**
 * Backend servers
 */
const servers = [
  "http://localhost:3001",
  "http://localhost:3002",
  "http://localhost:3003"
];

/**
 * Round Robin index
 * Maintains state across requests
 */
let currentIndex = 0;

/**
 * Round Robin routing
 */
app.get("/route", async (req, res) => {
  try {
    // Select server using Round Robin
    const targetServer = servers[currentIndex];

    // Move index forward
    currentIndex = (currentIndex + 1) % servers.length;

    const response = await axios.get(targetServer);

    res.json({
      algorithm: "Round Robin",
      routedTo: targetServer,
      data: response.data
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to route request"
    });
  }
});

app.listen(PORT, () => {
  console.log(`Load Balancer (Round Robin) running on port ${PORT}`);
});