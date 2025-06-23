import { SheetJsOutput, rc } from 'react-export-sheetjs';
import type { SheetJsOutputRef } from 'react-export-sheetjs';
import { useRef } from 'react';
// source-hide-next-line
import styles from './styles/Home.module.css';
import * as XLSX from 'xlsx';

const sampleData = [
  { name: 'John Doe', age: 30, salary: 75000, active: true, startDate: '2020-01-15' },
  { name: 'Jane Smith', age: 28, salary: 65000, active: true, startDate: '2019-03-20' },
  { name: 'Bob Johnson', age: 35, salary: 85000, active: false, startDate: '2018-11-10' },
  { name: 'Alice Brown', age: 26, salary: 60000, active: true, startDate: '2021-06-05' },
];

export const ExcelTable = () => {
  const ref = useRef<SheetJsOutputRef>(null);
  return (
    <>
      <SheetJsOutput ref={ref}>
        <row widthSetting={true}>
          <text width={15}>Name</text>
          <text width={8}>Age</text>
          <text width={12}>Salary</text>
          <text width={12}>Monthly salary</text>
          <text width={8}>Active</text>
          <text width={12}>Start Date</text>
        </row>

        {sampleData.map((employee, index) => (
          <row key={index}>
            <text>{employee.name}</text>
            <number>{employee.age}</number>
            <number z="$#,##0">{employee.salary}</number>
            <formula z="$#,##0">{rc(0, -1)} / 12</formula>
            <boolean>{employee.active}</boolean>
            <date z="MMM dd, yyyy">{employee.startDate}</date>
          </row>
        ))}
      </SheetJsOutput>
      <button className={styles.exportButton} onClick={() => downloadSheet(ref.current)}>
        Download as Excel
      </button>
    </>
  );
};

export function HTMLTable() {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Age</th>
          <th>Salary</th>
          <th>Monthly salary</th>
          <th>Active</th>
          <th>Start Date</th>
        </tr>
      </thead>
      <tbody>
        {sampleData.map((employee, index) => (
          <tr key={index}>
            <td>{employee.name}</td>
            <td>{employee.age}</td>
            <td>${employee.salary.toLocaleString()}</td>
            <td>
              ${(employee.salary / 12).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </td>
            <td>{employee.active ? 'Yes' : 'No'}</td>
            <td>{new Date(employee.startDate).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function downloadBlobAsMimeType(blob: Blob, mimeType: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'sheet.xlsx';
  a.click();
}

async function downloadSheet(ref: SheetJsOutputRef) {
  const worksheet = await ref.getExcelSheet();
  const workbook = {
    SheetNames: ['Sheet1'],
    Sheets: {
      Sheet1: worksheet,
    },
  };
  const fileData = XLSX.writeXLSX(workbook, {
    bookType: 'xlsx',
    type: 'buffer',
  });

  const blob = new Blob([fileData], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  downloadBlobAsMimeType(blob, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
}
