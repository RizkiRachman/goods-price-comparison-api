# Testing

Comprehensive testing strategies and practices.

## Testing Pyramid

```
    /\
   /  \    E2E Tests (5%)
  /----\   Integration (15%)
 /------\  Unit Tests (80%)
/________\
```

## Unit Testing

### JUnit 5 Basics

**Test Structure:**
```java
@Test
@DisplayName("Should calculate total price when quantity is positive")
void shouldCalculateTotalPrice_WhenQuantityIsPositive() {
    // given - Setup
    Price price = new Price(BigDecimal.valueOf(10.00));
    int quantity = 5;
    
    // when - Execute
    BigDecimal total = calculator.calculateTotal(price, quantity);
    
    // then - Verify
    assertEquals(BigDecimal.valueOf(50.00), total);
}
```

**Common Assertions:**
```java
// Equality
assertEquals(expected, actual);
assertEquals(expected, actual, "Custom message");

// Null/Not Null
assertNull(object);
assertNotNull(object);

// True/False
assertTrue(condition);
assertFalse(condition);

// Exceptions
Exception exception = assertThrows(IllegalArgumentException.class, () -> {
    calculator.calculate(null, 5);
});
assertEquals("Price cannot be null", exception.getMessage());

// Lists
assertEquals(3, list.size());
assertTrue(list.contains(item));
```

### Mockito

**Basic Mocking:**
```java
@ExtendWith(MockitoExtension.class)
class PriceServiceTest {
    
    @Mock
    private PriceRepository priceRepository;
    
    @InjectMocks
    private PriceService priceService;
    
    @Test
    void shouldReturnPrice_WhenFound() {
        // given
        Long id = 1L;
        Price expectedPrice = new Price(BigDecimal.valueOf(10.00));
        when(priceRepository.findById(id)).thenReturn(Optional.of(expectedPrice));
        
        // when
        Optional<Price> result = priceService.findById(id);
        
        // then
        assertTrue(result.isPresent());
        assertEquals(expectedPrice, result.get());
        verify(priceRepository).findById(id);
    }
}
```

**Verification:**
```java
// Verify called once
verify(priceRepository).findById(id);

// Verify number of calls
verify(priceRepository, times(2)).findById(any());
verify(priceRepository, never()).delete(any());

// Verify no other interactions
verifyNoMoreInteractions(priceRepository);

// Argument matching
verify(service).processPrice(argThat(price -> 
    price.getAmount().compareTo(BigDecimal.ZERO) > 0
));
```

**Argument Matchers:**
```java
when(repository.findById(any())).thenReturn(Optional.empty());
when(repository.findById(eq(1L))).thenReturn(Optional.of(price));
when(repository.findById(anyLong())).thenReturn(Optional.empty());
```

## Integration Testing

### Spring Boot Test

```java
@SpringBootTest
@AutoConfigureMockMvc
class PriceControllerIntegrationTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Autowired
    private PriceRepository priceRepository;
    
    @BeforeEach
    void setUp() {
        priceRepository.deleteAll();
    }
    
    @Test
    void shouldCreatePrice() throws Exception {
        // given
        String request = """
            {
                "productName": "Milk",
                "price": 10.00
            }
            """;
        
        // when & then
        mockMvc.perform(post("/api/v1/prices")
                .contentType(MediaType.APPLICATION_JSON)
                .content(request))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.productName").value("Milk"))
            .andExpect(jsonPath("$.price").value(10.00));
    }
}
```

### Database Testing

```java
@DataJpaTest
class PriceRepositoryTest {
    
    @Autowired
    private PriceRepository repository;
    
    @Test
    void shouldSavePrice() {
        // given
        Price price = Price.builder()
            .productName("Milk")
            .amount(BigDecimal.valueOf(10.00))
            .build();
        
        // when
        Price saved = repository.save(price);
        
        // then
        assertNotNull(saved.getId());
        assertEquals("Milk", saved.getProductName());
    }
    
    @Test
    void shouldFindByProductName() {
        // given
        repository.save(new Price("Milk", BigDecimal.valueOf(10.00)));
        
        // when
        List<Price> results = repository.findByProductName("Milk");
        
        // then
        assertEquals(1, results.size());
    }
}
```

### Testcontainers

```java
@SpringBootTest
@Testcontainers
class DatabaseIntegrationTest {
    
    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:14")
        .withDatabaseName("testdb")
        .withUsername("test")
        .withPassword("test");
    
    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }
    
    @Test
    void shouldConnectToDatabase() {
        // Test with real database
    }
}
```

## Test Coverage

### Coverage Types

**Line Coverage:**
- Every line executed at least once
- Minimum: 100% for new code

**Branch Coverage:**
- Every if/else branch executed
- Minimum: 100% for new code

**Mutation Testing (PIT):**
- Code changes must fail tests
- Minimum: 80%

### Checking Coverage

```bash
# Run with coverage
mvn clean test jacoco:report

# View report
open target/site/jacoco/index.html
```

### Coverage Requirements

| Code Type | Line | Branch | Mutation |
|-----------|------|--------|----------|
| New Code | 100% | 100% | 80% |
| Existing | 90% | 90% | 80% |
| Critical | 100% | 100% | 90% |

