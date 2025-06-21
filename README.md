# React Export Excel

A React component that allows you to define Excel sheets using JSX and export them using SheetJS.

## Features

- Define Excel sheets using familiar JSX syntax
- Support for different cell types (text, number, boolean, date, formula)
- Custom formatting and column widths
- **Lazy generation**: Excel sheet data is only generated when requested via ref
- Convert to SheetJS format for export

## Usage

### Basic Example

```tsx
import React, { useRef } from 'react';
import { SheetJsOutput } from './SheetJsOutput';
import { SheetJsOutputRef } from './types';

const MyComponent: React.FC = () => {
  const sheetRef = useRef<SheetJsOutputRef>(null);

  const handleGetExcelSheet = () => {
    if (sheetRef.current) {
      const excelSheet = sheetRef.current.getExcelSheet();
      if (excelSheet) {
        console.log('Excel Sheet:', excelSheet);
        // Use the Excel sheet data as needed
        // This is when the actual conversion happens!
      }
    }
  };

  return (
    <div>
      <SheetJsOutput ref={sheetRef}>
        <row>
          <text>Name</text>
          <number>Age</number>
          <boolean>Active</boolean>
        </row>
        <row>
          <text>John Doe</text>
          <number>30</number>
          <boolean>true</boolean>
        </row>
        <row>
          <text>Jane Smith</text>
          <number>25</number>
          <boolean>false</boolean>
        </row>
      </SheetJsOutput>

      <button onClick={handleGetExcelSheet}>Generate Excel Sheet Data</button>
    </div>
  );
};
```

### Cell Types

The component supports the following cell types:

- `<text>` - Text values
- `<number>` - Numeric values
- `<boolean>` - Boolean values
- `<date>` - Date values
- `<formula>` - Excel formulas

### Cell Properties

Each cell type supports the following properties:

- `width?: number` - Column width
- `z?: string` - Excel format string
- `children` - The cell value

### Row Properties

Rows support the following properties:

- `widthSetting?: boolean` - Whether this row defines column widths

### Using the Ref

The `SheetJsOutput` component exposes a ref with a `getExcelSheet()` function that returns the current Excel sheet data:

```tsx
const excelSheet = sheetRef.current.getExcelSheet();
```

**Important**: The Excel sheet is only generated when this function is called. Before calling it, the function will return `null`.

The returned object is a [SheetJS Sheet Object](https://docs.sheetjs.com/docs/csf/sheet).

## Installation

Make sure you have the required dependencies:

```bash
npm install react-reconciler
```

## TypeScript Support

The component includes full TypeScript support with proper type definitions for all JSX elements and the ref interface.

## API Documentation

### `<SheetJsOutput>`

The main component that renders Excel data.

**Props:**

- `render?: (worksheet: WorkSheet) => React.ReactNode` - Function to render UI with the generated worksheet
- `children` - Excel structure using the cell components

### `<row>`

Represents an Excel row.

**Props:**

- `widthSetting?: boolean` - If true, this row's cell widths will be used to set column widths
- `children` - Cell components

### Cell Components

#### `<text>`

Renders a text cell.

**Props:**

- `width?: number` - Column width
- `z?: string` - Format string
- `children` - Cell content

#### `<number>`

Renders a numeric cell.

**Props:**

- `width?: number` - Column width
- `z?: string` - Format string (e.g., "#,##0.00")
- `children` - Cell content

#### `<date>`

Renders a date cell.

**Props:**

- `width?: number` - Column width
- `z?: string` - Date format (e.g., "MMM DD", "YYYY-MM-DD")
- `children` - Date value

#### `<boolean>`

Renders a boolean cell.

**Props:**

- `width?: number` - Column width
- `z?: string` - Format string
- `children` - Boolean value

#### `<formula>`

Renders a formula cell.

**Props:**

- `width?: number` - Column width
- `z?: string` - Format string
- `children` - Excel formula

### Utility Functions

#### `downloadExcel(worksheet, filename?)`

Downloads the generated worksheet as an Excel file.

**Parameters:**

- `worksheet` - The worksheet object from SheetJsOutput
- `filename` - Optional filename (default: 'export.xlsx')

## Advanced Examples

### With Custom Styling

```jsx
<SheetJsOutput
  render={worksheet => (
    <div>
      <button
        onClick={() => downloadExcel(worksheet, 'styled-export.xlsx')}
        style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white' }}
      >
        Download Styled Excel
      </button>
    </div>
  )}
>
  {/* Your Excel structure */}
</SheetJsOutput>
```

### With Conditional Rendering

```jsx
<SheetJsOutput render={worksheet => <button onClick={() => downloadExcel(worksheet)}>Export Data</button>}>
  <row>
    <text>Name</text>
    <text>Status</text>
    <text>Value</text>
  </row>

  {data.map((item, index) => (
    <row key={index}>
      <text>{item.name}</text>
      <text>{item.status}</text>
      <number z="#,##0.00">{item.status === 'active' ? item.value : 0}</number>
    </row>
  ))}
</SheetJsOutput>
```

## How It Works

This library uses React's custom renderer (react-reconciler) to create a virtual representation of Excel data. Instead of rendering to the DOM, it renders to a custom data structure that can be converted to SheetJS format.

The key components (`row`, `text`, `number`, etc.) are not actual DOM elements but custom elements that the renderer understands and processes to build the Excel structure.

## License

MIT
