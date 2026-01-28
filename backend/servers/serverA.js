const express = require("express");
const app = express();

let requestCount = 0;

app.get("/", async (req, res) => {
  requestCount++;

  const processingTime = Math.floor(Math.random() * 200) + 50; // 50–250 ms

  setTimeout(() => {
    res.json({
      server: "Server A",
      port: 3001,
      requestCount,
      processingTime: `${processingTime}ms`
    });
  }, processingTime);
});

app.listen(3001, () => {
  console.log("Server A running on port 3001");
});