## Test Organization

### Naming Conventions

```java
// Format: should[ExpectedBehavior]_When[Condition]

@Test
void shouldCalculateTotal_WhenQuantityIsPositive()

@Test
void shouldThrowException_WhenPriceIsNegative()

@Test
void shouldReturnEmpty_WhenProductNotFound()
```

### Test Classes

```java
// One test class per production class
PriceService → PriceServiceTest
PriceController → PriceControllerTest
PriceRepository → PriceRepositoryTest

// Organize with @Nested
class PriceServiceTest {
    
    @Nested
    @DisplayName("Calculate Total")
    class CalculateTotal {
        @Test
        void shouldCalculate_WhenValidInput() {}
        
        @Test
        void shouldThrow_WhenNegativeQuantity() {}
    }
    
    @Nested
    @DisplayName("Find Price")
    class FindPrice {
        @Test
        void shouldReturnPrice_WhenFound() {}
        
        @Test
        void shouldReturnEmpty_WhenNotFound() {}
    }
}
```

## Testing Patterns

### AAA Pattern

```java
@Test
void shouldDoSomething() {
    // Arrange (Given)
    Input input = new Input("test");
    
    // Act (When)
    Result result = service.process(input);
    
    // Assert (Then)
    assertEquals("expected", result.getValue());
}
```

### Builder Pattern for Tests

```java
class TestDataBuilder {
    
    static Price.PriceBuilder aPrice() {
        return Price.builder()
            .id(1L)
            .productName("Milk")
            .amount(BigDecimal.valueOf(10.00));
    }
    
    static PriceRequest.PriceRequestBuilder aPriceRequest() {
        return PriceRequest.builder()
            .productName("Milk")
            .location("Jakarta");
    }
}

// Usage
@Test
void test() {
    Price price = TestDataBuilder.aPrice()
        .amount(BigDecimal.valueOf(20.00))
        .build();
}
```

### Parameterized Tests

```java
@ParameterizedTest
@ValueSource(strings = {"Milk", "Bread", "Eggs"})
void shouldAcceptValidProductName(String productName) {
    assertDoesNotThrow(() -> validator.validate(productName));
}

@ParameterizedTest
@CsvSource({
    "10, 5, 50",      // price, qty, total
    "20, 2, 40",
    "15, 4, 60"
})
void shouldCalculateTotal(BigDecimal price, int qty, BigDecimal expected) {
    BigDecimal total = calculator.calculate(price, qty);
    assertEquals(expected, total);
}
```

## Edge Cases

### What to Test

**Boundary Values:**
```java
@Test
void shouldHandleEmptyList() {
    List<Price> empty = Collections.emptyList();
    BigDecimal total = calculator.sum(empty);
    assertEquals(BigDecimal.ZERO, total);
}

@Test
void shouldHandleSingleItem() {
    List<Price> single = List.of(new Price(BigDecimal.TEN));
    BigDecimal total = calculator.sum(single);
    assertEquals(BigDecimal.TEN, total);
}

@Test
void shouldHandleMaximumValue() {
    BigDecimal max = new BigDecimal("999999999.99");
    // Test with maximum allowed value
}
```

**Null Handling:**
```java
@Test
void shouldThrow_WhenNullInput() {
    assertThrows(NullPointerException.class, () -> {
        service.process(null);
    });
}
```

**Concurrency:**
```java
@Test
void shouldHandleConcurrentRequests() throws InterruptedException {
    int threadCount = 10;
    ExecutorService executor = Executors.newFixedThreadPool(threadCount);
    CountDownLatch latch = new CountDownLatch(threadCount);
    
    for (int i = 0; i < threadCount; i++) {
        executor.submit(() -> {
            try {
                service.process(request);
            } finally {
                latch.countDown();
            }
        });
    }
    
    assertTrue(latch.await(10, TimeUnit.SECONDS));
    executor.shutdown();
}
```

## Testing Best Practices

### DO

- ✅ Test behavior, not implementation
- ✅ One assertion per test (ideally)
- ✅ Use descriptive test names
- ✅ Test edge cases
- ✅ Keep tests independent
- ✅ Fast tests (< 100ms)

### DON'T

- ❌ Test private methods
- ❌ Use Thread.sleep()
- ❌ Share state between tests
- ❌ Test multiple things in one test
- ❌ Ignore failing tests
- ❌ Write tests after code (TDD preferred)

## Test Lifecycle

```java
@SpringBootTest
class LifecycleExample {
    
    @BeforeAll  // Runs once before all tests
    static void setUpClass() {}
    
    @BeforeEach // Runs before each test
    void setUp() {}
    
    @Test
    void test1() {}
    
    @Test
    void test2() {}
    
    @AfterEach  // Runs after each test
    void tearDown() {}
    
    @AfterAll   // Runs once after all tests
    static void tearDownClass() {}
}
```

## Running Tests

```bash
# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=PriceServiceTest

# Run specific test method
mvn test -Dtest=PriceServiceTest#shouldCalculateTotal

# Run with coverage
mvn clean test jacoco:report

# Skip tests
mvn install -DskipTests
```
