<script setup lang="ts">
import { computed, ref, provide } from 'vue'
import { useRoute } from 'vue-router'
import { X } from 'lucide-vue-next'
import { TOOLS } from '../../config/tools'

const props = defineProps<{
    sidebarClass?: string,
    sidebarStyle?: Record<string, string>,
    sidebarPosition?: 'left' | 'right'
}>()

// Determine current tool to apply theme override
const route = useRoute()
const currentTool = computed(() => TOOLS.find(t => route.path.startsWith(t.path)))
const toolThemeStyle = computed(() => {
    if (currentTool.value?.themeColors) {
        return {
            '--interactive-01': currentTool.value.themeColors.primary,
            '--interactive-01-hover': currentTool.value.themeColors.hover,
            '--focus': currentTool.value.themeColors.primary 
        } as any
    }
    return {}
})

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
    <div class="flex relative min-h-screen bg-background text-text-primary h-screen overflow-hidden" :style="toolThemeStyle">
        
        <!-- Mobile Backdrop -->
        <div v-if="isMobileSidebarOpen" 
             @click="isMobileSidebarOpen = false"
             class="fixed inset-0 bg-layer-01/50 backdrop-blur-sm z-30 lg:hidden transition-opacity">
        </div>

        <!-- Sidebar (if Left) -->
        <div v-if="positionLeft" 
             class="fixed inset-y-0 left-0 z-40 bg-layer-01 shadow-xl transform transition-transform duration-300 lg:static lg:transform-none lg:shadow-none lg:z-20 border-r border-border-subtle shrink-0 flex flex-col max-w-[85vw]"
             :class="[sidebarClass, isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0']"
             :style="sidebarStyle">
             <!-- Mobile Close Button -->
             <button v-if="isMobileSidebarOpen" @click="isMobileSidebarOpen = false" class="absolute top-4 right-4 p-2 text-text-secondary hover:text-text-primary hover:bg-layer-02 rounded-none lg:hidden z-50 transition-colors">
                 <X class="w-5 h-5" />
             </button>
             <slot name="sidebar"></slot>
        </div>

        <!-- Main -->
        <div class="flex-1 flex flex-col relative bg-background overflow-hidden h-full w-full lg:w-auto">
             <slot name="main"></slot>
        </div>

        <!-- Sidebar (if Right - Default) -->
        <div v-if="!positionLeft"
             class="fixed inset-y-0 right-0 z-40 bg-layer-01 shadow-xl transform transition-transform duration-300 lg:static lg:transform-none lg:shadow-none lg:z-20 border-l border-border-subtle shrink-0 flex flex-col max-w-[85vw]"
             :class="[sidebarClass, isMobileSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0']"
             :style="sidebarStyle">
             <!-- Mobile Close Button -->
             <button v-if="isMobileSidebarOpen" @click="isMobileSidebarOpen = false" class="absolute top-4 left-4 p-2 text-text-secondary hover:text-text-primary hover:bg-layer-02 rounded-none lg:hidden z-50 border border-border-subtle transition-colors">
                 <X class="w-5 h-5" />
             </button>
             <slot name="sidebar"></slot>
        </div>

    </div>
</template>
