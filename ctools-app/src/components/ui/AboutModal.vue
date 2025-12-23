<script setup lang="ts">
import { X, Mail } from 'lucide-vue-next'

defineProps<{
    isOpen: boolean
}>()

const emit = defineEmits<{
    (e: 'close'): void
}>()
</script>

<template>
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-end justify-center pointer-events-none">
        
        <!-- Backdrop (Click to close) -->
        <div class="absolute inset-0 bg-black/20 backdrop-blur-sm pointer-events-auto transition-opacity duration-300" @click="emit('close')"></div>

        <!-- Modal Content (Lower Third) -->
        <div class="w-full max-w-4xl max-h-[40vh] bg-white dark:bg-slate-900 border-t border-x border-slate-200 dark:border-slate-700 rounded-t-2xl shadow-2xl transform transition-transform duration-300 pointer-events-auto flex flex-col overflow-hidden">
            
            <!-- Header -->
            <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur">
                <h3 class="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <span class="w-6 h-6 bg-gradient-to-br from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 rounded text-[10px] text-white dark:text-slate-900 flex items-center justify-center font-bold">CT</span>
                    About CTools
                </h3>
                <button @click="emit('close')" class="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-500">
                    <X class="w-5 h-5" />
                </button>
            </div>

            <!-- Content -->
            <div class="flex-1 overflow-y-auto p-8 prose dark:prose-invert prose-sm max-w-none">
                <p class="text-base text-slate-600 dark:text-slate-300">
                    CTools is a specialized suite of utilities designed to streamline the workflow for Corporater implementation consultants and developers.
                </p>
                
                <div class="mt-8 space-y-8">
                    <div>
                        <h4 class="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">Changelog</h4>
                        <div class="space-y-4">
                            <div class="border-l-2 border-indigo-500 pl-3">
                                <span class="text-xs font-bold text-indigo-600 dark:text-indigo-400">v2.0.0 (Suite Edition)</span>
                                <p class="text-xs text-slate-500 mt-1">Consolidated individual tools into a single unified application suite.</p>
                            </div>
                        </div>
                    </div>

                    <div>
                         <h4 class="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">Contact</h4>
                         <a href="mailto:tassiloDheinemann@gmail.com" class="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:underline">
                             <Mail class="w-4 h-4" /> tassiloDheinemann@gmail.com
                         </a>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>
