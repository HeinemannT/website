<script setup lang="ts">
import { ref, provide, toRef } from 'vue'
import type { Vocabulary } from '../types'
import InteractiveJsonNode from './InteractiveJsonNode.vue'

const props = defineProps<{
    modelValue: any
    vocab: Vocabulary
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', val: any): void
}>()

const editPath = ref<string | null>(null)

const setEditPath = (path: string | null) => {
    editPath.value = path
}

const handleUpdate = (path: string, newValue: any) => {
    if (newValue === undefined) return

    // Clone data
    const newData = JSON.parse(JSON.stringify(props.modelValue))
    
    // Remove 'root.' prefix
    const cleanPath = path.startsWith('root.') ? path.slice(5) : path
    if (!cleanPath) return

    const keys = cleanPath.split('.')
    let current = newData
    
    // Navigate to parent
    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i] as string
        if (current[key] === undefined) return
        current = current[key]
    }
    
    // Parse Value
    let finalValue = newValue
    
    // Type conversion logic (mimicking legacy)
    if (typeof newValue === 'string') {
            const trimmed = newValue.trim()
            if (trimmed === 'true') finalValue = true
            else if (trimmed === 'false') finalValue = false
            else if (!isNaN(Number(trimmed)) && trimmed !== '') finalValue = Number(trimmed)
            else if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
                try {
                    const jsonFriendly = trimmed.replace(/'/g, '"')
                    finalValue = JSON.parse(jsonFriendly)
                } catch (e) {
                    finalValue = trimmed.slice(1, -1).split(',').map((s:string) => s.trim().replace(/['"]/g, ''))
                }
            }
    }

    // Assign
    const lastKey = keys[keys.length - 1] as string
    if (current && lastKey) {
        current[lastKey] = finalValue
        emit('update:modelValue', newData)
    }
}

provide('interactiveJson', {
    editPath,
    setEditPath,
    handleUpdate,
    vocab: toRef(props, 'vocab')
})
</script>

<template>
    <div class="font-mono text-[13px] leading-6 text-[#d4d4d4] select-text p-2 bg-[#1e1e1e] flex min-h-0 h-full overflow-auto custom-scrollbar whitespace-nowrap">
        <!-- Line Numbers (Static for now) -->
        <div class="text-[#858585] text-right pr-4 select-none opacity-50 border-r border-[#404040] mr-4 h-full shrink-0">
             <div v-for="i in 30" :key="i">{{ i }}</div>
        </div>
        
        <div class="flex-1">
            <InteractiveJsonNode 
                :data="modelValue" 
                path="root" 
                :is-last="true" 
                :level="0" 
            />
        </div>
    </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #1e1e1e; 
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #424242; 
  border: 2px solid #1e1e1e;
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #4f4f4f; 
}
</style>
