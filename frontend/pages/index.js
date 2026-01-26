import { useState } from "react";

export default function Home() {
  const [algorithm, setAlgorithm] = useState("roundrobin");
  const [response, setResponse] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(false);

  async function sendRequest() {
    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch(
        `http://localhost:4000/route?algo=${algorithm}`
      );
      const data = await res.json();
      setResponse(data);
      await fetchMetrics();
    } catch (err) {
      setResponse({ error: "Failed to connect to load balancer" });
    } finally {
      setLoading(false);
    }
  }

  async function fetchMetrics() {
    try {
      const res = await fetch("http://localhost:4000/metrics/formatted");
      const data = await res.json();
      setMetrics(data);
    } catch (err) {
      console.error("Failed to fetch metrics");
    }
  }

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Algorithmic Load Balancer Demo</h1>

      <label>
        Select Routing Algorithm:
        <select
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
          style={{ marginLeft: "10px" }}
        >
          <option value="roundrobin">Round Robin</option>
          <option value="least">Least Connections</option>
          <option value="weighted">Weighted Round Robin</option>
        </select>
      </label>

      <br /><br />

      <button onClick={sendRequest} disabled={loading}>
        {loading ? "Routing..." : "Send Request"}
      </button>

      <br /><br />

      {/*response && (
        <details style={{ marginTop: "20px" }}>
          <summary>View Raw Response (Debug)</summary>
          <pre style={{ background: "#222", color: "#0f0", padding: "10px" }}>
            {JSON.stringify(response, null, 2)}
          </pre>
        </details>
      )*/}

      {metrics && (
        <div style={{ marginTop: "40px" }}>
          <h2>Performance Metrics</h2>

          {Object.keys(metrics).map((algo) => (
            <div key={algo} style={{ marginBottom: "30px" }}>
              <h3>{algo.toUpperCase()}</h3>

              <table
                border="1"
                cellPadding="8"
                style={{ borderCollapse: "collapse", width: "100%" }}
              >
                <thead>
                  <tr>
                    <th>Server</th>
                    <th>Requests</th>
                    <th>Avg Latency (ms)</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics[algo].map((row) => (
                    <tr key={row.server}>
                      <td>{row.server}</td>
                      <td>{row.requests}</td>
                      <td>{row.averageLatency}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}