# Testing Guide

This directory contains comprehensive tests for the React Excel Export library.

## Test Structure

### Unit Tests

- **`components.test.tsx`** - Tests for cell and row components
- **`renderer.test.ts`** - Tests for the Excel sheet conversion logic
- **`SheetJsOutput.test.tsx`** - Tests for the main output component
- **`SheetJsOutput.utils.test.ts`** - Tests for utility functions
- **`index.test.ts`** - Tests for utility functions like `downloadExcel`

### Integration Tests

- **`integration.test.tsx`** - End-to-end tests that verify the complete workflow

### Test Utilities

- **`setup.ts`** - Jest configuration and global mocks
- **`utils/test-utils.tsx`** - Common testing utilities and helpers

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- components.test.tsx

# Run tests matching a pattern
npm test -- --testNamePattern="should generate Excel sheet"
```

## Test Coverage

The tests cover:

### Components

- ✅ All cell components (text, number, boolean, date, formula)
- ✅ Row component with widthSetting prop
- ✅ Proper prop passing and element creation

### Renderer

- ✅ Excel sheet conversion from React elements
- ✅ Different cell types and their value conversion
- ✅ Row width settings
- ✅ Edge cases (empty sheets, invalid elements)

### SheetJsOutput

- ✅ Ref functionality and getExcelSheet method
- ✅ SheetJS format conversion
- ✅ Cell references and types
- ✅ Column width handling
- ✅ Range calculation

### Utilities

- ✅ downloadExcel function
- ✅ File creation and naming
- ✅ Complex worksheet handling

### Integration

- ✅ Complete workflow from React components to Excel file
- ✅ Multiple rows and cell types
- ✅ Format and width settings
- ✅ File download process

## Mocking

The tests use mocks for:

- **xlsx** - SheetJS library for file operations
- **react-reconciler** - React's reconciliation engine
- **Console methods** - To reduce noise in test output

## Writing New Tests

When adding new functionality:

1. **Unit tests first** - Test individual functions and components
2. **Integration tests** - Test the complete workflow
3. **Edge cases** - Test error conditions and boundary values
4. **Type safety** - Ensure TypeScript types are correct

### Example Test Structure

```typescript
describe('Component Name', () => {
  beforeEach(() => {
    // Setup
  });

  it('should do something specific', () => {
    // Arrange
    const input = 'test';

    // Act
    const result = functionToTest(input);

    // Assert
    expect(result).toBe('expected');
  });
});
```

## Coverage Goals

- **Statements**: 80%
- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%

Run `npm test -- --coverage` to check current coverage levels.
