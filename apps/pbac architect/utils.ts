import pako from 'pako';
import { ResourceNode, Statement, Policy, Category, FileSystemItem } from './types';

export const generateId = () => Math.random().toString(36).substr(2, 9);

export const createDefaultCondition = (): ResourceNode => ({
  id: generateId(),
  type: 'Condition',
  condition: { Left: 'resource.type', Comparison: '=', Right: 'CeAsset' }
});

export const createDefaultStatement = (): Statement => ({
  id: generateId(),
  Subject: ['role:roleBasic'],
  Effect: 'Allow',
  Action: ['Read'],
  Resource: createDefaultCondition()
});

export const createDefaultPolicy = (): Policy => ({
  id: generateId(),
  itemType: 'Policy',
  name: 'New Access Policy',
  Version: '1.0',
  Statements: [createDefaultStatement()]
});

export const createDefaultCategory = (name = "New Folder"): Category => ({
    id: generateId(),
    itemType: 'Category',
    name: name,
    children: [],
    collapsed: false
});

// Helper to chunk string
const chunkString = (str: string, length: number) => {
    return str.match(new RegExp('.{1,' + length + '}', 'g'))?.join('\n') || str;
};

export const encodePolicy = (jsonObj: any): string => {
  try {
    const jsonString = JSON.stringify(jsonObj);
    const compressed = pako.gzip(jsonString);
    let binary = '';
    const len = compressed.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(compressed[i]);
    }
    const b64 = btoa(binary);
    // Chunk into 76 chars for the format seen in pbac.txt
    return chunkString(b64, 76);
  } catch (e) {
    return "ERROR_COMPRESSING";
  }
};

