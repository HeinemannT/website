<script setup lang="ts">
import { computed } from 'vue'
import draggable from 'vuedraggable'
import { ScriptBuilder } from '../utils/ScriptBuilder'
import { 
    Table, Plus, Trash2, GripVertical, Settings, 
    AlignLeft, AlignCenter, AlignRight, EyeOff,
    ListTree, Lock, WrapText, X
} from 'lucide-vue-next'
import CodeOutputPanel from '../components/ui/CodeOutputPanel.vue'
import ToolLayout from '../components/layout/ToolLayout.vue'
import TablePreview from '../components/tables/TablePreview.vue'
import { usePersistentState } from '../composables/usePersistentState'

// --- Types ---
interface Column {
    id: string
    header: string
    prop: string
    width: string
    align: 'left' | 'center' | 'right'
    styles: string[] // 'separator', 'hidden', 'wrapped', 'readonly', 'bold'
    format: string // '', 'decimals(0)', 'decimals(2)', 'formatType(PERCENTAGE)', etc.
    showSettings?: boolean // Internal UI state
}

interface HierarchyLevel {
    id: string
    source: string
    indent: number
    collapse: boolean
}

// --- State ---
const method = usePersistentState<number>('table:method_v3', 2) // 1: Simple, 2: Headers, 3: Manual, 4: Hierarchy
const sourceList = usePersistentState('table:sourceList_v3', 'vListOfObjects')
const tableVar = usePersistentState('table:tableVar_v3', 'vTable')
const columns = usePersistentState<Column[]>('table:columns_v3', [
    { id: '1', header: 'New Column', prop: 'property', width: '', align: 'left', styles: [], format: '' }
])
const levels = usePersistentState<HierarchyLevel[]>('table:levels_v3', [
    { id: 'root', source: 'vList', indent: 0, collapse: false }
])

// --- Actions ---
const createId = () => crypto.randomUUID()

const setMethod = (m: number) => {
    method.value = Number(m) as any
    if (m === 4 && levels.value.length === 0) {
        addLevel()
    }
}

const addColumn = () => {
    columns.value.push({
        id: createId(),
        header: 'New Column',
        prop: 'property',
        width: '',
        align: 'left',
        styles: [],
        format: ''
    })
}

const removeColumn = (idx: number) => {
    columns.value.splice(idx, 1)
}

const addLevel = () => {
    const idx = levels.value.length
    // Logic: If idx=0, source='vList'. Var will be item_1.
    // If idx=1, previous was item_1. Source should be item_1.children.
    levels.value.push({ 
        id: createId(), 
        source: idx === 0 ? 'vList' : `item_${idx}.children`, 
        indent: idx, 
        collapse: false 
    })
}

const removeLevel = (idx: number) => {
    levels.value.splice(idx, 1)
}

// Auto-update header for Simple Mode
const updateHeader = (col: Column) => {
    if (method.value === 1 && col.prop) {
        col.header = `[${col.prop}.name]`
    }
}

// ... Helpers ...

const generateNestedLoop = (sb: ScriptBuilder, levelIdx: number, _parentVar: string) => {
    if (levelIdx >= levels.value.length) return

    const lvl = levels.value[levelIdx]!
    const itemVar = `item_${levelIdx + 1}` // 1-based indexing (item_1, item_2...)
    
    // Header
    sb.add(`${lvl.source}.foreach(${itemVar}:`)
    sb.indent()
    
    // Auto-detect if prop needs prefix
    const rowProps = columns.value.map(c => {
        if (/^[a-zA-Z0-9_]+$/.test(c.prop)) return `${itemVar}.${c.prop}`
        return c.prop
    }).join(', ')

    let addRowLine = `${tableVar.value}.addRow(${itemVar}, ${rowProps})`
    if (lvl.indent > 0) addRowLine += `.indent(${lvl.indent})`
    if (lvl.collapse) addRowLine += `.collapse()`
    
    sb.add(addRowLine)

    // Recurse (Strict Nesting)
    generateNestedLoop(sb, levelIdx + 1, itemVar)
    
    // Footer
    sb.outdent()
    sb.add(')')
}

