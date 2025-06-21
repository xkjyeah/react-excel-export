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
}

export interface ExcelCell {
  t?: string;
  v?: string | number | boolean;
  z?: string;
  f?: string;
  s?: string;

  // Other non-standard properties
  width?: number;
}

export interface ExcelRow {
  cells: ExcelCell[];
  widthSetting?: boolean;
}

export interface ExcelSheet {
  rows: ExcelRow[];
}

export interface CustomRoot {
  nodeType: 'root';
  children: CustomNode[];
}

export interface CustomElement {
  type: string;
  nodeType: 'element';
  props: Record<string, any>;
  children: CustomNode[];
  value?: string; // For text elements
}

export interface SheetJsOutputRef {
  getExcelSheet: () => Promise<ExcelSheet | null>;
}

export interface TextNode {
  value: string;
  nodeType: 'text';
}

export type CustomNode = TextNode | CustomElement;
