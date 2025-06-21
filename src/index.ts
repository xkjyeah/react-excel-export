export { SheetJsOutput } from './SheetJsOutput';
export { text, number, boolean, date, formula, row } from './components';
export type { 
  SheetJsOutputProps, 
  CellProps, 
  RowProps, 
  ExcelCell, 
  ExcelRow, 
  ExcelSheet,
  WorkSheet 
} from './types';

// Utility function to download Excel file
export const downloadExcel = (worksheet: any, filename: string = 'export.xlsx') => {
  const XLSX = require('xlsx');
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, filename);
}; 