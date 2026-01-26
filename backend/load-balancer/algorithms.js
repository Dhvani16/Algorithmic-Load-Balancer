let roundRobinIndex = 0;
let weightedIndex = 0;
let weightedServers = [];

/**
 * Build weighted server list once
 */
function initializeWeightedServers(servers) {
  weightedServers = [];
  servers.forEach(server => {
    for (let i = 0; i < server.weight; i++) {
      weightedServers.push(server);
    }
  });
}

/**
 * Standard Round Robin
 */
function roundRobin(servers) {
  const server = servers[roundRobinIndex];
  roundRobinIndex = (roundRobinIndex + 1) % servers.length;
  return server;
}

/**
 * Least Connections
 */
function leastConnections(servers) {
  const minConnections = Math.min(
    ...servers.map(s => s.activeConnections)
  );

  const candidates = servers.filter(
    s => s.activeConnections === minConnections
  );

  return candidates[Math.floor(Math.random() * candidates.length)];
}

/**
 * Weighted Round Robin
 */
function weightedRoundRobin(servers) {
  if (weightedServers.length === 0) {
    initializeWeightedServers(servers);
  }

  const server = weightedServers[weightedIndex];
  weightedIndex = (weightedIndex + 1) % weightedServers.length;
  return server;
}

module.exports = {
  roundRobin,
  leastConnections,
  weightedRoundRobin
};