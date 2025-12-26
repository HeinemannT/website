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
    <div class="flex flex-col h-full bg-slate-100 dark:bg-slate-950/50 border-l border-slate-200 dark:border-slate-800">
        <!-- Header -->
        <div class="px-6 py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center shrink-0">
             <div class="flex items-center gap-2">
                 <slot name="icon">
                     <Code class="w-4 h-4 text-slate-400" />
                 </slot>
                 <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">
                     {{ title || 'Generated Code' }}
                 </span>
             </div>
             
             <div class="flex items-center gap-4">
                <slot name="actions"></slot>
                <button @click="copyCode" class="text-indigo-500 hover:text-indigo-400 text-xs font-bold flex items-center gap-1 transition-colors">
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
                class="w-full h-full bg-slate-50 dark:bg-[#0d1117] p-4 font-mono text-[10px] text-emerald-600 dark:text-emerald-400 resize-none outline-none leading-relaxed custom-scroll"
                :class="{ 'focus:ring-1 focus:ring-indigo-500/50': editable }"
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
  @apply bg-slate-300 dark:bg-slate-700 rounded-full border-[3px] border-solid border-transparent bg-clip-content;
}
.custom-scroll::-webkit-scrollbar-corner {
  background: transparent;
}
</style>
