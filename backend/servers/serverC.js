const express = require("express");
const app = express();

let requestCount = 0;

app.get("/", async (req, res) => {
  requestCount++;

  const processingTime = Math.floor(Math.random() * 150) + 30; // fastest

  setTimeout(() => {
    res.json({
      server: "Server C",
      port: 3003,
      requestCount,
      processingTime: `${processingTime}ms`
    });
  }, processingTime);
});

app.listen(3003, () => {
  console.log("Server C running on port 3003");
});