<script setup lang="ts">

const props = withDefaults(defineProps<{
    modelValue: number
    max?: number
    label?: string
}>(), {
    max: 6 // Mismatch fix: Default to 6 columns
})

const emit = defineEmits<{
    (e: 'update:modelValue', value: number): void
}>()
</script>

<template>
    <div class="space-y-1">
        <div class="flex justify-between text-[10px] text-text-secondary uppercase">
            <span>{{ label }}</span>
            <span class="font-mono">{{ modelValue }} / {{ max }}</span>
        </div>
        <div class="flex gap-px h-6 bg-layer-02 border border-border-subtle">
            <button 
                v-for="i in max" 
                :key="i"
                @click="emit('update:modelValue', i)"
                class="flex-1 h-full transition-all focus:outline-none ring-inset"
                :class="[
                    i <= modelValue ? 'bg-interactive-01 ring-1 ring-interactive-01' : 'bg-transparent hover:bg-layer-hover'
                ]"
            />
        </div>
        <div class="flex justify-between text-[8px] text-text-disabled uppercase tracking-wider">
            <span>Min</span>
            <span>Max</span>
        </div>
    </div>
</template>
