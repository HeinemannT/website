import { ScriptBuilder } from '@utils/ScriptBuilder'
import { gzipAndBase64Async, chunkString, base64AndGunzip } from '@utils/gzip'
import type { ResourceNode, Statement, Policy, Category, FileSystemItem, Vocabulary } from '../types'

/* -------------------------------------------------------------------------- */
/*                               ID & FACTORIES                               */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/*                            CONVERTERS (JSON)                               */
/* -------------------------------------------------------------------------- */

export const resourceNodeToJson = (node: ResourceNode): any => {
    if (node.type === 'Condition' && node.condition) {
        let rightVal: any = node.condition.Right

        // Auto-detect array-like strings or booleans
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

/* -------------------------------------------------------------------------- */
/*                            SCRIPT GENERATION                               */
/* -------------------------------------------------------------------------- */

export const generateScript = async (policy: Policy, parentId: string) => {
    const jsonObj = policyToJson(policy)

    // 1. contentAsString (JSON)
    const jsonStr = JSON.stringify(jsonObj, null, 4)
    const escapedJson = jsonStr
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'")
        .replace(/\n/g, "\\n")

    // 2. configuration (Base64)
    const base64 = await gzipAndBase64Async(new TextEncoder().encode(JSON.stringify(jsonObj)))
    const configString = `${policy.name};application/json;${chunkString(base64, 76)}`

    return `${parentId}.add(AccessPolicy, id := '${policy.id}', name := '${policy.name}', configuration := '${configString}', contentAsString := '${escapedJson}')`
}

export const generateTreeScript = async (nodes: any[], parentVar: string = 'root_cat', level: number = 0): Promise<string> => {
    const sb = new ScriptBuilder()

    for (let i = 0; i < nodes.length; i++) {
        const item = nodes[i]
        if (item.itemType === 'Category') {
            const currentVar = level === 0 && i === 0 ? '_cat' : `_cat_${level}_${i}`
            sb.add(`${currentVar} := ${parentVar}.add(Category, id := '${item.id}', name := '${item.name}');`)

            if (item.children && item.children.length > 0) {
                const childrenScript = await generateTreeScript(item.children, currentVar, level + 1)
                childrenScript.split('\n').forEach(line => { if (line.trim()) sb.add(line) })
            }
        } else {
            const policyScript = await generateScript(item, parentVar)
            sb.add(policyScript + ';')
        }
    }
    return sb.toString()
}

export const generateGlobalScript = async (items: any[]) => {
    const sb = new ScriptBuilder()
    sb.addComment('--- Corporater PBAC Setup Script ---')
    sb.add(`root_cat := root.accesspolicy.add(Category, id := 'PBAC_Root', name := 'PBAC Configuration', description := 'Generated on ${new Date().toISOString()}');`)
    sb.addNewLine()

    const treeScript = await generateTreeScript(items, 'root_cat')
    treeScript.split('\n').forEach(line => { if (line) sb.add(line) })

    sb.addNewLine()
    sb.add('return "Deployed policies to PBAC_Root";')
    return sb.toString()
}

/* -------------------------------------------------------------------------- */
/*                            SCRIPT PARSING (NEW)                            */
/* -------------------------------------------------------------------------- */

export interface ImportResult {
    items: FileSystemItem[]
    vocab: Partial<Vocabulary>
    count: number
}

// Helper: recursive vocab extract
export const extractVocabulary = (policies: Policy[]): Partial<Vocabulary> => {
    const roles = new Set<string>()
    const properties = new Set<string>()
    const types = new Set<string>()

    const traverse = (node: ResourceNode) => {
        if (node.type === 'Condition' && node.condition) {
            properties.add(node.condition.Left)
            if (node.condition.Left === 'resource.type' || node.condition.Left === 'new.type') {
                const r = node.condition.Right
                if (Array.isArray(r)) r.forEach(x => types.add(String(x)))
                else types.add(String(r))
            }
        }
        if (node.children) node.children.forEach(traverse)
    }

    policies.forEach(p => {
        p.Statements.forEach(s => {
            s.Subject.forEach(sub => roles.add(sub))
            traverse(s.Resource)
        })
    })

    return {
        roles: Array.from(roles),
        properties: Array.from(properties),
        types: Array.from(types)
    }
}

/**
 * Universal Parser: Script, JSON, Base64
 */
/**
 * Universal Parser: Script, JSON, Base64
 */
export const parseScriptImport = async (input: string): Promise<ImportResult> => {
    const cleanInput = input.trim()

    // 1. Single Item Fallback (Raw JSON or pure Base64)
    if (cleanInput.startsWith('{') || cleanInput.startsWith('H4sI')) {
        let policy: Policy | null = null
        if (cleanInput.startsWith('{')) {
            policy = jsonToPolicy(cleanInput, generateId(), 'Imported Policy')
        } else {
            // Raw Base64
            try {
                const json = await base64AndGunzip(cleanInput)
                policy = jsonToPolicy(json, generateId(), 'Imported Base64')
            } catch (e) { console.warn('Single Base64 decode failed', e) }
        }

        if (policy) {
            return { items: [policy], vocab: extractVocabulary([policy]), count: 1 }
        }
    }

    // 2. Full Script Parsing
    const rootItems: FileSystemItem[] = []
    const variableMap = new Map<string, Category>()
    const policies: Policy[] = []

    // Helper: Find parent container
    const getParent = (parentVar: string): Category['children'] => {
        if (variableMap.has(parentVar)) return variableMap.get(parentVar)!.children
        return rootItems
    }

    // Regex to iterate over .add(...) commands
    // Capture: 1=assignVar, 2=parentVar, 3=Type(Category|AccessPolicy), 4=Args
    const commandRegex = /(?:(\w+)\s*:=\s*)?([\w\.]+)\.add\((Category|AccessPolicy)([\s\S]*?)(?=\n\s*[\w\.]+\.add|\n\s*\w+\s*:=|$)/g

    let match: RegExpExecArray | null
    while ((match = commandRegex.exec(cleanInput)) !== null) {
        // Safe destructuring with explicit undefined checks
        const assignVar = match[1]
        const parentVar = match[2] || ''
        const type = match[3]
        const args = match[4] || '' // Ensure args is a string

        // Extract metadata with safe access
        const idMatch = args.match(/id\s*:=\s*'([^']+)'/)
        const nameMatch = args.match(/name\s*:=\s*'([^']+)'/)
        const versionMatch = args.match(/version\s*:=\s*'([^']+)'/)

        const id = (idMatch && idMatch[1]) ? idMatch[1] : generateId()
        const name = (nameMatch && nameMatch[1]) ? nameMatch[1] : (type === 'Category' ? 'New Folder' : 'New Policy')
        const version = (versionMatch && versionMatch[1]) ? versionMatch[1] : null

        const parentList = getParent(parentVar)

        if (type === 'Category') {
            const newCat = createDefaultCategory(name)
            newCat.id = id
            parentList.push(newCat)
            if (assignVar) variableMap.set(assignVar, newCat)
        } else {
            // AccessPolicy
            let pol: Policy | null = null

            // Try extracting configuration Base64
            const configMatch = args.match(/configuration\s*:=\s*'.*?;application\/json;([A-Za-z0-9+/=\s\r\n]+)'/)
            if (configMatch && configMatch[1]) {
                try {
                    const b64 = configMatch[1].replace(/\s/g, '')
                    const json = await base64AndGunzip(b64)
                    pol = jsonToPolicy(json, id, name)
                } catch (e) {
                    console.warn(`Failed to decode config for ${name}`, e)
                }
            }

            // Fallback: contentAsString
            if (!pol) {
                const contentMatch = args.match(/contentAsString\s*:=\s*'((?:[^']|'')*)'/)
                if (contentMatch && contentMatch[1]) {
                    // Simple unescape might be needed
                    pol = jsonToPolicy(contentMatch[1], id, name)
                }
            }

            // Final fallback: Empty policy
            if (!pol) {
                pol = createDefaultPolicy()
                pol.id = id
                pol.name = name
                if (version) pol.Version = version
            } else {
                // Ensure ID/Name from script take precedence
                pol.id = id
                pol.name = name
                if (version) pol.Version = version
            }

            policies.push(pol)
            if (isPolicy(pol)) {
                parentList.push(pol)
            }
        }
    }

    // Single item legacy config fallback
    if (rootItems.length === 0 && policies.length === 0) {
        try {
            const legacyConfigMatch = cleanInput.match(/configuration\s*:=\s*'.*?;application\/json;([A-Za-z0-9+/=\s\r\n]+)'/)
            if (legacyConfigMatch && legacyConfigMatch[1]) {
                const b64 = legacyConfigMatch[1].replace(/\s/g, '')
                const json = await base64AndGunzip(b64)
                const pol = jsonToPolicy(json, generateId(), 'Legacy Config Import')
                if (pol) {
                    return { items: [pol], vocab: extractVocabulary([pol]), count: 1 }
                }
            }
        } catch (e) { }
    }

    return {
        items: rootItems,
        vocab: extractVocabulary(policies),
        count: policies.length + variableMap.size
    }
}

// Type Guard helper
function isPolicy(item: any): item is Policy {
    return item && item.itemType === 'Policy'
}


