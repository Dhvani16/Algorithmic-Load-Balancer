let roundRobinIndex = 0;

/**
 * Round Robin algorithm
 */
function roundRobin(servers) {
  const server = servers[roundRobinIndex];
  roundRobinIndex = (roundRobinIndex + 1) % servers.length;
  return server;
}

/**
 * Least Connections algorithm
 */
function leastConnections(servers) {
  return servers.reduce((min, server) =>
    server.activeConnections < min.activeConnections ? server : min
  );
}

module.exports = {
  roundRobin,
  leastConnections
};