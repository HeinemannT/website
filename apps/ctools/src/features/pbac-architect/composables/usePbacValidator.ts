import type { Policy, ResourceNode } from '../types'

export type IssueSeverity = 'Error' | 'Warning' | 'Info'

export interface ValidationIssue {
    id: string;
    severity: IssueSeverity;
    message: string;
    path: string[];
    statementId?: string;
    nodeId?: string;
}

const isMultiValue = (op: string) => {
    return ['Contains', '!~', 'ContainsAny', 'NotContainsAny'].includes(op)
}

export function usePbacValidator() {

    const validateResourceNode = (
        node: ResourceNode,
        issues: ValidationIssue[],
        path: string[],
        stmtId: string,
        parentNodeType?: ResourceNode['type']
    ) => {

        // Condition Logic
        if (node.type === 'Condition') {
            if (!node.condition) {
                issues.push({
                    id: `n-${node.id}-empty-cond`,
                    severity: 'Error',
                    message: 'Condition Node data is missing.',
                    path,
                    statementId: stmtId,
                    nodeId: node.id
                })
                return
            }

            const { Left, Comparison, Right } = node.condition

            if (!Left || Left.trim() === '') {
                issues.push({
                    id: `n-${node.id}-no-prop`,
                    severity: 'Error',
                    message: 'Property (Left) is missing.',
                    path,
                    statementId: stmtId,
                    nodeId: node.id
                })
            }

            if (isMultiValue(Comparison)) {
                // Expecting Array
                if (!Array.isArray(Right)) {
                    issues.push({
                        id: `n-${node.id}-type-mismatch-array`,
                        severity: 'Error',
                        message: `Operator '${Comparison}' requires a list of values (Array), but got a single value.`,
                        path,
                        statementId: stmtId,
                        nodeId: node.id
                    })
                } else if (Right.length === 0) {
                    issues.push({
                        id: `n-${node.id}-empty-array`,
                        severity: 'Error',
                        message: `Value list for '${Comparison}' is empty.`,
                        path,
                        statementId: stmtId,
                        nodeId: node.id
                    })
                }
            } else {
                // Expecting Single (usually)
                if (Array.isArray(Right)) {
                    issues.push({
                        id: `n-${node.id}-type-mismatch-single`,
                        severity: 'Warning',
                        message: `Operator '${Comparison}' typically expects a single value, but got a list.`,
                        path,
                        statementId: stmtId,
                        nodeId: node.id
                    })
                }
            }
        }

        // Group Logic
        if (node.type === 'All' || node.type === 'Any') {
            const children = node.children || []

            if (children.length === 0) {
                issues.push({
                    id: `n-${node.id}-empty-group`,
                    severity: 'Warning',
                    message: `Group (${node.type}) has no conditions.`,
                    path,
                    statementId: stmtId,
                    nodeId: node.id
                })
            } else if (children.length === 1) {
                issues.push({
                    id: `n-${node.id}-single-child`,
                    severity: 'Warning',
                    message: `Group (${node.type}) has only one child. It can likely be flattened.`,
                    path,
                    statementId: stmtId,
                    nodeId: node.id
                })
            }

            // Redundant Nesting
            if (parentNodeType === node.type) {
                issues.push({
                    id: `n-${node.id}-redundant-nesting`,
                    severity: 'Warning',
                    message: `Redundant Nesting: ${node.type} inside ${parentNodeType}.`,
                    path,
                    statementId: stmtId,
                    nodeId: node.id
                })
            }

            children.forEach((child, idx) => {
                validateResourceNode(child, issues, [...path, `${node.type} [${idx + 1}]`], stmtId, node.type)
            })
        }

        // Inheritance Logic
        if (node.type === 'HasAccessTo') {
            if (!node.accessReference || node.accessReference.trim() === '') {
                issues.push({
                    id: `n-${node.id}-no-ref`,
                    severity: 'Error',
                    message: 'Inheritance Reference (e.g. resource.parent) is missing.',
                    path,
                    statementId: stmtId,
                    nodeId: node.id
                })
            }
        }
    }

    const validatePolicy = (policy: Policy): ValidationIssue[] => {
        const issues: ValidationIssue[] = []

        // 1. Policy Level Checks
        if (!policy.Statements || policy.Statements.length === 0) {
            issues.push({
                id: 'policy-empty',
                severity: 'Error',
                message: 'Policy must have at least one Access Rule.',
                path: ['Policy']
            })
        }

        if (policy.name === 'New Access Policy') {
            issues.push({
                id: 'policy-default-name',
                severity: 'Info',
                message: 'Policy is using the default name.',
                path: ['Policy', 'Name']
            })
        }

        // 2. Statement Level Checks
        policy.Statements.forEach((stmt, sIdx) => {
            const sPath = [`Rule #${sIdx + 1}`]

            // Empty Lists
            if (stmt.Subject.length === 0) {
                issues.push({
                    id: `s-${stmt.id}-no-subj`,
                    severity: 'Warning',
                    message: 'Subject list is empty.',
                    path: [...sPath, 'Subjects'],
                    statementId: stmt.id
                })
            }

            stmt.Subject.forEach(sub => {
                if (!sub.startsWith('role:') && !sub.startsWith('u.')) {
                    issues.push({
                        id: `s-${stmt.id}-subj-syntax-${sub}`,
                        severity: 'Info',
                        message: `Subject '${sub}' does not follow naming conventions.`,
                        path: [...sPath, 'Subjects', sub],
                        statementId: stmt.id
                    })
                }
            })

            if (stmt.Action.length === 0) {
                issues.push({
                    id: `s-${stmt.id}-no-action`,
                    severity: 'Warning',
                    message: 'No Actions selected.',
                    path: [...sPath, 'Actions'],
                    statementId: stmt.id
                })
            }

            // Recursively validate Resource
            validateResourceNode(stmt.Resource, issues, [...sPath, 'Resources'], stmt.id)
        })

        return issues
    }

    return {
        validatePolicy
    }
}