// --- Code Generation ---
const scriptOutput = computed(() => {
    const m = Number(method.value) // Ensure number type
    console.log('Generating Script. Method:', m, typeof m)
    
    const sb = new ScriptBuilder('Table created by CTools')

    if (m === 3 || m === 4) {
        sb.add(`${tableVar.value} := createTable()`)
        columns.value.forEach(col => {
            let line = `${tableVar.value}.addColumn("${escapeString(col.header)}", "")`
            line += buildStyleChain(col)
            sb.add(line)
        })
    } else {
        sb.assign(tableVar.value, `${sourceList.value}.table()`)
        columns.value.forEach(col => {
            let line = ''
            if (m === 1) {
                line = `${tableVar.value}.add(${(sourceList.value.startsWith('v') || sourceList.value.startsWith('l')) ? 'item' : 'item'}.${col.prop})`
            } else {
                line = `${tableVar.value}.addColumn("${escapeString(col.header)}", item.${col.prop})`
            }
            line += buildStyleChain(col)
            sb.add(line)
        })
        return sb.toString()
    }

    sb.addNewLine()
    sb.addComment('--- Population ---')

    if (m === 3) {
        sb.add(`${sourceList.value}.foreach(item:`)
        sb.indent()
        sb.add(`${tableVar.value}.addRow()`)
        columns.value.forEach(col => {
             sb.add(`.addCell(item.${col.prop})`)
        })
        sb.outdent()
        sb.add(')')
    } else if (m === 4) {
        sb.addComment('--- Hierarchy Population ---')
        generateNestedLoop(sb, 0, '')
    }

    sb.addNewLine()
    sb.add(tableVar.value)

    return sb.toString()
})

const buildStyleChain = (col: Column) => {
    let chain = ''
    if (col.width) chain += `.width(${col.width})`
    if (col.align && col.align !== 'left') chain += `.align(alignment.${col.align.toUpperCase()})`

    let args: string[] = []
    let methods: string[] = []
    
    col.styles.forEach(st => {
        if (st === 'hidden') methods.push('.hidden()')
        else if (st === 'readonly') methods.push('.readonly()')
        else if (st === 'separator') args.push("'separator'")
        else if (st === 'wrapped') args.push("'wrapped'")
        else if (st === 'bold') args.push("style.bold")
        else args.push(`'${st}'`)
    })

    if (args.length > 0) chain += `.style(${args.join(', ')})`
    if (col.format) chain += `.${col.format}`
    if (methods.length > 0) chain += methods.join('')
    
    return chain
}

