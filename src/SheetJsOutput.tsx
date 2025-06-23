import React, { forwardRef, useImperativeHandle } from 'react';
import { excelReconciler, convertToExcelSheet } from './renderer';
import { SheetJsOutputProps, ExcelSheet, SheetJsOutputRef, CustomRoot } from './types';
import { ErrorBoundary } from 'react-error-boundary';
import * as xlsx from 'xlsx';

export type { SheetJsOutputRef } from './types';

/**
 * Creates a relative cell reference component for use in formulas
 * @param dr Delta row - row offset relative to current cell
 * @param dc Delta column - column offset relative to current cell
 * @returns RC component that gets resolved to actual cell reference
 */
export function rc(dr: number, dc: number): React.ReactElement {
  return React.createElement('RC', { dr, dc });
}

export const SheetJsOutput = forwardRef<SheetJsOutputRef, SheetJsOutputProps>(({ children }, ref) => {
  useImperativeHandle(
    ref,
    () => ({
      getSheet: async () => {
        const container: CustomRoot = { nodeType: 'root', children: [] };
        const root = excelReconciler.createContainer(
          container,
          0,
          null,
          false,
          null,
          '',
          e => {
            console.error('ERROR OCCURRED', e);
          },
          null
        );

        return new Promise((resolve, reject) => {
          excelReconciler.updateContainer(
            <ErrorBoundary
              fallbackRender={({ error }) => {
                reject(error);
                throw error;
              }}
            >
              {children}
            </ErrorBoundary>,
            root,
            null,
            () => {
              resolve(convertToSheetJSFormat(convertToExcelSheet(container)));
            }
          );
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
        const cellRef = xlsx.utils.encode_cell({ r: rowIndex, c: colIndex });

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

    worksheet['!ref'] =
      xlsx.utils.encode_cell({ r: range.s.r, c: range.s.c }) +
      ':' +
      xlsx.utils.encode_cell({ r: range.e.r, c: range.e.c });

    return worksheet;
  };

  return null;
});
