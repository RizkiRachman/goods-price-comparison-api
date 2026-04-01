const express = require('express');
const app = express();

app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({
    name: 'Goods Price Comparison API Mock',
    version: '1.0.0',
    status: 'running',
    endpoints: [
      'GET /v1/version',
      'GET /v1/health',
      'GET /v1/metrics',
      'GET /v1/prices/search',
      'POST /v1/receipts/upload',
      'GET /v1/receipts/:id/status',
      'GET /v1/products/:id/trend'
    ]
  });
});

app.get('/v1/version', (req, res) => {
  res.json({
    currentVersion: "v1",
    supportedVersions: ["v1", "v2"],
    deprecationInfo: null
  });
});

app.get('/v1/health', (req, res) => {
  res.json({
    status: "UP",
    timestamp: new Date().toISOString(),
    version: "1.2.2"
  });
});

app.get('/v1/metrics', (req, res) => {
  res.json({
    uptime: 3600,
    requests: { total: 1000, successful: 950, failed: 50 },
    responseTime: { average: 120, p50: 100, p95: 200, p99: 500 }
  });
});

app.get('/v1/prices/search', (req, res) => {
  res.json({
    results: [{
      productId: "prod-001",
      productName: "Ultra Milk Full Cream 1L",
      category: "Dairy",
      prices: [{ storeId: "store-001", storeName: "Superindo", price: 18500, currency: "IDR" }]
    }],
    pagination: { totalItems: 1, itemsPerPage: 10, currentPage: 1, totalPages: 1 }
  });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Mock server running on port ${PORT}`));
}

// Export for Vercel serverless
module.exports = app;
