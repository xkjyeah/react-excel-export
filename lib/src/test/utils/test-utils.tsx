import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';

// Custom render function that includes providers if needed
const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) => render(ui, { ...options });

// Helper to create a mock Excel sheet
export const createMockExcelSheet = (rows: any[] = []) => ({
  rows,
});

// Helper to create a mock Excel row
export const createMockExcelRow = (cells: any[] = [], widthSetting = false) => ({
  cells,
  widthSetting,
});

// Helper to create a mock Excel cell
export const createMockExcelCell = (
  type: 'text' | 'number' | 'boolean' | 'date' | 'formula' = 'text',
  value: string | number | boolean | Date = '',
  width?: number,
  format?: string
) => ({
  type,
  value,
  width,
  format,
});

// Helper to wait for async operations
export const waitForAsync = (ms: number = 0) => new Promise(resolve => setTimeout(resolve, ms));

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };
