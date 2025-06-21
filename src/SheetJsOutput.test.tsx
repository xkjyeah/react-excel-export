import React from 'react';
import { render } from '@testing-library/react';
import { SheetJsOutput } from './SheetJsOutput';
import { SheetJsOutputRef } from './types';

describe('SheetJsOutput', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render null', async () => {
    const ref = React.createRef<SheetJsOutputRef>();
    render(<SheetJsOutput ref={ref}></SheetJsOutput>);

    expect(await ref.current!.getExcelSheet()).toEqual({ '!ref': 'A1:A1' });
  });

  it('should render numbers', async () => {
    const ref = React.createRef<any>();
    render(
      <SheetJsOutput ref={ref}>
        <row>
          <number>123</number>
          <number>-1.45</number>
          <number>10e9</number>
        </row>
        <row>
          <number>124</number>
          <number>1e-9</number>
          <number>10e9</number>
        </row>
      </SheetJsOutput>
    );

    expect(await ref.current!.getExcelSheet()).toEqual({
      '!ref': 'A1:C2',
      A1: { v: 123, t: 'n' },
      B1: { v: -1.45, t: 'n' },
      C1: { v: 1e10, t: 'n' },
      A2: { v: 124, t: 'n' },
      B2: { v: 1e-9, t: 'n' },
      C2: { v: 1e10, t: 'n' },
    });
  });

  it('should render text', async () => {
    const ref = React.createRef<any>();
    render(
      <SheetJsOutput ref={ref}>
        <row>
          <text>Hello</text>
          <text>1e2</text>
        </row>
        <row>
          <text>World</text>
          <text>-5</text>
        </row>
      </SheetJsOutput>
    );

    expect(await ref.current!.getExcelSheet()).toEqual({
      '!ref': 'A1:B2',
      A1: { v: 'Hello', t: 's' },
      B1: { v: '1e2', t: 's' },
      A2: { v: 'World', t: 's' },
      B2: { v: '-5', t: 's' },
    });
  });

  it('should render booleans', async () => {
    const ref = React.createRef<any>();
    render(
      <SheetJsOutput ref={ref}>
        <row>
          <boolean>true</boolean>
          <boolean>false</boolean>
        </row>
        <row>
          <boolean>1</boolean>
          <boolean>0</boolean>
        </row>
        <row>
          <boolean>something</boolean>
          <boolean></boolean>
        </row>
        <row>
          <boolean>{true}</boolean>
          <boolean>{false}</boolean>
        </row>
      </SheetJsOutput>
    );

    expect(await ref.current!.getExcelSheet()).toEqual({
      '!ref': 'A1:B4',
      A1: { v: true, t: 'b' },
      B1: { v: false, t: 'b' },
      A2: { v: true, t: 'b' },
      B2: { v: false, t: 'b' },
      A3: { v: false, t: 'b' },
      B3: { v: false, t: 'b' },
      A4: { v: true, t: 'b' },
      B4: { v: false, t: 'b' },
    });
  });

  it('should render dates', async () => {
    const ref = React.createRef<any>();
    render(
      <SheetJsOutput ref={ref}>
        <row>
          <date>2021-01-01</date>
          <date>2022-01-02</date>
          <date>1900-03-01</date>
          <date>1900-02-28</date>
        </row>
        <row>
          <date>2022-01-02T15:00:00Z</date>
          <date>1900-03-01T16:00:00Z</date>
          <date>1900-02-28T11:00:00Z</date>
        </row>
      </SheetJsOutput>
    );

    expect(await ref.current!.getExcelSheet()).toEqual({
      '!ref': 'A1:D2',
      A1: { v: 44197, t: 'n', z: 'YYYY-MM-DD' },
      B1: { v: 44563, t: 'n', z: 'YYYY-MM-DD' },
      C1: { v: 60, t: 'n', z: 'YYYY-MM-DD' },
      D1: { v: 59, t: 'n', z: 'YYYY-MM-DD' },
      A2: { v: 44563.625, t: 'n', z: 'YYYY-MM-DD' },
      B2: { v: 61.666666666666664, t: 'n', z: 'YYYY-MM-DD' },
      C2: { v: 59.458333333333336, t: 'n', z: 'YYYY-MM-DD' },
    });
  });

  it('should handle cells with format', async () => {
    const ref = React.createRef<any>();
    render(
      <SheetJsOutput ref={ref}>
        <row>
          <number z="#,##0.00">123.45</number>
        </row>
      </SheetJsOutput>
    );

    const result = await ref.current.getExcelSheet();

    expect(result['A1']).toEqual({
      v: 123.45,
      t: 'n',
      z: '#,##0.00',
    });
  });

  it('should handle column widths when widthSetting is true', async () => {
    const ref = React.createRef<any>();
    render(
      <SheetJsOutput ref={ref}>
        <row widthSetting>
          <text width={15}>Test</text>
          <text width={20}>Data</text>
        </row>
      </SheetJsOutput>
    );

    const result = await ref.current.getExcelSheet();

    expect(result).toEqual({
      '!ref': 'A1:B1',
      '!cols': [{ width: 15 }, { width: 20 }],
      A1: { v: 'Test', t: 's' },
      B1: { v: 'Data', t: 's' },
    });
  });

  it('should not set column widths when widthSetting is false', async () => {
    const ref = React.createRef<any>();
    render(
      <SheetJsOutput ref={ref}>
        <row>
          <text width={15}>Test</text>
          <text width={20}>Data</text>
        </row>
      </SheetJsOutput>
    );

    const result = await ref.current.getExcelSheet();
    expect(result).toEqual({
      '!ref': 'A1:B1',
      A1: { v: 'Test', t: 's' },
      B1: { v: 'Data', t: 's' },
    });
  });

  it('should handle formula cells', async () => {
    const ref = React.createRef<any>();
    render(
      <SheetJsOutput ref={ref}>
        <row>
          <number>-4</number>
        </row>
        <row>
          <number>5</number>
        </row>
        <row>
          <formula z="$#,##0.00">A1+B1</formula>
        </row>
      </SheetJsOutput>
    );

    const result = await ref.current.getExcelSheet();

    expect(result).toEqual({
      '!ref': 'A1:A3',
      A1: { v: -4, t: 'n' },
      A2: { v: 5, t: 'n' },
      A3: { f: 'A1+B1', z: '$#,##0.00' },
    });
  });
});
