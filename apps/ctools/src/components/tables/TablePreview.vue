<script setup lang="ts">
import { computed } from 'vue'

interface Column {
    id: string
    header: string
    prop: string
    align: 'left' | 'center' | 'right'
    styles: string[]
    format: string
}

interface Level {
    id: string
    source: string
    indent: number
    collapse: boolean
}

const props = defineProps<{
    columns: Column[]
    isHierarchy?: boolean
    levels?: Level[]
}>()

// Dummy data generation
const dummyRows = computed(() => {
    if (props.isHierarchy && props.levels) {
        if (props.levels.length === 0) return []
        // Generate rows based on configured levels
        return props.levels.map((lvl, index) => ({
            id: index + 100,
            name: index === 0 ? 'Root Loop' : `Level ${index} Item`,
            description: `Source: ${lvl.source}`,
            status: lvl.collapse ? 'Collapsed' : 'Expanded',
            value: 1000 * (index + 1),
            indent: lvl.indent
        }))
    }

    // Default static data for non-hierarchy modes
    return [
        { id: 1, name: 'Project Alpha', description: 'Q1 Key Initiative', status: 'Active', value: 125000, indent: 0 },
        { id: 2, name: 'Phase 1: Research', description: 'Initial discovery', status: 'Done', value: 25000, indent: 1 },
        { id: 3, name: 'Phase 2: Development', description: 'Core implementation', status: 'In Progress', value: 100000, indent: 1 },
        { id: 4, name: 'Frontend', description: 'Vue.js Application', status: 'In Progress', value: 60000, indent: 2 },
        { id: 5, name: 'Backend', description: 'API Services', status: 'Pending', value: 40000, indent: 2 }
    ]
})

const getCellContent = (col: Column, row: any) => {
    // Basic property lookup
    const key = col.prop.toLowerCase()
    if (row[key] !== undefined) return row[key]
    
    // Fallback format: _prop 01_
    const num = String(row.id).padStart(2, '0') // simple unique number from row id
    return `_${col.prop} ${num}_`
}

const getHeaderClass = (col: Column) => {
    const classes = []
    if (col.align === 'center') classes.push('text-center')
    if (col.align === 'right') classes.push('text-right')
    
    if (col.styles.includes('hidden')) classes.push('opacity-30 bg-slate-100 dark:bg-slate-800 line-through decoration-slate-400')
    if (col.styles.includes('separator')) classes.push('border-r-4 border-slate-300 dark:border-slate-600')
    
    return classes.join(' ')
}

const getCellClass = (col: Column) => {
    const classes = []
    if (col.align === 'center') classes.push('text-center')
    if (col.align === 'right') classes.push('text-right')
    
    // Visual indicators for styles
    if (col.styles.includes('bold')) classes.push('font-bold')
    if (col.styles.includes('hidden')) classes.push('opacity-30 bg-slate-50 dark:bg-slate-900/50')
    if (col.styles.includes('separator')) classes.push('border-r-4 border-slate-300 dark:border-slate-600')
    if (col.styles.includes('wrapped')) classes.push('whitespace-normal break-words')
    else classes.push('whitespace-nowrap')

    return classes.join(' ')
}

const getCellStyle = (_col: Column, row: any, index: number) => {
    // Apply indentation to first column only AND only if Hierarchy mode is active
    const indent = Number(row.indent) || 0
    if (props.isHierarchy && index === 0 && indent > 0) {
        return { paddingLeft: `${1 + (indent * 1.5)}rem` }
    }
    return {}
}

</script>

<template>
    <div class="w-full overflow-hidden rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
        <table class="w-full text-sm text-left border-collapse">
            <thead class="bg-slate-100 dark:bg-slate-800 text-xs uppercase font-bold text-slate-600 dark:text-slate-400 border-b border-slate-300 dark:border-slate-700">
                <tr>
                    <th v-for="col in columns" :key="col.id" 
                        class="px-4 py-3 tracking-wider transition-colors border-r last:border-r-0 border-slate-200 dark:border-slate-700"
                        :class="getHeaderClass(col)">
                        {{ col.header || '(No Header)' }}
                    </th>
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                <tr v-for="row in dummyRows" :key="row.id" class="transition-colors even:bg-slate-50 dark:even:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700/50">
                    <td v-for="(col, index) in columns" :key="col.id" 
                        class="px-4 py-2.5 transition-all border-r last:border-r-0 border-slate-200 dark:border-slate-700"
                        :class="getCellClass(col) + (String(getCellContent(col, row)).startsWith('_') ? ' italic text-slate-400' : '')"
                        :style="getCellStyle(col, row, index)">
                        {{ String(getCellContent(col, row)).replace(/_/g, '') }}
                    </td>
                </tr>
            </tbody>
        </table>
        
        <!-- Empty State -->
        <div v-if="columns.length === 0" class="p-8 text-center text-slate-400 text-xs uppercase tracking-widest font-bold">
            No Columns Defined
        </div>
    </div>
</template>
