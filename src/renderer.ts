import { Reconciler } from 'react-reconciler';
import { ExcelCell, ExcelRow, ExcelSheet, CustomElement } from './types';

// Custom host config for Excel rendering
const hostConfig = {
  // Create a new instance
  createInstance(type: string, props: any, rootContainerInstance: ExcelSheet) {
    return { type, props, children: [] };
  },

  // Create a new text instance
  createTextInstance(text: string, rootContainerInstance: ExcelSheet) {
    return { type: 'text', value: text };
  },

  // Append a child to a parent
  appendChild(parentInstance: any, child: any) {
    if (parentInstance.children) {
      parentInstance.children.push(child);
    }
  },

  // Append a child to a parent before a specific child
  insertBefore(parentInstance: any, child: any, beforeChild: any) {
    if (parentInstance.children) {
      const index = parentInstance.children.indexOf(beforeChild);
      if (index !== -1) {
        parentInstance.children.splice(index, 0, child);
      } else {
        parentInstance.children.push(child);
      }
    }
  },

  // Remove a child from a parent
  removeChild(parentInstance: any, child: any) {
    if (parentInstance.children) {
      const index = parentInstance.children.indexOf(child);
      if (index !== -1) {
        parentInstance.children.splice(index, 1);
      }
    }
  },

  // Get the root container instance
  getRootHostContext() {
    return null;
  },

  // Get the child host context
  getChildHostContext(parentHostContext: any, type: string, rootContainerInstance: ExcelSheet) {
    return parentHostContext;
  },

  // Prepare for commit
  prepareForCommit() {
    return null;
  },

  // Reset after commit
  resetAfterCommit() {
    // No cleanup needed
  },

  // Get the public instance
  getPublicInstance(instance: any) {
    return instance;
  },

  // Prepare the update
  prepareUpdate(instance: any, type: string, oldProps: any, newProps: any, rootContainerInstance: ExcelSheet) {
    return { type, props: newProps };
  },

  // Commit the update
  commitUpdate(instance: any, updatePayload: any, type: string, oldProps: any, newProps: any, finishedWork: any) {
    instance.type = type;
    instance.props = newProps;
  },

  // Commit text update
  commitTextUpdate(textInstance: any, oldText: string, newText: string) {
    textInstance.value = newText;
  },

  // Commit mount
  commitMount(instance: any, type: string, newProps: any, finishedWork: any) {
    // No special mount logic needed
  },

  // Should set text content
  shouldSetTextContent(type: string, props: any) {
    return false;
  },

  // Reset text content
  resetTextContent(instance: any) {
    // No reset needed
  },

  // Get the current event priority
  getCurrentEventPriority() {
    return 0;
  },

  // Get the instance from node
  getInstanceFromNode(node: any) {
    return node;
  },

  // Get the node from instance
  getNodeFromInstance(instance: any) {
    return instance;
  },

  // Before active instance blur
  beforeActiveInstanceBlur() {
    // No blur handling needed
  },

  // After active instance blur
  afterActiveInstanceBlur() {
    // No blur handling needed
  },

  // Is primary renderer
  isPrimaryRenderer: false,

  // Supports hydration
  supportsHydration: false,

  // Schedule timeout
  scheduleTimeout(fn: (...args: any[]) => void, delay?: number) {
    return setTimeout(fn, delay);
  },

  // Cancel timeout
  cancelTimeout(id: any) {
    clearTimeout(id);
  },

  // No timeout
  noTimeout: -1,

  // Get the current time
  now() {
    return Date.now();
  },

  // Supports mutation
  supportsMutation: true,

  // Supports persistence
  supportsPersistence: false,
};

// Create the reconciler
export const excelReconciler = Reconciler(hostConfig);

// Helper function to convert custom elements to Excel sheet
export function convertToExcelSheet(rootElement: CustomElement): ExcelSheet {
  const sheet: ExcelSheet = { rows: [] };
  
  function processElement(element: CustomElement): ExcelRow | null {
    if (element.type === 'row') {
      const row: ExcelRow = {
        cells: [],
        widthSetting: element.props.widthSetting || false
      };
      
      if (element.children) {
        for (const child of element.children) {
          const cell = processCell(child);
          if (cell) {
            row.cells.push(cell);
          }
        }
      }
      
      return row;
    }
    
    return null;
  }
  
  function processCell(element: CustomElement): ExcelCell | null {
    const cellTypes = ['text', 'number', 'boolean', 'date', 'formula'];
    
    if (cellTypes.indexOf(element.type) !== -1) {
      let value: string | number | boolean | Date = '';
      
      // Extract value from children
      if (element.children && element.children.length > 0) {
        const child = element.children[0];
        if (child.type === 'text' && 'value' in child) {
          value = (child as any).value;
        }
      }
      
      // Convert value based on type
      switch (element.type) {
        case 'number':
          value = Number(value);
          break;
        case 'boolean':
          value = Boolean(value);
          break;
        case 'date':
          if (typeof value === 'string' || typeof value === 'number') {
            value = new Date(value);
          }
          break;
        case 'formula':
          // Keep as string for formulas
          break;
        default:
          // text type, keep as string
          break;
      }
      
      return {
        type: element.type as 'text' | 'number' | 'boolean' | 'date' | 'formula',
        value,
        width: element.props.width,
        format: element.props.z
      };
    }
    
    return null;
  }
  
  // Process all children as rows
  if (rootElement.children) {
    for (const child of rootElement.children) {
      const row = processElement(child);
      if (row) {
        sheet.rows.push(row);
      }
    }
  }
  
  return sheet;
} 