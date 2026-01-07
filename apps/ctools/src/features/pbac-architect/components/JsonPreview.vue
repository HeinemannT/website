<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
    data: any
}>()

const jsonValues = computed(() => {
    return JSON.stringify(props.data, null, 4)
})
</script>

<template>
    <div class="h-full w-full relative group">
        <textarea 
            readonly
            class="w-full h-full bg-layer-02 text-[11px] font-mono p-4 resize-none border-none outline-none text-text-secondary selection:bg-interactive-01/30 custom-scrollbar"
            :value="jsonValues"
        ></textarea>
        <!-- Simple copy hint -->
        <div class="absolute top-2 right-2 bg-layer-01 border border-border-subtle px-2 py-1 text-[10px] text-text-tertiary rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Read-only Preview
        </div>
    </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent; 
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: var(--layer-03); 
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: var(--interactive-01); 
}
</style>
