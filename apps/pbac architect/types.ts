export type ActionType = 'Read' | 'Update' | 'Create' | 'Delete';
export type EffectType = 'Allow' | 'Deny';
export type ComparisonType = '=' | '!=' | 'Contains' | '!~' | 'ContainsAny' | 'NotContainsAny';

export interface ConditionData {
  Left: string;
  Comparison: ComparisonType;
  Right: string | string[]; // Supports arrays now
}

export interface ResourceNode {
  id: string;
  type: 'Condition' | 'HasAccessTo' | 'All' | 'Any';
  condition?: ConditionData;
  accessReference?: string;
  accessRole?: string; 
  accessGrouping?: 'All' | 'Any';
  accessAction?: string;
  children?: ResourceNode[];
}

export interface Statement {
  id: string;
  Subject: string[];
  Effect: EffectType;
  Action: ActionType[];
  Resource: ResourceNode;
}

export interface Policy {
  id: string;
  itemType: 'Policy';
  name: string;
  Version: string;
  Statements: Statement[];
}

export interface Category {
    id: string;
    itemType: 'Category';
    name: string;
    children: (Category | Policy)[];
    collapsed?: boolean;
}

export type FileSystemItem = Category | Policy;

export interface Vocabulary {
  roles: string[];
  types: string[];
  properties: string[];
}