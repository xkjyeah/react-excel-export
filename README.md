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
import { SheetJsOutput, SheetJsOutputRef } from 'react-export-sheetjs';
import * as XLSX from 'xlsx';

const MyComponent: React.FC = () => {
  const sheetRef = useRef<SheetJsOutputRef>(null);

  return (
    <div>
      <SheetJsOutput ref={sheetRef}>
        <row widthSetting={true}>
          <text width={15}>Name</text>
          <text width={8}>Age</text>
          <text width={12}>Salary</text>
          <text width={8}>Active</text>
          <text width={12}>Start Date</text>
        </row>

        <row>
          <text>John Doe</text>
          <number>30</number>
          <number z="$#,##0">75000</number>
          <boolean>true</boolean>
          <date z="MMM dd, yyyy">2020-01-15</date>
        </row>

        <row>
          <text>Jane Smith</text>
          <number>28</number>
          <number z="$#,##0">65000</number>
          <boolean>true</boolean>
          <date z="MMM dd, yyyy">2019-03-20</date>
        </row>

        <row>
          <text>Bob Johnson</text>
          <number>35</number>
          <number z="$#,##0">85000</number>
          <boolean>false</boolean>
          <date z="MMM dd, yyyy">2018-11-10</date>
        </row>
      </SheetJsOutput>

      <button onClick={downloadExcel(sheetRef.current)}>Download as Excel</button>
    </div>
  );
};

const downloadExcel = async sheetJsOutput => {
  const worksheet = await sheetJsOutput.getExcelSheet();
  const workbook = {
    SheetNames: ['Sheet1'],
    Sheets: { Sheet1: worksheet },
  };

  const fileData = XLSX.writeXLSX(workbook, {
    bookType: 'xlsx',
    type: 'buffer',
  });

  const blob = new Blob([fileData], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'employee-data.xlsx';
  a.click();
};
```

## 🚀 Live Demo

Check out the live demo at: https://xkjyeah.github.io/react-export-excel/

The demo showcases both HTML table and Excel export functionality with syntax-highlighted source code.

## 📁 Examples

This repository includes a complete Next.js example application in the `examples/` directory that demonstrates:

- Basic Excel export functionality
- HTML table display with export capability
- Syntax-highlighted source code display
- Ready-to-deploy GitHub Pages configuration

### Running the Example

```bash
cd examples
npm install
npm run dev
```

Visit `http://localhost:3000` to see the demo in action.

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

## How It Works

This library uses React's custom renderer (react-reconciler) to create a virtual representation of Excel data. Instead of rendering to the DOM, it renders to a custom data structure that can be converted to SheetJS format.

The key components (`row`, `text`, `number`, etc.) are not actual DOM elements but custom elements that the renderer understands and processes to build the Excel structure.

## License

MIT
