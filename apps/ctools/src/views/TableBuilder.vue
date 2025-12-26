<script setup lang="ts">
import { computed } from 'vue'
import draggable from 'vuedraggable'
import { ScriptBuilder } from '../utils/ScriptBuilder'
import { 
    Table, Plus, Trash2, GripVertical, Settings, 
    AlignLeft, AlignCenter, AlignRight, EyeOff,
    ListTree, Lock, WrapText
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
    align: 'left' | 'center' | 'right'
    styles: string[] // 'separator', 'hidden', 'wrapped', 'readonly'
    format: string // '', 'decimals(0)', 'decimals(2)', 'formatType(PERCENTAGE)', etc.
    showSettings?: boolean // Internal UI state
}

interface Level {
    id: string
    source: string
    indent: number
    collapse: boolean
}

// --- State ---
const method = usePersistentState<1 | 2 | 3 | 4>('table:method_v2', 2) // 1: Simple, 2: Headers, 3: Manual, 4: Hierarchy
const sourceList = usePersistentState('table:sourceList_v2', 'vListOfObjects')
const tableVar = usePersistentState('table:tableVar_v2', 'vTable')
const columns = usePersistentState<Column[]>('table:columns_v2', [
    { id: '1', header: 'Application Security Risk', prop: 'applicationSecurityRisk', align: 'left', styles: [], format: '' },
    { id: '2', header: 'Backup Failure Risk', prop: 'backupFailureRisk', align: 'left', styles: [], format: '' },
    { id: '3', header: 'Cloud Compliance Risk', prop: 'cloudComplianceRisk', align: 'left', styles: [], format: '' }
])
const levels = usePersistentState<Level[]>('table:levels_v2', [])

// --- Actions ---
const createId = () => crypto.randomUUID()

const setMethod = (m: 1 | 2 | 3 | 4) => {
    method.value = m
    if (m === 4 && levels.value.length === 0) {
        addLevel()
    }
}

