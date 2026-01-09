<script setup lang="ts">
import { Copy, Code } from 'lucide-vue-next'
import { useClipboard } from '../../composables/useClipboard'

const props = withDefaults(defineProps<{
    title?: string
    code: string
    language?: string
    editable?: boolean
}>(), {
    editable: false
})

const emit = defineEmits(['update:code'])

const { copy } = useClipboard()

const copyCode = () => {
    copy(props.code, props.title || 'Code')
}

const onInput = (e: Event) => {
    if (props.editable) {
        emit('update:code', (e.target as HTMLTextAreaElement).value)
    }
}
</script>

<template>
    <div class="flex flex-col h-full bg-layer-01 border-l border-border-subtle">
        <!-- Header -->
        <div class="px-6 py-4 bg-layer-01 border-b border-border-subtle flex justify-between items-center shrink-0">
             <div class="flex items-center gap-2">
                 <slot name="icon">
                     <Code class="w-4 h-4 text-text-secondary" />
                 </slot>
                 <span class="text-xs font-bold text-text-secondary uppercase tracking-wider">
                     {{ title || 'Generated Code' }}
                 </span>
             </div>
             
             <!-- Center Slot -->
             <div class="flex-1 px-4 flex justify-center">
                 <slot name="header-center"></slot>
             </div>
             
             <div class="flex items-center gap-4">
                <slot name="actions"></slot>
                <button @click="copyCode" class="text-interactive-01 hover:text-interactive-01-hover text-xs font-bold flex items-center gap-1 transition-colors">
                    <Copy class="w-3 h-3" /> Copy
                </button>
             </div>
        </div>

        <!-- Code Area -->
        <div class="flex-1 relative min-h-0">
            <textarea 
                :value="code"
                @input="onInput"
                :readonly="!editable" 
                class="w-full h-full bg-layer-02 p-4 font-mono text-[10px] text-text-primary resize-none outline-none leading-relaxed custom-scroll border-none focus:ring-0"
                :class="{ 'focus:ring-1 focus:ring-interactive-01': editable }"
                spellcheck="false"
            ></textarea>
        </div>
    </div>
</template>

<style scoped>
.custom-scroll::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
.custom-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scroll::-webkit-scrollbar-thumb {
  background-color: var(--layer-03);
  border-radius: 9999px;
  border: 3px solid transparent;
  background-clip: content-box;
}
.custom-scroll::-webkit-scrollbar-corner {
  background: transparent;
}
</style>
