# Java Development

Java programming skills and best practices.

## Core Concepts

### Java 17+ Features

**Records (DTOs):**
```java
// Immutable data class
public record PriceResult(
    String storeName,
    BigDecimal price,
    LocalDateTime timestamp
) {}

// Usage
PriceResult result = new PriceResult("Store", price, timestamp);
```

**Pattern Matching:**
```java
// Old way
if (obj instanceof String) {
    String s = (String) obj;
    // use s
}

// New way
if (obj instanceof String s) {
    // use s directly
}

// Switch expressions
String result = switch (status) {
    case ACTIVE -> "Active";
    case INACTIVE -> "Inactive";
    default -> throw new IllegalArgumentException();
};
```

**Text Blocks:**
```java
String json = """
    {
        "name": "product",
        "price": 10.00
    }
    """;
```

### Stream API

**Common Operations:**
```java
// Filter
List<Price> highPrices = prices.stream()
    .filter(p -> p.getAmount().compareTo(threshold) > 0)
    .toList();

// Map
List<String> storeNames = prices.stream()
    .map(Price::getStoreName)
    .distinct()
    .toList();

// Reduce
BigDecimal total = prices.stream()
    .map(Price::getAmount)
    .reduce(BigDecimal.ZERO, BigDecimal::add);

// Grouping
Map<String, List<Price>> byStore = prices.stream()
    .collect(Collectors.groupingBy(Price::getStoreName));

// Sorting
List<Price> sorted = prices.stream()
    .sorted(Comparator.comparing(Price::getAmount))
    .toList();
```

### Optional

**Proper Usage:**
```java
// Return Optional instead of null
public Optional<Price> findById(Long id) {
    return priceRepository.findById(id);
}

// Usage
findById(id).ifPresent(price -> {
    // process price
});

// Or provide default
Price price = findById(id)
    .orElseGet(() -> new Price());

// Or throw
Price price = findById(id)
    .orElseThrow(() -> new NotFoundException("Price not found"));
```

## Data Handling

### Date/Time (java.time)

```java
// Current date/time
LocalDate today = LocalDate.now();
LocalDateTime now = LocalDateTime.now();
Instant instant = Instant.now();

// Formatting
DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
String formatted = today.format(formatter);

// Parsing
LocalDate date = LocalDate.parse("2026-03-29", formatter);

// Calculations
LocalDate tomorrow = today.plusDays(1);
LocalDate lastWeek = today.minusWeeks(1);

// Period between dates
Period period = Period.between(startDate, endDate);
int days = period.getDays();
```

### BigDecimal (Money)

```java
// Never use float/double for money!
// ✅ GOOD
BigDecimal price = new BigDecimal("10.99");
BigDecimal quantity = new BigDecimal("3");
BigDecimal total = price.multiply(quantity);

// Comparison
if (price1.compareTo(price2) > 0) {
    // price1 is greater
}

// Rounding
BigDecimal rounded = price
    .setScale(2, RoundingMode.HALF_UP);
```

### Collections

```java
// Prefer immutable collections
List<String> list = List.of("a", "b", "c");
Set<String> set = Set.of("a", "b");
Map<String, Integer> map = Map.of(
    "key1", 1,
    "key2", 2
);

// ArrayList for mutable
List<Price> prices = new ArrayList<>();

// HashMap for mutable
Map<String, Price> priceMap = new HashMap<>();
```

## Error Handling

### Exceptions

**Custom Exceptions:**
```java
public class PriceNotFoundException extends RuntimeException {
    public PriceNotFoundException(String message) {
        super(message);
    }
    
    public PriceNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}

// Usage
if (price == null) {
    throw new PriceNotFoundException("Price not found for id: " + id);
}
```

**Exception Handling:**
```java
// Controller advice
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(PriceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(PriceNotFoundException e) {
        ErrorResponse error = new ErrorResponse(
            HttpStatus.NOT_FOUND.value(),
            e.getMessage()
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneric(Exception e) {
        log.error("Unexpected error", e);
        ErrorResponse error = new ErrorResponse(
            HttpStatus.INTERNAL_SERVER_ERROR.value(),
            "An unexpected error occurred"
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}
```

