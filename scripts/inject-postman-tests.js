#!/usr/bin/env node

/**
 * Inject Postman test scripts into generated collection
 * This script adds post-response scripts for automatic ID extraction
 */

const fs = require('fs');
const path = require('path');

const collectionPath = process.argv[2] || 'target/postman-collection.json';

if (!fs.existsSync(collectionPath)) {
    console.error(`Collection file not found: ${collectionPath}`);
    process.exit(1);
}

console.log(`Reading collection from: ${collectionPath}`);
const collection = JSON.parse(fs.readFileSync(collectionPath, 'utf8'));

// Test scripts configuration
const testScripts = {
    'receipts/upload': {
        description: 'Extract receipt ID from upload response',
        script: [
            '// Extract receipt ID from response and set as environment variable',
            'const jsonData = pm.response.json();',
            'if (jsonData && jsonData.id) {',
            '    pm.environment.set("receipt_id", jsonData.id);',
            '    console.log("Receipt ID set:", jsonData.id);',
            '}',
            '',
            '// Validate response',
            'pm.test("Status code is 200 or 201", function () {',
            '    pm.expect(pm.response.code).to.be.oneOf([200, 201]);',
            '});',
            '',
            'pm.test("Response has receipt ID", function () {',
            '    pm.expect(jsonData).to.have.property("id");',
            '    pm.expect(jsonData.id).to.be.a("string");',
            '});'
        ].join('\\n')
    },
    'receipts/{id}/status': {
        description: 'Check receipt status using environment variable',
        script: [
            '// Use receipt_id from environment variable',
            'const receiptId = pm.environment.get("receipt_id");',
            'if (receiptId) {',
            '    console.log("Checking status for receipt:", receiptId);',
            '}',
            '',
            'pm.test("Status code is 200", function () {',
            '    pm.response.to.have.status(200);',
            '});',
            '',
            'pm.test("Response has status field", function () {',
            '    const jsonData = pm.response.json();',
            '    pm.expect(jsonData).to.have.property("status");',
            '});'
        ].join('\\n')
    },
    'receipts/{id}/results': {
        description: 'Get receipt results using environment variable',
        script: [
            '// Use receipt_id from environment variable',
            'const receiptId = pm.environment.get("receipt_id");',
            'if (receiptId) {',
            '    console.log("Getting results for receipt:", receiptId);',
            '}',
            '',
            'pm.test("Status code is 200", function () {',
            '    pm.response.to.have.status(200);',
            '});',
            '',
            'pm.test("Response has items array", function () {',
            '    const jsonData = pm.response.json();',
            '    pm.expect(jsonData).to.have.property("items");',
            '    pm.expect(jsonData.items).to.be.an("array");',
            '});'
        ].join('\\n')
    }
};

// Function to recursively find requests in folders
function processItem(item, parentPath = '') {
    if (item.item && Array.isArray(item.item)) {
        // It's a folder, process children
        item.item.forEach(child => processItem(child, parentPath));
    } else if (item.request) {
        // It's a request, check if we need to add test script
        const requestPath = item.request.url?.path?.join('/') || '';
        const method = item.request.method;
        
        // Match against our test scripts
        for (const [pattern, config] of Object.entries(testScripts)) {
            if (requestPath.includes(pattern) && method === (pattern === 'receipts/upload' ? 'POST' : 'GET')) {
                console.log(`Adding test script to: ${method} ${requestPath}`);
                
                // Initialize event array if not exists
                if (!item.event) {
                    item.event = [];
                }
                
                // Check if test event already exists
                const existingTest = item.event.find(e => e.listen === 'test');
                if (!existingTest) {
                    item.event.push({
                        listen: 'test',
                        script: {
                            type: 'text/javascript',
                            exec: config.script.split('\\n')
                        }
                    });
                    console.log(`  ✓ Added: ${config.description}`);
                } else {
                    console.log(`  ℹ Test script already exists`);
                }
            }
        }
    }
}

// Process all items in the collection
if (collection.item && Array.isArray(collection.item)) {
    collection.item.forEach(item => processItem(item));
}

// Write updated collection back
fs.writeFileSync(collectionPath, JSON.stringify(collection, null, 2));
console.log(`\\n✅ Test scripts injected successfully!`);
console.log(`Updated collection saved to: ${collectionPath}`);
