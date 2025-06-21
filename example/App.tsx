import React from 'react';
import { SheetJsOutput, text, number, date, formula, row, downloadExcel } from '../src';

const App: React.FC = () => {
  const dataset = [
    { name: 'Alan', birthday: '1999-01-02', salary: 50000, active: true },
    { name: 'Bob', birthday: '2000-03-04', salary: 60000, active: false },
    { name: 'Charlie', birthday: '1995-07-15', salary: 75000, active: true },
  ];

  const today = new Date();

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>React Export Excel Demo</h1>
      
      <SheetJsOutput
        render={(worksheet) => (
          <div style={{ marginBottom: '20px' }}>
            <button 
              onClick={() => downloadExcel(worksheet, 'employee-data.xlsx')}
              style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Download Excel File
            </button>
          </div>
        )}
      >
        {/* Header row */}
        <row widthSetting={true}>
          <text width={3}>Initial</text>
          <text width={15}>Name</text>
          <text width={12}>Birthday</text>
          <text width={10}>Age</text>
          <text width={12}>Salary</text>
          <text width={8}>Active</text>
          <text width={15}>Age Formula</text>
        </row>

        {/* Data rows */}
        {dataset.map((rowData, index) => (
          <row key={index}>
            <text>{rowData.name[0]}</text>
            <text>{rowData.name}</text>
            <date z="MMM DD, YYYY">{rowData.birthday}</date>
            <number>{today.getUTCFullYear() - new Date(rowData.birthday).getUTCFullYear()}</number>
            <number z="$#,##0">{rowData.salary}</number>
            <boolean>{rowData.active}</boolean>
            <formula>DATEDIF(C{index + 2}, NOW(), "Y")</formula>
          </row>
        ))}
      </SheetJsOutput>

      <div style={{ marginTop: '20px' }}>
        <h3>Data Preview:</h3>
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Initial</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Name</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Birthday</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Age</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Salary</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Active</th>
            </tr>
          </thead>
          <tbody>
            {dataset.map((rowData, index) => (
              <tr key={index}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{rowData.name[0]}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{rowData.name}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {new Date(rowData.birthday).toLocaleDateString()}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {today.getUTCFullYear() - new Date(rowData.birthday).getUTCFullYear()}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  ${rowData.salary.toLocaleString()}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {rowData.active ? 'Yes' : 'No'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App; 