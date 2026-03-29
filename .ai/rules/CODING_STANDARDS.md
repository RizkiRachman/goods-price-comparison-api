# Coding Standards

Code quality standards and style guidelines for the project.

## 🚨 Absolute Rules (MUST Follow)

### 1. Never Push to Main
**FORBIDDEN:**
- Direct commits to `main`
- Direct pushes to `main`
- Using `--force` on main

**ALWAYS use PR workflow.**

### 2. Never Auto-Merge
**AI agents CANNOT merge PRs automatically.**

**FORBIDDEN:**
- Auto-merging when CI passes
- Merging without explicit user permission
- Assuming approval from vague responses

**REQUIRED:**
- Wait for user to say: "merge this PR" or "approved, please merge"
- Only explicit permission allows merge

---

## Code Style

### Java Style Guide

Follow Google Java Style Guide with project-specific additions:

**Indentation & Formatting:**
- 4 spaces for indentation (not tabs)
- 100 character line limit
- No trailing whitespace
- One blank line between methods
- Two blank lines between classes

**Naming Conventions:**
```java
// Classes: PascalCase
public class PriceCalculator { }

// Methods: camelCase
public BigDecimal calculateTotalPrice() { }

// Variables: camelCase
private String productName;

// Constants: UPPER_SNAKE_CASE
private static final int MAX_RETRY_COUNT = 3;

// OpenAPI operationIds: camelCase
operationId: searchPrices

// OpenAPI paths: kebab-case
/v1/price-search
```

**Imports:**
```java
// Group imports: java, javax, org, com, project
import java.util.*;
import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.example.goodsprice.model.Price;
```

### Code Structure

**Class Organization:**
```java
public class PriceService {
    // 1. Static fields
    private static final Logger logger = LoggerFactory.getLogger(PriceService.class);
    
    // 2. Instance fields
    private final PriceRepository priceRepository;
    
    // 3. Constructor
    public PriceService(PriceRepository priceRepository) {
        this.priceRepository = priceRepository;
    }
    
    // 4. Public methods
    public PriceResult calculatePrice(PriceRequest request) {
        // implementation
    }
    
    // 5. Private methods
    private void validateRequest(PriceRequest request) {
        // implementation
    }
}
```

**Method Structure:**
```java
public ReturnType methodName(Parameters) {
    // 1. Validate inputs
    // 2. Process logic
    // 3. Return result
}
```

## Code Quality Rules

### Maximum Values

| Metric | Maximum | Rationale |
|--------|---------|-----------|
| Method length | 50 lines | Readability |
| Class length | 500 lines | Single responsibility |
| Cyclomatic complexity | 10 | Testability |
| Method parameters | 5 | Simplicity |
| Nested blocks | 3 levels | Clarity |

### Documentation Requirements

**JavaDoc for ALL public APIs:**
```java
/**
 * Calculates the total price for a product including tax.
 *
 * @param basePrice the base price before tax
 * @param taxRate the tax rate as a decimal (e.g., 0.1 for 10%)
 * @return the total price including tax
 * @throws IllegalArgumentException if basePrice or taxRate is negative
 */
public BigDecimal calculateTotalPrice(BigDecimal basePrice, BigDecimal taxRate) {
    // implementation
}
```

**OpenAPI Documentation:**
- All operations MUST have description
- All parameters MUST have description
- All schemas MUST have descriptions
- Examples SHOULD be provided

### Error Handling

**DO:**
```java
// Use specific exceptions
try {
    price = priceService.calculate(request);
} catch (PriceNotFoundException e) {
    logger.warn("Price not found for product: {}", productId);
    throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Price not found");
}

// Never return null for collections
public List<Price> findPrices() {
    return priceRepository.findAll(); // Returns empty list if none
}

// Use Optional for nullable returns
public Optional<Price> findById(Long id) {
    return priceRepository.findById(id);
}
```

**DON'T:**
```java
// ❌ Catch generic Exception
try {
    // code
} catch (Exception e) { // Too broad!
    // handle
}

// ❌ Return null
public Price findPrice() {
    return null; // Never do this!
}

// ❌ Swallow exceptions
try {
    // code
} catch (Exception e) {
    // Empty catch - BAD!
}

// ❌ Log and throw
catch (Exception e) {
    logger.error("Error", e);
    throw e; // Redundant!
}
```

### Testing Standards

**Every public method MUST have:**
1. Unit test with @Test
2. Happy path test
3. Edge case test(s)
4. Exception test(s)

**Test Naming:**
```java
@Test
@DisplayName("Should calculate total price when quantity is positive")
void shouldCalculateTotalPrice_WhenQuantityIsPositive() {
    // given
    // when
    // then
}
```

**Coverage Requirements:**
- Line coverage: 100% for new code
- Branch coverage: 100% for new code
- Mutation coverage: 80% minimum

### Logging Standards

**Use SLF4J with placeholders:**
```java
// ✅ GOOD
logger.info("Calculating price for product: {} at store: {}", productId, storeId);
logger.debug("Price calculation result: {}", result);
logger.error("Failed to calculate price", exception);

// ❌ BAD
logger.info("Calculating price for product: " + productId); // String concatenation
System.out.println("Debug info"); // Never use in production code
```

**Log Levels:**
- **ERROR:** System errors, exceptions, failures
- **WARN:** Warning conditions, recoverable errors
- **INFO:** Important business operations, milestones
- **DEBUG:** Detailed information for debugging
- **TRACE:** Very detailed, entry/exit points

### Security Rules

**Input Validation:**
```java
// ✅ Validate all inputs
public void processReceipt(@Valid ReceiptRequest request) {
    // @Valid triggers Bean Validation
}

// ✅ Sanitize user input
String sanitized = HtmlUtils.htmlEscape(userInput);
```

**Never in Code:**
- ❌ Hardcoded passwords/API keys
- ❌ System.out.print of sensitive data
- ❌ Stack traces in error responses (production)
- ❌ SQL concatenation (use prepared statements)

### Performance Rules

**Database:**
- Always use indexes on WHERE clauses
- Batch operations for bulk inserts
- Use connection pooling (HikariCP)
- Set query timeouts

**Memory:**
- Use StringBuilder for string concatenation in loops
- Close resources (try-with-resources)
- Avoid unnecessary object creation

**Response Times:**
| Operation | Max Time |
|-----------|----------|
| API Response | < 100ms |
| Database Query | < 10ms |
| File Upload | < 3s |
| OCR Processing | < 10s |

## Enforcement

These standards are enforced by:
- **Checkstyle** - Style violations
- **SpotBugs** - Bug patterns
- **PMD** - Code quality
- **Review** - Human review

**Violations block PR merge.**
