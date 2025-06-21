'use client';

import React, { useRef, useState } from 'react';
import { ExcelTable } from '../components';
import styles from '../styles/Home.module.css';
import dynamic from 'next/dynamic';
import * as XLSX from 'xlsx';
import type { SheetJsOutputRef } from 'react-export-excel';

function HomeComponent() {
  const sheetRef = useRef<SheetJsOutputRef>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      if (sheetRef.current) {
        const worksheet = await sheetRef.current.getExcelSheet();

        const fileData = XLSX.writeXLSX(
          {
            SheetNames: ['Sheet1'],
            Sheets: {
              Sheet1: worksheet,
            },
          },
          {
            bookType: 'xlsx',
            type: 'buffer',
          }
        );

        const blob = new Blob([fileData], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'employee-data.xlsx';
        a.click();
        //   URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>React Export Excel Demo</h1>

        <p className={styles.description}>A Next.js example showing how to use the react-export-excel library</p>

        <div className={styles.demoSection}>
          <h2>Live Demo</h2>
          <p>Click the button below to export the sample data to Excel:</p>

          <button onClick={handleExport} disabled={isExporting} className={styles.exportButton}>
            {isExporting ? 'Exporting...' : 'Export to Excel'}
          </button>
        </div>

        <div className={styles.previewSection}>
          <h2>Data Preview</h2>
          <div className={styles.tableContainer}>
            <ExcelTable />
          </div>
        </div>

        <div className={styles.codeSection}>
          <h2>Source Code</h2>
          <p>Here's how to implement this in your own project:</p>
          {/* <pre className={styles.codeBlock}>
              <code>{sourceCode}</code>
            </pre> */}
        </div>

        <div className={styles.featuresSection}>
          <h2>Features</h2>
          <ul className={styles.featuresList}>
            <li>✅ Declarative JSX syntax for Excel structure</li>
            <li>✅ Support for text, numbers, dates, booleans, and formulas</li>
            <li>✅ Custom formatting and column widths</li>
            <li>✅ Lazy generation - Excel data only created when needed</li>
            <li>✅ TypeScript support</li>
            <li>✅ Works with Next.js and other React frameworks</li>
          </ul>
        </div>
      </main>

      <footer className={styles.footer}>
        <a href="https://github.com/yourusername/react-export-excel" target="_blank" rel="noopener noreferrer">
          View on GitHub
        </a>
      </footer>
    </div>
  );
}

export default function Home() {
  const Component = dynamic(() => Promise.resolve(HomeComponent), { ssr: false });
  return <Component />;
}
