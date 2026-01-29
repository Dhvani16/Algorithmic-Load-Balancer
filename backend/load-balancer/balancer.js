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
const PORT = process.env.PORT || 5000;

/**
 * Backend servers
 */
const servers = [
  { id: "server-1", activeConnections: 0, weight: 3, baseLatency: 120 },
  { id: "server-2", activeConnections: 0, weight: 2, baseLatency: 80 },
  { id: "server-3", activeConnections: 0, weight: 1, baseLatency: 40 }
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
  metrics.roundrobin[server.id] = { requests: 0, totalLatency: 0 };
  metrics.least[server.id] = { requests: 0, totalLatency: 0 };
  metrics.weighted[server.id] = { requests: 0, totalLatency: 0 };
});

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

function simulateServerRequest(server) {
  return new Promise((resolve) => {
    server.activeConnections++;

    const jitter = Math.floor(Math.random() * 30);
    const latency = server.baseLatency + jitter;

    setTimeout(() => {
      server.activeConnections--;
      resolve(latency);
    }, latency);
  });
}

app.get("/route", async (req, res) => {
  const algo = req.query.algo || "roundrobin";
  const server = selectServer(algo);

  console.log("Incoming route request:", req.query);
  console.log("Selected server:", server.id);

  try {
    const latency = await simulateServerRequest(server);

    metrics[algo][server.id].requests += 1;
    metrics[algo][server.id].totalLatency += latency;

    res.json({
      algorithm: algo,
      routedTo: server.id,
      latency: `${latency}ms`
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Routing failed" });
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