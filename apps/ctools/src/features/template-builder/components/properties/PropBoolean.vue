<script setup lang="ts">

const props = defineProps<{
    modelValue: boolean
    label: string
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
}>()

const toggle = () => emit('update:modelValue', !props.modelValue)
</script>

<template>
    <button 
        @click="toggle"
        class="flex items-center justify-between w-full group py-1"
        :title="label"
    >
        <span class="text-[10px] text-text-secondary group-hover:text-text-primary transition-colors text-left">{{ label }}</span>
        <!-- Carbon Toggle: strict visuals -->
        <div 
            class="w-8 h-4 relative transition-colors border rounded-none"
             :class="modelValue ? 'bg-interactive-01 border-transparent' : 'bg-layer-03 border-border-strong group-hover:border-text-secondary'"
        >
            <div 
                class="absolute top-0.5 bottom-0.5 w-3 bg-white transition-transform duration-100"
                :class="modelValue ? 'translate-x-[18px]' : 'translate-x-0.5'"
            ></div>
        </div>
    </button>
</template>
