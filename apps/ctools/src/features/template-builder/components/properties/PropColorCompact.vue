<script setup lang="ts">
const props = defineProps<{
    modelValue: string | undefined
    label?: string
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
}>()
</script>

<template>
    <div class="flex items-center justify-between gap-1.5 w-full">
        <label v-if="label" class="text-[10px] text-text-secondary uppercase select-none shrink">
            {{ label }}
        </label>
        <div class="flex items-center gap-1.5 min-w-0">
            <span class="text-[9px] font-mono text-text-primary truncate hidden xl:block">{{ modelValue || 'None' }}</span>
            <div class="relative w-5 h-5 border border-border-subtle overflow-hidden shrink-0 hover:border-interactive-01 transition-colors bg-layer-01">
                <div class="absolute inset-0" :style="{ backgroundColor: modelValue || 'transparent' }"></div>
                <!-- Checkerboard for transparency -->
                <div v-if="!modelValue" class="absolute inset-0 opacity-20" style="background-image: radial-gradient(black 1px, transparent 0); background-size: 4px 4px;"></div>
                
                <input 
                    type="color" 
                    :value="modelValue || '#ffffff'"
                    @input="(e) => emit('update:modelValue', (e.target as HTMLInputElement).value)"
                    class="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] p-0 m-0 border-0 cursor-pointer opacity-0"
                />
            </div>
        </div>
    </div>
</template>