const addColumn = () => {
    columns.value.push({
        id: createId(),
        header: 'New Column',
        prop: 'property',
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
    if (idx === 0) {
        levels.value.push({ id: createId(), source: 'vList', indent: 0, collapse: false })
    } else {
        levels.value.push({ id: createId(), source: `item_${idx}.children`, indent: idx, collapse: false })
    }
}

const removeLevel = (idx: number) => {
    levels.value.splice(idx, 1)
}

// --- Helpers ---
const toggleStyle = (col: Column, style: string) => {
    if (col.styles.includes(style)) {
        col.styles = col.styles.filter(s => s !== style)
    } else {
        col.styles.push(style)
    }
}

const escapeString = (str: string) => str ? str.replace(/"/g, '\\"') : ''

// --- Code Generation ---
const scriptOutput = computed(() => {
    const sb = new ScriptBuilder('Table created by CTools')

    if (method.value === 3 || method.value === 4) {
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
            if (method.value === 1) {
                line = `${tableVar.value}.addColumn(${col.prop})`
            } else {
                line = `${tableVar.value}.addColumn("${escapeString(col.header)}", ${col.prop})`
            }
            line += buildStyleChain(col)
            sb.add(line)
        })
    }

    if (method.value === 3) {
        sb.addNewLine()
        sb.addComment('--- Population ---')
        sb.add(`${sourceList.value}.foreach(item:`)
        sb.indent()
        
        const rowProps = columns.value.map(c => 'item.' + c.prop).join(', ')
        sb.add(`${tableVar.value}.addRow(item, ${rowProps})`)
        sb.outdent()
        sb.add(')')
    } else if (method.value === 4) {
        sb.addNewLine()
        sb.addComment('--- Hierarchy Population ---')
        generateNestedLoop(sb, 0)
    }

    sb.addNewLine()
    sb.add(tableVar.value)

    return sb.toString()
})

const buildStyleChain = (col: Column) => {
    let chain = ''
    if (col.align && col.align !== 'left') chain += `.align(${col.align.toUpperCase()})`

    let args: string[] = []
    let methods: string[] = []
    
    col.styles.forEach(st => {
        if (st === 'hidden') methods.push('.hidden()')
        else if (st === 'readonly') methods.push('.readonly()')
        else if (st === 'separator') args.push("'separator'")
        else if (st === 'wrapped') args.push("'wrapped'")
        else args.push(`'${st}'`)
    })

    if (args.length > 0) chain += `.style(${args.join(', ')})`
    if (col.format) chain += `.${col.format}`
    if (methods.length > 0) chain += methods.join('')
    
    return chain
}

const generateNestedLoop = (sb: ScriptBuilder, levelIdx: number) => {
    if (levelIdx >= levels.value.length) return
    const lvl = levels.value[levelIdx]
    const itemVar = levelIdx === 0 ? 'item' : `item_${levelIdx + 1}`
    
    // Header
    sb.add(`${lvl ? lvl.source : ''}.foreach(${itemVar}:`)
    sb.indent()
    
    // Auto-detect if prop needs prefix
    const rowProps = columns.value.map(c => {
        if (/^[a-zA-Z0-9_]+$/.test(c.prop)) return `${itemVar}.${c.prop}`
        return c.prop
    }).join(', ')

    let addRowLine = `${tableVar.value}.addRow(${itemVar}, ${rowProps})`
    if (lvl) {
        if (lvl.indent > 0) addRowLine += `.indent(${lvl.indent})`
        if (lvl.collapse) addRowLine += `.collapse()`
    }
    sb.add(addRowLine)

    // Recurse
    generateNestedLoop(sb, levelIdx + 1)
    
    // Footer
    sb.outdent()
    sb.add(')')
}

</script>

<template>
    <ToolLayout sidebar-class="w-full md:w-1/2 lg:w-[500px] shadow-none border-r border-slate-200 dark:border-slate-800" sidebar-position="left">
        
        <!-- Sidebar: Configuration -->
        <template #sidebar>
            <!-- Global Config -->
            <div class="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 z-10 shrink-0 shadow-none">
                <!-- Method Selector -->
                <div class="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 mb-4">
                    <button v-for="m in [1, 2, 3, 4]" :key="m" @click="setMethod(m as any)"
                        :class="method === m ? 'bg-white dark:bg-slate-600 shadow-sm text-indigo-600 dark:text-indigo-300 font-bold' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'"
                        class="flex-1 py-1.5 text-[10px] uppercase tracking-wider rounded transition-all">
                        {{ m === 1 ? 'Simple' : m === 2 ? 'Headers' : m === 3 ? 'Manual' : 'Hierarchy' }}
                    </button>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div v-if="method !== 4">
                        <label class="text-[10px] uppercase font-bold text-slate-400 block mb-1">Source List</label>
                        <div class="flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-indigo-100 dark:focus-within:ring-indigo-900">
                            <span class="pl-2 text-[10px] font-mono font-medium text-indigo-400">:=</span>
                            <input v-model="sourceList" class="w-full bg-transparent border-none text-xs font-mono font-medium px-2 py-1.5 focus:outline-none" />
                        </div>
                    </div>
                    <div>
                        <label class="text-[10px] uppercase font-bold text-slate-400 block mb-1">Output Variable</label>
                        <div class="flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-indigo-100 dark:focus-within:ring-indigo-900">
                            <span class="pl-2 text-[10px] font-mono font-medium text-indigo-400">:=</span>
                            <input v-model="tableVar" class="w-full bg-transparent border-none text-xs font-mono font-medium px-2 py-1.5 focus:outline-none" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Scrollable List -->
            <div class="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50 dark:bg-slate-900">
                
                <!-- Hierarchy Config -->
                <div v-if="method === 4" class="space-y-3">
                    <label class="text-[10px] uppercase font-bold text-indigo-900 dark:text-indigo-300 tracking-wider flex items-center gap-2">
                        <ListTree class="w-3 h-3" /> Hierarchy Levels
                    </label>

                    <div class="relative pl-4 border-l-2 border-slate-200 dark:border-slate-700 space-y-3">
                        <div v-for="(lvl, idx) in levels" :key="lvl.id" class="relative">
                            <!-- Bullet -->
                            <div class="absolute -left-[21px] top-3 w-3 h-3 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-indigo-400"></div>
                            
                            <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 shadow-sm group">
                                <div class="flex justify-between items-center mb-2">
                                    <span class="text-[10px] font-bold text-indigo-500 uppercase">{{ idx === 0 ? 'Root Level' : `Nested Level ${idx}` }}</span>
                                    <button v-if="idx > 0" @click="removeLevel(idx)" class="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 class="w-3 h-3" /></button>
                                </div>
                                
                                <div class="grid grid-cols-12 gap-2">
                                    <div class="col-span-6">
                                        <label class="text-[8px] font-bold text-slate-400 uppercase block mb-0.5">Source</label>
                                        <input v-model="lvl.source" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-1 text-[10px] font-mono" />
                                    </div>
                                    <div class="col-span-3">
                                        <label class="text-[8px] font-bold text-slate-400 uppercase block mb-0.5">Indent</label>
                                        <input type="number" v-model="lvl.indent" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-1 text-[10px] font-bold text-center" />
                                    </div>
                                    <div class="col-span-3 flex flex-col items-center">
                                        <label class="text-[8px] font-bold text-slate-400 uppercase block mb-0.5">Collapse</label>
                                        <input type="checkbox" v-model="lvl.collapse" class="rounded text-indigo-500 focus:ring-indigo-500" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Columns -->
                <div class="space-y-4">
                    <div class="flex justify-between items-end border-b border-slate-200 dark:border-slate-800 pb-2">
                        <label class="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider flex items-center gap-2">
                            <Table class="w-3 h-3" /> Columns
                        </label>
                        <button class="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:text-indigo-800 flex items-center gap-1" @click="addColumn">
                            <Plus class="w-3 h-3" /> Add Column
                        </button>
                    </div>

                    <draggable 
                        v-model="columns" 
                        item-key="id"
                        handle=".drag-handle"
                        class="space-y-3"
                    >
                        <template #item="{ element: col, index }">
                            <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm hover:shadow-md transition-shadow group">
                                <!-- Main Row -->
                                <div class="flex items-center p-2 gap-2">
                                    <div class="drag-handle cursor-move text-slate-300 hover:text-slate-500"><GripVertical class="w-4 h-4" /></div>
                                    
                                    <div class="flex-1 grid grid-cols-2 gap-2">
                                        <input v-model="col.header" placeholder="Header" class="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-xs font-bold" />
                                        <input v-model="col.prop" placeholder="Property" class="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-xs font-mono text-slate-600 dark:text-slate-400" />
                                    </div>
                                    
                                    <div class="flex items-center border-l border-slate-100 dark:border-slate-700 pl-2 gap-1">
                                        <button @click="col.showSettings = !col.showSettings" 
                                            :class="col.showSettings ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30' : 'text-slate-400 hover:text-slate-600'" 
                                            class="p-1.5 rounded transition-colors">
                                            <Settings class="w-3.5 h-3.5" />
                                        </button>
                                        <button @click="removeColumn(index)" class="p-1.5 text-slate-300 hover:text-red-500 transition-colors">
                                            <Trash2 class="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>

                                <!-- Settings Panel -->
                                <div v-if="col.showSettings" class="border-t border-slate-100 dark:border-slate-700 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-b-lg grid grid-cols-2 gap-4">
                                    
                                    <!-- Align -->
                                    <div>
                                        <label class="text-[8px] uppercase font-bold text-slate-400 block mb-1">Alignment</label>
                                        <div class="flex bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 p-0.5">
                                            <button v-for="a in ['left', 'center', 'right']" :key="a" @click="col.align = a as any"
                                                :class="col.align === a ? 'bg-slate-100 dark:bg-slate-700 text-indigo-600 dark:text-indigo-400' : 'text-slate-400'"
                                                class="flex-1 flex justify-center py-1 rounded hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                                <AlignLeft v-if="a === 'left'" class="w-3 h-3" />
                                                <AlignCenter v-if="a === 'center'" class="w-3 h-3" />
                                                <AlignRight v-if="a === 'right'" class="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>

                                    <!-- Format -->
                                    <div>
                                        <label class="text-[8px] uppercase font-bold text-slate-400 block mb-1">Format</label>
                                        <input v-model="col.format" placeholder="decimals(2)" class="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-[10px] font-mono" />
                                    </div>

                                    <!-- Toggles -->
                                    <div class="col-span-2 flex gap-2 flex-wrap pt-1">
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
        </template>

        <!-- Main Content -->
        <template #main>
            <div class="h-full flex flex-col">
                <!-- Top Half: Preview -->
                <div class="h-[40%] border-b border-slate-200 dark:border-slate-800 bg-white p-6 overflow-auto">
                    <div class="max-w-4xl mx-auto space-y-2">
                        <label class="text-xs font-bold uppercase text-slate-400 tracking-wider">Preview</label>
                        <TablePreview :columns="columns" />
                    </div>
                </div>

                <!-- Bottom Half: Code -->
                <div class="h-[60%] overflow-hidden bg-white dark:bg-slate-900 relative">
                    <CodeOutputPanel title="Extended Code" :code="scriptOutput" />
                </div>
            </div>
        </template>
    </ToolLayout>
</template>
