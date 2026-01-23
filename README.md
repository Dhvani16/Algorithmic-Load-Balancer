# Algorithmic Load Balancer with Request Routing

## Problem Statement
Traditional round-robin load balancing can overload servers under skewed workloads.
This project implements and compares multiple algorithmic routing strategies to
demonstrate performance-aware request distribution.

---

## Algorithms Implemented
- Round Robin
- Least Connections
- Weighted Round Robin

---

## System Architecture
Client → Load Balancer → Backend Servers

The load balancer dynamically routes HTTP requests to backend servers based on
the selected algorithm and collects real-time performance metrics.

---

## Tech Stack
- Node.js
- Express
- Next.js
- Vercel (Deployment)

---

## Features
- Algorithm selection at runtime
- Simulated backend servers with variable latency
- Performance metrics (request count, latency)
- Live demo with visual comparison

---

## Live Demo
🔗 <Vercel URL>

---

## How to Run Locally
```
cd backend
npm install
node servers/serverA.js
node servers/serverB.js
node servers/serverC.js
node load-balancer/balancer.js
```

---

## Learning Outcome
- Load balancing fundamentals
- Algorithmic decision-making
- HTTP request routing
- Cloud deployment concepts