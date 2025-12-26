import { GlobalProperty, AppNode, ListPropertySet } from '../types';
import { ScriptBuilder, raw } from './ScriptBuilder';

export const generateCorporaterScript = (
    nodes: AppNode[],
    globalProperties: GlobalProperty[],
    listSets: ListPropertySet[]
): string => {
    const builder = new ScriptBuilder(`Corporater Visual Architect - Generated Specification\nGenerated: ${new Date().toISOString()}`);

    const toVar = (str: string) => '_' + str.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();

    // --- Dependency Calculation ---
    const usedPropertyIds = new Set<string>();
    nodes.forEach(node => {
        node.data.linkedProperties.forEach(pid => usedPropertyIds.add(pid));
    });

    const usedProperties = globalProperties.filter(p => usedPropertyIds.has(p.id));

    const usedListIds = new Set<string>();
    usedProperties.forEach(p => {
        if (p.config.listId) usedListIds.add(p.config.listId);
    });

    const usedListSets = listSets.filter(l => usedListIds.has(l.id));

    // --- 1. LISTS ---
    if (usedListSets.length > 0) {
        builder.addComment('--- LIST PROPERTY SETS ---');
        builder.define('_cat_lists', 'root.portal', 'add', 'Category', { id: 'generated_lists', name: 'Generated Lists' });
        builder.addNewLine();

        usedListSets.forEach(list => {
            const listVar = toVar(list.id);
            builder.define(listVar, '_cat_lists', 'add', 'ListPropertySet', { id: list.id, name: list.name });

            builder.indent();
            list.items.forEach(item => {
                builder.call(listVar, 'add', 'ListPropertySetItem', { id: item.id, name: item.name });
            });
            builder.outdent();
            builder.addNewLine();
        });
    }

    // --- 2. PROPERTIES ---
    if (usedProperties.length > 0) {
        builder.addComment('--- GLOBAL PROPERTIES ---');
        builder.addNewLine();

        usedProperties.forEach(prop => {
            const propVar = toVar(prop.id);
            const params: Record<string, any> = {
                id: prop.id,
                name: prop.name,
                category: 'General Information'
            };

            // Type Specific Config
            if (prop.type.includes('Number')) {
                params.decimalPlaces = prop.config.decimalPlaces ?? 0;
                if (prop.config.formatPostfix) params.formatPostfix = prop.config.formatPostfix;
            }

            if (prop.type.includes('List') && prop.config.listId) {
                params.listPropertySet = raw(toVar(prop.config.listId));
                params.allowBlank = true;
            }

            if (prop.type.includes('Reference') || prop.type.includes('Reverse')) {
                params.advanced = true;
                params.allowBlank = true;

                if (prop.config.targetClass) {
                    const isMulti = prop.config.multiSelect;

                    if (prop.config.targetClass.toLowerCase() === 'user') {
                        params.expression = 'select User from root.user';
                    } else if (prop.type.includes('Reverse')) {
                        params.filter = raw(`filter(${prop.config.targetClass}, *everywhere)`);
                    } else {
                        params.expression = `select ${prop.config.targetClass} from root.${prop.config.targetClass}`;
                    }

                    if (isMulti && !prop.type.includes('Reverse')) {
                        params.multiselect = true;
                    }

                    if (prop.config.targetClass.toLowerCase() !== 'user' && !prop.type.includes('Reverse')) {
                        params.listDisplayType = 'FLAT_LIST';
                    }
                }
            }

            if (prop.type === 'ExtendedMethodConfig' && prop.config.expression) {
                params.expression = prop.config.expression;
            }

            builder.define(propVar, 'root.property', 'add', prop.type, params);
        });
        builder.addNewLine();
    }

    // --- 3. OBJECT LINKING ---
    if (nodes.length > 0) {
        builder.addComment('--- OBJECT CONFIGURATION & LINKING ---');
        builder.addNewLine();

        nodes.forEach(node => {
            if (node.data.linkedProperties.length > 0) {
                builder.addComment(`Link Properties for: ${node.data.label} (${node.data.className})`);

                node.data.linkedProperties.forEach(pid => {
                    const exists = usedProperties.find(p => p.id === pid);
                    if (exists) {
                        const propVar = toVar(pid);
                        builder.expression(`c.get(${node.data.className}.name)`, 'link', raw(propVar));
                    }
                });
                builder.addNewLine();
            }
        });
    }

    return builder.toString();
};