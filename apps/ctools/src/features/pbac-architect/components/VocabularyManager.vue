<script setup lang="ts">
import { ref } from 'vue'
import { Plus, Trash2, ArrowDownAZ, ArrowUpAZ, ArrowUpDown } from 'lucide-vue-next'
import BaseButton from '../../../components/ui/BaseButton.vue'
import BaseInput from '../../../components/ui/BaseInput.vue'
import type { Vocabulary } from '../types'

const props = defineProps<{
    modelValue: Vocabulary
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', val: Vocabulary): void
}>()

// Local state for inputs
const inputs = ref({
    roles: '',
    types: '',
    properties: ''
})

type SortOrder = 'asc' | 'desc' | 'none'
const sorts = ref<Record<keyof Vocabulary, SortOrder>>({
    roles: 'none',
    types: 'none',
    properties: 'none'
})

const addItem = (category: keyof Vocabulary) => {
    const val = inputs.value[category].trim()
    if (!val) return

    const newVocab = { ...props.modelValue }
    newVocab[category] = [...newVocab[category], val]
    
    emit('update:modelValue', newVocab)
    inputs.value[category] = ''
}

const removeItem = (category: keyof Vocabulary, val: string) => {
    const newVocab = { ...props.modelValue }
    newVocab[category] = newVocab[category].filter(i => i !== val)
    emit('update:modelValue', newVocab)
}

const toggleSort = (category: keyof Vocabulary) => {
    const modes: SortOrder[] = ['none', 'asc', 'desc']
    const nextIdx = (modes.indexOf(sorts.value[category] || 'none') + 1) % modes.length
    sorts.value[category] = modes[nextIdx]!
}

const getSortedItems = (category: keyof Vocabulary) => {
    const items = [...props.modelValue[category]]
    const sort = sorts.value[category]
    
    if (sort === 'asc') items.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
    if (sort === 'desc') items.sort((a, b) => b.toLowerCase().localeCompare(a.toLowerCase()))
    
    return items
}
</script>

<template>
    <div class="p-6 bg-layer-01 h-full overflow-hidden flex flex-col">
        <h2 class="text-2xl font-light mb-6 text-text-primary shrink-0">Vocabulary Manager</h2>
        
        <div class="flex gap-6 flex-1 min-h-0 overflow-x-auto pb-2">
            <!-- Sections -->
            <div v-for="cat in (['roles', 'properties', 'types'] as const)" :key="cat" 
                 class="flex-1 flex flex-col min-w-[300px] bg-layer-02 border border-border-subtle shadow-sm h-full rounded-sm overflow-hidden">
                
                <!-- Header -->
                <div class="p-4 border-b border-border-subtle flex flex-col gap-3 bg-layer-01">
                    <div class="flex justify-between items-center">
                        <h3 class="text-sm font-bold text-text-primary uppercase tracking-wide">
                            {{ cat }} 
                            <span class="text-text-tertiary font-normal normal-case">({{ modelValue[cat].length }})</span>
                        </h3>
                        <button @click="toggleSort(cat)" class="text-text-tertiary hover:text-interactive-01 p-1 rounded-sm transition-colors" title="Sort">
                            <ArrowUpDown v-if="sorts[cat] === 'none'" class="w-4 h-4" />
                            <ArrowDownAZ v-if="sorts[cat] === 'asc'" class="w-4 h-4" />
                            <ArrowUpAZ v-if="sorts[cat] === 'desc'" class="w-4 h-4" />
                        </button>
                    </div>
                    
                    <div class="flex gap-2">
                        <BaseInput 
                            v-model="inputs[cat]" 
                            class="flex-1" 
                            size="sm"
                            :placeholder="cat === 'roles' ? 'e.g. role:auditor' : cat === 'types' ? 'e.g. CeIncident' : 'e.g. resource.name'"
                            @keydown.enter="addItem(cat)"
                        />
                        <BaseButton size="sm" variant="solid" class="w-8 px-0" @click="addItem(cat)">
                            <Plus class="w-4 h-4" />
                        </BaseButton>
                    </div>
                </div>

                <!-- List -->
                <div class="flex-1 overflow-y-auto p-2 space-y-1">
                    <div v-for="item in getSortedItems(cat)" :key="item" 
                         class="flex justify-between items-center text-sm p-2 bg-layer-01 hover:bg-interactive-01/10 border-l-2 border-transparent hover:border-interactive-01 group transition-colors rounded-r-sm">
                        <span class="font-mono text-text-secondary truncate" :title="item">{{ item }}</span>
                        <button @click="removeItem(cat, item)" class="text-text-disabled hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1">
                            <Trash2 class="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