### Validation

**Bean Validation:**
```java
public class PriceRequest {
    @NotNull(message = "Product name is required")
    @Size(min = 1, max = 255)
    private String productName;
    
    @NotNull
    @Positive(message = "Price must be positive")
    private BigDecimal price;
    
    @Min(1)
    @Max(1000)
    private int quantity;
}

// Usage in controller
public ResponseEntity<Price> createPrice(
    @Valid @RequestBody PriceRequest request
) {
    // @Valid triggers validation
}
```

## Functional Programming

### Functional Interfaces

```java
// Common functional interfaces
Consumer<T>      // accepts T, returns void
Function<T, R>   // accepts T, returns R
Predicate<T>     // accepts T, returns boolean
Supplier<T>      // returns T

// Examples
Consumer<String> printer = System.out::println;
printer.accept("Hello");

Function<String, Integer> length = String::length;
int len = length.apply("Hello");

Predicate<Integer> isEven = n -> n % 2 == 0;
boolean even = isEven.test(4);

Supplier<LocalDateTime> now = LocalDateTime::now;
LocalDateTime current = now.get();
```

### Method References

```java
// Static method
list.forEach(System.out::println);

// Instance method
list.sort(String::compareTo);

// Constructor
Supplier<List<String>> listFactory = ArrayList::new;
```

## Best Practices

### DO

- ✅ Use `final` for immutable fields
- ✅ Use `var` for local variables (Java 10+)
- ✅ Use `Optional` instead of null
- ✅ Use `BigDecimal` for money
- ✅ Use `java.time` for dates
- ✅ Use streams for collections
- ✅ Use records for DTOs

### DON'T

- ❌ Use `null` - use Optional instead
- ❌ Use `float`/`double` for money
- ❌ Use `java.util.Date`
- ❌ Catch generic `Exception`
- ❌ Use `System.out.println` in production
- ❌ Return null from methods

## Common Patterns

### Builder Pattern

```java
public class PriceSearchRequest {
    private final String productName;
    private final String location;
    private final LocalDate from;
    private final LocalDate to;
    
    private PriceSearchRequest(Builder builder) {
        this.productName = builder.productName;
        this.location = builder.location;
        this.from = builder.from;
        this.to = builder.to;
    }
    
    public static Builder builder() {
        return new Builder();
    }
    
    public static class Builder {
        private String productName;
        private String location;
        private LocalDate from;
        private LocalDate to;
        
        public Builder productName(String productName) {
            this.productName = productName;
            return this;
        }
        
        public Builder location(String location) {
            this.location = location;
            return this;
        }
        
        public PriceSearchRequest build() {
            return new PriceSearchRequest(this);
        }
    }
}

// Usage
PriceSearchRequest request = PriceSearchRequest.builder()
    .productName("Milk")
    .location("Jakarta")
    .build();
```

### Factory Pattern

```java
public interface PriceCalculator {
    BigDecimal calculate(Price price);
}

public class DiscountCalculator implements PriceCalculator {
    @Override
    public BigDecimal calculate(Price price) {
        return price.getAmount().multiply(new BigDecimal("0.9"));
    }
}

public class PriceCalculatorFactory {
    public static PriceCalculator getCalculator(String type) {
        return switch (type) {
            case "DISCOUNT" -> new DiscountCalculator();
            case "REGULAR" -> new RegularCalculator();
            default -> throw new IllegalArgumentException("Unknown type");
        };
    }
}
```

## Performance

### Memory

```java
// Use StringBuilder for loops
StringBuilder sb = new StringBuilder();
for (String s : list) {
    sb.append(s);
}
String result = sb.toString();

// Try-with-resources
try (Connection conn = dataSource.getConnection();
     PreparedStatement stmt = conn.prepareStatement(sql)) {
    // use resources
} // auto-closed
```

### Concurrency

```java
// Concurrent collections
ConcurrentHashMap<String, Price> map = new ConcurrentHashMap<>();

// Executor service
ExecutorService executor = Executors.newFixedThreadPool(4);
Future<Price> future = executor.submit(() -> calculatePrice(id));
Price price = future.get();

// Always shutdown
executor.shutdown();
```
