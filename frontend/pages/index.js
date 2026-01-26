import { useState } from "react";

export default function Home() {
  const [algorithm, setAlgorithm] = useState("roundrobin");
  const [response, setResponse] = useState(null);
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
    } catch (err) {
      setResponse({ error: "Failed to connect to load balancer" });
    } finally {
      setLoading(false);
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

      {response && (
        <pre
          style={{
            background: "#f4f4f4",
            padding: "15px",
            borderRadius: "5px"
          }}
        >
          {JSON.stringify(response, null, 2)}
        </pre>
      )}
    </div>
  );
}