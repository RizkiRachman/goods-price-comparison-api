const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ name: 'Goods Price API Mock', version: '1.0.0' });
});

app.get('/v1/version', (req, res) => {
  res.json({ currentVersion: 'v1', supportedVersions: ['v1', 'v2'] });
});

app.get('/v1/health', (req, res) => {
  res.json({ status: 'UP', timestamp: new Date().toISOString() });
});

module.exports = app;
