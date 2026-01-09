<script setup lang="ts">
const props = defineProps<{
    modelValue: any
    options: any[]
    label?: string
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: any): void
}>()
</script>

<template>
    <div class="space-y-1">
        <label v-if="label" class="text-[10px] text-text-secondary uppercase">{{ label }}</label>
        <div class="flex border border-border-subtle bg-layer-01">
            <button 
                v-for="opt in options" 
                :key="opt"
                @click="emit('update:modelValue', opt)"
                class="flex-1 px-2 py-1.5 text-[10px] font-medium transition-colors border-r border-border-subtle last:border-r-0 focus:outline-none focus:bg-layer-hover"
                :class="[
                    modelValue === opt 
                        ? 'bg-interactive-01 text-white' 
                        : 'text-text-secondary hover:text-text-primary hover:bg-layer-hover'
                ]"
            >
                {{ opt }}
            </button>
        </div>
    </div>
</template>
