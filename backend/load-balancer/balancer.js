const express = require("express");
const axios = require("axios");

const {
  roundRobin,
  leastConnections,
  weightedRoundRobin
} = require("./algorithms");

const app = express();
const PORT = 4000;

/**
 * Backend servers
 */
const servers = [
  { url: "http://localhost:3001", activeConnections: 0, weight: 3 },
  { url: "http://localhost:3002", activeConnections: 0, weight: 2 },
  { url: "http://localhost:3003", activeConnections: 0, weight: 1 }
];

/**
 * Metrics per server
 */
const metrics = {
  "http://localhost:3001": {
    requests: 0,
    totalLatency: 0
  },
  "http://localhost:3002": {
    requests: 0,
    totalLatency: 0
  },
  "http://localhost:3003": {
    requests: 0,
    totalLatency: 0
  }
};

/**
 * Algorithm selector
 */
function selectServer(algo) {
  switch (algo) {
    case "roundrobin":
      return roundRobin(servers);
    case "least":
      return leastConnections(servers);
    case "weighted":
      return weightedRoundRobin(servers);
    default:
      return roundRobin(servers);
  }
}

app.get("/route", async (req, res) => {
  const algo = req.query.algo || "roundrobin";
  const server = selectServer(algo);

  server.activeConnections++;

  const startTime = Date.now();

  try {
    const response = await axios.get(server.url);

    const latency = Date.now() - startTime;

    // Update metrics
    metrics[server.url].requests += 1;
    metrics[server.url].totalLatency += latency;

    res.json({
      algorithm: algo,
      routedTo: server.url,
      latency: `${latency}ms`,
      data: response.data
    });
  } catch (error) {
    res.status(500).json({ error: "Routing failed" });
  } finally {
    server.activeConnections--;
  }
});

app.get("/metrics", (req, res) => {
  const formattedMetrics = {};

  for (const server in metrics) {
    const data = metrics[server];
    formattedMetrics[server] = {
      requests: data.requests,
      averageLatency:
        data.requests === 0
          ? "0ms"
          : `${Math.round(data.totalLatency / data.requests)}ms`
    };
  }

  res.json(formattedMetrics);
});

app.listen(PORT, () => {
  console.log(`Load Balancer running on port ${PORT}`);
});