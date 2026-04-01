#!/usr/bin/env node

/**
 * Auto-generate Express routes from OpenAPI specification
 * This script parses openapi-bundled.yaml and generates vercel/index.js
 */

const fs = require('fs');
const yaml = require('js-yaml');

const OPENAPI_PATH = 'src/main/resources/openapi/openapi-bundled.yaml';
const OUTPUT_PATH = 'vercel/index.js';

function resolveRef(spec, ref) {
  if (!ref || !ref.startsWith('#/')) return null;
  
  const parts = ref.slice(2).split('/');
  let current = spec;
  
  for (const part of parts) {
    const key = part.replace(/~1/g, '/').replace(/~0/g, '~');
    if (current && typeof current === 'object') {
      current = current[key];
    } else {
      return null;
    }
  }
  
  return current;
}

function resolveSchema(spec, schema) {
  if (!schema) return null;
  
  if (schema.$ref) {
    return resolveSchema(spec, resolveRef(spec, schema.$ref));
  }
  
  return schema;
}

function generateMockValue(spec, schema) {
  if (!schema) return null;
  
  const resolved = resolveSchema(spec, schema);
  if (!resolved) return null;
  
  if (resolved.example !== undefined) return resolved.example;
  if (resolved.default !== undefined) return resolved.default;
  
  if (resolved.allOf) {
    const merged = {};
    for (const subSchema of resolved.allOf) {
      const subMock = generateMockValue(spec, subSchema);
      if (subMock && typeof subMock === 'object') {
        Object.assign(merged, subMock);
      }
    }
    return Object.keys(merged).length > 0 ? merged : null;
  }
  
  if (resolved.oneOf || resolved.anyOf) {
    const schemas = resolved.oneOf || resolved.anyOf;
    return generateMockValue(spec, schemas[0]);
  }
  
  if (resolved.type === 'string') {
    if (resolved.format === 'date-time') return new Date().toISOString();
    if (resolved.format === 'date') return new Date().toISOString().split('T')[0];
    if (resolved.format === 'uuid') return '550e8400-e29b-41d4-a716-446655440000';
    if (resolved.format === 'email') return 'user@example.com';
    if (resolved.format === 'uri') return 'https://example.com';
    return resolved.enum ? resolved.enum[0] : 'sample-value';
  }
  if (resolved.type === 'integer' || resolved.type === 'number') {
    if (resolved.minimum !== undefined && resolved.maximum !== undefined) {
      return Math.floor((resolved.minimum + resolved.maximum) / 2);
    }
    return resolved.type === 'integer' ? 123 : 123.45;
  }
  if (resolved.type === 'boolean') return true;
  if (resolved.type === 'array') {
    if (resolved.items) {
      const itemMock = generateMockValue(spec, resolved.items);
      return itemMock !== null ? [itemMock] : [];
    }
    return [];
  }
  if (resolved.type === 'object' || resolved.properties) {
    const obj = {};
    if (resolved.properties) {
      for (const [key, prop] of Object.entries(resolved.properties)) {
        if (key !== 'additionalProperties') {
          const value = generateMockValue(spec, prop);
          if (value !== null) {
            obj[key] = value;
          }
        }
      }
    }
    return Object.keys(obj).length > 0 ? obj : null;
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
        
        // Get success response (200, 201, or 202)
        const responses = operation.responses || {};
        const successResponse = responses['200'] || responses['201'] || responses['202'] || responses.default;
        
        let mockResponse = { message: 'Mock response' };
        
        if (successResponse && successResponse.content) {
          const jsonContent = successResponse.content['application/json'];
          if (jsonContent && jsonContent.schema) {
            mockResponse = generateMockValue(spec, jsonContent.schema);
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
          mockResponse
        });
      }
    }
  }
  
  return routes;
}

function generateIndexJs(routes) {
  const routeHandlers = routes.map(route => {
    const formattedJson = JSON.stringify(route.mockResponse, null, 2)
      .replace(/\n/g, '\n  ');
    return `// ${route.operationId}
app.${route.method.toLowerCase()}('${route.path}', (req, res) => {
  res.json(${formattedJson});
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
