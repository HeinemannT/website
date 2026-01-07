import { ScriptBuilder } from '@utils/ScriptBuilder'
import { gzipAndBase64Async, chunkString } from '@utils/gzip'
import type { ResourceNode, Statement, Policy, Category } from '../types'

export const generateId = () => Math.random().toString(36).substr(2, 9)

export const createDefaultCondition = (): ResourceNode => ({
    id: generateId(),
    type: 'Condition',
    condition: { Left: 'resource.type', Comparison: '=', Right: 'CeAsset' }
})

export const createDefaultStatement = (): Statement => ({
    id: generateId(),
    Subject: ['role:roleBasic'],
    Effect: 'Allow',
    Action: ['Read'],
    Resource: createDefaultCondition()
})

export const createDefaultPolicy = (): Policy => ({
    id: generateId(),
    itemType: 'Policy',
    name: 'New Access Policy',
    Version: '1.0',
    Statements: [createDefaultStatement()]
})

export const createDefaultCategory = (name = "New Folder"): Category => ({
    id: generateId(),
    itemType: 'Category',
    name: name,
    children: [],
    collapsed: false
})

export const resourceNodeToJson = (node: ResourceNode): any => {
    if (node.type === 'Condition' && node.condition) {
        let rightVal: any = node.condition.Right

        // Parse if it's a string looking like an array, or keep as is if it's already an array
        if (typeof rightVal === 'string') {
            const trimmed = rightVal.trim()
            if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
                try { rightVal = JSON.parse(trimmed.replace(/'/g, '"')) }
                catch { rightVal = trimmed.slice(1, -1).split(',').map((s: string) => s.trim().replace(/['"]/g, '')) }
            } else if (rightVal === 'true') rightVal = true
            else if (rightVal === 'false') rightVal = false
            else if (!isNaN(Number(rightVal)) && rightVal !== '') rightVal = Number(rightVal)
        }

        return { Condition: { Left: node.condition.Left, Comparison: node.condition.Comparison, Right: rightVal } }
    }
    if (node.type === 'HasAccessTo') {
        if (node.accessReference && !node.accessRole && !node.accessAction && !node.accessGrouping) {
            return { HasAccessTo: node.accessReference }
        }
        const obj: any = { Reference: node.accessReference || 'resource.parent' }
        if (node.accessRole) {
            if (node.accessRole.includes(',') || node.accessRole.startsWith('[')) {
                obj.Roles = node.accessRole.replace(/[\[\]"]/g, '').split(',').map(s => s.trim())
            } else { obj.Role = node.accessRole }
        }
        if (node.accessAction) obj.Action = node.accessAction
        if (node.accessGrouping) obj.Grouping = node.accessGrouping
        return { HasAccessTo: obj }
    }
    if (node.type === 'All') return { All: node.children?.map(resourceNodeToJson) || [] }
    if (node.type === 'Any') return { Any: node.children?.map(resourceNodeToJson) || [] }
    return {}
}

export const policyToJson = (policy: Policy) => {
    return {
        Version: policy.Version,
        Statement: policy.Statements.map(stmt => ({
            Subject: stmt.Subject,
            Effect: stmt.Effect,
            Action: stmt.Action,
            Resource: resourceNodeToJson(stmt.Resource)
        }))
    }
}

export const jsonToResourceNode = (json: any): ResourceNode => {
    const id = generateId()
    if (json.All) return { id, type: 'All', children: json.All.map(jsonToResourceNode) }
    if (json.Any) return { id, type: 'Any', children: json.Any.map(jsonToResourceNode) }
    if (json.HasAccessTo) {
        if (typeof json.HasAccessTo === 'string') return { id, type: 'HasAccessTo', accessReference: json.HasAccessTo }
        return {
            id, type: 'HasAccessTo',
            accessReference: json.HasAccessTo.Reference,
            accessRole: json.HasAccessTo.Roles ? json.HasAccessTo.Roles.join(', ') : json.HasAccessTo.Role,
            accessAction: json.HasAccessTo.Action,
            accessGrouping: json.HasAccessTo.Grouping
        }
    }
    if (json.Condition) {
        const c = json.Condition
        let rightVal = c.Right
        if (typeof rightVal === 'number' || typeof rightVal === 'boolean') rightVal = String(rightVal)

        return { id, type: 'Condition', condition: { Left: c.Left, Comparison: c.Comparison, Right: rightVal } }
    }
    return { id, type: 'Condition', condition: { Left: 'error', Comparison: '=', Right: 'unknown' } }
}

export const jsonToPolicy = (jsonString: string, currentId: string, currentName: string): Policy | null => {
    try {
        const obj = JSON.parse(jsonString)
        if (!obj || typeof obj !== 'object') return null
        const stmts: Statement[] = (obj.Statement || []).map((s: any) => ({
            id: generateId(),
            Subject: s.Subject || [],
            Effect: s.Effect || 'Allow',
            Action: s.Action || [],
            Resource: s.Resource ? jsonToResourceNode(s.Resource) : createDefaultCondition()
        }))
        return { id: currentId, itemType: 'Policy', name: currentName, Version: obj.Version || '1.0', Statements: stmts }
    } catch (e) { return null }
}

export const usePbacUtils = () => {
    const generateScript = async (policy: Policy, parentId: string) => {
        const jsonObj = policyToJson(policy)

        // 1. contentAsString (JSON)
        // Needs to be escaped strictly for Extended string
        const jsonStr = JSON.stringify(jsonObj, null, 4)
        const escapedJson = jsonStr
            .replace(/\\/g, '\\\\')   // Escape backslashes first
            .replace(/'/g, "\\'")     // Escape single quotes
            .replace(/\n/g, "\\n")   // Literal newline chars

        // 2. configuration (Base64)
        const base64 = await gzipAndBase64Async(new TextEncoder().encode(JSON.stringify(jsonObj)))
        const configString = `${policy.name};application/json;${chunkString(base64, 76)}`

        const sb = new ScriptBuilder(`PBAC Policy: ${policy.name}`)
        sb.assignTarget('targetFolder', parentId)
        sb.addNewLine()

        sb.assignAdd('_pol', 'targetFolder', 'AccessPolicy', {
            id: policy.id,
            name: policy.name,
            configuration: configString,
            contentAsString: escapedJson
        })

        return sb.toString()
    }

    const generateTreeScript = async (nodes: any[], parentVar: string = 'root_cat', level: number = 0): Promise<string> => {
        const sb = new ScriptBuilder()

        for (let i = 0; i < nodes.length; i++) {
            const item = nodes[i]
            if (item.itemType === 'Category') {
                const currentVar = level === 0 && i === 0 ? '_cat' : `_cat_${level}_${i}`
                sb.add(`${currentVar} := ${parentVar}.add(Category, id := '${item.id}', name := '${item.name}');`)

                // Recurse
                if (item.children && item.children.length > 0) {
                    const childrenScript = await generateTreeScript(item.children, currentVar, level + 1)
                    // Split and add lines to maintain indentation if needed, or just add raw
                    childrenScript.split('\n').forEach(line => {
                        if (line.trim()) sb.add(line)
                    })
                }
            } else {
                // Policy
                const policyScript = await generateScript(item, parentVar)
                sb.add(policyScript + ';')
            }
        }
        return sb.toString()
    }

    const generateGlobalScript = async (items: any[]) => {
        const sb = new ScriptBuilder()
        sb.addComment('--- Corporater PBAC Setup Script ---')
        sb.add(`root_cat := root.accesspolicy.add(Category, id := 'PBAC_Root', name := 'PBAC Configuration', description := 'Generated on ${new Date().toISOString()}');`)
        sb.addNewLine()

        const treeScript = await generateTreeScript(items, 'root_cat')
        // Add lines individually
        treeScript.split('\n').forEach(line => {
            if (line) sb.add(line)
        })

        sb.addNewLine()
        sb.add('return "Deployed policies to PBAC_Root";')

        return sb.toString()
    }

    return {
        generateId,
        createDefaultCategory,
        createDefaultPolicy,
        policyToJson,
        generateScript,
        generateTreeScript,
        generateGlobalScript
    }
}
