import { NodeData, ValidationIssue } from '../types';

export const validateNode = (data: NodeData): ValidationIssue[] => {
    const issues: ValidationIssue[] = [];
    
    // Skip validation for non-enterprise (cosmetic) nodes
    if (!data.isEnterprise) {
        return issues;
    }

    if (!data.className || data.className.length < 2) {
        issues.push({ type: 'error', message: 'Class Name required.' });
    }
    return issues;
};