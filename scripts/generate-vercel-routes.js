#!/usr/bin/env node

/**
 * Auto-generate Express routes from OpenAPI specification
 * This script parses openapi-bundled.yaml and generates vercel/index.js
 */

const fs = require('fs');
const yaml = require('js-yaml');

const OPENAPI_PATH = 'src/main/resources/openapi/openapi-bundled.yaml';
const OUTPUT_PATH = 'vercel/index.js';

// Default mock responses based on schema types
const DEFAULT_RESPONSES = {
  string: 'sample-string',
  integer: 123,
  number: 123.45,
  boolean: true,
  array: [],
  object: {}
};

function generateMockValue(schema) {
  if (!schema) return null;
  
  if (schema.example !== undefined) return schema.example;
  if (schema.default !== undefined) return schema.default;
  
  if (schema.type === 'string') {
    if (schema.format === 'date-time') return new Date().toISOString();
    if (schema.format === 'date') return new Date().toISOString().split('T')[0];
    return schema.enum ? schema.enum[0] : 'sample-value';
  }
  if (schema.type === 'integer') return 123;
  if (schema.type === 'number') return 123.45;
  if (schema.type === 'boolean') return true;
  if (schema.type === 'array') {
    if (schema.items) {
      return [generateMockValue(schema.items)];
    }
    return [];
  }
  if (schema.type === 'object') {
    const obj = {};
    if (schema.properties) {
      for (const [key, prop] of Object.entries(schema.properties)) {
        obj[key] = generateMockValue(prop);
      }
    }
    return obj;
  }
  
  return null;
}

function generateExpressRoutes(spec) {
  const routes = [];
  const paths = spec.paths || {};
  
  for (const [path, methods] of Object.entries(paths)) {
    for (const [method, operation] of Object.entries(methods)) {
      if (['get', 'post', 'put', 'delete', 'patch'].includes(method)) {
        const expressPath = path.replace(/{/g, ':').replace(/}/g, '');
        const operationId = operation.operationId || `${method}_${path.replace(/\//g, '_')}`;
        
        // Get success response (200 or 201)
        const responses = operation.responses || {};
        const successResponse = responses['200'] || responses['201'] || responses.default;
        
        let mockResponse = { message: 'Mock response' };
        
        if (successResponse && successResponse.content) {
          const jsonContent = successResponse.content['application/json'];
          if (jsonContent && jsonContent.schema) {
            mockResponse = generateMockValue(jsonContent.schema);
          }
        }
        
        // Add operationId to response for debugging
        if (typeof mockResponse === 'object' && mockResponse !== null) {
          mockResponse._operationId = operationId;
        }
        
        routes.push({
          method: method.toUpperCase(),
          path: expressPath,
          operationId,
          mockResponse: JSON.stringify(mockResponse, null, 2)
        });
      }
    }
  }
  
  return routes;
}

function generateIndexJs(routes) {
  const routeHandlers = routes.map(route => {
    return `// ${route.operationId}
app.${route.method.toLowerCase()}('${route.path}', (req, res) => {
  res.json(${route.mockResponse});
});`;
  }).join('\n\n');

  return `const express = require('express');
const app = express();

app.use(express.json());

// Auto-generated from OpenAPI spec
// Generated at: ${new Date().toISOString()}

${routeHandlers}

module.exports = app;
`;
}

// Main execution
try {
  console.log('Reading OpenAPI spec...');
  const spec = yaml.load(fs.readFileSync(OPENAPI_PATH, 'utf8'));
  
  console.log('Generating Express routes...');
  const routes = generateExpressRoutes(spec);
  
  console.log(`Generated ${routes.length} routes`);
  
  console.log('Writing vercel/index.js...');
  const indexJs = generateIndexJs(routes);
  fs.writeFileSync(OUTPUT_PATH, indexJs);
  
  console.log('✅ Successfully generated vercel/index.js');
  console.log('\nGenerated routes:');
  routes.forEach(route => {
    console.log(`  ${route.method} ${route.path}`);
  });
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
