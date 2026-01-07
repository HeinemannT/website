import React from 'react';
import { Statement, Vocabulary, ActionType } from '../types';
import { SmartSelect } from './SmartSelect';
import { ResourceEditor } from './ResourceEditor';
import { IconTrash, IconCheck } from '../icons';

interface StatementRowProps {
    stmt: Statement;
    onChange: (s: Statement) => void;
    onDelete: () => void;
    vocab: Vocabulary;
}

export const StatementRow: React.FC<StatementRowProps> = ({ stmt, onChange, onDelete, vocab }) => {
    const handleUpdateSubjects = (val: string | string[]) => {
        const newSubjects = Array.isArray(val) ? val : [val];
        onChange({ ...stmt, Subject: newSubjects });
    };

    const toggleAction = (action: ActionType) => {
        const hasAction = stmt.Action.includes(action);
        const newActions = hasAction ? stmt.Action.filter(a => a !== action) : [...stmt.Action, action];
        onChange({ ...stmt, Action: newActions });
    };

    const isAllow = stmt.Effect === 'Allow';

    return (
        <div className="bg-white border border-gray-300 shadow-sm mb-4">
            
            {/* 1. Header: Effect & Controls */}
            <div className={`flex items-center justify-between px-3 h-10 border-b border-gray-200 ${isAllow ? 'bg-white' : 'bg-red-50'}`}>
                <div className="flex items-center gap-4">
                    
                    {/* Carbon-style Toggle (Small 24px) */}
                    <div className="flex items-center rounded-sm overflow-hidden border border-gray-300 bg-gray-100">
                        <button 
                            onClick={() => onChange({ ...stmt, Effect: 'Allow' })} 
                            className={`px-3 h-6 text-xs font-medium transition-colors ${isAllow ? 'bg-green-700 text-white' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            Allow
                        </button>
                        <div className="w-[1px] h-4 bg-gray-300"></div>
                        <button 
                            onClick={() => onChange({ ...stmt, Effect: 'Deny' })} 
                            className={`px-3 h-6 text-xs font-medium transition-colors ${!isAllow ? 'bg-red-600 text-white' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            Deny
                        </button>
                    </div>
                    
                    <span className="text-xs text-gray-500">Access Rule</span>
                </div>
                
                <button 
                    onClick={onDelete} 
                    className="carbon-icon-btn carbon-icon-btn-danger w-8 h-8" 
                    title="Delete Rule"
                >
                    <IconTrash />
                </button>
            </div>
            
            {/* 2. Body: WHO and WHAT */}
            <div className="flex flex-col md:flex-row">
                
                {/* Roles (Who) */}
                <div className="flex-1 p-3 border-b md:border-b-0 md:border-r border-gray-200">
                    <label className="block text-xs text-gray-600 mb-1">Roles (Who)</label>
                    <div className="w-full bg-gray-50 border-b border-gray-400 hover:bg-gray-100 transition-colors">
                        <SmartSelect 
                           value={stmt.Subject} 
                           onChange={handleUpdateSubjects} 
                           options={vocab.roles} 
                           placeholder="Select roles..."
                           isMulti={true}
                           allowCustom={false}
                           className="w-full"
                           inputClassName="bg-transparent text-sm text-gray-900 placeholder:text-gray-400"
                        />
                    </div>
                </div>

                {/* Permissions (What) */}
                <div className="flex-1 p-3">
                    <label className="block text-xs text-gray-600 mb-1">Permissions (What)</label>
                    <div className="flex flex-wrap gap-[-1px]">
                        {['Read', 'Update', 'Create', 'Delete'].map(act => {
                            const isActive = stmt.Action.includes(act as ActionType);
                            // Carbon Selectable Tile style
                            return (
                                <button 
                                    key={act} 
                                    onClick={() => toggleAction(act as ActionType)} 
                                    className={`
                                        flex items-center gap-2 px-3 h-8 text-sm border -ml-[1px] first:ml-0 transition-colors
                                        ${isActive 
                                            ? 'bg-blue-100 border-blue-600 text-blue-800 z-10' 
                                            : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200'}
                                    `}
                                >
                                    {isActive && <IconCheck />}
                                    {act}
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* 3. Footer: WHERE (Conditions) */}
            <div className="px-3 py-3 border-t border-gray-200 bg-gray-50/30">
                 <label className="block text-xs text-gray-600 mb-2">Conditions (Where)</label>
                 <div className="pl-0">
                    <ResourceEditor node={stmt.Resource} vocab={vocab} onChange={(newNode) => onChange({ ...stmt, Resource: newNode })} isRoot={true} />
                 </div>
            </div>
        </div>
    );
};