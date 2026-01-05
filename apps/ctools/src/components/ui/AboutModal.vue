<script setup lang="ts">
import { X } from 'lucide-vue-next'

defineProps<{
    isOpen: boolean
}>()

const emit = defineEmits<{
    (e: 'close'): void
}>()
</script>

<template>
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center pointer-events-none p-4">
        
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-background/80 backdrop-blur-sm pointer-events-auto transition-opacity duration-300" @click="emit('close')"></div>

        <!-- Modal Content (Datasheet Style) -->
        <div class="w-full max-w-md bg-layer-01 border border-border-strong rounded-none shadow-2xl pointer-events-auto transform transition-all duration-300 relative">
            
            <!-- Decorative Grid Lines -->
            <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-interactive-01 to-purple-600"></div>
            <div class="absolute bottom-4 right-4 text-[100px] leading-none font-bold text-text-primary opacity-[0.03] select-none pointer-events-none">CT</div>

            <!-- Header -->
            <div class="flex items-start justify-between p-6 pb-2">
                <div>
                    <h2 class="text-2xl font-sans font-bold text-text-primary tracking-tight">Information</h2>
                    <div class="flex items-center gap-2 mt-1">
                        <span class="px-1.5 py-0.5 bg-interactive-01/10 text-interactive-01 text-[10px] font-bold font-mono uppercase tracking-widest border border-interactive-01/20">v1.02</span>
                    </div>
                </div>

                <button @click="emit('close')" class="group p-2 -mr-2 -mt-2 hover:bg-layer-02 transition-colors">
                    <X class="w-6 h-6 text-text-secondary group-hover:text-interactive-01" />
                </button>
            </div>

            <!-- Data Content -->
            <div class="p-6 pt-2 space-y-6">
                
                <!-- Description -->
                <div class="font-sans text-sm leading-relaxed text-text-secondary">
                    <p>CTools is a specialized suite of utilities designed to streamline the workflow for Corporater implementation consultants and developers.</p>
                </div>

                <!-- Footer Info -->
                <div class="space-y-3 pt-4 border-t border-border-subtle">
                    <div class="flex items-center justify-between text-xs">
                        <span class="text-text-secondary">Contact</span>
                        <a href="mailto:tassiloDheinemann@gmail.com" class="text-interactive-01 hover:underline">tassiloDheinemann@gmail.com</a>
                    </div>
                    
                    <p class="text-[10px] text-text-disabled uppercase tracking-wider text-center pt-4 opacity-70">
                        Independent Utility • Not Affiliated with Corporater AS
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>
