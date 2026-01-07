import React from 'react';
import { ResourceNode, ConditionData, ComparisonType, Vocabulary } from '../types';
import { SmartSelect } from './SmartSelect';
import { IconTrash, IconAdd, IconChevronDown } from '../icons';
import { createDefaultCondition } from '../utils';

interface ResourceEditorProps {
  node: ResourceNode;
  onChange: (newNode: ResourceNode) => void;
  onDelete?: () => void;
  vocab: Vocabulary;
  isRoot?: boolean;
}

const OPERATOR_CONFIG: Record<string, { label: string; value: ComparisonType }> = {
    '=': { label: '=', value: '=' },
    '!=': { label: '≠', value: '!=' },
    'Contains': { label: 'Contains', value: 'Contains' },
    '!~': { label: 'Not Contains', value: '!~' },
    'ContainsAny': { label: 'Includes Any', value: 'ContainsAny' },
    'NotContainsAny': { label: 'Excludes All', value: 'NotContainsAny' },
};

const LOGIC_CONFIG: Record<string, string> = {
    'Condition': 'Condition',
    'All': 'Match All (AND)',
    'Any': 'Match Any (OR)',
    'HasAccessTo': 'Inheritance'
};

const getOpLabel = (val: string) => OPERATOR_CONFIG[val]?.label || val;
const getOpValue = (label: string): ComparisonType => {
    const entry = Object.values(OPERATOR_CONFIG).find(c => c.label === label);
    return entry ? entry.value : (label as ComparisonType);
};

