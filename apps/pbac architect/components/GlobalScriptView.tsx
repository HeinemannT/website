import React, { useMemo } from 'react';
import { FileSystemItem, Policy, Category } from '../types';
import { IconCopy } from '../icons';
import { generateExtendedCodeFragment } from '../utils';

interface GlobalScriptViewProps {
    items: FileSystemItem[];
}

export const GlobalScriptView: React.FC<GlobalScriptViewProps> = ({ items }) => {
  const generateTreeScript = (nodes: FileSystemItem[], parentVar: string, level: number): string => {
      let script = "";
      nodes.forEach((item, index) => {
          if (item.itemType === 'Category') {
              const currentVar = level === 0 && index === 0 ? '_cat' : `_cat_${level}_${index}`;
              script += `${currentVar} := ${parentVar}.add(Category, id := '${item.id}', name := '${item.name}');\n`;
              script += generateTreeScript(item.children, currentVar, level + 1);
          } else {
              script += generateExtendedCodeFragment(item as Policy, { type: 'variable', value: parentVar }) + ";\n";
          }
      });
      return script;
  };

  const script = useMemo(() => {
    let output = "// --- Corporater PBAC Setup Script ---\n";
    // Using root.accesspolicy as the base anchor, aligned with provided example
    output += `root_cat := root.accesspolicy.add(Category, id := 'PBAC_Root', name := 'PBAC Configuration', description := 'Generated on ${new Date().toISOString()}');\n\n`;
    output += generateTreeScript(items, 'root_cat', 0);
    output += `\nreturn "Deployed policies to PBAC_Root";`;
    return output;
  }, [items]);

  return (
    <div className="h-full flex flex-col p-6 bg-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-light text-gray-800">Global Installation Script</h2>
        <button className="carbon-btn carbon-btn-primary" onClick={() => navigator.clipboard.writeText(script)}><IconCopy /> <span className="ml-2">Copy Extended Code</span></button>
      </div>
      <div className="flex-1 border border-gray-300 bg-gray-50 overflow-hidden relative">
        <textarea readOnly className="w-full h-full p-4 font-mono text-xs resize-none focus:outline-none text-gray-700 leading-relaxed" value={script}/>
      </div>
    </div>
  );
};