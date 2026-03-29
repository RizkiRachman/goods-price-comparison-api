# OpenAPI Standards

Standards for API specification and design.

## File Organization

```
openapi/
├── main.yaml              # Entry point - references all paths
├── paths/                 # Endpoint definitions
│   ├── system.yaml
│   ├── receipts.yaml
│   ├── prices.yaml
│   ├── shopping.yaml
│   ├── products.yaml
│   └── alerts.yaml
└── schemas/               # Data models
    ├── common.yaml
    ├── requests.yaml
    ├── responses.yaml
    ├── models.yaml
    └── v2/
        └── prices.yaml
```

## General Rules

### File Naming
- Use **kebab-case** for all files
- Group related endpoints in one file
- Version-specific schemas in `v{N}/` folder

### Path Naming

**Format:** `/v{N}/{resource}/{action}`

**Examples:**
```yaml
/v1/receipts/upload           # Good
/v1/receipts/{id}/status      # Good
/v2/prices/search             # Good with version

/api/v1/receipts/upload       # Bad - redundant /api
/v1/receiptsUpload            # Bad - camelCase
/v1/receipts/upload/          # Bad - trailing slash
```

### Versioning

**URL Path Versioning (Required):**
```yaml
/v1/prices/search    # Version 1
/v2/prices/search    # Version 2
```

**Rules:**
- Major versions in path: `/v1/`, `/v2/`
- Breaking changes only in new major version
- Deprecate old versions (30 days notice)
- Maintain backward compatibility within version

## Operation Standards

### Required Fields

Every operation MUST have:
```yaml
/v1/prices/search:
  post:
    summary: Search product prices           # ✅ Required
    description: |                           # ✅ Required
      Detailed description of what this does.
      Can be multi-line.
    operationId: searchPrices                # ✅ Required (camelCase)
    tags:                                    # ✅ Required
      - Prices
    requestBody:                             # If applicable
      ...
    responses:                               # ✅ Required
      ...
```

### Operation ID Naming

**Format:** `{action}{Resource}`

**Examples:**
```yaml
operationId: searchPrices           # Good
operationId: uploadReceipt          # Good
operationId: getReceiptStatus       # Good
operationId: price-search           # Bad - kebab-case
operationId: SearchPrices           # Bad - PascalCase
```

### Tag Usage

**Format:** PascalCase, descriptive

```yaml
tags:
  - Prices              # Good
  - Receipt Processing  # Good with space
  - shopping            # Bad - lowercase
```

**Common Tags:**
- `System`
- `Receipts`
- `Prices`
- `Shopping`
- `Products`
- `Alerts`

## Parameter Standards

### Path Parameters

```yaml
parameters:
  - name: id
    in: path
    required: true
    schema:
      type: string
      format: uuid
    description: Unique job identifier    # ✅ Required
    example: "550e8400-e29b-41d4-a716-446655440000"
```

**Requirements:**
- Always include `description`
- Provide `example` when possible
- Use appropriate `format` (uuid, date, etc.)

### Query Parameters

```yaml
parameters:
  - name: page
    in: query
    schema:
      type: integer
      default: 1
      minimum: 1
    description: Page number for pagination
```

### Request Body

```yaml
requestBody:
  required: true
  content:
    application/json:
      schema:
        $ref: '#/components/schemas/PriceSearchRequest'
    multipart/form-data:              # For file uploads
      schema:
        type: object
        properties:
          image:
            type: string
            format: binary
```

## Response Standards

### Success Responses (2xx)

```yaml
responses:
  '200':
    description: Search completed successfully  # ✅ Required
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/PriceSearchResponse'
    headers:                                      # Optional but good practice
      X-API-Version:
        description: API version
        schema:
          type: string
```

### Error Responses (4xx/5xx)

```yaml
responses:
  '400':
    description: Invalid search parameters
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/ErrorResponse'
  
  '404':
    description: Product not found
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/ErrorResponse'
```

**Error Response Format:**
```yaml
ErrorResponse:
  type: object
  properties:
    error:
      type: object
      properties:
        code:
          type: string
          example: "VALIDATION_ERROR"
        message:
          type: string
          example: "Invalid request data"
        details:
          type: array
          items:
            type: object
            properties:
              field:
                type: string
              message:
                type: string
```

## Schema Standards

### Naming Conventions

**Request Schemas:** `{Action}Request` or `{Resource}Request`
```yaml
PriceSearchRequest
ReceiptUploadRequest
AlertSubscriptionRequest
```

