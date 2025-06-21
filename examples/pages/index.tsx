'use client';

import React, { useEffect } from 'react';
import { ExcelTable, HTMLTable } from '../components';
import styles from '../styles/Home.module.css';
import dynamic from 'next/dynamic';
import Prism from 'prismjs';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-typescript';
import 'prismjs/themes/prism.css';
// @ts-ignore
import sourceCode from '../components.tsx?raw';

function hideLines(sourceCode: string) {
  const lines = sourceCode.split('\n');
  let nextLineHidden = false;

  const result = [];

  for (const line of lines) {
    if (nextLineHidden) {
      nextLineHidden = false;
      continue;
    }
    if (line.startsWith('// source-hide-next-line')) {
      nextLineHidden = true;
      continue;
    }
    result.push(line);
  }

  return result.join('\n');
}

export function SourceCodeDisplay() {
  const processedSourceCode = hideLines(sourceCode);

  useEffect(() => {
    // Highlight the code after the component mounts
    Prism.highlightAll();
  }, [processedSourceCode]);

  return (
    <div>
      <pre className="language-jsx">
        <code className="language-jsx">{processedSourceCode}</code>
      </pre>
    </div>
  );
}

function HomeComponent() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>React Export Excel Demo</h1>

        <p className={styles.description}>A Next.js example showing how to use the react-export-excel library</p>

        <div className={styles.demoSection}>
          <h2>Live Demo</h2>
          <p>Click the button below to export the sample data to Excel:</p>
          <HTMLTable />
          <ExcelTable />
        </div>

        <div className={styles.codeSection}>
          <h2>Source Code</h2>
          <p>Here's how to implement this in your own project:</p>
          <SourceCodeDisplay />
        </div>
      </main>

      <footer className={styles.footer}>
        <a href="https://github.com/xkjyeah/react-export-excel" target="_blank" rel="noopener noreferrer">
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
