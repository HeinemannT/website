<script setup lang="ts">
import { ref, computed } from 'vue'
import draggable from 'vuedraggable'
import { 
    Table, Code, Copy, Plus, Trash2, GripVertical, Settings, 
    AlignLeft, AlignCenter, AlignRight, EyeOff,
    ListTree, Lock, WrapText
} from 'lucide-vue-next'
// import BaseInput from '../components/ui/BaseInput.vue'
import { useClipboard } from '../composables/useClipboard'

const { copy } = useClipboard()

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
const method = ref<1 | 2 | 3 | 4>(2) // 1: Simple, 2: Headers, 3: Manual, 4: Hierarchy
const sourceList = ref('vListOfObjects')
const tableVar = ref('vTable')
const columns = ref<Column[]>([
    { id: '1', header: 'Name', prop: 'name', align: 'left', styles: [], format: '' },
    { id: '2', header: 'Description', prop: 'description', align: 'left', styles: [], format: '' },
    { id: '3', header: 'ID', prop: 'id', align: 'left', styles: [], format: '' }
])
const levels = ref<Level[]>([])

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
    let c = `// Table created by CTools\n`

    if (method.value === 3 || method.value === 4) {
        c += `${tableVar.value} := createTable()\n`
        columns.value.forEach(col => {
            c += `${tableVar.value}.addColumn("${escapeString(col.header)}", "")`
            c += buildStyleChain(col)
            c += `\n`
        })
    } else {
        c += `${tableVar.value} := ${sourceList.value}.table()\n`
        columns.value.forEach(col => {
            if (method.value === 1) {
                c += `${tableVar.value}.addColumn(${col.prop})`
            } else {
                c += `${tableVar.value}.addColumn("${escapeString(col.header)}", ${col.prop})`
            }
            c += buildStyleChain(col)
            c += `\n`
        })
    }

    if (method.value === 3) {
        c += `\n// --- Population ---\n`
        c += `${sourceList.value}.foreach(item:\n`
        c += `    ${tableVar.value}.addRow(item, ${columns.value.map(c => 'item.' + c.prop).join(', ')})\n`
        c += `)\n`
    } else if (method.value === 4) {
        c += `\n// --- Hierarchy Population ---\n`
        c += generateNestedLoop(0)
    }

    c += `\n${tableVar.value}`

    return c
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

const generateNestedLoop = (levelIdx: number): string => {
    if (levelIdx >= levels.value.length) return ''
    const lvl = levels.value[levelIdx]
    const itemVar = levelIdx === 0 ? 'item' : `item_${levelIdx + 1}`
    const indent = "    ".repeat(levelIdx)
    
    let s = `${indent}${lvl ? lvl.source : ''}.foreach(${itemVar}:\n`
    
    // Auto-detect if prop needs prefix
    const rowProps = columns.value.map(c => {
        if (/^[a-zA-Z0-9_]+$/.test(c.prop)) return `${itemVar}.${c.prop}`
        return c.prop
    }).join(', ')

    s += `${indent}    ${tableVar.value}.addRow(${itemVar}, ${rowProps})`
    if (lvl && lvl.indent > 0) s += `.indent(${lvl.indent})`
    if (lvl && lvl.collapse) s += `.collapse()`
    s += `\n`

    s += generateNestedLoop(levelIdx + 1)
    s += `${indent})\n`
    return s
}

const copyResult = () => copy(scriptOutput.value, 'Generated Code')

</script>