**Response Schemas:** `{Action}Response` or `{Resource}Response`
```yaml
PriceSearchResponse
ReceiptStatusResponse
```

**Model Schemas:** Descriptive nouns
```yaml
ReceiptItem
PriceResult
StoreVisit
```

### Schema Structure

```yaml
PriceSearchRequest:
  type: object
  description: |                          # ✅ Required
    Request body for searching product prices.
    Supports filtering by location, date range, and sorting.
  properties:
    productName:
      type: string
      description: Product name to search for
      example: "Ultra Milk Plain Slim"
      minLength: 1
      maxLength: 255
    dateRange:
      $ref: '#/components/schemas/DateRange'
    sortBy:
      type: string
      enum: [price, date, store, relevance]
      default: price
      description: Field to sort results by
  required:                                 # ✅ Specify required fields
    - productName
```

### Data Types

**Primitives:**
```yaml
type: string
format: uuid      # UUID
type: string
format: date      # YYYY-MM-DD
type: string
format: date-time # ISO 8601
type: integer
format: int64     # ID fields
type: number
format: double    # Prices, calculations
type: boolean
type: array
```

**Validation:**
```yaml
properties:
  quantity:
    type: integer
    minimum: 1
    maximum: 1000
    description: Quantity to purchase
  
  price:
    type: number
    format: double
    minimum: 0
    exclusiveMinimum: true  # Must be > 0
  
  email:
    type: string
    format: email
    pattern: '^[\w\.-]+@[\w\.-]+\.\w+$'
```

### Examples

**Always provide examples:**
```yaml
properties:
  productName:
    type: string
    description: Product name
    example: "Ultra Milk Plain Slim 200ml"  # ✅ Required
  
  price:
    type: number
    format: double
    description: Price per unit
    example: 5600.00
```

## Linting & Validation

### Spectral Rules

Run linting before committing:
```bash
spectral lint src/main/resources/openapi/main.yaml --ruleset .spectral.yaml
```

**Enforced Rules:**
- ✅ All operations must have operationId (camelCase)
- ✅ All operations must have descriptions
- ✅ All operations must have tags
- ✅ Path parameters must have descriptions
- ✅ No empty descriptions
- ✅ Info section must have contact and license

### Common Linting Errors

**Error:** `operation-operationId` missing
**Fix:** Add operationId to every operation

**Error:** `operation-description` missing
**Fix:** Add description field

**Error:** `path-param-description` missing
**Fix:** Add description to path parameters

**Error:** `operation-tags` missing
**Fix:** Add tags array to operation

## Documentation

### Info Section

```yaml
info:
  title: Goods Price Comparison API
  description: |                            # Multi-line description
    REST API for the Goods Price Comparison Service.
    
    ## API Versioning
    
    This API uses URL path versioning...
  version: 1.0.0
  contact:
    name: API Support
  license:
    name: MIT
```

### Tag Definitions

```yaml
tags:
  - name: System
    description: System and API information endpoints
  - name: Receipts
    description: Receipt upload and OCR processing
```

## Version 2 Patterns

When creating v2 endpoints:

1. **Create new paths file:** `paths/prices.yaml` (both v1 and v2)
2. **Version-specific schemas:** `schemas/v2/prices.yaml`
3. **Reference correctly:**
```yaml
paths:
  /v1/prices/search:
    $ref: './paths/prices.yaml#/paths/~1v1~1prices~1search'
  
  /v2/prices/search:
    $ref: './paths/prices.yaml#/paths/~1v2~1prices~1search'
```

## Best Practices

### DO

- ✅ Split large specs into multiple files
- ✅ Use $ref to reuse schemas
- ✅ Provide examples for all schemas
- ✅ Document breaking changes
- ✅ Version your API
- ✅ Use consistent naming
- ✅ Add descriptions to everything

### DON'T

- ❌ Put everything in one huge file
- ❌ Use inconsistent naming
- ❌ Skip descriptions
- ❌ Break backward compatibility without versioning
- ❌ Use generic operationIds like "get" or "post"
- ❌ Forget error responses
- ❌ Hardcode URLs in descriptions

## References

- [OpenAPI Specification 3.0.3](https://spec.openapis.org/oas/v3.0.3)
- [Swagger Editor](https://editor.swagger.io/)
- [Spectral Documentation](https://docs.stoplight.io/docs/spectral/)
