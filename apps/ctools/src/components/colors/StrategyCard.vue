<script setup lang="ts">

const props = defineProps<{
    modelValue: boolean
    title: string
    description: string
    icon?: any
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', val: boolean): void
    (e: 'select'): void
}>()

</script>

<template>
    <button @click="emit('select')" 
        class="flex flex-col text-left group transition-all duration-200 border relative overflow-hidden bg-layer-02 hover:bg-layer-01"
        :class="modelValue ? 'border-interactive-01 ring-1 ring-interactive-01 z-10' : 'border-border-subtle hover:border-border-strong'"
    >
        <div class="p-3">
            <div class="flex items-center gap-2 mb-1.5" :class="modelValue ? 'text-interactive-01' : 'text-text-primary'">
                <component :is="icon" v-if="icon" class="w-4 h-4" />
                <span class="text-xs font-bold uppercase tracking-wider">{{ title }}</span>
            </div>
            <p class="text-[10px] text-text-secondary leading-relaxed">{{ description }}</p>
        </div>
        
        <!-- Selection Indicator -->
        <div class="h-0.5 w-full bg-interactive-01 transform origin-left transition-transform duration-200"
             :class="modelValue ? 'scale-x-100' : 'scale-x-0'"></div>
    </button>
</template>