const escapeString = (str: string) => str ? str.replace(/"/g, '\\"') : ''
const toggleStyle = (col: Column, style: string) => {
    if (col.styles.includes(style)) {
        col.styles = col.styles.filter(s => s !== style)
    } else {
        col.styles.push(style)
    }
}

</script>

<template>
    <ToolLayout sidebar-class="w-80 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 shadow-xl z-20">
        <!-- Sidebar: Extended Code (Right side by default) -->
        <template #sidebar>
            <CodeOutputPanel title="Extended Code" :code="scriptOutput" />
        </template>

        <!-- Main Content: Split Config & Preview -->
        <template #main>
            <div class="h-full flex flex-row overflow-hidden font-sans">
                
                <!-- Left Column: Configuration (Standard Width) -->
                <div class="w-80 md:w-96 shrink-0 flex flex-col border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 z-10 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]">
                    
                    <!-- Global Config Header -->
                    <div class="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 shrink-0">
                        <!-- Method Selector -->
                        <div class="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 mb-4">
                            <button v-for="m in [1, 2, 3, 4]" :key="m" @click="setMethod(m as any)"
                                :class="method === m ? 'bg-white dark:bg-slate-600 shadow-sm text-indigo-600 dark:text-indigo-300 font-bold' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'"
                                class="flex-1 py-1.5 text-[10px] uppercase tracking-wider rounded transition-all">
                                {{ m === 1 ? 'Simple' : m === 2 ? 'Headers' : m === 3 ? 'Add Row' : 'Hierarchy' }}
                            </button>
                        </div>

                        <div class="grid grid-cols-1 gap-3">
                            <div v-if="method !== 4">
                                <label class="text-[10px] uppercase font-bold text-slate-400 block mb-1">Source List</label>
                                <div class="flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-indigo-100 dark:focus-within:ring-indigo-900 transition-shadow">
                                    <span class="pl-2 text-[10px] font-mono font-medium text-indigo-400">:=</span>
                                    <input v-model="sourceList" class="w-full bg-transparent border-none text-xs font-mono font-medium px-2 py-1.5 focus:outline-none" />
                                </div>
                            </div>
                            <div>
                                <label class="text-[10px] uppercase font-bold text-slate-400 block mb-1">Output Variable</label>
                                <div class="flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-indigo-100 dark:focus-within:ring-indigo-900 transition-shadow">
                                    <span class="pl-2 text-[10px] font-mono font-medium text-indigo-400">:=</span>
                                    <input v-model="tableVar" class="w-full bg-transparent border-none text-xs font-mono font-medium px-2 py-1.5 focus:outline-none" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Scrollable Config List -->
                    <div class="flex-1 overflow-y-auto p-4 space-y-6">
                        
                        <!-- Hierarchy Config (Compact) -->
                        <div v-if="method === 4" class="space-y-2">
                            <label class="text-[10px] uppercase font-bold text-slate-700 dark:text-slate-300 tracking-wider flex items-center gap-2 mb-2">
                                <ListTree class="w-3 h-3" /> Hierarchy Levels
                            </label>

                            <div class="space-y-1">
                                <!-- Headers -->
                                <div class="flex gap-2 px-2 pb-1">
                                    <span class="flex-1 text-[8px] font-bold text-slate-400 uppercase">Source</span>
                                    <span class="w-10 text-center text-[8px] font-bold text-slate-400 uppercase">Indent</span>
                                    <span class="w-6 text-center text-[8px] font-bold text-slate-400 uppercase">Col</span>
                                    <span class="w-4"></span>
                                </div>

                                <div v-for="(lvl, idx) in levels" :key="lvl.id" class="flex items-center gap-2 group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md p-1.5 shadow-sm hover:border-slate-300 transition-colors">
                                    <div class="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-600 shrink-0" :class="idx === 0 ? 'bg-indigo-400' : ''"></div>
                                    
                                    <!-- Source Input -->
                                    <input v-model="lvl.source" class="flex-1 min-w-0 bg-transparent text-[10px] font-mono text-slate-700 dark:text-slate-300 focus:outline-none placeholder-slate-300" placeholder="Source..." />
                                    
                                    <!-- Indent Input -->
                                    <input type="number" v-model="lvl.indent" class="w-10 text-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-1 py-0.5 text-[10px] font-bold text-slate-600 focus:outline-none" />
                                    
                                    <!-- Collapse Checkbox -->
                                    <div class="w-6 flex justify-center">
                                        <input type="checkbox" v-model="lvl.collapse" class="rounded text-indigo-500 w-3 h-3 focus:ring-0" />
                                    </div>

                                    <!-- Delete -->
                                    <button v-if="idx > 0" @click="removeLevel(idx)" class="w-4 flex justify-center text-slate-400 hover:text-red-500 transition-colors">
                                        <X class="w-3 h-3" />
                                    </button>
                                    <div v-else class="w-4"></div>
                                </div>
                            </div>

                            <button @click="addLevel" class="w-full py-2 border border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-400 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-[10px] font-bold transition-all flex items-center justify-center gap-2 group mt-2 bg-slate-50/50 hover:bg-white">
                                <Plus class="w-3 h-3" /> Add Nested Level
                            </button>
                        </div>

                        <!-- Columns -->
                        <div class="space-y-3">
                            <div class="flex justify-between items-end border-b border-slate-200 dark:border-slate-800 pb-2">
                                <label class="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider flex items-center gap-2">
                                    <Table class="w-3 h-3" /> Columns
                                </label>
                                <button class="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold hover:text-indigo-800 flex items-center gap-1 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded-full transition-colors" @click="addColumn">
                                    <Plus class="w-3 h-3" /> Add Column
                                </button>
                            </div>

                            <draggable 
                                v-model="columns" 
                                item-key="id"
                                handle=".drag-handle"
                                class="space-y-2"
                            >
                                <template #item="{ element: col, index }">
                                    <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm hover:shadow-md transition-shadow group">
                                        <!-- Main Row -->
                                        <div class="flex items-center p-2 gap-2">
                                            <div class="drag-handle cursor-move text-slate-300 hover:text-slate-500"><GripVertical class="w-4 h-4" /></div>
                                            
                                            <div class="flex-1 grid grid-cols-1 gap-1.5">
                                                <input v-model="col.header" placeholder="Header" class="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-xs font-bold focus:ring-1 focus:ring-indigo-100 focus:outline-none" />
                                                <input v-model="col.prop" placeholder="Property" @input="updateHeader(col)" class="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-[10px] font-mono text-slate-600 dark:text-slate-400 focus:ring-1 focus:ring-indigo-100 focus:outline-none" />
                                            </div>
                                            
                                            <div class="flex flex-col border-l border-slate-100 dark:border-slate-700 pl-2 gap-1">
                                                <button @click="col.showSettings = !col.showSettings" 
                                                    :class="col.showSettings ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30' : 'text-slate-400 hover:text-slate-600'" 
                                                    class="p-1 rounded transition-colors">
                                                    <Settings class="w-3 h-3" />
                                                </button>
                                                <button @click="removeColumn(index)" class="p-1 text-slate-300 hover:text-red-500 transition-colors">
                                                    <Trash2 class="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>

                                        <!-- Settings Panel -->
                                        <div v-if="col.showSettings" class="border-t border-slate-100 dark:border-slate-700 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-b-lg grid grid-cols-2 gap-3">
                                            <!-- Align -->
                                            <div>
                                                <label class="text-[8px] uppercase font-bold text-slate-400 block mb-1">Alignment</label>
                                                <div class="flex bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 p-0.5">
                                                    <button v-for="a in ['left', 'center', 'right']" :key="a" @click="col.align = a as any"
                                                        :class="col.align === a ? 'bg-slate-100 dark:bg-slate-700 text-indigo-600 dark:text-indigo-400' : 'text-slate-400'"
                                                        class="flex-1 flex justify-center py-0.5 rounded transition-colors">
                                                        <AlignLeft v-if="a === 'left'" class="w-3 h-3" />
                                                        <AlignCenter v-if="a === 'center'" class="w-3 h-3" />
                                                        <AlignRight v-if="a === 'right'" class="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </div>

                                            <!-- Format -->
                                            <div>
                                                <label class="text-[8px] uppercase font-bold text-slate-400 block mb-1">Format</label>
                                                <input v-model="col.format" placeholder="decimals(2)" class="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 text-[10px] font-mono outline-none" />
                                            </div>

                                            <!-- Toggles -->
                                            <div class="col-span-2 flex gap-1.5 flex-wrap pt-1">
                                                <button @click="toggleStyle(col, 'bold')" :class="col.styles.includes('bold') ? 'bg-indigo-100 text-indigo-700 border-indigo-200' : 'bg-white border-slate-200 text-slate-500'" class="px-2 py-1 rounded text-[10px] font-bold border flex items-center gap-1 transition-all">B</button>
                                                <button @click="toggleStyle(col, 'hidden')" :class="col.styles.includes('hidden') ? 'bg-indigo-100 text-indigo-700 border-indigo-200' : 'bg-white border-slate-200 text-slate-500'" class="px-2 py-1 rounded text-[10px] font-bold border flex items-center gap-1 transition-all"><EyeOff class="w-3 h-3" />Hidden</button>
                                                <button @click="toggleStyle(col, 'separator')" :class="col.styles.includes('separator') ? 'bg-indigo-100 text-indigo-700 border-indigo-200' : 'bg-white border-slate-200 text-slate-500'" class="px-2 py-1 rounded text-[10px] font-bold border flex items-center gap-1 transition-all"><GripVertical class="w-3 h-3" />Separator</button>
                                                <button @click="toggleStyle(col, 'wrapped')" :class="col.styles.includes('wrapped') ? 'bg-indigo-100 text-indigo-700 border-indigo-200' : 'bg-white border-slate-200 text-slate-500'" class="px-2 py-1 rounded text-[10px] font-bold border flex items-center gap-1 transition-all"><WrapText class="w-3 h-3" />Wrap</button>
                                                <button @click="toggleStyle(col, 'readonly')" :class="col.styles.includes('readonly') ? 'bg-indigo-100 text-indigo-700 border-indigo-200' : 'bg-white border-slate-200 text-slate-500'" class="px-2 py-1 rounded text-[10px] font-bold border flex items-center gap-1 transition-all"><Lock class="w-3 h-3" />Readonly</button>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                            </draggable>
                        </div>
                    </div>
                </div>

                <!-- Right Column: Preview Canvas -->
                <div class="flex-1 overflow-auto relative flex flex-col p-12">
                    <div class="mx-auto w-full max-w-4xl">
                        <!-- Table Preview Card -->
                        <TablePreview :columns="columns" :is-hierarchy="method === 4" :levels="levels" />
                    </div>
                </div>

            </div>
        </template>
    </ToolLayout>
</template>
