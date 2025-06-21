import React from 'react';

// We'll handle xlsx types later when we install the package
export interface WorkSheet {
  [key: string]: any;
}

export interface CellProps {
  width?: number;
  z?: string; // format string
  children?: React.ReactNode;
}

export interface RowProps {
  widthSetting?: boolean;
  children?: React.ReactNode;
}

export interface SheetJsOutputProps {
  children?: React.ReactNode;
  render?: (worksheet: WorkSheet) => React.ReactNode;
}

export interface ExcelCell {
  type: 'text' | 'number' | 'boolean' | 'date' | 'formula';
  value: string | number | boolean | Date;
  width?: number;
  format?: string;
}

export interface ExcelRow {
  cells: ExcelCell[];
  widthSetting?: boolean;
}

export interface ExcelSheet {
  rows: ExcelRow[];
}

export interface CustomElement {
  type: string;
  props: Record<string, any>;
  children: CustomElement[];
}

export interface SheetJsOutputRef {
  getExcelSheet: () => Promise<ExcelSheet | null>;
} 