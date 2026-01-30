# Algorithmic Load Balancer with Adaptive Request Routing

A lightweight, application-level load balancer that dynamically routes HTTP requests using multiple routing algorithms and exposes real-time performance metrics through an interactive dashboard.

---

## Problem Statement

Traditional round-robin load balancing distributes traffic evenly but fails under skewed or bursty workloads. Servers with slower response times or higher active connections can become overloaded, leading to performance degradation.

This project demonstrates how **algorithmic routing decisions** improve load distribution and system responsiveness under varying traffic patterns.

---

## Key Features

- Application-level load balancer
- Multiple routing algorithms:
  - Round Robin
  - Least Connections
  - Weighted Round Robin
- Simulated backend servers
- Real-time metrics collection
- Interactive frontend dashboard
- Burst load testing and comparison

---

## System Architecture

Client (Browser)
↓
Next.js Frontend (Dashboard)
↓
Node.js Load Balancer (Express)
↓
Simulated Backend Servers

---

## Routing Algorithms Implemented

### Round Robin
Distributes requests sequentially across all servers without considering load or response time.

**Use case:** Uniform workloads.

---

### Least Connections
Routes each request to the server with the fewest active connections.

**Use case:** Uneven or burst traffic.

---

### Weighted Round Robin
Distributes requests proportionally based on predefined server weights.

**Use case:** Heterogeneous server capacities.

---

## Metrics Tracked

- Total requests per server
- Active connections
- Request distribution per algorithm
- Burst load behavior

Metrics update in real time and allow side-by-side comparison of routing strategies.

---

## Tech Stack

**Backend**
- Node.js
- Express.js
- Custom routing algorithms
- REST APIs

**Frontend**
- Next.js
- React
- CSS Modules

---

## Getting Started (Local Setup)

### 1. Clone the Repository

```bash
git clone https://github.com/Dhvani16/Algorithmic-Load-Balancer.git
cd Algorithmic-Load-Balancer
```

### 2. Start Backend

```bash
cd backend
npm install
node index.js
```
Backend (local) runs on http://localhost:5000

### 3. Start Frontend

```bash
cd frontend
npm install
npm run dev
```
Frontend(local) runs on http://localhost:3000

---

## How to Use

- Select a routing algorithm from the dropdown
- Click Send Request for individual routing
- Click Run Burst Test to simulate high load
- Observe real-time metrics and distribution behavior

---

## What This Project Demonstrates

- Understanding of load balancing strategies
- Algorithmic decision-making under load
- Backend system design fundamentals
- Real-time metrics visualization
- End-to-end full-stack development

---

## Future Improvements

- Dockerized deployment
- Kubernetes-based scaling
- Latency-based routing
- Persistent metrics storage
- Authentication for admin dashboard

---

## Live Demo

Link: https://algorithmic-load-balancer.vercel.app/

---

## Author

Dhvani Patel

---