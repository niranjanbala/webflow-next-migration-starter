# Testing Strategy

This document outlines the comprehensive testing strategy for the NumeralHQ PWA migration project.

## Overview

Our testing strategy follows a multi-layered approach:

1. **Unit Tests** - Test individual components and functions in isolation
2. **Integration Tests** - Test component interactions and API integrations
3. **End-to-End Tests** - Test complete user workflows
4. **Performance Tests** - Ensure optimal performance metrics
5. **Accessibility Tests** - Verify WCAG compliance

## Test Structure

```
numeralhq-pwa/
├── src/
│   ├── components/
│   │   └── __tests__/          # Component unit tests
│   ├── lib/
│   │   └── __tests__/          # Utility function tests
│   └── app/
│       └── __tests__/          # Page component tests
├── e2e/                        # End-to-end tests
├── test-results/               # Test output and reports
└── docs/
    └── testing-strategy.md     # This document
```

## Testing Tools

### Unit & Integration Testing
- **Jest** - Test runner and assertion library
- **React Testing Library** - Component testing utilities
- **@testing-library/jest-dom** - Custom Jest matchers
- **jest-axe** - Accessibility testing

### End-to-End Testing
- **Playwright** - Cross-browser E2E testing
- **@playwright/test** - Test runner for Playwright

### Performance Testing
- **Lighthouse CI** - Performance auditing
- **Web Vitals** - Core Web Vitals measurement

## Test Categories

### 1. Unit Tests

Test individual components and functions in isolation.

**Location**: `src/**/__tests__/*.test.{js,jsx,ts,tsx}`

**Examples**:
- Component rendering
- Props handling
- Event handlers
- Utility functions
- Business logic

**Coverage Requirements**:
- Functions: 80%
- Statements: 80%
- Branches: 80%
- Lines: 80%

### 2. Integration Tests

Test component interactions and API integrations.

**Location**: `src/**/__tests__/*.integration.{js,jsx,ts,tsx}`

**Examples**:
- Webflow API integration
- Component composition
- State management
- Navigation flows

**Coverage Requirements**:
- Functions: 75%
- Statements: 75%
- Branches: 75%
- Lines: 75%

### 3. End-to-End Tests

Test complete user workflows across the application.

**Location**: `e2e/**/*.spec.{js,ts}`

**Test Scenarios**:
- Homepage loading and navigation
- Webflow content rendering
- Mobile responsiveness
- Performance metrics
- Offline functionality
- Accessibility compliance

### 4. Performance Tests

Ensure the application meets performance requirements.

**Metrics Tracked**:
- **Largest Contentful Paint (LCP)**: < 2.5s
- **First Input Delay (FID)**: < 100ms
- **Cumulative Layout Shift (CLS)**: < 0.1
- **Time to Interactive (TTI)**: < 3.5s
- **First Contentful Paint (FCP)**: < 1.8s

### 5. Accessibility Tests

Verify WCAG 2.1 AA compliance.

**Automated Checks**:
- Color contrast ratios
- Keyboard navigation
- Screen reader compatibility
- ARIA attributes
- Semantic HTML structure

## Running Tests

### Development Workflow

```bash
# Run unit tests in watch mode
npm run test:watch

# Run all tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Run specific test pattern
npm run test -- --testNamePattern="Button"
```

### CI/CD Pipeline

```bash
# Full test suite
npm run test:ci

# Performance testing
npm run test:performance

# Accessibility testing
npm run test:a11y
```

### Custom Test Runner

Use our custom test runner for advanced scenarios:

```bash
# Run all test types
npm run test:runner -- --type all --coverage

# Run E2E tests in headed mode
npm run test:runner -- --type e2e --headed --browser chromium

# Run unit tests with pattern matching
npm run test:runner -- --type unit --pattern "Webflow" --watch
```

## Test Configuration

### Jest Configuration

Key configuration in `jest.config.js`:

- **Test Environment**: jsdom for DOM testing
- **Setup Files**: Global test setup and mocks
- **Coverage Thresholds**: Enforced coverage requirements
- **Module Mapping**: Path aliases and asset mocks

### Playwright Configuration

Key configuration in `playwright.config.ts`:

