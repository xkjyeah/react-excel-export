import React from 'react';
import { CellProps } from './types';

// Cell components that will be rendered by the custom reconciler
export const text: React.FC<CellProps> = ({ children, width, z }) => {
  return React.createElement('text', { width, z }, children);
};

export const number: React.FC<CellProps> = ({ children, width, z }) => {
  return React.createElement('number', { width, z }, children);
};

export const boolean: React.FC<CellProps> = ({ children, width, z }) => {
  return React.createElement('boolean', { width, z }, children);
};

export const date: React.FC<CellProps> = ({ children, width, z }) => {
  return React.createElement('date', { width, z }, children);
};

export const formula: React.FC<CellProps> = ({ children, width, z }) => {
  return React.createElement('formula', { width, z }, children);
};

export const row: React.FC<{ widthSetting?: boolean; children?: React.ReactNode }> = ({ 
  children, 
  widthSetting 
}) => {
  return React.createElement('row', { widthSetting }, children);
}; 