export const resourceNodeToJson = (node: ResourceNode): any => {
  if (node.type === 'Condition' && node.condition) {
    let rightVal: any = node.condition.Right;
    
    // Parse if it's a string looking like an array, or keep as is if it's already an array
    if (typeof rightVal === 'string') {
        const trimmed = rightVal.trim();
        if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
            try { rightVal = JSON.parse(trimmed.replace(/'/g, '"')); } 
            catch { rightVal = trimmed.slice(1, -1).split(',').map((s:string) => s.trim().replace(/['"]/g, '')); }
        } else if (rightVal === 'true') rightVal = true;
        else if (rightVal === 'false') rightVal = false;
        else if (!isNaN(Number(rightVal)) && rightVal !== '') rightVal = Number(rightVal);
    }
    
    return { Condition: { Left: node.condition.Left, Comparison: node.condition.Comparison, Right: rightVal } };
  }
  if (node.type === 'HasAccessTo') {
    if (node.accessReference && !node.accessRole && !node.accessAction && !node.accessGrouping) {
        return { HasAccessTo: node.accessReference };
    }
    const obj: any = { Reference: node.accessReference || 'resource.parent' };
    if (node.accessRole) {
        if (node.accessRole.includes(',') || node.accessRole.startsWith('[')) {
             obj.Roles = node.accessRole.replace(/[\[\]"]/g, '').split(',').map(s => s.trim());
        } else { obj.Role = node.accessRole; }
    }
    if (node.accessAction) obj.Action = node.accessAction;
    if (node.accessGrouping) obj.Grouping = node.accessGrouping;
    return { HasAccessTo: obj };
  }
  if (node.type === 'All') return { All: node.children?.map(resourceNodeToJson) || [] };
  if (node.type === 'Any') return { Any: node.children?.map(resourceNodeToJson) || [] };
  return {};
};

export const policyToJson = (policy: Policy) => {
  return {
    Version: policy.Version,
    Statement: policy.Statements.map(stmt => ({
      Subject: stmt.Subject,
      Effect: stmt.Effect,
      Action: stmt.Action,
      Resource: resourceNodeToJson(stmt.Resource)
    }))
  };
};

export const generateExtendedCodeFragment = (policy: Policy, parentInfo: { type: 'variable' | 'target', value: string }) => {
    const jsonObj = policyToJson(policy);
    
    // 1. contentAsString (JSON)
    // Needs to be escaped for Extended string: single quotes ', newlines \n, backslashes \
    const jsonStr = JSON.stringify(jsonObj, null, 4);
    const escapedJson = jsonStr
        .replace(/\\/g, '\\\\')   // Escape backslashes first
        .replace(/'/g, "\\'")     // Escape single quotes
        .replace(/\n/g, "\\n");   // Literal newline chars

    // 2. configuration (Base64)
    // The base64 is already chunked with \n. In extended code, multi-line strings in '...' are valid.
    const base64 = encodePolicy(jsonObj);
    const configString = `${policy.name};application/json;${base64}`;
    
    // Determine parent string
    const parentStr = parentInfo.type === 'target' ? `t.${parentInfo.value}` : parentInfo.value;

    return `_pol := ${parentStr}.add(AccessPolicy, id := '${policy.id}', name := '${policy.name}', configuration := '${configString}', contentAsString := '${escapedJson}')`;
};

export const jsonToResourceNode = (json: any): ResourceNode => {
  const id = generateId();
  if (json.All) return { id, type: 'All', children: json.All.map(jsonToResourceNode) };
  if (json.Any) return { id, type: 'Any', children: json.Any.map(jsonToResourceNode) };
  if (json.HasAccessTo) {
    if (typeof json.HasAccessTo === 'string') return { id, type: 'HasAccessTo', accessReference: json.HasAccessTo };
    return {
        id, type: 'HasAccessTo',
        accessReference: json.HasAccessTo.Reference,
        accessRole: json.HasAccessTo.Roles ? json.HasAccessTo.Roles.join(', ') : json.HasAccessTo.Role,
        accessAction: json.HasAccessTo.Action,
        accessGrouping: json.HasAccessTo.Grouping
    };
  }
  if (json.Condition) {
    const c = json.Condition;
    let rightVal = c.Right;
    if (typeof rightVal === 'number' || typeof rightVal === 'boolean') rightVal = String(rightVal);
    
    return { id, type: 'Condition', condition: { Left: c.Left, Comparison: c.Comparison, Right: rightVal } };
  }
  return { id, type: 'Condition', condition: { Left: 'error', Comparison: '=', Right: 'unknown' } };
}

export const jsonToPolicy = (jsonString: string, currentId: string, currentName: string): Policy | null => {
  try {
    const obj = JSON.parse(jsonString);
    if (!obj || typeof obj !== 'object') return null; // Added check for valid object to prevent undefined errors
    const stmts: Statement[] = (obj.Statement || []).map((s: any) => ({
      id: generateId(),
      Subject: s.Subject || [],
      Effect: s.Effect || 'Allow',
      Action: s.Action || [],
      Resource: s.Resource ? jsonToResourceNode(s.Resource) : createDefaultCondition()
    }));
    return { id: currentId, itemType: 'Policy', name: currentName, Version: obj.Version || '1.0', Statements: stmts };
  } catch (e) { return null; }
};

export const parseImportScript = (script: string): FileSystemItem[] => {
    const rootItems: FileSystemItem[] = [];
    const varMap: Record<string, Category> = {}; 
    const commands: string[] = [];
    let buffer = "";
    let quoteChar: string | null = null;
    let escape = false;

    for(let i=0; i<script.length; i++) {
        const char = script[i];
        if (escape) { escape = false; buffer += char; continue; }
        if (char === '\\') { escape = true; buffer += char; continue; }
        if (quoteChar) {
            buffer += char;
            if (char === quoteChar) quoteChar = null;
        } else {
            if (char === "'") { quoteChar = "'"; buffer += char; }
            else if (char === ';') { 
                buffer += char; 
            } else if (char === '\n') {
                if (buffer.trim().length > 0) {
                    commands.push(buffer.trim());
                    buffer = "";
                }
            } else {
                buffer += char;
            }
        }
    }
    if(buffer.trim().length > 0) commands.push(buffer.trim());

    commands.forEach(cmd => {
        const assignMatch = cmd.match(/^(\w+)\s*:=\s*([\w\.]+)\.add\((Category|AccessPolicy)/);
        const addMatch = cmd.match(/^([\w\.]+)\.add\((Category|AccessPolicy)/);

        if (assignMatch || addMatch) {
            const match = assignMatch || addMatch;
            if(!match) return;

            const targetVar = assignMatch ? assignMatch[1] : null; 
            const parentVar = assignMatch ? assignMatch[2] : match![1]; 
            const type = assignMatch ? assignMatch[3] : match![2];

            const idMatch = cmd.match(/id\s*:=\s*'([^']+)'/);
            const nameMatch = cmd.match(/name\s*:=\s*'([^']+)'/);
            const id = idMatch ? idMatch[1] : generateId();
            const name = nameMatch ? nameMatch[1] : 'Imported Item';

            if (type === 'Category') {
                const newCat: Category = { id, itemType: 'Category', name, children: [], collapsed: false };
                if (targetVar) varMap[targetVar] = newCat;
                if (parentVar.includes('root')) rootItems.push(newCat);
                else if (varMap[parentVar]) varMap[parentVar].children.push(newCat);
                else rootItems.push(newCat); 
            } else if (type === 'AccessPolicy') {
                const casIdx = cmd.indexOf('contentAsString');
                if (casIdx > -1) {
                    const startQuote = cmd.indexOf("'", casIdx);
                    if (startQuote > -1) {
                        const endQuote = cmd.lastIndexOf("'");
                        if (endQuote > startQuote) {
                            let jsonStr = cmd.substring(startQuote + 1, endQuote);
                            jsonStr = jsonStr.replace(/\\'/g, "'").replace(/\\\\/g, "\\").replace(/\\n/g, "\n").replace(/\\"/g, '"');
                            const newPol = jsonToPolicy(jsonStr, id, name);
                            if (newPol) {
                                if (varMap[parentVar]) varMap[parentVar].children.push(newPol);
                                else rootItems.push(newPol);
                            }
                        }
                    }
                }
            }
        }
    });
    return rootItems;
};