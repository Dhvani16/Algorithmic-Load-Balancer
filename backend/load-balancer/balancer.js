const express = require("express");
const axios = require("axios");
const cors = require("cors");

/*
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});
*/

const {
  roundRobin,
  leastConnections,
  weightedRoundRobin
} = require("./algorithms");

const app = express();
app.use(cors());
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
 * Metrics per algorithm per server
 */
const metrics = {
  roundrobin: {},
  least: {},
  weighted: {}
};

servers.forEach(server => {
  metrics.roundrobin[server.url] = { requests: 0, totalLatency: 0 };
  metrics.least[server.url] = { requests: 0, totalLatency: 0 };
  metrics.weighted[server.url] = { requests: 0, totalLatency: 0 };
});

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

    // Update metrics for selected algorithm
    metrics[algo][server.url].requests += 1;
    metrics[algo][server.url].totalLatency += latency;

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

app.get("/metrics/raw", (req, res) => {
  res.json(metrics);
});

app.get("/metrics/formatted", (req, res) => {
  const response = {};

  for (const algo in metrics) {
    response[algo] = [];

    for (const server in metrics[algo]) {
      const data = metrics[algo][server];

      response[algo].push({
        server,
        requests: data.requests,
        averageLatency:
          data.requests === 0
            ? 0
            : Math.round(data.totalLatency / data.requests)
      });
    }
  }

  res.json(response);
});

/*
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
*/

app.listen(PORT, () => {
  console.log(`Load Balancer running on port ${PORT}`);
});