<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
    Layout, 
    File, 
    BarChart3, 
    Table as TableIcon, 
    Type,
    ChevronDown,
    ChevronRight
} from 'lucide-vue-next'
import { INVENTORY, type InventoryItem } from '../constants'
import { TOOLS } from '@config/tools'

const tool = TOOLS.find(t => t.id === 'template')!

// State
const expandedCategories = ref<Record<string, boolean>>({
    'Charts': true,
    'Tables': true,
    'Misc': true,
    'Input': true
})

const toggleCategory = (cat: string) => {
    expandedCategories.value[cat] = !expandedCategories.value[cat]
}

// Grouping Logic
const inventoryGroups = computed(() => {
    const groups: Record<string, InventoryItem[]> = {}
    INVENTORY.forEach(item => {
        if (item.category === 'Pages') return // Skip Pages
        const cat = item.category
        if (!groups[cat]) groups[cat] = []
        groups[cat].push(item)
    })
    return groups
})

// Helper for Icons
const getIcon = (id: string, type?: string) => {
    if (type === 'page') return File
    if (id.includes('Chart')) return BarChart3
    if (id.includes('Table')) return TableIcon
    if (id.includes('Text')) return Type
    return Layout
}

const onDragStart = (e: DragEvent, item: InventoryItem) => {
    if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = 'copy'
        e.dataTransfer.setData('application/json', JSON.stringify(item))
        // Set drag image? Browser default is usually fine for this context
    }
}
</script>

<template>
    <div class="h-full flex flex-col bg-layer-01">
        <div class="px-4 py-3 border-b border-border-interactive bg-layer-01 shrink-0">
            <h3 class="text-xs font-bold uppercase tracking-widest text-text-secondary">Components</h3>
        </div>
        
        <div class="flex-1 overflow-y-auto p-2">
            
            <div v-for="(items, category) in inventoryGroups" :key="category" class="mb-1">
                <!-- Accordion Header -->
                <button 
                    @click="toggleCategory(category as string)"
                    class="w-full flex items-center gap-2 px-2 py-1.5 text-xs font-semibold text-text-primary hover:bg-layer-02 rounded transition-colors select-none"
                >
                    <component :is="expandedCategories[category] ? ChevronDown : ChevronRight" class="w-3 h-3 text-text-secondary" />
                    {{ category }}
                </button>

                <!-- List -->
                <div v-if="expandedCategories[category]" class="mt-1 ml-2 space-y-1">
                    <div 
                        v-for="element in items"
                        :key="element.id"
                        draggable="true"
                        @dragstart="(e) => onDragStart(e, element)"
                        class="flex items-center gap-2 px-2 py-1.5 rounded cursor-grab active:cursor-grabbing select-none group border border-transparent transition-all hover:shadow-sm"
                        :class="[tool.borderClass, 'hover:bg-white dark:hover:bg-layer-03']"
                    >
                        <div class="w-5 h-5 flex items-center justify-center bg-layer-02 group-hover:bg-layer-01 rounded shrink-0">
                            <component :is="getIcon(element.id)" class="w-3 h-3" :class="tool.color" />
                        </div>
                        <span class="text-[11px] font-medium text-text-primary truncate">{{ element.label }}</span>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>
