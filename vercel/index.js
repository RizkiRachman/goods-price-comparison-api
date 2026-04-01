const express = require('express');
const app = express();

app.use(express.json());

// Auto-generated from OpenAPI spec
// Generated at: 2026-04-01T12:15:36.422Z

// getApiVersion
app.get('/v1/version', (req, res) => {
  res.json(null);
});

// getHealth
app.get('/v1/health', (req, res) => {
  res.json(null);
});

// getMetrics
app.get('/v1/metrics', (req, res) => {
  res.json(null);
});

// uploadReceipt
app.post('/v1/receipts/upload', (req, res) => {
  res.json({
  "message": "Mock response",
  "_operationId": "uploadReceipt"
});
});

// getReceiptStatus
app.get('/v1/receipts/:id/status', (req, res) => {
  res.json(null);
});

// getReceiptResults
app.get('/v1/receipts/:id/results', (req, res) => {
  res.json(null);
});

// searchPrices
app.post('/v1/prices/search', (req, res) => {
  res.json(null);
});

// searchPricesV2
app.post('/v2/prices/search', (req, res) => {
  res.json(null);
});

// optimizeShoppingRoute
app.post('/v1/shopping/optimize', (req, res) => {
  res.json(null);
});

// getProductTrend
app.get('/v1/products/trend/:productId', (req, res) => {
  res.json(null);
});

// subscribeToAlert
app.post('/v1/alerts/subscribe', (req, res) => {
  res.json(null);
});

module.exports = app;
