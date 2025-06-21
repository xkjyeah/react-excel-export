import { SheetJsOutput } from 'react-export-excel';
import type { SheetJsOutputRef } from 'react-export-excel';
import { forwardRef } from 'react';
import styles from './styles/Home.module.css';

// Sample data
const sampleData = [
  { name: 'John Doe', age: 30, salary: 75000, active: true, startDate: '2020-01-15' },
  { name: 'Jane Smith', age: 28, salary: 65000, active: true, startDate: '2019-03-20' },
  { name: 'Bob Johnson', age: 35, salary: 85000, active: false, startDate: '2018-11-10' },
  { name: 'Alice Brown', age: 26, salary: 60000, active: true, startDate: '2021-06-05' },
];

export const ExcelTable = forwardRef<SheetJsOutputRef, {}>((props, ref) => {
  return (
    <SheetJsOutput ref={ref}>
      <row widthSetting={true}>
        <text width={15}>Name</text>
        <text width={8}>Age</text>
        <text width={12}>Salary</text>
        <text width={8}>Active</text>
        <text width={12}>Start Date</text>
      </row>

      {sampleData.map((employee, index) => (
        <row key={index}>
          <text>{employee.name}</text>
          <number>{employee.age}</number>
          <number z="$#,##0">{employee.salary}</number>
          <boolean>{employee.active}</boolean>
          <date z="MMM DD, YYYY">{employee.startDate}</date>
        </row>
      ))}
    </SheetJsOutput>
  );
});

export function HTMLTable() {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Age</th>
          <th>Salary</th>
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
            <td>{employee.active ? 'Yes' : 'No'}</td>
            <td>{new Date(employee.startDate).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