export const ResourceEditor: React.FC<ResourceEditorProps> = ({ node, onChange, onDelete, vocab, isRoot = false }) => {

  const handleTypeChange = (newTypeLabel: string) => {
    const newType = Object.keys(LOGIC_CONFIG).find(key => LOGIC_CONFIG[key] === newTypeLabel) as ResourceNode['type'];
    if(!newType) return;

    let newNode: ResourceNode = { ...node, type: newType };
    if (newType === 'Condition' && !newNode.condition) {
      newNode.condition = { Left: 'resource.type', Comparison: '=', Right: '' };
    } else if (newType === 'HasAccessTo') {
      newNode.accessReference = 'resource.parent';
    } else if ((newType === 'All' || newType === 'Any') && !newNode.children) {
      newNode.children = [createDefaultCondition()];
    }
    onChange(newNode);
  };

  const updateCondition = (field: keyof ConditionData, val: string | string[]) => {
    if (!node.condition) return;
    
    let newComparison = node.condition.Comparison;
    
    // Auto-switch operator if multi-selecting
    if (field === 'Right') {
        const isArray = Array.isArray(val);
        const count = isArray ? val.length : 1;
        if (count > 1) {
             if (newComparison === '=' || newComparison === '!=' || newComparison === undefined) {
                 newComparison = newComparison === '!=' ? '!~' : 'Contains';
             }
        }
    }

    if (field === 'Comparison') {
        newComparison = getOpValue(val as string);
        if (!['Contains', '!~', 'ContainsAny', 'NotContainsAny'].includes(newComparison)) {
             if (Array.isArray(node.condition.Right)) {
                 const first = node.condition.Right[0] || '';
                 onChange({ ...node, condition: { ...node.condition, Right: first, Comparison: newComparison } });
                 return;
             }
        }
    }

    onChange({ ...node, condition: { ...node.condition, [field]: val, Comparison: newComparison } });
  };

  const isMultiValue = (op: ComparisonType) => {
      return ['Contains', '!~', 'ContainsAny', 'NotContainsAny'].includes(op);
  };

  const operatorOptions = Object.values(OPERATOR_CONFIG).map(c => c.label);
  const currentOpLabel = getOpLabel(node.condition?.Comparison || '=');
  const logicOptions = Object.values(LOGIC_CONFIG);
  const currentLogicLabel = LOGIC_CONFIG[node.type] || node.type;

  return (
    <div className={`relative ${!isRoot ? 'ml-4 pl-4 border-l border-gray-300' : ''}`}>
      
      {/* Header Row: Logic Type & Actions */}
      <div className="flex items-center gap-2 mb-2 h-8">
         
         {/* Logic Dropdown: Solid Carbon Style */}
         <div className="relative group">
             <div className="flex items-center justify-between gap-4 text-xs text-gray-800 bg-gray-100 hover:bg-gray-200 border-b border-gray-400 px-3 h-8 cursor-pointer transition-colors select-none min-w-[140px]">
                 <span className="font-medium">{currentLogicLabel}</span>
                 <IconChevronDown />
             </div>
             <select 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                value={currentLogicLabel}
                onChange={(e) => handleTypeChange(e.target.value)}
             >
                 {logicOptions.map(l => <option key={l} value={l}>{l}</option>)}
             </select>
         </div>

         {/* Delete Button */}
         {!isRoot && onDelete && (
             <button 
                onClick={onDelete} 
                className="carbon-icon-btn carbon-icon-btn-danger w-8 h-8 text-gray-500 hover:text-red-600" 
                title="Delete"
             >
                 <IconTrash />
             </button>
         )}
      </div>

      <div className="">
        {node.type === 'Condition' && node.condition && (
          // Carbon Input Group: 32px height
          <div className="flex items-stretch border border-gray-300 bg-white h-8 w-full shadow-sm hover:border-gray-500 transition-colors group">
             
             {/* Property (Left) */}
             <div className="flex-1 min-w-[140px] border-r border-gray-200 bg-gray-50 group-hover:bg-white transition-colors">
               <SmartSelect 
                  value={node.condition.Left}
                  onChange={(v) => updateCondition('Left', v)}
                  options={vocab.properties}
                  placeholder="Property"
                  allowCustom={true} 
                  immediate={true}
                  className="w-full h-full px-3"
                  inputClassName="bg-transparent text-sm text-gray-900 font-mono placeholder:text-gray-500"
               />
             </div>
             
             {/* Operator */}
             <div className="flex-none w-[110px] border-r border-gray-200 bg-white">
               <SmartSelect
                  value={currentOpLabel}
                  onChange={(v) => updateCondition('Comparison', v)}
                  options={operatorOptions}
                  allowCustom={false} 
                  immediate={true}
                  placeholder="Op"
                  className="w-full h-full px-2"
                  inputClassName="w-full text-center bg-transparent text-xs font-semibold text-gray-600 cursor-pointer"
               />
             </div>
             
             {/* Value (Right) */}
             <div className="flex-[1.5] min-w-[140px] bg-white">
               <SmartSelect 
                  value={node.condition.Right}
                  onChange={(v) => updateCondition('Right', v)}
                  options={[...vocab.types, 'true', 'false']}
                  placeholder="Value"
                  allowCustom={true} 
                  immediate={true}
                  isMulti={isMultiValue(node.condition.Comparison)} 
                  className="w-full h-full px-3"
                  inputClassName="bg-transparent text-sm text-gray-900 font-mono placeholder:text-gray-400"
               />
             </div>
          </div>
        )}

        {node.type === 'HasAccessTo' && (
          <div className="flex items-center gap-4 p-3 bg-white border border-gray-300 shadow-sm">
             <div className="flex flex-col flex-1 gap-1">
                <label className="text-xs text-gray-500">Inherit from property</label>
                <div className="border-b border-gray-300 bg-gray-50 h-8">
                    <SmartSelect 
                    value={node.accessReference || ''}
                    onChange={(v) => onChange({ ...node, accessReference: Array.isArray(v) ? v[0] : v })}
                    options={vocab.properties}
                    placeholder="e.g. resource.parent"
                    allowCustom={true}
                    immediate={true}
                    className="w-full h-full px-2"
                    inputClassName="bg-transparent text-sm font-mono"
                    />
                </div>
            </div>
            <div className="w-[1px] h-8 bg-gray-200"></div>
            <div className="flex flex-col flex-1 gap-1">
                <label className="text-xs text-gray-500">Required Role (Optional)</label>
                <div className="border-b border-gray-300 bg-gray-50 h-8">
                    <SmartSelect 
                    value={node.accessRole || ''}
                    onChange={(v) => onChange({ ...node, accessRole: Array.isArray(v) ? v[0] : v })}
                    options={vocab.roles}
                    placeholder="Any role"
                    allowCustom={false}
                    className="w-full h-full px-2"
                    inputClassName="bg-transparent text-sm"
                    />
                </div>
            </div>
          </div>
        )}

        {(node.type === 'All' || node.type === 'Any') && (
          <div className="flex flex-col gap-2">
            {node.children?.map((child, idx) => (
              <ResourceEditor 
                key={child.id}
                node={child}
                vocab={vocab}
                onChange={(newChild) => {
                  if (!node.children) return;
                  const n = [...node.children]; n[idx] = newChild;
                  onChange({ ...node, children: n });
                }}
                onDelete={() => {
                   if (!node.children) return;
                   onChange({ ...node, children: node.children.filter((_, i) => i !== idx) });
                }}
              />
            ))}
            
            <div className="ml-4 mt-1">
                <button 
                onClick={() => onChange({...node, children: [...(node.children||[]), createDefaultCondition()]})}
                className="carbon-btn carbon-btn-ghost h-8 text-xs px-2"
                >
                <IconAdd /> <span className="ml-2">Add Condition</span>
                </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};