<template>
    <div class="h-full flex flex-col md:flex-row overflow-hidden bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
        
        <!-- Left Panel: Config -->
        <div class="w-full md:w-1/2 flex flex-col border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 overflow-hidden">
            
            <!-- Global Config -->
            <div class="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 z-10 shrink-0 shadow-sm">
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
            <div class="flex-1 overflow-y-auto p-4 space-y-6 bg-grid-pattern">
                
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

                        <button @click="addLevel" class="w-full py-2 border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-900/50 rounded-lg text-slate-400 hover:text-indigo-500 text-xs font-bold transition-all flex items-center justify-center gap-2">
                            <Plus class="w-3 h-3" /> Add Nested Level
                        </button>
                    </div>
                </div>

                <!-- Columns -->
                <div class="space-y-3">
                    <label class="text-[10px] uppercase font-bold text-indigo-900 dark:text-indigo-300 tracking-wider flex items-center gap-2">
                        <Table class="w-3 h-3" /> Table Columns
                    </label>

                    <draggable 
                        v-model="columns" 
                        item-key="id"
                        handle=".drag-handle"
                        class="space-y-2"
                        :animation="200"
                    >
                        <template #item="{ element: col }">
                            <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm transition-all group">
                                <div class="flex items-center h-10">
                                    <!-- Drag Handle -->
                                    <div class="drag-handle w-8 h-full flex items-center justify-center text-slate-300 hover:text-indigo-500 cursor-grab active:cursor-grabbing border-r border-slate-100 dark:border-slate-700">
                                        <GripVertical class="w-3 h-3" />
                                    </div>

                                    <!-- Content -->
                                    <div class="flex-1 flex gap-2 px-3 items-center">
                                        <input v-model="col.header" :disabled="method === 1" class="flex-1 bg-transparent border-none text-xs font-bold text-slate-700 dark:text-slate-200 placeholder-slate-300 focus:outline-none" placeholder="Header Name" />
                                        <span class="text-[px] font-mono text-slate-300">::</span>
                                        <input v-model="col.prop" class="flex-1 bg-transparent border-none text-xs font-mono text-indigo-600 dark:text-indigo-400 placeholder-slate-300 focus:outline-none text-right" placeholder="prop" />
                                    </div>

                                    <!-- Controls -->
                                    <button @click="col.showSettings = !col.showSettings" :class="col.showSettings ? 'text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'text-slate-300 hover:text-indigo-500'" class="w-8 h-full flex items-center justify-center border-l border-slate-100 dark:border-slate-700 transition-colors">
                                        <Settings class="w-3 h-3" />
                                    </button>
                                    <button @click="removeColumn(columns.indexOf(col))" class="w-8 h-full flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 border-l border-slate-100 dark:border-slate-700 transition-colors">
                                        <Trash2 class="w-3 h-3" />
                                    </button>
                                </div>

                                <!-- Settings Panel -->
                                <div v-if="col.showSettings" class="border-t border-slate-100 dark:border-slate-700 p-2 bg-slate-50 dark:bg-slate-900/50 rounded-b-lg grid gap-3">
                                    <div class="flex justify-between items-center">
                                        <div class="flex rounded-md border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 p-0.5">
                                            <button @click="col.align = 'left'" :class="col.align === 'left' ? 'bg-slate-100 dark:bg-slate-700 text-indigo-500' : 'text-slate-400'" class="p-1 rounded"><AlignLeft class="w-3 h-3" /></button>
                                            <button @click="col.align = 'center'" :class="col.align === 'center' ? 'bg-slate-100 dark:bg-slate-700 text-indigo-500' : 'text-slate-400'" class="p-1 rounded"><AlignCenter class="w-3 h-3" /></button>
                                            <button @click="col.align = 'right'" :class="col.align === 'right' ? 'bg-slate-100 dark:bg-slate-700 text-indigo-500' : 'text-slate-400'" class="p-1 rounded"><AlignRight class="w-3 h-3" /></button>
                                        </div>

                                        <div class="flex gap-1">
                                            <button @click="toggleStyle(col, 'separator')" :class="col.styles.includes('separator') ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600' : 'bg-white dark:bg-slate-800 text-slate-400'" class="px-2 py-1 rounded text-[10px] font-bold border border-slate-200 dark:border-slate-600">|</button>
                                            <button @click="toggleStyle(col, 'hidden')" :class="col.styles.includes('hidden') ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600' : 'bg-white dark:bg-slate-800 text-slate-400'" class="p-1 rounded border border-slate-200 dark:border-slate-600"><EyeOff class="w-3 h-3" /></button>
                                            <button @click="toggleStyle(col, 'wrapped')" :class="col.styles.includes('wrapped') ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600' : 'bg-white dark:bg-slate-800 text-slate-400'" class="p-1 rounded border border-slate-200 dark:border-slate-600"><WrapText class="w-3 h-3" /></button>
                                            <button @click="toggleStyle(col, 'readonly')" :class="col.styles.includes('readonly') ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600' : 'bg-white dark:bg-slate-800 text-slate-400'" class="p-1 rounded border border-slate-200 dark:border-slate-600"><Lock class="w-3 h-3" /></button>
                                        </div>
                                    </div>

                                    <div class="border-t border-slate-200 dark:border-slate-700 pt-2 flex flex-wrap gap-2">
                                        <button @click="col.format = ''" :class="col.format === '' ? 'bg-indigo-50 dark:bg-indigo-900 text-indigo-600 ring-1 ring-indigo-200' : 'bg-white dark:bg-slate-800 text-slate-400 border border-slate-200'" class="px-2 py-1 rounded text-[10px] font-bold">Text</button>
                                        
                                        <button @click="col.format = 'decimals(0)'" :class="col.format === 'decimals(0)' ? 'bg-indigo-50 dark:bg-indigo-900 text-indigo-600 ring-1 ring-indigo-200' : 'bg-white dark:bg-slate-800 text-slate-400 border border-slate-200'" class="px-2 py-1 rounded text-[10px] font-bold">123</button>
                                        
                                        <button @click="col.format = 'decimals(2)'" :class="col.format === 'decimals(2)' ? 'bg-indigo-50 dark:bg-indigo-900 text-indigo-600 ring-1 ring-indigo-200' : 'bg-white dark:bg-slate-800 text-slate-400 border border-slate-200'" class="px-2 py-1 rounded text-[10px] font-bold">.00</button>
                                        
                                        <button @click="col.format = 'formatType(PERCENTAGE)'" :class="col.format === 'formatType(PERCENTAGE)' ? 'bg-indigo-50 dark:bg-indigo-900 text-indigo-600 ring-1 ring-indigo-200' : 'bg-white dark:bg-slate-800 text-slate-400 border border-slate-200'" class="px-2 py-1 rounded text-[10px] font-bold">%</button>
                                        
                                        <button @click="col.format = 'formatType(DATE)'" :class="col.format === 'formatType(DATE)' ? 'bg-indigo-50 dark:bg-indigo-900 text-indigo-600 ring-1 ring-indigo-200' : 'bg-white dark:bg-slate-800 text-slate-400 border border-slate-200'" class="px-2 py-1 rounded text-[10px] font-bold">Date</button>
                                        
                                        <button @click="col.format = 'formatType(THOUSANDS).postfix(\' €\')'" :class="col.format.includes('postfix') ? 'bg-indigo-50 dark:bg-indigo-900 text-indigo-600 ring-1 ring-indigo-200' : 'bg-white dark:bg-slate-800 text-slate-400 border border-slate-200'" class="px-2 py-1 rounded text-[10px] font-bold">€</button>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </draggable>

                    <button @click="addColumn" class="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 font-bold text-sm">
                        <Plus class="w-4 h-4" /> Add Column
                    </button>
                </div>
            </div>
        </div>

        <!-- Right Panel: Code -->
        <div class="w-full md:w-1/2 bg-slate-900 flex flex-col relative border-l border-slate-800 shadow-2xl z-20">
            <div class="p-4 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Code class="w-4 h-4" /> Generated Code
                </span>
                <button @click="copyResult" class="text-emerald-400 hover:text-emerald-300 text-xs font-bold flex items-center gap-1">
                    <Copy class="w-3 h-3" /> Copy
                </button>
            </div>
        </div>
            <textarea readonly :value="scriptOutput" class="flex-1 w-full bg-slate-950 p-4 font-mono text-[10px] text-slate-300 resize-none outline-none leading-relaxed"></textarea>
        </div>
    </div>
</template>
