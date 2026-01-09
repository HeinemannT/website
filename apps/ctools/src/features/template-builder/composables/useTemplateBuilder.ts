import { ref, computed } from 'vue'
import { INVENTORY, type InventoryItem } from '../constants'

export interface LayoutItem {
    id: string
    inventoryId: string
    instanceName: string
    props: Record<string, any>
    // Coordinate Grid Props
    x: number // 0-5
    y: number // 0-N
    w: number // 1-6
    h: number // 1-N (Height in rows)

    // Visual Props
    headerColor?: string
    headerTextColor?: string
}

export interface Tab {
    id: string
    name: string
    widgets: LayoutItem[]
}

// Helper to extract defaults
const extractDefaults = (item: InventoryItem) => {
    const defaults: Record<string, any> = {}
    item.properties.forEach(p => {
        if (p.default !== undefined) defaults[p.name] = p.default
    })
    return defaults
}

export const createLayoutItem = (item: InventoryItem): LayoutItem => ({
    id: globalThis.crypto.randomUUID(),
    inventoryId: item.id,
    instanceName: item.label,
    props: extractDefaults(item),
    // Default Dimensions
    x: 0,
    y: 0,
    w: 2, // Default 2 columns
    h: 2, // Default 2 rows
    headerColor: '#ffffff',
    headerTextColor: '#161616'
})


// Singleton State
const rootPage = ref<LayoutItem | null>(null)
const tabs = ref<Tab[]>([])
const activeTabId = ref<string>('')
const selectedItemId = ref<string | null>(null)
const targetFolderVar = ref('targetFolder')

