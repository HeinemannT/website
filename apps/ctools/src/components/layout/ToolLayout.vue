<script setup lang="ts">
import { computed, ref, provide } from 'vue'
import { X } from 'lucide-vue-next'

const props = defineProps<{
    sidebarClass?: string,
    sidebarStyle?: Record<string, string>,
    sidebarPosition?: 'left' | 'right'
}>()

const positionLeft = computed(() => props.sidebarPosition === 'left')

// Mobile Sidebar State
const isMobileSidebarOpen = ref(false)
const toggleMobileSidebar = () => {
    isMobileSidebarOpen.value = !isMobileSidebarOpen.value
}

// Provide to ToolHeader
provide('mobileSidebar', {
    isOpen: isMobileSidebarOpen,
    toggle: toggleMobileSidebar
})
</script>

<template>
    <div class="flex relative min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 h-screen overflow-hidden">
        
        <!-- Mobile Backdrop -->
        <div v-if="isMobileSidebarOpen" 
             @click="isMobileSidebarOpen = false"
             class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 lg:hidden transition-opacity">
        </div>

        <!-- Sidebar (if Left) -->
        <div v-if="positionLeft" 
             class="fixed inset-y-0 left-0 z-40 bg-white dark:bg-slate-800 shadow-2xl transform transition-transform duration-300 lg:static lg:transform-none lg:shadow-xl lg:z-20 border-r border-slate-200 dark:border-slate-800 shrink-0 flex flex-col max-w-[85vw]"
             :class="[sidebarClass, isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0']"
             :style="sidebarStyle">
             <!-- Mobile Close Button -->
             <button v-if="isMobileSidebarOpen" @click="isMobileSidebarOpen = false" class="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-full lg:hidden z-50 transition-colors">
                 <X class="w-5 h-5" />
             </button>
             <slot name="sidebar"></slot>
        </div>

        <!-- Main -->
        <div class="flex-1 flex flex-col relative bg-grid-pattern overflow-hidden h-full w-full lg:w-auto">
             <slot name="main"></slot>
        </div>

        <!-- Sidebar (if Right - Default) -->
        <div v-if="!positionLeft"
             class="fixed inset-y-0 right-0 z-40 bg-white dark:bg-slate-800 shadow-2xl transform transition-transform duration-300 lg:static lg:transform-none lg:shadow-xl lg:z-20 border-l border-slate-200 dark:border-slate-800 shrink-0 flex flex-col max-w-[85vw]"
             :class="[sidebarClass, isMobileSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0']"
             :style="sidebarStyle">
             <!-- Mobile Close Button -->
             <button v-if="isMobileSidebarOpen" @click="isMobileSidebarOpen = false" class="absolute top-4 left-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-full lg:hidden z-50 shadow-sm border border-slate-200 dark:border-slate-600 transition-colors">
                 <X class="w-5 h-5" />
             </button>
             <slot name="sidebar"></slot>
        </div>

    </div>
</template>
