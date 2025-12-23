<script setup lang="ts">
import { X, Globe, Mail } from 'lucide-vue-next'

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
                <p class="lead">
                    CTools is a specialized suite of utilities designed to streamline the workflow for Corporater implementation consultants and developers.
                </p>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                    <div>
                        <h4 class="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">The Suite</h4>
                        <ul class="space-y-2 text-slate-600 dark:text-slate-400">
                            <li><strong>Colorset Builder:</strong> Create, manage, and generate color palettes with automatic script export.</li>
                            <li><strong>Layout Builder:</strong> Visual designer for complex Corporater layouts (Tabs, Rows, Columns).</li>
                            <li><strong>Process Tool:</strong> BPMN editor with extended attributes for Camunda integration.</li>
                            <li><strong>Table Builder:</strong> Configure Extended Tables with hierarchical headers and properties.</li>
                            <li><strong>SVG Tuner:</strong> Optimize, colorize, and fix SVG assets for dashboards.</li>
                            <li><strong>Image Upload:</strong> Convert images to Base64 resources optimized for Corporater.</li>
                        </ul>
                    </div>

                    <div>
                         <h4 class="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">Resources</h4>
                         <div class="space-y-3">
                             <a href="#" class="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:underline">
                                 <Globe class="w-4 h-4" /> Official Documentation
                             </a>
                             <a href="#" class="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:underline">
                                 <Mail class="w-4 h-4" /> Support Contact
                             </a>
                         </div>
                         
                         <div class="mt-6 p-4 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-100 dark:border-slate-800 text-xs text-slate-500">
                             <p><strong>Version:</strong> 2.0.0 (Suite Edition)</p>
                             <p class="mt-1">Built with Vue 3, Vite, Tailwind CSS, and simple, efficient code.</p>
                         </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>
