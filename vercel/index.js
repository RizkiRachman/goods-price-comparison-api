const express = require('express');
const app = express();

app.use(express.json());

// Root endpoint
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
      'GET /v1/receipts/:id/results',
      'GET /v1/products/:productId/trend',
      'POST /v1/shopping/optimize-route',
      'POST /v1/alerts/subscribe'
    ]
  });
});

// Version
app.get('/v1/version', (req, res) => {
  res.json({
    currentVersion: 'v1',
    supportedVersions: ['v1', 'v2'],
    deprecationInfo: null
  });
});

// Health
app.get('/v1/health', (req, res) => {
  res.json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    version: '1.2.2'
  });
});

// Metrics
app.get('/v1/metrics', (req, res) => {
  res.json({
    uptime: 3600,
    requests: {
      total: 1000,
      successful: 950,
      failed: 50
    },
    responseTime: {
      average: 120,
      p50: 100,
      p95: 200,
      p99: 500
    },
    errors: {
      validation: 10,
      notFound: 25,
      serverError: 15
    }
  });
});

// Search Prices
app.get('/v1/prices/search', (req, res) => {
  const { query, location } = req.query;
  res.json({
    results: [
      {
        productId: 'prod-001',
        productName: query || 'Sample Product',
        category: 'Dairy',
        prices: [
          {
            storeId: 'store-001',
            storeName: 'Superindo',
            price: 18500,
            currency: 'IDR',
            promoDetails: null
          }
        ]
      }
    ],
    pagination: {
      totalItems: 1,
      itemsPerPage: 10,
      currentPage: 1,
      totalPages: 1
    }
  });
});

// Upload Receipt
app.post('/v1/receipts/upload', (req, res) => {
  res.json({
    id: 'receipt-' + Date.now(),
    status: 'PROCESSING',
    message: 'Receipt uploaded successfully, processing started',
    createdAt: new Date().toISOString()
  });
});

// Get Receipt Status
app.get('/v1/receipts/:id/status', (req, res) => {
  res.json({
    id: req.params.id,
    status: 'COMPLETED',
    progress: 100,
    message: 'Processing completed'
  });
});

// Get Receipt Results
app.get('/v1/receipts/:id/results', (req, res) => {
  res.json({
    id: req.params.id,
    items: [
      {
        itemId: 'item-001',
        productName: 'Ultra Milk 1L',
        quantity: 2,
        price: 18500
      }
    ],
    totalAmount: 37000,
    storeName: 'Superindo',
    processedAt: new Date().toISOString()
  });
});

// Product Trend
app.get('/v1/products/:productId/trend', (req, res) => {
  res.json({
    productId: req.params.productId,
    productName: 'Sample Product',
    timeRange: {
      start: '2026-01-01',
      end: '2026-03-31'
    },
    dataPoints: [
      { date: '2026-01-01', avgPrice: 18000, minPrice: 17500, maxPrice: 18500 },
      { date: '2026-02-01', avgPrice: 18200, minPrice: 17800, maxPrice: 18700 },
      { date: '2026-03-01', avgPrice: 18500, minPrice: 18000, maxPrice: 19000 }
    ],
    priceChange: {
      absolute: 500,
      percentage: 2.78,
      trend: 'UP'
    }
  });
});

// Optimize Shopping Route
app.post('/v1/shopping/optimize-route', (req, res) => {
  res.json({
    optimizedRoute: [
      {
        storeId: 'store-001',
        storeName: 'Superindo',
        location: { lat: -6.2088, lng: 106.8456 },
        visitOrder: 1,
        itemsToPurchase: ['Milk', 'Bread'],
        estimatedCost: 50000
      }
    ],
    totalStores: 1,
    totalEstimatedCost: 50000,
    totalDistanceKm: 2.5,
    estimatedDurationMinutes: 30,
    savings: {
      amount: 5000,
      percentage: 10
    }
  });
});

// Subscribe to Alerts
app.post('/v1/alerts/subscribe', (req, res) => {
  res.json({
    subscriptionId: 'sub-' + Date.now(),
    productId: req.body.productId,
    targetPrice: req.body.targetPrice,
    status: 'ACTIVE',
    createdAt: new Date().toISOString()
  });
});

module.exports = app;
