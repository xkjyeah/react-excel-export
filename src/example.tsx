import React, { useRef, useState } from 'react';
import { SheetJsOutput } from './SheetJsOutput';
import { SheetJsOutputRef } from './types';

const ExampleComponent: React.FC = () => {
  const sheetRef = useRef<SheetJsOutputRef>(null);
  const [excelData, setExcelData] = useState<string>('');

  const handleGetExcelSheet = () => {
    if (sheetRef.current) {
      const excelSheet = sheetRef.current.getExcelSheet();
      console.log('Excel Sheet:', excelSheet);

      if (excelSheet) {
        // You can now use the Excel sheet data
        console.log('Number of rows:', excelSheet.rows.length);
        const data = excelSheet.rows
          .map((row, index) => `Row ${index}: ${row.cells.map(cell => cell.value).join(', ')}`)
          .join('\n');
        setExcelData(data);
      } else {
        setExcelData('No Excel sheet data available');
      }
    }
  };

  return (
    <div>
      <h3>Excel Sheet Definition</h3>
      <SheetJsOutput ref={sheetRef}>
        <row>
          <text>Hello</text>
          <number>42</number>
          <boolean>true</boolean>
        </row>
        <row>
          <text>World</text>
          <number>100</number>
          <date>2024-01-01</date>
        </row>
      </SheetJsOutput>

      <div style={{ marginTop: '20px' }}>
        <button onClick={handleGetExcelSheet}>Generate Excel Sheet Data</button>

        {excelData && (
          <div style={{ marginTop: '10px' }}>
            <h4>Generated Excel Data:</h4>
            <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>{excelData}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExampleComponent;
