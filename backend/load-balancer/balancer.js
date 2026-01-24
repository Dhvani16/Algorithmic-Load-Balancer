const express = require("express");
const axios = require("axios");

const {
  roundRobin,
  leastConnections
} = require("./algorithms");

const app = express();
const PORT = 4000;

/**
 * Backend servers
 */
const servers = [
  { url: "http://localhost:3001", activeConnections: 0 },
  { url: "http://localhost:3002", activeConnections: 0 },
  { url: "http://localhost:3003", activeConnections: 0 }
];

/**
 * Algorithm selector
 */
function selectServer(algo) {
  switch (algo) {
    case "roundrobin":
      return roundRobin(servers);
    case "least":
      return leastConnections(servers);
    default:
      return roundRobin(servers);
  }
}

app.get("/route", async (req, res) => {
  const algo = req.query.algo || "roundrobin";
  const server = selectServer(algo);

  server.activeConnections++;

  try {
    const response = await axios.get(server.url);

    res.json({
      algorithm: algo,
      routedTo: server.url,
      activeConnections: server.activeConnections,
      data: response.data
    });
  } catch (error) {
    res.status(500).json({ error: "Routing failed" });
  } finally {
    server.activeConnections--;
  }
});

app.listen(PORT, () => {
  console.log(`Load Balancer running on port ${PORT}`);
});