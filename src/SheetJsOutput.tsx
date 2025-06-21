import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { excelReconciler, convertToExcelSheet } from './renderer';
import { SheetJsOutputProps, ExcelSheet, SheetJsOutputRef, CustomElement } from './types';

export const SheetJsOutput = forwardRef<SheetJsOutputRef, SheetJsOutputProps>(({ children, render }, ref) => {
  const containerRef = useRef<CustomElement>();
  const [worksheet, setWorksheet] = useState<any>(null);

  // Expose the getExcelSheet function through the ref
  useImperativeHandle(ref, () => ({
    getExcelSheet: async () => {
      const container = { type: 'root', props: {}, children: [] }
      const root = excelReconciler.createContainer(container, false, false);

      return new Promise((resolve) => {
        excelReconciler.updateContainer(children, root, null, () => {
          resolve(convertToExcelSheet(container));
        });
      });
    }
  }), []);
  
  // Convert our Excel sheet format to SheetJS format
  const convertToSheetJSFormat = (excelSheet: ExcelSheet) => {
    const worksheet: any = {};
    const range = { s: { r: 0, c: 0 }, e: { r: 0, c: 0 } };
    
    excelSheet.rows.forEach((row, rowIndex) => {
      row.cells.forEach((cell, colIndex) => {
        const cellRef = getCellRef(rowIndex, colIndex);
        
        // Set cell value
        worksheet[cellRef] = {
          v: cell.value,
          t: getCellType(cell.type)
        };
        
        // Set cell format if specified
        if (cell.format) {
          worksheet[cellRef].z = cell.format;
        }
        
        // Update range
        range.e.r = Math.max(range.e.r, rowIndex);
        range.e.c = Math.max(range.e.c, colIndex);
      });
    });
    
    // Set column widths if any row has widthSetting
    const widthSettingRow = excelSheet.rows.find(row => row.widthSetting);
    if (widthSettingRow) {
      worksheet['!cols'] = widthSettingRow.cells.map(cell => ({
        width: cell.width || 10
      }));
    }
    
    worksheet['!ref'] = getCellRef(range.s.r, range.s.c) + ':' + getCellRef(range.e.r, range.e.c);
    
    return worksheet;
  };

  const getCellRef = (row: number, col: number): string => {
    const colLetter = String.fromCharCode(65 + col);
    return colLetter + (row + 1);
  };

  const getCellType = (type: string): string => {
    switch (type) {
      case 'number': return 'n';
      case 'boolean': return 'b';
      case 'date': return 'd';
      case 'formula': return 'f';
      default: return 's';
    }
  };

  if (render && worksheet) {
    return <>{render(worksheet)}</>;
  }

  return null;
}); 