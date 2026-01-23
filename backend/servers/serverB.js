const express = require("express");
const app = express();

let requestCount = 0;

app.get("/", async (req, res) => {
  requestCount++;

  const processingTime = Math.floor(Math.random() * 300) + 100; // slower

  setTimeout(() => {
    res.json({
      server: "Server B",
      port: 3002,
      requestCount,
      processingTime: `${processingTime}ms`
    });
  }, processingTime);
});

app.listen(3002, () => {
  console.log("Server B running on port 3002");
});