const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 4000;

/**
 * Backend servers with connection tracking
 */
const servers = [
  { url: "http://localhost:3001", activeConnections: 0 },
  { url: "http://localhost:3002", activeConnections: 0 },
  { url: "http://localhost:3003", activeConnections: 0 }
];

/**
 * Select server with least active connections
 */
function getLeastConnectionsServer() {
  return servers.reduce((min, server) =>
    server.activeConnections < min.activeConnections ? server : min
  );
}

app.get("/route", async (req, res) => {
  const server = getLeastConnectionsServer();
  server.activeConnections++;

  try {
    const response = await axios.get(server.url);

    res.json({
      algorithm: "Least Connections",
      routedTo: server.url,
      activeConnections: server.activeConnections,
      data: response.data
    });
  } catch (error) {
    res.status(500).json({
      error: "Routing failed"
    });
  } finally {
    // Ensure decrement even on failure
    server.activeConnections--;
  }
});

app.listen(PORT, () => {
  console.log(`Load Balancer (Least Connections) running on port ${PORT}`);
});