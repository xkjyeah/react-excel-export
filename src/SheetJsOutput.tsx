import React, { forwardRef, useImperativeHandle } from 'react';
import { excelReconciler, convertToExcelSheet } from './renderer';
import { SheetJsOutputProps, ExcelSheet, SheetJsOutputRef } from './types';

export const SheetJsOutput = forwardRef<SheetJsOutputRef, SheetJsOutputProps>(({ children }, ref) => {
  useImperativeHandle(
    ref,
    () => ({
      getExcelSheet: async () => {
        const container = { type: 'root', props: {}, children: [] };
        debugger;
        const root = excelReconciler.createContainer(container, false, false);

        return new Promise(resolve => {
          console.log('getExcelSheet -- updateContainer -- start');

          excelReconciler.updateContainer(children, root, null, () => {
            console.log('getExcelSheet -- updateContainer -- callback');
            resolve(convertToSheetJSFormat(convertToExcelSheet(container)));
          });
        });
      },
    }),
    []
  );

  const convertToSheetJSFormat = (excelSheet: ExcelSheet) => {
    const worksheet: any = {};
    const range = { s: { r: 0, c: 0 }, e: { r: 0, c: 0 } };

    excelSheet.rows.forEach((row, rowIndex) => {
      row.cells.forEach((cell, colIndex) => {
        const cellRef = getCellRef(rowIndex, colIndex);

        // Set cell value
        const cellDefinition = {
          v: cell.v,
          t: cell.t,
          f: cell.f,
          z: cell.z,
        };

        worksheet[cellRef] = Object.fromEntries(
          Object.entries(cellDefinition).filter(([_, value]) => value !== undefined)
        );

        // Update range
        range.e.r = Math.max(range.e.r, rowIndex);
        range.e.c = Math.max(range.e.c, colIndex);
      });
    });

    // Set column widths if any row has widthSetting
    const widthSettingRow = excelSheet.rows.find(row => row.widthSetting);
    if (widthSettingRow) {
      worksheet['!cols'] = widthSettingRow.cells.map(cell => ({
        width: cell.width || 10,
      }));
    }

    worksheet['!ref'] = getCellRef(range.s.r, range.s.c) + ':' + getCellRef(range.e.r, range.e.c);

    return worksheet;
  };

  const getCellRef = (row: number, col: number): string => {
    const colLetter = String.fromCharCode(65 + col);
    return colLetter + (row + 1);
  };

  return <>Your text will appear here</>;
});
