import Reconciler from 'react-reconciler';
import { ExcelCell, ExcelRow, ExcelSheet, CustomElement, TextNode, CustomNode, CustomRoot } from './types';
import * as xlsx from 'xlsx';

// Context for tracking current position during rendering
interface RenderContext {
  currentRow: number;
  currentCol: number;
}

function traceCustomRenderer(method: string, ...args: any[]) {
  if (['createTextInstance', 'appendInitialChild'].includes(method)) {
    console.log(`[CustomRenderer] ${method}`, ...args);
  }
}

// Custom host config for Excel rendering
const hostConfig = {
  // Create a new instance
  createInstance(type: string, props: any, rootContainerInstance: ExcelSheet): CustomElement {
    traceCustomRenderer('createInstance', type, props, rootContainerInstance);
    return { type, props, children: [], nodeType: 'element' };
  },

  // Create a new text instance
  createTextInstance(text: string, rootContainerInstance: ExcelSheet): TextNode {
    traceCustomRenderer('createTextInstance', text, rootContainerInstance);
    return { value: text, nodeType: 'text' };
  },

  // // Append a child to a parent
  // appendChild(parentInstance: CustomElement, child: CustomNode) {
  //   traceCustomRenderer('appendChild', parentInstance, child)
  //   if (parentInstance.children) {
  //     parentInstance.children.push(child);
  //   }
  // },

  appendInitialChild(parentInstance: CustomElement, child: CustomNode) {
    traceCustomRenderer('appendInitialChild', parentInstance, child);
    parentInstance.children?.push(child);
  },

  finalizeInitialChildren(instance: CustomNode, type: string, props: any) {
    traceCustomRenderer('finalizeInitialChildren', instance, type, props);
    return false;
  },

  shouldSetTextContent(instance: CustomNode, type: string, props: any) {
    traceCustomRenderer('shouldSetTextContent', instance, type, props);
    return false;
  },

  // // Append a child to a parent before a specific child
  // insertBefore(parentInstance: CustomElement, child: CustomNode, beforeChild: CustomNode) {
  //   traceCustomRenderer('insertBefore', parentInstance, child, beforeChild)
  //   if (parentInstance.children) {
  //     const index = parentInstance.children.indexOf(beforeChild);
  //     if (index !== -1) {
  //       parentInstance.children.splice(index, 0, child);
  //     } else {
  //       parentInstance.children.push(child);
  //     }
  //   }
  // },

  // // Remove a child from a parent
  // removeChild(parentInstance: CustomElement, child: CustomNode) {
  //   traceCustomRenderer('removeChild', parentInstance, child)
  //   if (parentInstance.children) {
  //     const index = parentInstance.children.indexOf(child);
  //     if (index !== -1) {
  //       parentInstance.children.splice(index, 1);
  //     }
  //   }
  // },

  preparePortalMount(parentInstance: CustomElement, child: CustomNode) {
    traceCustomRenderer('preparePortalMount', parentInstance, child);
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
  getPublicInstance(instance: CustomNode) {
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

  // Reset text content
  resetTextContent(instance: any) {
    console.log('resetTextContent', instance);
    // No reset needed
  },

  // Get the instance from node
  getInstanceFromNode(node: any) {
    return node;
  },

  // Get the node from instance
  getNodeFromInstance(instance: any) {
    return instance;
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

  supportsMicrotasks: true,

  scheduleMicrotask(fn: (...args: any[]) => void) {
    queueMicrotask(fn);
  },

  // Supports mutation
  supportsMutation: false,

  // Supports persistence
  supportsPersistence: true,

  getCurrentEventPriority() {
    return 0;
  },

  // Undocumented methods as of June 21, 2025
  createContainerChildSet(container: CustomElement) {
    traceCustomRenderer('createContainerChildSet', arguments);
    return container;
  },

  replaceContainerChildren(c1: CustomElement, c2: CustomElement) {
    traceCustomRenderer('replaceContainerChildren', arguments);
    return c2;
  },

  appendChildToContainerChildSet(container: CustomElement, child: CustomNode) {
    traceCustomRenderer('appendChildToContainerChildSet', arguments);
    container.children?.push(child);
  },

  finalizeContainerChildren(container: CustomElement) {
    return false;
  },
};

// Create the reconciler
export const excelReconciler = Reconciler(hostConfig as any);

function dropUndefinedValues(obj: any) {
  return Object.fromEntries(Object.entries(obj).filter(([_, value]) => value !== undefined));
}

function processCell(element: CustomElement, context: RenderContext): ExcelCell {
  return {
    ...processCellContents(element, context),
    ...dropUndefinedValues({ width: element.props.width, z: element.props.z }),
  };
}

function processCellContents(element: CustomElement, context?: RenderContext): ExcelCell {
  let textContent = element.children
    ?.filter(child => child.nodeType === 'text')
    ?.map(child => child.value)
    .join('');

  // Special case for booleans -- if the children is a boolean,
  // it doesn't appear as children, but as a prop
  if (element.type === 'boolean' && typeof element.props.children === 'boolean') {
    textContent = element.props.children.toString();
  }

  console.log('Rendering cell', element.type, textContent, element.children);

  if (element.nodeType === 'element' && element.type === 'text') {
    return {
      t: 's',
      v: textContent,
    };
  } else if (element.nodeType === 'element' && element.type === 'number') {
    return {
      t: 'n',
      v: Number(textContent),
    };
  } else if (element.nodeType === 'element' && element.type === 'boolean') {
    if (textContent === 'true' || textContent === '1') {
      return {
        t: 'b',
        v: true,
      };
    } else if (textContent === 'false' || textContent === '0') {
      return {
        t: 'b',
        v: false,
      };
    } else {
      console.warn(`Invalid boolean value ${textContent}`);
      return {
        t: 'b',
        v: false,
      };
    }
  } else if (element.nodeType === 'element' && element.type === 'date') {
    return {
      t: 'n',
      v: convertToExcelDate(new Date(textContent)),
      z: 'YYYY-MM-DD',
    };
  } else if (element.nodeType === 'element' && element.type === 'formula') {
    // Process formula content and resolve RC components
    const processedFormula = processFormulaWithRC(element, context!);
    return {
      f: processedFormula,
    };
  } else {
    throw new Error('Unsupported cell type');
  }
}

function processFormulaWithRC(formulaElement: CustomElement, context: RenderContext): string {
  let formula = '';

  for (const child of formulaElement.children || []) {
    if (child.nodeType === 'text') {
      formula += child.value;
    } else if (child.nodeType === 'element' && child.type === 'RC') {
      // Convert RC component to actual cell reference
      const dr = child.props.dr || 0;
      const dc = child.props.dc || 0;
      const targetRow = context.currentRow + dr;
      const targetCol = context.currentCol + dc;

      // Convert to Excel cell reference (e.g., A1, B2, etc.)
      const cellRef = xlsx.utils.encode_cell({ r: targetRow, c: targetCol });
      formula += cellRef;
    }
  }

  return formula;
}

function processTopLevelElements(element: CustomElement, rowIndex: number): ExcelRow | null {
  if (element.type === 'row') {
    const row: ExcelRow = {
      cells: [],
      widthSetting: element.props.widthSetting || false,
    };

    if (element.children) {
      let colIndex = 0;
      for (const child of element.children) {
        if (child.nodeType === 'text') {
          if (child.value.trim()) {
            throw new Error('Non-empty text node found in row');
          }
          continue;
        }

        const context: RenderContext = {
          currentRow: rowIndex,
          currentCol: colIndex,
        };

        const cell = processCell(child, context);

        row.cells.push(cell);
        colIndex += 1;
      }
    }

    return row;
  } else {
    throw new Error(`Unsupported top level element ${element.type}`);
  }
}

// Helper function to convert custom elements to Excel sheet
export function convertToExcelSheet(rootElement: CustomRoot): ExcelSheet {
  const sheet: ExcelSheet = { rows: [] };

  // Process all children as rows with position context
  if (rootElement.children) {
    let rowIndex = 0;
    for (const child of rootElement.children) {
      if (child.nodeType === 'text') {
        if (child.value.trim()) {
          throw new Error('Non-empty text node found in row');
        }
        continue;
      }

      const row = processTopLevelElements(child, rowIndex);

      rowIndex += 1;
      if (row) {
        sheet.rows.push(row);
      }
    }
  }

  return sheet;
}

// Helper function to deal with dates
function convertToExcelDate(date: Date): number {
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date ${date}`);
  }

  const basedate = new Date('1899-12-31T00:00:00Z');

  const adjustmentBasedate = new Date('1900-03-01T00:00:00Z');
  const adjustmentFor1900LeapYearBug = date.getTime() > adjustmentBasedate.getTime() ? 86400e3 : 0;

  return (date.getTime() - basedate.getTime() + adjustmentFor1900LeapYearBug) / 86400e3;
}
