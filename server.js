// server.js
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");

const productsRouter = require("./routes/products");
const logger = require("./middleware/logger");

const app = express();
const PORT = process.env.PORT || 3000;

// 1) Global middleware
app.use(bodyParser.json());
app.use(logger);

// 2) Mount products router
app.use("/api/products", productsRouter);

// 3) 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// 4) Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res
    .status(err.status || 500)
    .json({ error: err.message || "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
