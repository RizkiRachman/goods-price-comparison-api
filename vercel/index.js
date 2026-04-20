const express = require('express');
const app = express();

app.use(express.json());

// Auto-generated from OpenAPI spec
// Generated at: 2026-04-20T08:27:05.541Z

// getApiVersion
app.get('/v1/version', (req, res) => {
  res.json({
    "version": "v1",
    "fullVersion": "1.0.0",
    "status": "stable",
    "supportedVersions": [
      {
        "version": "v1",
        "status": "stable",
        "baseUrl": "/api/v1"
      }
    ],
    "deprecationInfo": {
      "deprecatedSince": "2026-06-01",
      "sunsetDate": "2026-09-01",
      "migrationGuide": "https://docs.goodsprice.com/migration/v1-to-v2"
    },
    "_operationId": "getApiVersion"
  });
});

// getHealth
app.get('/v1/health', (req, res) => {
  res.json({
    "status": "UP",
    "components": {
      "api": "UP",
      "database": "UP",
      "ocr": "UP"
    },
    "timestamp": "2026-03-31T10:30:00Z",
    "version": "1.2.1",
    "_operationId": "getHealth"
  });
});

// getMetrics
app.get('/v1/metrics', (req, res) => {
  res.json({
    "uptime": 86400,
    "requests": {
      "total": 1024567,
      "successful": 1023000,
      "failed": 1567,
      "ratePerMinute": 712.5
    },
    "responseTime": {
      "average": 45.2,
      "p50": 38,
      "p95": 120.5,
      "p99": 250
    },
    "errors": {
      "validationErrors": 1234,
      "notFoundErrors": 56,
      "serverErrors": 3
    },
    "timestamp": "2026-03-31T10:30:00Z",
    "_operationId": "getMetrics"
  });
});

// uploadReceipt
app.post('/v1/receipts/upload', (req, res) => {
  res.json({
    "jobId": "550e8400-e29b-41d4-a716-446655440000",
    "status": "PROCESSING",
    "message": "Receipt uploaded successfully. Processing started.",
    "_operationId": "uploadReceipt"
  });
});

// getReceiptStatus
app.get('/v1/receipts/:id/status', (req, res) => {
  res.json({
    "jobId": "550e8400-e29b-41d4-a716-446655440000",
    "status": "PENDING_REVIEW",
    "progress": 100,
    "message": "OCR complete. Awaiting user review.",
    "_operationId": "getReceiptStatus"
  });
});

// getReceiptResults
app.get('/v1/receipts/:id/results', (req, res) => {
  res.json({
    "jobId": "550e8400-e29b-41d4-a716-446655440000",
    "storeName": "DIAMOND",
    "storeLocation": "Poins Square",
    "date": "2026-03-29",
    "items": [
      {
        "productName": "Ultra Milk Plain Slim 200ml",
        "category": "Dairy",
        "quantity": 48,
        "unitPrice": 5600,
        "totalPrice": 268800,
        "unit": "bottle"
      }
    ],
    "totalAmount": 1207206,
    "_operationId": "getReceiptResults"
  });
});

// approveReceipt
app.post('/v1/receipts/:id/approve', (req, res) => {
  res.json({
    "jobId": "550e8400-e29b-41d4-a716-446655440000",
    "status": "INGESTING",
    "message": "Receipt approved. Data ingestion started.",
    "_operationId": "approveReceipt"
  });
});

// rejectReceipt
app.post('/v1/receipts/:id/reject', (req, res) => {
  res.json({
    "jobId": "550e8400-e29b-41d4-a716-446655440000",
    "status": "REJECTED",
    "message": "Receipt rejected.",
    "_operationId": "rejectReceipt"
  });
});

// searchPrices
app.post('/v1/prices/search', (req, res) => {
  res.json({
    "productName": "Ultra Milk Plain Slim 200ml",
    "results": [
      {
        "storeId": 1,
        "storeName": "DIAMOND",
        "storeLocation": "Poins Square",
        "price": 5600,
        "unitPrice": 5600,
        "dateRecorded": "2026-03-29",
        "isPromo": false
      }
    ],
    "cheapest": {
      "storeName": "Superindo",
      "price": 5400,
      "savings": 200
    },
    "_operationId": "searchPrices"
  });
});

// searchPricesV2
app.post('/v2/prices/search', (req, res) => {
  res.json({
    "productName": "Ultra Milk Plain Slim 200ml",
    "results": [
      {
        "storeId": 1,
        "storeName": "DIAMOND",
        "storeLocation": "Poins Square",
        "storeChain": "Diamond Supermarket",
        "price": 5600,
        "unitPrice": 5600,
        "dateRecorded": "2026-03-29T14:30:00Z",
        "isPromo": false,
        "promoDetails": {
          "promoType": "discount",
          "discountPercentage": 10,
          "validUntil": "2026-04-05T23:59:59Z"
        },
        "priceHistory": [
          {
            "date": "2026-03-01",
            "price": 5800
          }
        ],
        "priceChange": {
          "changeAmount": -200,
          "changePercentage": -3.45,
          "trend": "falling"
        },
        "availability": "in_stock",
        "distance": 2.5,
        "relevanceScore": 0.95
      }
    ],
    "cheapest": {
      "storeName": "Superindo",
      "price": 5400,
      "savings": 200
    },
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "totalItems": 150,
      "totalPages": 8,
      "hasNext": true,
      "hasPrevious": false
    },
    "predictions": {
      "nextWeekPrice": 5300,
      "confidence": 0.85,
      "trend": "falling"
    },
    "metadata": {
      "searchTime": "2026-03-29T10:30:00Z",
      "resultCount": 20,
      "filtersApplied": [
        "location:Jakarta Selatan",
        "brand:Ultra Milk"
      ]
    },
    "_operationId": "searchPricesV2"
  });
});

// optimizeShoppingRoute
app.post('/v1/shopping/optimize', (req, res) => {
  res.json({
    "totalItems": 5,
    "totalCost": 375200,
    "storesToVisit": 2,
    "route": [
      {
        "storeId": 3,
        "storeName": "Superindo",
        "storeLocation": "Poins Square",
        "items": [
          {
            "productName": "Ultra Milk Plain Slim 200ml",
            "price": 5400,
            "quantity": 1
          }
        ],
        "subtotal": 94900,
        "estimatedTime": "15 mins"
      }
    ],
    "savings": {
      "comparedToSingleStore": 45200,
      "percentage": 10.7
    },
    "_operationId": "optimizeShoppingRoute"
  });
});

// getProductTrend
app.get('/v1/products/trend/:productId', (req, res) => {
  res.json({
    "productId": 1,
    "productName": "Ultra Milk Plain Slim 200ml",
    "trend": [
      {
        "period": "2026-01-01",
        "avgPrice": 5800,
        "minPrice": 5600,
        "maxPrice": 6000,
        "dataPoints": 5
      }
    ],
    "trendDirection": "decreasing",
    "priceChange": -3.4,
    "_operationId": "getProductTrend"
  });
});

// subscribeToAlert
app.post('/v1/alerts/subscribe', (req, res) => {
  res.json({
    "subscriptionId": "sub-12345",
    "status": "ACTIVE",
    "productName": "Ultra Milk Plain Slim 200ml",
    "currentPrice": 5600,
    "targetPrice": 5000,
    "message": "You will be notified when price drops to Rp 5,000 or below",
    "_operationId": "subscribeToAlert"
  });
});

module.exports = app;
