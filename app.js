const express = require("express");
const app = express();
const port = 3000;

const environment = process.env.ENV || "UNKNOWN";

app.get("/", (req, res) => {
  res.send(`Hello from ${environment} environment!`);
});

app.listen(port, () => {
  console.log(`App running on port ${port} (${environment})`);
});
