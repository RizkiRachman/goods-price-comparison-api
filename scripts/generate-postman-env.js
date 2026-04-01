#!/usr/bin/env node

/**
 * Generate Postman Environment file
 * Creates environment variables for different deployment targets
 */

const fs = require('fs');
const path = require('path');

// Environment configurations
const environments = {
  local: {
    name: "Goods Price API - Local",
    values: [
      { key: "baseUrl", value: "http://localhost:3000", type: "default", enabled: true },
      { key: "apiVersion", value: "v1", type: "default", enabled: true },
      { key: "receipt_id", value: "", type: "default", enabled: true },
      { key: "product_id", value: "", type: "default", enabled: true },
      { key: "store_id", value: "", type: "default", enabled: true }
    ]
  },
  vercel: {
    name: "Goods Price API - Vercel",
    values: [
      { key: "baseUrl", value: "https://goods-price-comparison-api.vercel.app", type: "default", enabled: true },
      { key: "apiVersion", value: "v1", type: "default", enabled: true },
      { key: "receipt_id", value: "", type: "default", enabled: true },
      { key: "product_id", value: "", type: "default", enabled: true },
      { key: "store_id", value: "", type: "default", enabled: true }
    ]
  },
  docker: {
    name: "Goods Price API - Docker",
    values: [
      { key: "baseUrl", value: "http://localhost:4010", type: "default", enabled: true },
      { key: "apiVersion", value: "v1", type: "default", enabled: true },
      { key: "receipt_id", value: "", type: "default", enabled: true },
      { key: "product_id", value: "", type: "default", enabled: true },
      { key: "store_id", value: "", type: "default", enabled: true }
    ]
  }
};

// Generate environment files
Object.entries(environments).forEach(([envName, envConfig]) => {
  const environment = {
    id: `${envName}-${Date.now()}`,
    name: envConfig.name,
    values: envConfig.values,
    _postman_variable_scope: "environment"
  };

  const outputPath = `target/postman-environment-${envName}.json`;
  fs.writeFileSync(outputPath, JSON.stringify(environment, null, 2));
  console.log(`✅ Generated: ${outputPath}`);
});

console.log('\n🎉 Postman environment files generated successfully!');
console.log('\nTo use:');
console.log('1. Open Postman');
console.log('2. Click "Environments" (gear icon)');
console.log('3. Click "Import"');
console.log('4. Select the environment JSON file');
console.log('5. Select the environment from dropdown before making requests');
