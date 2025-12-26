export type ViewMode = 'simple' | 'architect';

export type MethodConfigType = 
  | 'HistoricalNumberMethodConfig' | 'NumberMethodConfig'
  | 'StringMethodConfig' | 'HistoricalTextMethodConfig' | 'TextMethodConfig'
  | 'ReferenceMethodConfig' | 'HistoricalReferenceMethodConfig'
  | 'ReverseReferenceMethodConfig'
  | 'ListMethodConfig' | 'HistoricalListMethodConfig'
  | 'ExtendedMethodConfig'
  | 'BooleanMethodConfig' | 'HistoricalBooleanMethodConfig'
  | 'DateMethodConfig' | 'HistoricalDateMethodConfig'
  | 'RichTextMethodConfig' | 'HistoricalRichTextMethodConfig'
  | 'FileMethodConfig';

export interface MethodConfigDetails {
  decimalPlaces?: number;
  formatPostfix?: string;
  targetClass?: string; // For Reference
  multiSelect?: boolean;
  expression?: string; // For Extended/Computed
  listId?: string; // For ListMethodConfig
  listSource?: string;
  colorCode?: string; // For UI visualization
  isHistorical?: boolean; // UI Toggle Helper
}

export interface ListItem {
  id: string;
  name: string;
}

export interface ListPropertySet {
  id: string;
  name: string;
  items: ListItem[];
}

export interface GlobalProperty {
  id: string; // e.g., 'pImpact'
  name: string; // e.g., 'Impact'
  type: MethodConfigType;
  config: MethodConfigDetails;
}

export interface ValidationIssue {
  type: 'error' | 'warning';
  message: string;
}

export interface NodeData {
  label: string; // Display Name
  className: string; // System Name (e.g., CeRiskAssessment)
  namespace: string; // Prefix (e.g., ceras)
  isEnterprise: boolean;
  linkedProperties: string[]; // Array of GlobalProperty IDs
  iconType: 'shield' | 'chart' | 'folder' | 'alert' | 'user' | 'cube' | 'check' | 'globe' | 'mail' | 'calendar';
  description?: string;
  color?: string; // Hex code (Background)
  
  // Cosmetic Styling
  fontSize?: number;
  isBold?: boolean;
  isTransparent?: boolean; // For groups/annotations background
  textAlign?: 'left' | 'center' | 'right';
  textColor?: string;
  borderColor?: string;
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'none';
  borderWidth?: number;
  
  // Architect Customization
  nameFieldLabel?: string; // Default: 'name'
  descFieldLabel?: string; // Default: 'description'
  
  // Layout
  locked?: boolean;

  // Runtime validation state
  validationIssues?: ValidationIssue[];
}

export interface EdgeData {
  label?: string;
  type: 'association' | 'dependency' | 'aggregation' | 'composition';
  cardinality?: '1:1' | '1:N' | 'M:N';
  linkedPropertyId?: string; // To sync changes back to the property
  isReverse?: boolean;
}

// React Flow Types
export interface AppNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: NodeData;
  draggable?: boolean; // Controlled by locked state
  selected?: boolean; // React Flow selection state
  width?: number;
  height?: number;
  zIndex?: number;
  parentId?: string;
  extent?: 'parent';
}

// For Drag and Drop
export interface DragPayload {
  type: MethodConfigType | 'object' | 'existing_property' | 'list_set';
  className?: string;
  label: string;
  namespace?: string;
  icon?: string;
  propertyId?: string; // For existing_property
  listSetId?: string; // For list_set
  color?: string;
}

export interface ContextMenuData {
  id: string;
  top: number;
  left: number;
  type: 'node' | 'edge' | 'pane';
}

export type Alignment = 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom';
export type CanvasBackground = 'lines' | 'white' | 'dark';