export function useTemplateBuilder() {

    // --- Tab Management ---
    const addTab = () => {
        const id = globalThis.crypto.randomUUID()
        const newTab: Tab = {
            id,
            name: `Tab ${tabs.value.length + 1}`,
            widgets: []
        }
        tabs.value.push(newTab)
        activeTabId.value = id
    }

    const removeTab = (id: string) => {
        const idx = tabs.value.findIndex(t => t.id === id)
        if (idx > -1) {
            tabs.value.splice(idx, 1)
            // If active, switch
            if (activeTabId.value === id) {
                activeTabId.value = tabs.value[Math.max(0, idx - 1)]?.id || ''
            }
        }
    }

    const setActiveTab = (id: string) => {
        activeTabId.value = id
    }

    // Initialize default tab if needed
    const ensureInitialized = () => {
        if (tabs.value.length === 0) {
            addTab()
        }
    }

    // Proxy 'widgets' to the active tab's widgets
    const widgets = computed({
        get: () => {
            const tab = tabs.value.find(t => t.id === activeTabId.value)
            return tab ? tab.widgets : []
        },
        set: (newWidgets) => {
            const tab = tabs.value.find(t => t.id === activeTabId.value)
            if (tab) {
                tab.widgets = newWidgets
            }
        }
    })

    const selectItem = (id: string) => {
        selectedItemId.value = id
    }

    const unselect = () => {
        selectedItemId.value = null
    }

    const setRootPage = (item: LayoutItem) => {
        rootPage.value = item
        if (tabs.value.length === 0) addTab()
    }

    const removeItem = (id: string) => {
        // Remove from active tab
        const index = widgets.value.findIndex(i => i.id === id)
        if (index > -1) {
            widgets.value.splice(index, 1)
        }
    }

    // --- SCRIPT GENERATION (Multi-Tab Reference Logic) ---
    const scriptOutput = computed(() => {
        if (!rootPage.value) return ''

        // 1. Setup Variables
        const rootVar = 'targetFolder'
        const sourceContext = targetFolderVar.value || 'targetFolder'
        const tabSetId = Math.floor(Math.random() * 10000)

        let code = `// Target Folder context\n`
        code += `${rootVar} := t.${sourceContext}\n\n`

        code += `// 1. Layout Structure (Containers)\n`
        code += `_tabSet := ${rootVar}.add(TabSet, id := '${tabSetId}')\n\n`

        const widgetContainerMap: Record<string, string> = {}
        let containerCounter = 1

        // PASS 1: Generate Tabs & Containers
        tabs.value.forEach((tab, tabIndex) => {
            const tabId = Math.floor(Math.random() * 10000)
            const tabVar = `_tab${tabIndex + 1}`

            code += `// --- ${tab.name} ---\n`
            code += `${tabVar} := _tabSet.add(Tab, id := '${tabId}', title := '${tab.name}')\n`

            const sortedWidgets = [...tab.widgets].sort((a, b) => {
                if (a.y === b.y) return a.x - b.x
                return a.y - b.y
            })

            const rows: Record<number, LayoutItem[]> = {}
            sortedWidgets.forEach(w => {
                if (!rows[w.y]) rows[w.y] = []
                rows[w.y]!.push(w)
            })

            const sortedRowIndices = Object.keys(rows).map(Number).sort((a, b) => a - b)

            sortedRowIndices.forEach(y => {
                const rowItems = rows[y]
                if (!rowItems) return

                let currentX = 0

                rowItems.forEach(item => {
                    // GAP
                    if (item.x > currentX) {
                        const gapW = item.x - currentX
                        const spacerId = Math.floor(Math.random() * 10000)
                        code += `_spacer_${tabIndex}_${y}_${currentX} := ${tabVar}.add(Container, id := '${spacerId}', columnsLargeScreen := ${gapW}, columnsMediumScreen := 6, columnsSmallScreen := 6)\n`
                    }

                    // CONTAINER
                    const contVar = `_cont${containerCounter++}_t${tabIndex + 1}`
                    const contId = Math.floor(Math.random() * 10000)
                    widgetContainerMap[item.id] = contVar

                    code += `${contVar} := ${tabVar}.add(Container, id := '${contId}', columnsLargeScreen := ${item.w}, columnsMediumScreen := 6, columnsSmallScreen := 6)\n`

                    currentX = item.x + item.w
                })

                // GAP END
                if (currentX < 6) {
                    const gapW = 6 - currentX
                    const spacerId = Math.floor(Math.random() * 10000)
                    code += `_spacer_${tabIndex}_${y}_${currentX} := ${tabVar}.add(Container, id := '${spacerId}', columnsLargeScreen := ${gapW}, columnsMediumScreen := 6, columnsSmallScreen := 6)\n`
                }
                code += '\n'
            })
        })

        // PASS 2: Generate Widgets
        code += `// 2. Content (Page & Widgets)\n`
        const pageVar = '_mod'
        code += `${pageVar} := ${rootVar}.add(${rootPage.value.inventoryId}, id := '${rootPage.value.id.split('-')[0]}')\n`

        tabs.value.forEach(tab => {
            tab.widgets.forEach(item => {
                const definition = INVENTORY.find(i => i.id === item.inventoryId)
                const defaults = extractDefaults(definition || { properties: [] } as any)
                const props = { ...defaults, ...item.props }

                const diffs: string[] = []
                const contRef = widgetContainerMap[item.id]

                Object.entries(props).forEach(([key, value]) => {
                    const defVal = defaults[key]
                    if (JSON.stringify(value) !== JSON.stringify(defVal)) {
                        if (typeof value === 'string') diffs.push(`${key} := '${value}'`)
                        else if (typeof value === 'boolean') diffs.push(`${key} := ${value}`)
                        else if (typeof value === 'number') diffs.push(`${key} := ${value}`)
                    }
                })

                if (item.headerColor && item.headerColor !== '#ffffff') diffs.push(`headerColor := '${item.headerColor}'`)
                if (item.headerTextColor && item.headerTextColor !== '#161616') diffs.push(`headerTextColor := '${item.headerTextColor}'`)

                if (contRef) {
                    const existingIndex = diffs.findIndex(d => d.startsWith('container :='))
                    if (existingIndex > -1) diffs.splice(existingIndex, 1)
                    diffs.unshift(`container := ${contRef}`)
                }

                const safeName = item.instanceName.replace(/'/g, "\\'")
                const propStr = diffs.length ? `, ${diffs.join(', ')}` : ''
                code += `        ${pageVar}.add(${item.inventoryId}, name := '${safeName}'${propStr})\n`
            })
        })

        return code
    })

    return {
        rootPage,
        widgets,
        tabs,
        activeTabId,
        selectedItemId,
        setRootPage,
        selectItem,
        unselect,
        removeItem,
        scriptOutput,
        addTab,
        removeTab,
        setActiveTab,
        ensureInitialized,
        targetFolderVar
    }
}
