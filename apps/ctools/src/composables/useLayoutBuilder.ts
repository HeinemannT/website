import { computed } from 'vue'
// using native crypto
const uuidv4 = () => crypto.randomUUID()
import { usePersistentState } from './usePersistentState'
import { ScriptBuilder } from '../utils/ScriptBuilder'

// --- Types ---
export interface Col {
    id: string
    type: 'Col'
    name: string
    varName: string
    width: number
}

export interface Row {
    id: string
    type: 'Row'
    name: string
    varName: string
    children: Col[]
}

export interface Tab {
    id: string
    type: 'Tab'
    name: string
    varName: string
    children: Row[]
}

export interface TabSet {
    id: string
    type: 'TabSet'
    name: string
    varName: string
    children: Tab[]
}

export type MobileStrategy = 'mirror' | 'stack' | 'grid'

export function useLayoutBuilder() {
    // --- State ---
    const rootParentId = usePersistentState('layout:rootParentId', 'swi_folder')
    const mobileStrategy = usePersistentState<MobileStrategy>('layout:mobileStrategy', 'mirror')
    const data = usePersistentState<TabSet[]>('layout:data', [])

    // --- Helpers ---
    const createId = () => uuidv4()

    // --- Actions ---
    const addTabSet = () => {
        const tsIdx = data.value.length
        const ts: TabSet = {
            id: createId(),
            type: 'TabSet',
            name: 'Tab Set',
            varName: 'ts_' + (tsIdx + 1),
            children: []
        }
        data.value.push(ts)
        addTab(ts)
    }

    const addTab = (ts: TabSet) => {
        const tIdx = ts.children.length
        const tab: Tab = {
            id: createId(),
            type: 'Tab',
            name: 'Tab ' + (tIdx + 1),
            varName: 'tab_' + (tIdx + 1),
            children: []
        }
        ts.children.push(tab)
        addRow(tab)
    }

    const addRow = (tab: Tab) => {
        const rIdx = tab.children.length
        const row: Row = {
            id: createId(),
            type: 'Row',
            name: 'Row ' + (rIdx + 1),
            varName: 'row_' + (rIdx + 1),
            children: []
        }
        tab.children.push(row)
    }

    const addCol = (row: Row) => {
        const used = row.children.reduce((acc, c) => acc + c.width, 0)
        const available = 6 - used

        if (available < 1) return

        // Default width is 2, or whatever is left if < 2
        const width = available > 2 ? 2 : available

        const cIdx = row.children.length
        row.children.push({
            id: createId(),
            type: 'Col',
            name: `[W${width}]Container`,
            varName: 'col_' + (cIdx + 1),
            width: width
        })
    }

    // --- Resize Logic ---
    const updateNameOnResize = (col: Col, newWidth: number) => {
        const prefixRegex = /^\[W\d+\]/
        if (prefixRegex.test(col.name)) {
            col.name = col.name.replace(prefixRegex, `[W${newWidth}]`)
        }
    }

    const resizeCol = (row: Row, colIndex: number, delta: number) => {
        const col = row.children[colIndex]
        if (!col) return
        const oldWidth = col.width
        let newWidth = oldWidth

        const currentTotal = row.children.reduce((acc, c) => acc + c.width, 0)
        const spaceLeft = 6 - currentTotal

        if (delta > 0) {
            // Growing
            if (spaceLeft >= delta) {
                newWidth += delta
            } else {
                // Try stealing from neighbors (simple implementation: right neighbor first, then left)
                const rightNeighbor = row.children[colIndex + 1]
                if (rightNeighbor && rightNeighbor.width > 1) {
                    updateNameOnResize(rightNeighbor, rightNeighbor.width - delta)
                    rightNeighbor.width -= delta
                    newWidth += delta
                } else {
                    const leftNeighbor = row.children[colIndex - 1]
                    if (leftNeighbor && leftNeighbor.width > 1) {
                        updateNameOnResize(leftNeighbor, leftNeighbor.width - delta)
                        leftNeighbor.width -= delta
                        newWidth += delta
                    }
                }
            }
        } else {
            // Shrinking
            if (col.width > 1) {
                newWidth += delta
            }
        }

        if (newWidth !== oldWidth) {
            col.width = newWidth
            updateNameOnResize(col, newWidth)
        }
    }

    // --- Deletion (Compatible with vuedraggable) ---
    // Note: When using vuedraggable, direct array manipulation is handled by the component via v-model.
    // However, for explicit delete buttons, we still need these helpers.
    const removeTabSet = (idx: number) => data.value.splice(idx, 1)
    const removeTab = (ts: TabSet, idx: number) => ts.children.splice(idx, 1)
    const removeRow = (tab: Tab, idx: number) => tab.children.splice(idx, 1)
    const removeCol = (row: Row, idx: number) => row.children.splice(idx, 1)

    // --- Code Generation ---
    const scriptOutput = computed(() => {
        let vRootVal = rootParentId.value || 'swi_folder'
        if (!vRootVal.startsWith('t.') && !vRootVal.startsWith('root.') && !vRootVal.startsWith('this.')) {
            vRootVal = 't.' + vRootVal
        }

        const sb = new ScriptBuilder('Layout by cTools')
        sb.addNewLine() // Explicit separation
        sb.assign('targetFolder', vRootVal)
        sb.addNewLine()

        data.value.forEach((ts) => {
            sb.addComment(`--- TabSet: ${ts.name} ---`)
            sb.assignAdd(ts.varName, 'vRoot', 'TabSet', { name: ts.name })

            ts.children.forEach((tab) => {
                sb.addNewLine()
                sb.indent()
                sb.addComment(`Tab: ${tab.name}`)
                sb.assignAdd(tab.varName, ts.varName, 'Tab', { name: tab.name })

                tab.children.forEach((row) => {
                    sb.indent()
                    sb.assignAdd(row.varName, tab.varName, 'Container', {
                        name: row.name,
                        columnsLargeScreen: 6,
                        columnsMediumScreen: 6,
                        columnsSmallScreen: 6
                    })

                    row.children.forEach((col) => {
                        let wLarge = col.width
                        let wMedium = wLarge
                        let wSmall = 6

                        if (mobileStrategy.value === 'grid') wSmall = (wLarge <= 3) ? 3 : 6
                        else if (mobileStrategy.value === 'mirror') wSmall = wLarge

                        sb.indent()
                        sb.assignAdd(col.varName, row.varName, 'Container', {
                            name: col.name,
                            columnsLargeScreen: wLarge,
                            columnsMediumScreen: wMedium,
                            columnsSmallScreen: wSmall
                        })
                        sb.outdent()
                    })
                    sb.outdent()
                })
                sb.outdent()
            })
            sb.addNewLine()
        })

        return sb.toString()
    })

    // Initialize logic
    const init = () => {
        if (data.value.length === 0) addTabSet()
    }

    return {
        // State
        rootParentId,
        mobileStrategy,
        data,

        // Actions
        addTabSet,
        addTab,
        addRow,
        addCol,

        removeTabSet,
        removeTab,
        removeRow,
        removeCol,

        resizeCol,

        // Output
        scriptOutput,
        init
    }
}