- **Cross-browser Testing**: Chrome, Firefox, Safari, Edge
- **Mobile Testing**: iOS and Android viewports
- **Performance Monitoring**: Core Web Vitals tracking
- **Accessibility Testing**: axe-core integration

## Test Utilities

### Custom Render Function

```typescript
import { render } from '@/lib/test-utils';

// Renders component with all providers
render(<MyComponent />);
```

### Mock Utilities

```typescript
import { 
  mockFetch, 
  createMockWebflowItem,
  createMockNavigationManager 
} from '@/lib/test-utils';

// Mock API responses
mockFetch({ data: 'test' });

// Create mock Webflow data
const mockItem = createMockWebflowItem({ title: 'Test' });
```

### Accessibility Testing

```typescript
import { checkAccessibility } from '@/lib/test-utils';

test('should be accessible', async () => {
  const { container } = render(<MyComponent />);
  const results = await checkAccessibility(container);
  expect(results).toHaveNoViolations();
});
```

## Best Practices

### Unit Testing

1. **Test Behavior, Not Implementation**
   - Focus on what the component does, not how it does it
   - Test user interactions and expected outcomes

2. **Use Descriptive Test Names**
   ```typescript
   test('should display error message when form submission fails')
   ```

3. **Arrange, Act, Assert Pattern**
   ```typescript
   test('should increment counter when button is clicked', () => {
     // Arrange
     render(<Counter />);
     
     // Act
     fireEvent.click(screen.getByRole('button', { name: /increment/i }));
     
     // Assert
     expect(screen.getByText('1')).toBeInTheDocument();
   });
   ```

### Integration Testing

1. **Test Real User Scenarios**
   - Test complete workflows
   - Include error handling

2. **Mock External Dependencies**
   - Mock API calls
   - Mock third-party services

3. **Test Component Composition**
   - Test parent-child component interactions
   - Test context providers

### E2E Testing

1. **Test Critical User Paths**
   - Focus on high-value user journeys
   - Test across different devices and browsers

2. **Use Page Object Model**
   - Encapsulate page interactions
   - Improve test maintainability

3. **Handle Async Operations**
   - Wait for elements to appear
   - Handle loading states

### Performance Testing

1. **Set Realistic Thresholds**
   - Based on user expectations
   - Consider different network conditions

2. **Test on Different Devices**
   - Mobile and desktop
   - Various screen sizes

3. **Monitor Regression**
   - Track performance over time
   - Alert on degradation

## Continuous Integration

### GitHub Actions Workflow

```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:ci
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: test-results/
```

### Quality Gates

- **Unit Test Coverage**: Minimum 80%
- **Integration Test Coverage**: Minimum 75%
- **E2E Test Pass Rate**: 100%
- **Performance Budget**: All Core Web Vitals must pass
- **Accessibility**: Zero violations

## Reporting

### Test Reports

- **HTML Reports**: Visual test results and coverage
- **JUnit XML**: CI/CD integration
- **JSON Reports**: Programmatic analysis

### Performance Reports

- **Lighthouse Reports**: Detailed performance analysis
- **Core Web Vitals**: Key metrics tracking
- **Bundle Analysis**: JavaScript size monitoring

### Accessibility Reports

- **axe-core Reports**: Detailed accessibility violations
- **WCAG Compliance**: Standards adherence tracking

## Troubleshooting

### Common Issues

1. **Flaky Tests**
   - Add proper waits
   - Mock time-dependent operations
   - Use deterministic test data

2. **Slow Tests**
   - Optimize test setup
   - Use test parallelization
   - Mock heavy operations

3. **Memory Leaks**
   - Clean up event listeners
   - Clear timers and intervals
   - Reset global state

### Debug Tools

- **Jest Debug Mode**: `--detectOpenHandles --forceExit`
- **Playwright Debug**: `--debug` flag
- **Coverage Analysis**: `--coverage --coverageReporters=html`

## Future Improvements

1. **Visual Regression Testing**
   - Screenshot comparison
   - UI consistency validation

2. **API Contract Testing**
   - Schema validation
   - Contract verification

3. **Load Testing**
   - Stress testing
   - Scalability validation

4. **Security Testing**
   - Vulnerability scanning
   - Penetration testing

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/)
- [Web Vitals](https://web.dev/vitals/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)