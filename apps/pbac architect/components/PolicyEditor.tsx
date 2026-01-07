import React from 'react';
import { Policy, Vocabulary, Statement } from '../types';
import { IconAdd } from '../icons';
import { StatementRow } from './StatementRow';
import { createDefaultStatement } from '../utils';

interface PolicyEditorProps {
    policy: Policy;
    vocab: Vocabulary;
    onChange: (updatedPolicy: Policy) => void;
}

export const PolicyEditor: React.FC<PolicyEditorProps> = ({ policy, vocab, onChange }) => {
    
    const updateStatement = (idx: number, newStmt: Statement) => {
        const newStmts = [...policy.Statements];
        newStmts[idx] = newStmt;
        onChange({ ...policy, Statements: newStmts });
    };

    const addStatement = () => {
        onChange({
            ...policy,
            Statements: [...policy.Statements, createDefaultStatement()]
        });
    };

    const deleteStatement = (idx: number) => {
        const newStmts = policy.Statements.filter((_, i) => i !== idx);
        onChange({ ...policy, Statements: newStmts });
    };

    return (
        <div className="flex flex-col h-full">
            {/* Header / Meta Data */}
            <div className="px-6 py-4 border-b border-gray-200 bg-white sticky top-0 z-10 flex items-end gap-6 shadow-sm">
                <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">Policy Name</label>
                    <input 
                        value={policy.name} 
                        onChange={(e) => onChange({ ...policy, name: e.target.value })} 
                        className="text-xl font-light text-gray-900 bg-transparent border-none outline-none w-full placeholder-gray-300" 
                        placeholder="Enter Policy Name"
                    />
                </div>
                <div className="w-24 shrink-0">
                    <label className="block text-xs text-gray-500 mb-1 text-right">Version</label>
                    <input 
                        value={policy.Version} 
                        onChange={(e) => onChange({ ...policy, Version: e.target.value })} 
                        className="w-full bg-[#f4f4f4] border-b border-gray-500 focus:border-blue-600 outline-none px-2 py-1 text-sm text-right font-mono"
                        placeholder="1.0"
                    />
                </div>
            </div>

            {/* Statements List */}
            <div className="p-4 space-y-4 pb-20 overflow-y-auto">
                {policy.Statements.map((stmt, idx) => (
                    <StatementRow 
                        key={stmt.id} 
                        stmt={stmt} 
                        vocab={vocab}
                        onChange={(newStmt) => updateStatement(idx, newStmt)}
                        onDelete={() => deleteStatement(idx)}
                    />
                ))}
                
                <button 
                    onClick={addStatement} 
                    className="carbon-btn carbon-btn-ghost w-full border border-dashed border-gray-300 text-gray-500 h-8 text-xs hover:border-blue-500 hover:text-blue-600 transition-colors"
                >
                    <IconAdd /> <span className="ml-2">Add Access Rule</span>
                </button>
            </div>
        </div>
    );
};