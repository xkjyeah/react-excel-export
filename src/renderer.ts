import Reconciler from 'react-reconciler';
import { ExcelCell, ExcelRow, ExcelSheet, CustomElement, TextNode, CustomNode, CustomRoot } from './types';

// Custom host config for Excel rendering
const hostConfig = {
  // Create a new instance
  createInstance(type: string, props: any, rootContainerInstance: ExcelSheet): CustomElement {
    console.log('createInstance', type, props, rootContainerInstance);
    return { type, props, children: [], nodeType: 'element' };
  },

  // Create a new text instance
  createTextInstance(text: string, rootContainerInstance: ExcelSheet): TextNode {
    console.log('createTextInstance', text, rootContainerInstance);
    return { value: text, nodeType: 'text' };
  },

  // // Append a child to a parent
  // appendChild(parentInstance: CustomElement, child: CustomNode) {
  //   console.log('appendChild', parentInstance, child)
  //   if (parentInstance.children) {
  //     parentInstance.children.push(child);
  //   }
  // },

  appendInitialChild(parentInstance: CustomElement, child: CustomNode) {
    console.log('appendInitialChild', parentInstance, child);
    parentInstance.children?.push(child);
  },

  finalizeInitialChildren(instance: CustomNode, type: string, props: any) {
    console.log('finalizeInitialChildren', instance, type, props);
    return false;
  },

  shouldSetTextContent(instance: CustomNode, type: string, props: any) {
    console.log('shouldSetTextContent', instance, type, props);
    return false;
  },

  // // Append a child to a parent before a specific child
  // insertBefore(parentInstance: CustomElement, child: CustomNode, beforeChild: CustomNode) {
  //   console.log('insertBefore', parentInstance, child, beforeChild)
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
  //   console.log('removeChild', parentInstance, child)
  //   if (parentInstance.children) {
  //     const index = parentInstance.children.indexOf(child);
  //     if (index !== -1) {
  //       parentInstance.children.splice(index, 1);
  //     }
  //   }
  // },

  preparePortalMount(parentInstance: CustomElement, child: CustomNode) {
    console.log('preparePortalMount', parentInstance, child);
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
    console.log('createContainerChildSet', arguments);
    return container;
  },

  replaceContainerChildren(c1: CustomElement, c2: CustomElement) {
    console.log('replaceContainerChildren', arguments);
    return c2;
  },

  appendChildToContainerChildSet(container: CustomElement, child: CustomNode) {
    console.log('appendChildToContainerChildSet', arguments);
    container.children?.push(child);
  },

  finalizeContainerChildren(container: CustomElement) {
    return false;
  },
};

// Create the reconciler
export const excelReconciler = Reconciler(hostConfig as any);

function processCell(element: CustomElement): ExcelCell | null {
  return {
    ...processCellContents(element),
    width: element.props.width,
    z: element.props.z,
  };
}

function processCellContents(element: CustomElement): ExcelCell {
  const textContent = element.children
    ?.filter(child => child.nodeType === 'text')
    ?.map(child => child.value)
    .join('');

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
    return {
      t: 'b',
      v: textContent === 'true' || textContent === '1',
    };
  } else if (element.nodeType === 'element' && element.type === 'date') {
    return {
      t: 'd',
      // TODO convert from epoch to UTC
      v: new Date(textContent).getTime(),
    };
  } else if (element.nodeType === 'element' && element.type === 'formula') {
    return {
      f: textContent,
    };
  } else {
    throw new Error('Unsupported cell type');
  }
}

function processTopLevelElements(element: CustomElement): ExcelRow | null {
  if (element.type === 'row') {
    const row: ExcelRow = {
      cells: [],
      widthSetting: element.props.widthSetting || false,
    };

    if (element.children) {
      for (const child of element.children) {
        if (child.nodeType === 'text') {
          if (child.value.trim()) {
            throw new Error('Non-empty text node found in row');
          }
          continue;
        }

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
// Helper function to convert custom elements to Excel sheet
export function convertToExcelSheet(rootElement: CustomRoot): ExcelSheet {
  const sheet: ExcelSheet = { rows: [] };

  // Process all children as rows
  if (rootElement.children) {
    for (const child of rootElement.children) {
      if (child.nodeType !== 'element') {
        throw new Error(`Non-element node with value ${child.value} found in top level`);
      }

      const row = processTopLevelElements(child);
      if (row) {
        sheet.rows.push(row);
      }
    }
  }

  return sheet;
}
