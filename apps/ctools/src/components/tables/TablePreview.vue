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

const props = defineProps<{
    columns: Column[]
}>()

// Dummy data generation
const dummyRows = computed(() => {
    return [
        { id: 1, name: 'Project Alpha', description: 'Q1 Key Initiative', status: 'Active', value: 125000 },
        { id: 2, name: 'Maintenance B', description: 'Routine checkup', status: 'Pending', value: 4500 },
        { id: 3, name: 'Campaign C', description: 'Marketing Q2', status: 'Draft', value: 0 }
    ]
})

const getCellContent = (col: Column, row: any) => {
    // Basic property lookup or dummy fallback
    const key = col.prop.toLowerCase()
    if (row[key] !== undefined) return row[key]
    
    // Guess based on prop name
    if (key.includes('date')) return '2024-01-01'
    if (key.includes('user') || key.includes('author')) return 'John Doe'
    if (key.includes('pct') || key.includes('percent')) return '75%'
    
    return `[${col.prop}]`
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

</script>

<template>
    <div class="w-full overflow-auto rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
        <table class="w-full text-sm text-left">
            <thead class="bg-slate-50 dark:bg-slate-800 text-xs uppercase font-bold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                <tr>
                    <th v-for="col in columns" :key="col.id" 
                        class="px-4 py-3 tracking-wider transition-colors"
                        :class="getHeaderClass(col)">
                        {{ col.header || '(No Header)' }}
                    </th>
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                <tr v-for="row in dummyRows" :key="row.id" class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td v-for="col in columns" :key="col.id" 
                        class="px-4 py-2.5"
                        :class="getCellClass(col)">
                        {{ getCellContent(col, row) }}
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
